const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tiers = require('./TiersModel');
const Order = require('./OrderModel');
const PaymentMethod = require('./PaymentMethodModel');
//const InvoiceLignes = require('./InvoiceLignesModel'); // Assurez-vous que ce chemin est correct

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
    type: DataTypes.DOUBLE(100, 3),
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
    type: DataTypes.DOUBLE(100, 3),
    allowNull: false,
    validate: {
      notNull: true,
      isDecimal: true,
      min: 0,
    }
  },
  total_ht: {
    type: DataTypes.DOUBLE(100, 3),
    allowNull: false,
    validate: {
      notNull: true,
      isDecimal: true,
      min: 0,
    }
  },
  total_net: {
    type: DataTypes.DOUBLE(100, 3),
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
Invoice.belongsTo(Tiers, { foreignKey: 'tiersID', as: 'customer' });
Invoice.belongsTo(Order, { foreignKey: 'orderID', as: 'order' });
Invoice.belongsTo(PaymentMethod, { foreignKey: 'ID_payment_method', as: 'paymentMethod' });
//Invoice.hasMany(InvoiceLignes, { foreignKey: 'parentID', as: 'invoiceLines' });

module.exports = Invoice;