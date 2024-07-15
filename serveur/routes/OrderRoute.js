const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controller/AuthController')

const {
    createOrder,
} = require('../controller/OrderController')

router.post('/', authenticateToken, createOrder)

module.exports = router;
