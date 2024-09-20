import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
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

const AddSupplier = () => {
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
  const [userDetails, setUserDetails] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:5001/City/')
        setCities(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error)
      }
    }

    fetchCities()
  }, [])

  useEffect(() => {
    const updateUserName = async () => {
      
      const userName = await generateSupplierUserName(formData.name, formData.email)
     
      setFormData((prev) => ({ ...prev, user_name: userName }))
    }

    if (formData.name && formData.email) {
      updateUserName()
    }
  }, [formData.name, formData.email])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!token) {
      console.error('Token non trouvé dans localStorage.')
      return
    }

    try {
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.id

      const supplierData = {
        ...formData,
        userId: userId,
      }

      const response = await axios.post(
        'http://localhost:5001/Tier/create-supplier',
        supplierData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

    //   console.log('Réponse serveur:', response.data)
      navigate('/admin/list_fournisseur')
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          console.error('Accès refusé: Vérifiez les autorisations.')
        } else if (error.response.status === 400 && error.response.data.error) {
          setModalMessage(error.response.data.error)
          setShowModal(true)
        } else {
          console.error('Erreur inattendue:', error.response.data)
        }
      } else {
        console.error('Erreur lors de la soumission du formulaire:', error.message)
      }
    }
  }

  const generateSupplierUserName = async (name, email) => {
    const cleanString = (str) => str.replace(/[^a-zA-Z]/g, '').toLowerCase()
    const namePart = cleanString(name)
    const emailPart = cleanString(email.split('@')[0])
    let baseUserName = `${namePart}.${emailPart}`
    let userName = baseUserName

    let userExists = await axios.get(`http://localhost:5001/Tier/checkUserName/${userName}`)

    let counter = 1
    while (userExists.data.exists) {
      userName = `${baseUserName}${counter}`
      userExists = await axios.get(`http://localhost:5001/Tier/checkUserName/${userName}`)
      counter++
    }

    return userName
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Ajouter</strong> <small>Fournisseur</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="name">Nom</CFormLabel>
                <CFormInput id="name" value={formData.name} onChange={handleChange} required />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="user_name">Nom d'utilisateur</CFormLabel>
                <CFormInput
                  id="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  disabled
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="cityID">Ville</CFormLabel>
                <CFormSelect id="cityID" value={formData.cityID} onChange={handleChange} required>
                  <option value="">Choisissez...</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.value}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="address">Adresse</CFormLabel>
                <CFormInput
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="postal_code">Code Postal</CFormLabel>
                <CFormInput
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="country">Pays</CFormLabel>
                <CFormInput
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="phone">Téléphone</CFormLabel>
                <CFormInput id="phone" value={formData.phone} onChange={handleChange} required />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="mobile">Mobile</CFormLabel>
                <CFormInput id="mobile" value={formData.mobile} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="fax">Fax</CFormLabel>
                <CFormInput id="fax" value={formData.fax} onChange={handleChange} />
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  Ajouter
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

export default AddSupplier
