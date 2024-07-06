const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Article = require('./ArticleModel'); 
const Vat = require('./VatModel'); 
const Invoice = require('./InvoiceModel'); 

const InvoiceLignes = sequelize.define('InvoiceLignes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Invoice,
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
  sale_ttc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'invoices_lignes',
  timestamps: false,
});

// Define relationships
InvoiceLignes.belongsTo(Invoice, { foreignKey: 'parentID' });
InvoiceLignes.belongsTo(Article, { foreignKey: 'articleID' });
InvoiceLignes.belongsTo(Vat, { foreignKey: 'vatID' });

module.exports = InvoiceLignes;
