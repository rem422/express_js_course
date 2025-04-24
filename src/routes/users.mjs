import { Router } from "express";
import { query, validationResult, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import mockUsers from "../utils/constants.mjs";
import resolveIndexByUserId from "../utils/middlewares.mjs";

const router = Router();

//GET REQUEST
router.get(
//Query params
    "/api/users", 
    query("filter")
        .isString()
        .notEmpty()
        .withMessage("Must not be empty")
        .isLength({min: 3, max: 10})
        .withMessage("Must atleast 3 to 10 characters"), 
    (req, res)=> {
    const result = validationResult(req);
    console.log(result);
    const {
        query: {filter, value},
    } = req;
    // when filter & value are undefined
    if(!filter && !value) return res.send(mockUsers);
    if(filter && value) return res.send(
        mockUsers.filter((user) => user[filter].includes(value))
    );
    return res.send(mockUsers);
});

//Route params
router.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

//POST REQUEST
router.post(
    '/api/users', 
    checkSchema(createUserValidationSchema), 
    (req, res) => {
        const result = validationResult(req);
        console.log(result);

        // if there is an error, send the errors
        if(!result.isEmpty()) 
            return res.status(400).send({errors: result.array()});

        const data = matchedData(req);
        const newUser = {id: mockUsers[mockUsers.length -1].id + 1, ...data};
        mockUsers.push(newUser);
        console.log(mockUsers);
        return res.status(201).send(newUser);
});

//PUT REQUEST
router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { 
        body, 
        findUserIndex 
    } = req;
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body};
    return res.sendStatus(200);
});

//PATCH REQUEST
router.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { 
        body, 
        findUserIndex 
    } = req;
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return res.sendStatus(200);
});

//DELETE REQUEST
router.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const {
        findUserIndex,
    } = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});

export default router;