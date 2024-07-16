const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./OrderModel');
const Tiers = require('./TiersModel');
const PaymentMethod = require('./PaymentMethodModel');
const Bank = require('./BankModel'); 

const Regulations = sequelize.define('Regulations', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
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
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  ID_payment_method: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PaymentMethod,
      key: 'id',
    },
  },
  bankID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Bank,
      key: 'ref',
    },
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  tableName: 'regulations',
  timestamps: true,
});

// Define relationships
Regulations.belongsTo(Order, { foreignKey: 'orderID' });
Regulations.belongsTo(Tiers, { foreignKey: 'tiersID' });
Regulations.belongsTo(PaymentMethod, { foreignKey: 'ID_payment_method' });
Regulations.belongsTo(Bank, { foreignKey: 'bankID' });

module.exports = Regulations;
