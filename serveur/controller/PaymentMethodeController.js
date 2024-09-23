const PaymentMethod = require('../Models/PaymentMethodModel');





const getAllPaymentMethods = async (req, res) => {
    const id_supplier = req.user.id; // Récupérer l'id du fournisseur connecté

    try {
        const paymentMethods = await PaymentMethod.findAll({
            where: { id_supplier,
                deleted: false },
        });
        res.json(paymentMethods);
    } catch (error) {
        console.error('Erreur lors de la récupération des méthodes de paiement:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des méthodes de paiement.' });
    }
};

const getPaymentMethodById = async (req, res) => {
    const { id } = req.params;
    try {
        const paymentMethod = await PaymentMethod.findByPk(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Méthode de paiement non trouvée.' });
        }
        res.json(paymentMethod);
    } catch (error) {
        console.error(`Erreur lors de la récupération de la méthode de paiement avec l'ID ${id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la méthode de paiement.' });
    }
};

const createPaymentMethod = async (req, res) => {
    const { value } = req.body;
    const id_supplier = req.user.id;

    try {
        const newPaymentMethod = await PaymentMethod.create({ value, id_supplier , deleted: false });
        res.status(201).json(newPaymentMethod);
    } catch (error) {
        console.error('Erreur lors de la création de la méthode de paiement:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la méthode de paiement.' });
    }
};

const updatePaymentMethod = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    try {
        let paymentMethod = await PaymentMethod.findByPk(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Méthode de paiement non trouvée.' });
        }
        paymentMethod.value = value;
        await paymentMethod.save();
        res.json(paymentMethod);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la méthode de paiement avec l'ID ${id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la méthode de paiement.' });
    }
};

const deletePaymentMethod = async (req, res) => {
    const { id } = req.params;
    try {
        let paymentMethod = await PaymentMethod.findByPk(id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Méthode de paiement non trouvée.' });
        }
        await paymentMethod.update({ deleted: true });
        res.json({ message: `Méthode de paiement avec l'ID ${id} marquée comme supprimée.` });
    } catch (error) {
        console.error(`Erreur lors de la suppression de la méthode de paiement avec l'ID ${id}:`, error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la méthode de paiement.' });
    }
};

module.exports = {
    getAllPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
};
