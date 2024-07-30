
// const DeliverySell = require('../Models/DeliverySellModel');
// const DeliverySellLignes = require('../Models/DeliverySellLignesModel');
// const Order = require('../Models/OrderModel');
// const OrderLignes = require('../Models/OrderLignesModel');
// const Tiers = require('../Models/TiersModel');
// const User = require('../Models/UserModel');
// const Article = require('../Models/ArticleModel');
// const Vat = require('../Models/VatModel');

// const createDeliveryFromOrder = async (req, res) => {
//     const orderID = req.params.orderID;

//     try {
//         // Check if a DeliverySell already exists for this orderID
//         const existingDeliverySell = await DeliverySell.findOne({ where: { orderID: orderID } });

//         if (existingDeliverySell) {
//             // Option 1: Return the existing DeliverySell
//             return res.status(200).json(existingDeliverySell);

//             // Option 2: Update the existing DeliverySell (if applicable)
//             // await existingDeliverySell.update({
//             //     // update fields as needed
//             // });
//             // return res.status(200).json(existingDeliverySell);
//         }

//         const order = await Order.findOne({
//             where: { id: orderID },
//             include: [
//                 { model: Tiers, as: 'customer' },
//                 { model: Tiers, as: 'supplier' },
//                 { model: User, as: 'delivery' }
//             ]
//         });

//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Ensure deliveryID is not null
//         if (!order.deliveryID) {
//             return res.status(400).json({ message: 'Order does not have a valid deliveryID' });
//         }

//         const deliveryData = {
//             code: `DEL-${Date.now()}`,
//             date: new Date(),
//             tiersID: order.customerID,
//             orderID: order.id,
//             userID: order.deliveryID,
//             observation: order.observation || '',
//             note: order.note || '',
//             total_ht: order.total_amount,
//             total_ttc: order.total_amount,
//             deleted: false,
//         };

//         const delivery = await DeliverySell.create(deliveryData);

//         const orderLines = await OrderLignes.findAll({
//             where: { parentID: order.id },
//             include: [
//                 { model: Article, as: 'article' }
//             ]
//         });

//         const deliveryLinesData = await Promise.all(orderLines.map(async (line) => {
//             const vatExists = await Vat.findByPk(line.article.vatID);
//             if (!vatExists) {
//                 throw new Error(`VAT ID ${line.article.vatID} not found`);
//             }

//             return {
//                 parentID: delivery.id,
//                 articleID: line.articleID,
//                 quantity: line.quantity,
//                 sale_ht: line.gross_amount,
//                 gross_amount: line.gross_amount,
//                 vatID: line.article.vatID,
//                 sale_ttc: line.gross_amount,
//                 deleted: false,
//             };
//         }));

//         await DeliverySellLignes.bulkCreate(deliveryLinesData);

//         const customer = await Tiers.findByPk(order.customerID);
//         const supplier = await Tiers.findByPk(order.supplierID);
//         const user = await User.findByPk(order.deliveryID);

//         const deliveryLinesDetailed = await Promise.all(deliveryLinesData.map(async (line) => {
//             const article = await Article.findByPk(line.articleID);
//             const vat = await Vat.findByPk(line.vatID);
//             return {
//                 ...line,
//                 article: article,
//                 vat: vat
//             };
//         }));

//         const detailedDelivery = {
//             ...delivery.toJSON(),
//             customer: customer,
//             supplier: supplier,
//             user: user,
//             deliveryLines: deliveryLinesDetailed
//         };

//         res.status(201).json(detailedDelivery);
//     } catch (error) {
//         console.error('Error details:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const getDeliveryByOrderID = async (req, res) => {
//     const orderID = req.params.orderID;

//     try {
//         // Rechercher la livraison associée à l'ID de la commande
//         const delivery = await DeliverySell.findOne({
//             where: { orderID: orderID },
//             include: [
//                 { model: Tiers, as: 'customer' },
              
//                 { model: User, as: 'delivery' }
//             ]
//         });

//         if (!delivery) {
//             return res.status(404).json({ message: 'Delivery not found for this order' });
//         }

//         // Rechercher les lignes de livraison associées à la livraison
//         const deliveryLines = await DeliverySellLignes.findAll({
//             where: { parentID: delivery.id },
//             include: [
//                 { model: Article, as: 'article' },
//                 { model: Vat, as: 'vat' }
//             ]
//         });

//         // Construire la réponse détaillée
//         const detailedDelivery = {
//             ...delivery.toJSON(),
//             deliveryLines: deliveryLines
//         };

//         res.status(200).json(detailedDelivery);
//     } catch (error) {
//         console.error('Error fetching delivery:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


// module.exports = {
//     createDeliveryFromOrder,
//     getDeliveryByOrderID
// };

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
                { model: Tiers, as: 'customer' },
                { model: User, as: 'delivery' }
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
            console.log("hello exist ici "+ existingDeliverySell);
            return getDeliveryByOrderID(req, res);
        }

        const order = await Order.findOne({
            where: { id: orderID },
            include: [
                { model: Tiers, as: 'customer' },
                { model: Tiers, as: 'supplier' },
                { model: User, as: 'delivery' }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!order.deliveryID) {
            return res.status(400).json({ message: 'Order does not have a valid deliveryID' });
        }

        const deliveryData = {
            code: `DEL-${Date.now()}`,
            date: new Date(),
            tiersID: order.customerID,
            orderID: order.id,
            userID: order.deliveryID,
            observation: order.observation || '',
            note: order.note || '',
            total_ht: order.total_amount,
            total_ttc: order.total_amount,
            deleted: false,
        };

        const delivery = await DeliverySell.create(deliveryData);

        const orderLines = await OrderLignes.findAll({
            where: { parentID: order.id },
            include: [
                { model: Article, as: 'article' }
            ]
        });

        const deliveryLinesData = await Promise.all(orderLines.map(async (line) => {
            const vatExists = await Vat.findByPk(line.article.vatID);
            if (!vatExists) {
                throw new Error(`VAT ID ${line.article.vatID} not found`);
            }

            return {
                parentID: delivery.id,
                articleID: line.articleID,
                quantity: line.quantity,
                sale_ht: line.gross_amount,
                gross_amount: line.gross_amount,
                vatID: line.article.vatID,
                sale_ttc: line.gross_amount,
                deleted: false,
            };
        }));

        await DeliverySellLignes.bulkCreate(deliveryLinesData);

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
