const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp'); // above 2 lines helps to connect to db.

module.exports = {mongoose};
