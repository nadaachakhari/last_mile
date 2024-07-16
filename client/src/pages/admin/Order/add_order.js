import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
} from '@coreui/react'
import { Link } from 'react-router-dom';

const CreateOrder = () => {
  const [formData, setFormData] = useState({
    code: '',
    date: '',
    customerID: '',
    observation: '',
    note: '',
    ID_payment_method: '',
  })
  
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [customers, setCustomers] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const navigate = useNavigate()

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:5001/Tier/');
                const allTiers = response.data;
                const filteredCustomers = allTiers.filter(tier => tier.TypeTier && tier.TypeTier.name === 'client');
                setCustomers(filteredCustomers);
            } catch (error) {
                console.error('Erreur lors de la récupération des clients:', error);
            }
        };
    const fetchPaymentMethods = async () => {
      try {
          const response = await axios.get('http://localhost:5001/PaymentMethode/')
        setPaymentMethods(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des méthodes de paiement:', error)
      }
    }

    fetchCustomers()
    fetchPaymentMethods()
  }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token');
    console.log('Token récupéré:', token); // Vérifiez que le token est correctement récupéré

    if (!token) {
      console.error('Token non trouvé dans localStorage.');
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id; // Assurez-vous que id correspond à la clé dans le payload JWT pour l'ID de l'utilisateur

      const clientData = {
        ...formData,
        userId: userId,
      };
      const response = await axios.post('http://localhost:5001/Order/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      //console.log('Réponse serveur:', response.data)
      navigate('/admin/list_order')
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          console.error('Accès refusé: Vérifiez les autorisations.');
        } else if (error.response.status === 400 && error.response.data.error) {
          setModalMessage(error.response.data.error);
          setShowModal(true);
        } else {
          console.error('Erreur inattendue:', error.response.data);
        }
      } else {
        console.error('Erreur lors de la soumission du formulaire:', error.message);
      }
    }
    }
  

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Créer</strong> <small>Commande</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="code">Code</CFormLabel>
                <CFormInput id="code" value={formData.code} onChange={handleChange} required />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="date">Date</CFormLabel>
                <CFormInput type='date' id="date" value={formData.date} onChange={handleChange} required />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="customerID">Client</CFormLabel>
                <CFormSelect
                  id="customerID"
                  value={formData.customerID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisir...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3} className="align-self-end">
                <Link to={`/admin/add_client`}>
                  <CButton color="primary">
                    Ajouter Client
                  </CButton>
                </Link>
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="ID_payment_method">Méthode de paiement</CFormLabel>
                <CFormSelect
                  id="ID_payment_method"
                  value={formData.ID_payment_method}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choisir...</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.value}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3} className="align-self-end">
                <Link to={`/admin/add_payment_methode`}>
                  <CButton color="primary">
                    Ajouter MP
                  </CButton>
                </Link>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="observation">Observation</CFormLabel>
                <CFormInput id="observation" value={formData.observation} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="note">Note</CFormLabel>
                <CFormInput id="note" value={formData.note} onChange={handleChange} />
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  Créer
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>Erreur</CModalTitle>
        </CModalHeader>
        <CModalBody>{modalMessage}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
);
};

export default CreateOrder
