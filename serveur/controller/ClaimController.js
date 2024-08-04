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
        const existingClaim = await Claim.findOne({
            where: { orderID },
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

        if (existingClaim) {
            return res.status(400).json({
                message: 'Une réclamation pour cette commande existe déjà.',
                existingClaim
            });
        }

        const statusInProgress = await StatutClaim.findOne({ where: { value: 'réclamation en cours' } });

        if (!statusInProgress) {
            return res.status(404).json({ message: 'Status "réclamation en cours" non trouvé.' });
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
        console.error('Détails de l\'erreur:', error);
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
                where: { tiersID: user.id },
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

const getClaimById = async (req, res, next) => {
    const { orderID } = req.params;
    const user = req.user;

    if (!user || (user.role !== 'Administrateur' && user.role !== 'client')) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }

    try {
        let claim;

        if (user.role === 'Administrateur') {
            claim = await Claim.findOne({
                where: { orderID },
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
            claim = await Claim.findOne({
                where: { orderID, tiersID: user.id },
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
        }

        if (!claim) {
            return res.status(404).json({ message: 'Réclamation non trouvée.' });
        }

        res.status(200).json(claim);
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
    getClaimById,
    updateClaim
};
