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

// Function to convert number to words in French
const numberToWords = (number) => {
  const ones = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
  const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];
  
  const convert_hundreds = (number) => {
    if (number > 99) {
      return ones[Math.floor(number / 100)] + " cent " + convert_tens(number % 100);
    } else {
      return convert_tens(number);
    }
  };

  const convert_tens = (number) => {
    if (number < 10) return ones[number];
    else if (number >= 10 && number < 20) return teens[number - 10];
    else {
      return tens[Math.floor(number / 10)] + (number % 10 > 0 ? "-" + ones[number % 10] : "");
    }
  };

  const convert_thousands = (number) => {
    if (number >= 1000) {
      return convert_hundreds(Math.floor(number / 1000)) + " mille " + convert_hundreds(number % 1000);
    } else {
      return convert_hundreds(number);
    }
  };

  if (number === 0) return "zéro";
  return convert_thousands(number).trim();
};

const numberToWordsWithDecimals = (number) => {
  const parts = number.toString().split('.');
  const integerPart = parseInt(parts[0], 10);
  const decimalPart = parts[1] ? parseInt(parts[1], 10) : 0;
  
  const integerWords = numberToWords(integerPart);
  const decimalWords = decimalPart > 0 ? numberToWords(decimalPart) : '';
  
  return decimalWords ? `${integerWords} dinars et ${decimalWords} millimes` : `${integerWords} dinars`;
};

const DisplayInvoiceExists = () => {
  const { orderID } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const componentRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/DeliverySell/delivery/${orderID}`);
        setInvoice(response.data);
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
    onAfterPrint: () => window.location.reload(), // Reload page after printing to avoid duplication
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!invoice) return <div>Aucune facture trouvée.</div>;

  const {
    code,
    date,
    destination,
    observation,
    taxStamp,
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
        <CCard className="mb-4" ref={componentRef} style={{ border: '2px solid black' }}>
          <CCardHeader className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid black' }}>
            <img src={avatar} alt="Logo" style={{ height: '80px' }} />
            <div>
              <strong>Facture</strong> <small>{code}</small>
            </div>
          </CCardHeader>
          <CCardBody style={{ backgroundColor: '#f9f9f9' }}>
            <CRow>
              <CCol xs={6}>
                <p><strong>Émetteur:</strong> Axeserp</p>
                <p><strong>MF:</strong> 1699211/V/A/P/000</p>
                <p>B11, Sfax Innovation 2 Route Saltinia km 3 ZI Poudrière 2</p>
                <p>Tél.: 29 300 034 | Email: contact@axeserp.com</p>
              </CCol>
              <CCol xs={6}>
                <p><strong>Date:</strong> {formatDate(date)}</p>
                <p><strong>Client:</strong> {customerName}</p>
                <p><strong>Fournisseur:</strong> {supplierName}</p>
                <p><strong>Méthode de Paiement:</strong> {paymentMethodValue}</p>
                <p><strong>Observation:</strong> {observation}</p>
                <p><strong>Adressé à:</strong> {order.destination}</p>
                <p><strong>Timbre fiscal:</strong> {parseFloat(taxStamp).toFixed(3)} DT</p>
              </CCol>
            </CRow>

            <CTable hover responsive style={{ border: '2px solid black', marginBottom: '20px' }}>
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
                    <CTableDataCell>{parseFloat(line.sale_ht).toFixed(3)} DT</CTableDataCell>
                    <CTableDataCell>{parseFloat(line.gross_amount).toFixed(3)} DT</CTableDataCell>
                    <CTableDataCell>{line.vat?.value || 'Non défini'}%</CTableDataCell>
                    <CTableDataCell>{parseFloat(line.sale_ttc).toFixed(3)} DT</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <div style={{ marginBottom: '20px' }}>
              <CRow>
                <CCol xs={6}>
                  <p><strong>Total HT:</strong> {parseFloat(total_ht).toFixed(3)} DT</p>
                  <p><strong>Total Net:</strong> {parseFloat(total_net).toFixed(3)} DT</p>
                </CCol>
                <CCol xs={6} className="text-right">
                  <p><strong>Total TTC:</strong> {parseFloat(total_ttc).toFixed(3)} DT</p>
                </CCol>
              </CRow>
            </div>

            {/* Footer Section */}
            <CTable responsive style={{ borderTop: '2px solid black', marginTop: '20px' }}>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell style={{ borderRight: '2px solid black', height: '100px', verticalAlign: 'bottom' }}>
                    <p>Cachet et Signature</p>
                    <p>.          </p>
                  </CTableDataCell>
                  <CTableDataCell className="text-right" style={{ verticalAlign: 'bottom' }}>
                    <p>La présente facture à la somme de :</p>
                    <p><strong>{numberToWordsWithDecimals(parseFloat(total_ttc).toFixed(3))} DT</strong></p>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell colSpan="2" className="text-center">
                    <p>AXESERP | B11, Sfax Innovation 2 Route Saltinia km 3 ZI Poudrière 2 | Tél. 29 300 034 | Email. contact@axeserp.com | MF. 1699211/V/A/P/000</p>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            {/* Styles for printing */}
            <style>
              {`
                @media print {
                  .no-print {
                    display: none;
                  }
                  @page {
                    margin: 20mm;
                  }
                  .footer::after {
                    content: "AXESERP | B11, Sfax Innovation 2 Route Saltinia km 3 ZI Poudrière 2 | Tél. 29 300 034 | Email. contact@axeserp.com | MF. 1699211/V/A/P/000";
                    display: block;
                    text-align: center;
                    margin-top: 20px;
                  }
                }
              `}
            </style>

            <div className="no-print" style={{ marginBottom: '20px' }}>
              <CButton color="primary" onClick={handlePrint} className="mt-3">
                Imprimer Facture
              </CButton>
              <CButton color="secondary" onClick={() => navigate('/admin/list_order')} className="mt-3 ms-2">
                Retourner à la Liste des Commandes
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DisplayInvoiceExists;
