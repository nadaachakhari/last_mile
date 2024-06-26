const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Configuration de la base de données
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
   // port: process.env.DB_PORT
});

// Connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err.stack);
        return;
    }
    console.log('Connecté à la base de données en tant que ID', db.threadId);
});

app.get('/', (req, res) => {
    res.send('Bonjour, le serveur est opérationnel!');
});

module.exports = app;
