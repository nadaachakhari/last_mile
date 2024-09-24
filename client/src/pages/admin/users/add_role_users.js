import React, { useState, useEffect } from 'react'; // Ajout de useEffect
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Middleware/Use_Auth'; // Ajout de l'import du hook useAuth
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

const AddRoleUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    deleted: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const { role } = useAuth(); // Utilisation du hook useAuth pour récupérer le rôle

  // Gestion du changement des champs de formulaire
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Vérification du rôle dans useEffect
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'Administrateur') {
      navigate('/unauthorized');
    }
  }, [role, navigate]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/RoleUsers/', {
        name: formData.name,
        deleted: formData.deleted,
      });
      console.log('Réponse serveur:', response.data);
      navigate('/admin/list_role_users'); // Redirection après succès
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
      {role === 'Administrateur' && ( // Afficher le formulaire seulement si l'utilisateur est un administrateur
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Ajouter</strong> <small>Role User</small>
            </CCardHeader>
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit}>
                <CCol md={6}>
                  <CFormLabel htmlFor="name">Nom du Role User</CFormLabel>
                  <CFormInput
                    id="name"
                    value={formData.name}
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
      )}

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

export default AddRoleUser;
