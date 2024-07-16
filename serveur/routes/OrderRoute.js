const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controller/AuthController')

const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder
} = require('../controller/OrderController')

router.post('/', authenticateToken, createOrder);
router.get('/', authenticateToken, getAllOrders);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id', authenticateToken, updateOrder);

module.exports = router;