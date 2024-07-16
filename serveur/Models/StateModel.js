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
    validate: {
      notNull: {
        msg: 'La valeur de l\'état est requise.',
      },
      len: {
        args: [1, 50],
        msg: 'La valeur de l\'état doit faire entre 1 et 50 caractères.',
      },
    },
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  tableName: 'state',
  timestamps: true,
});

module.exports = State;
