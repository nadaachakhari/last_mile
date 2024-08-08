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
router.get('/:ref', getBankById);
router.post('/', createBank);
router.put('/:ref', updateBank);
router.put('/update_deleted/:ref', deleteBank);

module.exports = router;
