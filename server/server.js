// import modules
var express = require('express');
var bodyParser = require('body-parser'); // body-parser allows us to send json format data to the server 
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
// create a model (mongoose model): this is how to save the data into db -> how the json data looks like !!!
var { Todo } = require('./models/todos');
var { User } = require('./models/user');

var app = express();

const port = process.env.PORT || 3785;

app.use(bodyParser.json()); // middleware function, to convert data to json format

// POST /todos data
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

// GET /todos data
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => { // .find() read the data
    console.log("todos: ", todos);
    res.send({todos});
  }, (err) => {
    console.log("Error: ", err);
    res.status(404).send(err);
  });
});

// GET /todos/:id data
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

app.listen(port, () => {
  console.log(`Server is up with port ${port} ..`);
});

module.exports = { app }
