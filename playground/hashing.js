const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//--------Hashing Passwords and storing to db----------//
var password = 'meowwww22'

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
      console.log(hash);
  });
});//to generate salt of a function, async fx, (no of rounds, (cb))

var hashedPass = '$2a$10$EYeAZz1uujprdVYGaCJAAO9uLfOmJx54GVCj4vXFH84kc49pHFOMC';

bcrypt.compare(password, hashedPass, (err,res) => {// compare value of stored pass to input val.
  console.log(res);
});


//-------------Encrypting Data----------//
// var data = {
//   id: 5
// };
// var token = jwt.sign(data, 'aaa111');//(data to be encrypted, 'secret')
// console.log(token);
//
// var decoded = jwt.verify(token, 'aaa111');//data to be checked, 'original secret'
// console.log(`Decoded :`, decoded);


//<<----------Crypto Function---------->>
// var message = 'Trust me, Earth revolves around Sun.';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hashed Value: ${hash}`);
//
// var data = {
//   id: 5
// }
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// // token.data.id = 6; to verify that data is changed at the user end.
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//   console.log('Verified User. Access Granted');
// }
// else {
//   console.log('Not a Verified User. Arrest Him');
// }
