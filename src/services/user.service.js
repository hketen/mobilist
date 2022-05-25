const { User } = require('../models');
const _ = require('lodash');
const jwt = require('../utils/jwt');
const GenericError = require('../utils/generic-error');
const cryptoService = require('./crypto.service');

/**
 *
 * @param req
 * @returns {Promise<any>}
 */
async function getUser({ user_id, username }) {
  const where = {};

  if (!_.isEmpty(user_id)) {
    where.user_id = user_id;
  } else if (!_.isEmpty(username)) {
    where.username = username;
  }

  return User.findOne({ where });
}

/**
 *
 * @param req Request
 * @param user User
 * @returns {Promise<{refresh_token: string, access_token: string}>}
 */
async function createUserJwt(req, user) {
  const { access_token, refresh_token } = jwt.createJwt({
    user_id: user.user_id,
    full_name: user.full_name,
  });

  return { access_token, refresh_token };
}

/**
 *
 * @param req
 * @returns {Promise<any>}
 */
async function createUser(req) {
  const { username, full_name, password } = req.body || {};

  const user = await getUser({ username });

  if (user) {
    throw new GenericError(403, 'username_is_exists', 'Username is exists');
  }

  await User.create({
    username,
    full_name,
    password: cryptoService.hashPassword(password),
    is_active: true,
  });

  return {
    status: true,
  };
}

module.exports = {
  getUser,
  createUser,
  createUserJwt,
};
