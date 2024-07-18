const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Article = require('./ArticleModel');
const Vat = require('./VatModel'); 
const Order = require('./OrderModel');

const OrderLignes = sequelize.define('OrderLignes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parentID: {
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
  articleID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Article,
      key: 'id',
    },
    validate: {
      notNull: true,
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      min: 1, 
    }
  },
  sale_ht: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: true,
      isDecimal: true, 
      min: 0, 
    }
  },
  gross_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: true,
      isDecimal: true, 
      min: 0, 
    }
  },
  vatID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vat,
      key: 'id',
    },
    validate: {
      notNull: true,
    }
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'order_lignes',
  timestamps: false,
});

// Define relationships
OrderLignes.belongsTo(Order, { foreignKey: 'parentID' });
OrderLignes.belongsTo(Article, { foreignKey: 'articleID' });
OrderLignes.belongsTo(Vat, { foreignKey: 'vatID' });

module.exports = OrderLignes;
