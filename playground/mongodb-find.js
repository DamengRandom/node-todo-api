const { MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log("object id: ", obj); // setup id for different object

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log("Connection Error: ", err);
  }
  console.log("Connected !");
  const db = client.db('Todo');
  // db.collection('Todo').find().toArray().then((docs) => {
  // db.collection('Todo').find({ "username": "dachou" }).toArray().then((docs) => {
  db.collection('Todo').find({
    _id: new ObjectID('5ab374066582e1455be9cd6c') // you mus tuse this wrapper to convet the hash to a string and become readable by nodejs function code
  }).toArray().then((docs) => {
    // let specificOne = docs.filter((doc) => {
    //   return doc.name === 'Dameng'
    // });
    // console.log("Find a specific data record: ", specificOne);
    console.log("Data 1 for Todo table: ");
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log("No data has been returned ..");
  });

  db.collection('Todo').find({ // read todo data
    name: 'xiaochou' // you mus tuse this wrapper to convet the hash to a string and become readable by nodejs function code
  }).toArray().then((docs) => {
    // let specificOne = docs.filter((doc) => {
    //   return doc.name === 'Dameng'
    // });
    // console.log("Find a specific data record: ", specificOne);
    console.log("Data 2 for Todo table: ");
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log("No data has been returned ..");
  });

  db.collection('Todo').find().count().then((count) => {
    console.log(`Todos count: `, count);
  },(err) => {
    console.log("No data has been returned ..");
  })
  client.close(); // connection closed for mongodb server
});