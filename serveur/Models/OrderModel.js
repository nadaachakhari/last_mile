const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tiers = require('./TiersModel');
const User = require('./UserModel');
const PaymentMethod = require('./PaymentMethodModel');
const State = require('./StateModel');

class Order extends Model {}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    }
  },
  customerID: {
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
  supplierID: {
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
  userID: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  ID_payment_method: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PaymentMethod,
      key: 'id',
    },
    validate: {
      notNull: true,
    }
  },
  StatesID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: State,
      key: 'id',
    },
    validate: {
      notNull: true,
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      isDecimal: true,
      min: 0,
    }
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: false,
});

Order.belongsTo(Tiers, { as: 'customer', foreignKey: 'customerID' });
Order.belongsTo(Tiers, { as: 'supplier', foreignKey: 'supplierID' });
Order.belongsTo(User, { foreignKey: 'userID' });
Order.belongsTo(PaymentMethod, { as: 'PaymentMethod', foreignKey: 'ID_payment_method' });
Order.belongsTo(State, { as: 'state', foreignKey: 'StatesID' });

module.exports = Order;
