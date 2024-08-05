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



const numberToWordsWithDecimals = (number) => {
  // (Your numberToWordsWithDecimals function implementation here)
};

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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!invoice) return <div>Aucune facture trouvée.</div>;

  const {
    code,
    date,
    total_ttc,
    total_ht,
    total_net,
    taxStamp,
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

  // Function to calculate VAT amount and difference
  const calculateVatAndDifference = (base, vatRate) => {
    const vatAmount = base * (vatRate / 100);
    return { vatAmount, totalWithVat: base + vatAmount };
  };

  // Function to calculate totals from invoice lines
  const calculateTotals = () => {
    return invoiceLignes.reduce(
      (totals, line) => {
        const baseAmount = parseFloat(line.sale_ht) * line.quantity;
        const { vatAmount, totalWithVat } = calculateVatAndDifference(baseAmount, line.vat.value);

        totals.total_ht += baseAmount;
        totals.total_net += baseAmount; // Assuming Net is same as Base for this example
        totals.total_ttc += totalWithVat;
        totals.total_vat += vatAmount;

        return totals;
      },
      { total_ht: 0, total_net: 0, total_ttc: 0, total_vat: 0 }
    );
  };
// Calculer la somme de line.gross_amount
const totalGrossAmount = invoiceLignes.reduce((sum, line) => {
  return sum + parseFloat(line.gross_amount) || 0;
}, 0);
// Calculer la somme des taux de TVA
const totalVatRate = invoiceLignes.reduce((sum, line) => {
  return sum + parseFloat(line.vat.value) || 0;
}, 0);

  const totals = calculateTotals();

  return (
    <CRow className='print'>
      <CCol xs={12}>
        <CCard className="mb-4 print-container" ref={componentRef} style={{ border: '2px solid black' }}>
        <CCardHeader className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid black' }}>
            <img src={avatar} alt="Logo" style={{ height: '80px' }} />
            <div>
              <strong>Facture</strong><br></br>
              <strong>Réf:</strong> <small>{code}</small>
              <p><strong>Date:</strong> {formatDate(date)}</p>
            </div>
          </CCardHeader>
          <CCardBody className="print-content" style={{ backgroundColor: '#f9f9f9' }}>
            <CRow>
              <CCol xs={6}>
                <p><strong>Émetteur:</strong> Axeserp</p>
                <p><strong>MF:</strong> 1699211/V/A/P/000</p>
                <p>B11, Sfax Innovation 2 Route Saltnia km 3 ZI Poudrière 2</p>
                <p>Tél.: 29 300 034 | Email: contact@axeserp.com</p>
              </CCol>
              <CCol xs={6}>
                <p><strong>Date:</strong> {formatDate(date)}</p>
                <p><strong>Adressé à:</strong> {customerName}</p>
              </CCol>
            </CRow>
  
            <CTable hover responsive style={{ border: '2px solid black', marginBottom: '20px' }}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Article</CTableHeaderCell>
                  <CTableHeaderCell>Qte</CTableHeaderCell>
                  <CTableHeaderCell>Montant HT</CTableHeaderCell>
                  <CTableHeaderCell>Montant Net</CTableHeaderCell>
                  <CTableHeaderCell>TVA</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {invoiceLignes.map((line, index) => {
                  const { vatAmount, totalWithVat } = calculateVatAndDifference(parseFloat(line.sale_ht), line.vat.value);
                  return (
                    <CTableRow key={index}>
                      <CTableDataCell>{line.article?.name || 'Non défini'}</CTableDataCell>
                      <CTableDataCell>{line.quantity}</CTableDataCell>
                      <CTableDataCell>{parseFloat(line.gross_amount).toFixed(3)} DT</CTableDataCell>
                      <CTableDataCell>{(line.quantity * parseFloat(line.sale_ht)).toFixed(3)} DT</CTableDataCell>
                      <CTableDataCell>{line.vat.value}%</CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
  
            <CRow>
              <CCol xs={6}>
                <CTable hover responsive style={{ border: '2px solid black', marginBottom: '20px' }}>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Base</CTableHeaderCell>
                      <CTableHeaderCell>TVA%</CTableHeaderCell>
                      <CTableHeaderCell>TVA</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell>{totals.total_ht.toFixed(3)} DT</CTableDataCell>
                      <CTableDataCell>{totalVatRate.toFixed(0)}%</CTableDataCell>
                      <CTableDataCell>{totals.total_vat.toFixed(3)} DT</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <p><strong>Méthode de Paiement:</strong> {paymentMethodValue}</p>
              </CCol>
  
              <CCol xs={6} className="text-right">    
                <CTable hover responsive style={{ border: '2px solid black', marginBottom: '20px' }}>
                  <p><strong>Total HT:</strong> {totalGrossAmount.toFixed(3)} DT</p>
                  <p><strong>TOTAL NET HT:</strong> {totals.total_net.toFixed(3)} DT</p>
                  <p><strong>TVA:</strong> {totals.total_vat.toFixed(3)} DT</p>
                  <p><strong>Timbre fiscal:</strong> {parseFloat(taxStamp).toFixed(3)} DT</p>
                  <p><strong>Total TTC:</strong> {totals.total_ttc.toFixed(3)} DT</p>
                </CTable>
              </CCol>
            </CRow>
  
            {/* Footer Section */}
            <CTable className='print-footer' responsive style={{ borderTop: '2px solid black', marginTop: '20px' }}>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell style={{ borderRight: '2px solid black', height: '100px', verticalAlign: 'bottom' }}>
                    <p>Cachet et Signature</p>
                    <p>.          </p>
                  </CTableDataCell>
                  <CTableDataCell className="text-right" style={{ verticalAlign: 'bottom' }}>
                    <p>La présente facture à la somme de :</p>
                    <p><strong>{numberToWordsWithDecimals(totals.total_ttc.toFixed(3))}</strong></p>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell colSpan="2" className="text-center">
                    <p>AXESERP | B11, Sfax Innovation 2 Route Saltinia km 3 ZI Poudrière 2 | Tél. 29 300 034 | Email. contact@axeserp.com | MF. 1699211/V/A/P/000</p>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            <style>
  {`
    @media print {
      .no-print {
        display: none;
      }
   .print-footer{
    display: flex;
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
          <div className="print-footer"></div>
        </CCard>
      </CCol>
    </CRow>
    
  );
  
};

export default AfficherFacture;
