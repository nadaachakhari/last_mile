import React, { useState } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';

const AjouterFournisseur = () => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    age: '',
    genre: '',
    type: '',
    numeroRue: '',
    nomRue: '',
    complementAdresse: '',
    codePostal: '',
    ville: '',
    secteurActivite: '',
    siteWeb: '',
    notes: '',
    motDePasse: '', 
    statuts: 'désactiver',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/fournisseurs/registre', {
        utilisateur: {
          Nom: formData.nom, 
          Prenom: formData.prenom,
          Email: formData.email,
          Mot_de_passe: formData.motDePasse,
          telephone: formData.telephone,
          age: formData.age,
          genre: formData.genre,
        },
        adresse: {
          type: formData.type,
          numeroRue: formData.numeroRue,
          nomRue: formData.nomRue,
          complementAdresse: formData.complementAdresse,
          codePostal: formData.codePostal,
          ville: formData.ville,
        },
        matricule: formData.matricule,
        secteurActivite: formData.secteurActivite,
        siteWeb: formData.siteWeb,
        notes: formData.notes,
        statuts: formData.statuts,
      });
      console.log('Réponse serveur:', response.data);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error === 'Email already in use') {
        setModalMessage('Cet email est déjà utilisé. Veuillez en choisir un autre.');
        setShowModal(true);
      } else {
        setModalMessage('Erreur lors de la soumission du formulaire. Veuillez réessayer.');
        setShowModal(true);
      }
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };
  
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Ajouter</strong> <small>Fournisseur</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="matricule">Matricule</CFormLabel>
                <CFormInput id="matricule" value={formData.matricule} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="nom">Nom</CFormLabel>
                <CFormInput id="nom" value={formData.nom} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="prenom">Prénom</CFormLabel>
                <CFormInput id="prenom" value={formData.prenom} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput type="email" id="email" value={formData.email} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="telephone">Téléphone</CFormLabel>
                <CFormInput  id="telephone" value={formData.telephone} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="age">Age</CFormLabel>
                <CFormInput id="age" value={formData.age} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="genre">Genre</CFormLabel>
                <CFormSelect id="genre" value={formData.genre} onChange={handleChange}>
                  <option>Choose...</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="type">Type d'adresse</CFormLabel>
                <CFormSelect id="type" value={formData.type} onChange={handleChange}>
                  <option>Domicile</option>
                  <option value="Travail">Travail</option>
                  <option value="Autre">Autre</option>
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="numeroRue">Numéro de rue</CFormLabel>
                <CFormInput id="numeroRue" value={formData.numeroRue} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="nomRue">Nom de rue</CFormLabel>
                <CFormInput id="nomRue" value={formData.nomRue} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="complementAdresse">Complément d'adresse</CFormLabel>
                <CFormInput id="complementAdresse" value={formData.complementAdresse} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="codePostal">Code postal</CFormLabel>
                <CFormInput id="codePostal" value={formData.codePostal} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="ville">Ville</CFormLabel>
                <CFormInput id="ville" value={formData.ville} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="secteurActivite">Secteur d'activité</CFormLabel>
                <CFormInput id="secteurActivite" value={formData.secteurActivite} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="siteWeb">Lien de site Web</CFormLabel>
                <CFormInput id="siteWeb" value={formData.siteWeb} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="notes">Notes</CFormLabel>
                <CFormInput id="notes" value={formData.notes} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="motDePasse">Mot de Passe</CFormLabel> 
                <CFormInput type="password" id="motDePasse" value={formData.motDePasse} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="statuts">État</CFormLabel>
                <CFormSelect id="statuts" value={formData.statuts} onChange={handleChange}>
                  <option value="activer">Activer</option>
                  <option value="désactiver">Désactiver</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" type="submit">
                  Ajouter
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
        <CModalBody>
          {modalMessage}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default AjouterFournisseur;
