const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilisateur = require('./UtilisateurModel');
const Adresse = require('./AdresseModel');

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
        defaultValue: 'désactiver',
    },
}, {
    tableName: 'livreur',
    timestamps: false,
});


Livreur.belongsTo(Utilisateur, { foreignKey: 'idUtilisateur', as: 'utilisateur' });
Utilisateur.hasOne(Livreur, { foreignKey: 'idUtilisateur' });
//Utilisateur.belongsTo(Adresse, { foreignKey: 'idAdresse', as: 'adresse' });
Utilisateur.belongsTo(Adresse, { foreignKey: 'idAdresse' });
module.exports = Livreur;
