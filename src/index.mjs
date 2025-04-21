// creating a server in express
import express from "express";
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

const app = express();

app.use(express.json());

// MIDDLEWARE
const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

app.use(loggingMiddleware);

const resolveIndexByUserId = (req, res, next) => {
    const {
        params: {id},
    } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.SendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if(findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
}

const PORT = process.env.PORT || 3000;

const mockUsers = [
    {id: 1, username: "anson", displayName: 'Anson'},
    {id: 2, username: "jack", displayName: 'Jack'},
    {id: 3, username: "adam", displayName: 'Adam'},
    {id: 4, username: "tina", displayName: 'Tina'},
    {id: 5, username: "jason", displayName: 'Jason'},
    {id: 6, username: "henry", displayName: 'Henry'},
    {id: 7, username: "marilyn", displayName: 'Marilyn'},
];

//GET REQUEST
app.get("/", (req, res) => {
    res.status(201).send({msg: 'Hello'});
});

//Query params
app.get(
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

app.get("/api/products", (req, res) => {
    res.send([
        {id: 123, name: "chicken breast", price: 12.99},
    ]);
});

//Route params
app.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

//POST REQUEST
app.post('/api/users', checkSchema(createUserValidationSchema), (req, res) => {
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
app.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { 
        body, 
        findUserIndex 
    } = req;
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body};
    return res.sendStatus(200);
});

//PATCH REQUEST
app.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { 
        body, 
        findUserIndex 
    } = req;
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return res.sendStatus(200);
});

//DELETE REQUEST
app.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const {
        findUserIndex,
    } = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});















app.listen(PORT, () => {
    console.log(`Running on port http://localhost:${PORT}`);
});