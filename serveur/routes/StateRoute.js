const express = require('express');
const router = express.Router();

const {
    getAllStates,
    getStateById,
    createState,
    updateState,
    deleteState,
} = require('../controller/StateController');


router.get('/', getAllStates);
router.get('/:id', getStateById);
router.post('/', createState);
router.put('/:id', updateState);
router.put('/update_deleted/:id', deleteState);

module.exports = router;
