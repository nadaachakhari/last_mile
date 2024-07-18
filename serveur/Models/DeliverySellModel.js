const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tiers = require('./TiersModel');
const Order = require('./OrderModel');
const User = require('./UserModel');

const DeliverySell = sequelize.define('DeliverySell', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
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
  total_ht: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: true,
      isDecimal: true,
      min: 0,
    }
  },
  total_ttc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: true,
      isDecimal: true,
      min: 0,
    }
  },
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id',
    },
    validate: {
      notNull: true,
    }
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    validate: {
      notNull: true,
    }
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
    defaultValue: false,
  },
}, {
  tableName: 'delivery_sell',
  timestamps: false,
});

// Définir les relations
DeliverySell.belongsTo(Tiers, { foreignKey: 'tiersID' });
DeliverySell.belongsTo(Order, { foreignKey: 'orderID' });
DeliverySell.belongsTo(User, { foreignKey: 'userID' });

module.exports = DeliverySell;
