const express = require('express');
const router = express.Router();

const {
    getAllBanks,
    getBankById,
    createBank,
    updateBank,
    deleteBank,
} = require('../controller/BankController');


router.get('/', getAllBanks);
router.get('/:id', getBankById);
router.post('/', createBank);
router.put('/:id', updateBank);
router.put('/update_deleted/:id', deleteBank);

module.exports = router;
