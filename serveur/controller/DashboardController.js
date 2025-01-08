const Tiers = require('../Models/TiersModel');
const TypeTiers = require('../Models/TypeTiersModel');
const   Articles =require('../Models/ArticleModel');
const Order=require('../Models/OrderModel');
const Claim= require('../Models/ClaimModel');
const State =require('../Models/StateModel');
const  RoleUsers =require('../Models/RoleUserModel');
const  User =require('../Models/UserModel');
const sequelize = require("../config/database");
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
const countAdmin = async (req, res) => {
  try {
  
    const adminCount = await User.count({
      include: [
        {
          model: RoleUsers,
          where: { name: 'Administrateur' } 
        }
      ],
      where: { deleted: false } 
    });
    res.status(200).json({ adminCount });
  } catch (error) {
    console.error('Erreur lors du comptage des Administrateur:', error);
    res.status(500).json({ message: 'Erreur lors du comptage des Administrateur.', error: error.message });
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
const countOrdersByState = async (req, res) => {
  try {
      // Retrieve all states to ensure we get a complete list
      const states = await State.findAll({
          attributes: ['id', 'value'],
      });

      // Count orders by state, including states with 0 orders
      const orderCounts = await Order.findAll({
          attributes: [
              'StatesID',
              [sequelize.fn('COUNT', sequelize.col('Order.id')), 'count'],
          ],
          group: 'StatesID',
          include: [
              {
                  model: State,
                  as: 'state',
                  attributes: ['id', 'value'],
              },
          ],
          raw: true,
      });

      // Create a map to match order counts to state IDs
      const countsMap = orderCounts.reduce((map, order) => {
          map[order['StatesID']] = order['count'];
          return map;
      }, {});

      // Combine states and counts to ensure all states are represented
      const result = states.map(state => ({
          state: { id: state.id, value: state.value },
          count: countsMap[state.id] || 0, // Default to 0 if no orders
      }));

      // Send the result to the client
      res.json(result);
  } catch (error) {
      console.error("Erreur lors du comptage des commandes par état :", error.message || error);
      res.status(500).json({ message: 'Erreur lors du comptage des commandes' });
  }
};
const countTotalOrders = async (req, res) => {
  try {
    // Count the total number of orders in the Orders table
    const totalOrders = await Order.count();

    // Return the total count of orders
    res.status(200).json({ totalOrders });
  } catch (error) {
    console.error('Erreur lors du comptage des commandes:', error);
    res.status(500).json({ message: 'Erreur lors du comptage des commandes.', error: error.message });
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
const countOrdersByClientForSupplier = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated or invalid.' });
    }

    const id_supplier = req.user.id; // ID du fournisseur connecté

    // Récupérer le nombre de commandes groupées par client pour le fournisseur connecté
    const ordersByClient = await Order.findAll({
      attributes: [
        'customerID',
        [sequelize.fn('COUNT', sequelize.col('Order.id')), 'orderCount']
      ],
      where: { supplierID: id_supplier }, // Filtrer par fournisseur
      group: ['customerID'], // Grouper par client
      include: [
        {
          model: Tiers,
          as: 'customer', // Assurez-vous que l'association pour le client est correctement définie
          attributes: ['id', 'name'] // Inclure les informations sur le client
        }
      ],
      raw: true
    });

    // Structurer les résultats
    const result = ordersByClient.map(order => ({
      client: {
        id: order['customer.id'],
        name: order['customer.name']
      },
      orderCount: order['orderCount']
    }));

    res.status(200).json({ supplierId: id_supplier, ordersByClient: result });
  } catch (error) {
    console.error('Erreur lors du comptage des commandes par client:', error);
    res.status(500).json({ message: 'Erreur lors du comptage des commandes par client.', error: error.message });
  }
};
const countOrdersByClientAddressbysupplier = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated or invalid.' });
    }

    const id_supplier = req.user.id; // ID of the connected supplier

    // Count orders grouped by client address
    const ordersByAddress = await Order.findAll({
      attributes: [
        [sequelize.col('customer.address'), 'clientAddress'], // Assuming the address is in the 'Tiers' table under 'customer'
        [sequelize.fn('COUNT', sequelize.col('Order.id')), 'orderCount']
      ],
      where: { supplierID: id_supplier }, // Filter by supplier
      group: ['customer.address'], // Group by address
      include: [
        {
          model: Tiers,
          as: 'customer', // Ensure this association is correctly defined
          attributes: [] // No need to include all customer fields, just the address
        }
      ],
      raw: true
    });

    // Format the result
    const result = ordersByAddress.map(order => ({
      clientAddress: order.clientAddress,
      orderCount: order.orderCount
    }));

    res.status(200).json({ supplierId: id_supplier, ordersByAddress: result });
  } catch (error) {
    console.error('Error counting orders by client address:', error);
    res.status(500).json({ message: 'Error counting orders by client address.', error: error.message });

  }const countOrdersByMonth = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(400).json({ message: 'User not authenticated or invalid.' });
      }
  
      const id_supplier = req.user.id; // ID du fournisseur connecté
  
      // Récupérer les commandes groupées par mois
      const ordersByMonth = await Order.findAll({
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'], // Extraire le mois et l'année
          [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'] // Compter les commandes
        ],
        where: { supplierID: id_supplier }, // Filtrer par fournisseur
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')], // Grouper par mois
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']], // Trier par mois
        raw: true
      });
  
      // Structurer les résultats
      const result = ordersByMonth.map(order => ({
        month: order.month,
        orderCount: parseInt(order.orderCount, 10)
      }));
  
      res.status(200).json({ supplierId: id_supplier, ordersByMonth: result });
    } catch (error) {
      console.error('Erreur lors du comptage des commandes par mois:', error);
      res.status(500).json({ message: 'Erreur lors du comptage des commandes par mois.', error: error.message });
    }
  };
  
};
const countOrdersByClientAddress = async (req, res) => {
  try {
    
    // Count orders grouped by client address
    const ordersByAddress = await Order.findAll({
      attributes: [
        [sequelize.col('customer.address'), 'clientAddress'], // Assuming the address is in the 'Tiers' table under 'customer'
        [sequelize.fn('COUNT', sequelize.col('Order.id')), 'orderCount']
      ],
      
      group: ['customer.address'], // Group by address
      include: [
        {
          model: Tiers,
          as: 'customer', // Ensure this association is correctly defined
          attributes: [] // No need to include all customer fields, just the address
        }
      ],
      raw: true
    });

    // Format the result
    const result = ordersByAddress.map(order => ({
      clientAddress: order.clientAddress,
      orderCount: order.orderCount
    }));

    res.status(200).json({  ordersByAddress: result });
  } catch (error) {
    console.error('Error counting orders by client address:', error);
    res.status(500).json({ message: 'Error counting orders by client address.', error: error.message });

  }
  
};
const countOrdersByMonth = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated or invalid.' });
    }

    const id_supplier = req.user.id; // ID du fournisseur connecté

    // Récupérer les commandes groupées par mois
    const ordersByMonth = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'month'], // Utiliser 'date' pour extraire le mois et l'année
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'] // Compter les commandes
      ],
      where: { supplierID: id_supplier }, // Filtrer par fournisseur
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m')], // Grouper par mois
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'ASC']], // Trier par mois
      raw: true
    });

    // Structurer les résultats
    const result = ordersByMonth.map(order => ({
      month: order.month,
      orderCount: parseInt(order.orderCount, 10)
    }));

    res.status(200).json({ supplierId: id_supplier, ordersByMonth: result });
  } catch (error) {
    console.error('Erreur lors du comptage des commandes par mois:', error);
    res.status(500).json({ message: 'Erreur lors du comptage des commandes par mois.', error: error.message });
  }
};

