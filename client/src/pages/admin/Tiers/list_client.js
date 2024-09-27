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
} from '@coreui/react';
import { Link } from 'react-router-dom';
import { IoEyeSharp } from 'react-icons/io5';
import { FaEdit } from 'react-icons/fa';
import { useAuth } from '../../../Middleware/Use_Auth'
const ClientList = () => {
    const [clients, setClients] = useState([]);
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
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setClients(response.data); // Cette ligne était mal placée
            } catch (error) {
                console.error('Erreur lors de la récupération des clients:', error);
            }
        };

        fetchClients();
    }, [role,navigator]);

    const handleModifier = (id) => {
        console.log(`Modifier client avec id: ${id}`);
        // Ajouter ici la logique pour la redirection ou l'ouverture de la page de modification
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
                                    {/* <CTableHeaderCell>Type</CTableHeaderCell> */}
                                    
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
                                        {/* <CTableDataCell>{client.TypeTier?.name}</CTableDataCell> */}
                                      
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
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ClientList;
