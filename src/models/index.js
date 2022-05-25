'use strict';
/*
 * how to use!
 *
 * for example Customer model in models/customer.js
 *
 * const Customer = require('./customer');
 *
 * module.exports = {
 *   Customer,
 *   ...OtherModels
 * };
 */

const { User } = require('./user');
const { PhoneBook } = require('./phone-book');
const { PhoneBookNumber } = require('./phone-book-number');

PhoneBook.belongsTo(User, {
  as: 'User',
  foreignKey: 'user_id',
  targetKey: 'user_id',
});

PhoneBookNumber.belongsTo(PhoneBook, {
  as: 'PhoneBook',
  foreignKey: 'phone_book_id',
  targetKey: 'phone_book_id',
});

module.exports = {
  User,
  PhoneBook,
  PhoneBookNumber,
};
