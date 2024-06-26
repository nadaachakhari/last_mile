const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Adresse = sequelize.define('Adresse', {
    idAdresse: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numeroRue: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nomRue: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    complementAdresse: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    codePostal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ville: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'adresse',
    timestamps: false,
});

module.exports = Adresse;
