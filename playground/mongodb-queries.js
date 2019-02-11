
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5c61903f331e0e1cd95354ef';

Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos:', todos);
}); // returns all documents as an arr, if criteria isnt specified.

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo By One:', todo);
}); //returns the document with the matching criteria, as an obj.

Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('Id not found, galat hai id.')
  }
  console.log('Todo By ID:', todo);
}).catch((e) => console.log(e));
