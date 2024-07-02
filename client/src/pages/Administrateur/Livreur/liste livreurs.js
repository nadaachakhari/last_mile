import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useHistory } from 'react-router-dom';

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
} from '@coreui/react';


const listeListener = () => {
  const [livreurs, setLivreurs] = useState([]);
 // const history = useHistory();

  useEffect(() => {
    // Exemple de requête pour obtenir la liste des livreurs depuis une API
    const fetchLivreurs = async () => {
      try {
        const response = await axios.get('http://localhost:5001/livreur');
        setLivreurs(response.data); // Assurez-vous que votre API renvoie les données attendues
      } catch (error) {
        console.error('Erreur lors de la récupération des livreurs:', error);
      }
    };

    fetchLivreurs();
  }, []);
  const handleDetail = async (idLivreur) => {
    try {
      const response = await axios.get(`http://localhost:5001/livreur/getLivreurById/${idLivreur}`);
      setLivreurDetail(response.data); // Stocke les détails du livreur dans le state
      history.push(`/administrateur/detaillivreur/${idLivreur}`); // Navigue vers la page de détail du livreur avec l'ID
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails du livreur avec l'ID ${idLivreur}:`, error);
    }
  };

  const handleModifier = (idLivreur) => {
    // Implémenter la logique pour modifier le livreur avec l'id idLivreur
    console.log(`Modifier le livreur avec l'id ${idLivreur}`);
  };

  const handleSupprimer = async (idLivreur) => {
    // Implémenter la logique pour supprimer le livreur avec l'id idLivreur
    try {
      await axios.delete(`http://localhost:5001/livreur/deleteLivreur/${idLivreur}`);
      // Mettre à jour la liste après suppression
      const updatedList = livreurs.filter((livreur) => livreur.idLivreur !== idLivreur);
      setLivreurs(updatedList);
      console.log(`Livreur avec l'id ${idLivreur} supprimé.`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du livreur avec l'id ${idLivreur}:`, error);
    }
  };


  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Liste des</strong> <small>Livreurs</small>
       
          </CCardHeader>
          <CCardBody>
            <CTable striped>
              <CTableCaption>Liste des livreurs actifs</CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Prénom</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Téléphone</CTableHeaderCell>
                  <CTableHeaderCell scope="col">age</CTableHeaderCell>
                  <CTableHeaderCell scope="col">genre</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                 
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {livreurs.map((livreur, index) => (
                  <CTableRow key={livreur.idLivreur}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{livreur.utilisateur.Nom}</CTableDataCell>
                    <CTableDataCell>{livreur.utilisateur.Prenom}</CTableDataCell>
                    <CTableDataCell>{livreur.utilisateur.Email}</CTableDataCell>
                    <CTableDataCell>{livreur.utilisateur.telephone}</CTableDataCell>
                    <CTableDataCell>{livreur.utilisateur.age}</CTableDataCell>
                    <CTableDataCell>{livreur.utilisateur.genre}</CTableDataCell>
                    <CTableDataCell>
                      <CButton size="sm" color="info" onClick={() => handleDetail(livreur.idLivreur)}>
                        Détail
                      </CButton>
                      <CButton size="sm" color="warning" className="ms-1" onClick={() => handleModifier(livreur.idLivreur)}>
                        Modifier
                      </CButton>
                      <CButton size="sm" color="danger" className="ms-1" onClick={() => handleSupprimer(livreur.idLivreur)}>
                        Supprimer
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default listeListener;
