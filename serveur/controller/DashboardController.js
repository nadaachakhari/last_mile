const Tiers = require('../Models/TiersModel');
const TypeTiers = require('../Models/TypeTiersModel');
const   Articles =require('../Models/ArticleModel');
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

  

module.exports = { countClientsBySupplier,countSuppliers,countArticleBySupplier };
