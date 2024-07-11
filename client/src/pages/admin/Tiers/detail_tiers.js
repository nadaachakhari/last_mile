import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { IoArrowBack } from 'react-icons/io5';

const DetailTier = () => {
  const { id } = useParams(); // Récupère l'ID du tier depuis les paramètres d'URL
  const [tier, setTier] = useState(null); // État pour stocker les détails du tier
  const [showModal, setShowModal] = useState(false); // État pour contrôler l'affichage du modal

  useEffect(() => {
    // Fonction pour récupérer les détails du tier à partir de l'API
    const fetchTier = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/Tier/${id}`);
        setTier(response.data);
      } catch (error) {
        console.error(`Erreur lors de la récupération des détails du tier avec l'ID ${id}:`, error);
        // Afficher une erreur ou gérer de manière appropriée
      }
    };

    fetchTier(); // Appel de la fonction au chargement du composant
  }, [id]); // Déclenche l'effet à chaque changement de l'ID dans les paramètres d'URL

  if (!tier) {
    return (
      <CRow className="mt-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Chargement en cours...</strong>
            </CCardHeader>
            <CCardBody>
              <p>Veuillez patienter pendant le chargement des détails du tier...</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }

  const handleBack = () => {
    // Fonction pour revenir à la liste des tiers
    // Vous pouvez ajuster le chemin selon votre structure de route
    // Exemple : '/admin/tier_list'
    // Cette fonction est un exemple, assurez-vous d'ajuster la navigation en fonction de votre structure de route
    window.history.back();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/Tier/update_deleted/${id}`);
      // Redirection ou affichage d'un message de succès après la suppression
      // Vous pouvez ajuster cette logique selon vos besoins
      setShowModal(true); // Affiche le modal de succès
    } catch (error) {
      console.error(`Erreur lors de la suppression du tier avec l'ID ${id}:`, error);
      // Afficher une erreur ou gérer de manière appropriée
    }
  };

  const closeModal = () => {
    setShowModal(false); // Ferme le modal de succès
    handleBack(); // Redirige vers la liste des tiers après la fermeture du modal
  };

  return (
    <CRow>
      <CCol xs={12}>
      <div className="card-header-actions" xs={12} >
              <CButton color="secondary" onClick={handleBack}>
                <IoArrowBack className="me-1 " /> Retour
              </CButton>
            </div>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Détails du Tier</strong>
            
          </CCardHeader>
          <CCardBody>
            <p><strong>Nom:</strong> {tier.name}</p>
            <p><strong>Type de Tier:</strong> {tier.TypeTier?.name}</p>
            <p><strong>Code:</strong> {tier.code}</p>
            <p><strong>Adresse:</strong> {tier.address}</p>
            <p><strong>Code Postal:</strong> {tier.postal_code}</p>
            <p><strong>Pays:</strong> {tier.country}</p>
            <p><strong>Ville:</strong> {tier.City?.value}</p>
       
            <p><strong>Téléphone:</strong> {tier.phone}</p>
            <p><strong>Mobile:</strong> {tier.mobile}</p>
            <p><strong>Fax:</strong> {tier.fax}</p>
            <p><strong>Email:</strong> {tier.email}</p>
            <p><strong>Ville:</strong> {tier.City?.value}</p>

            <CButton color="danger" onClick={handleDelete}>
              Supprimer
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal de confirmation de suppression */}
      <CModal visible={showModal} onClose={closeModal}>
        <CModalHeader closeButton>
          <CModalTitle>Suppression réussie</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Le tier a été supprimé avec succès.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default DetailTier;
