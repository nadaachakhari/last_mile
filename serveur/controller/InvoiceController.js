const Invoice = require('../Models/InvoiceModel');
const InvoiceLignes = require('../Models/InvoiceLignesModel');
const Order = require('../Models/OrderModel');
const OrderLignes = require('../Models/OrderLignesModel');
const Tiers = require('../Models/TiersModel');
const PaymentMethod = require('../Models/PaymentMethodModel');
const Vat = require('../Models/VatModel');
const Article = require('../Models/ArticleModel');
const State = require('../Models/StateModel');
const User = require('../Models/UserModel');

const getInvoiceByOrderID = async (req, res) => {
    const orderID = req.params.orderID;

    try {
        const invoice = await Invoice.findOne({
            where: { orderID: orderID },
            include: [
                {
                    model: Order, as: 'order',
                    include: [
                        { model: Tiers, as: 'customer' },
                        { model: Tiers, as: 'supplier' },
                        { model: PaymentMethod, as: 'PaymentMethod' },
                        { model: State, as: 'state' },
                        { model: User, as: 'delivery' },
                    ]
                }
            ]
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found for this order' });
        }

        const invoiceLignes = await InvoiceLignes.findAll({
            where: { parentID: invoice.id, deleted: false },
            include: [
                { model: Article, as: 'article' },
                { model: Vat, as: 'vat' }
            ]
        });

        const detailedInvoice = {
            ...invoice.toJSON(),
            invoiceLignes: invoiceLignes
        };

        res.status(200).json(detailedInvoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const createInvoiceFromOrder = async (req, res) => {
    const orderID = req.params.orderID;

    try {
        // Check if the invoice already exists for the order
        const existingInvoice = await Invoice.findOne({ where: { orderID: orderID } });
        if (existingInvoice) {
            return getInvoiceByOrderID(req, res);
        }

        // Fetch the order details
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

        // Fetch the order lines
        const orderLines = await OrderLignes.findAll({
            where: { parentID: order.id },
            include: [
                { model: Article, as: 'article' }
            ]
        });

        // Validate VAT IDs and calculate totals
        let total_ht = 0;
        let total_ttc = 0;

        for (const line of orderLines) {
            const vatExists = await Vat.findByPk(line.article.vatID);
            if (!vatExists) {
                return res.status(400).json({ message: `VAT ID ${line.article.vatID} not found` });
            }

            const sale_ht = line.quantity * line.article.sale_ht;
            const sale_ttc = line.quantity * line.article.sale_ttc;

            total_ht += sale_ht;
            total_ttc += sale_ttc;
        }

        // Calculate total_net
        const taxStamp = 1000; // Assume taxStamp is a percentage value
        const total_tax = (total_ttc - total_ht) * (taxStamp / 100);
        const total_net = total_ttc - total_tax;

        // Create the invoice
        const invoiceData = {
            code: `INV-${Date.now()}`,
            date: new Date(),
            tiersID: order.customerID,
            orderID: order.id,
            ID_payment_method: order.ID_payment_method,
            taxStamp: taxStamp,
            observation: order.observation || '',
            note: order.note || '',
            total_ttc: total_ttc,
            total_ht: total_ht,
            total_net: total_net, 
            deleted: false,
        };
        const invoice = await Invoice.create(invoiceData);

        // Prepare invoice lines data
        const invoiceLinesData = orderLines.map((line) => {
            const sale_ht = line.quantity * line.article.sale_ht;
            const sale_ttc = line.quantity * line.article.sale_ttc;

            return {
                parentID: invoice.id,
                articleID: line.articleID,
                quantity: line.quantity,
                sale_ht: sale_ht,
                gross_amount: line.gross_amount,
                vatID: line.article.vatID,
                sale_ttc: sale_ttc,
                deleted: false,
            };
        });

        // Bulk create invoice lines
        await InvoiceLignes.bulkCreate(invoiceLinesData);

        // Fetch additional details for the response
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
        console.error('Error creating invoice:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



module.exports = {
    createInvoiceFromOrder,
    getInvoiceByOrderID
};