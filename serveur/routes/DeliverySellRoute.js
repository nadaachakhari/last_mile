const express = require('express');
const router = express.Router();
const { createDeliveryFromOrder ,getDeliveryByOrderID} = require('../controller/DeliverySellController');

router.post('/order/:orderID', createDeliveryFromOrder);
router.get('/delivery/:orderID', getDeliveryByOrderID);

module.exports = router;
