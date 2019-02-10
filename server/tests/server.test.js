const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done());
}); //to empty the db to run the test, as length is equated with 1 at 28.

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

        Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
    });
});
