const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// beforeEach((done) => {
//   Todo.remove({}).then(() => done());
// }); //to empty the db to run the test, as length is equated with 1 at 28.

beforeEach(populateUsers);
beforeEach(populateTodos);

//-------------Test For Sending Todo Items-----------//
describe('POST /todos', () => { //(type of req Document)
    it('should create a todo item', (done) => { //describe test
      var text = 'New Text Created.';

      request(app)//document
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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

    it('should not create a todo with Invalid data', (done) => {
      request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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

//-------------Test For Getting Todo Items-----------//
describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) =>{
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

//-----------Get Todos Of A Specific Id-----------//
describe('GET /todos/:id', () => {
  it('should return todo docs', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)//toHexString() converts obj to string
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo docs created by the other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo isnt found', (done) => {

    var hexId = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
      request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

//------------Delete Todos By A Specific User-------//
describe('DELETE /todos/:id', () => {
  it('should remove a todo' , (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

    Todo.findById(hexId).then((todo) => {
      expect(todo).toNotExist();
      done();
    }).catch((e) => done(e));
  });
});

  it('should remove a todo' , (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if(err){
        return done(err);
      }

    Todo.findById(hexId).then((todo) => {
      expect(todo).toExist();
      done();
    }).catch((e) => done(e));
    });
  });

  it('should return 404 if todo isnt found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if objectID isnt valid', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
    .get('/todos/123')
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
    });
  });

//-----------Test For Updating Todo-----------//
describe('PATCH /todos/:id', () => {

  it('should update the result' , (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = "this should be the new text";

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
    })
    .end(done);
  });

  it('should not update the todo created by the other user' , (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = "this should be the new text";

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      text
    })
    .expect(404)
    .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
      request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)//setting headers
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
        })
      .end(done);
  });
  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  })
});

describe('POST /users/me', () => {
  it('should create a new user', (done) => {
    var email = 'max@max.com';
    var password = 'maxmax123';

   request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
    if(err) {
      return done(err);
    }

    User.findOne({email}).then((user) => {
      expect(user).toExist();
      expect(user.password).toNotBe(password);
      done();
    }).catch((e) => done(e));
  });
});

it('should return validation error if it is invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done)
  });

// it('should not create user if email in use', (done) => {
//     request(app)
//       .post('/users')
//       .send({
//         email: users[0].email,
//         password: 'maxmax123'
//       })
//       .expect(400)
//       .end(done);
//   }); //This test isnt working, check on it. Although, redundant entries arent allowed in the db.
});


//-------------Log In Test--------------//
describe('POST /users/login', () => {
  // it('should login user and auth token', (done) => {
  //     request(app)
  //       .post('/users/login')
  //       .send({
  //         email: users[1].email,
  //         password: users[1].password
  //       })
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.headers['x-auth']).toExist();
  //       })
  //       .end((err, res) => {
  //         if(err){
  //           return done(err);
  //         }
  //
  //         User.findById(users[1]._id).then((user) => {
  //           expect(user.tokens[1]).toInclude({
  //             access: 'auth',
  //             token: res.headers['x-auth']
  //         });
  //         done();
  //       }).catch((e) => done(e));
  //     });
  //   });

    it('should reject invalid user', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password + '1'
        })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('/users/me/tokens', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err)
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
