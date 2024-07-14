const User = require('../Models/UserModel');
const RoleUser = require('../Models/RoleUserModel');

// Créer un nouvel utilisateur
const createUser = async (req, res) => {
    const { name, user_name, password, email, registration_number, cin, role_usersID } = req.body;
    const photo = req.file ? req.file.filename : '';
    try {
        const roleUser = await RoleUser.findByPk(role_usersID);
        console.log(roleUser);
        if (!roleUser) {
            return res.status(400).json({ error: 'Invalid RoleUser ID' });
        }
        const newUser = await User.create({
            name,
            user_name,
            password,
            email,
            photo,
            registration_number,
            cin,
            role_usersID,
            deleted: false
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { deleted: false },
            include: [
                { model: RoleUser, attributes: ['name'] }
            ]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            where: { id, deleted: false },
            include: [
                { model: RoleUser, attributes: ['name'] }
            ]
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, user_name, password, email, registration_number, cin, role_usersID, deleted } = req.body;
    const photo = req.file ? req.file.filename : '';
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const roleUser = await RoleUser.findByPk(role_usersID);
        if (!roleUser) {
            return res.status(400).json({ error: 'Invalid RoleUser ID' });
        }

        await user.update({
            name,
            user_name,
            password,
            email,
            registration_number,
            cin,
            role_usersID,
            photo: photo || user.photo,
            deleted: deleted !== undefined ? deleted : user.deleted
        });

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({ deleted: true });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
