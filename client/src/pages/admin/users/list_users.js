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

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5001/Users');
                setUsers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
        };

        fetchUsers();
    }, []);

    
    const handleModifier = (id) => {
        console.log(`Modifier utilisateur avec id: ${id}`);
    };

    const handleSupprimer = async (id) => {
        setIdToDelete(id); 
        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.put(`http://localhost:5001/Users/update_deleted/${idToDelete}`);
            // Mettre à jour localement en filtrant l'utilisateur supprimé
            const updatedList = users.filter((user) => user.id !== idToDelete);
            setUsers(updatedList);
            console.log(`Supprimé utilisateur avec id: ${idToDelete}`);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        } finally {
            setShowConfirmation(false); // Fermer la modal de confirmation après suppression
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false); // Annuler la suppression et fermer la modal de confirmation
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Liste</strong> <small>des Utilisateurs</small>
                    </CCardHeader>
                    <CCardBody>
                        <Link to={`/admin/add_user`}>
                            <CButton color="primary" className="mb-3">
                                Ajouter Utilisateur
                            </CButton>
                        </Link>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>ID</CTableHeaderCell>
                                    <CTableHeaderCell>Nom</CTableHeaderCell>
                                    <CTableHeaderCell>Nom d'utilisateur</CTableHeaderCell>
                                    <CTableHeaderCell>Email</CTableHeaderCell>
                                    <CTableHeaderCell>Rôle</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {users.map((user, index) => (
                                    <CTableRow key={user.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{user.name}</CTableDataCell>
                                        <CTableDataCell>{user.user_name}</CTableDataCell>
                                        <CTableDataCell>{user.email}</CTableDataCell>
                                        <CTableDataCell>{user.RoleUser?.name}</CTableDataCell>
                                        <CTableDataCell>
                                            <Link to={`/admin/detail_user/${user.id}`}>
                                                <CButton size="md" color="info" className="me-2">
                                                    <IoEyeSharp className="icon-white icon-lg me-1" />
                                                </CButton>
                                            </Link>
                                            <Link to={`/admin/edit_user/${user.id}`}>
                                                <CButton size="md" color="warning" onClick={() => handleModifier(user.id)} className="me-2">
                                                    <FaEdit className="icon-white icon-lg me-1" />
                                                </CButton>
                                            </Link>
                                            <CButton size="md" color="danger" onClick={() => handleSupprimer(user.id)} className="me-2">
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
                    Êtes-vous sûr de vouloir supprimer cet utilisateur ?
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

export default UserList;
