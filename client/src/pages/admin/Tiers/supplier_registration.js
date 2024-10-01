import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilHome, cilPhone, cilLocationPin, cilGlobeAlt } from '@coreui/icons'

const Register = () => {
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
  const [showSuccessModal, setShowSuccessModal] = useState(false) // For success alert
  const [cities, setCities] = useState([])
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

    const updateUserName = async () => {
      const userName = await generateSupplierUserName(formData.name, formData.email)
      setFormData((prev) => ({ ...prev, user_name: userName }))
    }

    if (formData.name && formData.email) {
      updateUserName()
    }
    fetchCities()
  }, [formData.name, formData.email])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const supplierData = {
      ...formData,
    }

    try {
      await axios.post('http://localhost:5001/Tier/registration-supplier', supplierData)
      // Show success modal
      setShowSuccessModal(true)
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
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput id="name" placeholder="Nom" autoComplete="name" value={formData.name} onChange={handleChange} required />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput id="email" value={formData.email} onChange={handleChange} required placeholder="Email" autoComplete="email" />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput id="user_name" value={formData.user_name} disabled placeholder="Nom d'utilisateur" autoComplete="username" />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLocationPin} />
                    </CInputGroupText>
                    <CFormSelect id="cityID" value={formData.cityID} onChange={handleChange} required>
                      <option value="">Choisissez...</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.value}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilHome} />
                    </CInputGroupText>
                    <CFormInput id="address" value={formData.address} onChange={handleChange} required placeholder="Adresse" autoComplete="address" />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilHome} />
                    </CInputGroupText>
                    <CFormInput id="postal_code" value={formData.postal_code} onChange={handleChange} required placeholder="Code Postal" autoComplete="postal-code" />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilGlobeAlt} />
                    </CInputGroupText>
                    <CFormInput id="country" value={formData.country} onChange={handleChange} required placeholder="Pays" autoComplete="country" />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput id="phone" value={formData.phone} onChange={handleChange} required placeholder="Téléphone" autoComplete="phone" />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput id="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" autoComplete="mobile" />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput id="fax" value={formData.fax} onChange={handleChange} placeholder="Fax" autoComplete="fax" />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton type="submit" color="success" size="lg">
                      Créer un compte
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      {/* Error Modal */}
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

      {/* Success Modal */}
      <CModal visible={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <CModalHeader>
          <CModalTitle>Inscription réussie</CModalTitle>
        </CModalHeader>
        <CModalBody>Votre inscription a été enregistrée avec succès. Veuillez attendre la confirmation de l'administrateur.</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => setShowSuccessModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Register
