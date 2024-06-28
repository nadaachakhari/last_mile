const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const sequelize = require('./config/database'); // Importez Sequelize
const fournisseurRoutes = require('./routes/FournisseurRoute'); // Assurez-vous que ce fichier exporte un Router correctement

const app = express();

// Configuration de la base de données MySQL (optionnelle, si vous en avez encore besoin)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // port: process.env.DB_PORT
});

// Connexion à la base de données MySQL (optionnelle, si vous en avez encore besoin)
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données MySQL:', err.stack);
        return;
    }
    console.log('Connecté à la base de données MySQL en tant que ID', db.threadId);
});

// Middleware pour parsing JSON
app.use(express.json());

// Utilisez les routes du fournisseur
app.use('/fournisseurs', fournisseurRoutes); // Assurez-vous d'utiliser la bonne route et vérifiez l'exportation dans FournisseurRoute.js

// Synchronisation des modèles Sequelize
sequelize.sync()
    .then(() => {
        console.log('La connexion à la base de données Sequelize a été établie avec succès.');
    })
    .catch(err => {
        console.error('Impossible de se connecter à la base de données Sequelize:', err);
    });



module.exports = app;
