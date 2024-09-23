const Category = require('../Models/CategoryModel');
const Tiers = require('../Models/TiersModel');

// Créer une nouvelle catégorie
createCategory = async (req, res) => {
  try {
    // Récupérer l'id du fournisseur connecté depuis req.user (issu de l'authentification JWT)
    const id_supplier = req.user.id;

    const { name, deleted } = req.body;
    const newCategory = await Category.create({
      name,
      id_supplier,  // Assigner l'id du fournisseur
      deleted: false
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lire toutes les catégories (par fournisseur connecté)
getCategories = async (req, res) => {
  try {
    const id_supplier = req.user.id; // Récupérer l'id du fournisseur connecté

    const categories = await Category.findAll({
      where: {
        id_supplier,  // Filtrer par fournisseur
        deleted: false
      }
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
    await category.update({ deleted: true }); // Mise à jour de 'deleted' à true
    res.json({ message: `Category avec l'ID ${id} marquée comme supprimée.` }); // Utilisation des backticks ici
  } catch (error) {
    console.error(`Erreur lors de la suppression de la Category avec l'ID ${id}:`, error); // Utilisation des backticks pour afficher l'ID et l'erreur
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
