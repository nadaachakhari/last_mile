const Vat = require('../Models/VatModel');

const getAllVats = async (req, res) => {
  try {
    const id_supplier = req.user.id;
    const vats = await Vat.findAll({
      where: { id_supplier, deleted: false },
    });
    res.json(vats);
  } catch (error) {
    console.error('Erreur lors de la récupération des TVA:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des TVA.' });
  }
};

const getVatById = async (req, res) => {
  const { id } = req.params;
  try {
    const vat = await Vat.findByPk(id);
    if (!vat) {
      return res.status(404).json({ message: 'TVA non trouvée.' });
    }
    res.json(vat);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la TVA avec l'ID ${id}:`, error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la TVA.' });
  }
};

const createVat = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est authentifié
    const id_supplier = req.user.id; // Assumer que l'utilisateur connecté est un fournisseur

    const { value } = req.body;

    // Créer une nouvelle TVA associée à l'utilisateur connecté
    const newVat = await Vat.create({ value, id_supplier, deleted: false });

    res.status(201).json(newVat);
  } catch (error) {
    console.error('Erreur lors de la création de la TVA:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la TVA.' });
  }
};


const updateVat = async (req, res) => {
  const { id } = req.params;
  const { value, deleted } = req.body;
  try {
    let vat = await Vat.findByPk(id);
    if (!vat) {
      return res.status(404).json({ message: 'TVA non trouvée.' });
    }
    vat.value = value;
    vat.deleted = deleted;
    await vat.save();
    res.json(vat);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la TVA avec l'ID ${id}:`, error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la TVA.' });
  }
};

const deleteVat = async (req, res) => {
  const { id } = req.params;
  try {
    let vat = await Vat.findByPk(id);
    if (!vat) {
      return res.status(404).json({ message: 'TVA non trouvée.' });
    }
    await vat.update({ deleted: true });
    res.json({ message: `TVA avec l'ID ${id} marquée comme supprimée.` });
  } catch (error) {
    console.error(`Erreur lors de la suppression de la TVA avec l'ID ${id}:`, error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la TVA.' });
  }
};

module.exports = {
  getAllVats,
  getVatById,
  createVat,
  updateVat,
  deleteVat,
};
