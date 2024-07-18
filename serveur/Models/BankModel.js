const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bank = sequelize.define('Bank', {
  ref: {
    type: DataTypes.STRING,
    primaryKey: true,
    validate: {
      notEmpty: true,
    }
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  tableName: 'bank',
  timestamps: false,
});

module.exports = Bank;
