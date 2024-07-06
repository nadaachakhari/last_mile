const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tiers = require('./TiersModel'); // Assuming you have defined the Tiers model
const Order = require('./OrderModel'); // Assuming you have defined the Order model
const User = require('./UserModel'); // Assuming you have defined the User model

const DeliverySell = sequelize.define('DeliverySell', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tiersID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tiers,
      key: 'id',
    },
  },
  total_ht: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total_ttc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id',
    },
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  observation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'delivery_sell',
  timestamps: false,
});

// Define relationships
DeliverySell.belongsTo(Tiers, { foreignKey: 'tiersID' });
DeliverySell.belongsTo(Order, { foreignKey: 'orderID' });
DeliverySell.belongsTo(User, { foreignKey: 'userID' });

module.exports = DeliverySell;
