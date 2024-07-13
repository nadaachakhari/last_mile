const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const articleController = require('../controller/ArticleController');

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/src/assets/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('photo'), articleController.createArticle);
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.put('/:id', upload.single('photo'), articleController.updateArticle);
router.put('/update_deleted/:id', articleController.deleteArticle);

module.exports = router;
