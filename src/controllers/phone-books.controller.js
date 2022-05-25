const express = require('express');
const router = express.Router();

const phoneBookService = require('../services/phone-book.service');
const validatorMiddleware = require('../middlewares/validator-middleware');
const { param, body } = require('express-validator');
const paginationMiddleware = require('../middlewares/pagination-middleware');
const auth = require('../middlewares/auth');

/**
 * Phone Book Number Model
 * @typedef {object} PhoneBookNumber
 * @property {string} phone_book_number_id - PhoneBookNumber id (UUID)
 * @property {string} label - Number label
 * @property {string} phone_number - Phone number
 */

/**
 * Phone Book Model
 * @typedef {object} PhoneBook
 * @property {string} phone_book_id - PhoneBook id (UUID)
 * @property {string} name - Name
 * @property {string} surname - Surname
 * @property {string} company_name - Company name
 * @property {array<PhoneBookNumber>} phone_numbers - Phone Numbers
 */

/**
 * @typedef {object} GetPhoneBookListResponse
 * @property {boolean} status - Service status
 * @property {number} count - Total phone books count (included where expression)
 * @property {array<PhoneBook>} data - PhoneBook list
 */

/**
 * GET /phone-books
 * @summary Get phone books
 * @tags PhoneBook
 * @security bearerAuth
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {string} q.query - search text
 * @param {string} filters.query - filters (operator: >=, <=, !~, !=, ~, >, <, =) example: filters=column_name=value|column_name>=value
 * @param {string} order.query - order field - example: created_at:desc
 * @param {number} page.query - get page
 * @param {number} limit.query - per page count
 * @return {GetPhoneBookListResponse} 200 - success response - application/json
 */
router.get('/', ...auth(), paginationMiddleware(), async (req, res, next) => {
  try {
    const result = await phoneBookService.getPhoneBooks(req);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

/**
 * @typedef {object} GetPhoneBookResponse
 * @property {boolean} status - Service status
 * @property {PhoneBook} data - PhoneBook
 */

/**
 * GET /phone-books/{phone_book_id}
 * @summary Get phone book
 * @tags PhoneBook
 * @security bearerAuth
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {string} phone_book_id.path.required - find phone book with UUID
 * @return {GetPhoneBookResponse} 200 - success response - application/json
 */
router.get(
  '/:phone_book_id',
  ...auth(),
  validatorMiddleware(param('phone_book_id').isUUID('4')),
  async (req, res, next) => {
    try {
      const result = await phoneBookService.getPhoneBook(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @typedef {object} CreatePhoneBookResponse
 * @property {boolean} status - Service status
 * @property {PhoneBook} data - Created PhoneBook
 */

/**
 * @typedef {object} CreatePhoneBookNumberBody
 * @property {string} label.body.required - Phone Label
 * @property {string} phone_number.body.required - Phone Number
 */

/**
 * @typedef {object} CreatePhoneBookBody
 * @property {string} name.body.required - Name
 * @property {string} surname.body.required - Surname
 * @property {string} company_name.body.required - Company
 * @property {array<CreatePhoneBookNumberBody>} phone_numbers.body.required
 */

/**
 * POST /phone-books
 * @summary Create phone book
 * @tags PhoneBook
 * @security bearerAuth
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {CreatePhoneBookBody} request.body.required - Create phone body
 * @return {CreatePhoneBookResponse} 200 - success response - application/json
 */
router.post(
  '/',
  ...auth(),
  validatorMiddleware(
    body('name').isString().isLength({ min: 2, max: 50 }),
    body('surname').isString().isLength({ min: 2, max: 50 }),
    body('company_name').isString().isLength({ min: 3, max: 100 }),
    body('phone_numbers[*]label').isString().optional(),
    body('phone_numbers[*]phone_number')
      .isString()
      .isLength({ min: 3, max: 100 })
  ),
  async (req, res, next) => {
    try {
      const result = await phoneBookService.createPhoneBook(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @typedef {object} UpdatePhoneBook
 * @property {boolean} status - Service status
 */

/**
 * @typedef {object} UpdatePhoneBookNumberBody
 * @property {string} phone_book_number_id.body.required - UUID
 * @property {string} label.body.required - Phone Label
 * @property {string} phone_number.body.required - Phone Number
 */

/**
 * @typedef {object} UpdatePhoneBookBody
 * @property {string} name.body.required - Name
 * @property {string} surname.body.required - Surname
 * @property {string} company_name.body.required - Company
 * @property {array<UpdatePhoneBookNumberBody>} phone_numbers.body.required
 */

/**
 * PUT /phone-books/{phone_book_id}
 * @summary Update phone book
 * @tags PhoneBook
 * @security bearerAuth
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {string} phone_book_id.path.required - find phone book with UUID
 * @param {UpdatePhoneBookBody} request.body.required - Update phone book body
 * @return {UpdatePhoneBook} 200 - success response - application/json
 */
router.put(
  '/:phone_book_id',
  ...auth(),
  validatorMiddleware(
    param('phone_book_id').isUUID('4'),
    body('name').isString().isLength({ min: 2, max: 50 }),
    body('surname').isString().isLength({ min: 2, max: 50 }),
    body('company_name').isString().isLength({ min: 3, max: 100 }),
    body('phone_numbers[*]phone_book_number_id').isUUID('4').optional(),
    body('phone_numbers[*]label').isString().optional(),
    body('phone_numbers[*]phone_number')
      .isString()
      .isLength({ min: 3, max: 100 })
  ),
  async (req, res, next) => {
    try {
      const result = await phoneBookService.updatePhoneBook(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @typedef {object} DeletePhoneBook
 * @property {boolean} status - Service status
 */

/**
 * DELETE /phone-books/{phone_book_id}
 * @summary Delete phone book
 * @tags PhoneBook
 * @security bearerAuth
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {string} phone_book_id.path.required - find country
 * @return {DeletePhoneBook} 200 - success response - application/json
 */
router.delete(
  '/:phone_book_id',
  ...auth(),
  validatorMiddleware(param('phone_book_id').isUUID('4')),
  async (req, res, next) => {
    try {
      const result = await phoneBookService.deletePhoneBook(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
