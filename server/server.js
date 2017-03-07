var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text:{
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed:{
    type: Boolean,
    default: false
  },
  completedAt:{
    type: Number,
    default: null
  }
});

var User = mongoose.model('User',{
  email:{
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

var newUser = new User({
  email: 's@a.com'
});

newUser.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
},(e) => {
  console.log('Unable to Save', e);
})
// var newTodo = new Todo({
//   text: 'Pick up dinner',
//   completed: false,
//   completedAt: new Date().getHours()
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved Todo', doc);
// }, (e) => {
//   console.log('Unable to save todo', e);
// });