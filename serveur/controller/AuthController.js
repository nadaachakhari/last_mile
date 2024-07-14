const User = require('../Models/UserModel');
const Tiers = require('../Models/TiersModel');
const TypeTiers = require('../Models/TypeTiersModel');
const City = require('../Models/CityModel');
const RoleUser = require('../Models/RoleUserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticate = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Rechercher l'utilisateur dans les deux tables
    const user = await User.findOne({ where: { user_name: username },
      include: [
          { model: RoleUser, attributes: ['name'] }
      ] });
    const tiers = await Tiers.findOne({
      where: { name: username },
      include: [
        { model: TypeTiers, attributes: ['name'] },
        { model: City, attributes: ['value'] }
      ]
    });

    if (!user && !tiers) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe pour l'utilisateur trouvé
    const entity = user || tiers;
    const isPasswordValid = await bcrypt.compare(password, entity.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Déterminer le rôle et la page de redirection
    let role;
    let redirectTo;
    let nameTiers;
    let nameusers;
    if (user) {
      role = user.RoleUser.name === 'admin' ? 'admin' : 'livreur'; 
      redirectTo = role === 'admin' ? '/dashboard' : '/dashboard';
      nameusers = user.name;
    } else if (tiers) {
      role = tiers.TypeTier.name === 'client' ? 'client' : 'fournisseur'; 
      redirectTo = role === 'client' ? '/dashboard' : '/dashboard';
      nameTiers = tiers.name;
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: entity.id, username: entity.user_name || entity.name, name: entity.name, role, nameTiers, nameusers },
      'votre_clé_secrète', 
      { expiresIn: '1h' } 
    );

    res.status(200).json({ message: 'Connexion réussie', token, redirectTo, role , nameTiers, nameusers});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { authenticate };
