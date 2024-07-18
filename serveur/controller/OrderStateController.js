const OrderState = require('../Models/OrderStateModel');
const Order = require('../Models/OrderModel');
const State = require('../Models/StateModel');
const Tiers = require('../Models/TiersModel');

const getAllOrderStates = async (req, res) => {
    try {
        const orderStates = await OrderState.findAll({
            include: [
                {
                    model: Order,
                    as: 'Order',
                    include: [
                        { model: Tiers, as: 'customer' }, 
                        { model: Tiers, as: 'supplier' }
                    ]
                },
                { model: State, as: 'State' }
            ]
        });
        res.json(orderStates);
    } catch (error) {
        console.error('Erreur lors de la récupération des états de commande:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des états de commande.' });
    }
};

const getOrderStateById = async (req, res) => {
    const { id } = req.params;
    try {
        const orderState = await OrderState.findByPk(id, {
            include: [
                {
                    model: Order,
                    as: 'Order',
                    include: [
                        { model: Tiers, as: 'customer' },
                        { model: Tiers, as: 'supplier' }
                    ]
                },
                { model: State, as: 'State' }
            ]
        });
        if (!orderState) {
            return res.status(404).json({ message: 'État de commande non trouvé.' });
        }
        res.json(orderState);
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'état de commande avec l'ID ${id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'état de commande.' });
    }
};

const deleteOrderState = async (req, res) => {
    const { id } = req.params;
    try {
        let orderState = await OrderState.findByPk(id);
        if (!orderState) {
            return res.status(404).json({ message: 'État de commande non trouvé.' });
        }
        await orderState.destroy();
        res.json({ message: `État de commande avec l'ID ${id} supprimé.` });
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'état de commande avec l'ID ${id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'état de commande.' });
    }
};

module.exports = {
    getAllOrderStates,
    getOrderStateById,
    deleteOrderState,
};
