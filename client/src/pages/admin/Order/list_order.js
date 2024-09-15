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
import { Link, useNavigate } from 'react-router-dom'
import { IoEyeSharp } from 'react-icons/io5'
import { FaEdit, FaFileInvoice, FaTimes, FaExclamationTriangle, FaTruck } from 'react-icons/fa'

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const [userRole, setUserRole] = useState('')
  const [updateKey, setUpdateKey] = useState(0)
  const [alertMessage, setAlertMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      setUserRole(role)

      if (!token) {
        console.error('Token non trouvé dans localStorage.')
        return
      }

      try {
        let response
        if (role === 'livreur') {
          response = await axios.get('http://localhost:5001/Users/orders/delivery-person', {
            headers: { Authorization: `Bearer ${token}` },
          })
        } else {
          response = await axios.get('http://localhost:5001/Order/', {
            headers: { Authorization: `Bearer ${token}` },
          })
        }
        setOrders(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error)
      }
    }

    fetchOrders()
  }, [updateKey])

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString))
  }

  const handleCancelOrderClick = async (orderID) => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('Token non trouvé dans localStorage.')
      return
    }

    try {
      const response = await axios.put(
        `http://localhost:5001/Order/cancelCMD/${orderID}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderID
              ? { ...order, state: { ...order.state, value: 'Commande annulée' } }
              : order,
          ),
        )
        setUpdateKey((prevKey) => prevKey + 1)
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
    }
  }

  const handleInvoiceClick = async (orderID) => {
    try {
      const response = await axios.post(`http://localhost:5001/Invoice/invoiceOrder/${orderID}`)
      if (response.status === 201) {
        navigate(`/admin/afficher_facture/${orderID}`)
      } else if (response.status === 200) {
        navigate(`/admin/display_invoice_exist/${orderID}`)
      }
    } catch (error) {
      console.error('Error creating or fetching invoice:', error)
    }
  }

  const handleDeliveryClick = async (orderID) => {
    try {
      const response = await axios.post(`http://localhost:5001/DeliverySell/order/${orderID}`)
      if (response.status === 201) {
        navigate(`/admin/bon_de_livraison/${orderID}`)
      } else if (response.status === 200) {
        navigate(`/admin/display_delivery_exist/${orderID}`)
      }
    } catch (error) {
      console.error('Error creating or fetching delivery:', error)
    }
  }

  const getRowStyle = (orderState) => {
    return orderState === 'Commande annulée' ? { backgroundColor: '#ff0000', color: '#fff' } : {}
  }

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
            <strong>Liste</strong> <small>des Commandes</small>
          </CCardHeader>
          <CCardBody>
            {userRole !== 'livreur' && userRole !== 'client' && (
              <Link to={`/admin/add_order`}>
                <CButton color="primary" className="mb-3">
                  Ajouter Commande
                </CButton>
              </Link>
            )}
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Code</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  {userRole === 'Administrateur' && (
                    <CTableHeaderCell>Fournisseur</CTableHeaderCell>
                  )}
                  <CTableHeaderCell>Client</CTableHeaderCell>
                  <CTableHeaderCell>État</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                  {userRole === 'Administrateur' && (
                    <>
                      <CTableHeaderCell>BL</CTableHeaderCell>
                      <CTableHeaderCell>Facteur</CTableHeaderCell>
                    </>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {orders.map((order, index) => (
                  <CTableRow key={order.id} style={getRowStyle(order.state.value)}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{order.code}</CTableDataCell>
                    
                    <CTableDataCell>{formatDate(order.date)}</CTableDataCell>
                    {userRole === 'Administrateur' && (
                      <CTableDataCell>{order.supplier.name}</CTableDataCell>
                    )}
                    <CTableDataCell>{order.customer.name}</CTableDataCell>
                    <CTableDataCell>{order.state.value}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/admin/detail_order/${order.id}`}>
                        <CButton size="sm" color="info" className="me-2">
                          <IoEyeSharp className="icon-white icon-lg me-1" />
                        </CButton>
                      </Link>

                      {userRole === 'Administrateur' && (
                        <>
                          <Link to={`/admin/edit_order/${order.id}`}>
                            <CButton size="md" color="warning" className="me-2">
                              <FaEdit className="icon-white icon-lg me-1" />
                            </CButton>
                          </Link>
                          <CButton
                            size="md"
                            color={
                              order.state.value === 'En attente de livraison'
                                ? 'success'
                                : 'secondary'
                            }
                            className="me-2"
                            disabled={order.state.value !== 'En attente de livraison'}
                            onClick={() => {
                              if (order.state.value === 'En attente de livraison') {
                                navigate(`/admin/affecter_livreur/${order.id}`)
                              }
                            }}
                          >
                            Affecter Livreur
                          </CButton>
                          
                        </>
                      )}

                      {userRole === 'fournisseur' && (
                        <>
                          <CButton
                            size="md"
                            color="danger"
                            className="me-2"
                            disabled={order.state.value !== 'En attente de livraison'}
                            onClick={() => {
                              if (order.state.value === 'En attente de livraison') {
                                handleCancelOrderClick(order.id)
                              }
                            }}
                          >
                            <FaTimes className="icon-white icon-lg me-1" />
                          </CButton>
                          <CButton
                            size="md"
                            color="secondary"
                            className="me-2"
                            onClick={() => handleInvoiceClick(order.id)}
                          >
                            <FaFileInvoice className="icon-white icon-lg me-1" />
                          </CButton>
                        </>
                      )}

                      {userRole === 'client' && (
                        <CButton
                          size="md"
                          color="danger"
                          className="me-2"
                          onClick={() => navigate(`/admin/add_claim/${order.id}`)}
                        >
                          <FaExclamationTriangle className="icon-white icon-lg me-1" />
                        </CButton>
                      )}
                    </CTableDataCell>
                    {userRole === 'Administrateur' && (
                      <>
                        <CTableDataCell>
                          <CButton size="md" color="primary" className="me-2" onClick={() => handleDeliveryClick(order.id)}>
                            <FaTruck className="icon-white icon-lg me-1" />
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton size="md" color="primary" className="me-2" onClick={() => handleInvoiceClick(order.id)}>
                            <FaFileInvoice className="icon-white icon-lg me-1" />
                          </CButton>
                        </CTableDataCell>
                        <CTableDataCell>
                        <CButton
                            size="md"
                            color="danger"
                            className="me-2"
                            onClick={() => handleCancelOrderClick(order.id)}
                          >
                            <FaTimes className="icon-white icon-lg me-1" />
                          </CButton>
                          </CTableDataCell>
                      </>
                    )}
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

export default OrderList
