require('./config/config');
// import modules
const express = require('express');
const bodyParser = require('body-parser'); // body-parser allows us to send json format data to the server 
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var { mongoose } = require('./db/mongoose');
// create a model (mongoose model): this is how to save the data into db -> how the json data looks like !!!
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

// imported middleware file
var { authenticate } = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

// middleware
app.use(bodyParser.json()); // middleware function, to convert data to json format



// POST /todos data (Create New Data)
app.post('/todos', authenticate, (req, res) => { 
  // console.log("todos data: ", req.body);
  var todo = new Todo({
    name: req.body.name,
    age: req.body.age,
    _creator: req.user._id
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
app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => { // .find() read the data
    console.log("todos: ", todos);
    res.send({todos});
  }, (err) => {
    console.log("Error: ", err);
    res.status(404).send(err);
  });
});

// GET /todos/:id data (Read Detail Data)
app.get('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)){
    console.log("ID is invalid ..");
    return res.status(404).send();
  }else {
    Todo.findOne({
      _id: id,
      _creator: req.user._id
    }).then((todo) => {
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
app.patch('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'age']);
  if(!ObjectID.isValid(id)){
    // console.log("ID is invalid ..");
    return res.status(404).send();
  }else {
    Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    }, {
      $set: body
    }, {
      new: true
    }).then((todo) => {
    // Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
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
app.delete('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)){
    console.log("ID is invalid ..");
    return res.status(404).send();
  }else {
    Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    }).then((todo) => {
    // Todo.findByIdAndRemove(id).then((todo) => {
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
  }, (err) => {
    return res.status(400).send(err);
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => res.status(400).send(err));
});

// get user [email, id]
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user); // get the req.user data from `authenticate` middleware
});

// POST user login
app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  // res.send(body); // send means API returns
  // wrong idea ...
  // var hashPass = ''; 
  // bcrypt.genSalt(10, (err, salt) => {
  //   bcrypt.hash(body.password, err, salt, (err, hash) => {
  //     hashPass = hash;
  //     // return hash;
  //   });
  // });
  // console.log('hash: ', hashPass);  
  User.findByCredentials(body.email, body.password).then((user) => {
    // res.send(user);
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((err) => {
    console.log("Error: ", err);
    res.status(400).send(err);
  });

});

app.delete(`/users/me/token`, authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(401).send();
  });
});


// final listen port and run the app
app.listen(port, () => {
  console.log(`Server is up with port ${port} ..`);
});

module.exports = { app }
