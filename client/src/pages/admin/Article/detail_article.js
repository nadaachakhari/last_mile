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

const DetailArticle = () => {
  const { id } = useParams(); // Get ID from URL parameters
  const navigate = useNavigate(); // For navigation
  const [article, setArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/Article/${id}`);
        setArticle(response.data);
      } catch (error) {
        setModalMessage(`Erreur lors de la récupération des détails de l'article avec l'ID ${id}`);
        setShowModal(true);
        console.error(error);
      }
    };
    fetchArticle();
  }, [id]);

  const handleReturn = () => {
    navigate('/fournisseur/list_article'); // Navigate back to list
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Détails</strong> <small>Article</small>
          </CCardHeader>
          <CCardBody>
            {article ? (
              <div>
                <p><strong>Code:</strong> {article.code}</p>
                <p><strong>Nom:</strong> {article.name}</p>
                <p><strong>TVA:</strong> {article.Vat.value}%</p>
                <p><strong>Prix HT:</strong> {article.sale_ht}</p>
                <p><strong>Prix TTC:</strong> {article.sale_ttc}</p>
                <p><strong>Catégorie:</strong> {article.Category.name}</p>
                <p><strong>Code Barre:</strong> {article.bar_code}</p>
           
                {article.photo && (
                  <div>
                    <strong>Photo:</strong>
                    <img src={`http://localhost:5001/uploads/${article.photo}`} alt="Article" width="100" />
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

export default DetailArticle;
