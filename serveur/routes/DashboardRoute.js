const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controller/AuthController'); 
const { countClientsBySupplier ,countSuppliers,countArticleBySupplier} = require('../controller/DashboardController'); 

router.get('/count-Suppliers', countSuppliers);
router.get('/count-clients',authenticateToken, countClientsBySupplier);
router.get('/count-articles',authenticateToken, countArticleBySupplier);
module.exports = router;
