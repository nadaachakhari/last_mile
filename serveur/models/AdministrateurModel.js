const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./UtilisateurModel'); // Importez le modèle Utilisateur

const Administrateur = sequelize.define('Administrateur', {
    idAdministrateur: {
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
}, {
    tableName: 'administrateur',
    timestamps: false,
});

// Définissez l'association entre Administrateur et Utilisateur
Administrateur.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });
Utilisateur.hasOne(Administrateur, { foreignKey: 'idUtilisateur' });

module.exports = Administrateur;
