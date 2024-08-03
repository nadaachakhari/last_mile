const StatutClaim = require('../Models/StatutClaimModel');

const getStatutClaims = async (req, res, next) => {
    try {
        const statutClaims = await StatutClaim.findAll({
            where: {
                deleted: false
            }
        });
        res.json(statutClaims);
    } catch (error) {
        next(error);
    }
};

const getStatutClaimById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const statutClaim = await StatutClaim.findByPk(id);
        if (!statutClaim) {
            return res.status(404).json({ message: `Statut de réclamation avec l'ID ${id} non trouvé.` });
        }
        res.json(statutClaim);
    } catch (error) {
        next(error);
    }
};
const createStatutClaim = async (req, res) => {
    try {
        const { value } = req.body;
        const newStatutClaim = await StatutClaim.create({ value, deleted: false });
        res.status(201).json(newStatutClaim);
    } catch (error) {
        console.error('Error creating statut_claim:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const updateStatutClaim = async (req, res, next) => {
    const { id } = req.params;
    const { value, deleted } = req.body;
    try {
        const statutClaim = await StatutClaim.findByPk(id);
        if (!statutClaim) {
            return res.status(404).json({ message: `Statut de réclamation avec l'ID ${id} non trouvé.` });
        }
        await statutClaim.update({ value, deleted });
        res.json(statutClaim);
    } catch (error) {
        next(error);
    }
};

const deleteStatutClaim = async (req, res, next) => {
    const { id } = req.params;
    try {
        const statutClaim = await StatutClaim.findByPk(id);
        if (!statutClaim) {
            return res.status(404).json({ message: `Statut de réclamation avec l'ID ${id} non trouvé.` });
        }

        // Mettre à jour la colonne 'deleted' à true
        await statutClaim.update({ deleted: true });

        res.json({ message: `Statut de réclamation avec l'ID ${id} a été marqué comme supprimé.` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStatutClaims,
    getStatutClaimById,
    createStatutClaim,
    updateStatutClaim,
    deleteStatutClaim,
};
