const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose'); 
const { Todo } = require('./../server/models/todo'); 

var id = '5ac208edae55d7a97684a2ed';

if(!ObjectID.isValid(id)){
  console.log("ID Not Valid ...");
}

// Todo.find({ _id: id }).then((todos) => {
//   console.log("todos: ", todos);
// });

// Todo.findOne({ _id: id }).then((todo) => {
//   console.log("todo: ", todo);
// });

Todo.findById(id).then((todo) => { // recommanded
  if(!todo){
    console.log("ID not found");
  }else {
    console.log("Find by ID todo: ", todo);
  }
}).catch((err) => console.log("Error: ", err));