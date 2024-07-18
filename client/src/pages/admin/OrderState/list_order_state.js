import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react'
import { FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { IoEyeSharp } from 'react-icons/io5'

const OrderStateList = () => {
    const [orderStates, setOrderStates] = useState([])
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [idToDelete, setIdToDelete] = useState(null)

    useEffect(() => {
        const fetchOrderStates = async () => {
            try {
                const response = await axios.get('http://localhost:5001/OrderState/')
                setOrderStates(response.data)
            } catch (error) {
                console.error('Erreur lors de la récupération des états des commandes :', error)
            }
        }

        fetchOrderStates()
    }, [])

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const handleSupprimer = (id) => {
        setIdToDelete(id)
        setShowConfirmation(true)
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5001/OrderState/${idToDelete}`)
            const updatedList = orderStates.filter((order) => order.id !== idToDelete)
            setOrderStates(updatedList)
            console.log(`État de commande avec l'ID ${idToDelete} supprimé.`)
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'état de commande avec l'ID ${idToDelete}:`, error)
        } finally {
            setShowConfirmation(false)
        }
    }

    const cancelDelete = () => {
        setShowConfirmation(false)
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Liste</strong> <small>des États des commandes</small>
                    </CCardHeader>
                    <CCardBody>
                        <CTable hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>#</CTableHeaderCell>
                                    <CTableHeaderCell>Code de commande</CTableHeaderCell>
                                    <CTableHeaderCell>Date</CTableHeaderCell>
                                    <CTableHeaderCell>Client</CTableHeaderCell>
                                    <CTableHeaderCell>Email</CTableHeaderCell>
                                    <CTableHeaderCell>État</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {orderStates.map((orderState, index) => (
                                    <CTableRow key={orderState.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{orderState.Order.code}</CTableDataCell>
                                        <CTableDataCell>{formatDate(orderState.date)}</CTableDataCell>
                                        <CTableDataCell>{orderState.Order.customer.name}</CTableDataCell>
                                        <CTableDataCell>{orderState.Order.customer.email}</CTableDataCell>
                                        <CTableDataCell>{orderState.State.value}</CTableDataCell>
                                        <CTableDataCell>
                                            <Link to={`/admin/detail_order_state/${orderState.id}`}>
                                                <CButton size="md" color="info" className="me-2">
                                                    <IoEyeSharp className="icon-white icon-lg me-1" />
                                                </CButton>
                                            </Link>

                                            <CButton size="md" color="danger" onClick={() => handleSupprimer(orderState.id)} className="me-2">
                                                <FaTrash />
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>

            <CModal visible={showConfirmation} onClose={cancelDelete}>
                <CModalHeader closeButton>
                    <CModalTitle>Confirmation de suppression</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Êtes-vous sûr de vouloir supprimer cet état de commande ?
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
    )
}

export default OrderStateList
