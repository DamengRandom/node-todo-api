// import modules
var express = require('express');
var bodyParser = require('body-parser'); // body-parser allows us to send json format data to the server 

var { mongoose } = require('./db/mongoose');
// create a model (mongoose model): this is how to save the data into db -> how the json data looks like !!!
var { Todo } = require('./models/todos');
var { User } = require('./models/user');

var app = express();

app.use(bodyParser.json()); // middleware function, to convert data to json format

app.post('/todos', (req, res) => {
  // console.log("todos data: ", req.body);
  var todo = new Todo({
    name: req.body.name,
    age: req.body.age
  });

  todo.save().then((doc) => {
    res.send(doc);
    // console.log("saved data: ", doc);
  }, (err) => {
    res.status(400).send(err);
    // console.log("Error: ", err);
  })
});

// GET /todos data
app.listen(3785, () => {
  console.log("Server is up ..");
});

module.exports = { app }
