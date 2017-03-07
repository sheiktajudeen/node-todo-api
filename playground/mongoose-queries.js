const {ObjectID} = require('mongodb');

const mongoose = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {User} = require('./../server/model/user');
// var id = '58bee4e819b419065dcd24aa111';
//
// if(!ObjectID.isValid(id)){
//   console.log('Id not valid');
// }
//
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos ', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo ', todo);
// });

// Todo.findById(id).then((todo) => {
//   if(!todo)
//   {
//     return console.log('Id not found');
//   }
//   console.log('Todo ', todo);
// }).catch((e) => {
//   console.log(e);
// });
var id = '58be472dcf041478552c8650';

User.findById(id).then((user) => {
  if(!user){
    return console.log('User not found');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));
