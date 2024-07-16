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
  getClientById
} = require('../controller/TierController');
const { authenticateToken } = require('../controller/AuthController')

// Créer un nouveau Tier
router.post('/', createTier);

// Lire tous les Tiers
router.get('/', getAllTiers);

//create client depuis le fournisseur !!!
router.post('/create-client', authenticateToken, createClient);
router.put('/clients/:id', updateClient);
// Récupérer tous les clients
router.get('/clients', getAllClients);
router.get('/clients/:id', getClientById)

// Lire un seul Tier par ID
router.get('/:id', getTierById);

// Mettre à jour un Tier
router.put('/:id', updateTier);

// Supprimer un Tier
router.put('/update_deleted/:id', deleteTier);

module.exports = router;
