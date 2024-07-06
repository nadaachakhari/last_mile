const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vat = sequelize.define('Vat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  tableName: 'vat',
  timestamps: false,
});

module.exports = Vat;
