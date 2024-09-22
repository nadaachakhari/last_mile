const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vat = require('./VatModel');
const Category = require('./CategoryModel');
const Tiers = require('./TiersModel'); 

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
    type: DataTypes.DOUBLE(100, 3),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0,
    }
  },
  sale_ttc: {
    type: DataTypes.DOUBLE(100, 3),
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
  id_supplier: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tiers,
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
  timestamps: false,
});

// Define relationships
Article.belongsTo(Vat, { foreignKey: 'vatID' });
Article.belongsTo(Category, { foreignKey: 'categoryID' });
Article.belongsTo(Tiers, {  as: 'supplier',foreignKey: 'id_supplier' });

module.exports = Article;
