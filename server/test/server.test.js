const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

// import seed mock data
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todo', () => {
  it('should create a new todo', (done) => {
    var name = 'Test name';
    request(app)
      .post('/todos')
      .send({name}) 
      // .send(name) // ensure its object data format 
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(name);
      })
      .end((err, res) => {
        if(err){
          console.log("Test POST TODO Error", done(err));
        }else {
          Todo.find({ name }).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].name).toBe(name);
            done();
          }).catch((err) => {
            return done(err);
          })
        }
      });
  });
  // it("should detect the invalid input for data saving") // will do soon ..
});

describe('GET /todos', () => {
  it('should load todo data', (done) => {
    var name = "Dameng";
    request(app)
      .get('/todos')
      .send({ name })
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
        expect(res.body.todos[0].name).toBe(name);
      })
      .end((err, res) => {
        if(err){
          console.log("Test GET TODO Error", done(err));
        }else {
          // Todo.find({ name }).then((todos) => {
          //   expect(todos.length).toBe(1);
          //   expect(todos[0].name).toBe(name);
          //   done();
          // }).catch((err) => {
          //   return done(err);
          // })
          Todo.find().then((todos) => {
            expect(todos.length).toBe(2);
            expect(todos[0].name).toBe(name);
            done();
          }).catch((err) => {
            return done(err);
          })
        }
      })
  })
});

describe('GET /todos/:id', () => {
  it('should return specific ID todo data', (done) => {
    var name = "Dameng";
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .send({ name })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(name);
      })
      .end(done)
  });
  it('should return 404 when ID not found', (done) => {
    hexId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .end(done)
  });
  it('should return 404 for non-object ids', (done) => {
    request(app)
    .get(`/todos/123123bajsbch`)
    .expect(404)
    .end(done)
  });
});


describe('DELETE /todos/:id', () => {
  it('should remove a specific ID todo data', (done) => {
    var name = "Dameng";
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err){
          console.log("Test whether data has been deleted or not: ", done(err));
        }else {
          Todo.findById(hexId).then((todos) => {
            expect(todos).toBeNull();
            done();
          }).catch((err) => {
            return done(err);
          })
        }
      })
  });
  it('should return 404 when ID not found', (done) => {
    hexId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done)
  });
  it('should return 404 for object id is invalid', (done) => {
    request(app)
    .delete(`/todos/123123bajsbch`)
    .expect(404)
    .end(done)
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a specific ID todo data', (done) => {
    var name = "New Dameng";
    var hexId = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        name
      })
      .expect(200)
      .expect((res) => {
        // console.log("res.body: ", res.body.todo);
        expect(res.body.todo.name).toBe(name);
      })
      .end(done)
  });
});
