const bcrypt = require('bcrypt');
const User = require('../Models/UserModel');
const RoleUser = require('../Models/RoleUserModel');
const multer = require('multer');
const upload = require('../middleware/upload'); // Importer la configuration de Multer




const createUser = async (req, res) => {
    const { name, user_name, password, email, registration_number, cin, role_usersID, deleted } = req.body;
    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Traitement de la photo avec Multer
        upload.single('photo')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // Une erreur Multer s'est produite lors du téléchargement du fichier
                return res.status(400).json({ error: 'Une erreur est survenue lors du téléchargement du fichier.' });
            } else if (err) {
                // Une autre erreur s'est produite
                return res.status(500).json({ error: err.message });
            }

            // Tout s'est bien passé, continuer avec la création de l'utilisateur
            const newUser = await User.create({
                name,
                user_name,
                password: hashedPassword,
                email,
                photo: req.file ? req.file.path : null, // Stocker le chemin du fichier téléchargé
                registration_number,
                cin,
                role_usersID,
                deleted: false
            });
            res.status(201).json(newUser);
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                deleted: false
            },
            include: [
                { model: RoleUser, attributes: ['name'] }
            ]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lire un seul utilisateur par ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            where: { id },
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

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, user_name, password, email, photo, registration_number, cin, role_usersID, deleted } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hacher le mot de passe s'il est fourni
        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await user.update({
            name,
            user_name,
            password: hashedPassword,
            email,
            photo,
            registration_number,
            cin,
            role_usersID,
            deleted
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un utilisateur
const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: `Utilisateur avec l'ID ${id} non trouvé.` });
        }

        // Mettre à jour la colonne 'deleted' à 1
        await user.update({ deleted: 0 });

        res.json({ message: `Utilisateur avec l'ID ${id} a été marqué comme supprimé.` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
