import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
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
} from '@coreui/react';

const EditUserProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    photo: '',
    password: '',
    role: '',
    tax_identification_number: '',
    postal_code: '',
    phone: '',
    mobile: '',
    fax: '',
    cityID: '',
    user_name: '',
    cin: '',
    registration_number: '',
    oldPassword: '', // Ajout pour le changement de mot de passe
    newPassword: '', // Ajout pour le changement de mot de passe
  });
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [role, setUserRole] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role);
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5001/Users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        setFormData(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:5001/City/');
        setCities(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error);
      }
    };

    fetchUserProfile();
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'oldPassword' && key !== 'newPassword') {
          data.append(key, formData[key]);
        }
      });
      if (imageFile) {
        data.append('photo', imageFile);
      }

      const response = await axios.put('http://localhost:5001/Users/updateusertier', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (formData.oldPassword && formData.newPassword) {
        await axios.put('http://localhost:5001/Authenticate/change-password', {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const { token: newToken, role: newRole, nameTiers, nameusers } = response.data;

      if (newToken) {
        localStorage.setItem('token', newToken);
      }

      if (newRole) {
        localStorage.setItem('role', newRole);
      }

      const name = nameTiers || nameusers;
      if (name) {
        localStorage.setItem('name', name);
      }

      setModalMessage('Profil mis à jour avec succès');
      setShowModal(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setModalMessage('Erreur lors de la mise à jour du profil');
      setShowModal(true);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Modifier</strong> <small>Profil Utilisateur</small>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol xs={12}>
                <p><strong>Rôle de l'utilisateur :</strong> {role}</p>
              </CCol>
            </CRow>
            <CForm className="row g-3" onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel htmlFor="name">Nom</CFormLabel>
                <CFormInput id="name" value={formData.name} onChange={handleChange} />
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput id="email" value={formData.email} onChange={handleChange} />
              </CCol>

              {(role === 'fournisseur' || role === 'client') && (
                <>
                  <CCol md={6}>
                    <CFormLabel htmlFor="phone">Numéro de Téléphone</CFormLabel>
                    <CFormInput id="phone" value={formData.phone} onChange={handleChange} />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="mobile">Numéro de Mobile</CFormLabel>
                    <CFormInput id="mobile" value={formData.mobile} onChange={handleChange} />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="fax">Fax</CFormLabel>
                    <CFormInput id="fax" value={formData.fax} onChange={handleChange} />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="cityID">Ville</CFormLabel>
                    <CFormSelect id="cityID" value={formData.cityID} onChange={handleChange}>
                      <option value="">Choisir...</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.value}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="postal_code">Code Postal</CFormLabel>
                    <CFormInput id="postal_code" value={formData.postal_code} onChange={handleChange} />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="address">Adresse</CFormLabel>
                    <CFormInput id="address" value={formData.address} onChange={handleChange} />
                  </CCol>
                </>
              )}

              {role === 'fournisseur' && (
                <CCol md={6}>
                  <CFormLabel htmlFor="tax_identification_number">Numéro Identification Taxe</CFormLabel>
                  <CFormInput
                    id="tax_identification_number"
                    value={formData.tax_identification_number}
                    onChange={handleChange}
                  />
                </CCol>
              )}

              {role.toLowerCase() === 'administrateur' && (
                <>
                  <CCol md={6}>
                    <CFormLabel htmlFor="user_name">Nom d'utilisateur</CFormLabel>
                    <CFormInput
                      id="user_name"
                      value={formData.user_name}
                      onChange={handleChange}
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel htmlFor="photo">Photo</CFormLabel>
                    <CFormInput type="file" id="photo" onChange={handleImageChange} />
                    {formData.photo && (
                      <div className="mt-2">
                        <img
                          src={`http://localhost:5001/users_uploads/${formData.photo}`}
                          alt="Utilisateur"
                          width="100"
                        />
                      </div>
                    )}
                  </CCol>
                </>
              )}

              {/* Section de changement de mot de passe */}
              <CCol md={6}>
                <CFormLabel htmlFor="oldPassword">Ancien mot de passe</CFormLabel>
                <CFormInput
                  type="password"
                  id="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="newPassword">Nouveau mot de passe</CFormLabel>
                <CFormInput
                  type="password"
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </CCol>

              <CCol xs={12}>
                <CButton type="submit">Enregistrer</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>Notification</CModalTitle>
        </CModalHeader>
        <CModalBody>{modalMessage}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default EditUserProfile;
