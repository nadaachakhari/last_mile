const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const TypeTiersRoutes = require('./routes/TypeTiersRoute');
const CityRoutes = require('./routes/CityRoute');
const TiersRoutes = require('./routes/TierRoute');
const RoleUsersRoutes = require('./routes/RoleUsersRoute');
const UsersRoutes = require('./routes/UsersRoute')
const VatRoutes = require('./routes/VatRoute');
const CategoryRoutes = require('./routes/CategoryRoute');

const PaymentMethodRoutes = require('./routes/PaymentMethodeRoute')
const StateRoutes = require('./routes/StateRoute')

const AuthRoutes = require('./routes/AuthRoutes');
const ArticleRoutes = require('./routes/ArticleRoute');
const OrderRoutes = require('./routes/OrderRoute')
const OrderStateRoutes = require('./routes/OrderStateRoute')


// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/src/assets/images');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });

const app = express();

// Utiliser CORS
app.use(cors());
app.use(express.json())

// Utiliser body-parser pour parser les requêtes JSON
app.use(bodyParser.json());
// Middleware pour servir les fichiers statiques (comme les photos téléchargées)
app.use('/uploads', express.static('uploads'));

// Connexion à la base de données MySQL
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

// Route de base
app.get('/', (req, res) => {
    res.send('Bonjour, le serveur est opérationnel!');
});

// Routes 
app.use('/TypeTiers', TypeTiersRoutes);
app.use('/City', CityRoutes);
app.use('/Tier', TiersRoutes);
app.use('/roleUsers', RoleUsersRoutes);
app.use('/Users', UsersRoutes);
app.use('/Vat', VatRoutes);
app.use('/Category', CategoryRoutes);

app.use('/PaymentMethode', PaymentMethodRoutes);
app.use('/State', StateRoutes);
app.use('/Authenticate', AuthRoutes);
app.use('/Order', OrderRoutes);
app.use('/OrderState', OrderStateRoutes);


app.use('/Article', ArticleRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../client/src/assets/images')));
app.use('/users_uploads', express.static(path.join(__dirname, '../client/src/assets/images/users')));


// Synchronisation avec Sequelize
sequelize.sync()
    .then(() => {
        console.log('La connexion à la base de données Sequelize a été établie avec succès.');
    })
    .catch(err => {
        console.error('Impossible de se connecter à la base de données Sequelize:', err);
    });

module.exports = app;
