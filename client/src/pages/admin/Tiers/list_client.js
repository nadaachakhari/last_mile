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
    CModal,
    CTableDataCell,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { IoEyeSharp } from 'react-icons/io5';
import { useAuth } from '../../../Middleware/Use_Auth';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const { role } = useAuth();

    useEffect(() => {
        if (!role) {
            return; // N'exécutez rien tant que le rôle n'est pas récupéré
        }

        console.log('User role:', role);

        if (role !== 'fournisseur') {
            navigate('/unauthorized');
        }
        const fetchClients = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token non trouvé dans localStorage.');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5001/Tier/clientbysupplier', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClients(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des clients:', error);
            }
        };

        fetchClients();
    }, [role]);

    const handleModifier = (id) => {
        console.log(`Modifier client avec id: ${id}`);
    };

    const handleSupprimer = (id) => {
        setIdToDelete(id); 
        setShowConfirmation(true); 
    };

    const confirmDelete = async () => {
        try {
            await axios.put(`http://localhost:5001/Tier/update_deleted_Supplier/${idToDelete}`);
            setClients(clients.filter((client) => client.id !== idToDelete)); // Correct state update
            console.log(`Client avec l'ID ${idToDelete} marqué comme supprimé.`);
        } catch (error) {
            console.error(`Erreur lors de la suppression du client avec l'ID ${idToDelete}:`, error);
        } finally {
            setShowConfirmation(false); // Close confirmation modal after delete
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false); 
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Liste</strong> <small>des Clients</small>
                    </CCardHeader>
                    <CCardBody>
                        <Link to={`/admin/add_client`}>
                            <CButton color="primary" className="mb-3">
                                Ajouter Client
                            </CButton>
                        </Link>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>ID</CTableHeaderCell>
                                    <CTableHeaderCell>Code</CTableHeaderCell>
                                    <CTableHeaderCell>Nom</CTableHeaderCell>
                                    <CTableHeaderCell>Adresse</CTableHeaderCell>
                                    <CTableHeaderCell>Email</CTableHeaderCell>
                                    <CTableHeaderCell>Téléphone</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {clients.map((client, index) => (
                                    <CTableRow key={client.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{client.code}</CTableDataCell>
                                        <CTableDataCell>{client.name}</CTableDataCell>
                                        <CTableDataCell>{client.address}</CTableDataCell>
                                        <CTableDataCell>{client.email}</CTableDataCell>
                                        <CTableDataCell>{client.phone}</CTableDataCell>
                                        <CTableDataCell>
                                            <Link to={`/admin/detail_client/${client.id}`}>
                                                <CButton size="md" color="info" className="me-2">
                                                    <IoEyeSharp className="icon-white icon-lg me-1" />
                                                </CButton>
                                            </Link>
                                            <Link to={`/admin/edit_client/${client.id}`}>
                                                <CButton size="md" color="warning" onClick={() => handleModifier(client.id)} className="me-2">
                                                    <FaEdit className="icon-white icon-lg me-1" />
                                                </CButton>
                                            </Link>
                                            <CButton size="md" color="danger" onClick={() => handleSupprimer(client.id)} className="me-2">
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

            <CModal visible={showConfirmation} onClose={cancelDelete}>
                <CModalHeader closeButton>
                    <CModalTitle>Confirmation de suppression</CModalTitle>
                </CModalHeader>
                <CModalBody>Êtes-vous sûr de vouloir supprimer ce client ?</CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={confirmDelete}>Supprimer</CButton>
                    <CButton color="secondary" onClick={cancelDelete}>Annuler</CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default ClientList;
