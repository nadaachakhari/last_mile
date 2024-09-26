import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoEyeSharp } from 'react-icons/io5';
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
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../../Middleware/Use_Auth';
const ListeBank = () => {
    const [banks, setBanks] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [id, setIdToDelete] = useState(null);
    const navigate = useNavigate();
    const { role } = useAuth(); 

    useEffect(() => {
        if (!role) {
            return; // N'exécutez rien tant que le rôle n'est pas récupéré
          }
      
          console.log('User role:', role);
      
          if (role !== 'fournisseur') {
            navigate('/unauthorized');
          }
        const fetchBanks = async () => {
            try {
                const response = await axios.get('http://localhost:5001/Bank');
                setBanks(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des banques:', error);
            }
        };

        fetchBanks();
    }, [role,navigate]);

    const handleModifier = (id) => {
        navigate(`/edit_bank/${id}`); // Navigate to edit page
    };

    const handleSupprimer = (id) => {
        setIdToDelete(id); // Stocke la référence de la banque à supprimer
        setShowConfirmation(true); // Affiche la popup de confirmation
    };

    const confirmDelete = async () => {
        try {
            await axios.put(`http://localhost:5001/Bank/update_deleted/${id}`);
            // Mettre à jour localement en filtrant les éléments supprimés
            const updatedList = banks.filter((bank) => bank.id !== id);
            setBanks(updatedList);
            console.log(`Banque avec la référence ${id} marquée comme supprimée.`);
        } catch (error) {
            console.error(`Erreur lors de la suppression de la banque avec la référence ${id}:`, error);
        } finally {
            setShowConfirmation(false); // Ferme la popup de confirmation après suppression
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false); // Annule la suppression et ferme la popup de confirmation
    };

    const handleAddBank = () => {
        navigate('/add_bank'); // Navigate to the add page
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Liste des</strong> <small>banques</small>
                    </CCardHeader>
                    <CCardBody>
                        <Link to={`/add_bank`}>
                            <CButton color="primary" onClick={handleAddBank} className="mb-3">
                                Ajouter banque
                            </CButton>
                        </Link>
                        <CTable striped>
                            <CTableCaption>Liste des banques actives</CTableCaption>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {banks.map((bank, index) => (
                                    <CTableRow key={bank.ref}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{bank.value}</CTableDataCell>
                                        <CTableDataCell>
                                            <Link to={`/detail_bank/${bank.id}`}>
                                                <CButton size="md" color="info" className="me-2">
                                                    <IoEyeSharp className="icon-white icon-lg me-7" />
                                                </CButton>
                                            </Link>
                                            <Link to={`/edit_bank/${bank.id}`}>
                                                <CButton size="md" color="warning" onClick={() => handleModifier(bank.id)} className="me-2">
                                                    <FaEdit className="icon-white icon-lg me-7" />
                                                </CButton>
                                            </Link>
                                            <CButton size="md" color="danger" onClick={() => handleSupprimer(bank.id)} className="me-2">
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
                    Êtes-vous sûr de vouloir supprimer cette banque ?
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

export default ListeBank;
