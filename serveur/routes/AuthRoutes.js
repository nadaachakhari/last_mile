const express = require('express');
const router = express.Router();
const { authenticate ,
        changePassword
} = require('../controller/AuthController');
const { authenticateToken } = require('../controller/AuthController')
router.post('/', authenticate);
router.put('/change-password', authenticateToken, changePassword);
module.exports = router;
