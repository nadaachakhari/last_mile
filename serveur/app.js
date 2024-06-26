const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const sequelize = require('./config/database'); // Importez Sequelize

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

// Test route
app.get('/', (req, res) => {
    res.send('Bonjour, le serveur est opérationnel!');
});

// Synchronisation des modèles Sequelize
sequelize.sync()
    .then(() => {
        console.log('La connexion à la base de données Sequelize a été établie avec succès.');
    })
    .catch(err => {
        console.error('Impossible de se connecter à la base de données Sequelize:', err);
    });

module.exports = app;
