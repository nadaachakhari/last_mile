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
import CIcon from '@coreui/icons-react';
import {
  cilPrint,
} from '@coreui/icons'
import { useAuth } from '../../../Middleware/Use_Auth';
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

const AfficherLivraison = () => {
  const { orderID } = useParams();
  const [delivery, setDelivery] = useState(null);
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
    
  }, [orderID,role,navigate]);

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
    total_ttc,
    total_ht,
    order = {},
    deliveryLines = []
  } = delivery;
  const suppliertax_identification_number = order.supplier?.tax_identification_number || 'Non défini';
  const customerName = order.customer?.name || 'Non défini';
  const customerTel = order.customer?.phone || 'Non défini';
  const supplierName = order.supplier?.name || 'Non défini';
  const deliveryUserName = order.delivery?.name || 'Non défini';
  const supplierAddress = order.supplier?.address || 'Non défini';
  const supplierPhone = order.supplier?.phone || 'Non défini';
  const supplierEmail = order.supplier?.email || 'Non défini';
  console.log(order.delivery); // Vérifie le contenu complet de order.supplier
  const supplierRegistrationNumber = order.delivery?.registration_number || 'Non défini';

  const paymentMethodValue = order.PaymentMethod?.value || 'Non défini';
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
  };

  const differenceTTC_HT = parseFloat(total_ttc - total_ht).toFixed(3);

  return (
    <CRow className='print'>
      <CCol xs={12}>
        <CCard className="mb-4 print-container" ref={componentRef} style={{ border: '2px solid black' }}>
          <CCardHeader className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid black' }}>
            <img src={avatar} alt="Logo" style={{ height: '80px' }} />
            <div>
              <strong>Livraison</strong><br />
              <strong>Réf:</strong> <small>{code}</small>
              <p><strong>Date:</strong> {formatDate(date)}</p>
            </div>
          </CCardHeader>
          <CCardBody className="print-content" style={{ backgroundColor: '#f9f9f9' }}>
            <CRow>
            <CCol xs={6}>
                <p><strong>Nom de l'expéditeur:</strong> {supplierName}</p>
              
                <p><strong>Matricule Fiscal:</strong> {suppliertax_identification_number}</p>
                <p>Tél.: {supplierPhone} | Email: {supplierEmail}</p>
                <p><strong>REF TRANSPORTEUR:</strong> {supplierRegistrationNumber}</p>
              </CCol>
              <CCol xs={6}>
                <p><strong>Nom De Destinataire::</strong> {customerName}</p>
                <p><strong>Téléphone:</strong> {customerTel}</p>
                <p><strong>Méthode de Paiement:</strong> {paymentMethodValue}</p>
                <p><strong>Observation:</strong> {observation}</p>
                <p><strong>Adresse :</strong> {destination}</p>
              </CCol>
            </CRow>

            <CTable hover responsive style={{ border: '2px solid black', marginBottom: '20px' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Article Code</CTableHeaderCell>
                  <CTableHeaderCell>Article Name</CTableHeaderCell>
                  <CTableHeaderCell>Qte</CTableHeaderCell>
                  <CTableHeaderCell>prix unitaire </CTableHeaderCell>
                  <CTableHeaderCell>VAT Value</CTableHeaderCell>
                  <CTableHeaderCell>Montant TTC</CTableHeaderCell>
                 {/*<CTableHeaderCell>Gross Amount</CTableHeaderCell>*/ } 
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {deliveryLines.map((line, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{line.article?.code || 'Non défini'}</CTableDataCell>
                    <CTableDataCell>{line.article?.name || 'Non défini'}</CTableDataCell>
                    <CTableDataCell>{line.quantity}</CTableDataCell>
                    <CTableDataCell>{parseFloat(line.article?.sale_ht).toFixed(3)} DT</CTableDataCell>
                    <CTableDataCell>{line.vat?.value || 'Non défini'}%</CTableDataCell>
                    <CTableDataCell>{parseFloat(line.sale_ttc).toFixed(3)} DT</CTableDataCell>
                   {/*<CTableDataCell>{parseFloat(line?.gross_amount).toFixed(3)} DT</CTableDataCell> */} 
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <div style={{ marginBottom: '20px' }}>
                <CRow>
                
                  <CCol xs={6}>
                    <p><strong>Total HT:</strong> {total_ht} DT</p>
                    <p><strong>Total TTC:</strong> {total_ttc} DT</p>
                  </CCol>
                </CRow>
              </div>
            {/* Footer Section */}
            <CTable className='print-footer' responsive style={{ borderTop: '2px solid black', marginTop: '20px' }}>
              <CTableBody>
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
                  .print-footer {
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
                }
              `}
            </style>

            <div className="no-print" style={{ marginBottom: '20px' }}>
              <CButton color="primary" onClick={handlePrint} className="mt-3">
              <CIcon icon={cilPrint}style={{ width: '20px', marginRight: '8px' }}customClassName="nav-icon" /> Imprimer Livraison
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
