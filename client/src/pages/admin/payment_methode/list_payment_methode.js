import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CIcon from '@coreui/icons-react';
import { IoEyeSharp } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableCaption,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';

const ListePaymentMethods = () => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get('http://localhost:5001/PaymentMethode/');
                setPaymentMethods(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des méthodes de paiement:', error);
            }
        };

        fetchPaymentMethods();
    }, []);

    const handleDetail = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5001/PaymentMethode/${id}`);
            console.log('Détails de la méthode de paiement:', response.data);
            // Implémentez la logique pour afficher les détails de la méthode de paiement (par exemple, ouvrir un modal)
        } catch (error) {
            console.error(`Erreur lors de la récupération des détails de la méthode de paiement avec l'ID ${id}:`, error);
        }
    };

    const handleModifier = (id) => {
        navigate(`/admin/edit_payment_methode/${id}`); 
    };

    const handleSupprimer = async (id) => {
        setIdToDelete(id);
        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.put(`http://localhost:5001/PaymentMethode/update_deleted/${idToDelete}`);
            
            const updatedList = paymentMethods.filter((method) => method.id !== idToDelete);
            setPaymentMethods(updatedList);
            console.log(`Méthode de paiement avec l'ID ${idToDelete} marquée comme supprimée.`);
        } catch (error) {
            console.error(`Erreur lors de la suppression de la méthode de paiement avec l'ID ${idToDelete}:`, error);
        } finally {
            setShowConfirmation(false); 
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false); 
    };

    const handleAddPaymentMethod = () => {
        navigate('/admin/add_payment_method');
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Liste des</strong> <small>méthodes de paiement</small>
                    </CCardHeader>
                    <CCardBody>
                        <Link to={`/admin/add_payment_methode`}>
                            <CButton color="primary" onClick={handleAddPaymentMethod} className="mb-3">
                                Ajouter méthode de paiement
                            </CButton>
                        </Link>
                        <CTable striped>
                            <CTableCaption>Liste des méthodes de paiement actives</CTableCaption>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {paymentMethods.map((method, index) => (
                                    <CTableRow key={method.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{method.value}</CTableDataCell>
                                        <CTableDataCell>
                                            <Link to={`/admin/detail_payment_methode/${method.id}`}>
                                                <CButton size="md" color="info" className="me-2">
                                                    <IoEyeSharp className="icon-white icon-lg me-7" />
                                                </CButton>
                                            </Link>
                                            <Link to={`/admin/edit_payment_methode/${method.id}`}>
                                                <CButton size="md" color="warning" onClick={() => handleModifier(method.id)} className="me-2">
                                                    <FaEdit className="icon-white icon-lg me-7" />
                                                </CButton>
                                            </Link>
                                            <CButton size="md" color="danger" onClick={() => handleSupprimer(method.id)} className="me-2">
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

            {/* Modal de confirmation de suppression */}
            <CModal visible={showConfirmation} onClose={cancelDelete}>
                <CModalHeader closeButton>
                    <CModalTitle>Confirmation de suppression</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?
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

export default ListePaymentMethods;
