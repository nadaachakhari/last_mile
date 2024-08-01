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

const numberToWords = (number) => {
  const ones = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
  const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];

  const convert_hundreds = (number) => {
    if (number === 0) return '';
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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!delivery) return <div>Aucune livraison trouvée.</div>;

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
            <div>
              <p><strong>Date:</strong> {formatDate(date)}</p>
              <p><strong>Adressé à:</strong> {customerName}</p>
              <p><strong>Fournisseur:</strong> {supplierName}</p>
              <p><strong>Livreur:</strong> {deliveryUserName}</p>
            </div>
          </CCardHeader>
          <CCardBody style={{ backgroundColor: '#f9f9f9' }}>
            <CRow>
              <CCol xs={6}>
                <p><strong>Observation:</strong> {observation}</p>
                <p><strong>Destination:</strong> {destination}</p>
             
              </CCol>
              <CCol xs={6} className="text-right">
                <p><strong>Total HT:</strong> {parseFloat(total_ht).toFixed(2)} DT</p>
                <p><strong>Total TTC:</strong> {parseFloat(total_ttc).toFixed(2)} DT</p>
                <p><strong>Différence TTC - HT:</strong> {differenceTTC_HT} DT</p>
              </CCol>
            </CRow>

            <CTable hover responsive style={{ border: '2px solid black', marginBottom: '20px' }}>
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

            {/* Footer Section */}
            <CTable responsive style={{ borderTop: '2px solid black', marginTop: '20px' }}>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell style={{ borderRight: '2px solid black', height: '100px', verticalAlign: 'bottom' }}>
                    <p>Cachet et Signature</p>
                    <p>.          </p>
                  </CTableDataCell>
                  <CTableDataCell className="text-right" style={{ verticalAlign: 'bottom' }}>
                    <p>La présente livraison à la somme de :</p>
                    <p><strong>{numberToWordsWithDecimals(parseFloat(total_ttc).toFixed(2))}</strong></p>
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
                  .footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    border-top: 2px solid black;
                    padding-top: 20px;
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
                Imprimer Livraison
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

export default AfficherLivraison;
