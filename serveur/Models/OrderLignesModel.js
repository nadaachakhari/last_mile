const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./OrderModel');
const Article = require('./ArticleModel');

class OrderLignes extends Model { }

OrderLignes.init({
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
  gross_amount: {
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
  sequelize,
  modelName: 'OrderLignes',
  tableName: 'order_lignes',
  timestamps: false,
});

OrderLignes.belongsTo(Order, { as: 'order', foreignKey: 'parentID' });
Order.hasOne(OrderLignes, { foreignKey: 'parentID' });
OrderLignes.belongsTo(Article, { as: 'article', foreignKey: 'articleID' });
Article.hasOne(OrderLignes, { foreignKey: 'articleID' });
module.exports = OrderLignes;
