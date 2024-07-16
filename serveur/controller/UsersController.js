const bcrypt = require('bcryptjs');
const User = require('../Models/UserModel');
const RoleUser = require('../Models/RoleUserModel');



const createUser = async (req, res) => {
    const { name, user_name, password, email, registration_number, cin, role_usersID } = req.body;
    const photo = req.file ? req.file.filename : '';
    try {
        const roleUser = await RoleUser.findByPk(role_usersID);
        console.log(roleUser);
        if (!roleUser) {
            return res.status(400).json({ error: 'Invalid RoleUser ID' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            user_name,
            password: hashedPassword,
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
        // Récupérer l'utilisateur existant
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Vérifier l'existence du rôle utilisateur
        let updatedRoleUserID = user.role_usersID;
        if (role_usersID !== undefined) {
            const roleUser = await RoleUser.findByPk(role_usersID);
            if (!roleUser) {
                return res.status(400).json({ error: 'Invalid RoleUser ID' });
            }
            updatedRoleUserID = roleUser.id;
        }

        // Construire l'objet updatedUser avec les champs à mettre à jour
        const updatedUser = {
            name: name !== undefined ? name : user.name,
            user_name: user_name !== undefined ? user_name : user.user_name,
            password: password !== undefined ? await bcrypt.hash(password, 10) : user.password,
            email: email !== undefined ? email : user.email,
            registration_number: registration_number !== undefined ? registration_number : user.registration_number,
            cin: cin !== undefined ? cin : user.cin,
            role_usersID: updatedRoleUserID,
            photo: photo || user.photo,
            deleted: deleted !== undefined ? deleted : user.deleted
        };

        // Mettre à jour l'utilisateur avec les nouvelles valeurs
        await user.update(updatedUser);
        const updatedUserWithRole = await User.findByPk(id, {
            include: [{ model: RoleUser, attributes: ['name'] }]
        });

        // Répondre avec l'utilisateur mis à jour, y compris le nom du rôle utilisateur
        res.status(200).json(updatedUserWithRole);
    } catch (error) {
        // Capturer et renvoyer toute erreur rencontrée
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
