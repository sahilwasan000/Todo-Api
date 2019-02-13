const {objectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {user} = require('./../server/models/user');

//removes all
Todo.remove({}).then((result) => {
  console.log(result);
});

//can take id as only i/p
Todo.findByIdAndRemove('5c647cb666ca2d3eff717875').then((todo) => {
  console.log(todo);
});

//can delete todo by some other criteria also
Todo.findByOneAndRemove('5c647cb666ca2d3eff717875').then((todo) => {
  console.log(todo);
});
