const { auth } = require('../config/firebase');

const getToken = require('../config/token');

module.exports = {
  create: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.password2) {
        res.locals.status = 400;
        return next({
          message: 'Passwords don\'t match',
        });
      }

      auth.createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then(({ user }) => {
          res.locals.data = {
            user,
            token: getToken({ id: user.uid }),
          };

          next();
        }).catch((error) => {
          next(error);
        });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const user = await auth.signInWithEmailAndPassword(req.body.email, req.body.password);

      res.locals.data = {
        user,
        token: getToken({ id: user.id }),
      }
    } catch (error) {
      next(error);
    }
  },
};
