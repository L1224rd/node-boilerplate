const jwt = require('jsonwebtoken');

const { db, auth } = require('../config/firebase');

const User = db.ref(`/${process.env.FIREBASE_ACCESS_TOKEN}/users`);

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
          await User.child(user.uid).set({
            email,
            access: 0,
          });

          res.locals.status = 201;

          res.locals.data = {
            user: {
              id: user.uid,
              email: user.email,
            },
            token: jwt.sign({
              id: user.uid,
            }, process.env.JWT_SECRET, { expiresIn: 60 * 60 }),
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
        .then(async ({ user }) => {
          res.locals.data = {
            user: {
              id: user.uid,
              email: user.email,
            },
            token: jwt.sign({
              id: user.uid,
            }, process.env.JWT_SECRET, { expiresIn: 60 * 60 }),
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
      if (res.locals.user.access < 10) {
        res.locals.status = 403;

        return next({
          message: 'Permission denied',
        });
      }

      console.log(res.locals.user);

      const users = (await User.once('value')).val();

      res.locals.data = users;
      next();
    } catch (error) {
      next(error);
    }
  },
  detail: async (req, res, next) => {
    try {
      if (res.locals.user.access < 10 && res.locals.user.id !== req.params.userId) {
        res.locals.status = 403;

        return next({
          message: 'Permission denied',
        });
      }

      const user = (await User.child(req.params.userId).once('value')).val();

      res.locals.data = user;
      next();
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      if (res.locals.user.access < 10 && res.locals.user.id !== req.params.userId) {
        res.locals.status = 403;

        return next({
          message: 'Permission denied',
        });
      }

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

      await User.child(req.params.userId).update(req.body);
      const user = (await User.child(req.params.userId).once('value')).val();

      res.locals.data = user;
      next();
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      if (res.locals.user.access < 10 && res.locals.user.id !== req.params.userId) {
        res.locals.status = 403;

        return next({
          message: 'Permission denied',
        });
      }

      await User.child(req.params.userId).remove();

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
