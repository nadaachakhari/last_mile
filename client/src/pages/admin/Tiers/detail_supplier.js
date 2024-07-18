import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

const DetailSupplier = () => {
  const { id } = useParams(); // Récupère l'ID du fournisseur depuis les paramètres d'URL
  const navigate = useNavigate(); // Pour la navigation
  const [supplier, setSupplier] = useState(null); // État pour stocker les détails du fournisseur
  const [showModal, setShowModal] = useState(false); // État pour contrôler l'affichage du modal

  useEffect(() => {
    // Fonction pour récupérer les détails du fournisseur à partir de l'API
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/Tier/supplier/${id}`);
        setSupplier(response.data);
      } catch (error) {
        console.error(`Erreur lors de la récupération des détails du fournisseur avec l'ID ${id}:`, error);
      }
    };

    fetchSupplier(); // Appel de la fonction au chargement du composant
  }, [id]);

  if (!supplier) {
    return (
      <CRow className="mt-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Chargement en cours...</strong>
            </CCardHeader>
            <CCardBody>
              <p>Veuillez patienter pendant le chargement des détails du fournisseur...</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }

  const handleBack = () => {
    navigate('/admin/list_fournisseur'); // Rediriger vers la liste des fournisseurs
  };

  const closeModal = () => {
    setShowModal(false); // Ferme le modal de succès
    handleBack(); // Redirige vers la liste des fournisseurs après la fermeture du modal
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Détails du Fournisseur</strong>
          </CCardHeader>
          <CCardBody>
            <p><strong>Nom:</strong> {supplier.name}</p>
            <p><strong>Code:</strong> {supplier.code}</p>
            <p><strong>Adresse:</strong> {supplier.address}</p>
            <p><strong>Code Postal:</strong> {supplier.postal_code}</p>
            <p><strong>Pays:</strong> {supplier.country}</p>
            <p><strong>Ville:</strong> {supplier.City?.value}</p>
            <p><strong>Téléphone:</strong> {supplier.phone}</p>
            <p><strong>Mobile:</strong> {supplier.mobile}</p>
            <p><strong>Fax:</strong> {supplier.fax}</p>
            <p><strong>Email:</strong> {supplier.email}</p>
            <p><strong>Block:</strong> {supplier.block}</p>

            
            <Link to="/admin/list_fournisseur">
              <CButton color="primary">Retour à la liste</CButton>
            </Link>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal de confirmation de suppression */}
      <CModal visible={showModal} onClose={closeModal}>
        <CModalHeader closeButton>
          <CModalTitle>Suppression réussie</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Le fournisseur a été supprimé avec succès.
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

export default DetailSupplier;
