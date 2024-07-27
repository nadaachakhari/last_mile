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
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeSharp } from 'react-icons/io5';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ListSupplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('http://localhost:5001/Tier/supplier');
                setSuppliers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des fournisseurs:', error);
            }
        };

        fetchSuppliers();
    }, []);

    // Fonction pour gérer la suppression d'un fournisseur
    const handleSupprimer = async (id) => {
        setIdToDelete(id); // Stocker l'ID du fournisseur à supprimer
        setShowConfirmation(true); // Afficher la modal de confirmation de suppression
    };

    const confirmDelete = async () => {
        try {
            await axios.put(`http://localhost:5001/Tier/update_deleted_Supplier/${idToDelete}`);
            // Mettre à jour localement en filtrant les éléments supprimés
            const updatedList = suppliers.filter((supplier) => supplier.id !== idToDelete);
            setSuppliers(updatedList);
            console.log(`Fournisseur avec l'ID ${idToDelete} marqué comme supprimé.`);
        } catch (error) {
            console.error(`Erreur lors de la suppression du fournisseur avec l'ID ${idToDelete}:`, error);
        } finally {
            setShowConfirmation(false); // Fermer la popup de confirmation après suppression
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false); // Annuler la suppression et fermer la popup de confirmation
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Liste</strong> <small>des fournisseurs</small>
                    </CCardHeader>
                    <CCardBody>
                        <Link to={`/admin/add_fournisseur`}>
                            <CButton color="primary" className="mb-3">
                                Ajouter Fournisseur
                            </CButton>
                        </Link>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                
                                <CTableHeaderCell>#</CTableHeaderCell>
                                    <CTableHeaderCell>Nom</CTableHeaderCell>
                                    <CTableHeaderCell>Code</CTableHeaderCell>
                                    <CTableHeaderCell>Adresse</CTableHeaderCell>
                                    <CTableHeaderCell>Email</CTableHeaderCell>
                                    <CTableHeaderCell>Téléphone</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {suppliers.map((supplier, index) => (
                                    <CTableRow key={supplier.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{supplier.name}</CTableDataCell>
                                        <CTableDataCell>{supplier.code}</CTableDataCell>
                                        <CTableDataCell>{supplier.address}</CTableDataCell>
                                        <CTableDataCell>{supplier.email}</CTableDataCell>
                                        <CTableDataCell>{supplier.phone}</CTableDataCell>
                                        <CTableDataCell>
                                            <Link to={`/admin/detail_fournisseur/${supplier.id}`}>
                                                <CButton size="md" color="info" className="me-2">
                                                    <IoEyeSharp className="icon-white icon-lg me-1" />
                                                </CButton>
                                            </Link>
                                            <Link to={`/admin/edit_fournisseur/${supplier.id}`}>
                                                <CButton size="md" color="warning" className="me-2">
                                                    <FaEdit className="icon-white icon-lg me-1" />
                                                </CButton>
                                            </Link>
                                            <CButton size="md" color="danger" onClick={() => handleSupprimer(supplier.id)} className="me-2">
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
                    Êtes-vous sûr de vouloir supprimer ce fournisseur ?
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

export default ListSupplier;
