var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean
      },
  completedAt: {
    type: Number
    },
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true //schema to let todos get associated with a specific user.
    }
});

module.exports = {Todo};
