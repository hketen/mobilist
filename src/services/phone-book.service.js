const _ = require('lodash');
const moment = require('moment-timezone');
const { PhoneBook, PhoneBookNumber } = require('../models');
const sequelize = require('../utils/sequelize-client');
const paginationOptionGenerator = require('../utils/pagination-option-generator');

async function mapPhoneBook(phoneBook) {
  return {
    ...phoneBook.get({ plain: true }),
    phone_numbers: await PhoneBookNumber.findAll({
      attributes: ['phone_book_number_id', 'label', 'phone_number'],
      where: {
        phone_book_id: phoneBook.phone_book_id,
      },
    }),
  };
}

/**
 *
 * @param req {Request}
 * @returns {Promise<{data: *, status: boolean}>}
 */
async function getPhoneBooks({ pagination, AUTH }) {
  const options = paginationOptionGenerator({
    pagination,
    likeColumns: ['uuid:user_id', 'name', 'surname', 'company_name'],
    where: {
      user_id: AUTH.user_id,
    },
  });

  const count = await PhoneBook.count({
    where: options.where,
  });

  const phoneBooks = await PhoneBook.findAll({
    ...options,
    attributes: ['phone_book_id', 'name', 'surname', 'company_name'],
  });
  const data = await Promise.all(_.map(phoneBooks, mapPhoneBook));

  return {
    status: true,
    count,
    data,
  };
}

/**
 *
 * @param req {Request}
 * @returns {Promise<{data: *, status: boolean}>}
 */
async function getPhoneBook({ params, AUTH }) {
  const phoneBook = await PhoneBook.findOne({
    attributes: ['phone_book_id', 'name', 'surname', 'company_name'],
    where: {
      phone_book_id: params.phone_book_id,
      user_id: AUTH.user_id,
    },
  });

  return {
    status: true,
    data: phoneBook ? await mapPhoneBook(phoneBook) : null,
  };
}

/**
 *
 * @param req {Request}
 * @returns {Promise<{data: *, status: boolean}>}
 */
async function createPhoneBook({ body, AUTH }) {
  const { name, surname, company_name, phone_numbers } = body || {};

  let createdPhoneBook;
  let phoneNumbers;

  await sequelize.transaction(
    {
      autocommit: true,
    },
    async (t) => {
      const opts = {
        transaction: t,
      };

      createdPhoneBook = await PhoneBook.create(
        {
          user_id: AUTH.user_id,
          name,
          surname,
          company_name,
        },
        opts
      );

      phoneNumbers = await Promise.all(
        _.map(phone_numbers, (phone_number) =>
          PhoneBookNumber.create(
            {
              phone_book_id: createdPhoneBook.phone_book_id,
              ...phone_number,
            },
            opts
          )
        )
      );
    }
  );

  return {
    status: true,
    data: {
      ...createdPhoneBook.get({ plain: true }),
      phone_numbers: phoneNumbers,
    },
  };
}

/**
 *
 * @param req {Request}
 * @returns {Promise<{data: *, status: boolean}>}
 */
async function updatePhoneBook({ body, params, AUTH }) {
  const { name, surname, company_name, phone_numbers } = body || {};

  const now = moment.utc().toISOString();

  await sequelize.transaction(
    {
      autocommit: true,
    },
    async (t) => {
      const opts = {
        transaction: t,
      };

      await PhoneBook.update(
        {
          user_id: AUTH.user_id,
          name,
          surname,
          company_name,
          updated_at: now,
        },
        {
          where: {
            phone_book_id: params.phone_book_id,
            user_id: AUTH.user_id,
          },
        },
        opts
      );

      await PhoneBookNumber.destroy(
        {
          where: {
            phone_book_id: params.phone_book_id,
          },
        },
        opts
      );

      await Promise.all(
        _.map(phone_numbers, (phone_number) =>
          PhoneBookNumber.create(
            {
              ...phone_number,
              phone_book_id: params.phone_book_id,
              update_at: now,
            },
            opts
          )
        )
      );
    }
  );

  return {
    status: true,
  };
}

/**
 *
 * @param req {Request}
 * @returns {Promise<{data: *, status: boolean}>}
 */
async function deletePhoneBook({ params }) {
  await sequelize.transaction(
    {
      autocommit: true,
    },
    async (t) => {
      const opts = {
        transaction: t,
      };

      await PhoneBookNumber.destroy(
        {
          where: {
            phone_book_id: params.phone_book_id,
          },
        },
        opts
      );

      await PhoneBook.destroy(
        {
          where: {
            phone_book_id: params.phone_book_id,
          },
        },
        opts
      );
    }
  );

  return {
    status: true,
  };
}

module.exports = {
  getPhoneBooks,
  getPhoneBook,
  createPhoneBook,
  updatePhoneBook,
  deletePhoneBook,
};
