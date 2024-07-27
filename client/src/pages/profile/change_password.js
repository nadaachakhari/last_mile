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
    CModalFooter
} from '@coreui/react';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: ''
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
            const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké dans le localStorage lors de la connexion
            const response = await axios.put('http://localhost:5001/Authenticate/change-password', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Réponse serveur:', response.data);
            setModalMessage('Mot de passe mis à jour avec succès');
            setShowModal(true);
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error) {
                setModalMessage(error.response.data.error);
                setShowModal(true);
            } else {
                console.error('Erreur lors de la soumission du formulaire:', error);
                setModalMessage('Erreur lors de la soumission du formulaire');
                setShowModal(true);
            }
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Changer</strong> <small>Mot de passe</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3" onSubmit={handleSubmit}>
                            <CCol md={6}>
                                <CFormLabel htmlFor="oldPassword">Ancien mot de passe</CFormLabel>
                                <CFormInput type="password" id="oldPassword" value={formData.oldPassword} onChange={handleChange} required />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="newPassword">Nouveau mot de passe</CFormLabel>
                                <CFormInput type="password" id="newPassword" value={formData.newPassword} onChange={handleChange} required />
                            </CCol>
                            <CCol xs={12}>
                                <CButton color="primary" type="submit">
                                    Changer le mot de passe
                                </CButton>
                            </CCol>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader>
                    <CModalTitle>Message</CModalTitle>
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

export default ChangePassword;
