const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tiers = require('./TiersModel'); 
const Order = require('./OrderModel'); 
const PaymentMethod = require('./PaymentMethodModel'); 

const Invoice = sequelize.define('Invoice', {
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
  orderID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Order,
      key: 'id',
    },
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
  taxStamp: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: true,
      min: 0,
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
  total_ttc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: true,
      isDecimal: true,
      min: 0, 
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
  total_net: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: true,
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
  tableName: 'invoices',
  timestamps: false,
});

// Define relationships
Invoice.belongsTo(Tiers, { foreignKey: 'tiersID' });
Invoice.belongsTo(Order, { foreignKey: 'orderID' });
Invoice.belongsTo(PaymentMethod, { foreignKey: 'ID_payment_method' });

module.exports = Invoice;
