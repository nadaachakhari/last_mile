const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./OrderModel');
const State = require('./StateModel');

const OrderState = sequelize.define('OrderState', {
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
  stateID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: State,
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true, 
    }
  },
}, {
  tableName: 'order_state',
  timestamps: true,
});

// Define relationships
OrderState.belongsTo(Order, { foreignKey: 'orderID' });
OrderState.belongsTo(State, { foreignKey: 'stateID' });

module.exports = OrderState;
