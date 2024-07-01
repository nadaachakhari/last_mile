const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Utilisateur = sequelize.define('Utilisateur', {
    idUtilisateur: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    idAdresse: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'adresse',
            key: 'idAdresse',
        },
    },
    Nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telephone: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    genre: {
        type: DataTypes.ENUM('homme', 'femme'),
        allowNull: false,
    },
}, {
    tableName: 'utilisateur',
    timestamps: false,
});

// Définissez l'association entre Utilisateur et Adresse
Utilisateur.belongsTo(require('./AdresseModel'), { foreignKey: 'idAdresse' });
module.exports = Utilisateur;
