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

const DetailPaymentMethod = () => {
    const { id } = useParams(); 
    const [paymentMethod, setPaymentMethod] = useState(null); 
    useEffect(() => {
        const fetchPaymentMethod = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/PaymentMethode/${id}`);
                setPaymentMethod(response.data);
            } catch (error) {
                console.error(`Erreur lors de la récupération des détails de la méthode de paiement avec l'ID ${id}:`, error);
            }
        };

        fetchPaymentMethod();
    }, [id]); 

    if (!paymentMethod) {
        return (
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>
                            Détail de la méthode de paiement
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
                        Détail de la méthode de paiement
                    </CCardHeader>
                    <CCardBody>
                        <p><strong>Nom:</strong> {paymentMethod.value}</p>
                        <p><strong>État:</strong> {paymentMethod.deleted ? 'Inactive' : 'Active'}</p>
                        <Link to="/admin/list_payment_methode">
                            <CButton color="primary">Retour à la liste</CButton>
                        </Link>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DetailPaymentMethod;
