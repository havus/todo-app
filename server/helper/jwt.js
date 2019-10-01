const dotenv = require('dotenv').config({ path: __dirname+'/../.env' });
const jwt = require('jsonwebtoken');

module.exports = {
  jwtSign: function(obj) {
    return jwt.sign(obj, process.env.JWT_TOKEN_SALT);
  },
  jwtVerify: function(str) {
    return jwt.verify(str, process.env.JWT_TOKEN_SALT);
  }
}