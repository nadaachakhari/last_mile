const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const City = sequelize.define('City', {
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
  tableName: 'city',
  timestamps: false,
});

module.exports = City;
