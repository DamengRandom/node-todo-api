const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: "damon@gmail.com",
	password: "12341234",
	tokens: [{
		access: "auth",
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'dameng').toString()
	}]
	},{
	_id: userTwoId,
	email: "damon123@test.com",
	password: "12341234",
	tokens: [{
		access: "auth",
		token: jwt.sign({_id: userTwoId, access: 'auth'}, 'dameng').toString()
	}]
}]

const todos = [{
	_id: new ObjectID(),
	name: "Dameng",
	_creator: userOneId
	}, {
	_id: new ObjectID(),
	name: "Xiaochouchou",
	_creator: userTwoId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done()); 
};

// const populateTodos = (done) => {
//   Todo.remove({}).then(() => done()); // to ensure db is empty before run the test code !!!
// }; // before run test code, we do something inside this function

const populateUsers = (done) => {
	User.remove({}).then(() => {
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();
		return Promise.all([userOne, userTwo]);
		// Promise.all([userOne, userTwo]).then(() => { // this line means userOne and userTwo must successfully save into database, then run the next function !!!!
		// 	// done();
		// });
	// });
	}).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };

// Promise.all([userOne, userTwo]).then(() => { // this line means userOne and userTwo must successfully save into database, then run the next function !!!!
// });