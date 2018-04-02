const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todos');

const todos = [{
  _id: new ObjectID(),
  name: "Dameng"
}, {
  _id: new ObjectID(),
  name: "Xiaochouchou"
}];

// beforeEach((done) => {
//   Todo.remove({}).then(() => done()); // to ensure db is empty before run the test code !!!
// }); // before run test code, we do something inside this function

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done()); 
});

describe('POST /todos', () => {
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
        // console.log("res.body: ", res.body.todos[0]);
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

// (err, res) => {
//   if(err){
//     console.log("Test GET TODO Error", done(err));
//   }else {
//     Todo.find({ name }).then((todos) => {
//       expect(todos.length).toBe(1);
//       expect(todos[0].name).toBe(name);
//       done();
//     }).catch((err) => {
//       return done(err);
//     })
//   }
// }