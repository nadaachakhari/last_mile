const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoleUser = sequelize.define('RoleUser', {
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
  tableName: 'role_users',
  timestamps: false,
});

module.exports = RoleUser;
