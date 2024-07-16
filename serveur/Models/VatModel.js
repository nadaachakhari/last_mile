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
    validate: {
      notEmpty: {
        msg: 'La valeur du taux de TVA ne peut pas être vide.',
      },
    },
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  tableName: 'vat',
  timestamps: true,
});

module.exports = Vat;
