import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormLabel,
    CFormInput,
    CFormSelect,
    CRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';

const ChangeOrderState = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [states, setStates] = useState([]);
    const [newState, setNewState] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('');

    // Transitions d'état valides
    const validTransitions = {
        'en cours de livraison': ['Livraison imminente'],
        'Livraison imminente': ['Adresse changée', 'Livraison effectuée'],
        'Adresse changée': ['Livraison effectuée']
    };

    // États autorisés à être sélectionnés
    const allowedStates = ['Livraison imminente', 'Adresse changée', 'Livraison effectuée'];

    // Fonction de validation de la transition d'état
    const isValidTransition = (current, next) => {
        const validNextStates = validTransitions[current];
        return validNextStates && validNextStates.includes(next);
    };

    useEffect(() => {
        const fetchOrderAndStates = async () => {
            try {
                const [orderResponse, statesResponse] = await Promise.all([
                    axios.get(`http://localhost:5001/Order/ordrelines/${orderId}`),
                    axios.get(`http://localhost:5001/State/`),
                ]);

                setOrder(orderResponse.data.order);
                // Filtrer les états autorisés
                const filteredStates = statesResponse.data.filter(state => allowedStates.includes(state.value));
                setStates(filteredStates);
                setLoading(false);
            } catch (error) {
                setError('Erreur lors de la récupération des données.');
                setLoading(false);
            }
        };

        fetchOrderAndStates();
    }, [orderId]);

    const handleChangeState = async () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        setUserRole(role);

        if (!token) {
            console.error('Token non trouvé dans localStorage.');
            return;
        }

        if (!isValidTransition(order.state.value, newState)) {
            // Afficher un message d'erreur spécifique pour chaque transition invalide
            let message = `Transition d'état invalide. `;
            if (order.state.value === 'en cours de livraison' && newState !== 'Livraison imminente') {
                message += `Depuis "en cours de livraison", vous ne pouvez passer qu'à "Livraison imminente".`;
            } else if (order.state.value === 'Livraison imminente' && !['Adresse changée', 'Livraison effectuée'].includes(newState)) {
                message += `Depuis "Livraison imminente", vous pouvez passer à "Adresse changée" ou "Livraison effectuée".`;
            } else if (order.state.value === 'Adresse changée' && newState !== 'Livraison effectuée') {
                message += `Depuis "Adresse changée", vous ne pouvez passer qu'à "Livraison effectuée".`;
            } else {
                message += 'Veuillez sélectionner un état valide.';
            }
            setModalMessage(message);
            setShowModal(true);
            return;
        }

        const requestData = { newState };
        if (newState === 'Adresse changée') {
            requestData.newAddress = newAddress;
        }

        try {
            await axios.put(
                `http://localhost:5001/Users/change-state/${orderId}`,
                requestData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            navigate('/admin/list_order');
        } catch (error) {
            if (error.response) {
                setModalMessage(error.response.data.error || 'Erreur lors de la mise à jour de l\'état de la commande.');
            } else {
                setModalMessage('Erreur lors de la mise à jour de l\'état de la commande.');
            }
            setShowModal(true);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;
    if (!order) return <div>Commande non trouvée.</div>;

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Changer l'état</strong> <small>de la commande</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3">
                            <CCol md={6}>
                                <CFormLabel>État actuel</CFormLabel>
                                <CFormInput type="text" value={order.state.value} disabled />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel>Nouvel état</CFormLabel>
                                <CFormSelect
                                    value={newState}
                                    onChange={(e) => setNewState(e.target.value)}
                                    required
                                >
                                    <option value="">Sélectionner un état</option>
                                    {states.map((state) => (
                                        <option key={state.id} value={state.value}>
                                            {state.value}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            {newState === 'Adresse changée' && (
                                <CCol md={12}>
                                    <CFormLabel>Nouvelle adresse</CFormLabel>
                                    <CFormInput
                                        type="text"
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                        required
                                    />
                                </CCol>
                            )}
                            <CCol xs={12}>
                                <CButton color="primary" onClick={handleChangeState}>
                                    Changer l'état
                                </CButton>
                                <CButton color="secondary" onClick={() => navigate('/admin/list_order')} className="ms-2">
                                    Retourner à la Liste des Commandes
                                </CButton>
                            </CCol>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader>
                    <CModalTitle>Erreur</CModalTitle>
                </CModalHeader>
                <CModalBody>{modalMessage}</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Fermer
                    </CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default ChangeOrderState;
