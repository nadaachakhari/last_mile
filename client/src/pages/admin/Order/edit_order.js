import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@coreui/react';

const EditOrder = () => {
  const [formData, setFormData] = useState({
    code: '',
    date: '',
    customerID: '',
    observation: '',
    note: '',
    ID_payment_method: '',
    total_amount: '',
    destination: '',
    articles: [{ id: '', quantity: '' }],
  });
  const [grossAmount, setGrossAmount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [availableArticles, setAvailableArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [dateError, setDateError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/Order/ordrelines/${id}`);
        const { order, orderLignes } = response.data;

        // Initialize formData with order and orderLignes data
        setFormData({
          code: order.code || '',
          date: new Date(order.date).toISOString().split('T')[0],
          customerID: order.customerID || '',
          observation: order.observation || '',
          note: order.note || '',
          ID_payment_method: order.ID_payment_method || '',
          total_amount: order.total_amount || '',
          destination: order.destination || '',
          articles: orderLignes.map(line => ({
            id: line.article.id,
            quantity: line.quantity
          })),
        });

        // Calculate gross amount based on fetched order lines
        calculateGrossAmount(orderLignes);
      } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/Tier/');
        const allTiers = response.data;
        const filteredCustomers = allTiers.filter(
          (tier) => tier.TypeTier && tier.TypeTier.name === 'client'
        );
        setCustomers(filteredCustomers);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients:', error);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('http://localhost:5001/PaymentMethode/');
        setPaymentMethods(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des méthodes de paiement:', error);
      }
    };

    const fetchArticles = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
          console.error('Token non trouvé dans localStorage.');
          return;
      }
      try {
        const response = await axios.get('http://localhost:5001/Article/', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
        setAvailableArticles(response.data); // Rename state to avoid confusion
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
      }
    };

    fetchOrder();
    fetchCustomers();
    fetchPaymentMethods();
    fetchArticles();
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDateError("La date ne peut pas être antérieure à aujourd'hui.");
        return;
      } else {
        setDateError('');
      }
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleArticleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedArticles = [...formData.articles];
    updatedArticles[index] = { ...updatedArticles[index], [name]: value };
    setFormData({ ...formData, articles: updatedArticles });
    calculateGrossAmount(updatedArticles);
  };

  const addArticle = () => {
    setFormData({
      ...formData,
      articles: [...formData.articles, { id: '', quantity: '' }],
    });
  };

  const removeArticle = (index) => {
    const updatedArticles = [...formData.articles];
    updatedArticles.splice(index, 1);
    setFormData({ ...formData, articles: updatedArticles });
    calculateGrossAmount(updatedArticles);
  };

  const calculateGrossAmount = (updatedArticles) => {
    let total = 0;
    updatedArticles.forEach((article) => {
      const selectedArticle = availableArticles.find((a) => a.id === parseInt(article.id));
      if (selectedArticle) {
        total += selectedArticle.sale_ttc * article.quantity;
      }
    });
    setGrossAmount(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token non trouvé dans localStorage.');
      return;
    }
    if (dateError) {
      console.error('Date invalide');
      return;
    }
    const dataToSubmit = {
      ...formData,
      gross_amount: grossAmount,
    };

    try {
      const response = await axios.put(`http://localhost:5001/Order/${id}`, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Réponse serveur:', response.data);
      navigate('/admin/list_order');
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
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Modifier</strong> <small>Commande</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="code">Code</CFormLabel>
                <CFormInput
                  id="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </CCol>
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
              <CCol md={6}>
                <CFormLabel htmlFor="observation">Observation</CFormLabel>
                <CFormInput
                  id="observation"
                  value={formData.observation}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="note">Note</CFormLabel>
                <CFormInput
                  id="note"
                  value={formData.note}
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="destination">Destination</CFormLabel>
                <CFormInput
                  id="destination"
                  value={formData.destination}
                  onChange={handleChange}
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
                      {availableArticles.map((availableArticle) => (
                        <option key={availableArticle.id} value={availableArticle.id}>
                          {availableArticle.name} - {availableArticle.code}
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
                <CFormInput
                  type="text"
                  value={grossAmount.toFixed(3)}
                  disabled
                />
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  Sauvegarder les Modifications
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

export default EditOrder;
