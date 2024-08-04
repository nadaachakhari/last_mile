const Claim = require('../models/ClaimModel');
const Order = require('../models/OrderModel');
const StatutClaim = require('../models/StatutClaimModel');
const Tiers = require('../models/TiersModel');
const { sendEmail } = require('../config/emailConfig');

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

const getAllClaims = async (req, res, next) => {
    const user = req.user;

    if (!user || (user.role !== 'Administrateur' && user.role !== 'client')) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }

    try {
        let claims;

        if (user.role === 'Administrateur') {
            claims = await Claim.findAll({
                include: [
                    {
                        model: Tiers,
                        as: 'Client',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: StatutClaim,
                        as: 'StatutClaim',
                        attributes: ['id', 'value']
                    },
                    {
                        model: Order,
                        as: 'Order',
                        attributes: ['id', 'code', 'date']
                    }
                ]
            });
        } else if (user.role === 'client') {
            claims = await Claim.findAll({
                where: { tiersID: user.id }, // Assurez-vous que tiersID correspond à la clé étrangère vers l'utilisateur (le client)
                include: [
                    {
                        model: Tiers,
                        as: 'Client',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: StatutClaim,
                        as: 'StatutClaim',
                        attributes: ['id', 'value']
                    },
                    {
                        model: Order,
                        as: 'Order',
                        attributes: ['id', 'code', 'date']
                    }
                ]
            });
        } else {
            return res.status(403).json({ error: 'Accès interdit : Utilisateur non autorisé' });
        }

        res.status(200).json(claims);
    } catch (error) {
        next(error);
    }
};


const updateClaim = async (req, res, next) => {
    const { answer, statutID } = req.body;
    const { claimID } = req.params;
    const user = req.user;

    if (!user || user.role !== 'Administrateur') {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }

    try {
        const claim = await Claim.findByPk(claimID, {
            include: [
                { model: Tiers, as: 'Client', attributes: ['email'] },
                { model: StatutClaim, as: 'StatutClaim', attributes: ['value'] }
            ]
        });

        if (!claim) {
            return res.status(404).json({ error: 'Réclamation non trouvée' });
        }

        claim.answer = answer;
        claim.statutID = statutID;

        await claim.save();

        // Envoi de l'email
        const clientEmail = claim.Client.email;
        const statut = await StatutClaim.findByPk(statutID);
        const subject = 'Mise à jour de votre réclamation';
        const text = `Bonjour, votre réclamation a été mise à jour.\n\nNouveau statut: ${statut.value}\nRéponse: ${answer}`;

        await sendEmail(clientEmail, subject, text);

        res.status(200).json(claim);
    } catch (error) {
        console.error('Error details:', error);
        next(error);
    }
};

module.exports = {
    createClaim,
    getAllClaims,
    updateClaim
};
