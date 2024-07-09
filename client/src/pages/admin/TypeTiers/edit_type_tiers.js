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

const EditTypeTiers = () => {
  const { id } = useParams(); // Get ID from URL parameters for editing
  const navigate = useNavigate(); // For navigation
  const [formData, setFormData] = useState({
    name: '',
    deleted: '1',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (id) {
      // If there's an ID, fetch the existing TypeTiers details
      const fetchTypeTiers = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/typeTiers/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error(`Erreur lors de la récupération des détails du TypeTiers avec l'ID ${id}:`, error);
        }
      };
      fetchTypeTiers();
    }
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update the existing TypeTiers
      await axios.put(`http://localhost:5001/typeTiers/${id}`, formData);
      navigate('/admin/list_type_tiers'); // Navigate back to list after successful submission
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
            <strong>Modifier</strong> <small>Type de Tiers</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="name">Nom du Type de Tiers</CFormLabel>
                <CFormInput id="name" value={formData.name} onChange={handleChange} />
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

export default EditTypeTiers;
