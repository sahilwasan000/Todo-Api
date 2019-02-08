const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
    console.log('Connected to the server');
    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({
      _id: ObjectId('5c5d9449afb7d10436d651f3')
    }, {
      $set: {
        completed: false
      }
    }, {
      returnOriginal: false
    }).then((result) => {
      console.log(result);
    });


    db.collection('Users').findOneAndUpdate({
      _id: ObjectId('5c5c8667ced4982bb6be475b')
    }, {
      $set: {
        name: 'Milan'
      },
      $inc: {
        age: 2
      }
    }, {
      returnOriginal: false
    }).then((result) => {
      console.log(result);
    });

    //db.close();
});
