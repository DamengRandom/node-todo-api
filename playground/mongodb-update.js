const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log("Connection Error: ", err);
  }
  console.log("Connected !");
  const db = client.db('Todo');
  
  db.collection('Todo').findOneAndUpdate({
    _id: new ObjectID("5ab377cde6e6ff84cce503de")
  }, {
    $set: {
      name: "mengchou"
    },
     $inc: {
       age: 1
     }
  }, {
    returnOriginal: false 
  }).then((result) => {
    console.log("Updated result: ", result);
  }, (err) => {
    console.log("Updated failed, because of ", err);
  })

  client.close(); // connection closed for mongodb server
});
