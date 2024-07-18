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
    validate: {
      notEmpty: {
        msg: 'Le nom du type de tiers ne peut pas être vide.',
      },
      len: {
        args: [2, 255],
        msg: 'Le nom du type de tiers doit faire entre 2 et 255 caractères.',
      },
    },
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
}, {
  tableName: 'type_tiers',
  timestamps: false,
});



module.exports = TypeTiers;
