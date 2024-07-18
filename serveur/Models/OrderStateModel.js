// Exemple de définition de modèle pour OrderState
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
  timestamps: false,
});

// Définir les relations
OrderState.belongsTo(Order, { as: 'Order', foreignKey: 'orderID' });
Order.hasOne(OrderState, { foreignKey: 'orderID' });
OrderState.belongsTo(State, { as: 'State', foreignKey: 'stateID' });
State.hasOne(OrderState, { foreignKey: 'stateID' });

module.exports = OrderState;
