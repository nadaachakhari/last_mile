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

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null); // État pour stocker l'ID du fournisseur à supprimer

  useEffect(() => {
    // Fonction pour récupérer les fournisseurs depuis l'API
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/Supplier');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des fournisseurs:', error);
      }
    };

    fetchSuppliers();
  }, []);

  // Fonction pour gérer la modification d'un fournisseur
  const handleModifier = (id) => {
    console.log(`Modifier fournisseur avec id: ${id}`);
    // Ajouter ici la logique pour la redirection ou l'ouverture de la page de modification
  };

  // Fonction pour gérer la suppression d'un fournisseur
  const handleSupprimer = async (id) => {
    setIdToDelete(id); 
    setShowConfirmation(true); 
  };

  // Fonction de confirmation de suppression
  const confirmDelete = async () => {
    try {
      await axios.put(`http://localhost:5001/Tier/update_deleted_Supplier/${idToDelete}`);
      // Mettre à jour localement en filtrant le fournisseur supprimé
      const updatedList = suppliers.filter((supplier) => supplier.id !== idToDelete);
      setSuppliers(updatedList);
      console.log(`Supprimé fournisseur avec id: ${idToDelete}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du fournisseur:', error);
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
            <strong>Liste</strong> <small>des Fournisseurs</small>
          </CCardHeader>
          <CCardBody>
            <Link to={`/admin/add_supplier`}>
              <CButton color="primary" className="mb-3">
                Ajouter Fournisseur
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
                {suppliers.map((supplier, index) => (
                  <CTableRow key={supplier.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{supplier.name}</CTableDataCell>
                    <CTableDataCell>{supplier.TypeSupplier?.name}</CTableDataCell>
                    <CTableDataCell>{supplier.code}</CTableDataCell>
                    <CTableDataCell>{supplier.address}</CTableDataCell>
                    <CTableDataCell>{supplier.email}</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/admin/detail_supplier/${supplier.id}`}>
                        <CButton size="md" color="info" className="me-2">
                          <IoEyeSharp className="icon-white icon-lg me-1" />
                        </CButton>
                      </Link>
                      <Link to={`/admin/edit_supplier/${supplier.id}`}>
                        <CButton size="md" color="warning" onClick={() => handleModifier(supplier.id)} className="me-2">
                          <FaEdit className="icon-white icon-lg me-1" />
                        </CButton>
                      </Link>
                      <CButton size="md" color="danger"  onClick={() => handleSupprimer(supplier.id)} className="me-2">
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
          Êtes-vous sûr de vouloir supprimer ce Fournisseur ?
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

export default SupplierList;
