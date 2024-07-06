const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StatutClaim = sequelize.define('StatutClaim', {
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
  tableName: 'statutclaim',
  timestamps: false,
});

module.exports = StatutClaim;
