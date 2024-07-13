const Article = require('../Models/ArticleModel');
const Vat = require('../Models/VatModel');
const Category = require('../Models/CategoryModel');


const createArticle = async (req, res) => {
  const { code, name, vatID, sale_ht, categoryID, bar_code, deleted } = req.body;
  const photo = req.file ? req.file.filename : '';
  try {
    // Récupérer le taux de TVA à partir de l'ID de la TVA
    const vat = await Vat.findByPk(vatID);
    if (!vat) {
      return res.status(400).json({ error: 'Invalid VAT ID' });
    }

    // Calculer le prix TTC
    const sale_ttc = sale_ht * (1 + vat.value / 100);

    // Créer un nouvel article avec le prix TTC calculé
    const newArticle = await Article.create({ code, name, vatID, sale_ht, sale_ttc, categoryID, photo, bar_code, deleted: false });
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Lire tous les Articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
        where: { deleted: false }, 
      include: [
        { model: Vat, attributes: ['value'] },
        { model: Category, attributes: ['name'] }
      ]
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lire un seul Article par ID
const getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findOne({
      where: { id, deleted: false },
      include: [
        { model: Vat, attributes: ['value'] },
        { model: Category, attributes: ['name'] }
      ]
    });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Mettre à jour un article
const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { code, name, vatID, sale_ht, categoryID, bar_code, deleted } = req.body;
  const photo = req.file ? req.file.filename : '';
  try {
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const vat = await Vat.findByPk(vatID);
    if (!vat) {
      return res.status(400).json({ error: 'Invalid VAT ID' });
    }

    const sale_ttc = sale_ht * (1 + vat.value / 100);

    await article.update({ 
      code, 
      name, 
      vatID, 
      sale_ht, 
      sale_ttc, 
      categoryID, 
      photo: photo || article.photo, 
      bar_code, 
      deleted: deleted !== undefined ? deleted : article.deleted 
    });

    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer (logiquement) un article
const deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await article.update({ deleted: true });
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
