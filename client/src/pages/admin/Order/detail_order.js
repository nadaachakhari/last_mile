import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'

const DetailOrder = () => {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [paymentMethods, setPaymentMethods] = useState([])

    useEffect(() => {
        const fetchOrder = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                console.error('Token non trouvé dans localStorage.')
                return
            }

            try {
                const response = await axios.get(`http://localhost:5001/Order/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setOrder(response.data)
            } catch (error) {
                console.error(
                    `Erreur lors de la récupération des détails de la commande avec l'ID ${id}:`,
                    error,
                )
            }
        }

        fetchOrder()
    }, [id])

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get('http://localhost:5001/PaymentMethode/')
                setPaymentMethods(response.data)
            } catch (error) {
                console.error('Erreur lors de la récupération des méthodes de paiement:', error)
            }
        }
        fetchPaymentMethods()
    }, [])

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString))
    }

    if (!order) {
        return (
            <CRow className="mt-4">
                <CCol>
                    <CCard>
                        <CCardHeader>
                            <strong>Chargement en cours...</strong>
                        </CCardHeader>
                        <CCardBody>
                            <p>Veuillez patienter pendant le chargement des détails de la commande...</p>
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
                        <strong>Détails de la Commande</strong>
                    </CCardHeader>
                    <CCardBody>
                        <p>
                            <strong>Code:</strong> {order.code}
                        </p>
                        <p>
                            <strong>Date:</strong> {formatDate(order.date)}
                        </p>
                        <p>
                            <strong>Client:</strong> {order.customer.name} ({order.customer.email})
                        </p>
                        <p>
                            <strong>État:</strong> {order.state.value}
                        </p>
                        <p>
                            <strong>Observation:</strong> {order.observation}
                        </p>
                        <p>
                            <strong>Note:</strong> {order.note}
                        </p>
                        <p>
                            <strong>Méthode de paiement:</strong> {order.PaymentMethod?.value}
                        </p>
                        <Link to="/admin/list_order">
                            <CButton color="primary" onClick={handleBack}>Retour à la liste</CButton>
                        </Link>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default DetailOrder
