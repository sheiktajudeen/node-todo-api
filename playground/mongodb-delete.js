// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) => {
  if(err){
    return console.log('Unable to connect mongodb');
  }
  console.log('Connected to Mongo DB server');
  //deleteMany
  // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });
  //deleteOne
  // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });
  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });
  //deleteMany - Users
  // db.collection('Users').deleteMany({name: 'Nisha'}).then((result) => {
  //   console.log(result);
  // });
  //deleteOne - Users
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID("58be32667f84d47c23f969b2")
  }).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });
  //db.close();
});
