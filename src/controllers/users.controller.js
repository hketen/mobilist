const express = require('express');
const router = express.Router();

const userService = require('../services/user.service');
const validatorMiddleware = require('../middlewares/validator-middleware');
const { body } = require('express-validator');

/**
 * @typedef {object} CreateUserResponse
 * @property {boolean} status - true
 */

/**
 * @typedef {object} CreateUserBody
 * @property {string} full_name - Full name
 * @property {string} username - Username
 * @property {string} password - Password
 */

/**
 * POST /users
 * @summary Create User
 * @tags User
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {CreateUserBody} request.body.required - Create user body
 * @return {CreateUserResponse} 200 - success response - application/json
 */

router.post(
  '/',
  validatorMiddleware(
    body('full_name').isString().isLength({ min: 4, max: 100 }),
    body('username').isString().isLength({ min: 4, max: 20 }),
    body('password').isString().isLength({ min: 6, max: 16 })
  ),
  async (req, res, next) => {
    try {
      const result = await userService.createUser(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
