const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Tiers = require("../Models/TiersModel");
const TypeTiers = require("../Models/TypeTiersModel");
const City = require("../Models/CityModel");
const { sendEmail } = require("../config/emailConfig");
const { Op } = require("sequelize");
const Order = require("../Models/OrderModel");
const State = require("../Models/StateModel");
const PaymentMethod = require("../Models/PaymentMethodModel");
const axios = require("axios");

// Créer un nouveau Tier
const createTier = async (req, res) => {
  const {
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
    password,
  } = req.body;
  try {
    // Hachage du mot de passe avant de créer le Tier
    const hashedPassword = await bcrypt.hash(password, 10);
    const newTier = await Tiers.create({
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
      deleted: false,
      password: hashedPassword,
    });
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
        deleted: false,
      },
      include: [
        { model: TypeTiers, attributes: ["name"] },
        { model: City, attributes: ["value"] },
      ],
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
        { model: TypeTiers, attributes: ["name"] },
        { model: City, attributes: ["value"] },
      ],
    });
    if (!tier) {
      return res.status(404).json({ error: "Tier not found" });
    }
    res.status(200).json(tier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mettre à jour un Tier
const updateTier = async (req, res) => {
  const { id } = req.params;
  const {
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
    password,
  } = req.body;
  try {
    const tier = await Tiers.findByPk(id);
    if (!tier) {
      return res.status(404).json({ error: "Tier not found" });
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
      password: hashedPassword || tier.password, // Si pas de nouveau mot de passe, conserver l'ancien
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
      return res
        .status(404)
        .json({ message: `Tier avec l'ID ${id} non trouvé.` });
    }

    // Mettre à jour la colonne 'deleted' à 0 (Suppression logique)
    await tier.update({ deleted: 0 });

    res.json({ message: `Tier avec l'ID ${id} a été marqué comme supprimé.` });
  } catch (error) {
    next(error);
  }
};

const generateUserName = async (name, email) => {
  const cleanString = (str) => str.replace(/[^a-zA-Z]/g, "").toLowerCase();
  const namePart = cleanString(name);
  const emailPart = cleanString(email.split("@")[0]);
  let baseUserName = `${namePart}.${emailPart}`;
  let userName = baseUserName;

  // Check if the username already exists
  let userExists = await axios.get(
    `http://localhost:5001/Tier/checkUserName/${userName}`
  );

  // If username exists, append a number to make it unique
  let counter = 1;
  while (userExists.data.exists) {
    userName = `${baseUserName}${counter}`;
    userExists = await axios.get(
      `http://localhost:5001/Tier/checkUserName/${userName}`
    );
    counter++;
  }

  return userName;
};
const createClient = async (req, res) => {
  const {
    name,
    code,
    address,
    postal_code,
    country,
    phone,
    mobile,
    fax,
    email,
    cityID,
  } = req.body;
  console.log(req.body);
  
  const createdBy = req.user.id;
  console.log(createdBy);

  try {
    const typeClient = await TypeTiers.findOne({
      where: { name: "client", deleted: false },
    });
    if (!typeClient) {
      return res.status(400).json({ error: 'Type "client" does not exist' });
    }

    const existingClient = await Tiers.findOne({ where: { email } });
    if (existingClient) {
      const emailSubject = "Bienvenue chez nous !";
      const emailText = `Bonjour ${existingClient.name},\n\nBienvenue chez nous !\n\nCordialement,\nVotre équipe`;

      await sendEmail(existingClient.email, emailSubject, emailText);

      return res.status(400).json({ error: "Email already exists" });
    }

const user_name = await generateUserName(name, email);
    const generatedPassword = generatePassword(12);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    console.log("user_name: " + user_name);

    

    // Création du nouveau clie
    const newClient = await Tiers.create({
      name,
      user_name,
      type_tiersID: typeClient.id,
      code,
      address,
      postal_code,
      country,
      phone,
      mobile,
      fax,
      email,
      cityID,
      block: false,
      password: hashedPassword,
      deleted: false,
      createdBy,
    });

    const emailSubject = "Bienvenue sur notre plateforme !";
    const emailText = `Bonjour ${newClient.name},\n\nBienvenue sur notre plateforme !\n\nVotre login : ${newClient.name}\nVotre mot de passe : ${generatedPassword}\n\nCordialement,\nVotre équipe`;

    await sendEmail(newClient.email, emailSubject, emailText);

    res.status(201).json({ newClient, generatedPassword });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkUserName = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await Tiers.findOne({ where: { user_name: userName } });
    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur lors de la vérification du nom d'utilisateur." });
  }
};

const getAllClients = async (req, res) => {
  try {
    const typeClient = await TypeTiers.findOne({ where: { name: "client" } });
    console.log(typeClient);
    if (!typeClient) {
      return res.status(400).json({ error: 'Type "client" does not exist' });
    }
    const clients = await Tiers.findAll({
      where: { type_tiersID: typeClient.id, deleted: false },
      include: [
        { model: TypeTiers, attributes: ["name"] },
        { model: City, attributes: ["value"] },
      ],
    });

    res.status(200).json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fonction pour détecter les changements et créer un message
const getChangesMessage = (original, updated) => {
  let changes = "";
  for (let key in updated) {
    if (updated[key] && updated[key] !== original[key]) {
      changes += `${key}: ${original[key]} -> ${updated[key]}\n`;
    }
  }
  return changes;
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    code,
    address,
    postal_code,
    country,
    phone,
    mobile,
    fax,
    email,
    cityID,
  } = req.body;

  try {
    const client = await Tiers.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (email && email !== client.email) {
      const existingClient = await Tiers.findOne({
        where: { email, id: { [Op.ne]: id } },
      });
      if (existingClient) {
        return res
          .status(400)
          .json({ error: "Email already exists for another client" });
      }
    }

    const updatedClient = {
      name: name || client.name,
      code: code || client.code,
      address: address || client.address,
      postal_code: postal_code || client.postal_code,
      country: country || client.country,
      phone: phone || client.phone,
      mobile: mobile || client.mobile,
      fax: fax || client.fax,
      email: email || client.email,
      cityID: cityID || client.cityID,
    };

    const changesMessage = getChangesMessage(client, updatedClient);

    await client.update(updatedClient);

    // Envoyer un email au client avec les détails des modifications
    const emailSubject = "Mise à jour de vos informations";
    const emailText = `Bonjour ${client.name},\n\nNous avons mis à jour vos informations. Voici les changements effectués :\n\n${changesMessage}\n\nCordialement,\nVotre équipe`;
    console.log("client mail: " + client.email);
    await sendEmail(client.email, emailSubject, emailText);

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Tiers.findByPk(id, {
      include: [
        { model: TypeTiers, attributes: ["name"] },
        { model: City, attributes: ["value"] },
      ],
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllClientsForSupplier = async (req, res) => {
  const user = req.user; // Supposons que l'information utilisateur est disponible dans req.user

  try {
    // Déterminer si l'utilisateur est un fournisseur
    const isSupplier = user && user.role === "fournisseur";
    const supplierID = isSupplier ? user.id : null;

    if (!supplierID) {
      return res.status(400).json({ error: "Fournisseur non trouvé" });
    }

    // Récupérer le type "client"
    const typeClient = await TypeTiers.findOne({
      where: { name: "client", deleted: false },
    });
    if (!typeClient) {
      return res.status(400).json({ error: 'Type "client" non trouvé' });
    }

    // Récupérer les clients associés au fournisseur
    const clients = await Tiers.findAll({
      where: {
        type_tiersID: typeClient.id, // Filtrer par type "client"
        createdBy: supplierID, // Filtrer les clients créés par le fournisseur
        deleted: false, // Ne pas inclure les clients supprimés
      },
      include: [
        {
          model: TypeTiers,
          attributes: ["name"],
        },
        {
          model: City,
          attributes: ["value"],
        },
      ],
    });

    res.status(200).json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Supplier

const generatePassword = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
};

const createSupplier = async (req, res) => {
  const {
    name,
    code,
    address,
    postal_code,
    country,
    phone,
    mobile,
    fax,
    email,
    cityID,
    tax_identification_number,
  } = req.body;
  const createdBy = null; // Assigner createdBy à null pour les livreurs

  try {
    // Vérifiez si le type "fournisseur" existe
    const typeSupplier = await TypeTiers.findOne({
      where: { name: "fournisseur", deleted: false },
    });
    if (!typeSupplier) {
      return res
        .status(400)
        .json({ error: 'Type "fournisseur" does not exist' });
    }

    // Vérifiez si l'email existe déjà
    const existingSupplier = await Tiers.findOne({ where: { email } });
    if (existingSupplier) {
      const emailSubject = "Bienvenue chez nous !";
      const emailText = `Bonjour ${existingSupplier.name},\n\nBienvenue chez nous !\n\nCordialement,\nVotre équipe`;

      // Envoi d'un email au fournisseur existant
      await sendEmail(existingSupplier.email, emailSubject, emailText);

      return res.status(400).json({ error: "Email already exists" });
    }

    // Generate unique username for supplier
    const user_name = await generateUserName(name, email);

    // Génération et hashage du mot de passe
    const generatedPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Création du nouveau fournisseur
    const newSupplier = await Tiers.create({
      name,
      user_name,
      type_tiersID: typeSupplier.id,
      code,
      address,
      postal_code,
      country,
      phone,
      mobile,
      fax,
      email,
      cityID,
      tax_identification_number,
      block: false,
      password: hashedPassword,
      deleted: false,
      createdBy, // Assigner createdBy à null
    });

    // Envoi d'un email au nouveau fournisseur avec ses informations de connexion
    const emailSubject = "Bienvenue sur notre plateforme !";
    const emailText = `Bonjour ${newSupplier.name},\n\nBienvenue sur notre plateforme !\n\nVotre login : ${newSupplier.name}\nVotre mot de passe : ${generatedPassword}\n\nCordialement,\nVotre équipe`;

    // Envoi de l'email
    await sendEmail(newSupplier.email, emailSubject, emailText);

    res.status(201).json({ newSupplier, generatedPassword });
  } catch (error) {
    console.error("Erreur lors de la création du fournisseur:", error);
    res.status(400).json({ error: error.message });
  }
};

const uploadSupplier = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    code,
    address,
    postal_code,
    country,
    phone,
    mobile,
    fax,
    email,
    cityID,
    tax_identification_number,
  } = req.body;

  try {
    const supplier = await Tiers.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    if (email && email !== supplier.email) {
      const existingSupplier = await Tiers.findOne({
        where: { email, id: { [Op.ne]: id } },
      });
      if (existingSupplier) {
        return res
          .status(400)
          .json({ error: "Email already exists for another supplier" });
      }
    }

    const updatedSupplier = {
      name: name || supplier.name,
      code: code || supplier.code,
      address: address || supplier.address,
      postal_code: postal_code || supplier.postal_code,
      country: country || supplier.country,
      phone: phone || supplier.phone,
      mobile: mobile || supplier.mobile,
      tax_identification_number:
        tax_identification_number || supplier.tax_identification_number,
      fax: fax || supplier.fax,
      email: email || supplier.email,
      cityID: cityID || supplier.cityID,
    };

    const changesMessage = getChangesMessage(supplier, updatedSupplier);

    await supplier.update(updatedSupplier);

    // Envoyer un email au fournisseur avec les détails des modifications
    const emailSubject = "Mise à jour de vos informations";
    const emailText = `Bonjour ${supplier.name},\n\nNous avons mis à jour vos informations. Voici les changements effectués :\n\n${changesMessage}\n\nCordialement,\nVotre équipe`;

    await sendEmail(supplier.email, emailSubject, emailText);

    res.status(200).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getSupplierById = async (req, res) => {
  const { id } = req.params;

  try {
    const supplier = await Tiers.findByPk(id, {
      include: [
        { model: TypeTiers, attributes: ["name"] },
        { model: City, attributes: ["value"] },
      ],
    });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllSuppliers = async (req, res) => {
  try {
    // Vérifiez si le type "fournisseur" existe
    const typeSupplier = await TypeTiers.findOne({
      where: { name: "fournisseur" },
    });
    if (!typeSupplier) {
      return res
        .status(400)
        .json({ error: 'Type "fournisseur" does not exist' });
    }

    // Récupérez tous les fournisseurs qui ne sont pas supprimés
    const suppliers = await Tiers.findAll({
      where: { type_tiersID: typeSupplier.id, deleted: false },
      include: [
        { model: TypeTiers, attributes: ["name"] },
        { model: City, attributes: ["value"] },
      ],
    });

    res.status(200).json(suppliers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer (logiquement) un article
const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await Tiers.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    await supplier.update({ deleted: true });
    res.status(200).json({ message: "supplier deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTier,
  getAllTiers,
  getTierById,
  updateTier,
  deleteTier,

  //crud client
  createClient,
  updateClient,
  getAllClients,
  getClientById,
  getAllClientsForSupplier,

  //crud fournisseur
  createSupplier,
  uploadSupplier,
  getAllSuppliers,
  getSupplierById,
  deleteSupplier,

  checkUserName,
};
