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
import avatar from '../../../assets/images/logo/logo_last.png';

const AfficherLivraison = () => {
  const { orderID } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const componentRef = useRef();

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await axios.post(`http://localhost:5001/DeliverySell/order/${orderID}`);
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
    destination,
    note,
    total_ttc,
    total_ht,
    order = {},
    deliveryLines = []
  } = delivery;

  const customerName = order.customer?.name || 'Non défini';
  const supplierName = order.supplier?.name || 'Non défini';
  const deliveryUserName = order.delivery?.name || 'Non défini';

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
  };

  const differenceTTC_HT = parseFloat(total_ttc - total_ht).toFixed(2);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4" ref={componentRef} style={{ border: '2px solid black' }}>
          <CCardHeader className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid black' }}>
            <img src={avatar} alt="Logo" style={{ height: '80px' }} />
            <div>
              <strong>Livraison</strong> <small>{code}</small>
            </div>
          </CCardHeader>
          <CCardBody style={{ backgroundColor: '#f9f9f9' }}>
            <CRow className="mb-4" style={{ borderBottom: '2px solid black' }}>
              <CCol xs={6}>
                <p><strong>Émetteur:</strong> Axeserp</p>
                <p><strong>MF:</strong> 1699211/V/A/P/000</p>
                <p>B11, Sfax Innovation 2 Route Saltnia km 3 ZI Poudrière 2</p>
                <p>Tél.: 29 300 034 | Email: contact@axeserp.com</p>
              </CCol>
              <CCol xs={6}>
                <p><strong>Adressé à:</strong> {customerName}</p>
                <p><strong>Fournisseur:</strong> {supplierName}</p>
                <p><strong>Livreur:</strong> {deliveryUserName}</p>
                <p><strong>Date:</strong> {formatDate(date)}</p>
              </CCol>
            </CRow>

            <p style={{ borderBottom: '1px solid black' }}><strong>Observation:</strong> {observation}</p>
            <p style={{ borderBottom: '1px solid black' }}><strong>Destination:</strong> {destination}</p>
            <p style={{ borderBottom: '1px solid black' }}><strong>Note:</strong> {note}</p>

            <CTable hover responsive style={{ border: '2px solid black' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Article Code</CTableHeaderCell>
                  <CTableHeaderCell>Article Name</CTableHeaderCell>
                  <CTableHeaderCell>Quantity</CTableHeaderCell>
                  <CTableHeaderCell>Sale HT</CTableHeaderCell>
                  <CTableHeaderCell>VAT Value</CTableHeaderCell>
                  <CTableHeaderCell>Sale TTC</CTableHeaderCell>
                  <CTableHeaderCell>Gross Amount</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {deliveryLines.map((line, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{line.article?.code || 'Non défini'}</CTableDataCell>
                    <CTableDataCell>{line.article?.name || 'Non défini'}</CTableDataCell>
                    <CTableDataCell>{line.quantity}</CTableDataCell>
                    <CTableDataCell>{parseFloat(line.article?.sale_ht).toFixed(2)} DT</CTableDataCell>
                    <CTableDataCell>{line.vat?.value || 'Non défini'}%</CTableDataCell>
                    <CTableDataCell>{parseFloat(line.sale_ttc).toFixed(2)} DT</CTableDataCell>
                    <CTableDataCell>{parseFloat(line?.gross_amount).toFixed(2)} DT</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <div className="mt-4" style={{ borderTop: '2px solid black' }}>
              <p><strong>Total HT:</strong> {parseFloat(total_ht).toFixed(2)} DT</p>
              <p><strong>Total TTC:</strong> {parseFloat(total_ttc).toFixed(2)} DT</p>
              <p><strong>Différence TTC - HT:</strong> {differenceTTC_HT} DT</p>
            </div>

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

export default AfficherLivraison;
