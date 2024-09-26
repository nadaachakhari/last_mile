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
import { useAuth } from '../../../Middleware/Use_Auth';
const EditBank = () => {
    const { id } = useParams(); // Get reference from URL parameters for editing
    const navigate = useNavigate(); // For navigation
    const [formData, setFormData] = useState({
        value: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
 
    const { role } = useAuth();
    useEffect(() => {
        if (!role) {
            return; // N'exécutez rien tant que le rôle n'est pas récupéré
          }
      
          console.log('User role:', role);
      
          if (role !== 'fournisseur') {
            navigate('/unauthorized');
          }
        if (id) {
            // If there's a reference, fetch the existing bank details
            const fetchBank = async () => {
                try {
                    const response = await axios.get(`http://localhost:5001/Bank/${id}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error(`Erreur lors de la récupération des détails de la banque avec la référence ${id}:`, error);
                }
            };
            fetchBank();
        }
    }, [id,role,navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update the existing bank
            await axios.put(`http://localhost:5001/Bank/${id}`, formData);
            navigate('/list_bank'); // Navigate back to list after successful submission
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
                        <strong>Modifier</strong> <small>banque</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3" onSubmit={handleSubmit}>
                            <CCol md={6}>
                                <CFormLabel htmlFor="value">Valeur de la banque</CFormLabel>
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

export default EditBank;
