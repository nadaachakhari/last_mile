import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams,useNavigate } from 'react-router-dom'
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
  CTableRow,
} from '@coreui/react'
import { useAuth } from '../../../Middleware/Use_Auth';
const DeliveryNoteDetail = () => {
  const { id } = useParams()
  const [deliveryNote, setDeliveryNote] = useState(null)
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
    const fetchDeliveryNoteDetails = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token non trouvé dans localStorage.')
        return
      }

      try {
        const response = await axios.get(`http://localhost:5001/DeliverySell/delivery/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          setDeliveryNote(response.data)
          console.log("Delivery Note Details: ", response.data);
          
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du bon de livraison:', error)
      }
    }

    if (id) {
      fetchDeliveryNoteDetails()
    } else {
      console.error('Delivery Note ID is undefined')
    }
  }, [id,role,navigator])

  if (!deliveryNote) {
    return <div>Loading...</div>
  }

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString))
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Détails du Bon de Livraison</strong>
          </CCardHeader>
          <CCardBody>
            <h5>Informations du Bon de Livraison</h5>
            <p>
              <strong>Numéro de Bon de Livraison:</strong> {deliveryNote.code}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(deliveryNote.date)}
            </p>
            <p>
              <strong>Client:</strong> {deliveryNote.order?.customer?.name || 'N/A'}
            </p>
            <p>
              <strong>Total TTC:</strong> {deliveryNote.total_ttc.toFixed(2)} DT
            </p>
            <p>
              <strong>Destination:</strong> {deliveryNote.destination}
            </p>
            <p>
              <strong>Observation:</strong> {deliveryNote.observation || 'N/A'}
            </p>
            <p>
              <strong>Note:</strong> {deliveryNote.note || 'N/A'}
            </p>

            <h5>Lignes de Bon de Livraison</h5>
            {deliveryNote.deliveryLines && deliveryNote.deliveryLines.length > 0 ? (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Article</CTableHeaderCell>
                    <CTableHeaderCell>Quantité</CTableHeaderCell>
                    <CTableHeaderCell>Prix Unitaire HT</CTableHeaderCell>
                    <CTableHeaderCell>Total HT</CTableHeaderCell>
                    <CTableHeaderCell>Total TTC</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {deliveryNote.deliveryLines.map((line, index) => (
                    <CTableRow key={line.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{line.article?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{line.quantity}</CTableDataCell>
                      <CTableDataCell>{line.sale_ht.toFixed(2)} DT</CTableDataCell>
                      <CTableDataCell>{(line.sale_ht * line.quantity).toFixed(2)} DT</CTableDataCell>
                      <CTableDataCell>{line.sale_ttc.toFixed(2)} DT</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            ) : (
              <p>Aucune ligne de bon de livraison disponible.</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DeliveryNoteDetail
