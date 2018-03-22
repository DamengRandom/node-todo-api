const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log("object id: ", obj); // setup id for different object

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log("Connection Error: ", err);
  }
  console.log("Connected !");
  const db = client.db('Todo');
  db.collection('Todo').insertOne({
    name: 'Dameng',
    age: 29,
    location: 'Sydney'
  }, (err, result) => {
    if(err){
      return console.log('Unable to insert todo ..', err);
    }
    // console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());
  });
  client.close(); // connection closed for mongodb server
});


// object destructure
// var user = { name: 'dameng', age: 62 };
// var {name} = user; // var name = user.name;
// console.log("anme destructure variabel value: ", name);
