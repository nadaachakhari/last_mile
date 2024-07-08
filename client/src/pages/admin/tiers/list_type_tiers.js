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
const ListeTypeTiers = () => {
  const [typeTiers, setTypeTiers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    const fetchTypeTiers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/typeTiers');
        setTypeTiers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des types de tiers:', error);
      }
    };

    fetchTypeTiers();
  }, []);

  const handleDetail = async (idTypeTiers) => {
    try {
      const response = await axios.get(`http://localhost:5001/typeTiers/${idTypeTiers}`);
      console.log('Détails du TypeTiers:', response.data);
      // Implémentez la logique pour afficher les détails du TypeTiers (par exemple, ouvrir un modal)
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails du TypeTiers avec l'ID ${idTypeTiers}:`, error);
    }
  };

  const handleModifier = (idTypeTiers) => {
    navigate(`/admin/edit_type_tiers/${idTypeTiers}`); // Navigate to edit page
  };

  const handleSupprimer = async (idTypeTiers) => {
    setIdToDelete(idTypeTiers); // Stocke l'ID du TypeTiers à supprimer
    setShowConfirmation(true); // Affiche la popup de confirmation
  };

  const confirmDelete = async () => {
    try {
      await axios.put(`http://localhost:5001/typeTiers/update_deleted/${idToDelete}`);
      // Mettre à jour localement en filtrant les éléments supprimés
      const updatedList = typeTiers.filter((type) => type.id !== idToDelete);
      setTypeTiers(updatedList);
      console.log(`TypeTiers avec l'ID ${idToDelete} marqué comme supprimé.`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du TypeTiers avec l'ID ${idToDelete}:`, error);
    } finally {
      setShowConfirmation(false); // Ferme la popup de confirmation après suppression
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false); // Annule la suppression et ferme la popup de confirmation
  };

  const handleAddTypeTiers = () => {
    navigate('/admin/add_type_tiers'); // Navigate to the add page
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Liste des</strong> <small>Types de Tiers</small>
          </CCardHeader>
          <CCardBody>
            <CButton color="primary" onClick={handleAddTypeTiers} className="mb-3">
              Ajouter Type de Tiers
            </CButton>
            <CTable striped>
              <CTableCaption>Liste des types de tiers actifs</CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {typeTiers.map((type, index) => (
                  <CTableRow key={type.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{type.name}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/admin/detail_type_tiers/${type.id}`}>
                        <CButton size="md" color="info" className="me-2 ">
                    
                          <IoEyeSharp className="icon-white icon-lg me-7" />
                         
                        </CButton>
                      </Link>
                      <Link to={`/admin/edit_type_tiers/${type.id}`}>
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
          Êtes-vous sûr de vouloir supprimer ce Type de Tiers ?
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

export default ListeTypeTiers;
