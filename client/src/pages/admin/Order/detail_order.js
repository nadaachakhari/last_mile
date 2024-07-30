import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
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
} from '@coreui/react';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token non trouvé dans localStorage.');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5001/order/ordrelines/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrder(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de la commande:', error);
            }
        };

        fetchOrderDetails();
    }, [id]);

    if (!order) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Détails de la Commande</strong>
                    </CCardHeader>
                    <CCardBody>
                        <h5>Informations de la Commande</h5>
                        <p><strong>Code:</strong> {order.order.code}</p>
                        <p><strong>Date:</strong> {formatDate(order.order.date)}</p>
                        <p><strong>Client:</strong> {order.order.customer.name}</p>
                        {/* <p><strong>Fournisseur:</strong> {order.order.supplier.name}</p> */}
                        <p><strong>Destination:</strong> {order.order.destination}</p>
                        <p><strong>Méthode de paiement:</strong> {order.order.PaymentMethod.name}</p>
                        <p><strong>État:</strong> {order.order.state.value}</p>
                        <p><strong>Observation:</strong> {order.order.observation}</p>
                        <p><strong>Note:</strong> {order.order.note}</p>
                        <p><strong>Montant total:</strong> {order.order.total_amount}</p>

                        <h5>Lignes de Commande</h5>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>ID</CTableHeaderCell>
                                    <CTableHeaderCell>Article</CTableHeaderCell>
                                    <CTableHeaderCell>Quantité</CTableHeaderCell>
                                    <CTableHeaderCell>Montant Brut</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {order.orderLignes.map((ligne, index) => (
                                    <CTableRow key={ligne.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{ligne.article.name}</CTableDataCell>
                                        <CTableDataCell>{ligne.quantity}</CTableDataCell>
                                        <CTableDataCell>{ligne.gross_amount}</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>

                        <Link to="/admin/list_order">
                            <CButton color="primary" className="mt-3">
                                Retour à la Liste des Commandes
                            </CButton>
                        </Link>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default OrderDetail;
