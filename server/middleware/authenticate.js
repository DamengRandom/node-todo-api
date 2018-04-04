var { User } = require('./../models/user');
// get user middleware
var authenticate = (req, res, next) => {
  let token = req.header('x-auth');
  User.findByToken(token).then((user) => {
    if(!user){
      console.log("Error 401: User deos not exist ..");
      return Promise.reject();
    }
    // res.send(user);
    req.user = user;
    req.token = token;
    next(); // we need to call next otherwise the function will stopped and never go to next line and execute
  }).catch((err) => {
    res.status(401).send();
  });
}

module.exports = { authenticate };