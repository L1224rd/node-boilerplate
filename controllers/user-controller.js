const jwt = require('jsonwebtoken');

const { db, auth } = require('../config/firebase');

const UserSimplesNacional = db.ref(`/${process.env.FIREBASE_ACCESS_TOKEN}/users-simples-nacional`);

module.exports = {
  create: async (req, res, next) => {
    try {
      const { email, password, password2 } = req.body;

      if (password !== password2) {
        res.locals.status = 400;
        return next({
          message: 'Passwords don\'t match',
        });
      }

      auth.createUserWithEmailAndPassword(email, password)
        .then(async ({ user }) => {
          await UserSimplesNacional.child(user.uid).set({
            email,
          });

          res.locals.status = 201;

          res.locals.data = {
            user: {
              id: user.uid,
              email: user.email,
            },
            token: jwt.sign({ id: user.uid }, process.env.JWT_TOKEN),
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
      auth.signInWithEmailAndPassword(req.body.email, req.body.password)
        .then(({ user }) => {
          res.locals.data = {
            user: {
              id: user.uid,
              email: user.email,
            },
            token: jwt.sign({ id: user.uid }, process.env.JWT_TOKEN),
          };

          next();
        }).catch((error) => {
          next(error);
        });
    } catch (error) {
      next(error);
    }
  },
  list: async (req, res, next) => {
    try {
      const users = (await UserSimplesNacional.once('value')).val();

      res.locals.data = users;
      next();
    } catch (error) {
      next(error);
    }
  },
  detail: async (req, res, next) => {
    try {
      const user = (await UserSimplesNacional.child(req.params.userId).once('value')).val();

      res.locals.data = user;
      next();
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      if (req.body.email) {
        res.locals.status = 403;
        return next({
          message: 'Change email is not allowed',
        });
      }

      if (req.body.password) {
        res.locals.status = 403;
        return next({
          message: 'Password reset is handled at /api/reset-password',
        });
      }

      await UserSimplesNacional.child(req.params.userId).update(req.body);
      const user = (await UserSimplesNacional.child(req.params.userId).once('value')).val();

      res.locals.data = user;
      next();
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      await UserSimplesNacional.child(req.params.userId).remove();

      res.locals.data = {
        message: 'User removed',
      };
      next();
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      await auth.sendPasswordResetEmail(req.body.email);

      res.locals.data = {
        message: 'Password reset email sent',
      };
      next();
    } catch (error) {
      next(error);
    }
  },
};
