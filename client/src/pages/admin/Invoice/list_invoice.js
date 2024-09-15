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
import { IoEyeSharp, IoPrintSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token non trouvé dans localStorage.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/Invoice/invoice', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvoices(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des factures:', error);
      }
    };

    fetchInvoices();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
  };

  const handleInvoiceClick = (invoiceID) => {
    navigate(`/admin/detail_invoice/${invoiceID}`);
  };

  const handlePrint = (orderID) => {
    navigate(`/admin/display_invoice_exist/${orderID}`)
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
            <strong>Liste</strong> <small>des Factures</small>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Numéro de Facture</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Client</CTableHeaderCell>
                  <CTableHeaderCell>Total TTC (€)</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {invoices.map((invoice, index) => (
                  <CTableRow key={invoice.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{invoice.code}</CTableDataCell>
                    <CTableDataCell>{formatDate(invoice.date)}</CTableDataCell>
                    <CTableDataCell>{invoice.customer.name}</CTableDataCell>
                    <CTableDataCell>{invoice.total_ttc.toFixed(2)}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="info"
                        className="me-2"
                        onClick={() => handleInvoiceClick(invoice.id)}
                      >
                        <IoEyeSharp className="icon-white icon-lg me-1" />
                      </CButton>
                      <CButton
                        size="sm"
                        color="primary"
                        className="me-2"
                        onClick={() => handlePrint(invoice.id)}
                      >
                        <IoPrintSharp className="icon-white icon-lg me-1" />
                      </CButton>
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

export default InvoiceList;
