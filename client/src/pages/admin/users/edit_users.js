import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CFormSelect,
} from '@coreui/react'

const EditUser = () => {
    const { id } = useParams() // Récupérer l'ID de l'utilisateur à éditer depuis les paramètres d'URL
    const navigate = useNavigate() // Pour la navigation
    const [formData, setFormData] = useState({
        name: '',
        user_name: '',
        email: '',
        photo: '',
        registration_number: '',
        cin: '',
        roleID: '',
        permission: '',
    })
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [roles, setRoles] = useState([]) // État pour stocker la liste des rôles

    // Utiliser useEffect pour récupérer les détails de l'utilisateur à éditer
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/Users/${id}`)
                setFormData(response.data) // Pré-remplir le formulaire avec les détails de l'utilisateur
            } catch (error) {
                console.error(
                    `Erreur lors de la récupération des détails de l'utilisateur avec l'ID ${id}:`,
                    error,
                )
            }
        }

        // Charger la liste des rôles
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:5001/roleUsers/')
                setRoles(response.data)
            } catch (error) {
                console.error('Erreur lors de la récupération des rôles:', error)
            }
        }

        fetchUserDetails()
        fetchRoles()
    }, [id])

    // Gérer les modifications du formulaire
    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData({ ...formData, [id]: value })
    }

    // Soumettre le formulaire d'édition de l'utilisateur
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`http://localhost:5001/Users/${id}`, formData)
            console.log('Réponse serveur:', response.data)
            navigate('/admin/list_user') // Rediriger vers la liste des utilisateurs après édition
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error) {
                setModalMessage(error.response.data.error)
                setShowModal(true)
            } else {
                console.error('Erreur lors de la soumission du formulaire:', error)
            }
        }
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Modifier</strong> <small>Utilisateur</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3" onSubmit={handleSubmit}>
                            <CCol md={6}>
                                <CFormLabel htmlFor="name">Nom</CFormLabel>
                                <CFormInput id="name" value={formData.name} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="user_name">Nom d'utilisateur</CFormLabel>
                                <CFormInput id="user_name" value={formData.user_name} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="email">Email</CFormLabel>
                                <CFormInput id="email" value={formData.email} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="photo">Photo</CFormLabel>
                                <CFormInput id="photo" value={formData.photo} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="registration_number">Numéro d'inscription</CFormLabel>
                                <CFormInput
                                    id="registration_number"
                                    value={formData.registration_number}
                                    onChange={handleChange}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="cin">CIN</CFormLabel>
                                <CFormInput id="cin" value={formData.cin} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="roleID">Rôle</CFormLabel>
                                <CFormSelect id="roleID" value={formData.roleID} onChange={handleChange}>
                                    <option value="">Choisir...</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="permission">Permission</CFormLabel>
                                <CFormInput id="permission" value={formData.permission} onChange={handleChange} />
                            </CCol>
                            <CCol xs={12}>
                                <CButton color="primary" type="submit">
                                    Modifier
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
    )
}

export default EditUser
