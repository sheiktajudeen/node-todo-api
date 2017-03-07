// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db) => {
  if(err){
    return console.log('Unable to connect mongodb');
  }
  console.log('Connected to Mongo DB server');
  //findOneAndUpdate
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('58be2faf7f84d47c23f9691e')
  // },{
  //   $set: {
  //     completed: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('58be2cc57f84d47c23f9685e')
  },{
    $set:{
      name: 'Aaliyah Sheik'
    },
    $inc:{
      age: -2
    }
  },{
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
  //db.close();
});
