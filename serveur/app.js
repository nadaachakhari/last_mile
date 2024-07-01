const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();
const sequelize = require('./config/database');
const FournisseurRoute = require('./routes/LivreurRoute')


const app = express();


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données MySQL:', err.stack);
        return;
    }
    console.log('Connecté à la base de données MySQL en tant que ID', db.threadId);
});


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Bonjour, le serveur est opérationnel!');
});
app.use('/livreur', FournisseurRoute);

sequelize.sync()
    .then(() => {
        console.log('La connexion à la base de données Sequelize a été établie avec succès.');
    })
    .catch(err => {
        console.error('Impossible de se connecter à la base de données Sequelize:', err);
    });

module.exports = app;