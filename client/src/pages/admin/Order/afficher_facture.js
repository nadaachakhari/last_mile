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
  CButton,
} from '@coreui/react';
import { useReactToPrint } from 'react-to-print';

const AfficherFacture = () => {
  const { orderID } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const componentRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.post(`http://localhost:5001/Invoice/invoiceOrder/${orderID}`);
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
        <CCard className="mb-4" ref={componentRef}>
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
            <p><strong>Total TTC:</strong> {parseFloat(total_ttc).toFixed(2)} €</p>
            <p><strong>Total HT:</strong> {parseFloat(total_ht).toFixed(2)} €</p>
            <p><strong>Total Net:</strong> {parseFloat(total_net).toFixed(2)} €</p>

            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Article</CTableHeaderCell>
                  <CTableHeaderCell>Quantité</CTableHeaderCell>
                  <CTableHeaderCell>Prix Unitaire</CTableHeaderCell>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {invoiceLignes.map((line, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{line.article?.name || 'Non défini'}</CTableDataCell>
                    <CTableDataCell>{line.quantity}</CTableDataCell>
                    <CTableDataCell>{parseFloat(line.sale_ht).toFixed(2)} €</CTableDataCell>
                    <CTableDataCell>{(line.quantity * parseFloat(line.sale_ht)).toFixed(2)} €</CTableDataCell>
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

export default AfficherFacture;
