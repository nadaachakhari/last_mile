const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Article = require('./ArticleModel'); // Assuming you have defined the Article model
const Vat = require('./VatModel'); // Assuming you have defined the Vat model
const Order = require('./OrderModel'); // Assuming you have defined the Order model

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
  },
  articleID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Article,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sale_ht: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  gross_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  vatID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vat,
      key: 'id',
    },
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
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
