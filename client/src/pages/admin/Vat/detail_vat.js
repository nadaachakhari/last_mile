import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAlert,
} from '@coreui/react';
import { useAuth } from '../../../Middleware/Use_Auth';
const DetailVat = () => {
  const { id } = useParams();
  const [vat, setVat] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { role } = useAuth(); 
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'fournisseur') {
      navigate('/unauthorized');
    }
    const fetchVat = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/vat/${id}`);
        setVat(response.data);
      } catch (error) {
        console.error(`Erreur lors de la récupération de la TVA avec l'ID ${id}:`, error);
        setError('Erreur lors de la récupération de la TVA.');
      }
    };

    fetchVat();
  }, [id,role,navigate]);

  if (error) {
    return (
      <CRow>
        <CCol xs={12}>
          <CAlert color="danger">{error}</CAlert>
        </CCol>
      </CRow>
    );
  }

  if (!vat) {
    return (
      <CRow>
        <CCol xs={12}>
          <CAlert color="info">Chargement des données...</CAlert>
        </CCol>
      </CRow>
    );
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Détails de la TVA</strong>
          </CCardHeader>
          <CCardBody>
            <p><strong>Valeur:</strong> {vat.value}%</p>
    
            <Link to="/admin/list_vat">
              <CButton color="primary">Retour à la liste</CButton>
            </Link>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DetailVat;
