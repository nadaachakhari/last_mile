const express = require('express');
const router = express.Router();

const {
    getAllOrderStates,
    getOrderStateById,
    deleteOrderState
} = require('../controller/OrderStateController')


router.get('/', getAllOrderStates);
router.get('/:id', getOrderStateById);
router.delete('/:id', deleteOrderState)
module.exports = router;