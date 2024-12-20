const User = require("../Models/UserModel");
const Tiers = require("../Models/TiersModel");
const TypeTiers = require("../Models/TypeTiersModel");
const City = require("../Models/CityModel");
const RoleUser = require("../Models/RoleUserModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
// const authenticate = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     // Rechercher l'utilisateur dans les deux tables
//     const user = await User.findOne({
//       where: { user_name: username },
//       include: [{ model: RoleUser, attributes: ["name"] }],
//       attributes: ["password", "name"], 
//     });

//     const tiers = await Tiers.findOne({
//       where: { user_name: username },
//       include: [
//         { model: TypeTiers, attributes: ["name"] },
//         { model: City, attributes: ["value"] },
//       ],
//       attributes: ["password", "name", "activate"], 
//     });

//     if (!user && !tiers) {
//       return res.status(401).json({ error: "Utilisateur non trouvé" });
//     }

//     if (tiers && tiers.activate === 0) {
//       return res.status(403).json({
//         error: "Votre compte est désactivé. Veuillez contacter l'administrateur.",
//         activate: tiers.activate,
//       });
//     }

//     const entity = user || tiers;
//     const isPasswordValid = await bcrypt.compare(password, entity.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Mot de passe incorrect" });
//     }

//     let role;
//     let redirectTo;
//     let nameTiers;
//     let nameusers;

//     if (user) {
//       role = user.RoleUser.name === "Administrateur" ? "Administrateur" : "livreur";
//       redirectTo = role === "Administrateur" ? "/dashboard" : "/admin/list_order";
//       nameusers = user.name;
//     } else if (tiers) {
//       role = tiers.TypeTier.name === "client" ? "client" : "fournisseur";
//       redirectTo = role === "client" ? "/admin/list_order" : "/dashboard";
//       nameTiers = tiers.name;
//     }

//     const token = jwt.sign(
//       {
//         id: entity.id,
//         username: entity.user_name || entity.name,
//         name: entity.name,
//         role,
//         nameTiers,
//         nameusers,
//       },
//       "HEX", 
//       { expiresIn: "24h" }
//     );

//     res.status(200).json({
//       message: "Connexion réussie",
//       token,
//       redirectTo,
//       role,
//       nameTiers,
//       nameusers,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




// version cooraction sans activation
// const authenticate = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     // Rechercher l'utilisateur dans les deux tables
//     const user = await User.findOne({
//       where: { user_name: username },
//       include: [{ model: RoleUser, attributes: ["name"] }],
//     });
//     const tiers = await Tiers.findOne({
//       where: { user_name: username },
//       include: [
//         { model: TypeTiers, attributes: ["name"] },
//         { model: City, attributes: ["value"] },
//       ],
      
//     });
// console.log("user", user);
// console.log("tiers",tiers);


//     if (!user && !tiers) {
//       return res.status(401).json({ error: "Utilisateur non trouvé" });
//     }

//     // Vérifier le mot de passe pour l'utilisateur trouvé
//     const entity = user || tiers;
//     const isPasswordValid = await bcrypt.compare(password, entity.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Mot de passe incorrect" });
//     }

//     // Déterminer le rôle et la page de redirection
//     let role;
//     let redirectTo;
//     let nameTiers;
//     let nameusers;
//     if (user) {
//       role = user.RoleUser.name === "Administrateur" ? "Administrateur" : "livreur";
//       redirectTo = role === "Administrateur" ? "/dashboard" : "/admin/list_order";
//       nameusers = user.name;
//     } else if (tiers) {
//       role = tiers.TypeTier.name === "client" ? "client" : "fournisseur";
//       redirectTo = role === "client" ? "/admin/list_order" : "/dashboard";
//       nameTiers = tiers.name;
//     }

//     // Générer un token JWT
//     const token = jwt.sign(
//       {
//         id: entity.id,
//         username: entity.user_name || entity.name,
//         name: entity.name,
//         role,
//         nameTiers,
//         nameusers,
//       },
//       "HEX",
//       { expiresIn: "24h" }
//     );
    
//     res
//       .status(200)
//       .json({
//         message: "Connexion réussie",
//         token,
//         redirectTo,
//         role,
//         nameTiers,
//         nameusers,
//       });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
//new version test
const authenticate = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Search for the user in both tables (User and Tiers)
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
    //  attributes: ["activate", "password", "name"],
    });

    // If neither user nor tiers are found
    if (!user && !tiers) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    // Check if the Tiers account is inactive (only for Tiers)
    if (tiers && tiers.activate === false) {
      return res.status(403).json({
        error: "Votre compte est en attente de confirmation de l'administrateur.",
      });
    }

    // Determine the entity (either user or tiers)
    const entity = user || tiers;

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, entity.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Variables for role, redirection, and user/tier names
    let role, redirectTo, nameTiers = null, nameUsers = null;

    if (user) {
      // Handle logic for users (User table)
      role = user.RoleUser.name === "Administrateur" ? "Administrateur" : "livreur";
      redirectTo = role === "Administrateur" ? "/dashboard" : "/admin/list_order";
      nameUsers = user.name;
    } else if (tiers) {
      // Handle logic for Tiers (Tiers table)
      role = tiers.TypeTier.name === "client" ? "client" : "fournisseur";
      redirectTo = role === "client" ? "/admin/list_order" : "/dashboard";
      nameTiers = tiers.name;
    }

    // Generate a JWT token
    const token = jwt.sign(
      {

        id: entity.id,
        username: entity.user_name || entity.user_name,
        name: entity.name,
        role,
        nameTiers,
        nameUsers,
      },
      "HEX", // Secret key should be stored securely
      { expiresIn: "24h" }
    );

    // Send a successful response with the token and additional details
    return res.status(200).json({
      message: "Connexion réussie",
      token,
      redirectTo,
      role,
      nameTiers,
      nameUsers,
      activate: entity.activate !== undefined ? entity.activate : true, // Handle the 'activate' field for Tiers
    });

  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
};


