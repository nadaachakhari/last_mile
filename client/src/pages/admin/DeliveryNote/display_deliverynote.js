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
import CIcon from '@coreui/icons-react'
import {
  cilPrint,
} from '@coreui/icons'

import { useReactToPrint } from 'react-to-print';
import avatar from '../../../assets/images/logo/logo_last.png';
import { useAuth } from '../../../Middleware/Use_Auth';
// Function to convert number to words in French
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

const DisplayDeliveryNote = () => {
  const { orderID } = useParams();
  const [deliveries, setDeliveries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const componentRef = useRef();
  const { role } = useAuth(); 
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'Administrateur') {
      navigate('/unauthorized');
    }
    const fetchDeliveries = async () => {
        const token = localStorage.getItem('token')

        if (!token) {
          console.error('Token non trouvé dans localStorage.')
          return
        }
        try {
            const response = await axios.get(`http://localhost:5001/DeliverySell/delivery/${orderID}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            setDeliveries(response.data)
            console.log(orderID)
          } catch (error) {
            console.error('Erreur lors de la récupération des bons de livraison:', error)
          } finally {
            setLoading(false);
          }
         
    };

    fetchDeliveries();
  }, [orderID,role,navigate]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!deliveries) return <div>Aucune bon delivraison trouvée.</div>;

  const {
    code,
    date,
    destination,
    observation,
    total_ttc,
    total_ht,
    order = {},
    deliveryLines = []
  } = deliveries;
  const suppliertax_identification_number = order.supplier?.tax_identification_number || 'Non défini';
  const customerName = order.customer?.name || 'Non défini';
  const customerTele = order.customer?.name || 'Non défini';
  const supplierRegistrationNumber = order.delivery?.registration_number || 'Non défini';
  const supplierName = order.supplier?.name || 'Non défini';
  const paymentMethodValue = order.paymentMethod?.value || 'Non défini';
  const supplierAddress = order.supplier?.address || 'Non défini';
  const supplierTel = order.supplier?.phone || 'Non défini';
  const supplierEmail = order.supplier?.email || 'Non défini';
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
  };
         

  return (
    <>
      <style>
        {`
        @media print {
          .no-print {
            display: none;
          }
          .print-container {
            page-break-after: always;
          }
        }
      .icon{
      width: 20px;
      marginRight: 12px;
}
        `}
      </style>
      <CRow className='print'>
        <CCol xs={12}>
          <CCard className="mb-4 print-container" ref={componentRef} style={{ border: '2px solid black' }}>
            <CCardHeader className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid black' }}>
              <img src={avatar} alt="Logo" style={{ height: '80px' }} />
              <div>
                <strong>bon de livraison</strong><br />
                <strong>Réf:</strong> <small>{code}</small>
                <p><strong>Date:</strong> {formatDate(date)}</p>
              </div>
            </CCardHeader>
            <CCardBody className="print-content" style={{ backgroundColor: '#f9f9f9' }}>
              <CRow>
              <CCol xs={6}>
                <p><strong>Émetteur:</strong> {supplierName}</p>
                <p><strong>Matricule Fiscal:</strong> {suppliertax_identification_number}</p>
                <p>{supplierAddress}</p>
                <p>Tél.: {supplierTel} | Email: {supplierEmail}</p>
                <p><strong>REF TRANSPORTEUR:</strong> {supplierRegistrationNumber}</p>
              </CCol>
                <CCol xs={6}>
                  
                  <p><strong>Nom De Destinataire:</strong> {customerName}</p>
                  <p><strong>Téléphone:</strong> {customerTele}</p>
                  <p><strong>Méthode de Paiement:</strong> {paymentMethodValue}</p>
                  <p><strong>Observation:</strong> {observation}</p>
                  <p><strong>Adresse:</strong> {destination}</p>
                </CCol>
              </CRow>

              <CTable hover responsive style={{ border: '2px solid black', marginBottom: '20px' }}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Article Code</CTableHeaderCell>
                    <CTableHeaderCell>Article Name</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>prix unitaire </CTableHeaderCell>
                   {/*<CTableHeaderCell>Gross Amount</CTableHeaderCell>*/}
                    <CTableHeaderCell>VAT Value</CTableHeaderCell>
                    <CTableHeaderCell>Montant TTC</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {deliveryLines.map((line, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{line.article?.code || 'Non défini'}</CTableDataCell>
                      <CTableDataCell>{line.article?.name || 'Non défini'}</CTableDataCell>
                      <CTableDataCell>{line.quantity}</CTableDataCell>
                      <CTableDataCell>{parseFloat(line.sale_ht).toFixed(3)} DT</CTableDataCell>
                    {/*   <CTableDataCell>{parseFloat(line.gross_amount).toFixed(3)} DT</CTableDataCell>*/}
                      <CTableDataCell>{line.vat?.value || 'Non défini'}%</CTableDataCell>
                      <CTableDataCell>{parseFloat(line.sale_ttc).toFixed(3)} DT</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <div style={{ marginBottom: '20px' }}>
                <CRow>
                  <CCol xs={6}>
                   
                  </CCol>
                  <CCol xs={6}>
                    <p><strong>Total HT:</strong> {total_ht} DT</p>
                    <p><strong>Total TTC:</strong> {total_ttc} DT</p>
                  </CCol>
                </CRow>
              </div>
              <CTableRow>
                  <CTableDataCell colSpan="2" className="text-center">
                    <p>AXESERP | B11, Sfax Innovation 2 Route Saltinia km 3 ZI Poudrière 2 | Tél. 29 300 034 | Email. contact@axeserp.com | MF. 1699211/V/A/P/000</p>
                  </CTableDataCell>
                </CTableRow>
            </CCardBody>
            <style>
              {`
                @media print {
                  .no-print {
                    display: none;
                  }
                  .print-footer {
                    display: flex;
                  }
                }
              `}
            </style>
           
          </CCard>

          <div className="d-flex justify-content-between mt-4 no-print">
            <CButton color="primary" onClick={handlePrint}><CIcon icon={cilPrint}style={{ width: '20px', marginRight: '8px' }}customClassName="nav-icon" />Imprimer</CButton>
            <CButton color="secondary" onClick={() => navigate('/admin/list_deliverynote')}>Retour</CButton>
          </div>
        </CCol>
      </CRow>
    </>
  );
};

export default DisplayDeliveryNote;
