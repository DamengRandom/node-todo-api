var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // this is mongoose version of Promise method (third party lib)
mongoose.connect('mongodb://localhost:27017/Todos');

module.exports = {
  mongoose
}

// mongoose <=> mongoose: mongoose