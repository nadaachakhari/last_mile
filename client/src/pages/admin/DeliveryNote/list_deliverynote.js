import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
} from '@coreui/react'
import { IoEyeSharp, IoPrintSharp } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([])
  const [alertMessage, setAlertMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDeliveries = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        console.error('Token non trouvé dans localStorage.')
        return
      }

      try {
        const response = await axios.get('http://localhost:5001/DeliverySell/delivery', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setDeliveries(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des bons de livraison:', error)
      }
    }

    fetchDeliveries()
  }, [])

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString))
  }

  const handleDeliveryClick = (deliveryID) => {
    navigate(`/admin/detail_deliverynote/${deliveryID}`)
  }

  const handlePrint = (id) => {
    navigate(`/admin/display_deliverynote/${id}`)
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
            <strong>Liste</strong> <small>des Bons de Livraison</small>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Numéro de Bon de Livraison</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Client</CTableHeaderCell>
                  <CTableHeaderCell>Total TTC (DT)</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {deliveries.map((delivery, index) => (
                  <CTableRow key={delivery.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{delivery.code}</CTableDataCell>
                    <CTableDataCell>{formatDate(delivery.date)}</CTableDataCell>
                    <CTableDataCell>{delivery.customer.name}</CTableDataCell>
                    <CTableDataCell>{delivery.total_ttc.toFixed(2)}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="info"
                        className="me-2"
                        onClick={() => handleDeliveryClick(delivery.id)}
                      >
                        <IoEyeSharp className="icon-white icon-lg me-1" />
                      </CButton>
                      <CButton
                        size="sm"
                        color="primary"
                        className="me-2"
                        onClick={() => handlePrint(delivery.id)}
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
  )
}

export default DeliveryList
