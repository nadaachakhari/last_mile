const Order = require('../Models/OrderModel');
const Tiers = require('../Models/TiersModel');
const TypeTiers = require('../Models/TypeTiersModel');
const State = require('../Models/StateModel');
const { Op } = require('sequelize');
const { sendEmail } = require('../config/emailConfig');
const PaymentMethod = require('../Models/PaymentMethodModel');
const OrderState = require('../Models/OrderStateModel');
const OrderLignes = require('../Models/OrderLignesModel')
const Article = require('../Models/ArticleModel.js');
const User = require('../Models/UserModel.js')
const RoleUser = require('../Models/RoleUserModel.js')
const sequelize = require('../config/database')


const createOrder = async (req, res) => {
    const { code, date, customerID, observation, note, ID_payment_method, articles, destination } = req.body;
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
            destination,
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

const getAllOrders = async (req, res) => {
    const user = req.user;
    const supplierID = user.role === 'fournisseur' ? user.id : null;
    const customerID = user.role === 'client' ? user.id : null; // Définir customerID pour les clients

    if (!user || (user.role !== 'Administrateur' && user.role !== 'fournisseur' && user.role !== 'client')) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }

    try {
        // Construire l'objet de condition pour Sequelize
        const conditions = {
            deleted: false,
            ...(supplierID && { supplierID }), // Filtrer par supplierID si l'utilisateur est un fournisseur
            ...(customerID && { customerID })  // Filtrer par customerID si l'utilisateur est un client
        };

        const orders = await Order.findAll({
            where: conditions,
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

        // Sauvegarder les données originales de la commande
        const originalOrderData = {
            code: order.code,
            date: order.date,
            customerID: order.customerID,
            observation: order.observation,
            note: order.note,
            ID_payment_method: order.ID_payment_method,
            total_amount: order.total_amount,
        };

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

        // Obtenir les nouvelles données de la commande pour la comparaison
        const updatedOrderData = {
            code,
            date,
            customerID,
            observation,
            note,
            ID_payment_method,
            total_amount: totalAmount,
        };

        // Générer le message des changements
        const changesMessage = getChangesMessage(originalOrderData, updatedOrderData);

        res.status(200).json({ order, changes: changesMessage });
    } catch (error) {
        await transaction.rollback();
        console.error('Transaction rollback:', error);
        res.status(500).json({ error: error.message });
    }
};

const getOrderWithArticles = async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findOne({
            where: { id: orderId, deleted: false },
            include: [
                { model: Tiers, as: 'customer' },
                { model: Tiers, as: 'supplier' },
            
                { model: PaymentMethod, as: 'PaymentMethod' },
                { model: State, as: 'state' },
                {
                    model: OrderLignes,
                    include: [
                
                        { model: Article, as: 'article' } 
                    ]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: error.message });
    }
};

const getOrderWithoutArticles = async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findOne({
            where: { id: orderId, deleted: false },
            include: [
                { model: Tiers, as: 'customer' },
                { model: Tiers, as: 'supplier' },
              
                { model: PaymentMethod, as: 'PaymentMethod' },
                { model: State, as: 'state' },
                { model: OrderLignes, }
            ]
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: error.message });
    }
};
const getOrderLignesByParentID = async (req, res) => {
    const orderId = req.params.id;

    try {
        const orderLignes = await OrderLignes.findAll({
            where: { parentID: orderId, deleted: false },
            include: [
                { model: Article, as: 'article' }
            ]
        });

        if (!orderLignes.length) {
            return res.status(404).json({ error: 'OrderLignes not found' });
        }

        res.status(200).json(orderLignes);
    } catch (error) {
        console.error('Error fetching order lignes:', error);
        res.status(500).json({ error: error.message });
    }

};
const getOrderWithArticlesAndLines = async (req, res) => {
    const orderId = req.params.orderId;

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
    console.log({ orderId, deliveryPersonId });
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

checkOrderCode = async (req, res) => {
    const { code } = req.params;
  
    try {
      const order = await Order.findOne({ where: { code } });
  
      if (order) {
        return res.status(200).json({ exists: true });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code de commande:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
};
  


const cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    const user = req.user;

    if (!user || (user.role !== 'Administrateur' && user.role !== 'fournisseur')) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié ou non autorisé' });
    }
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }

        const pendingState = await State.findOne({ where: { value: 'En attente de livraison' } });
        if (user.role === 'fournisseur' && order.StatesID !== pendingState.id) {
            return res.status(403).json({ error: 'Accès interdit : Vous ne pouvez annuler que les commandes en attente de livraison' });
        }

        const canceledState = await State.findOne({ where: { value: 'Commande annulée' } });
        if (!canceledState) {
            return res.status(500).json({ error: 'État "Commande annulée" non trouvé dans la base de données' });
        }

        order.StatesID = canceledState.id;
        await order.save();

        res.status(200).json({ message: 'État de la commande mis à jour à "Commande annulée"' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'état de la commande' });
    }
};




module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    getOrderWithoutArticles,
    getOrderWithArticles,
    getOrderLignesByParentID,
    getOrderWithArticlesAndLines,
    assignDeliveryPerson,
    checkOrderCode,
    cancelOrder
};
