import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CIcon from '@coreui/icons-react'
import { IoEyeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';
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
import { cilX, cilInfo, cilPencil } from '@coreui/icons';
const ListeCity = () => {
  const [city, setcity] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    const fetchcity = async () => {
      try {
        const response = await axios.get('http://localhost:5001/city');
        setcity(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des city:', error);
      }
    };

    fetchcity();
  }, []);

  const handleDetail = async (idcity) => {
    try {
      const response = await axios.get(`http://localhost:5001/city/${idcity}`);
      console.log('Détails du city:', response.data);
      // Implémentez la logique pour afficher les détails du city (par exemple, ouvrir un modal)
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails du city avec l'ID ${idcity}:`, error);
    }
  };

  const handleModifier = (idcity) => {
    navigate(`/admin/edit_city/${idcity}`); // Navigate to edit page
  };

  const handleSupprimer = async (idcity) => {
    setIdToDelete(idcity); // Stocke l'ID du city à supprimer
    setShowConfirmation(true); // Affiche la popup de confirmation
  };

  const confirmDelete = async () => {
    try {
      await axios.put(`http://localhost:5001/city/update_deleted/${idToDelete}`);
      // Mettre à jour localement en filtrant les éléments supprimés
      const updatedList = city.filter((type) => type.id !== idToDelete);
      setcity(updatedList);
      console.log(`city avec l'ID ${idToDelete} marqué comme supprimé.`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du city avec l'ID ${idToDelete}:`, error);
    } finally {
      setShowConfirmation(false); // Ferme la popup de confirmation après suppression
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false); // Annule la suppression et ferme la popup de confirmation
  };

  const handleAddcity = () => {
    navigate('/admin/add_city'); // Navigate to the add page
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Liste des</strong> <small>ville</small>
          </CCardHeader>
          <CCardBody>
          <Link to={`/admin/add_city`}>
            <CButton color="primary" onClick={handleAddcity} className="mb-3">
              Ajouter ville
            </CButton>
            </Link>
            <CTable striped>
              <CTableCaption>Liste des ville actifs</CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {city.map((type, index) => (
                  <CTableRow key={type.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{type.value}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/admin/detail_city/${type.id}`}>
                        <CButton size="md" color="info" className="me-2 ">
                    
                          <IoEyeSharp className="icon-white icon-lg me-7" />
                         
                        </CButton>
                      </Link>
                      <Link to={`/admin/edit_city/${type.id}`}>
                        <CButton size="md" color="warning" onClick={() => handleModifier(type.id)} className="me-2">
                        <FaEdit  className="icon-whiteicon-lg me-7" />
                       
                        </CButton>
                      </Link>
                      <CButton size="md" color="danger"  onClick={() => handleSupprimer(type.id)} className="me-2">
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
        <CModalBody>
          Êtes-vous sûr de vouloir supprimer ce ville ?
        </CModalBody>
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

export default ListeCity;
