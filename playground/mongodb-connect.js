// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

// var user = {name: 'Sahil', age: 25};
// var {name} = user;
// console.log(name); obj Destructuring

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
    console.log('Connected to the server');
    const db = client.db('TodoApp');

//     db.collection('Todos').insertOne({
//       text: 'You may write something over here.',
//       completed: false
//     }, (err, result) => {
//       if(err){
//         return console.log('Unable to insert in Todo', err);
//       }
//        console.log(JSON.stringify(result.ops, undefined, 2));
//     });
//
//     client.close();
});

// db.collection('Users').insertOne({
//   name: "Sahil",
//   age: 20,
//   location: "India"
// }, (err, result) => {
//       if(err){
//        return console.log('Unable to insert in Todo', err);
//      }
//      console.log(result.ops[0]._id.getTimestamp()); //result.ops is the arr of all documents that get inserted.
//    });//getTimestamp gets the time when note was created
//     client.close();
// });
