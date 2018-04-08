const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
          });
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
          });
        }
      });
  });
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


// test user apis
describe('GET /users/me', () => {
  it('should get user email and password information after api call successfully', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it('should return 401 if authentication is failed', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({}); 
        // equal is to equal the same data type, such as object equals to object, 
        // toBe is usually a specific value, such as string or number
      })
      .end(done); 
  })
});

describe('POST /users', () => {
  it('should return a unique email and password user values', (done) => {
    let email = "damon1@test.com",
        password = "123123123";
    // let hashVal = bcrypt.genSalt(10, (err, salt) => {
    //   bcrypt.hash(password, salt, (err, hash) => {
    //     // console.log("Hash value: ", hash);
    //     return hash;
    //   });
    // });
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        // expect(res.body.password).toBe(hashVal);
        expect(res.headers['x-auth']).toBeTruthy(); // it means toExist()
        expect(res.body._id).toBeTruthy(); // it means toExist()
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err){
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy(); // it means toExist()
          expect(user.password).not.toBe(password);
          done();
        }).catch((err) => {
          return done(err);
        });
      });
  });
  it('should return 401 when account already existed', (done) => {
    let email = "damon1@test.com",
        password = "123123123";
    request(app)
      .post('/users')
      .send({email: users[0].email, password: password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login successfully', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[0].email, 
        password: users[0].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.email).toBeTruthy();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens[0].access).toEqual('auth');
          expect(user.tokens[1].token).toEqual(res.headers['x-auth']);
          done();
        }).catch((e) => console.log("Error: ", done(e)));
      });
  });
  it('should login failed ..', (done) => {
    request(app)
      .post('/users/login')
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should delete token when logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      // .expect((res) => {
      //   expect(res.body.tokens).toEqual(undefined)
      // })
      // .end(done);
      .end((err, res) => {
        if(!res){
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          // console.log(user.tokens);
          expect(user.tokens.length).toBe(0);
          done();
        });
      });
  });
  it('should return 400 when no x-auth value in the header', (done) => {
    request(app)
      .delete('/users/me/token')
      .expect(401)
      .end(done);
  });
})
