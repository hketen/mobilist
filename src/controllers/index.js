const healthy = require('./healthy.controller');
const userController = require('./users.controller');
const authController = require('./auth.controller');
const phoneBookController = require('./phone-books.controller');

/**
 *
 * @param app {Application}
 */
module.exports = (app) => {
  app.use('/', healthy);
  app.use('/users', userController);
  app.use('/auth', authController);
  app.use('/phone-books', phoneBookController);
};
