const Bank = require("../Models/BankModel");

const getAllBanks = async (req, res) => {
  try {
    const banks = await Bank.findAll({
      where: { deleted: false },
    });
    res.json(banks);
  } catch (error) {
    console.error("Erreur lors de la récupération des banques:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des banques." });
  }
};

const getBankById = async (req, res) => {
  const { id } = req.params;
  try {
    const bank = await Bank.findByPk(id);
    if (!bank) {
      return res.status(404).json({ message: "Banque non trouvée." });
    }
    res.json(bank);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la banque avec la référence ${id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la banque." });
  }
};

const createBank = async (req, res) => {
  const { ref, value } = req.body;
  try {
    const newBank = await Bank.create({ ref, value, deleted: false });
    res.status(201).json(newBank);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "La référence de la banque doit être unique." });
    }
    console.error("Erreur lors de la création de la banque:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la banque." });
  }
};

const updateBank = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  try {
    let bank = await Bank.findByPk(id);
    if (!bank) {
      return res.status(404).json({ message: "Banque non trouvée." });
    }
    bank.value = value;
    await bank.save();
    res.json(bank);
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la banque avec la référence ${id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de la banque." });
  }
};

const deleteBank = async (req, res) => {
  const { id } = req.params;
  try {
    let bank = await Bank.findByPk(id);
    if (!bank) {
      return res.status(404).json({ message: "Banque non trouvée." });
    }
    await bank.update({ deleted: true });
    res.json({
      message: `Banque avec la référence ${id} marquée comme supprimée.`,
    });
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de la banque avec la référence ${id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la banque." });
  }
};

module.exports = {
  getAllBanks,
  getBankById,
  createBank,
  updateBank,
  deleteBank,
};
