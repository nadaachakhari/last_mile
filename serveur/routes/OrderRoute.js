const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controller/AuthController')

const {
    createOrder,
    getAllOrders,
    updateOrder,
    getOrderWithArticlesAndLines
} = require('../controller/OrderController')

router.post('/', authenticateToken, createOrder);
//get order par fournisseurs
router.get('/', authenticateToken, getAllOrders);
router.get('/ordrelines/:id', getOrderWithArticlesAndLines)
router.put('/:id', authenticateToken, updateOrder);

module.exports = router;