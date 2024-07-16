const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./OrderModel');
const Tiers = require('./TiersModel');
const StatutClaim = require('./StatutClaimModel');

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
      model: 'orders',
      key: 'id',
    },
    validate: {
      notNull: true,
    }
  },
  tiersID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tiers,
      key: 'id',
    },
    validate: {
      notNull: true,
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: true,
    }
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
    validate: {
      notNull: true,
    }
  },
  dateClaim: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: true,
    }
  },
  observation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'claim',
  timestamps: true,
});

// Define relationships
Claim.belongsTo(Order, { foreignKey: 'orderID' });
Claim.belongsTo(Tiers, { foreignKey: 'tiersID' });
Claim.belongsTo(StatutClaim, { foreignKey: 'statutID' });

module.exports = Claim;
