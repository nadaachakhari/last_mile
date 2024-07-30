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
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeSharp } from 'react-icons/io5';
import { FaEdit } from 'react-icons/fa';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            setUserRole(role);

            if (!token) {
                console.error('Token non trouvé dans localStorage.');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5001/Order/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des commandes:', error);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Liste</strong> <small>des Commandes</small>
                    </CCardHeader>
                    <CCardBody>
                        <Link to={`/admin/add_order`}>
                            <CButton color="primary" className="mb-3">
                                Ajouter Commande
                            </CButton>
                        </Link>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>ID</CTableHeaderCell>
                                    <CTableHeaderCell>Code</CTableHeaderCell>
                                    <CTableHeaderCell>Date</CTableHeaderCell>
                                    <CTableHeaderCell>Client</CTableHeaderCell>
                                    <CTableHeaderCell>État</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {orders.map((order, index) => (
                                    <CTableRow key={order.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{order.code}</CTableDataCell>
                                        <CTableDataCell>{formatDate(order.date)}</CTableDataCell>
                                        <CTableDataCell>{order.customer.name}</CTableDataCell>
                                        <CTableDataCell>{order.state.value}</CTableDataCell>
                                        <CTableDataCell>
                                            <Link to={`/admin/detail_order/${order.id}`}>
                                                <CButton size="md" color="info" className="me-2">
                                                    <IoEyeSharp className="icon-white icon-lg me-1" />
                                                </CButton>
                                            </Link>
                                            <Link to={`/admin/edit_order/${order.id}`}>
                                                <CButton size="md" color="warning" className="me-2">
                                                    <FaEdit className="icon-white icon-lg me-1" />
                                                </CButton>
                                            </Link>
                                            {userRole === 'Administrateur' && (
                                                <CButton
                                                    size="md"
                                                    color={order.state.value === 'En attente de livraison' ? 'success' : 'secondary'}
                                                    className="me-2"
                                                    disabled={order.state.value !== 'En attente de livraison'}
                                                    onClick={() => {
                                                        if (order.state.value === 'En attente de livraison') {
                                                            navigate(`/admin/affecter_livreur/${order.id}`);
                                                        }
                                                    }}
                                                >
                                                    Affecter Livreur
                                                </CButton>
                                            )}
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

export default OrderList;
