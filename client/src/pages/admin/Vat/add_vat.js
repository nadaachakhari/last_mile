import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
const AddVat = () => {
  const [formData, setFormData] = useState({
    value: '',
    deleted: false,
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
  },  [role, navigate])
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké
    try {
      const response = await axios.post(
        'http://localhost:5001/vat', // URL de l'API
        { // Corps de la requête contenant les données à envoyer
          value: formData.value,
          deleted: formData.deleted,
        },
        { // Options de la requête, y compris les en-têtes
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans les en-têtes
            'Content-Type': 'application/json', // S'assurer que le type de contenu est JSON
          },
        }
      );
      console.log('Réponse serveur:', response.data);
      // Rediriger l'utilisateur vers la liste des TVA ou afficher un message de succès
      navigate('/admin/list_vat');
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
            <strong>Ajouter</strong> <small>TVA</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="value">Valeur de la TVA</CFormLabel>
                <CFormInput
               
                  step="0.01"
                  id="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                />
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
  );
};

export default AddVat;
