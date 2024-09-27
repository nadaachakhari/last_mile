import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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
import { useAuth } from '../../../Middleware/Use_Auth'
const EditSupplier = () => {
  const { id } = useParams(); // Récupérer l'ID du fournisseur à éditer depuis les paramètres d'URL
  const navigate = useNavigate(); // Pour la navigation
  const [formData, setFormData] = useState({
    name: '',
    type_supplierID: '',
    code: '',
    address: '',
    postal_code: '',
    country: '',
    phone: '',
    mobile: '',
    fax: '',
    email: '',
    cityID: '',
    deleted: true,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [typeSuppliers, setTypeSuppliers] = useState([]); // État pour stocker la liste des types de fournisseurs
  const [cities, setCities] = useState([]); // État pour stocker la liste des villes
  const { role } = useAuth();
  // Utiliser useEffect pour récupérer les détails du fournisseur à éditer
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'Administrateur') {
      navigate('/unauthorized');
    }
    const fetchSupplierDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/Tier/supplier/${id}`);
        setFormData(response.data); // Pré-remplir le formulaire avec les détails du fournisseur
      } catch (error) {
        console.error(`Erreur lors de la récupération des détails du fournisseur avec l'ID ${id}:`, error);
      }
    };

    // Charger la liste des types de fournisseurs et des villes
    const fetchTypeSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/TypeTiers');
        setTypeSuppliers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des types de fournisseurs:', error);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:5001/City');
        setCities(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error);
      }
    };

    fetchSupplierDetails();
    fetchTypeSuppliers();
    fetchCities();
  }, [id,role,navigate]);

  // Gérer les modifications du formulaire
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Soumettre le formulaire d'édition du fournisseur
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5001/Tier/upload-supplier/${id}`, formData);
      console.log('Réponse serveur:', response.data);
      navigate('/admin/list_fournisseur'); // Rediriger vers la liste des fournisseurs après édition
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error) {
        setModalMessage(error.response.data.error);
        setShowModal(true);
      } else {
        console.error('Erreur lors de la soumission du formulaire:', error);
      }
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Modifier</strong> <small>Fournisseur</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="name">Nom</CFormLabel>
                <CFormInput id="name" value={formData.name} onChange={handleChange} />
              </CCol>
             
              <CCol md={6}>
                <CFormLabel htmlFor="code">Code</CFormLabel>
                <CFormInput id="code" value={formData.code} onChange={handleChange} />
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
  );
};

export default EditSupplier;
