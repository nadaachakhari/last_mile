import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import { useAuth } from '../../../Middleware/Use_Auth';
const ListeCategory = () => {
  const [categories, setCategories] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const navigate = useNavigate();
  const { role } = useAuth(); 
  useEffect(() => {
    if (!role) {
      return;
    }

    console.log('User role:', role);

    if (role !== 'fournisseur') {
      navigate('/unauthorized');
    }
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token non trouvé dans localStorage.');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5001/Category', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    fetchCategories();
  }, [role,navigate]);

  const handleDetail = async (idCategory) => {
    try {
      const response = await axios.get(`http://localhost:5001/Category/${idCategory}`);
      console.log('Détails de la catégorie:', response.data);
      // Implémentez la logique pour afficher les détails de la catégorie (par exemple, ouvrir un modal)
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails de la catégorie avec l'ID ${idCategory}:`, error);
    }
  };

  const handleModifier = (idCategory) => {
    navigate(`/admin/edit_category/${idCategory}`); // Navigate to edit page
  };

  const handleSupprimer = async (idCategory) => {
    setIdToDelete(idCategory); // Stocke l'ID de la catégorie à supprimer
    setShowConfirmation(true); // Affiche la popup de confirmation
  };

  const confirmDelete = async () => {
    try {
      await axios.put(`http://localhost:5001/Category/update_deleted/${idToDelete}`);
      // Mettre à jour localement en filtrant les éléments supprimés
      const updatedList = categories.filter((category) => category.id !== idToDelete);
      setCategories(updatedList);
      console.log(`Catégorie avec l'ID ${idToDelete} supprimée.`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la catégorie avec l'ID ${idToDelete}:`, error);
    } finally {
      setShowConfirmation(false); // Ferme la popup de confirmation après suppression
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false); // Annule la suppression et ferme la popup de confirmation
  };

  const handleAddCategory = () => {
    navigate('/admin/add_category'); // Navigate to the add page
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Liste des</strong> <small>Catégories</small>
          </CCardHeader>
          <CCardBody>
            <Link to={`/admin/add_category`}>
              <CButton color="primary" onClick={handleAddCategory} className="mb-3">
                Ajouter Catégorie
              </CButton>
            </Link>
            <CTable striped>
              <CTableCaption>Liste des catégories</CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {categories.map((category, index) => (
                  <CTableRow key={category.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{category.name}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/admin/detail_category/${category.id}`}>
                        <CButton size="md" color="info" className="me-2">
                          <IoEyeSharp className="icon-white icon-lg me-7" />
                        </CButton>
                      </Link>
                      <Link to={`/admin/edit_category/${category.id}`}>
                        <CButton size="md" color="warning" onClick={() => handleModifier(category.id)} className="me-2">
                          <FaEdit className="icon-white icon-lg me-7" />
                        </CButton>
                      </Link>
                      <CButton size="md" color="danger" onClick={() => handleSupprimer(category.id)} className="me-2">
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
        <CModalBody>Êtes-vous sûr de vouloir supprimer cette catégorie ?</CModalBody>
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

export default ListeCategory;
