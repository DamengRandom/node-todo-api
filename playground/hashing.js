const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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



// bcrypt js demo: bcrypt is used for hashing password: prevent password displayed as plaintext

var password = 'dameng';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log("Hash value: ", hash);
  });
});

var hashedPassword = `$2a$10$0R9mIwqwqelPW1DwG5jMEe.sslEMsbItL5Ey3RVpnMeKMdsqPxAee`;

bcrypt.compare(password, hashedPassword, (err, result) => { // to compare and get the final result 
  if(result){
    console.log("compared result is: ", result);
  }else {
    console.log("Wrong, value mismatched !!");
  }
});
