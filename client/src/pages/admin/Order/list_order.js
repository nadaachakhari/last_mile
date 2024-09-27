import React, { useState, useEffect } from 'react'
import axios from 'axios'
import chroma from 'chroma-js'
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
import Select from 'react-select'
const OrderList = () => {
  const [orders, setOrders] = useState([])
  const [userRole, setUserRole] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [customers, setCustomers] = useState([])
  const [updateKey, setUpdateKey] = useState(0)
  const [alertMessage, setAlertMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate()
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
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
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/Tier/supplier')
        const supplierOptions = response.data.map((supplier) => ({
          value: supplier.id,
          label: supplier.name,
          color: chroma.random().hex(),
        }))
        setSuppliers(supplierOptions)
      } catch (error) {
        console.error('Erreur lors de la récupération des fournisseurs:', error)
      }
    }
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token non trouvé dans localStorage.')
        return
      }

      try {
        const response = await axios.get('http://localhost:5001/Tier/clients', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const customerOptions = response.data.map((customer) => ({
          value: customer.id,
          label: customer.name,
          color: chroma.random().hex(),
        }))
        setCustomers(customerOptions)
      } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error)
      }
    }
    fetchCustomers()
    fetchSuppliers()
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
  const handleCustomerChange = (selectedOption) => {
    setSelectedCustomer(selectedOption)
  }
  const handleSupplierChange = (selectedOption) => {
    setSelectedSupplier(selectedOption)
  }
  const filteredOrders = (orders || [])
  .filter((order) => !selectedSupplier || order.supplier.id === selectedSupplier.value)
  .filter((order) => !selectedCustomer || order.customer.id === selectedCustomer.value)

const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isFocused, isSelected }) => {
    const color = chroma(data.color)
    return {
      ...styles,
      backgroundColor: isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
    }
  },
  singleValue: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
}
const handleChangeOrderState = (orderId) => {
  navigate(`/admin/change_order_state/${orderId}`);
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
            <strong>Liste</strong> <small>des Commandes</small>
          </CCardHeader>
          <CCardBody>
          {userRole === 'fournisseur' && (
              <Link to={`/admin/add_order`}>
                <CButton color="primary" className="mb-3">
                  Ajouter Commande
                </CButton>
              </Link>
              
            )}
           <div style={{ display: 'flex', gap: '1rem' }}>
 {/* Show supplier search when the role is 'Administrateur' */}
 {userRole === 'Administrateur' && (
        <Select
          options={suppliers}
          styles={colourStyles}
          onChange={handleSupplierChange}
          placeholder="Rechercher par fournisseur"
        />
      )}

      {/* Show customer search when the role is 'Fournisseur' */}
      { userRole === 'Administrateur' &&(
        <Select
          options={customers}
          styles={colourStyles}
          onChange={handleCustomerChange}
          placeholder="Rechercher par client"
        />
      )}
    {/* Show customer search when the role is 'Fournisseur' */}
    { userRole === 'fournisseur' &&(
        <Select
          options={customers}
          styles={colourStyles}
          onChange={handleCustomerChange}
          placeholder="Rechercher par client"
        />
      )}
   
</div>

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
                      <CTableHeaderCell>Annule</CTableHeaderCell>
                    </>
                  )}
                    {userRole === 'fournisseur' && (
                    <>
                     {/* <CTableHeaderCell>Facteur</CTableHeaderCell> */}
                    <CTableHeaderCell>Annule</CTableHeaderCell>

                    </>
                  )}
                  {userRole === 'livreur' && (
                    <>
                       <CTableHeaderCell> Changer l'état</CTableHeaderCell>
                    </>
                    )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {filteredOrders.map((order, index) => (
                  <CTableRow key={order.id} style={getRowStyle(order.state.value)}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{order.code}</CTableDataCell>
                    
                    <CTableDataCell>{formatDate(order.date)}</CTableDataCell>
                    {userRole === 'Administrateur' && (
                      <CTableDataCell>{order.supplier.name}</CTableDataCell>
                    )}
                    <CTableDataCell>{order.customer.name}</CTableDataCell>
                    <CTableDataCell
  style={{
    backgroundColor:
      order.state.value === 'Commande annulée'
        ? 'red'
        : order.state.value === 'en cours de livraison'
        ? 'green'
        : 'white',
    color: 'black', // Pour que le texte reste lisible sur fond coloré
  }}
>
  {order.state.value}
</CTableDataCell>



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
                        
                            <CButton size="md" 
                            color="warning" 
                            className="me-2"
                            disabled={order.state.value !== 'En attente de livraison'}
                            onClick={() => { if (order.state.value === 'En attente de livraison') {
                              navigate(`/admin/edit_order/${order.id}`)}
                            }}
                            >
                              <FaEdit className="icon-white icon-lg me-1" />
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
                    {/* facteur pour fournisseurs */}
                    {/* {userRole === 'fournisseur' && (
                      
                      <CTableDataCell>

                    <CButton
                            size="md"
                            color="secondary"
                            className="me-2"
                            disabled={order.state.value !== 'en cours de livraison'}
                            onClick={() => { if (order.state.value === 'en cours de livraison') {
                              handleInvoiceClick(order.id)
                            }
                          }}
                          >
                            <FaFileInvoice className="icon-white icon-lg me-1" />
                          </CButton>
                          </CTableDataCell>
                            )} */}
                    {userRole === 'fournisseur' && (
                      
                        <CTableDataCell>
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
                          </CTableDataCell>
                        )}

                    {userRole === 'Administrateur' && (
                      <>
                        <CTableDataCell>
                          <CButton size="md" color="primary" className="me-2" 
                            disabled={order.state.value !== 'en cours de livraison'}
                            onClick={() => {
                              if (order.state.value === 'en cours de livraison') {
                                 handleDeliveryClick(order.id)}}}>
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
                            title="Annuler la commande"
                          >
                            
                            <FaTimes className="icon-white icon-lg me-1" />
                           
                          </CButton>
                          </CTableDataCell>
                      </>
                    )}
                        {userRole === 'livreur' && (
                    <CTableDataCell>
                    <CButton 
                  color="info"
                  onClick={() => handleChangeOrderState(order.id)}
                >
                  <FaEdit style={{ marginRight: '5px' }} /> {/* Icône ajoutée */}
                  Changer l'état
                </CButton>
              </CTableDataCell>
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
