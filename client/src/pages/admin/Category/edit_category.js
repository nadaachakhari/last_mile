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
} from '@coreui/react';
import { useAuth } from '../../../Middleware/Use_Auth';
const EditCategory = () => {
  const { id } = useParams(); // Get ID from URL parameters for editing
  const navigate = useNavigate(); // For navigation
  const { role } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    deleted: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'fournisseur') {
      navigate('/unauthorized');
    }
    if (id) {
      // If there's an ID, fetch the existing category details
      const fetchCategory = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/category/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error(`Erreur lors de la récupération des détails de la catégorie avec l'ID ${id}:`, error);
        }
      };
      fetchCategory();
    }
  }, [id,role,navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the existing category
      await axios.put(`http://localhost:5001/category/${id}`, formData);
      navigate('/admin/list_category'); // Navigate back to list after successful submission
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error) {
        setModalMessage(error.response.data.error);
        setShowModal(true);
      } else {
        console.error('Erreur lors de la soumission du formulaire:', error);
      }
    }
  };

  const handleReturn = () => {
    navigate('/admin/list_category'); // Navigate back to list
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Modifier</strong> <small>Catégorie</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="name">Nom de la Catégorie</CFormLabel>
                <CFormInput id="name" value={formData.name} onChange={handleChange} />
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" type="submit" className="me-2">
                  Modifier
                </CButton>
                <CButton color="secondary" onClick={handleReturn}>
                  Retour à la liste
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
        <CModalBody>
          {modalMessage}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default EditCategory;
