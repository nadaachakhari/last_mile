import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useParams ,useNavigate} from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CTableRow
} from '@coreui/react';
import { useAuth } from '../../../Middleware/Use_Auth';

const InvoiceDetail = () => {
  const { id } = useParams(); // Get ID from URL
  const [invoice, setInvoice] = useState(null);
  const navigate = useNavigate()
  const { role } = useAuth(); 
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'Administrateur') {
      navigate('/unauthorized');
    }
    const fetchInvoiceDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token non trouvé dans localStorage.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5001/Invoice/invoicebyid/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInvoice(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la facture:', error);
      }
    };

    if (id) {
      fetchInvoiceDetails();
    } else {
      console.error('Invoice ID is undefined');
    }
  }, [id,role,navigate]);

  if (!invoice) {
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
            <strong>Détails de la Facture</strong>
          </CCardHeader>
          <CCardBody>
            <h5>Informations de la Facture</h5>
            <p><strong>Numéro de Facture:</strong> {invoice.code}</p>
            <p><strong>Date:</strong> {formatDate(invoice.date)}</p>
            <p><strong>Client:</strong> {invoice.order?.customer?.name || 'N/A'}</p>
            <p><strong>Total TTC:</strong> {invoice.total_ttc.toFixed(2)} DT</p>

            <h5>Lignes de Facture</h5>
            {invoice.invoiceLignes && invoice.invoiceLignes.length > 0 ? (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Article</CTableHeaderCell>
                    <CTableHeaderCell>Quantité</CTableHeaderCell>
                    <CTableHeaderCell>Prix Unitaire</CTableHeaderCell>
                    <CTableHeaderCell>Total</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {invoice.invoiceLignes.map((line, index) => (
                    <CTableRow key={line.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{line.article?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{line.quantity}</CTableDataCell>
                      <CTableDataCell>{line.sale_ht.toFixed(2)} DT</CTableDataCell>
                      <CTableDataCell>{(line.sale_ht * line.quantity).toFixed(2)} DT</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <p>Aucune ligne de facture disponible.</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default InvoiceDetail;
