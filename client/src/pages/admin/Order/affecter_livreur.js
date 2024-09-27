import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm,
    CFormLabel,
    CFormSelect,
} from '@coreui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Middleware/Use_Auth';
const AffecterLivreur = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deliveryPersons, setDeliveryPersons] = useState([]);
    const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');
    const { role } = useAuth();
  
    useEffect(() => {
        if (!role) {
            return; // N'exécutez rien tant que le rôle n'est pas récupéré
          }
      
          console.log('User role:', role);
      
          if (role !== 'Administrateur') {
            navigate('/unauthorized');
          } 
        console.log('Order ID from URL:', id);

        const fetchDeliveryPersons = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5001/Users/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const allUsers = response.data;
                const filteredLivreur = allUsers.filter(
                    (user) => user.RoleUser && user.RoleUser.name === 'livreur'
                );
                setDeliveryPersons(filteredLivreur);
            } catch (error) {
                console.error('Erreur lors de la récupération des livreurs:', error);
            }
        };

        fetchDeliveryPersons();
    }, [id,role,navigate]);

    const handleAffecterLivreur = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        console.log('Order ID:', id);
        console.log('Selected Delivery Person:', selectedDeliveryPerson);
        console.log(selectedDeliveryPerson);
        try {
            if (!id || !selectedDeliveryPerson) {
                throw new Error('Order ID ou livreur non sélectionné');
            }
            await axios.put(`http://localhost:5001/Order/assign_delivery`, {
                orderId: id,  // Modification ici
                deliveryPersonId: selectedDeliveryPerson,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/admin/list_order');
        } catch (error) {
            console.error('Erreur lors de l\'affectation du livreur:', error);
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Affecter Livreur</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleAffecterLivreur}>
                            <CRow className="mb-3">
                                <CCol>
                                    <CFormLabel htmlFor="deliveryPerson">Sélectionner un livreur</CFormLabel>
                                    <CFormSelect id="deliveryPerson" value={selectedDeliveryPerson} onChange={(e) => setSelectedDeliveryPerson(e.target.value)}>
                                        <option value="">Sélectionner un livreur</option>
                                        {deliveryPersons.map((person) => (
                                            <option key={person.id} value={person.id}>{person.name}</option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CButton type="submit" color="primary">Affecter</CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default AffecterLivreur;
