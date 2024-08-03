const bcrypt = require('bcryptjs');
const User = require('../Models/UserModel');
const RoleUser = require('../Models/RoleUserModel');
const Order = require('../Models/OrderModel')
const Tiers = require('../Models/TiersModel')
const State = require('../Models/StateModel')
const OrderState = require('../Models/OrderStateModel')
const sequelize = require('../config/database')
const {sendEmail} = require('../config/emailConfig');


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

const getOrdersByDeliveryPerson = async (req, res) => {
    try {
        const deliveryPersonId = req.user.id;

        if (!deliveryPersonId) {
            return res.status(403).json({ error: 'Utilisateur non authentifié' });
        }

        const deliveryPersonRole = await RoleUser.findOne({ where: { name: 'livreur' } });
        const deliveryPerson = await User.findOne({
            where: {
                id: deliveryPersonId,
                role_usersID: deliveryPersonRole.id,
                deleted: false,
            }
        });

        if (!deliveryPerson) {
            return res.status(403).json({ error: 'Accès interdit : Utilisateur non autorisé' });
        }

        const orders = await Order.findAll({
            where: {
                deliveryID: deliveryPersonId,
                deleted: false,
            },
            include: [
                {
                    model: Tiers,
                    as: 'customer',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Tiers,
                    as: 'supplier',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: State,
                    as: 'state',
                    attributes: ['id', 'value']
                }
            ]
        });

        if (!orders.length) {
            return res.status(404).json({ error: 'Aucune commande trouvée pour ce livreur' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
};

//change state order by livreur 
const changeOrderState = async (req, res) => {
    const { newState, newAddress } = req.body;
    const { orderId } = req.params;
    const userId = req.user.id;

    if (!userId) {
        return res.status(403).json({ error: 'Accès interdit : Utilisateur non authentifié' });
    }

    if (req.user.role !== 'livreur') {
        return res.status(403).json({ error: 'Accès interdit : Seuls les livreurs peuvent changer l\'état des commandes' });
    }

    const transaction = await sequelize.transaction();

    try {
        const order = await Order.findOne({
            where: {
                id: orderId,
                deleted: false,
                deliveryID: userId
            },
            include: [
                {
                    model: State,
                    as: 'state',
                    attributes: ['value']
                },
                {
                    model: Tiers,
                    as: 'customer',
                    attributes: ['email']
                }
            ]
        });

        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Commande non trouvée ou non assignée à ce livreur' });
        }

        const currentState = order.state.value.trim();
        const validTransitions = {
            'en cours de livraison': ['Livraison imminente'],
            'Livraison imminente': ['Adresse changée', 'Livraison effectuée'],
            'Adresse changée': ['Livraison effectuée']
        };

        const transitionsFromCurrent = validTransitions[currentState];
        const isValidTransition = transitionsFromCurrent?.includes(newState);

        if (!isValidTransition) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Transition d\'état invalide' });
        }

        const state = await State.findOne({
            where: {
                value: newState,
                deleted: false
            }
        });

        if (!state) {
            await transaction.rollback();
            return res.status(400).json({ error: `État "${newState}" non trouvé` });
        }

        if (newState === 'Adresse changée') {
            if (!newAddress) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Nouvelle adresse requise pour changer l\'état à "Adresse changée"' });
            }
            await order.update({ destination: newAddress, StatesID: state.id }, { transaction });
        } else {
            await order.update({ StatesID: state.id }, { transaction });
        }

        await OrderState.create({
            orderID: order.id,
            stateID: state.id,
            date: new Date()
        }, { transaction });

        await transaction.commit();

        if (newState === 'Livraison imminente') {
            const customerEmail = order.customer.email;
            const subject = 'Notification de livraison imminente';
            const message = `Votre commande (Code: ${order.code}) est prête, soyez attentif pour la recevoir demain.`;

            if (customerEmail) {
                sendEmail(customerEmail, subject, message)
                    .then(() => {
                        res.status(200).json({ message: 'État de la commande mis à jour avec succès et email envoyé' });
                    })
                    .catch(error => {
                        console.error('Erreur lors de l\'envoi de l\'email:', error);
                        res.status(200).json({ message: 'État de la commande mis à jour avec succès, mais échec de l\'envoi de l\'email' });
                    });
            } else {
                console.warn(`Le client de la commande ${order.code} n'a pas d'adresse email valide.`);
                res.status(200).json({ message: 'État de la commande mis à jour avec succès, mais le client n\'a pas d\'adresse email valide' });
            }
        } else {
            res.status(200).json({ message: 'État de la commande mis à jour avec succès' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'état de la commande:', error);
        try {
            await transaction.rollback();
        } catch (rollbackError) {
            console.error('Erreur lors du rollback de la transaction:', rollbackError);
        }
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};




module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getOrdersByDeliveryPerson,
    changeOrderState
};
