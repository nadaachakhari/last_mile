const TypeTiers = require('../Models/TypeTiersModel');

// Méthode pour récupérer tous les types de tiers
const getTypeTiers = async (req, res, next) => {
  try {
 // Filtrer les types de tiers où deleted = 1
 const typeTiers = await TypeTiers.findAll({
  where: {
    deleted: 1
  }
});
    res.json(typeTiers);
  } catch (error) {
    next(error);
  }
};

// Méthode pour récupérer un type de tiers par son ID
const getTypeTiersById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const typeTiers = await TypeTiers.findByPk(id);
    if (!typeTiers) {
      return res.status(404).json({ message: `Type de tiers avec l'ID ${id} non trouvé.` });
    }
    res.json(typeTiers);
  } catch (error) {
    next(error);
  }
};

// Fonction pour créer un nouveau type de tiers
const createTypeTiers = async (req, res) => {
  try {
    const { name } = req.body;
    
    const newTypeTiers = await TypeTiers.create({ name });
    res.status(201).json(newTypeTiers);
  } catch (error) {
    console.error('Error creating type_tiers:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Méthode pour mettre à jour un type de tiers existant
const updateTypeTiers = async (req, res, next) => {
  const { id } = req.params;
  const { name, deleted } = req.body;
  try {
    const typeTiers = await TypeTiers.findByPk(id);
    if (!typeTiers) {
      return res.status(404).json({ message: `Type de tiers avec l'ID ${id} non trouvé.` });
    }
    await typeTiers.update({ name, deleted });
    res.json(typeTiers);
  } catch (error) {
    next(error);
  }
};

const deleteTypeTiers = async (req, res, next) => {
  const { id } = req.params;
  try {
    const typeTiers = await TypeTiers.findByPk(id);
    if (!typeTiers) {
      return res.status(404).json({ message: `Type de tiers avec l'ID ${id} non trouvé.` });
    }
    
    // Mettre à jour la colonne 'deleted' à 1
    await typeTiers.update({ deleted: 0 });

    res.json({ message: `Type de tiers avec l'ID ${id} a été marqué comme supprimé.` });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getTypeTiers,
  getTypeTiersById,
  createTypeTiers,
  updateTypeTiers,
  deleteTypeTiers,
};
