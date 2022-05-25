'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      const opts = {
        transaction: t,
      };

      // country table
      await queryInterface.createTable(
        'user',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT,
          },
          user_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          username: {
            type: DataTypes.STRING(20),
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          full_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
          },
          is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
        },
        opts
      );
      await queryInterface.addIndex('user', ['id', 'user_id'], opts);

      // city table
      await queryInterface.createTable(
        'phone_book',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT,
          },
          phone_book_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          user_id: {
            allowNull: false,
            type: DataTypes.UUID,
          },
          name: {
            allowNull: false,
            type: DataTypes.STRING(50),
          },
          surname: {
            allowNull: true,
            type: DataTypes.STRING(50),
          },
          company_name: {
            allowNull: true,
            type: DataTypes.STRING(100),
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
        },
        opts
      );
      await queryInterface.addIndex(
        'phone_book',
        ['id', 'phone_book_id'],
        opts
      );

      // customer table
      await queryInterface.createTable(
        'phone_book_number',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT,
          },
          phone_book_number_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          phone_book_id: {
            allowNull: false,
            type: DataTypes.UUID,
          },
          label: {
            allowNull: true,
            type: DataTypes.STRING(50),
          },
          phone_number: {
            allowNull: false,
            type: DataTypes.STRING(50),
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
        },
        opts
      );
      await queryInterface.addIndex(
        'phone_book_number',
        ['id', 'phone_book_number_id'],
        opts
      );
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      const opts = {
        transaction: t,
      };

      // remove user table
      await queryInterface.dropTable('user', opts);
      // remove phone book table
      await queryInterface.dropTable('phone_book', opts);
      // remove phone book detail table
      await queryInterface.dropTable('phone_book_number', opts);
    });
  },
};