// const authenticate = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     // Rechercher l'utilisateur dans les deux tables
//     const user = await User.findOne({
//       where: { user_name: username },
//       include: [{ model: RoleUser, attributes: ["name"] }],
//     });

//     const tiers = await Tiers.findOne({
//       where: { user_name: username },
//       include: [
//         { model: TypeTiers, attributes: ["name"] },
//         { model: City, attributes: ["value"] },
//       ],
//       attributes: ["activate", "password", "name"], // Inclure activate et password pour Tiers
//     });

//     // Vérifier si l'utilisateur ou le tiers a été trouvé
//     if (!user && !tiers) {
//       return res.status(401).json({ error: "Utilisateur non trouvé" });
//     }

//     // Vérifier si le tiers est désactivé (pour les comptes Tiers uniquement)
//     if (tiers && !tiers.activate) { // Vérification de activate
//       return res.status(403).json({
//         error: "Votre compte est en attente de confirmation de l'administrateur.",
//       });
//     }

//     // Vérifier le mot de passe
//     const entity = user || tiers; // entity contiendra soit l'utilisateur soit le tiers
//     const isPasswordValid = await bcrypt.compare(password, entity.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Mot de passe incorrect" });
//     }

//     // Variables à définir
//     let role;
//     let redirectTo;
//     let nameTiers;
//     let nameusers;

//     if (user) {
//       // Logique pour les utilisateurs (User)
//       role = user.RoleUser.name === "Administrateur" ? "Administrateur" : "livreur";
//       redirectTo = role === "Administrateur" ? "/dashboard" : "/admin/list_order";
//       nameusers = user.name;

