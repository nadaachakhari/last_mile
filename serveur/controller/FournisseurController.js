const Fournisseur = require('../models/FournisseurModel');
const Utilisateur = require('../models/UtilisateurModel');
const Adresse = require('../models/AdresseModel');

// Récupérer un fournisseur par son ID
const getFournisseurById = async (req, res) => {
    const { id } = req.params;
    try {
        const fournisseur = await Fournisseur.findByPk(id, {
            include: [
                { model: Utilisateur, as: 'utilisateur', include: { model: Adresse, as: 'adresse' } }
            ]
        });
        if (!fournisseur) {
            res.status(404).json({ message: `Fournisseur avec l'ID ${id} non trouvé.` });
            return;
        }
        res.json(fournisseur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ajouter un fournisseur
const ajouterFournisseur = async (req, res) => {
    const { utilisateur, adresse, matricule, secteurActivite, siteWeb, notes, statuts } = req.body;

    try {
        // Créer l'adresse en premier
        const nouvelleAdresse = await Adresse.create(adresse);

        // Créer l'utilisateur en utilisant l'idAdresse de l'adresse créée
        const nouvelUtilisateur = await Utilisateur.create({
            ...utilisateur,
            idAdresse: nouvelleAdresse.idAdresse // Assurez-vous que idAdresse est correctement défini dans UtilisateurModel.js
        });

        // Créer le fournisseur avec les références à l'utilisateur
        const nouveauFournisseur = await Fournisseur.create({
            idUtilisateur: nouvelUtilisateur.idUtilisateur,
            matricule,
            secteurActivite,
            siteWeb,
            notes,
            statuts: 'désactiver'
        });

        res.status(201).json(nouveauFournisseur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un fournisseur par son ID
const updateFournisseur = async (req, res) => {
    const { id } = req.params;
    const { utilisateur, adresse, matricule, secteurActivite, siteWeb, notes, statuts } = req.body;
    try {
        const fournisseur = await Fournisseur.findByPk(id, {
            include: [{ model: Utilisateur, as: 'utilisateur' }]
        });

        if (!fournisseur) {
            res.status(404).json({ message: `Fournisseur avec l'ID ${id} non trouvé.` });
            return;
        }

        // Mettre à jour l'adresse
        await Adresse.update(adresse, {
            where: { idAdresse: fournisseur.utilisateur.idAdresse }
        });

        // Mettre à jour l'utilisateur
        await Utilisateur.update(utilisateur, {
            where: { idUtilisateur: fournisseur.idUtilisateur }
        });

        // Mettre à jour le fournisseur
        fournisseur.matricule = matricule;
        fournisseur.secteurActivite = secteurActivite;
        fournisseur.siteWeb = siteWeb;
        fournisseur.notes = notes;
        fournisseur.statuts = statuts;
        await fournisseur.save();

        res.json(fournisseur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Supprimer un fournisseur par son ID
const deleteFournisseur = async (req, res) => {
    const { id } = req.params;
    try {
        const fournisseur = await Fournisseur.findByPk(id, {
            include: [{ model: Utilisateur, as: 'utilisateur' }]
        });
        if (!fournisseur) {
            res.status(404).json({ message: `Fournisseur avec l'ID ${id} non trouvé.` });
            return;
        }

        // Supprimer le fournisseur d'abord
        await fournisseur.destroy();

        // Ensuite, supprimer l'utilisateur et l'adresse associés
        await Utilisateur.destroy({ where: { idUtilisateur: fournisseur.idUtilisateur } });
        await Adresse.destroy({ where: { idAdresse: fournisseur.utilisateur.idAdresse } });

        res.json({ message: `Fournisseur avec l'ID ${id} supprimé.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Récupérer tous les fournisseurs
const getFournisseurs = async (req, res) => {
    try {
        const fournisseurs = await Fournisseur.findAll({
            include: [
                { model: Utilisateur, as: 'utilisateur', include: { model: Adresse, as: 'adresse' } }
            ]
        });
        res.json(fournisseurs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour le statut d'un fournisseur par son ID
const updateStatutFournisseur = async (req, res) => {
    const { id } = req.params;
    const { statuts } = req.body; // statut devrait être 'activer' ou 'désactiver'

    if (!['activer', 'désactiver'].includes(statuts)) {
        return res.status(400).json({ error: 'Le statut doit être soit "activer" soit "désactiver".' });
    }

    try {
        const fournisseur = await Fournisseur.findByPk(id);
        if (!fournisseur) {
            return res.status(404).json({ message: `Fournisseur avec l'ID ${id} non trouvé.` });
        }

        // Mettre à jour le statut
        fournisseur.statuts = statuts;
        await fournisseur.save();

        res.json(fournisseur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getFournisseurById,
    ajouterFournisseur,
    getFournisseurs,
    deleteFournisseur,
    updateFournisseur,
    updateStatutFournisseur
};