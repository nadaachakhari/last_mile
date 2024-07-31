const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tiers = require('./TiersModel');
const Order = require('./OrderModel');
const User = require('./UserModel');
const OrderLignes = require('./OrderLignesModel');

const DeliverySell = sequelize.define('DeliverySell', {
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
  total_ht: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    references: {
      model: OrderLignes,
      key: 'id',
    },
    validate: {
      notNull: true,
    }
  },
  total_ttc: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    references: {
      model: OrderLignes,
      key: 'id',
    },
    validate: {
      notNull: true,
    }
  },
  orderID: {
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
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    validate: {
      notNull: true,
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
  destination: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'delivery_sell',
  timestamps: false,
});

// Définir les relations
DeliverySell.belongsTo(Tiers, { foreignKey: 'tiersID', as: 'customer'  });
//DeliverySell.belongsTo(Tiers, { foreignKey: 'tiersID', as: 'supplier'  });
DeliverySell.belongsTo(Order, { foreignKey: 'orderID', as: 'order'  });
DeliverySell.belongsTo(User, { foreignKey: 'userID',as :'delivery' });


/**
 *  deliveryID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },

  

 */
module.exports = DeliverySell;
