  var express = require('express');
  var bodyParser = require('body-parser');

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

  app.listen(8080, ()=> {
    console.log('App listening on port 8080');
  });


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
