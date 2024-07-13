import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CImage
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { IoEyeSharp } from 'react-icons/io5';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:5001/Article');
        setArticles(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleSupprimer = (articleId) => {
    setSelectedArticleId(articleId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.put(`http://localhost:5001/Article/update_deleted/${selectedArticleId}`);
      setArticles(articles.filter(a => a.id !== selectedArticleId));
      setShowConfirmation(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
    }
  };

  const cancelDelete = () => {
    setSelectedArticleId(null);
    setShowConfirmation(false);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Liste</strong> <small>des Articles</small>
          </CCardHeader>
          <CCardBody>
            <CTable striped>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Prix HT</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Prix TTC</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Catégorie</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Photo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {articles.map((article) => (
                  <CTableRow key={article.id}>
                    <CTableDataCell>{article.code}</CTableDataCell>
                    <CTableDataCell>{article.name}</CTableDataCell>
                    <CTableDataCell>{article.sale_ht}</CTableDataCell>
                    <CTableDataCell>{article.sale_ttc}</CTableDataCell>
                    <CTableDataCell>{article.Category.name}</CTableDataCell>
                    <CTableDataCell>
                      {article.photo && (
                        <CImage
                          src={`http://localhost:5001/uploads/${article.photo}`}
                          alt={article.name}
                          width={100}
                        />
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/admin/detail_article/${article.id}`}>
                        <CButton size="md" color="info" className="me-2">
                          <IoEyeSharp className="icon-white icon-lg me-7" />
                        </CButton>
                      </Link>
                      <Link to={`/admin/edit_article/${article.id}`}>
                        <CButton size="md" color="warning" className="me-2">
                          <FaEdit className="icon-white icon-lg me-7" />
                        </CButton>
                      </Link>
                      <CButton
                        size="md"
                        color="danger"
                        onClick={() => handleSupprimer(article.id)}
                        className="me-2"
                      >
                        <FaTrash className="icon-white icon-lg me-7" />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal de confirmation de suppression */}
      <CModal visible={showConfirmation} onClose={cancelDelete}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmation de suppression</CModalTitle>
        </CModalHeader>
        <CModalBody>Êtes-vous sûr de vouloir supprimer cet article ?</CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={confirmDelete}>
            Supprimer
          </CButton>
          <CButton color="secondary" onClick={cancelDelete}>
            Annuler
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default ArticleList;
