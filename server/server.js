require('./config/config');
// import modules
const express = require('express');
const bodyParser = require('body-parser'); // body-parser allows us to send json format data to the server 
const { ObjectID } = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
// create a model (mongoose model): this is how to save the data into db -> how the json data looks like !!!
var { Todo } = require('./models/todos');
var { User } = require('./models/user');

// imported middleware file
var { authenticate } = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

// middleware
app.use(bodyParser.json()); // middleware function, to convert data to json format



// POST /todos data (Create New Data)
app.post('/todos', (req, res) => { 
  // console.log("todos data: ", req.body);
  var todo = new Todo({
    name: req.body.name,
    age: req.body.age
  });

  todo.save().then((doc) => { // .save() store data into db
    res.send(doc);
    // console.log("saved data: ", doc);
  }, (err) => {
    res.status(400).send(err);
    // console.log("Error: ", err);
  })
});

// GET /todos data (Read List data)
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => { // .find() read the data
    console.log("todos: ", todos);
    res.send({todos});
  }, (err) => {
    console.log("Error: ", err);
    res.status(404).send(err);
  });
});

// GET /todos/:id data (Read Detail Data)
app.get('/todos/:id', (req, res) => {
  let id = req.params.id;
  if(!ObjectID.isValid(id)){
    console.log("ID is invalid ..");
    return res.status(404).send();
  }else {
    Todo.findById(id).then((todo) => {
      if(!todo){
        console.log('Data not found ..');
        res.status(404).send(err);
      }else {
        console.log('todo: ', todo);
        res.send(todo);
      }
    }).catch((err) => {
      console.log("Error: ", err);
      res.status(404).send(err);
    });
  }
});

// UPDATE/PUT/PATCH /todos/:id (Update specific Data)
app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'age']);
  if(!ObjectID.isValid(id)){
    console.log("ID is invalid ..");
    return res.status(404).send();
  }else {
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
      if(!todo){
        console.log('Data not found ..');
        res.status(404).send(err);
      }else {
        console.log('updated todo dataa: ', todo);
        res.send({todo}); // remember: must be saved as object data format
      }
    }).catch((err) => {
      console.log("Error: ", err);
      res.status(404).send(err);
    });
  }
});

// DELETE /todos/:id (Delete sepcific todo data)
app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;
  if(!ObjectID.isValid(id)){
    console.log("ID is invalid ..");
    return res.status(404).send();
  }else {
    Todo.findByIdAndRemove(id).then((todo) => {
      if(!todo){
        console.log('Data not found ..');
        res.status(404).send(err);
      }else {
        console.log('removed todo: ', todo);
        res.send(todo);
      }
    }).catch((err) => {
      console.log("Error: ", err);
      res.status(404).send(err);
    });
  }
});



// POST a new user
app.post('/users', (req, res) => {
  // let user = new User({
  //   email: req.body.email,
  //   password: req.body.password
  // });
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => console.log("Error", err));
});



// get user [email, id]
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user); // get the req.user data from `authenticate` middleware
});

app.listen(port, () => {
  console.log(`Server is up with port ${port} ..`);
});

module.exports = { app }
