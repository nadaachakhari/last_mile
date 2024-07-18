const Order = require('../Models/OrderModel');
const Tiers = require('../Models/TiersModel');
const TypeTiers = require('../Models/TypeTiersModel');
const State = require('../Models/StateModel');
const { Op } = require('sequelize');
const { sendEmail } = require('../config/emailConfig');
const PaymentMethod = require('../Models/PaymentMethodModel');
const OrderState = require('../Models/OrderStateModel');
const sequelize = require('../config/database')


const createOrder = async (req, res) => {
    const { code, date, customerID, observation, note, ID_payment_method } = req.body;
    const supplierID = req.user.id;

    if (!supplierID) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié' });
    }

    const user = req.user;
    if (!user || user.role !== 'fournisseur') {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }

    const transaction = await sequelize.transaction();

    try {
        console.log('Transaction start');

        const typeClient = await TypeTiers.findOne({ where: { name: 'client' } });
        if (!typeClient) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Type "client" non trouvé' });
        }

        const customer = await Tiers.findOne({
            where: {
                id: customerID,
                type_tiersID: typeClient.id,
                deleted: false,
            },
        });

        if (!customer) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Client non trouvé' });
        }

        const pendingState = await State.findOne({
            where: {
                value: 'en attente de livraison',
                deleted: false,
            },
        });

        if (!pendingState) {
            await transaction.rollback();
            return res.status(400).json({ error: 'État "en attente de livraison" non trouvé' });
        }

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
            userID: null,
        }, { transaction });

        console.log('Order created:', newOrder);

        await OrderState.create({
            orderID: newOrder.id,
            stateID: pendingState.id,
            date: new Date(),
        }, { transaction });

        console.log('OrderState created for orderID:', newOrder.id);

        await transaction.commit();
        console.log('Transaction committed');

        const customerEmail = customer.email;
        const emailSubject = 'Nouvelle commande créée';
        const emailText = `Bonjour ${customer.name},\n\nVotre commande avec le code ${code} a été créée avec succès et est en attente de livraison.\n\nCordialement,\nVotre fournisseur.`;

        await sendEmail(customerEmail, emailSubject, emailText);

        res.status(201).json(newOrder);
    } catch (error) {
        await transaction.rollback();
        console.error('Transaction rollback:', error);
        res.status(500).json({ error: error.message });
    }
};
const getAllOrders = async (req, res) => {
    const user = req.user;
    const supplierID = user === 'fournisseur' ? user.id : null;
    console.log(user.role)

    // Vérifie que l'utilisateur est authentifié et est soit fournisseur soit administrateur
    if (!user || (user.role !== 'Administrateur' && user.role !== 'fournisseur')) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }

    try {
        const orders = await Order.findAll({
            //where: { supplierID },
            where: { ...(supplierID && { supplierID }) },
            include: [
                {
                    model: PaymentMethod,
                    as: 'PaymentMethod',
                    attributes: ['id', 'value']
                },
                {
                    model: Tiers,
                    as: 'customer',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Tiers,
                    as: 'supplier',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: State,
                    as: 'state',
                    attributes: ['id', 'value']
                }
            ]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getOrderById = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const supplierID = user === 'fournisseur' ? user.id : null;
    console.log(user.role)

    // Vérifie que l'utilisateur est authentifié et est soit fournisseur soit administrateur
    if (!user || (user.role !== 'Administrateur' && user.role !== 'fournisseur')) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }

    try {
        const order = await Order.findOne({
            //where: { id, supplierID },
            where: { id, ...(supplierID && { supplierID }) },
            include: [
                {
                    model: Tiers,
                    as: 'customer',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: State,
                    as: 'state',
                    attributes: ['id', 'value']
                },
                {
                    model: PaymentMethod,
                    as: 'PaymentMethod',
                    attributes: ['id', 'value']
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const getChangesMessage = (original, updated) => {
    let changes = '';
    for (let key in updated) {
        if (updated[key] && updated[key] !== original[key]) {
            changes += `${key}: ${original[key]} -> ${updated[key]}\n`;
        }
    }
    return changes;
};

const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { code, date, customerID, observation, note, ID_payment_method } = req.body;
    const supplierID = req.user.id;
    if (!supplierID) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié' });
    }

    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        if (order.supplierID !== supplierID) {
            return res.status(403).json({ error: 'Accès interdit : Vous n\'êtes pas autorisé à modifier cette commande' });
        }

        const state = await State.findByPk(order.StatesID);
        if (state.value === 'en attente de livraison') {
            return res.status(400).json({ error: 'La commande ne peut être mise à jour que si elle est "en attente de livraison"' });
        }

        const updatedOrder = {
            code: code || order.code,
            date: date || order.date,
            customerID: customerID || order.customerID,
            observation: observation || order.observation,
            note: note || order.note,
            ID_payment_method: ID_payment_method || order.ID_payment_method
        };

        const changesMessage = getChangesMessage(order, updatedOrder);

        await order.update(updatedOrder);

        const customer = await Tiers.findByPk(order.customerID);
        const emailSubject = 'Mise à jour de votre commande';
        const emailText = `Bonjour ${customer.name},\n\nVotre commande avec le code ${order.code} a été mise à jour. Voici les changements effectués :\n\n${changesMessage}\n\nCordialement,\nVotre fournisseur.`;

        await sendEmail(customer.email, emailSubject, emailText);

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder
};
