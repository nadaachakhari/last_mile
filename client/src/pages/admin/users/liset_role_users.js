import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { IoEyeSharp } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
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
} from '@coreui/react'

import { useAuth } from '../../../Middleware/Use_Auth'; 
const ListeRoleUsers = () => {
  const [roleUsers, setRoleUsers] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)
  const navigate = useNavigate() // For navigation
  const { role } = useAuth();
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'Administrateur') {
      navigate('/unauthorized');
    }
    const fetchRoleUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/roleUsers')
        setRoleUsers(response.data)
      } catch (error) {
        console.error('Erreur lors de la récupération des rôles utilisateurs:', error)
      }
    }

    fetchRoleUsers()
  }, [role, navigate])

  const handleDetail = async (idRoleUser) => {
    try {
      const response = await axios.get(`http://localhost:5001/roleUsers/${idRoleUser}`)
      console.log('Détails du Rôle Utilisateur:', response.data)
      // Implémentez la logique pour afficher les détails du Rôle Utilisateur (par exemple, ouvrir un modal)
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des détails du Rôle Utilisateur avec l'ID ${idRoleUser}:`,
        error,
      )
    }
  }

  const handleModifier = (idRoleUser) => {
    navigate(`/admin/edit_role_user/${idRoleUser}`) // Navigate to edit page
  }

  const handleSupprimer = async (idRoleUser) => {
    setIdToDelete(idRoleUser) // Stocke l'ID du Rôle Utilisateur à supprimer
    setShowConfirmation(true) // Affiche la popup de confirmation
  }

  const confirmDelete = async () => {
    try {
      await axios.put(`http://localhost:5001/roleUsers/update_deleted/${idToDelete}`)
      // Mettre à jour localement en filtrant les éléments supprimés
      const updatedList = roleUsers.filter((role) => role.id !== idToDelete)
      setRoleUsers(updatedList)
      console.log(`Rôle Utilisateur avec l'ID ${idToDelete} marqué comme supprimé.`)
    } catch (error) {
      console.error(
        `Erreur lors de la suppression du Rôle Utilisateur avec l'ID ${idToDelete}:`,
        error,
      )
    } finally {
      setShowConfirmation(false) // Ferme la popup de confirmation après suppression
    }
  }

  const cancelDelete = () => {
    setShowConfirmation(false) // Annule la suppression et ferme la popup de confirmation
  }

  const handleAddRoleUser = () => {
    navigate('/admin/add_role_users') // Navigate to the add page
  }

  return (
    <CRow>
              {role === 'Administrateur' && ( 
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Liste des</strong> <small>Rôles Utilisateurs</small>
          </CCardHeader>
          <CCardBody>
            {/* <CButton color="primary" onClick={handleAddRoleUser} className="mb-3">
              Ajouter Rôle Utilisateur
            </CButton> */}
            <CTable striped>
              <CTableCaption>Liste des rôles utilisateurs actifs</CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">Actions</CTableHeaderCell> */}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {roleUsers.map((role, index) => (
                  <CTableRow key={role.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{role.name}</CTableDataCell>
                    {/* <CTableDataCell>
                      <Link to={`/admin/detail_role_users/${role.id}`}>
                        <CButton size="md" color="info" className="me-2 ">
                          <IoEyeSharp className="icon-white icon-lg me-7" />
                        </CButton>
                      </Link>
                      <Link to={`/admin/edit_role_users/${role.id}`}>
                        <CButton
                          size="md"
                          color="warning"
                          onClick={() => handleModifier(role.id)}
                          className="me-2"
                        >
                          <FaEdit className="icon-white icon-lg me-7" />
                        </CButton>
                      </Link>
                      <CButton
                        size="md"
                        color="danger"
                        onClick={() => handleSupprimer(role.id)}
                        className="me-2"
                      >
                        <FaTrash className="icon-white icon-lg me-7" />
                      </CButton>
                    </CTableDataCell> */}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
              )
            }
      {/* Modal de confirmation de suppression */}
      <CModal visible={showConfirmation} onClose={cancelDelete}>
        <CModalHeader closeButton>
          <CModalTitle>Confirmation de suppression</CModalTitle>
        </CModalHeader>
        <CModalBody>Êtes-vous sûr de vouloir supprimer ce Rôle Utilisateur ?</CModalBody>
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

export default ListeRoleUsers
