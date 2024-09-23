const express = require('express');
const { authenticateToken } = require('../controller/AuthController')
const router = express.Router();

const {
    getAllPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
} = require('../controller/PaymentMethodeController');

// Routes pour les méthodes de paiement
router.get('/',authenticateToken, getAllPaymentMethods);
router.get('/:id', getPaymentMethodById);
router.post('/',authenticateToken, createPaymentMethod);
router.put('/:id', updatePaymentMethod);
router.put('/update_deleted/:id', deletePaymentMethod);

module.exports = router;
