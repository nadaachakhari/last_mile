const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controller/AuthController')

const {
    createOrder,
    getAllOrders,
    updateOrder,
    getOrder,
    getOrderWithoutArticles,
    getOrderWithArticles,
    getOrderLignesByParentID,
    getOrderWithArticlesAndLines
} = require('../controller/OrderController')

router.post('/', authenticateToken, createOrder);
//get order par fournisseurs
router.get('/', authenticateToken, getAllOrders);
router.get('/ordre/:id', getOrderWithoutArticles);
router.get('/ordre/lines/:id', getOrderLignesByParentID);
router.get('/ordrelines/:id', getOrderWithArticlesAndLines);
router.get('/ordree/:id', getOrderWithArticles);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id', authenticateToken, updateOrder);

module.exports = router;