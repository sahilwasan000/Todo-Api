const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');

const todos = [{
  text: 'Meet me in Galaxy 3.5'
},{
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
