const express = require('express');
const router = express.Router();
const { createInvoiceFromOrder } = require('../controller/InvoiceController');

router.post('/invoiceOrder/:orderID', createInvoiceFromOrder);

module.exports = router;
