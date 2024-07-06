const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Article = require('./ArticleModel'); // Assuming you have defined the Article model
const Vat = require('./VatModel'); // Assuming you have defined the Vat model
const DeliverySell = require('./DeliverySellModel'); // Assuming you have defined the DeliverySell model

const DeliverySellLignes = sequelize.define('DeliverySellLignes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  parentID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DeliverySell,
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
  tableName: 'delivery_sell_lignes',
  timestamps: false,
});

// Define relationships
DeliverySellLignes.belongsTo(DeliverySell, { foreignKey: 'parentID' });
DeliverySellLignes.belongsTo(Article, { foreignKey: 'articleID' });
DeliverySellLignes.belongsTo(Vat, { foreignKey: 'vatID' });

module.exports = DeliverySellLignes;
