import React, { useState, useEffect } from 'react';
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
const DisplayInvoiceExists = () => {
    const { orderID } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/Invoice/invoice/${orderID}`);
                setInvoice(response.data);
                console.log(response.data);
            } catch (error) {
                setError('Erreur lors de la récupération de la facture.');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
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

    if (!invoice) {
        return <div>Aucune facture trouvée.</div>;
    }

    const {
        code,
        date,
        observation,
        note,
        total_ttc,
        total_ht,
        total_net,
        order = {},
        invoiceLignes = []
    } = invoice;

    const customerName = order.customer?.name || 'Non défini';
    const supplierName = order.supplier?.name || 'Non défini';
    const paymentMethodValue = order.PaymentMethod?.value || 'Non défini';

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Facture</strong> <small>{code}</small>
                    </CCardHeader>
                    <CCardBody>
                        <p><strong>Date:</strong> {formatDate(date)}</p>
                        <p><strong>Client:</strong> {customerName}</p>
                        <p><strong>Fournisseur:</strong> {supplierName}</p>
                        <p><strong>Méthode de Paiement:</strong> {paymentMethodValue}</p>
                        <p><strong>Observation:</strong> {observation}</p>
                        <p><strong>Note:</strong> {note}</p>
                        <p><strong>Total TTC:</strong> {total_ttc} €</p>
                        <p><strong>Total HT:</strong> {total_ht} €</p>
                        <p><strong>Total Net:</strong> {total_net} €</p>

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
                                {invoiceLignes.map((line, index) => (
                                    <CTableRow key={index}>
                                        <CTableDataCell>{line.article?.code || 'Non défini'}</CTableDataCell>
                                        <CTableDataCell>{line.article?.name || 'Non défini'}</CTableDataCell>
                                        <CTableDataCell>{line.quantity}</CTableDataCell>
                                        <CTableDataCell>{line.sale_ht} €</CTableDataCell>
                                        <CTableDataCell>{line.gross_amount} €</CTableDataCell>
                                        <CTableDataCell>{line.vat?.value || 'Non défini'}%</CTableDataCell>
                                        <CTableDataCell>{line.sale_ttc} €</CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>

                       
            <CButton color="primary" onClick={handlePrint} className="mt-3">
              Imprimer Facture
            </CButton>
            <CButton color="secondary" onClick={() => navigate('/admin/list_order')} className="mt-3 ms-2">
              Retourner à la Liste des Commandes
            </CButton>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DisplayInvoiceExists;
