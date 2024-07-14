import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';

const DetailUser = () => {
  const { id } = useParams(); // Get ID from URL parameters
  const navigate = useNavigate(); // For navigation
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/Users/${id}`);
        setUser(response.data);
      } catch (error) {
        setModalMessage(`Erreur lors de la récupération des détails de l'utilisateur avec l'ID ${id}`);
        setShowModal(true);
        console.error(error);
      }
    };
    fetchUser();
  }, [id]);

  const handleReturn = () => {
    navigate('/admin/list_users'); // Navigate back to list
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Détails</strong> <small>Utilisateur</small>
          </CCardHeader>
          <CCardBody>
            {user ? (
              <div>
                <p><strong>Nom:</strong> {user.name}</p>
                <p><strong>Nom d'utilisateur:</strong> {user.user_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Numéro d'enregistrement:</strong> {user.registration_number}</p>
                <p><strong>CIN:</strong> {user.cin}</p>
                <p><strong>Rôle:</strong> {user.RoleUser ? user.RoleUser.name : 'N/A'}</p>
                <p><strong>Supprimé:</strong> {user.deleted ? 'Oui' : 'Non'}</p>
                {user.photo && (
                  <div>
                    <strong>Photo:</strong>
                    <img src={`http://localhost:5001/users_uploads/${user.photo}`} alt="Utilisateur" width="100" />
                  </div>
                )}
              </div>
            ) : (
              <p>Chargement des détails...</p>
            )}
            <CButton color="secondary" onClick={handleReturn}>
              Retour à la liste
            </CButton>
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

export default DetailUser;
