import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
import { useAuth } from '../../../Middleware/Use_Auth';
const AddOrder = () => {
  const [formData, setFormData] = useState({
    
    date: '',
    customerID: '',
    observation: '',
    note: '',
    bankID: '',
    ID_payment_method: '',
    destination: '',
    articles: [{ id: '', quantity: '' }],
  })
  const [grossAmount, setGrossAmount] = useState(0)
  const [customers, setCustomers] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [articles, setArticles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [dateError, setDateError] = useState('')
  const [codeError, setCodeError] = useState('')
  const [bankError, setBankError] = useState('')
  const [banks, setBanks] = useState([])
  const [selectedBankID, setSelectedBankID] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const navigate = useNavigate()
  const { role } = useAuth(); // Utilisation du hook useAuth pour récupérer le rôle
  
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'fournisseur') {
      navigate('/unauthorized');
    } 
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token non trouvé dans localStorage.')
        return
      }
      try {
        const response = await axios.get('http://localhost:5001/Tier/clientbysupplier', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const allTiers = response.data

        setCustomers(allTiers)
      } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error)
      }
    }

    const fetchPaymentMethods = async () => {
           try {
        const response = await axios.get('http://localhost:5001/PaymentMethode/')
        setPaymentMethods(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des méthodes de paiement:', error)
      }
    }

    const fetchArticles = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('Token non trouvé dans localStorage.')
        return
      }
      try {
        const response = await axios.get('http://localhost:5001/Article/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setArticles(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error)
      }
    }

    const fetchBanks = async () => {
      try {
        const response = await axios.get('http://localhost:5001/Bank/')
        setBanks(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des banques:', error)
      }
    }

    fetchBanks()
    fetchCustomers()
    fetchPaymentMethods()
    fetchArticles()
  }, [role, navigate])

  const checkOrderCodeExists = async (code) => {
    try {
      const response = await axios.get(`http://localhost:5001/Order/check-code/${code}`)
      return response.data.exists
    } catch (error) {
      console.error('Erreur lors de la vérification du code de commande:', error)
      return false
    }
  }

  const handleChange = async (e) => {
    const { id, value } = e.target

    if (id === 'date') {
      const selectedDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        setDateError("La date ne peut pas être antérieure à aujourd'hui.")
        return
      } else {
        setDateError('')
      }
    }

    if (id === 'code') {
      const codeExists = await checkOrderCodeExists(value)
      if (codeExists) {
        setCodeError('Le code de commande existe déjà. Veuillez en choisir un autre.')
        setModalMessage('Le code de commande existe déjà. Veuillez en choisir un autre.')
        setShowModal(true)
        return
      } else {
        setCodeError('')
      }
    }

    if (id === 'ID_payment_method') {
      setFormData({ ...formData, [id]: value })

      const selectedPaymentMethod = paymentMethods.find((method) => method.id === parseInt(value))
      if (selectedPaymentMethod && selectedPaymentMethod.value === 'chèque') {
        setSelectedPaymentMethod(selectedPaymentMethod.value)
        setShowBankDropdown(true)
      } else {
        setShowBankDropdown(false)
        setSelectedBankID('')
      }
      return
    }

    setFormData({ ...formData, [id]: value })
  }

  const handleArticleChange = (e, index) => {
    const { name, value } = e.target
    const updatedArticles = [...formData.articles]
    updatedArticles[index] = { ...updatedArticles[index], [name]: value }
    setFormData({ ...formData, articles: updatedArticles })
    calculateGrossAmount(updatedArticles)
  }

  const handleBankChange = (e) => {
    console.log('Selected Bank ID:', e.target.value)
    setSelectedBankID(e.target.value)
  }

  const addArticle = () => {
    setFormData({
      ...formData,
      articles: [...formData.articles, { id: '', quantity: '' }],
    })
  }

  const removeArticle = (index) => {
    const updatedArticles = [...formData.articles]
    updatedArticles.splice(index, 1)
    setFormData({ ...formData, articles: updatedArticles })
    calculateGrossAmount(updatedArticles)
  }

  const calculateGrossAmount = (updatedArticles) => {
    let total = 0
    updatedArticles.forEach((article) => {
      const selectedArticle = articles.find((a) => a.id === parseInt(article.id))
      if (selectedArticle) {
        total += selectedArticle.sale_ttc * article.quantity
      }
    })
    setGrossAmount(total)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!token) {
      console.error('Token non trouvé dans localStorage.')
      return
    }

    if (dateError || codeError || bankError) {
      console.error('Formulaire invalide')
      return
    }

    if (showBankDropdown && !selectedBankID) {
      setBankError('Veuillez sélectionner une banque pour le paiement par chèque.')
      return
    } else {
      setBankError('')
    }

    const dataToSubmit = {
      ...formData,
      gross_amount: grossAmount,
    }

    if (selectedPaymentMethod === 'chèque' && showBankDropdown) {
      dataToSubmit.bankID = parseInt(selectedBankID)
    }

    console.log('Data to submit:', dataToSubmit)

    try {
      const response = await axios.post('http://localhost:5001/Order/', dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Réponse serveur:', response.data)
      navigate('/admin/list_order')
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
                <CFormLabel htmlFor="date">Date</CFormLabel>
                <CFormInput
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                {dateError && <p className="text-danger">{dateError}</p>}
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
              {showBankDropdown && (
                <CCol md={3}>
                  <CFormLabel htmlFor="bankID">Sélectionner une Banque</CFormLabel>
                  <CFormSelect id="bankID" value={selectedBankID} onChange={handleBankChange}>
                    <option value="">Sélectionner une banque</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.value}
                      </option>
                    ))}
                  </CFormSelect>
                  {bankError && <p className="text-danger">{bankError}</p>}
                </CCol>
              )}
              <CCol md={6}>
                <CFormLabel htmlFor="observation">Observation</CFormLabel>
                <CFormInput id="observation" value={formData.observation} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="note">Note</CFormLabel>
                <CFormInput id="note" value={formData.note} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="destination">Destination</CFormLabel>
                <CFormInput
                  id="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </CCol>

              <CCol xs={12}>
                <CButton color="primary" onClick={addArticle}>
                  Ajouter Article
                </CButton>
              </CCol>
              {formData.articles.map((article, index) => (
                <React.Fragment key={index}>
                  <CCol md={6}>
                    <CFormLabel>Article</CFormLabel>
                    <CFormSelect
                      name="id"
                      value={article.id}
                      onChange={(e) => handleArticleChange(e, index)}
                      required
                    >
                      <option value="">Choisir un article...</option>
                      {articles.map((article) => (
                        <option key={article.id} value={article.id}>
                          {article.name} - {article.code}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel>Quantité</CFormLabel>
                    <CFormInput
                      name="quantity"
                      type="number"
                      value={article.quantity}
                      onChange={(e) => handleArticleChange(e, index)}
                      required
                    />
                  </CCol>
                  <CCol md={3}>
                    <CButton color="danger" onClick={() => removeArticle(index)}>
                      Supprimer
                    </CButton>
                  </CCol>
                </React.Fragment>
              ))}
              <CCol xs={12} className="d-flex align-items-center">
                <CFormLabel className="ms-3">Montant Total :</CFormLabel>
                <CFormInput type="text" value={grossAmount.toFixed(3)} disabled />
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  Créer Commande
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

export default AddOrder
