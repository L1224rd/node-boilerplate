const router = require('express').Router();

const requestHandler = require('./helpers/request-handler');
const errorHandler = require('./helpers/error-handler');

const userController = require('./controllers/user-controller');
// const sessionController = require('./controllers/sessionController');
// const empresaController = require('./controllers/empresaController');

router.route('/user')
  .post(userController.create, requestHandler, errorHandler);

router.route('/login')
  .post(userController.login, requestHandler, errorHandler);

module.exports = router;
