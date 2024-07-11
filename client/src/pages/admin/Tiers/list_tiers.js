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
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { IoEyeSharp } from 'react-icons/io5';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TierList = () => {
  const [tiers, setTiers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null); // État pour stocker l'ID du tier à supprimer

  useEffect(() => {
    // Fonction pour récupérer les tiers depuis l'API
    const fetchTiers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/Tier');
        setTiers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tiers:', error);
      }
    };

    fetchTiers();
  }, []);

  // Fonction pour gérer la modification d'un tier
  const handleModifier = (id) => {
    console.log(`Modifier tier avec id: ${id}`);
    // Ajouter ici la logique pour la redirection ou l'ouverture de la page de modification
  };

  // Fonction pour gérer la suppression d'un tier
  const handleSupprimer = async (id) => {
    setIdToDelete(id); // Stocker l'ID du tier à supprimer
    setShowConfirmation(true); // Afficher la modal de confirmation de suppression
  };

  // Fonction de confirmation de suppression
  const confirmDelete = async () => {
    try {
      await axios.put(`http://localhost:5001/Tier/update_deleted/${idToDelete}`);
      // Mettre à jour localement en filtrant le tier supprimé
      const updatedList = tiers.filter((tier) => tier.id !== idToDelete);
      setTiers(updatedList);
      console.log(`Supprimé tier avec id: ${idToDelete}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du tier:', error);
    } finally {
      setShowConfirmation(false); // Fermer la modal de confirmation après suppression
    }
  };

  // Fonction pour annuler la suppression
  const cancelDelete = () => {
    setShowConfirmation(false); // Annuler la suppression et fermer la modal de confirmation
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Liste</strong> <small>des Tiers</small>
          </CCardHeader>
          <CCardBody>
            <Link to={`/admin/add_tiers`}>
              <CButton color="primary" className="mb-3">
                Ajouter Tiers
              </CButton>
            </Link>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Nom</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Code</CTableHeaderCell>
                  <CTableHeaderCell>Adresse</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {tiers.map((tier, index) => (
                  <CTableRow key={tier.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{tier.name}</CTableDataCell>
                    <CTableDataCell>{tier.TypeTier?.name}</CTableDataCell>
                    <CTableDataCell>{tier.code}</CTableDataCell>
                    <CTableDataCell>{tier.address}</CTableDataCell>
                    <CTableDataCell>{tier.email}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/admin/detail_tiers/${tier.id}`}>
                        <CButton size="md" color="info" className="me-2">
                          <IoEyeSharp className="icon-white icon-lg me-1" />
                        </CButton>
                      </Link>
                      <Link to={`/admin/edit_tiers/${tier.id}`}>
                        <CButton size="md" color="warning" onClick={() => handleModifier(tier.id)} className="me-2">
                          <FaEdit className="icon-white icon-lg me-1" />
                        </CButton>
                      </Link>
                      <CButton size="md" color="danger" onClick={() => handleSupprimer(tier.id)} className="me-2">
                        <FaTrash className="icon-white icon-lg me-1" />
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
          Êtes-vous sûr de vouloir supprimer ce Tier ?
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

export default TierList;