const countOrdersByDay = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated or invalid.' });
    }

    const id_supplier = req.user.id; // ID du fournisseur connecté

    // Récupérer les commandes groupées par jour
    const ordersByDay = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m-%d'), 'day'], // Utiliser 'date' pour extraire le jour (année-mois-jour)
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'] // Compter les commandes
      ],
      where: { supplierID: id_supplier }, // Filtrer par fournisseur
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m-%d')], // Grouper par jour
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m-%d'), 'ASC']], // Trier par jour
      raw: true
    });

    // Structurer les résultats
    const result = ordersByDay.map(order => ({
      day: order.day,
      orderCount: parseInt(order.orderCount, 10)
    }));

    res.status(200).json({ supplierId: id_supplier, ordersByDay: result });
  } catch (error) {
    console.error('Erreur lors du comptage des commandes par jour:', error);
    res.status(500).json({ message: 'Erreur lors du comptage des commandes par jour.', error: error.message });
  }
};

const countOrdersByStateAndAddress= async (req, res) =>  {
  try {
    const ordersCount = await Order.findAll({
      attributes: [
        'address', // Adresse du client
        'state',   // État de la commande
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'], // Compte des commandes
      ],
      include: [
        {
          model: Tiers,
          as: 'customer', // Assurez-vous que cette association est correctement définie
          attributes: ['name'], // Inclure des informations sur le client si nécessaire
        },
      ],
      where: {
        state: ['Livraison effectuée', 'Commande annulée'], // Filtre sur les états
      },
      group: ['address', 'state'], // Grouper par adresse et état
      raw: true, // Retourne un objet brut
    });

    // Organiser les résultats par adresse et état
    const result = {};
    ordersCount.forEach((order) => {
      const { address, state, orderCount } = order;
      if (!result[address]) {
        result[address] = {};
      }
      result[address][state] = parseInt(orderCount, 10);
    });

    return result;
  } catch (error) {
    console.error('Erreur lors du comptage des commandes :', error);
    throw error;
  }
}



  

module.exports = { countClientsBySupplier,countSuppliers,countArticleBySupplier,totalCommandsBySupplier 
  , countOrdersByDeliveryPerson,countClaims,countOrdersByState,countTotalOrders ,countAdmin,countOrdersByClientForSupplier,
  countOrdersByClientAddress,countOrdersByMonth,countOrdersByDay,countOrdersByClientAddressbysupplier,
  countOrdersByStateAndAddress};

