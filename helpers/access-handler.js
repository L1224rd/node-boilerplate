const jwt = require('jsonwebtoken');

const { db } = require('../config/firebase');

const User = db.ref(`/${process.env.FIREBASE_ACCESS_TOKEN}/users`);

module.exports = (req, res, next) => {
  if (!req.query.token) {
    res.locals.status = 401;
    return next({
      message: 'Missing token',
    });
  }

  jwt.verify(req.query.token, process.env.JWT_TOKEN, async (error, decoded) => {
    if (error) {
      console.log(error);
      res.locals.status = 401;
      return next({
        message: 'Invalid token',
      });
    }

    const currentUser = (await User.child(decoded.id).once('value')).val();

    res.locals.user = {
      id: decoded.id,
      access: currentUser.access,
    };

    next();
  });
};
