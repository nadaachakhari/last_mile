const Livreur = require('../models/LivreurModel');
const Utilisateur = require('../models/UtilisateurModel');
const Adresse = require('../models/AdresseModel');
const bcrypt = require('bcrypt');



const getLivreurById = async (req, res) => {
    const { id } = req.params;
    try {
        const livreur = await Livreur.findByPk(id, {
            include: [
                { model: Utilisateur, as: 'utilisateur', include: { model: Adresse, as: 'adresse' } }
            ]
        });
        if (!livreur) {
            res.status(404).json({ message: `Livreur avec l'ID ${id} non trouvé.` });
            return;
        }
        res.json(livreur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const ajouterLivreur = async (req, res) => {
    const { utilisateur, adresse, statuts } = req.body;

    try {
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(utilisateur.motDePasse, 10); // 10 est le nombre de salage (salt rounds)

        // Créer l'adresse en premier
        const nouvelleAdresse = await Adresse.create(adresse);

        // Créer l'utilisateur en utilisant l'idAdresse de l'adresse créée
        const nouvelUtilisateur = await Utilisateur.create({
            ...utilisateur,
            Mot_de_passe: hashedPassword, // Utilisation du mot de passe haché
            idAdresse: nouvelleAdresse.idAdresse
        });

        // Créer le livreur avec les références à l'utilisateur
        const nouveauLivreur = await Livreur.create({
            idUtilisateur: nouvelUtilisateur.idUtilisateur,
            statuts
        });

        res.status(201).json(nouveauLivreur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Mettre à jour un livreur par son ID
const updateLivreur = async (req, res) => {
    const { id } = req.params;
    const { utilisateur, adresse, statuts } = req.body;
    try {
        const livreur = await Livreur.findByPk(id, {
            include: [{ model: Utilisateur, as: 'utilisateur' }]
        });

        if (!livreur) {
            res.status(404).json({ message: `Livreur avec l'ID ${id} non trouvé.` });
            return;
        }

        // Mettre à jour l'adresse
        await Adresse.update(adresse, {
            where: { idAdresse: livreur.utilisateur.idAdresse }
        });

        // Mettre à jour l'utilisateur
        await Utilisateur.update(utilisateur, {
            where: { idUtilisateur: livreur.idUtilisateur }
        });

        // Mettre à jour le livreur
        livreur.statuts = statuts;
        await livreur.save();

        res.json(livreur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un livreur par son ID
const deleteLivreur = async (req, res) => {
    const { id } = req.params;
    try {
        const livreur = await Livreur.findByPk(id, {
            include: [{ model: Utilisateur, as: 'utilisateur' }]
        });
        if (!livreur) {
            res.status(404).json({ message: `Livreur avec l'ID ${id} non trouvé.` });
            return;
        }

        // Supprimer le livreur d'abord
        await livreur.destroy();

        // Ensuite, supprimer l'utilisateur et l'adresse associés
        await Utilisateur.destroy({ where: { idUtilisateur: livreur.idUtilisateur } });
        await Adresse.destroy({ where: { idAdresse: livreur.utilisateur.idAdresse } });

        res.json({ message: `Livreur avec l'ID ${id} supprimé.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer tous les livreurs
const getLivreurs = async (req, res) => {
    try {
        const livreurs = await Livreur.findAll({
            include: [
                { model: Utilisateur, as: 'utilisateur', include: { model: Adresse, as: 'adresse' } }
            ]
        });
        res.json(livreurs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour le statut d'un livreur par son ID
const updateStatutLivreur = async (req, res) => {
    const { id } = req.params;
    const { statuts } = req.body; // statut devrait être 'activer' ou 'désactiver'

    if (!['activer', 'désactiver'].includes(statuts)) {
        return res.status(400).json({ error: 'Le statut doit être soit "activer" soit "désactiver".' });
    }

    try {
        const livreur = await Livreur.findByPk(id);
        if (!livreur) {
            return res.status(404).json({ message: `Livreur avec l'ID ${id} non trouvé.` });
        }

        // Mettre à jour le statut
        livreur.statuts = statuts;
        await livreur.save();

        res.json(livreur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getLivreurById,
    ajouterLivreur,
    getLivreurs,
    deleteLivreur,
    updateLivreur,
    updateStatutLivreur
};
