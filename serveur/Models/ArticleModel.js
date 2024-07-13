const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vat = require('./VatModel'); // Include Vat model
const Category = require('./CategoryModel'); // Include Category model

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
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
  sale_ht: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sale_ttc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // Allow null initially
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
    defaultValue: false // Ajoutez une valeur par défaut
}
}, {
  tableName: 'articles',
  timestamps: false,
});

// Define relationships
Article.belongsTo(Vat, { foreignKey: 'vatID' });
Article.belongsTo(Category, { foreignKey: 'categoryID' });

module.exports = Article;
