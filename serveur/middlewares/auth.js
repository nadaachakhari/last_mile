const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Utilisateur = require("../models/UtilisateurModel");
const Livreur = require('../models/LivreurModel');
const Fournisseur = require('../models/FournisseurModel');
require('dotenv').config();

const loggedMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;

        Utilisateur.findByPk(userId).then((user) => {
            if (user) {
                user.getRole().then((role) => {
                    req.auth = {
                        userId: userId,
                        role: role,
                    };
                    next();
                });
            } else {
                res.status(404).json({ error: "Utilisateur non trouvé" });
            }
        });
    } catch (error) {
        res.status(401).json({ error: "Authentification requise" });
    }
};

const checkUserRole = (roles) => {
    return (req, res, next) => {
        try {
            if (req.auth && roles.includes(req.auth.role)) {
                next();
            } else {
                res.status(403).json({ error: "Accès interdit" });
            }
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    };
};

const isAdmin = checkUserRole(["administrateur"]);
const isLivreur = checkUserRole(["livreur"]);
const isFournisseur = checkUserRole(["fournisseur"]);
const isClient = checkUserRole(["client"]);

const login = async (req, res, next) => {
    try {
        const { Email, motDePasse } = req.body;

        const user = await Utilisateur.findOne({ where: { Email: Email } });

        if (!user) {
            return res.status(401).json({ message: "Email incorrect" });
        }

        const validPassword = await bcrypt.compare(motDePasse, user.Mot_de_passe);
        if (!validPassword) {
            return res.status(401).json({ message: "Login ou mot de passe incorrect" });
        }

        const role = await user.getRole();

        if (role === 'livreur') {
            const livreur = await Livreur.findOne({ where: { idUtilisateur: user.idUtilisateur } });
            if (!livreur || livreur.statuts !== 'activer') {
                return res.status(403).json({ message: "Votre compte livreur est désactivé" });
            }
        } else if (role === 'fournisseur') {
            const fournisseur = await Fournisseur.findOne({ where: { idUtilisateur: user.idUtilisateur } });
            if (!fournisseur || fournisseur.statuts !== 'activer') {
                return res.status(403).json({ message: "Votre compte fournisseur est désactivé" });
            }
        }

        const token = jwt.sign({ userId: user.idUtilisateur, role: role }, process.env.RANDOM_TOKEN_SECRET, {
            expiresIn: '24h',
        });

        res.status(200).json({ token: token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    loggedMiddleware,
    checkUserRole,
    isAdmin,
    isLivreur,
    isFournisseur,
    isClient,
    login
};