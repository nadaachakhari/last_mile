const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const City = require('./CityModel'); // Supposons que vous avez déjà défini le modèle City
const TypeTiers = require('./TypeTiersModel');

const Tiers = sequelize.define('Tiers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type_tiersID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'TypeTiers', 
      key: 'id',
    },
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postal_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  country: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fax: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cityID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: City,
      key: 'id',
    },
  },
  block: {
    type: DataTypes.STRING,
    allowNull: true,
  },
    password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'tiers',
  timestamps: false,
});

// Définir la relation avec TypeTiers
Tiers.belongsTo(TypeTiers, { foreignKey: 'type_tiersID' });
Tiers.belongsTo(City, { foreignKey: 'cityID' });

module.exports = Tiers;
