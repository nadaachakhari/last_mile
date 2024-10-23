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
import { Link ,useNavigate} from 'react-router-dom';
import { IoEyeSharp } from 'react-icons/io5';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../../Middleware/Use_Auth'; 
const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const navigate = useNavigate();
  const { role } = useAuth(); 
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'fournisseur' &&  role !=='Administrateur') {
      navigate('/unauthorized');
    }
    const fetchArticles = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token non trouvé dans localStorage.');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5001/Article', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setArticles(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
      }
    };

    fetchArticles();
  }, [role,navigator]);

  const handleSupprimer = (articleId) => {
    setSelectedArticleId(articleId);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.put(`http://localhost:5001/Article/update_deleted/${selectedArticleId}`);
      
      if (response.status === 200) {
        // Successfully marked as deleted, update the article list
        setArticles(articles.filter(a => a.id !== selectedArticleId));
        setShowConfirmation(false);
      } 
    } catch (error) {
      // Check if the error message indicates associated order lines
      if (error.response && error.response.status === 400 && error.response.data.error.includes('associated order lines')) {
        alert('Cet article a des lignes de commande associées et ne peut pas être supprimé.');
      } else {
        console.error('Erreur lors de la suppression de l\'article:', error);
      }
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
            <Link to={`/add_article`}>
              <CButton color="primary" className="mb-3">
                Ajouter Article
              </CButton>
            </Link>
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
                    <CTableDataCell>{article.sale_ht.toFixed(3)}</CTableDataCell>
                    <CTableDataCell>{article.sale_ttc.toFixed(3)}</CTableDataCell>
                    <CTableDataCell>{article.Category.name}</CTableDataCell> {/* Retiré .toFixed() ici */}
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
                      <Link to={`/detail_article/${article.id}`}>
                        <CButton size="md" color="info" className="me-2">
                          <IoEyeSharp className="icon-white icon-lg me-7" />
                        </CButton>
                      </Link>
                      <Link to={`/edit_article/${article.id}`}>
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
