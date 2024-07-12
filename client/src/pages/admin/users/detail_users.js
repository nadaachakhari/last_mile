import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { IoArrowBack } from 'react-icons/io5'

const DetailUser = () => {
  const { id } = useParams() // Récupère l'ID de l'utilisateur depuis les paramètres d'URL
  const [user, setUser] = useState(null) // État pour stocker les détails de l'utilisateur
  const [showModal, setShowModal] = useState(false) // État pour contrôler l'affichage du modal

  useEffect(() => {
    // Fonction pour récupérer les détails de l'utilisateur à partir de l'API
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/Users/${id}`)
        setUser(response.data)
      } catch (error) {
        console.error(
          `Erreur lors de la récupération des détails de l'utilisateur avec l'ID ${id}:`,
          error,
        )
        // Afficher une erreur ou gérer de manière appropriée
      }
    }

    fetchUser() // Appel de la fonction au chargement du composant
  }, [id]) // Déclenche l'effet à chaque changement de l'ID dans les paramètres d'URL

  if (!user) {
    return (
      <CRow className="mt-4">
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Chargement en cours...</strong>
            </CCardHeader>
            <CCardBody>
              <p>Veuillez patienter pendant le chargement des détails de l'utilisateur...</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  const handleBack = () => {
    // Fonction pour revenir à la liste des utilisateurs
    window.history.back()
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/Users/update_deleted/${id}`)
      // Redirection ou affichage d'un message de succès après la suppression
      setShowModal(true) // Affiche le modal de succès
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur avec l'ID ${id}:`, error)
      // Afficher une erreur ou gérer de manière appropriée
    }
  }

  const closeModal = () => {
    setShowModal(false) // Ferme le modal de succès
    handleBack() // Redirige vers la liste des utilisateurs après la fermeture du modal
  }

  return (
    <CRow>
      <CCol xs={12}>
        <div className="card-header-actions" xs={12}>
          <CButton color="secondary" onClick={handleBack}>
            <IoArrowBack className="me-1 " /> Retour
          </CButton>
        </div>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Détails de l'utilisateur</strong>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Nom:</strong> {user.name}
            </p>
            <p>
              <strong>Nom d'utilisateur:</strong> {user.user_name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Photo:</strong> {user.photo}
            </p>
            <p>
              <strong>Numéro d'inscription:</strong> {user.registration_number}
            </p>
            <p>
              <strong>CIN:</strong> {user.cin}
            </p>
            <p>
              <strong>Rôle:</strong> {user.RoleUser?.name}
            </p>
            <p>
              <strong>Permission:</strong> {user.permission}
            </p>
            <CButton color="danger" onClick={handleDelete}>
              Supprimer
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal de confirmation de suppression */}
      <CModal visible={showModal} onClose={closeModal}>
        <CModalHeader closeButton>
          <CModalTitle>Suppression réussie</CModalTitle>
        </CModalHeader>
        <CModalBody>L'utilisateur a été supprimé avec succès.</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default DetailUser
