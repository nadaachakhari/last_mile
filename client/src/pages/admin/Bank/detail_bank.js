import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react';

const DetailBank = () => {
    const { ref } = useParams(); 
    const [bank, setBank] = useState(null); 

    useEffect(() => {
        const fetchBank = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/Bank/${ref}`);
                setBank(response.data);
            } catch (error) {
                console.error(`Erreur lors de la récupération des détails de la banque avec la référence ${ref}:`, error);
            }
        };

        fetchBank();
    }, [ref]);

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
                
                        <Link to="/admin/list_bank">
                            <CButton color="primary">Retour à la liste</CButton>
                        </Link>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DetailBank;
