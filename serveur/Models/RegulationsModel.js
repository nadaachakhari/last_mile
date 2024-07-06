const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./OrderModel'); // Assuming you have defined the Order model
const Tiers = require('./TiersModel'); // Assuming you have defined the Tiers model
const PaymentMethod = require('./PaymentMethodModel'); // Assuming you have defined the PaymentMethod model
const Bank = require('./BankModel'); // Assuming you have defined the Bank model

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
  },
}, {
  tableName: 'regulations',
  timestamps: false,
});

// Define relationships
Regulations.belongsTo(Order, { foreignKey: 'orderID' });
Regulations.belongsTo(Tiers, { foreignKey: 'tiersID' });
Regulations.belongsTo(PaymentMethod, { foreignKey: 'ID_payment_method' });
Regulations.belongsTo(Bank, { foreignKey: 'bankID' });

module.exports = Regulations;
