const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize-client');

const PhoneBookNumber = sequelize.define(
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
  {
    underscored: true,
    freezeTableName: true,
  }
);

module.exports = { PhoneBookNumber };
