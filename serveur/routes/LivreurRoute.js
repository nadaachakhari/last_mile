const express = require('express');
const router = express.Router();
const LivreurController = require('../controller/LivreurController');
const authMiddleware = require('../middlewares/auth');



router.get('/', LivreurController.getLivreurs);
router.post('/addLivreur', LivreurController.ajouterLivreur);
router.get('/getLivreurById:id', LivreurController.getLivreurById);
router.put('/updateLivreur:id', LivreurController.updateLivreur);
router.delete('/deleteLivreur:id', LivreurController.deleteLivreur);
router.put('/statuts/:id', LivreurController.updateStatutLivreur);

router.post('/login', authMiddleware.login);

/*
importation
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/', authMiddleware.loggedMiddleware, authMiddleware.isAdmin, LivreurController.getLivreurs);
router.get('/:id', authMiddleware.loggedMiddleware, LivreurController.getLivreurById);
router.post('/', authMiddleware.loggedMiddleware, authMiddleware.isAdmin, LivreurController.ajouterLivreur);
router.put('/:id', authMiddleware.loggedMiddleware, authMiddleware.isAdmin, LivreurController.updateLivreur);
router.delete('/:id', authMiddleware.loggedMiddleware, authMiddleware.isAdmin, LivreurController.deleteLivreur);
 */
module.exports = router;
