const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bank = sequelize.define('Bank', {
  ref: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'bank',
  timestamps: false,
});

module.exports = Bank;
