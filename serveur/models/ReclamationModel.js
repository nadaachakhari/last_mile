const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Commande = require('./Commande'); // Importez le modèle Commande

const Reclamation = sequelize.define('Reclamation', {
    idReclamation: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    idCommande: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Commande,
            key: 'idCommande',
        },
    },
    idClient: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Client', // Assurez-vous que le modèle Client est correctement importé ou spécifiez directement 'Client' si déjà défini
            key: 'idClient',
        },
    },
    dateReclamation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    statut: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reponse: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    typeReclamation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    priorite: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'reclamation',
    timestamps: false,
});

// Définissez l'association entre Réclamation et Commande
Reclamation.belongsTo(Commande, { foreignKey: 'idCommande' });

module.exports = Reclamation;