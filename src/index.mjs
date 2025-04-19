// creating a server in express
import express, {request, response} from "express";

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
    {id: 1, username: "anson", displayName: 'Anson'},
    {id: 2, username: "jack", displayName: 'Jack'},
    {id: 1, username: "adam", displayName: 'adam'}
]

//Get Request
app.get("/", (request, response) => {
    response.status(201).send({msg: 'Hello, world!'});
});

app.get("/api/users", (req, res)=> {
    res.status(201).send(mockUsers);
})

app.get("/api/products", (req, res) => {
    res.send([
        {id: 123, name: "chicken breast", price: 12.99},
    ]);
});

//ROUTE PARAMS
app.get('/api/users/:id', (req, res) => {
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);
    if(isNaN(parsedId)) return res.status(400).send({msg: 'Bad request. Invalid ID'});

    const findUser = mockUsers.find((user) => user.id === parsedId);
    if(!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

//QUERY PARAMS




























app.listen(PORT, () => {
    console.log(`Running on port http://localhost:${PORT}`);
});


