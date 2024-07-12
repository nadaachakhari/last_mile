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
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ListStates = () => {
    const [states, setStates] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get('http://localhost:5001/State/');
                setStates(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des états:', error);
            }
        };

        fetchStates();
    }, []);

    const handleDetail = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5001/State/${id}`);
            console.log('Détails de l\'état:', response.data);
            // Implémentez la logique pour afficher les détails de l'état (par exemple, ouvrir un modal)
        } catch (error) {
            console.error(`Erreur lors de la récupération des détails de l'état avec l'ID ${id}:`, error);
        }
    };

    const handleModifier = (id) => {
        navigate(`/admin/edit_state/${id}`); // Rediriger vers la page de modification de l'état
    };

    const handleSupprimer = async (id) => {
        setIdToDelete(id);
        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.put(`http://localhost:5001/State/update_deleted/${idToDelete}`);

            const updatedList = states.filter((state) => state.id !== idToDelete);
            setStates(updatedList);
            console.log(`État avec l'ID ${idToDelete} marqué comme supprimé.`);
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'état avec l'ID ${idToDelete}:`, error);
        } finally {
            setShowConfirmation(false);
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
    };

    const handleAddState = () => {
        navigate('/admin/add_state');
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Liste des</strong> <small>états</small>
                    </CCardHeader>
                    <CCardBody>
                        <Link to="/admin/add_state">
                            <CButton color="primary" onClick={handleAddState} className="mb-3">
                                Ajouter un état
                            </CButton>
                        </Link>
                        <CTable striped>
                            <CTableCaption>Liste des états</CTableCaption>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {states.map((state, index) => (
                                    <CTableRow key={state.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{state.value}</CTableDataCell>
                                        <CTableDataCell>
                                            <Link to={`/admin/detail_state/${state.id}`}>
                                                <CButton size="md" color="info" className="me-2">
                                                    <FaEye />
                                                </CButton>
                                            </Link>
                                            <Link to={`/admin/edit_state/${state.id}`}>
                                                <CButton size="md" color="warning" className="me-2">
                                                    <FaEdit />
                                                </CButton>
                                            </Link>
                                            <CButton size="md" color="danger" onClick={() => handleSupprimer(state.id)} className="me-2">
                                                <FaTrash />
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
                <CModalBody>
                    Êtes-vous sûr de vouloir supprimer cet état ?
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

export default ListStates;
