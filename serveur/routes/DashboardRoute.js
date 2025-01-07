const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controller/AuthController'); 
const { countClientsBySupplier ,countSuppliers,countArticleBySupplier,totalCommandsBySupplier, countOrdersByDeliveryPerson,
    countClaims,countOrdersByState,countTotalOrders,countAdmin,countOrdersByClientForSupplier,countOrdersByClientAddress,
    countOrdersByMonth,countOrdersByDay,countOrdersByClientAddressbysupplier
} = require('../controller/DashboardController'); 

router.get('/count-admin', countAdmin);
router.get('/count-Suppliers', countSuppliers);
router.get('/count-clients',authenticateToken, countClientsBySupplier);
router.get('/count-articles',authenticateToken, countArticleBySupplier);

router.get('/total-commands', authenticateToken, totalCommandsBySupplier);
router.get('/count-orders-delivery', authenticateToken,countOrdersByDeliveryPerson);
router.get('/countClaims',countClaims);
router.get('/countOrdersByState',countOrdersByState)
router.get('/countTotalOrders',countTotalOrders)
router.get('/countOrdersByClientForSupplier',authenticateToken,countOrdersByClientForSupplier)
router.get('/countOrdersByClientAddressbysupplier',authenticateToken,countOrdersByClientAddressbysupplier)
router.get('/countOrdersByClientAddress',countOrdersByClientAddress)

router.get('/countOrdersByMonth',authenticateToken,countOrdersByMonth)
router.get('/countOrdersByDay',authenticateToken,countOrdersByDay)
module.exports = router;
