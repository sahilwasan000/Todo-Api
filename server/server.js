const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'Meet me in Galaxy 3.5'
},{
  _id: new ObjectID(),
  text: 'Please come fast'
}];

// beforeEach((done) => {
//   Todo.remove({}).then(() => done());
// }); //to empty the db to run the test, as length is equated with 1 at 28.

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => { //(type of req Document)
    it('should create a todo item', (done) => { //describe test
      var text = 'New Text Created.';

      request(app)//document
      .post('/todos')
      .send({text})//data to be send
      .expect(200)//status
      .expect((res) => {
        expect(res.body.text).toBe(text);//check if same data is returned
      })
      .end((err, res) => {
        if (err){
          return done(err); //terminates the fx here only
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
    });

    it('should not create a todo item', (done) => {
      request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err){
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
    });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) =>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});


describe('GET /todos/:id', () => {
  it('should return todo docs', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)//toHexString() converts obj to string
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo isnt found', (done) => {

    var hexId = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
      request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});
