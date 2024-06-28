const express = require('express');
const {
    getFournisseurs,
    getFournisseurById,
    ajouterFournisseur,
    deleteFournisseur,
    updateFournisseur,
  
} = require('../controller/FournisseurController');

const router = express.Router();

router.get('/', getFournisseurs);
router.get('/:id', getFournisseurById);
router.post('/', ajouterFournisseur);
router.put('/:id', updateFournisseur);
router.delete('/:id', deleteFournisseur);

module.exports = router;
