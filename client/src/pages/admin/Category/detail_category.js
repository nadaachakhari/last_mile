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

const DetailCategory = () => {
  const { id } = useParams(); // Get ID from URL parameters
  const navigate = useNavigate(); // For navigation
  const [category, setCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/category/${id}`);
        setCategory(response.data);
      } catch (error) {
        setModalMessage(`Erreur lors de la récupération des détails de la catégorie avec l'ID ${id}`);
        setShowModal(true);
        console.error(error);
      }
    };
    fetchCategory();
  }, [id]);

  const handleReturn = () => {
    navigate('/admin/list_category'); // Navigate back to list
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Détails</strong> <small>Catégorie</small>
          </CCardHeader>
          <CCardBody>
            {category ? (
              <div>
                <p><strong>Nom:</strong> {category.name}</p>
                <p><strong>État:</strong> {category.deleted ? 'Active' : 'Inactive'}</p>
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

export default DetailCategory;
