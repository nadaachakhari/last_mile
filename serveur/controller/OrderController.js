const Order = require('../Models/OrderModel');
const Tiers = require('../Models/TiersModel');
const TypeTiers = require('../Models/TypeTiersModel');
const State = require('../Models/StateModel');
const { Op } = require('sequelize');
const { sendEmail } = require('../config/emailConfig');
const PaymentMethod = require('../Models/PaymentMethodModel');
const OrderState = require('../Models/OrderStateModel');
const OrderLignes = require('../Models/OrderLignesModel');
const Article = require('../Models/ArticleModel.js');

const sequelize = require('../config/database')


const createOrder = async (req, res) => {
    const { code, date, customerID, observation, note, ID_payment_method, articles } = req.body;
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

        let totalAmount = 0;

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
            total_amount: totalAmount, // Initialement 0, sera mis à jour après calcul
        }, { transaction });

        console.log('Order created:', newOrder);

        await OrderState.create({
            orderID: newOrder.id,
            stateID: pendingState.id,
            date: new Date(),
        }, { transaction });

        console.log('OrderState created for orderID:', newOrder.id);

        // Add articles to OrderLignes
        for (const article of articles) {
            const { id, quantity } = article;
            const articleData = await Article.findByPk(id);

            if (!articleData) {
                await transaction.rollback();
                return res.status(400).json({ error: `Article with ID ${id} not found` });
            }

            const sale_ttc = articleData.sale_ttc;
            const gross_amount = quantity * sale_ttc;

            await OrderLignes.create({
                parentID: newOrder.id,
                articleID: id,
                quantity,
                sale_ttc,
                gross_amount,
            }, { transaction });

            totalAmount += gross_amount;
        }

        // Mettre à jour le total_amount dans la commande
        await newOrder.update({ total_amount: totalAmount }, { transaction });

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



const getOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findOne({
            where: { id },
            include: [
                { model: OrderLignes, as: 'orderLignes', include: [Article] },
                { model: Tiers, as: 'customer' },
                { model: Tiers, as: 'supplier' },
                { model: User, as: 'user' },
                { model: PaymentMethod, as: 'PaymentMethod' },
                { model: State, as: 'state' },
            ],
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const getAllOrders = async (req, res) => {
    const user = req.user;
    const supplierID = user && user.role === 'fournisseur' ? user.id : null;

    if (!user || (user.role !== 'Administrateur' && user.role !== 'fournisseur')) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }

    try {
        const whereCondition = user.role === 'fournisseur' ? { supplierID } : {};

        const orders = await Order.findAll({
            where: whereCondition,
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

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(400).json({ error: error.message });
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
    const orderId = req.params.id;
    const { code, date, customerID, observation, note, ID_payment_method, articles } = req.body;
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
        const order = await Order.findOne({
            where: { id: orderId, deleted: false },
            include: [
                { model: OrderLignes }
            ]
        });

        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        let totalAmount = 0;

        await order.update({
            code,
            date,
            customerID,
            supplierID,
            observation,
            note,
            ID_payment_method,
        }, { transaction });

        // Mettre à jour les lignes de commande
        await OrderLignes.destroy({ where: { parentID: orderId }, transaction });

        for (const article of articles) {
            const { id, quantity } = article;
            const articleData = await Article.findByPk(id);

            if (!articleData) {
                await transaction.rollback();
                return res.status(400).json({ error: `Article with ID ${id} not found` });
            }

            const sale_ttc = articleData.sale_ttc;
            const gross_amount = quantity * sale_ttc;

            await OrderLignes.create({
                parentID: orderId,
                articleID: id,
                quantity,
                sale_ttc,
                gross_amount,
            }, { transaction });

            totalAmount += gross_amount;
        }

        // Mettre à jour le total_amount dans la commande
        await order.update({ total_amount: totalAmount }, { transaction });

        await transaction.commit();

        res.status(200).json(order);
    } catch (error) {
        await transaction.rollback();
        console.error('Transaction rollback:', error);
        res.status(500).json({ error: error.message });
    }
};
const getOrderWithArticlesAndLines = async (req, res) => {
    const orderId = req.params.id;

    try {
        // Fetch the order with associated data
        const order = await Order.findOne({
            where: { id: orderId, deleted: false },
            include: [
                { model: Tiers, as: 'customer' },
                { model: Tiers, as: 'supplier' },
                { model: PaymentMethod, as: 'PaymentMethod' },
                { model: State, as: 'state' },
               
            ]
        });

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Fetch the order lines separately for additional verification if needed
        const orderLignes = await OrderLignes.findAll({
            where: { parentID: orderId, deleted: false },
            include: [
                { model: Article, as: 'article' }
            ]
        });

        // Attach the order lines to the order response
        const response = {
            order,
            orderLignes
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching order and order lignes:', error);
        res.status(500).json({ error: error.message });
    }
};


const assignDeliveryPerson = async (req, res) => {
    const { orderId, deliveryPersonId } = req.body;
    const adminID = req.user.id;

    if (!adminID) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié' });
    }

    const user = req.user;
    if (!user || user.role !== 'Administrateur') {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }

    const transaction = await sequelize.transaction();

    try {
        console.log('Transaction start');
        const deliveryState = await State.findOne({
            where: {
                value: 'en cours de livraison',
                deleted: false,
            },
        });

        if (!deliveryState) {
            await transaction.rollback();
            return res.status(400).json({ error: 'État "en cours de livraison" non trouvé' });
        }
        const order = await Order.findOne({
            where: {
                id: orderId,
                deleted: false,
            },
            include: [
                {
                    model: Tiers,
                    as: 'customer',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Tiers,
                    as: 'supplier',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        const deliveryPerson = await User.findOne({
            where: {
                id: deliveryPersonId,
                deleted: false,
                role_usersID: (await RoleUser.findOne({ where: { name: 'livreur' } })).id
            }
        });

        if (!deliveryPerson) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Livreur non trouvé ou rôle incorrect' });
        }
        await order.update({ deliveryID: deliveryPersonId, StatesID: deliveryState.id, adminID }, { transaction });
        await OrderState.create({
            orderID: order.id,
            stateID: deliveryState.id,
            date: new Date(),
        }, { transaction });

        await transaction.commit();
        console.log('Transaction committed');
        const customerEmail = order.customer.email;
        const emailSubject = 'Votre commande est en cours de livraison';
        const emailText = `Bonjour ${order.customer.name},\n\nVotre commande avec le code ${order.code} est maintenant en cours de livraison et sera livrée dans les 3 prochains jours.\n\nCordialement,\nVotre fournisseur.`;

        await sendEmail(customerEmail, emailSubject, emailText);

        res.status(200).json({ message: 'Livreur assigné avec succès' });
    } catch (error) {
        await transaction.rollback();
        console.error('Transaction rollback:', error);
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createOrder,
    getAllOrders,
    updateOrder,
    getOrder,
    getOrderWithoutArticles,
    getOrderWithArticles,
    getOrderLignesByParentID,
    getOrderWithArticlesAndLines
};