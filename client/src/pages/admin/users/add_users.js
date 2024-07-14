import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import { Link } from 'react-router-dom';

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        user_name: '',
        password: '',
        email: '',
        registration_number: '',
        cin: '',
        photo: '',
        role_usersID: '',
        deleted: false,
    });
    const [imageFile, setImageFile] = useState(null); // Ajout de l'état pour l'image
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesResponse = await axios.get('http://localhost:5001/roleUsers/');
                setRoles(rolesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des rôles:', error);
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]); // Stocker le fichier image sélectionné
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('user_name', formData.user_name);
        data.append('password', formData.password);
        data.append('email', formData.email);
        data.append('registration_number', formData.registration_number);
        data.append('cin', formData.cin);
        data.append('role_usersID', formData.role_usersID);
        data.append('deleted', formData.deleted);
        if (imageFile) {
            data.append('photo', imageFile); // Ajouter le fichier image si sélectionné
        }

        try {
            const response = await axios.post('http://localhost:5001/Users/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Réponse serveur:', response.data);
            navigate('/admin/list_user');
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.error) {
                setModalMessage(error.response.data.error);
                setShowModal(true);
            } else {
                console.error('Erreur lors de la soumission du formulaire:', error);
            }
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Ajouter</strong> <small>Utilisateur</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3" onSubmit={handleSubmit}>
                            <CCol md={6}>
                                <CFormLabel htmlFor="name">Nom</CFormLabel>
                                <CFormInput id="name" value={formData.name} onChange={handleChange} required />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="user_name">Nom d'utilisateur</CFormLabel>
                                <CFormInput id="user_name" value={formData.user_name} onChange={handleChange} required />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="password">Mot de passe</CFormLabel>
                                <CFormInput type="password" id="password" value={formData.password} onChange={handleChange} required />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="email">Email</CFormLabel>
                                <CFormInput type="email" id="email" value={formData.email} onChange={handleChange} required />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="registration_number">Numéro d'enregistrement</CFormLabel>
                                <CFormInput id="registration_number" value={formData.registration_number} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="cin">CIN</CFormLabel>
                                <CFormInput id="cin" value={formData.cin} onChange={handleChange} />
                            </CCol>
                            <CCol md={4}>
                                <CFormLabel htmlFor="role_usersID">Rôle</CFormLabel>
                                <CFormSelect id="role_usersID" value={formData.role_usersID} onChange={handleChange} required>
                                    <option value="">Choisir...</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol md={2} className="align-self-end">
                <Link to={`/admin/add_role_users`}>
                  <CButton color="primary">
                    Ajouter Role
                  </CButton>
                </Link>
              </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="photo">Photo</CFormLabel>
                                <CFormInput type="file" id="photo" onChange={handleImageChange} />
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

export default AddUser;
