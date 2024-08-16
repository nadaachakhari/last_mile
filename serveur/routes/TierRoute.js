const express = require('express');
const router = express.Router();
const {
  createTier,
  getAllTiers,
  getTierById,
  updateTier,
  deleteTier,
  createClient,
  updateClient,
  getAllClients,
  getClientById,
  getAllClientsForSupplier,
  createSupplier,
  uploadSupplier,
  getSupplierById ,
  getAllSuppliers,
  deleteSupplier,
  checkUserName
  //getOrdersByCustomer
 
} = require('../controller/TierController');
const { authenticateToken } = require('../controller/AuthController')

// Tier
router.post('/', createTier);
router.get('/', getAllTiers);


//client
router.post('/create-client', authenticateToken, createClient);
router.get('/clients', getAllClients);
router.get('/clientbysupplier', authenticateToken, getAllClientsForSupplier);
//Supplier
router.post('/create-supplier', createSupplier);
router.get('/supplier', getAllSuppliers);
router.put('/upload-supplier/:id', uploadSupplier);
router.get('/supplier/:id', getSupplierById);
//
router.put('/clients/:id', updateClient);
router.get('/clients/:id', getClientById)
router.put('/update_deleted_Supplier/:id', deleteSupplier);
//
router.get('/:id', getTierById);
router.put('/:id', updateTier);
router.put('/update_deleted/:id', deleteTier);


router.get("/checkUserName/:userName", checkUserName);


module.exports = router;
