import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const DetailRoleUser = () => {
  const { id } = useParams()
  const [roleUser, setRoleUser] = useState(null)

  useEffect(() => {
    const fetchRoleUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/RoleUsers/${id}`)
        setRoleUser(response.data)
      } catch (error) {
        console.error(
          `Erreur lors de la récupération des détails du RoleUser avec l'ID ${id}:`,
          error,
        )
      }
    }

    fetchRoleUser()
  }, [id]) // Utilisation de [id] comme dépendance pour recharger les détails lorsque l'ID change

  if (!roleUser) {
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Détail du Role User</CCardHeader>
            <CCardBody>Chargement en cours...</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Détail du Role User</CCardHeader>
          <CCardBody>
            <p>
              <strong>ID:</strong> {roleUser.id}
            </p>
            <p>
              <strong>Nom:</strong> {roleUser.name}
            </p>
            <p>
              <strong>Deleted:</strong> {roleUser.deleted ? 'Active' : 'Inactive'}
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DetailRoleUser
