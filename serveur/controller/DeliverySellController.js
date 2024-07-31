

const DeliverySell = require('../Models/DeliverySellModel');
const DeliverySellLignes = require('../Models/DeliverySellLignesModel');
const Order = require('../Models/OrderModel');
const OrderLignes = require('../Models/OrderLignesModel');
const Tiers = require('../Models/TiersModel');
const User = require('../Models/UserModel');
const Article = require('../Models/ArticleModel');
const Vat = require('../Models/VatModel');



const getDeliveryByOrderID = async (req, res) => {
    const orderID = req.params.orderID;

    try {
        const delivery = await DeliverySell.findOne({
            where: { orderID: orderID },
            include: [
                {
                    model: Order, as: 'order',
                    include: [
                        { model: Tiers, as: 'customer' },
                        { model: Tiers, as: 'supplier' },
                        { model: User, as: 'delivery' }
                    ]
                }
            ]
        });

        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found for this order' });
        }

        const deliveryLines = await DeliverySellLignes.findAll({
            where: { parentID: delivery.id },
            include: [
                { model: Article, as: 'article' },
                { model: Vat, as: 'vat' }
            ]
        });

        const detailedDelivery = {
            ...delivery.toJSON(),
            deliveryLines: deliveryLines
        };

        res.status(200).json(detailedDelivery);
    } catch (error) {
        console.error('Error fetching delivery:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createDeliveryFromOrder = async (req, res) => {
    const orderID = req.params.orderID;

    try {
        const existingDeliverySell = await DeliverySell.findOne({ where: { orderID: orderID } });

        if (existingDeliverySell) {
            return getDeliveryByOrderID(req, res);
        }

        const order = await Order.findOne({
            where: { id: orderID },
            include: [
                { model: Tiers, as: 'customer' },
                { model: Tiers, as: 'supplier' },
                { model: User, as: 'delivery' },
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!order.deliveryID) {
            return res.status(400).json({ message: 'Order does not have a valid deliveryID' });
        }

        const orderLines = await OrderLignes.findAll({
            where: { parentID: order.id },
            include: [
                { model: Article, as: 'article' }
            ]
        });

        // Calculate total_ht and total_ttc
        const deliveryLinesData = await Promise.all(orderLines.map(async (line) => {
            const vatExists = await Vat.findByPk(line.article.vatID);
            if (!vatExists) {
                throw new Error(`VAT ID ${line.article.vatID} not found`);
            }

            const sale_ht = line.quantity * line.article.sale_ht;
            const sale_ttc = line.quantity * line.article.sale_ttc;

            return {
                parentID: null, // This will be updated later
                articleID: line.articleID,
                quantity: line.quantity,
                sale_ht: sale_ht,
                gross_amount: line.gross_amount,
                vatID: line.article.vatID,
                sale_ttc: sale_ttc,
                deleted: false,
            };
        }));

        const total_ht = deliveryLinesData.reduce((acc, line) => acc + line.sale_ht, 0);
        const total_ttc = deliveryLinesData.reduce((acc, line) => acc + line.sale_ttc, 0);

        // Create delivery
        const deliveryData = {
            code: `DEL-${Date.now()}`,
            date: new Date(),
            tiersID: order.customerID,
            orderID: order.id,
            userID: order.deliveryID,
            observation: order.observation || '',
            note: order.note || '',
            destination: order.destination || '',
            total_ht: total_ht,
            total_ttc: total_ttc,
            deleted: false,
        };

        const delivery = await DeliverySell.create(deliveryData);

        // Update deliveryLinesData with the new delivery ID and bulk create
        await DeliverySellLignes.bulkCreate(deliveryLinesData.map(line => ({
            ...line,
            parentID: delivery.id
        })));

        const customer = await Tiers.findByPk(order.customerID);
        const supplier = await Tiers.findByPk(order.supplierID);
        const user = await User.findByPk(order.deliveryID);

        const deliveryLinesDetailed = await Promise.all(deliveryLinesData.map(async (line) => {
            const article = await Article.findByPk(line.articleID);
            const vat = await Vat.findByPk(line.vatID);
            return {
                ...line,
                article: article,
                vat: vat
            };
        }));

        const detailedDelivery = {
            ...delivery.toJSON(),
            customer: customer,
            supplier: supplier,
            user: user,
            deliveryLines: deliveryLinesDetailed
        };

        res.status(201).json(detailedDelivery);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};






module.exports = {
    createDeliveryFromOrder,
    getDeliveryByOrderID
};
