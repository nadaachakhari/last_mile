const express = require('express');
const router = express.Router();
const VatController = require('../controller/VatController');
const { authenticateToken } = require('../controller/AuthController')
router.get('/',authenticateToken, VatController.getAllVats);
router.get('/:id', VatController.getVatById);
router.post('/',authenticateToken, VatController.createVat);
router.put('/:id', VatController.updateVat);
router.put('/update_deleted/:id', VatController.deleteVat);

module.exports = router;
