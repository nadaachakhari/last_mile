const express = require('express');
const {
    getFournisseurs,
    getFournisseurById,
    registreFournisseur,
    deleteFournisseur,
    updateFournisseur,
    updateStatutFournisseur,
} = require('../controller/FournisseurController');

const router = express.Router();

router.get('/', getFournisseurs);
router.get('/:id', getFournisseurById);
router.post('/registre', registreFournisseur);
router.put('/:id', updateFournisseur);
router.delete('/:id', deleteFournisseur);
router.put('/statut/:id', updateStatutFournisseur);
module.exports = router;