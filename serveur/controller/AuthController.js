const User = require("../Models/UserModel");
const Tiers = require("../Models/TiersModel");
const TypeTiers = require("../Models/TypeTiersModel");
const City = require("../Models/CityModel");
const RoleUser = require("../Models/RoleUserModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const authenticate = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Rechercher l'utilisateur dans les deux tables
    const user = await User.findOne({
      where: { user_name: username },
      include: [{ model: RoleUser, attributes: ["name"] }],
    });
    const tiers = await Tiers.findOne({
      where: { user_name: username },
      include: [
        { model: TypeTiers, attributes: ["name"] },
        { model: City, attributes: ["value"] },
      ],
    });
console.log("user", user);
console.log("tiers",tiers);


    if (!user && !tiers) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe pour l'utilisateur trouvé
    const entity = user || tiers;
    const isPasswordValid = await bcrypt.compare(password, entity.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Déterminer le rôle et la page de redirection
    let role;
    let redirectTo;
    let nameTiers;
    let nameusers;
    if (user) {
      role = user.RoleUser.name === "Administrateur" ? "Administrateur" : "livreur";
      redirectTo = role === "Administrateur" ? "/dashboard" : "/admin/list_order";
      nameusers = user.name;
    } else if (tiers) {
      role = tiers.TypeTier.name === "client" ? "client" : "fournisseur";
      redirectTo = role === "client" ? "/admin/list_order" : "/dashboard";
      nameTiers = tiers.name;
    }

    // Générer un token JWT
    const token = jwt.sign(
      {
        id: entity.id,
        username: entity.user_name || entity.name,
        name: entity.name,
        role,
        nameTiers,
        nameusers,
      },
      "HEX",
      { expiresIn: "24h" }
    );
    
    res
      .status(200)
      .json({
        message: "Connexion réussie",
        token,
        redirectTo,
        role,
        nameTiers,
        nameusers,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//authenticateToken
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, "HEX", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isLivreur = (req, res, next) => {
  if (req.user.role !== 'livreur') {
    return res.sendStatus(403);
  }
  next();
};



//changePassword
const changePassword = async (req, res) => {
  const userId = req.user.id; // Obtenir l'ID de l'utilisateur authentifié depuis le token
  const { oldPassword, newPassword } = req.body;

  try {
      // Rechercher l'utilisateur dans les deux tables
      const user = await User.findByPk(userId);
      const tiers = await Tiers.findByPk(userId);

      if (!user && !tiers) {
          return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      // Vérifier l'ancien mot de passe pour l'utilisateur trouvé
      const entity = user || tiers;
      const isPasswordValid = await bcrypt.compare(oldPassword, entity.password);

      if (!isPasswordValid) {
          return res.status(401).json({ error: "Ancien mot de passe incorrect" });
      }

      // Hash le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe dans la base de données
      entity.password = hashedPassword;
      await entity.save();

      res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
//


module.exports = {
  authenticate,
  authenticateToken,
  changePassword,
  isLivreur
};
