const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur'); // Importez le modèle Utilisateur

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
}, {
    tableName: 'fournisseur',
    timestamps: false,
});

// Définissez l'association entre Fournisseur et Utilisateur
Fournisseur.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });
Utilisateur.hasOne(Fournisseur, { foreignKey: 'idUtilisateur' });

module.exports = Fournisseur;
