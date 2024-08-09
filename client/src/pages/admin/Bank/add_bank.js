import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const AddBank = () => {
    const [formData, setFormData] = useState({
        ref: '',
        value: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/Bank/', {
                ref: formData.ref,
                value: formData.value,
            });
            console.log('Réponse serveur:', response.data);
            // Afficher un message de succès ou rediriger l'utilisateur
            navigate('/admin/list_bank');
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message) {
                setModalMessage(error.response.data.message);
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
                        <strong>Ajouter</strong> <small>banque</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3" onSubmit={handleSubmit}>
                            <CCol md={6}>
                                <CFormLabel htmlFor="ref">Référence de la banque</CFormLabel>
                                <CFormInput id="ref" value={formData.ref} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="value">Valeur de la banque</CFormLabel>
                                <CFormInput id="value" value={formData.value} onChange={handleChange} />
                            </CCol>

                            <CCol xs={12}>
                                <CButton color="primary" type="submit">
                                    Ajouter
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

export default AddBank;
