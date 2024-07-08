const express = require('express');
const router = express.Router();
const {
  getTypeTiers,
  getTypeTiersById,
  createTypeTiers,
  updateTypeTiers,
  deleteTypeTiers,
} = require('../controller/TypeTiersController');

// Route pour récupérer tous les types de tiers
router.get('/', getTypeTiers);

// Route pour récupérer un type de tiers par son ID
router.get('/:id', getTypeTiersById);

// Route pour créer un nouveau type de tiers
router.post('/', createTypeTiers);

// Route pour mettre à jour un type de tiers
router.put('/:id', updateTypeTiers);

// Route pour mettre a jour le deleted = 0
router.put('/update_deleted/:id', deleteTypeTiers);

module.exports = router;
