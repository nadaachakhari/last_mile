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

const DetailState = () => {
    const { id } = useParams();
    const [state, setState] = useState(null);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/State/${id}`);
                setState(response.data);
            } catch (error) {
                console.error(`Erreur lors de la récupération des détails de l'état avec l'ID ${id}:`, error);
            }
        };

        fetchState();
    }, [id]);

    if (!state) {
        return (
            <CRow>
                <CCol>
                    <CCard>
                        <CCardHeader>
                            Détail de l'état
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
                        Détail de l'état
                    </CCardHeader>
                    <CCardBody>
                        <p><strong>Nom:</strong> {state.value}</p>
                        <p><strong>État:</strong> {state.deleted ? 'Inactive' : 'Active'}</p>
                        <Link to="/admin/list_state">
                            <CButton color="primary">Retour à la liste</CButton>
                        </Link>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DetailState;
