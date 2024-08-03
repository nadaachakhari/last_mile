const Claim = require('../models/ClaimModel');
const StatutClaim = require('../models/StatutClaimModel');

const createClaim = async (req, res, next) => {
    const { description, observation } = req.body;
    const { orderID } = req.params;
    const user = req.user;
    
    if (!user || user.role !== 'client') {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }

    try {
        const statusInProgress = await StatutClaim.findOne({ where: { value: 'réclamation en cours' } });

        if (!statusInProgress) {
            return res.status(404).json({ message: 'Status "réclamation en cours" not found.' });
        }

        const newClaim = await Claim.create({
            orderID,
            tiersID: user.id, 
            description,
            statutID: statusInProgress.id,
            dateClaim: new Date(),
            observation,
        });

        res.status(201).json(newClaim);
    } catch (error) {
        console.error('Error details:', error);
        next(error);
    }
};

module.exports = {
    createClaim,
};
