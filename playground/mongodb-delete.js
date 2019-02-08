const {MongoClient, ObjectId} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
    console.log('Connected to the server');
    const db = client.db('TodoApp');

    //deleteMany
    db.collection('Todos').deleteMany({text: 'You may write something over here.'}).then((result) => {
      console.log(result);
    });

    //deleteOne
    db.collection('Todos').deleteOne({text: 'We are just walking different paths.'}).then((result) => {
      console.log(result);// If multiple documents pass this criteria then Only first one to pass is deleted.
    });

    //findOneAndDelete
     db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
       console.log(result); //method that returns the deleted item.
     });

});
