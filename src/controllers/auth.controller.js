const express = require('express');
const router = express.Router();

const authService = require('../services/auth.service');
const validatorMiddleware = require('../middlewares/validator-middleware');
const { body } = require('express-validator');
const auth = require('../middlewares/auth');

/**
 * @typedef {object} JwtResponse
 * @property {string} status - true
 * @property {string} access_token - Jwt Token
 * @property {string} refresh_token - Refresh Token
 */

/**
 * @typedef {object} LoginBody
 * @property {string} username - Username
 * @property {string} password - Password
 */

/**
 * POST /auth/login
 * @summary Log in
 * @tags Auth
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {LoginBody} request.body.required - Login body
 * @return {JwtResponse} 200 - success response - application/json
 */

router.post(
  '/login',
  validatorMiddleware(
    body('username').isString().isLength({ min: 4, max: 20 }),
    body('password').isString().isLength({ min: 6, max: 16 })
  ),
  async (req, res, next) => {
    try {
      const result = await authService.login(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * POST /auth/refresh
 * @summary Refresh token
 * @tags Auth
 * @security bearerAuth
 * @param {string} lng.header.required - language - enum:en,tr,ae
 * @return {JwtResponse} 200 - success response - application/json
 */
router.post('/refresh', ...auth(), async (req, res, next) => {
  try {
    const result = await authService.refreshToken(req);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
