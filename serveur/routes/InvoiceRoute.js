const express = require('express');
const router = express.Router();
const {
    createInvoiceFromOrder,
    getInvoiceByOrderID,
    getAllInvoices,
    getInvoiceByID
 } = require('../controller/InvoiceController');

router.post('/invoiceOrder/:orderID', createInvoiceFromOrder);
router.get('/invoice/:orderID', getInvoiceByOrderID);
router.get('/invoice', getAllInvoices)
router.get('/invoicebyid/:invoiceID', getInvoiceByID);

module.exports = router;
