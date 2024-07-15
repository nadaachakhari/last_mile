
const Order = require('../Models/OrderModel');
const Tiers = require('../Models/TiersModel');
const TypeTiers = require('../Models/TypeTiersModel');
const State = require('../Models/StateModel');
const { Op } = require('sequelize');

const createOrder = async (req, res) => {
    const { code, date, customerID, observation, note, ID_payment_method } = req.body;
    const supplierID = req.user.id; // Utilisateur connecté en tant que fournisseur

    try {
        // Vérifier si le type "client" existe
        const typeClient = await TypeTiers.findOne({ where: { name: 'client' } });
        if (!typeClient) {
            return res.status(400).json({ error: 'Type "client" non trouvé' });
        }

        // Vérifier si le client existe et est de type "client"
        const customer = await Tiers.findOne({
            where: {
                id: customerID,
                type_tiersID: typeClient.id,
                deleted: false,
            },
        });

        if (!customer) {
            return res.status(400).json({ error: 'Client non trouvé' });
        }

        // Trouver l'état "en attente de livraison"
        const pendingState = await State.findOne({
            where: {
                value: 'en attente de livraison',
                deleted: false,
            },
        });

        if (!pendingState) {
            return res.status(400).json({ error: 'État "en attente de livraison" non trouvé' });
        }

        // Créer la commande
        const newOrder = await Order.create({
            code,
            date,
            customerID,
            supplierID,
            observation,
            note,
            ID_payment_method,
            StatesID: pendingState.id,
            deleted: false,
            userID: null // Champ laissé vide pour l'administrateur
        });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createOrder
};
