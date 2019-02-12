  var express = require('express');
  var bodyParser = require('body-parser');
  const {ObjectID} = require('mongodb'); //for requiring the id

  var {mongoose} = require('./db/mongoose');
  var {Todo} = require('./models/todo');
  var {user} = require('./models/user');

  var app =  express();

  app.use(bodyParser.json());

  app.post('/todos', (req,res) => {
    var todo = new Todo({
      text: req.body.text
    });

    todo.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  });

  app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
      res.send({todos});
    }, (e) => {
      res.status(400).send(e);
    })
  });

  app.get('/todos/:id', (req,res) => {
    var id = req.params.id;

    //res.send(req.params); -> returns key-value pairs for id:data;
    // validate id
    //send 404, if not valid
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }

      res.send({todo});
    }).catch((e) => {
      res.status(404).send();
    });


  });

  app.listen(8080, ()=> {
    console.log('App listening on port 8080');
  });

  module.exports = {app};


  // var newTodo = new Todo({
  //   text: 'We are just walking different paths.'
  // });
  //
  //
  // newTodo.save().then((doc) => {
  //   console.log('Saved Documents', doc);
  // }, (e) => {
  //   console.log('unable to save');
  // });
