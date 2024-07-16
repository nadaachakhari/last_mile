const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vat = require('./VatModel');
const Category = require('./CategoryModel');

const Article = sequelize.define('Article', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  vatID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vat,
      key: 'id',
    },
  },
  sale_ht: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0,
    }
  },
  sale_ttc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: true,
      min: 0,
    }
  },
  categoryID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bar_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
}
}, {
  tableName: 'articles',
  timestamps: true,
});

// Define relationships
Article.belongsTo(Vat, { foreignKey: 'vatID' });
Article.belongsTo(Category, { foreignKey: 'categoryID' });

module.exports = Article;
