const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('./Client'); // Importez le modèle Client
const Commande = require('./Commande'); // Importez le modèle Commande

const Notification = sequelize.define('Notification', {
    idNotification: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    idClient: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Client,
            key: 'idClient',
        },
    },
    idCommande: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Commande,
            key: 'idCommande',
        },
    },
}, {
    tableName: 'notification',
    timestamps: false,
});

// Définissez les associations entre Notification, Client et Commande
Notification.belongsTo(Client, { foreignKey: 'idClient' });
Notification.belongsTo(Commande, { foreignKey: 'idCommande' });

module.exports = Notification;