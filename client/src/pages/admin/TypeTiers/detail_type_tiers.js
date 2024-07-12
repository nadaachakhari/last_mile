import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react';
import { Link, useNavigate } from 'react-router-dom';
const DetailTypeTiers = () => {
  const { id } = useParams(); // Récupère l'ID depuis les paramètres d'URL
  const [typeTiers, setTypeTiers] = useState(null); // État pour stocker les détails du TypeTiers

  useEffect(() => {
    const fetchTypeTiers = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/typeTiers/${id}`);
        setTypeTiers(response.data);
      } catch (error) {
        console.error(`Erreur lors de la récupération des détails du TypeTiers avec l'ID ${id}:`, error);
      }
    };

    fetchTypeTiers();
  }, [id]); // Utilisation de [id] comme dépendance pour recharger les détails lorsque l'ID change

  if (!typeTiers) {
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              Détail du TypeTiers
            </CCardHeader>
            <CCardBody>
              Chargement en cours...
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            Détail du TypeTiers
          </CCardHeader>
          <CCardBody>
            
            <p><strong>Nom:</strong> {typeTiers.name}</p>
            <p><strong>État:</strong> {typeTiers.deleted ? 'Active' : 'Inactive'}</p>
            <Link to="/admin/list_type_tiers">
              <CButton color="primary">Retour à la liste</CButton>
            </Link>
           
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DetailTypeTiers;
