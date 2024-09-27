import React, { useState,useEffect  } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormLabel,
    CAlert
} from '@coreui/react';
import { useAuth } from '../../../Middleware/Use_Auth';
const AddClaim = () => {
    const [description, setDescription] = useState('');
    const [observation, setObservation] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { orderID } = useParams();
    const navigate = useNavigate();
    const { role } = useAuth();
    useEffect(() => {
        if (!role) {
          return; 
        }
    
        console.log('User role:', role);
    
        if (role !== 'client') {
          navigate('/unauthorized');
        }  
    },  [role, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token non trouvé dans localStorage.');
            return;
        }
console.log("token", token);

        try {
            const response = await axios.post(`http://localhost:5001/Claim/${orderID}`,
                {
                    description,
                    observation
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

            if (response.status === 201) {
                setSuccessMessage('Réclamation créée avec succès.');
                setShowAlert(false);
                setTimeout(() => {
                    navigate('/admin/list_order'); 
                }, 2500); 
            }
        } catch (error) {
            console.error('Erreur lors de la création de la réclamation :', error);
            setAlertMessage('Erreur lors de la création de la réclamation.');
            setShowAlert(true);
            setSuccessMessage('');
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                {showAlert && (
                    <CAlert color="danger" onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </CAlert>
                )}
                {successMessage && (
                    <CAlert color="success" onClose={() => setSuccessMessage('')} dismissible>
                        {successMessage}
                    </CAlert>
                )}
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Ajouter</strong> <small>une Réclamation</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel htmlFor="description">Description</CFormLabel>
                                <textarea
                                    id="description"
                                    rows="4"
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="observation">Observation</CFormLabel>
                                <textarea
                                    id="observation"
                                    rows="4"
                                    className="form-control"
                                    value={observation}
                                    onChange={(e) => setObservation(e.target.value)}
                                    required
                                />
                            </div>
                            <CButton type="submit" color="primary">Créer Réclamation</CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default AddClaim;
