import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
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
import { useAuth } from '../../../Middleware/Use_Auth'
const EditClient = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    
    address: '',
    postal_code: '',
    country: '',
    phone: '',
    mobile: '',
    fax: '',
    email: '',
    cityID: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [cities, setCities] = useState([])
  const { role } = useAuth();
 
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'fournisseur') {
      navigate('/unauthorized');
    }
    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/Tier/${id}`)
        setFormData(response.data)
      } catch (error) {
        console.error(
          `Erreur lors de la récupération des détails du client avec l'ID ${id}:`,
          error,
        )
      }
    }

    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:5001/City/')
        setCities(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error)
      }
    }

    fetchClientDetails()
    fetchCities()
  }, [id,role,navigate])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`http://localhost:5001/Tier/clients/${id}`, formData)
      console.log('Réponse serveur:', response.data)
      navigate('/admin/list_client')
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error) {
        setModalMessage(error.response.data.error)
        setShowModal(true)
      } else {
        console.error('Erreur lors de la soumission du formulaire:', error)
      }
      if (error.message.includes('sendEmail')) {
        setModalMessage("Erreur lors de l'envoi de l'email de confirmation.")
        setShowModal(true)
      }
    }
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Modifier</strong> <small>Client</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="name">Nom</CFormLabel>
                <CFormInput id="name" value={formData.name} onChange={handleChange} />
              </CCol>
            
              <CCol md={6}>
                <CFormLabel htmlFor="address">Adresse</CFormLabel>
                <CFormInput id="address" value={formData.address} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="postal_code">Code Postal</CFormLabel>
                <CFormInput id="postal_code" value={formData.postal_code} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="country">Pays</CFormLabel>
                <CFormInput id="country" value={formData.country} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="phone">Téléphone</CFormLabel>
                <CFormInput id="phone" value={formData.phone} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="mobile">Mobile</CFormLabel>
                <CFormInput id="mobile" value={formData.mobile} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="fax">Fax</CFormLabel>
                <CFormInput id="fax" value={formData.fax} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput id="email" value={formData.email} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="cityID">Ville</CFormLabel>
                <CFormSelect id="cityID" value={formData.cityID} onChange={handleChange}>
                  <option value="">Choisir...</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.value}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  Modifier
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
  )
}

export default EditClient
