
// #3 - response.data??
// #4 - delete update on page?
// #5 - id update on page without refresh?


const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const users = {
    users_list :
    [
        {
            id : 'xyz789',
            name: 'Charlie',
            job: 'Janitor',
        },
        {
            id : 'abc123', 
            name: 'Mac',
            job: 'Bouncer',
         },
         {
            id : 'ppp222', 
            name: 'Mac',
            job: 'Professor',
         }, 
         {
            id: 'yat999', 
            name: 'Dee',
            job: 'Aspring actress',
         },
         {
            id: 'zap555', 
            name: 'Dennis',
            job: 'Bartender',
         }
    ]
}

app.use(cors());
app.use(express.json());

//http://localhost:5000/users?name=Mac&&job=Professor
//REST - get user by name and/or job
app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined && job == undefined) {
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    } 
    else if (name == undefined && job != undefined){
        let result = findUserByJob(job);
        result = {users_list: result};
        res.send(result);
    }
    else if (name != undefined && job != undefined) {
        let result = findUserByNameJob(name, job);
        result = {users_list: result};
        res.send(result);
    }
    else {
        res.send(users);
    }
});

// helper functions - get user by name/job
const findUserByName = (name) => {
    return users['users_list'].filter( (user) => user['name'] === name);
}

const findUserByJob = (job) => {
    return users['users_list'].filter( (user) => user['job'] === job);
}

const findUserByNameJob = (name, job) => {
    return users['users_list'].filter( (user) => user['name'] === name && user['job'] === job);
}

// REST  - get user by id
app.get('/users/:id', (req, res) => {
    const id = req.params['id'];
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.').end();
    else {
        result = {users_list: result};
        res.send(result);
    }
})

//helper - get user by id
function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

// REST - POST (send w JSON data)
// ie : 
/* {
        "name" : "Suzie",
        "id" : "aaa111",
        "job" : "Babysitter"
    } */
app.post('/users', (req, res) => {
    const userToAdd = req.body;
    userToAdd.id = idGenerator();
    addUser(userToAdd);
    res.status(201).send(userToAdd).end();
});

// create new user for post
function addUser(user){
    users['users_list'].push(user);
}

// REST - delete by id
app.delete('/users/:id', (req, res) => {
    const id = req.params['id'];
    let result = findUserById(id);
    if (result == undefined)
        res.status(404).send('Resource not found.').end();
    else {
        deleteUserById(id);
        res.status(204).send(users).end();
    }
});

// helper - delete user from user_list
function deleteUserById(id) {
    const user = users['users_list'].find( (user) => user['id'] === id); 
    const indId = users['users_list'].indexOf(user);
    users['users_list'].splice(indId, 1);
}

function idGenerator(){
    let id = (Math.random()+1).toString(36).substring(6);
    while(findUserById(id) !== undefined){
        id = (Math.random()+1).toString(36).substring(6);
    }
    return id;
}

app.listen(port, () => {
    console.log('Example app listening at http://localhost:', port);
});