const express = require('express');
const router = express.Router();
const {
  createTier,
  getAllTiers,
  getTierById,
  updateTier,
  deleteTier,
  createClient
} = require('../controller/TierController');

// Créer un nouveau Tier
router.post('/', createTier);

// Lire tous les Tiers
router.get('/', getAllTiers);

//create client depuis le fournisseur !!!
router.post('/create-client', createClient);

// Lire un seul Tier par ID
router.get('/:id', getTierById);

// Mettre à jour un Tier
router.put('/:id', updateTier);

// Supprimer un Tier
router.put('/update_deleted/:id', deleteTier);

module.exports = router;
