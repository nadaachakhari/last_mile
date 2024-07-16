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
    validate: {
      notNull: {
        msg: 'Le nom du rôle est requis.',
      },
      len: {
        args: [1, 50],
        msg: 'Le nom du rôle doit faire entre 1 et 50 caractères.',
      },
    },
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'role_users',
  timestamps: true,
});

module.exports = RoleUser;
