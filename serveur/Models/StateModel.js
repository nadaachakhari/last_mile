const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const State = sequelize.define('State', {
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
  tableName: 'state',
  timestamps: false,
});

module.exports = State;
