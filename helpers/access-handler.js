const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.query.token) {
    res.locals.status = 401;
    return next('Missing token');
  }

  jwt.verify(req.query.token, process.env.SECRET, (error, decoded) => {
    if (error) {
      res.locals.status = 401;
      return next('Invalid token');
    }

    req.userId = decoded.id;

    next();
  });
};
