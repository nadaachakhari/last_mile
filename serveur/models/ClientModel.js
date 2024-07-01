const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./UtilisateurModel'); // Importez le modèle Utilisateur

const Client = sequelize.define('Client', {
    idClient: {
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
    tableName: 'client',
    timestamps: false,
});

// Définissez l'association entre Client et Utilisateur
Client.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur' });
Utilisateur.hasOne(Client, { foreignKey: 'idUtilisateur' });

module.exports = Client;
