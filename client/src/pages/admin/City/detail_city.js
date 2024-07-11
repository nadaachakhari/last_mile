import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react';

const DetailCity = () => {
  const { id } = useParams(); // Récupère l'ID depuis les paramètres d'URL
  const [city, setcity] = useState(null); // État pour stocker les détails du city

  useEffect(() => {
    const fetchcity = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/city/${id}`);
        setcity(response.data);
      } catch (error) {
        console.error(`Erreur lors de la récupération des détails ducity avec l'ID ${id}:`, error);
      }
    };

    fetchcity();
  }, [id]); // Utilisation de [id] comme dépendance pour recharger les détails lorsque l'ID change

  if (!city) {
    return (
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              Détail du ville
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
            Détail du ville
          </CCardHeader>
          <CCardBody>
          
            <p><strong>Nom:</strong> {city.value}</p>
            <p><strong>Deleted:</strong> {city.deleted ? 'Active' : 'Inactive'}</p>
            <Link to="/admin/list_city">
              <CButton color="primary">Retour à la liste</CButton>
            </Link>
           
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DetailCity;
