var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  name: {
    type: String,
    require: true,
    minlength: 1,
    trim: true
  },
  age: {
    type: Number,
    default: 0
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {
  Todo
}

// var newTodo = new Todo({
//   name: 'Dameng',
//   age: 23
// });

// var newAnotherTodo = new Todo({
//   name: 'wj xiao chou chou',
// });

// newTodo.save().then((doc) => {
//   console.log("Saved: ", doc);
// }, (err) => {
//   console.log("Error: ", err);
// })

// newAnotherTodo.save().then((doc) => {
//   console.log("Saved another todo: ", JSON.stringify(doc, undefined, 2));
// }, (err) => {
//   console.log("Error: ", err);
// });