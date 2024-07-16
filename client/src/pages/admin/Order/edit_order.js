import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormSelect,
} from '@coreui/react';

const EditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        code: '',
        date: '',
        customerID: '',
        observation: '',
        note: '',
        ID_payment_method: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [customers, setCustomers] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token non trouvé dans localStorage.');
                    return;
                }

                const response = await axios.get(`http://localhost:5001/Order/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const formattedData = { ...response.data, date: formatDateForInput(response.data.date) };
                setFormData(formattedData);
            } catch (error) {
                console.error(`Erreur lors de la récupération des détails de la commande avec l'ID ${id}:`, error);
            }
        };

        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:5001/Tier/');
                const allTiers = response.data;
                const filteredCustomers = allTiers.filter(tier => tier.TypeTier && tier.TypeTier.name === 'client');
                setCustomers(filteredCustomers);
            } catch (error) {
                console.error('Erreur lors de la récupération des clients:', error);
            }
        };

        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get('http://localhost:5001/PaymentMethode/');
                setPaymentMethods(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des méthodes de paiement:', error);
            }
        };

        fetchOrderDetails();
        fetchCustomers();
        fetchPaymentMethods();
    }, [id]);

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token non trouvé dans localStorage.');
                return;
            }

            const response = await axios.put(`http://localhost:5001/Order/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Réponse serveur:', response.data);
            navigate('/admin/list_order');
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error) {
                setModalMessage(error.response.data.error);
                setShowModal(true);
            } else {
                console.error('Erreur lors de la soumission du formulaire:', error);
            }
            if (error.message.includes('sendEmail')) {
                setModalMessage("Erreur lors de l'envoi de l'email de confirmation.");
                setShowModal(true);
            }
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Modifier</strong> <small>Commande</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3" onSubmit={handleSubmit}>
                            <CCol md={6}>
                                <CFormLabel htmlFor="code">Code</CFormLabel>
                                <CFormInput id="code" value={formData.code} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="date">Date</CFormLabel>
                                <CFormInput type="date" id="date" value={formData.date} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="customerID">Client</CFormLabel>
                                <CFormSelect id="customerID" value={formData.customerID} onChange={handleChange}>
                                    <option value="">Choisir...</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="ID_payment_method">Méthode de Paiement</CFormLabel>
                                <CFormSelect id="ID_payment_method" value={formData.ID_payment_method} onChange={handleChange}>
                                    <option value="">Choisir...</option>
                                    {paymentMethods.map((method) => (
                                        <option key={method.id} value={method.id}>
                                            {method.value}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol md={12}>
                                <CFormLabel htmlFor="observation">Observation</CFormLabel>
                                <CFormInput id="observation" value={formData.observation} onChange={handleChange} />
                            </CCol>
                            <CCol md={12}>
                                <CFormLabel htmlFor="note">Note</CFormLabel>
                                <CFormInput id="note" value={formData.note} onChange={handleChange} />
                            </CCol>
                            <CCol xs={12}>
                                <CButton color="primary" type="submit">
                                    Modifier
                                </CButton>
                            </CCol>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader>
                    <CModalTitle>Erreur</CModalTitle>
                </CModalHeader>
                <CModalBody>{modalMessage}</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Fermer
                    </CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default EditOrder;
