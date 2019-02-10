const {MongoClient, ObjectId} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
    console.log('Connected to the server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({completed: false}).toArray().then((docs) => { //point 6
    db.collection('Todos').find({_id: new ObjectId('5c5cefa7afb7d10436d62ade')//call a todo with a specific id.
    }).toArray().then((docs) => {
      console.log('Todos');
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log('Unable to connect to MongoDB server');
    });
});

db.collection('Todos').find().count().then((count) => { //promises
  console.log(`Todos Count : ${count}`);
}, (err) => {
  console.log('Unable to connect to MongoDB server');
});

//db.close();
});
