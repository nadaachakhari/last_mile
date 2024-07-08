import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react';

const DetailLivreur = () => {
  const { id } = useParams(); // Récupérer l'ID du livreur depuis les paramètres d'URL
  const [livreur, setLivreur] = useState(null); // State pour stocker les détails du livreur

  useEffect(() => {
    const fetchLivreur = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/livreur/${id}`);
        setLivreur(response.data); // Mettre à jour le state avec les données du livreur
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du livreur:', error);
      }
    };

    fetchLivreur();
  }, [id]); // Exécuter l'effet lorsque l'ID du livreur change

  if (!livreur) {
    return <div>Loading...</div>; // Afficher un message de chargement tant que les données sont récupérées
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Détails du Livreur</strong>
          </CCardHeader>
          <CCardBody>
            <div>
              <strong>Nom: </strong> {livreur.utilisateur.Nom}
            </div>
            <div>
              <strong>Prénom: </strong> {livreur.utilisateur.Prenom}
            </div>
            <div>
              <strong>Email: </strong> {livreur.utilisateur.Email}
            </div>
            <div>
              <strong>Téléphone: </strong> {livreur.utilisateur.telephone}
            </div>
            <div>
              <strong>Age: </strong> {livreur.utilisateur.age}
            </div>
            <div>
              <strong>Genre: </strong> {livreur.utilisateur.genre}
            </div>
            <CButton color="info" className="mt-3" onClick={() => window.history.back()}>
              Retour
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default DetailLivreur;
