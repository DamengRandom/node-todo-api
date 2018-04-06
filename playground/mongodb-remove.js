const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

const id = "5ac32029982f96bdb37a7a83";

Todo.findOneAndRemove({ _id: id }).then((result) => {
  if(result){
    console.log("Find the one and first one which has been removed: ", result);
  }else {
    console.log("Data not found");
  }
});

// Todo.findByIdAndRemove(id).then((result) => {
//   console.log("Remove item/data which found by sepcific ID and remove it: ", result);
// });

// difference between findOneAndRemove and findByIdAndRemove is: 
// findOneAndRemove({ _id: id })
// findByIdAndRemove(id)