const {ObjectID} = require('mongodb');

const mongoose = require('./../server/db/mongoose');
const {Todo} = require('./../server/model/todo');
const {User} = require('./../server/model/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// })

//Todo.findOneAndRemove()
//Todo.findByIdAndRemove()
// Todo.findOneAndRemove({_id: '58bf2dab7f84d47c23f98047'}).then((todo) => {
//
// });
//
// Todo.findByIdAndRemove('58bf2dab7f84d47c23f98047').then((todo) => {
//   console.log(todo);
// });
