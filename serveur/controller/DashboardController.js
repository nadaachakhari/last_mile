const Tiers = require('../Models/TiersModel');
const TypeTiers = require('../Models/TypeTiersModel');
const   Articles =require('../Models/ArticleModel');
const Order=require('../Models/OrderModel');
const Claim= require('../Models/ClaimModel');
// afficher pour fournisseur
const countClientsBySupplier = async (req, res) => {
  try {
      if (!req.user || !req.user.id) {
          return res.status(400).json({ message: 'User not authenticated or invalid.' });
      }

      const id_supplier = req.user.id;

      const clientCount = await Tiers.count({
          where: { createdBy: id_supplier } 
      });
      res.status(200).json({ id_supplier, clientCount });
  } catch (error) {

      console.error('Erreur lors du comptage des clients:', error);
      res.status(500).json({ message: 'Erreur lors du comptage des clients.', error: error.message });
  }
};
const countArticleBySupplier = async (req, res) => {
  try {
     
      if (!req.user || !req.user.id) {
          return res.status(400).json({ message: 'User not authenticated or invalid.' });
      }
      const id_supplier = req.user.id;
      const ArticleCount = await Articles.count({
          where: { id_supplier: id_supplier } 
      });
      res.status(200).json({ id_supplier, ArticleCount });
  } catch (error) {
      console.error('Erreur lors du comptage des Article:', error);
      res.status(500).json({ message: 'Erreur lors du comptage des Article.', error: error.message });
  }
};
const totalCommandsBySupplier = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated or invalid.' });
  }

  const id_supplier = req.user.id;

    const totalCommands = await Order.count({
      where: {
        supplierID: id_supplier,  // Filtrer par supplierID
      },
    });

    res.json({ totalCommands });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
};


//afficher pour admin 
const countSuppliers = async (req, res) => {
  try {
  
    const supplierCount = await Tiers.count({
      include: [
        {
          model: TypeTiers,
          where: { name: 'fournisseur' } 
        }
      ],
      where: { deleted: false } 
    });
    res.status(200).json({ supplierCount });
  } catch (error) {
    console.error('Erreur lors du comptage des fournisseurs:', error);
    res.status(500).json({ message: 'Erreur lors du comptage des fournisseurs.', error: error.message });
  }
};
const countClaims = async (req, res) => {
  try {
    // Compter le nombre total de réclamations dans la table Claims
    const totalClaims = await Claim.count({
    });

    res.status(200).json({ totalClaims });  // Retourner le nombre total de réclamations
  } catch (error) {
    console.error('Erreur lors du comptage des réclamations:', error);
    res.status(500).json({ message: 'Erreur lors du comptage des réclamations.', error: error.message });
  }
};

//afficher pour livreur
const countOrdersByDeliveryPerson = async (req, res) => {
  try {
      if (!req.user || !req.user.id) {
          return res.status(400).json({ message: 'User not authenticated or invalid.' });
      }

      const deliveryPersonId = req.user.id; // Assuming the delivery person's ID is obtained from the user token

      // Count the number of orders assigned to the delivery person
      const orderCount = await Order.count({
          where: { deliveryID: deliveryPersonId }  // Assuming 'deliveryID' is the foreign key in the 'Order' table
      });

      res.status(200).json({ deliveryPersonId, orderCount });
  } catch (error) {
      console.error('Erreur lors du comptage des commandes:', error);
      res.status(500).json({ message: 'Erreur lors du comptage des commandes.', error: error.message });
  }
};

  

module.exports = { countClientsBySupplier,countSuppliers,countArticleBySupplier,totalCommandsBySupplier 
  , countOrdersByDeliveryPerson,countClaims };

