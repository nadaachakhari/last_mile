const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TypeTiers = sequelize.define('TypeTiers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'type_tiers',
  timestamps: false,
});

module.exports = TypeTiers;
