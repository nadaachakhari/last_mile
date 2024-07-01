const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./UtilisateurModel');

const Livreur = sequelize.define('Livreur', {
    idLivreur: {
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
    statuts: {
        type: DataTypes.ENUM('activer', 'désactiver'),
        allowNull: false,
    },
}, {
    tableName: 'livreur',
    timestamps: false,
});

// Définissez l'association entre Livreur et Utilisateur
Livreur.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });
Utilisateur.hasMany(Livreur, { foreignKey: 'idUtilisateur' });

module.exports = Livreur;
