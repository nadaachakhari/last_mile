const crypto = require('crypto');
const User = require('../Models/UserModel');
const Tiers = require('../Models/TiersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../config/emailConfig');
const { Op } = require('sequelize');

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    const tier = await Tiers.findOne({ where: { email } });

    if (!user && !tier) {
        return res.status(404).send('Utilisateur non trouvé');
    }

    const entity = user || tier;
    const token = jwt.sign({ id: entity.id }, 'HEX', { expiresIn: '30m' });
    const resetLink = `http://localhost:3000/#/reset_password/${token}`;
    const emailText = `Vous recevez cet email car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n
                       Veuillez cliquer sur le lien suivant, ou le copier dans votre navigateur pour compléter le processus:\n\n
                       ${resetLink}\n\n
                       Si vous n'avez pas demandé cela, veuillez ignorer cet email et votre mot de passe restera inchangé.\n`;

    try {
        await sendEmail(entity.email, 'Réinitialisation du mot de passe', emailText);
        res.status(200).send({
            message: 'Email envoyé. Le lien de réinitialisation du mot de passe est valide pour 30 minutes.',
            token: token
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).send('Erreur lors de l\'envoi de l\'email');
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, 'HEX');
        const user = await User.findOne({ where: { id: decoded.id } });
        const tier = await Tiers.findOne({ where: { id: decoded.id } });

        const entity = user || tier;
        if (!entity) {
            return res.status(400).send('Utilisateur non trouvé');
        }

        console.log(' password before save:', newPassword);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log('Hashed password before save:', hashedPassword);

        entity.password = hashedPassword;
        console.log(entity.password);
console.log("user", user);

        if (user) {
            await User.update({ password: hashedPassword }, { where: { id: entity.id } });
        } else {
            await Tiers.update({ password: hashedPassword }, { where: { id: entity.id } });
        }

        res.status(200).send('Le mot de passe a été réinitialisé');
    } catch (error) {
        res.status(400).send('Le token de réinitialisation du mot de passe est invalide ou a expiré');
    }
};


module.exports = {
    requestPasswordReset,
    resetPassword,
};
