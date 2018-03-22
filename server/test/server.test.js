const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todos');

beforeEach((done) => {
  Todo.remove({}).then(() => done()); // to ensure db is empty befoire run the test code !!!
}); // before run test code, we do something inside this function 

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
          Todo.find().then((todos) => {
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
})