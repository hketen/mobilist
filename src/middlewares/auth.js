const jwtValidationMiddleware = require('./jwt-validation-middleware');
const refreshControlMiddleware = require('./refresh-control-middleware');
const accessControlMiddleware = require('./access-control-middleware');

/**
 *
 * @param {string|null} permission_code - can_edit_test
 */
const auth = (permission_code = null) => {
  return [
    jwtValidationMiddleware,
    refreshControlMiddleware,
    accessControlMiddleware(permission_code),
  ];
};

module.exports = auth;
