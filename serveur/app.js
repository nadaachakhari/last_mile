const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importer cors
const bodyParser = require('body-parser'); // Importer body-parser
require('dotenv').config();
const sequelize = require('./config/database');
const LivreurRoute = require('./routes/LivreurRoute'); // Assurez-vous d'importer vos routes correctement
const fournisseurRoutes = require('./routes/FournisseurRoute');

const app = express();

// Utiliser CORS
app.use(cors());

// Utiliser body-parser pour parser les requêtes JSON
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    //port: process.env.DB_PORT
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

app.use('/livreur', LivreurRoute);
app.use('/fournisseurs', fournisseurRoutes);

sequelize.sync()
    .then(() => {
        console.log('La connexion à la base de données Sequelize a été établie avec succès.');
    })
    .catch(err => {
        console.error('Impossible de se connecter à la base de données Sequelize:', err);
    });

module.exports = app;
