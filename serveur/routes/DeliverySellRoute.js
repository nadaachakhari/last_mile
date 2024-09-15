const express = require('express');
const router = express.Router();
const { createDeliveryFromOrder ,getDeliveryByOrderID, getAllDeliveries, getDeliveryByID} = require('../controller/DeliverySellController');


router.get('/delivery', getAllDeliveries);
router.get('/delivery/:deliveryID', getDeliveryByID);
router.post('/order/:orderID', createDeliveryFromOrder);
router.get('/delivery/:orderID', getDeliveryByOrderID);


module.exports = router;
