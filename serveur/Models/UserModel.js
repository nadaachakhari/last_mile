const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RoleUser = require('./RoleUserModel');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
  },
  registration_number: {
    type: DataTypes.STRING,
  },
  cin: {
    type: DataTypes.STRING,
  },
  role_usersID: {
    type: DataTypes.INTEGER,
    references: {
      model: RoleUser,
      key: 'id',
    },
  },
  permission: {
    type: DataTypes.STRING,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Define the relationship
User.belongsTo(RoleUser, { foreignKey: 'role_usersID' });
RoleUser.hasMany(User, { foreignKey: 'role_usersID' });

module.exports = User;
