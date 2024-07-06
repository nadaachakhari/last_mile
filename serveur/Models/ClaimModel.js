const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./OrderModel'); // Assuming you have defined the Order model
const Tiers = require('./TiersModel'); // Assuming you have defined the Tiers model
const StatutClaim = require('./StatutClaimModel'); // Assuming you have defined the StatutClaim model

const Claim = sequelize.define('Claim', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders', // Adjust 'orders' if your actual table name differs
      key: 'id',
    },
  },
  tiersID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tiers,
      key: 'id',
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  statutID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: StatutClaim,
      key: 'id',
    },
  },
  dateClaim: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  observation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'claim',
  timestamps: false,
});

// Define relationships
Claim.belongsTo(Order, { foreignKey: 'orderID' });
Claim.belongsTo(Tiers, { foreignKey: 'tiersID' });
Claim.belongsTo(StatutClaim, { foreignKey: 'statutID' });

module.exports = Claim;
