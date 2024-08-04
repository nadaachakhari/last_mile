import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CAlert,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { IoEyeSharp } from 'react-icons/io5';
import { FaExclamationTriangle } from 'react-icons/fa';

const ListClaims = () => {
    const [claims, setClaims] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const fetchClaims = async () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            setUserRole(role);

            if (!token) {
                console.error('Token non trouvé dans localStorage.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5001/Claim/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setClaims(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des réclamations:', error);
            }
        };

        fetchClaims();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
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
                        <strong>Liste</strong> <small>des Réclamations</small>
                    </CCardHeader>
                    <CCardBody>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>ID</CTableHeaderCell>
                                    <CTableHeaderCell>Client</CTableHeaderCell>
                                    <CTableHeaderCell>Commande</CTableHeaderCell>
                                    <CTableHeaderCell>Description</CTableHeaderCell>
                                    <CTableHeaderCell>Date de Réclamation</CTableHeaderCell>
                                    <CTableHeaderCell>Statut</CTableHeaderCell>
                                    <CTableHeaderCell>Réponse</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {claims.map((claim, index) => (
                                    <CTableRow key={claim.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{claim.Client.name}</CTableDataCell>
                                        <CTableDataCell>{claim.Order.code}</CTableDataCell>
                                        <CTableDataCell>{claim.description}</CTableDataCell>
                                        <CTableDataCell>{formatDate(claim.dateClaim)}</CTableDataCell>
                                        <CTableDataCell>{claim.StatutClaim.value}</CTableDataCell>
                                        <CTableDataCell>
                                            {claim.answer ? claim.answer : 'Pas de réponse'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <Link to={`/admin/display_claim/${claim.Order.id}`}>
                                                <CButton size="md" color="info" className="me-2">
                                                    <IoEyeSharp className="icon-white icon-lg me-1" />
                                                </CButton>
                                            </Link>
                                            {userRole === 'Administrateur' && (
                                                <Link to={`/admin/edit_claim/${claim.id}`}>
                                                    <CButton size="md" color="warning">
                                                        Répondre
                                                    </CButton>
                                                </Link>
                                            )}
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ListClaims;
