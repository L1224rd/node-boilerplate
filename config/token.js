const jwt = require('jsonwebtoken');

module.exports = (user) => jwt.sign(user, process.env.JWT_TOKEN);
