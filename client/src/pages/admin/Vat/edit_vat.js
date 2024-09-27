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
} from '@coreui/react';
import { useAuth } from '../../../Middleware/Use_Auth';
const EditVat = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    value: '',
    deleted: '1',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const { role } = useAuth(); 
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'fournisseur') {
      navigate('/unauthorized');
    }
    const fetchVat = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/vat/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error(`Erreur lors de la récupération de la TVA avec l'ID ${id}:`, error);
        setModalMessage('Erreur lors de la récupération de la TVA.');
        setShowModal(true);
      }
    };

    fetchVat();
  }, [id,role,navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/vat/${id}`, formData);
      navigate('/admin/list_vat');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la TVA:', error);
      setModalMessage('Erreur lors de la mise à jour de la TVA.');
      setShowModal(true);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Modifier</strong> <small>TVA</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="value">Valeur de la TVA</CFormLabel>
                <CFormInput id="value" value={formData.value} onChange={handleChange} />
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  Modifier
                </CButton>
                <CButton color="secondary" onClick={() => navigate('/admin/list_vat')}>
                  Retour
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
          <CButton color="secondary" onClick={() => setShowModal(false)}>Fermer</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default EditVat;
