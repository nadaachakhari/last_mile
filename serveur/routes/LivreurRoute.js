const express = require('express');
const router = express.Router();
const LivreurController = require('../controller/LivreurController');



router.get('/', LivreurController.getLivreurs);

router.get('/getLivreurById:id', LivreurController.getLivreurById);

router.post('/addLivreur', LivreurController.ajouterLivreur);

router.put('/updateLivreur:id', LivreurController.updateLivreur);

router.delete('/deleteLivreur:id', LivreurController.deleteLivreur);

module.exports = router;
