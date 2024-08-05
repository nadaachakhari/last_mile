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
const sequelize = require('../config/database');
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

const generateInvoiceCode = async () => {
const currentYear = new Date().getFullYear();

const lastInvoice = await Invoice.findOne({
    where: sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), currentYear),
    order: [['code', 'DESC']]
});

let newNumber;
if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.code.split('-')[2], 10);
    newNumber = lastNumber + 1;
} else {
    newNumber = 1;
}

const invoiceCode = `FAC-${currentYear}-${newNumber.toString().padStart(4, '0')}`;

return { invoiceCode, newNumber };
};

const createInvoiceFromOrder = async (req, res) => {
    const orderID = req.params.orderID;

    try {
        const existingInvoice = await Invoice.findOne({ where: { orderID: orderID } });
        if (existingInvoice) {
            return getInvoiceByOrderID(req, res);
        }

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

        const orderLines = await OrderLignes.findAll({
            where: { parentID: order.id },
            include: [
                { model: Article, as: 'article' }
            ]
        });

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

        const taxStamp = 1; // Assume taxStamp is a percentage value
        const total_tax = (total_ttc - total_ht) * (taxStamp / 100);
        const total_net = total_ttc - total_tax;

        const { invoiceCode, newNumber } = await generateInvoiceCode();

        const invoiceData = {
            code: invoiceCode,
            date: new Date(),
            tiersID: order.customerID,
            orderID: order.id,
            ID_payment_method: order.ID_payment_method,
            taxStamp: taxStamp,
            observation: order.observation || '',
            note: order.note || '',
            total_ttc: parseFloat(total_ttc.toFixed(3)),
            total_ht: parseFloat(total_ht.toFixed(3)),
            total_net: parseFloat(total_net.toFixed(3)),
            deleted: false,
            invoice_number: newNumber,
        };
        const invoice = await Invoice.create(invoiceData);

        const invoiceLinesData = orderLines.map((line) => {
            const sale_ht = line.quantity * line.article.sale_ht;
            const sale_ttc = line.quantity * line.article.sale_ttc;
            const gross_amount = line.gross_amount ? parseFloat(line.gross_amount).toFixed(3) : 0;

            return {
                parentID: invoice.id,
                articleID: line.articleID,
                quantity: parseFloat(line.quantity).toFixed(3),
                sale_ht: parseFloat(sale_ht).toFixed(3),
                gross_amount: parseFloat(gross_amount).toFixed(3),
                vatID: line.article.vatID,
                sale_ttc: parseFloat(sale_ttc).toFixed(3),
                deleted: false,
            };
        });

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
        console.error('Error creating invoice:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





module.exports = {
    createInvoiceFromOrder,
    getInvoiceByOrderID
};