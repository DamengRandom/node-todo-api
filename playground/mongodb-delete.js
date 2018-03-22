const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log("Connection Error: ", err);
  }
  console.log("Connected !");
  const db = client.db('Todo');
  
  // deleteMany: delete all the data which satisified with all conditions
  // db.collection('Todo').deleteMany({ name: 'Dameng' }).then((results) => {
  //   console.log("Delete named 'Dameng' data completely ..", results);
  // }, (err) => {
  //   console.log("Error: ", err);
  // });

  // deleteOne: only delete the first one with the same condition
  // db.collection('Todo').deleteOne({ name: 'xiaochou' }).then((result) => {
  //   console.log("Delete named 'xiaochou' data completely ..", result);
  // }, (err) => {
  //   console.log("Error: ", err);
  // });
  
  // findOneDelete: 
  // lastErrorObject: { n: 1 }: 
  db.collection('Todo').findOneAndDelete({ 
    _id: new ObjectID('5ab0fc9de86f460753d92360')
  }).then((result) => {
    console.log("Delete named 'Dameng' data completely ..", result);
  }, (err) => {
    console.log("Error: ", err);
  });
  // db.collection('Todo').findOneAndDelete({ name: 'chouchou' }).then((result) => {
  //   console.log("Delete named 'Dameng' data completely ..", result);
  // }, (err) => {
  //   console.log("Error: ", err);
  // });
  client.close(); // connection closed for mongodb server
});
