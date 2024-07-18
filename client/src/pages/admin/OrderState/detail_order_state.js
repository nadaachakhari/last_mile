import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'

const DetailOrderState = () => {
    const { id } = useParams()
    const [orderState, setOrderState] = useState(null)

    useEffect(() => {
        const fetchOrderState = async () => {
            

            try {
                const response = await axios.get(`http://localhost:5001/OrderState/${id}`)
                setOrderState(response.data)
            } catch (error) {
                console.error(
                    `Erreur lors de la récupération des détails de l'état de commande avec l'ID ${id}:`,
                    error,
                )
            }
        }

        fetchOrderState()
    }, [id])

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString))
    }

    if (!orderState) {
        return (
            <CRow className="mt-4">
                <CCol>
                    <CCard>
                        <CCardHeader>
                            <strong>Chargement en cours...</strong>
                        </CCardHeader>
                        <CCardBody>
                            <p>Veuillez patienter pendant le chargement des détails de l'état de commande...</p>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        )
    }

    const handleBack = () => {
        window.history.back()
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Détails de l'État de Commande</strong>
                    </CCardHeader>
                    <CCardBody>
                        <p>
                            <strong>Code de commande:</strong> {orderState.Order.code}
                        </p>
                        <p>
                            <strong>Date de l'état:</strong> {formatDate(orderState.date)}
                        </p>
                        <p>
                            <strong>Date de la commande:</strong> {formatDate(orderState.Order.date)}
                        </p>
                        <p>
                            <strong>Client:</strong> {orderState.Order.customer.name} ({orderState.Order.customer.email})
                        </p>
                        <p>
                            <strong>Adresse du client:</strong> {orderState.Order.customer.address}, {orderState.Order.customer.postal_code} {orderState.Order.customer.country}
                        </p>
                        <p>
                            <strong>Téléphone:</strong> {orderState.Order.customer.phone} / {orderState.Order.customer.mobile}
                        </p>
                        <p>
                            <strong>Fournisseur:</strong> {orderState.Order.supplier.name} ({orderState.Order.supplier.email})
                        </p>
                        <p>
                            <strong>Adresse du fournisseur:</strong> {orderState.Order.supplier.address}, {orderState.Order.supplier.postal_code} {orderState.Order.supplier.country}
                        </p>
                        <p>
                            <strong>Téléphone:</strong> {orderState.Order.supplier.phone} / {orderState.Order.supplier.mobile}
                        </p>
                        <p>
                            <strong>État:</strong> {orderState.State.value}
                        </p>
                        <p>
                            <strong>Observation:</strong> {orderState.Order.observation}
                        </p>
                        <p>
                            <strong>Note:</strong> {orderState.Order.note}
                        </p>
                        <Link to="/admin/list_order_state">
                            <CButton color="primary" onClick={handleBack}>Retour à la liste</CButton>
                        </Link>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default DetailOrderState
