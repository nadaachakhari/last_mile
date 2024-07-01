const Livreur = require('../models/LivreurModel');
const Utilisateur = require('../models/UtilisateurModel');



const getLivreurById = async (req, res) => {
    const { id } = req.params;
    try {
        const livreur = await Livreur.findByPk(id, {
            include: [
                { model: Utilisateur, as: 'utilisateur' }
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
    const { nomUtilisateur, prenomUtilisateur, emailUtilisateur, passwordUtilisateur, statuts } = req.body;

    try {
        // Création de l'utilisateur
        const nouvelUtilisateur = await Utilisateur.create({
            nomUtilisateur,
            prenomUtilisateur,
            emailUtilisateur,
            passwordUtilisateur
        });

        // Création du livreur avec l'id de l'utilisateur créé
        const livreur = await Livreur.create({
            idUtilisateur: nouvelUtilisateur.idUtilisateur,
            statuts
        });

        res.status(201).json(livreur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateLivreur = async (req, res) => {
    const { id } = req.params;
    const { utilisateur, statuts } = req.body;
    try {
        const livreur = await Livreur.findByPk(id, {
            include: [{ model: Utilisateur, as: 'utilisateur' }]
        });

        if (!livreur) {
            res.status(404).json({ message: `Livreur avec l'ID ${id} non trouvé.` });
            return;
        }


        await Utilisateur.update(utilisateur, {
            where: { idUtilisateur: livreur.idUtilisateur }
        });


        livreur.statuts = statuts;
        await livreur.save();

        res.json(livreur);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


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


        await livreur.destroy();


        await Utilisateur.destroy({ where: { idUtilisateur: livreur.idUtilisateur } });

        res.json({ message: `Livreur avec l'ID ${id} supprimé.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getLivreurs = async (req, res) => {
    try {
        const livreurs = await Livreur.findAll({
            include: [
                { model: Utilisateur, as: 'utilisateur' }
            ]
        });
        res.json(livreurs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getLivreurById,
    ajouterLivreur,
    getLivreurs,
    deleteLivreur,
    updateLivreur
};
