const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize-client');

const PhoneBook = sequelize.define(
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
  {
    underscored: true,
    freezeTableName: true,
  }
);

module.exports = { PhoneBook };
