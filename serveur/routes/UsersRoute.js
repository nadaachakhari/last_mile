const express = require('express');
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controller/UsersController');

// Créer un nouvel utilisateur
router.post('/', createUser);

// Lire tous les utilisateurs
router.get('/', getAllUsers);

// Lire un seul utilisateur par ID
router.get('/:id', getUserById);

// Mettre à jour un utilisateur
router.put('/:id', updateUser);

// Supprimer un utilisateur (marquer comme supprimé)
router.put('/update_deleted/:id', deleteUser);

module.exports = router;
