import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell, CTableHeaderCell, CTableRow, CAlert } from '@coreui/react';

const DisplayClaim = () => {
    const { orderID } = useParams();
    const [claim, setClaim] = useState(null);
    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClaimAndOrder = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch claim details
                const claimResponse = await axios.get(`http://localhost:5001/Claim/${orderID}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setClaim(claimResponse.data);

                // Fetch order details
                const orderResponse = await axios.get(`http://localhost:5001/Order/ordrelines/${orderID}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setOrder(orderResponse.data);

                // Fetch status details
                const statusResponse = await axios.get(`http://localhost:5001/StatutClaim/statutclaims/${claimResponse.data.statutID}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStatus(statusResponse.data);

            } catch (error) {
                setError('Erreur lors de la récupération des détails.');
            }
        };

        fetchClaimAndOrder();
    }, [orderID]);

    if (error) {
        return <CAlert color="danger">{error}</CAlert>;
    }

    if (!claim || !order || !status) {
        return <div>Chargement...</div>;
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Détails de la Réclamation</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CTable responsive>
                            <CTableBody>
                                <CTableRow>
                                    <CTableHeaderCell>Description</CTableHeaderCell>
                                    <CTableDataCell>{claim.description}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell>Réponse</CTableHeaderCell>
                                    <CTableDataCell>{claim.answer || 'Aucune réponse'}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell>Date de la Réclamation</CTableHeaderCell>
                                    <CTableDataCell>{claim.dateClaim}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell>Observation</CTableHeaderCell>
                                    <CTableDataCell>{claim.observation}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell>Statut</CTableHeaderCell>
                                    <CTableDataCell>{status.value}</CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Détails de la Commande</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CTable responsive>
                            <CTableBody>
                                <CTableRow>
                                    <CTableHeaderCell>Date de la Commande</CTableHeaderCell>
                                    <CTableDataCell>{order.order.date}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell>Code de la Commande</CTableHeaderCell>
                                    <CTableDataCell>{order.order.code}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell>Quantité</CTableHeaderCell>
                                    <CTableDataCell>{order.orderLignes[0]?.quantity}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell>Code Article</CTableHeaderCell>
                                    <CTableDataCell>{order.orderLignes[0]?.article.code}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell>Nom Article</CTableHeaderCell>
                                    <CTableDataCell>{order.orderLignes[0]?.article.name}</CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DisplayClaim;
