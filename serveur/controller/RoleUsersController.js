const RoleUser = require('../Models/RoleUserModel');






const getRoleUsers = async (req, res, next) => {
    try {
        const roleUsers = await RoleUser.findAll({
            where: {
                deleted: 1
            }
        });
        res.json(roleUsers);
    } catch (error) {
        next(error);
    }
};

const getRoleUserById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const roleUser = await RoleUser.findByPk(id);
        if (!roleUser) {
            return res.status(404).json({ message: `Rôle d'utilisateur avec l'ID ${id} non trouvé.` });
        }
        res.json(roleUser);
    } catch (error) {
        next(error);
    }
};

const createRoleUser = async (req, res) => {
    try {
        const { name } = req.body;

        const newRoleUser = await RoleUser.create({ name, deleted: 1 });
        res.status(201).json(newRoleUser);
    } catch (error) {
        console.error('Error creating role_user:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const updateRoleUser = async (req, res, next) => {
    const { id } = req.params;
    const { name, deleted } = req.body;
    try {
        const roleUser = await RoleUser.findByPk(id);
        if (!roleUser) {
            return res.status(404).json({ message: `Rôle d'utilisateur avec l'ID ${id} non trouvé.` });
        }
        await roleUser.update({ name, deleted });
        res.json(roleUser);
    } catch (error) {
        next(error);
    }
};

const deleteRoleUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const roleUser = await RoleUser.findByPk(id);
        if (!roleUser) {
            return res.status(404).json({ message: `Rôle d'utilisateur avec l'ID ${id} non trouvé.` });
        }

        await roleUser.update({ deleted: 0 });

        res.json({ message: `Rôle d'utilisateur avec l'ID ${id} a été marqué comme supprimé.` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRoleUsers,
    getRoleUserById,
    createRoleUser,
    updateRoleUser,
    deleteRoleUser,
};
