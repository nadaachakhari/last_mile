const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const TypeTiersRoutes = require('./routes/TypeTiersRoute');
const CityRoutes= require('./routes/CityRoute');
const TiersRoutes = require('./routes/TierRoute');
const RoleUsersRoutes = require('./routes/RoleUsersRoute');
const VatRoutes = require('./routes/VatRoute');
const app = express();

// Utiliser CORS
app.use(cors());

// Utiliser body-parser pour parser les requêtes JSON
app.use(bodyParser.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
   // port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données MySQL:', err.stack);
        return;
    }
    console.log('Connecté à la base de données MySQL en tant que ID', db.threadId);
});

// Route de base
app.get('/', (req, res) => {
    res.send('Bonjour, le serveur est opérationnel!');
});

// Routes pour les types de tiers
app.use('/TypeTiers', TypeTiersRoutes);
app.use('/City', CityRoutes);
app.use('/Tier', TiersRoutes);
app.use('/roleUsers', RoleUsersRoutes);
app.use('/Vat', VatRoutes);
// Synchronisation avec Sequelize
sequelize.sync()
    .then(() => {
        console.log('La connexion à la base de données Sequelize a été établie avec succès.');
    })
    .catch(err => {
        console.error('Impossible de se connecter à la base de données Sequelize:', err);
    });

module.exports = app;
