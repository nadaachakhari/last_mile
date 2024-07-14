const express = require('express');
const router = express.Router();
const { authenticate } = require('../controller/AuthController');

router.post('/', authenticate);

module.exports = router;
