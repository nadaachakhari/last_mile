import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
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
    CButton
} from '@coreui/react';
import { useReactToPrint } from 'react-to-print';

const DisplayDeliveryExists = () => {
    const { orderID } = useParams();
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const componentRef = useRef();

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/DeliverySell/delivery/${orderID}`);
                setDelivery(response.data);
                console.log(response.data);
            } catch (error) {
                setError('Erreur lors de la récupération de la livraison.');
            } finally {
                setLoading(false);
            }
        };

        fetchDelivery();
    }, [orderID]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!delivery) {
        return <div>Aucune livraison trouvée.</div>;
    }

    const {
        code,
        date,
        observation,
        note,
        total_ttc,
        total_ht,
        customer = {},
        supplier = {},
        user = {},
        deliveryLines = []
    } = delivery;

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4" ref={componentRef}>
                    <CCardHeader>
                        <strong>Livraison</strong> <small>{code}</small>
                    </CCardHeader>
                    <CCardBody>
                        <p><strong>Date:</strong> {formatDate(date)}</p>
                        <p><strong>Client:</strong> {customer.name || 'Non défini'}</p>
                        <p><strong>Fournisseur:</strong> {supplier.name || 'Non défini'}</p>
                        <p><strong>Livreur:</strong> {user.name || 'Non défini'}</p>
                        <p><strong>Observation:</strong> {observation}</p>
                        <p><strong>Note:</strong> {note}</p>
                        <p><strong>Total TTC:</strong> {parseFloat(total_ttc).toFixed(2)} €</p>
                        <p><strong>Total HT:</strong> {parseFloat(total_ht).toFixed(2)} €</p>

                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Article Code</CTableHeaderCell>
                                    <CTableHeaderCell>Article Name</CTableHeaderCell>
                                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                                    <CTableHeaderCell>Sale HT</CTableHeaderCell>
                                    <CTableHeaderCell>Gross Amount</CTableHeaderCell>
                                    <CTableHeaderCell>VAT Value</CTableHeaderCell>
                                    <CTableHeaderCell>Sale TTC</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {deliveryLines.map((line, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>{line.article?.code || 'Non défini'}</CTableDataCell>
                                        <CTableDataCell>{line.article?.name || 'Non défini'}</CTableDataCell>
                                        <CTableDataCell>{line.quantity}</CTableDataCell>
                                        <CTableDataCell>{parseFloat(line.sale_ht).toFixed(2)} €</CTableDataCell>
                                        <CTableDataCell>{parseFloat(line.gross_amount).toFixed(2)} €</CTableDataCell>
                                        <CTableDataCell>{line.vat?.value || 'Non défini'}%</CTableDataCell>
                                        <CTableDataCell>{parseFloat(line.sale_ttc).toFixed(2)} €</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>

                        <CButton color="primary" onClick={handlePrint} className="mt-3">
                            Imprimer Livraison
                        </CButton>
                        <CButton color="secondary" onClick={() => navigate('/admin/list_order')} className="mt-3 ms-2">
                            Retourner à la Liste des Livraisons
                        </CButton>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DisplayDeliveryExists;
