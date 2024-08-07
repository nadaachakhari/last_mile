const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Article = require('./ArticleModel'); 
const Vat = require('./VatModel'); 
const DeliverySell = require('./DeliverySellModel'); 

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
    type: DataTypes.DOUBLE(100, 3),
    allowNull: false,
    validate: {
      notNull: true,
      isDecimal: true,
      min: 0,
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
  sale_ttc: {
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
  tableName: 'delivery_sell_lignes',
  timestamps: false,
});

// Define relationships
DeliverySellLignes.belongsTo(DeliverySell, { foreignKey: 'parentID', as: 'deliverySell'  });
DeliverySellLignes.belongsTo(Article, { foreignKey: 'articleID', as: 'article'  });
DeliverySellLignes.belongsTo(Vat, { foreignKey: 'vatID', as: 'vat'  });



module.exports = DeliverySellLignes;