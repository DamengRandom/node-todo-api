const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 1
};

var token = jwt.sign(data, '123abc')
console.log('Token: ', token);

var decoded = jwt.verify(token, '123abc');
console.log('Decoded: ', decoded);

// var message = "I am user Dameng";
// var hash = SHA256(message).toString();
// console.log("hashed value: ", hash);



// Below code was the explanation of  JWT (JSON WEB TOKEN) !!!!


// var data = {
//   id: 1
// }

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somescret').toString()
// }

// var resultHash = SHA256(JSON.stringify(token.data) + 'somescret').toString();

// if(resultHash === token.hash){
//   console.log("Data was not changed ..");
// }else {
//   console.log("Data was changed, not secure ..");
// }