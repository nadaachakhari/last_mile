const express = require('express');
const router = express.Router();

const { createClaim } = require('../controller/ClaimController');
const { authenticateToken } = require('../controller/AuthController')

// Routes pour les réclamations
router.post('/:orderID', authenticateToken, createClaim);

module.exports = router;