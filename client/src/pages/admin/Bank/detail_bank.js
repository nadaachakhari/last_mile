import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Middleware/Use_Auth';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';

const DetailBank = () => {
    const { id } = useParams(); 
    const [bank, setBank] = useState(null); 
    const navigate = useNavigate();
    const { role } = useAuth();
    useEffect(() => {
        if (!role) {
            return;
          }
      
          console.log('User role:', role);
      
          if (role !== 'fournisseur') {
            navigate('/unauthorized');
          }
        const fetchBank = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/Bank/${id}`);
                setBank(response.data);
            } catch (error) {
                console.error(`Erreur lors de la récupération des détails de la banque avec la référence ${id}:`, error);
            }
        };

        fetchBank();
    }, [role,navigate,id]);

    if (!bank) {
        return (
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>
                            Détail de la banque
                        </CCardHeader>
                        <CCardBody>
                            Chargement en cours...
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        );
    }

    return (
        <CRow>
            <CCol>
                <CCard>
                    <CCardHeader>
                        Détail de la banque
                    </CCardHeader>
                    <CCardBody>
                        <p><strong>Référence:</strong> {bank.ref}</p>
                        <p><strong>Valeur:</strong> {bank.value}</p>
                
                        <Link to="/list_bank">
                            <CButton color="primary">Retour à la liste</CButton>
                        </Link>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DetailBank;
