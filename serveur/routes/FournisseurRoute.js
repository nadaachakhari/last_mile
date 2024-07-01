const express = require('express');
const {
    getFournisseurs,
    getFournisseurById,
    ajouterFournisseur,
    deleteFournisseur,
    updateFournisseur,
    updateStatutFournisseur,
} = require('../controller/FournisseurController');

const router = express.Router();

router.get('/', getFournisseurs);
router.get('/:id', getFournisseurById);
router.post('/', ajouterFournisseur);
router.put('/:id', updateFournisseur);
router.delete('/:id', deleteFournisseur);
router.put('/fournisseur/:id/statut', updateStatutFournisseur);// Endpoint pour mettre à jour le statut d'un fournisseur


module.exports = router;
