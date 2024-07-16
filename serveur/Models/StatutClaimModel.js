const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StatutClaim = sequelize.define('StatutClaim', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'La valeur du statut de réclamation est requise.',
      },
      len: {
        args: [1, 50],
        msg: 'La valeur du statut de réclamation doit faire entre 1 et 50 caractères.',
      },
    },
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  tableName: 'statutclaim',
  timestamps: true,
});

module.exports = StatutClaim;
