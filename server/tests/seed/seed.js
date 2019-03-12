//-----------Seeding Data-------------//

const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');

const jwt = require('jsonwebtoken');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'sahil@abc.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abcabc').toString()
  }]
}, {
  _id: userTwoId,
  email: 'marksdown@gmail.com',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abcabc').toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'Meet me in Galaxy 3.5',
  _creator: userOneId
},{
  _id: new ObjectID(),
  text: 'Please come fast',
  _creator: userTwoId
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
