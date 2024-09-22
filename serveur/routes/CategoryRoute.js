const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controller/CategoryController');
const { authenticateToken } = require('../controller/AuthController')
// Route pour créer une nouvelle catégorie
router.post('/', authenticateToken, createCategory);

// Route pour obtenir toutes les catégories
router.get('/',authenticateToken,  getCategories);

// Route pour obtenir une catégorie par ID
router.get('/:id',  getCategoryById);

// Route pour mettre à jour une catégorie
router.put('/:id', updateCategory);

// Route pour supprimer une catégorie
router.put('/update_deleted/:id', deleteCategory);

module.exports = router;
