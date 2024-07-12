const  State  = require('../Models/StateModel');



const getAllStates = async (req, res) => {
    try {
        const states = await State.findAll({
            where: { deleted: false },
        });
        res.json(states);
    } catch (error) {
        console.error('Erreur lors de la récupération des états:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des états' });
    }
};

const getStateById = async (req, res) => {
    const { id } = req.params;
    try {
        const state = await State.findByPk(id);
        if (state) {
            res.json(state);
        } else {
            res.status(404).json({ error: `Aucun état trouvé avec l'ID ${id}` });
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'état avec l'ID ${id}:`, error);
        res.status(500).json({ error: `Erreur serveur lors de la récupération de l'état avec l'ID ${id}` });
    }
};


const createState = async (req, res) => {
    const { value } = req.body;
    try {
        const newState = await State.create({ value, deleted: false });
        res.status(201).json(newState);
    } catch (error) {
        console.error('Erreur lors de la création de l\'état:', error);
        res.status(400).json({ error: 'Erreur lors de la création de l\'état' });
    }
};



const updateState = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    try {
        const state = await State.findByPk(id);
        if (state) {
            await state.update({ value });
            res.json(state);
        } else {
            res.status(404).json({ error: `Aucun état trouvé avec l'ID ${id}` });
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'état avec l'ID ${id}:`, error);
        res.status(400).json({ error: `Erreur lors de la mise à jour de l'état avec l'ID ${id}` });
    }
};


const deleteState = async (req, res) => {
    const { id } = req.params;
    try {
        const state = await State.findByPk(id);
        if (state) {
            await state.update({ deleted: true });
            res.json({ message: `État avec l'ID ${id} marqué comme supprimé` });
        } else {
            res.status(404).json({ error: `Aucun état trouvé avec l'ID ${id}` });
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'état avec l'ID ${id}:`, error);
        res.status(400).json({ error: `Erreur lors de la suppression de l'état avec l'ID ${id}` });
    }
};

module.exports = {
    getAllStates,
    getStateById,
    createState,
    updateState,
    deleteState,
};
