const GenericError = require('../utils/generic-error');
const cryptoService = require('./crypto.service');
const userService = require('./user.service');

/**
 *
 * @param req
 * @returns {Promise<*>}
 */
async function login(req) {
  const { username, password } = req.body || {};

  const user = await userService.getUser({ username });

  if (!user) {
    throw new GenericError(400, 'user_not_found', `User not found.`);
  }

  if (!cryptoService.isEqualHashedPassword(password, user.password)) {
    throw new GenericError(400, 'password_wrong', `The password is wrong.`);
  }

  const { access_token, refresh_token } = await userService.createUserJwt(
    req,
    user
  );

  return {
    status: true,
    access_token,
    refresh_token,
  };
}

/**
 *
 * @param req
 * @returns {Promise<void>}
 */
async function refreshToken(req) {
  const user = await userService.getUser({
    user_id: req.AUTH.user_id,
  });

  if (!user) {
    throw new GenericError(400, 'user_not_found', `User not found.`);
  }

  const { access_token, refresh_token } = await userService.createUserJwt(
    req,
    user
  );

  return {
    status: true,
    access_token,
    refresh_token,
  };
}

module.exports = {
  login,
  refreshToken,
};
