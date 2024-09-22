const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tiers = require('./TiersModel'); 
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
  id_supplier: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tiers,
      key: 'id',
    },
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  tableName: 'vat',
  timestamps: false,
});
Vat.belongsTo(Tiers, {  as: 'supplier',foreignKey: 'id_supplier' });
module.exports = Vat;