//     // Générer un token JWT
//     const token = jwt.sign(
//       {
//         id: entity.id,
//         username: entity.user_name || entity.name,
//         name: entity.name,
//         role,
//         nameTiers,
//         nameusers,
//       },
//       "HEX",
//       { expiresIn: "24h" }
//     );
//       // On peut définir activate à true pour les utilisateurs
//       return res.status(200).json({
//         message: "Connexion réussie",
//         token, // Passer le rôle ici
//         redirectTo,
//         role,
//         nameTiers: null,
//         nameusers,
//         activate: true, // Comme 'User' n'a pas de champ 'activate', définissez-le à true ici
//       });
//     } else if (tiers) {
//       // Logique pour les comptes Tiers
//       role = tiers.TypeTier.name === "client" ? "client" : "fournisseur";
//       redirectTo = role === "client" ? "/admin/list_order" : "/dashboard";
//       nameTiers = tiers.name;

//       // On définit activate selon l'état de Tiers
//       return res.status(200).json({
//         message: "Connexion réussie",
//         token, // Passer le rôle ici
//         redirectTo,
//         role,
//         nameTiers,
//         nameusers: null,
//         activate: tiers.activate, // true si activé, sinon false
//       });
//     }

//     // Si aucun utilisateur ou tiers n'a été trouvé
//     res.status(401).json({ error: "Utilisateur non trouvé ou inactif" });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const authenticate = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Rechercher l'utilisateur dans les deux tables
//     const user = await User.findOne({
//       where: { user_name: username },
//       include: [{ model: RoleUser, attributes: ["name"] }],
//     });

//     const tiers = await Tiers.findOne({
//       where: { user_name: username },
//       include: [
//         { model: TypeTiers, attributes: ["name"] },
//         { model: City, attributes: ["value"] },
//       ],
//       attributes: ["activate", "password", "name"], // Inclure activate et password pour Tiers
//     });

//     // Vérifier si l'utilisateur ou le tiers a été trouvé
//     if (!user && !tiers) {
//       return res.status(401).json({ error: "Utilisateur non trouvé" });
//     }

//     // Vérifier si le tiers est désactivé (pour les comptes Tiers uniquement)
//     if (tiers && !tiers.activate) {
//       return res.status(403).json({
//         error: "Votre compte est en attente de confirmation de l'administrateur.",
//       });
//     }

//     // Vérifier le mot de passe
//     const entity = user || tiers;
//     const isPasswordValid = await bcrypt.compare(password, entity.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Mot de passe incorrect" });
//     }

//     // Définir les variables pour le rôle et la redirection
//     let role;
//     let redirectTo;
//     let nameTiers = null;
//     let nameUsers = null;



//     if (user) {
//       // Gestion pour les utilisateurs (User)
//       role = user.RoleUser.name === "Administrateur" ? "Administrateur" : "livreur";
//       redirectTo = role === "Administrateur" ? "/dashboard" : "/admin/list_order";
//       nameUsers = user.name;
//     } else if (tiers) {
//       // Gestion pour les comptes de type Tiers
//       role = tiers.TypeTier.name === "client" ? "client" : "fournisseur";
//       redirectTo = role === "client" ? "/admin/list_order" : "/dashboard";
//       nameTiers = tiers.name;
//     }

//     // Générer un token JWT
//     const token = jwt.sign(
//       {
//         id: entity.id,
//         username: entity.user_name || entity.name,
//         name: entity.name,
//         role,
//         nameTiers,
//         nameUsers,
//       },
//       "HEX", // Secret clé à sécuriser
//       { expiresIn: "24h" }
//     );

//     // Réponse réussie avec le token
//     return res.status(200).json({
//       message: "Connexion réussie",
//       token,
//       redirectTo,
//       role,
//       nameTiers,
//       nameUsers,
//       activate: entity.activate !== undefined ? entity.activate : true,
//     });

//   } catch (error) {
//     // Gestion des erreurs
//     res.status(500).json({ error: error.message });
//   }
// };




const generateToken = (entity, role) => {
  return jwt.sign(
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
  
};




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
