const express = require('express');
const router = express.Router();

const {
    getAllPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
} = require('../controller/PaymentMethodeController');

// Routes pour les méthodes de paiement
router.get('/', getAllPaymentMethods);
router.get('/:id', getPaymentMethodById);
router.post('/', createPaymentMethod);
router.put('/:id', updatePaymentMethod);
router.put('/update_deleted/:id', deletePaymentMethod);

module.exports = router;
