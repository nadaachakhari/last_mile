const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controller/AuthController'); 
const { countClientsBySupplier ,countSuppliers,countArticleBySupplier,totalCommandsBySupplier, countOrdersByDeliveryPerson,
    countClaims,
} = require('../controller/DashboardController'); 


router.get('/count-Suppliers', countSuppliers);
router.get('/count-clients',authenticateToken, countClientsBySupplier);
router.get('/count-articles',authenticateToken, countArticleBySupplier);

router.get('/total-commands', authenticateToken, totalCommandsBySupplier);
router.get('/count-orders-delivery', authenticateToken,countOrdersByDeliveryPerson)
router.get('/countClaims',countClaims)
module.exports = router;
