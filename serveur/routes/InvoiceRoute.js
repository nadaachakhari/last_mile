const express = require('express');
const router = express.Router();
const {
    createInvoiceFromOrder,
    getInvoiceByOrderID
 } = require('../controller/InvoiceController');

router.post('/invoiceOrder/:orderID', createInvoiceFromOrder);
router.get('/invoice/:orderID', getInvoiceByOrderID)

module.exports = router;
