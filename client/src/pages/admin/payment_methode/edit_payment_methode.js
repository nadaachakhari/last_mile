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
} from '@coreui/react';

const EditPaymentMethod = () => {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        value: '',
        deleted: 'false',
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (id) {
            const fetchPaymentMethod = async () => {
                try {
                    const response = await axios.get(`http://localhost:5001/PaymentMethode/${id}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error(`Erreur lors de la récupération des détails de la méthode de paiement avec l'ID ${id}:`, error);
                }
            };
            fetchPaymentMethod();
        }
    }, [id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update the existing payment method
            await axios.put(`http://localhost:5001/PaymentMethode/${id}`, formData);
            navigate('/admin/list_payment_methode');
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error) {
                setModalMessage(error.response.data.error);
                setShowModal(true);
            } else {
                console.error('Erreur lors de la soumission du formulaire:', error);
            }
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Modifier</strong> <small>méthode de paiement</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3" onSubmit={handleSubmit}>
                            <CCol md={6}>
                                <CFormLabel htmlFor="value">Nom de la méthode de paiement</CFormLabel>
                                <CFormInput id="value" value={formData.value} onChange={handleChange} />
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
                <CModalBody>
                    {modalMessage}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Fermer
                    </CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default EditPaymentMethod;
