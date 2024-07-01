const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./UtilisateurModel');
const Adresse = require('../models/AdresseModel')

const Fournisseur = sequelize.define('Fournisseur', {
    idFournisseur: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    idUtilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Utilisateur,
            key: 'idUtilisateur',
        },
    },
    matricule: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    secteurActivite: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    siteWeb: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    statuts: {
        type: DataTypes.ENUM('activer', 'désactiver'),
        allowNull: false,
        defaultValue: 'désactiver',
    },
}, {
    tableName: 'fournisseur',
    timestamps: false,
});


Utilisateur.hasOne(Fournisseur, { foreignKey: 'idUtilisateur' });
Utilisateur.belongsTo(Adresse, { foreignKey: 'idAdresse' });
Fournisseur.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur', as: 'utilisateur' });

module.exports = Fournisseur;
