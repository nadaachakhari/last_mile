const Tiers = require('../Models/TiersModel');
const TypeTiers = require('../Models/TypeTiersModel');
// afficher pour fournisseur
const countClientsBySupplier = async (req, res) => {
  try {
     
      // Ensure user is authenticated
      if (!req.user || !req.user.id) {
          return res.status(400).json({ message: 'User not authenticated or invalid.' });
      }

      const id_supplier = req.user.id;
      
      // Count clients associated with the supplier (using createdBy to match the supplier)
      const clientCount = await Tiers.count({
          where: { createdBy: id_supplier } // Remplacer id_supplier par createdBy
      });

      // Return the response in JSON format
      res.status(200).json({ id_supplier, clientCount });
  } catch (error) {
      // Log the error for debugging
      console.error('Erreur lors du comptage des clients:', error);
      
      // Return a more detailed error message if necessary
      res.status(500).json({ message: 'Erreur lors du comptage des clients.', error: error.message });
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

  

module.exports = { countClientsBySupplier,countSuppliers };
