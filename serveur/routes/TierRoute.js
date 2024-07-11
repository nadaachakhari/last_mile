const express = require('express');
const router = express.Router();
const {
  createTier,
  getAllTiers,
  getTierById,
  updateTier,
  deleteTier,
} = require('../controller/TierController');

// Créer un nouveau Tier
router.post('/', createTier);

// Lire tous les Tiers
router.get('/', getAllTiers);

// Lire un seul Tier par ID
router.get('/:id', getTierById);

// Mettre à jour un Tier
router.put('/:id', updateTier);

// Supprimer un Tier
router.put('/update_deleted/:id', deleteTier);

module.exports = router;
