import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link,useNavigate } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
} from '@coreui/react';
import { useAuth } from '../../../Middleware/Use_Auth'
const DetailClient = () => {
    const { id } = useParams(); 
    const [client, setClient] = useState(null);
    const { role } = useAuth();
    const navigate = useNavigate()
    useEffect(() => {
        if (!role) {
            return; // N'exécutez rien tant que le rôle n'est pas récupéré
          }
      
          console.log('User role:', role);
      
          if (role !== 'fournisseur') {
            navigate('/unauthorized');
          }
        const fetchClient = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/Tier/clients/${id}`);
                setClient(response.data);
            } catch (error) {
                console.error(`Erreur lors de la récupération des détails du client avec l'ID ${id}:`, error);
            }
        };

        fetchClient(); 
    }, [id,role,navigate]);

    if (!client) {
        return (
            <CRow className="mt-4">
                <CCol>
                    <CCard>
                        <CCardHeader>
                            <strong>Chargement en cours...</strong>
                        </CCardHeader>
                        <CCardBody>
                            <p>Veuillez patienter pendant le chargement des détails du client...</p>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        );
    }

    const handleBack = () => {
        window.history.back();
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Détails du Client</strong>
                    </CCardHeader>
                    <CCardBody>
                        <p><strong>Nom:</strong> {client.name}</p>
                        <p><strong>Type de Client:</strong> {client.TypeTier?.name}</p>
                        <p><strong>Code:</strong> {client.code}</p>
                        <p><strong>Adresse:</strong> {client.address}</p>
                        <p><strong>Code Postal:</strong> {client.postal_code}</p>
                        <p><strong>Pays:</strong> {client.country}</p>
                        <p><strong>Ville:</strong> {client.City?.value}</p>
                        <p><strong>Téléphone:</strong> {client.phone}</p>
                        <p><strong>Mobile:</strong> {client.mobile}</p>
                        <p><strong>Fax:</strong> {client.fax}</p>
                        <p><strong>Email:</strong> {client.email}</p>
                        <Link to="/admin/list_client">
                            <CButton color="primary">Retour à la liste</CButton>
                        </Link>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DetailClient;
