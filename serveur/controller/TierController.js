const bcrypt = require('bcrypt');
const Tiers = require('../Models/TiersModel');
const TypeTiers = require('../Models/TypeTiersModel');
const City = require('../Models/CityModel');

// Créer un nouveau Tier
const createTier = async (req, res) => {
  const { name, type_tiersID, code, address, postal_code, country, phone, mobile, fax, email, cityID, block, deleted, password } = req.body;
  try {
    // Hachage du mot de passe avant de créer le Tier
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTier = await Tiers.create({ name, type_tiersID, code, address, postal_code, country, phone, mobile, fax, email, cityID, block, deleted: false, password: hashedPassword });
    res.status(201).json(newTier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lire tous les Tiers
const getAllTiers = async (req, res) => {
  try {
    const tiers = await Tiers.findAll({
      where: {
        deleted: false
      },
      include: [
        { model: TypeTiers, attributes: ['name'] },
        { model: City, attributes: ['value'] }
      ]
    });
    res.status(200).json(tiers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lire un seul Tier par ID
const getTierById = async (req, res) => {
  const { id } = req.params;
  try {
    const tier = await Tiers.findOne({
      where: { id },
      include: [
        { model: TypeTiers, attributes: ['name'] },
        { model: City, attributes: ['value'] }
      ]
    });
    if (!tier) {
      return res.status(404).json({ error: 'Tier not found' });
    }
    res.status(200).json(tier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour un Tier
const updateTier = async (req, res) => {
  const { id } = req.params;
  const { name, type_tiersID, code, address, postal_code, country, phone, mobile, fax, email, cityID, block, deleted, password } = req.body;
  try {
    const tier = await Tiers.findByPk(id);
    if (!tier) {
      return res.status(404).json({ error: 'Tier not found' });
    }

    // Hachage du mot de passe si présent
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await tier.update({ 
      name, 
      type_tiersID, 
      code, 
      address, 
      postal_code, 
      country, 
      phone, 
      mobile, 
      fax, 
      email, 
      cityID, 
      block, 
      deleted,
      password: hashedPassword || tier.password  // Si pas de nouveau mot de passe, conserver l'ancien
    });
    res.status(200).json(tier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un Tier
const deleteTier = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tier = await Tiers.findByPk(id);
    if (!tier) {
      return res.status(404).json({ message: `Tier avec l'ID ${id} non trouvé.` });
    }

    // Mettre à jour la colonne 'deleted' à 0 (Suppression logique)
    await tier.update({ deleted: 0 });

    res.json({ message: `Tier avec l'ID ${id} a été marqué comme supprimé.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTier,
  getAllTiers,
  getTierById,
  updateTier,
  deleteTier,
};
