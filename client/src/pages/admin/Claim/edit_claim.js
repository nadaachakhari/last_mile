import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormLabel,
    CFormTextarea,
    CAlert,
    CFormSelect,
} from '@coreui/react';
import { useParams, useNavigate } from 'react-router-dom';

const EditClaim = () => {
    const { claimID } = useParams();
    const [claim, setClaim] = useState({});
    const [answer, setAnswer] = useState('');
    const [statutID, setStatutID] = useState('');
    const [statuts, setStatuts] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClaim = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token non trouvé dans localStorage.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5001/Claim/getClaimByClaimID/${claimID}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setClaim(response.data);
                setStatutID(response.data.StatutClaim.id);
                setAnswer(response.data.answer || '');
            } catch (error) {
                console.error('Erreur lors de la récupération de la réclamation:', error);
                setAlertMessage('Erreur lors de la récupération de la réclamation');
                setShowAlert(true);
            }
        };

        const fetchStatuts = async () => {
            try {
                const response = await axios.get('http://localhost:5001/StatutClaim/');
                setStatuts(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des statuts:', error);
            }
        };

        fetchClaim();
        fetchStatuts();
    }, [claimID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token non trouvé dans localStorage.');
            return;
        }

        try {
            await axios.put(`http://localhost:5001/Claim/${claimID}`, {
                answer,
                statutID
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            navigate('/admin/list_claim');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la réclamation:', error);
            setAlertMessage('Erreur lors de la mise à jour de la réclamation');
            setShowAlert(true);
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
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Éditer</strong> <small>Réclamation</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit}>
                            <CFormLabel htmlFor="answer">Réponse</CFormLabel>
                            <CFormTextarea
                                id="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                rows="4"
                            />
                            <CFormLabel htmlFor="statutID">Statut</CFormLabel>
                            <CFormSelect
                                id="statutID"
                                value={statutID}
                                onChange={(e) => setStatutID(e.target.value)}
                            >
                                {statuts.map(statut => (
                                    <option key={statut.id} value={statut.id}>
                                        {statut.value}
                                    </option>
                                ))}
                            </CFormSelect>
                            <CButton type="submit" color="primary" className="mt-3">Mettre à jour</CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default EditClaim;
