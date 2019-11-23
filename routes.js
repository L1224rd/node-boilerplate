const router = require('express').Router();

const requestHandler = require('./helpers/request-handler');
const errorHandler = require('./helpers/error-handler');
const accessHandler = require('./helpers/access-handler');

const userController = require('./controllers/user-controller');

router.route('/user')
  .post(userController.create)
  .get(accessHandler, userController.list)
  .all(requestHandler, errorHandler);

router.route('/login')
  .post(userController.login, requestHandler, errorHandler);

router.route('/reset-password')
  .post(userController.resetPassword, requestHandler, errorHandler);

router.route('/user/:userId')
  .all(accessHandler)
  .get(userController.detail)
  .patch(userController.update)
  .delete(userController.remove)
  .all(requestHandler, errorHandler);


module.exports = router;
