const Category = require('../Models/CategoryModel');

// Créer une nouvelle catégorie
createCategory = async (req, res) => {
  try {
    const { name, deleted } = req.body;
    const newCategory = await Category.create({ name, deleted: false });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lire toutes les catégories
getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
        where: { deleted: false }, // Ne récupère que les villes non supprimées
      });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lire une catégorie par ID
getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour une catégorie
updateCategory = async (req, res) => {
  try {
    const { name, deleted } = req.body;
    const [updated] = await Category.update(
      { name, deleted },
      { where: { id: req.params.id } }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    const updatedCategory = await Category.findByPk(req.params.id);
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une catégorie
deleteCategory = async (req, res) => {
    const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    await category.update({ deleted: 0 });
    res.json({ message: `Category avec l'ID ${id} marquée comme supprimée.` });
  } catch (error) {
       console.error(`Erreur lors de la suppression de la Category avec l'ID ${id}:`, error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la Category.' });
  }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };