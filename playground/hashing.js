const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 5
};

var token = jwt.sign(data, 'aaa111');//(data to be encrypted, 'secret')
console.log(token);

var decoded = jwt.verify(token, 'aaa111');//data to be checked, 'original secret'
console.log(`Decoded :`, decoded);


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
