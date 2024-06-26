const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('./Client'); // Importez le modèle Client
const Livreur = require('./Livreur'); // Importez le modèle Livreur
const Fournisseur = require('./Fournisseur'); // Importez le modèle Fournisseur

const Commande = sequelize.define('Commande', {
    idCommande: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    idClient: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Client,
            key: 'idClient',
        },
    },
    idLivreur: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Livreur,
            key: 'idLivreur',
        },
    },
    idFournisseur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Fournisseur,
            key: 'idFournisseur',
        },
    },
    dateCommande: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    statut: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prixTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    paiement: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'commande',
    timestamps: false,
});

// Définissez les associations entre Commande, Client, Livreur et Fournisseur
Commande.belongsTo(Client, { foreignKey: 'idClient' });
Commande.belongsTo(Livreur, { foreignKey: 'idLivreur' });
Commande.belongsTo(Fournisseur, { foreignKey: 'idFournisseur' });

module.exports = Commande;