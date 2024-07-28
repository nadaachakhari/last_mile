const Invoice = require('../Models/InvoiceModel');
const InvoiceLignes = require('../Models/InvoiceLignesModel');
const Order = require('../Models/OrderModel');
const OrderLignes = require('../Models/OrderLignesModel');
const Tiers = require('../Models/TiersModel');
const PaymentMethod = require('../Models/PaymentMethodModel');
const Vat = require('../Models/VatModel');
const Article = require('../Models/ArticleModel');

const createInvoiceFromOrder = async (req, res) => {
    const orderID = req.params.orderID;
    console.log(orderID);
    try {
        const order = await Order.findOne({
            where: { id: orderID },
            include: [
                { model: Tiers, as: 'customer' },
                { model: Tiers, as: 'supplier' },
                { model: PaymentMethod, as: 'PaymentMethod' }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const invoiceData = {
            code: `INV-${Date.now()}`,
            date: new Date(),
            tiersID: order.customerID,
            orderID: order.id,
            ID_payment_method: order.ID_payment_method,
            taxStamp: order.taxStamp || 0,
            observation: order.observation || '',
            note: order.note || '',
            total_ttc: order.total_amount,
            total_ht: order.total_amount,
            total_net: order.total_amount,
            deleted: false,
        };
        const invoice = await Invoice.create(invoiceData);

        const orderLines = await OrderLignes.findAll({
            where: { parentID: order.id },
            include: [
                { model: Article, as: 'article' }
            ]
        });

        for (const line of orderLines) {
            const vatExists = await Vat.findByPk(line.article.vatID);
            console.log(`VAT ID ${line.article.vatID}:`, vatExists);
            if (!vatExists) {
                return res.status(400).json({ message: `VAT ID ${line.article.vatID} not found` });
            }
        }

        const invoiceLinesData = orderLines.map(line => ({
            parentID: invoice.id,
            articleID: line.articleID,
            quantity: line.quantity,
            sale_ht: line.gross_amount,
            gross_amount: line.gross_amount,
            vatID: line.article.vatID,
            sale_ttc: line.gross_amount,
            deleted: false,
        }));

        await InvoiceLignes.bulkCreate(invoiceLinesData);

        const customer = await Tiers.findByPk(order.customerID);
        const supplier = await Tiers.findByPk(order.supplierID);
        const paymentMethod = await PaymentMethod.findByPk(order.ID_payment_method);

        const invoiceLinesDetailed = await Promise.all(invoiceLinesData.map(async (line) => {
            const article = await Article.findByPk(line.articleID);
            const vat = await Vat.findByPk(line.vatID);
            return {
                ...line,
                article: article,
                vat: vat
            };
        }));

        const detailedInvoice = {
            ...invoice.toJSON(),
            customer: customer,
            supplier: supplier,
            paymentMethod: paymentMethod,
            invoiceLines: invoiceLinesDetailed
        };

        res.status(201).json(detailedInvoice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createInvoiceFromOrder
};