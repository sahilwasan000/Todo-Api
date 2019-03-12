
var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true, //to check for redundant entries.
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email.'
  }
},
  password:{
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token :{
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};//function responsible for displaying only those properties which are necessary for user to see.

UserSchema.methods.generateAuthToken = function() {  //UserSchema is an obj.
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(),access}, 'abcabc').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
      decoded = jwt.verify(token, 'abcabc');
    }
    catch(e) {
      // return new Promise((resolve,reject) => {
      //   reject();
      // }); simpler version below.
      return Promise.reject();
    }

    return User.findOne({
      '_id':decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
};

//-------------Log In Schema------------//
UserSchema.statics.findByCredentials= function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err,res) => {// compare value of stored pass to input val.
        if(res){
          resolve(user);
        }
        else {
          reject();
        }
      });
    })
  })
};

//-------------User Logout Schema------------//
UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: { //used to pull out a prperty out of an array.
      tokens: {token}
    }
  });
};

//----------Make Something Happen Before a Function Execution------//
UserSchema.pre('save', function (next) {
  var user = this;

  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
      });
    });
  }
  else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
