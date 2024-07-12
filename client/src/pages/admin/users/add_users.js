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

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        user_name: '',
        password: '',
        email: '',
        registration_number: '',
        cin: '',
        role_usersID: '',
        deleted: false,
    });
    const [photo, setPhoto] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:5001/roleUsers');
                setRoles(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des rôles:', error);
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        console.log(`Champ ${id} : ${value}`); // Affiche la valeur mise à jour
        setFormData({ ...formData, [id]: value });
        console.log('Nouvel état du formulaire :', formData); // Affiche l'état complet du formulaire après mise à jour
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log('Fichier sélectionné :', file); // Affiche le fichier sélectionné
        setPhoto(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataWithFile = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataWithFile.append(key, formData[key]);
            });
            if (photo) {
                formDataWithFile.append('photo', photo);
            }

            const response = await axios.post('http://localhost:5001/Users/', formDataWithFile, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Réponse serveur:', response.data);
            navigate('/admin/list_users');
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);

            if (error.response && error.response.status === 400 && error.response.data.error) {
                console.log('Détails de l\'erreur:', error.response.data.error);
                setModalMessage(error.response.data.error);
                setShowModal(true);
            } else {
                console.error('Erreur inattendue:', error);
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
                                <CFormInput id="name" value={formData.name} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="user_name">Nom d'utilisateur</CFormLabel>
                                <CFormInput id="user_name" value={formData.user_name} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="password">Mot de passe</CFormLabel>
                                <CFormInput type="password" id="password" value={formData.password} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="email">Email</CFormLabel>
                                <CFormInput type="email" id="email" value={formData.email} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="registration_number">Numéro d'inscription</CFormLabel>
                                <CFormInput id="registration_number" value={formData.registration_number} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="cin">CIN</CFormLabel>
                                <CFormInput id="cin" value={formData.cin} onChange={handleChange} />
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="role_usersID">Rôle</CFormLabel>
                                <CFormSelect id="role_usersID" value={formData.role_usersID} onChange={handleChange}>
                                    <option value="">Choisir...</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol md={6}>
                                <CFormLabel htmlFor="photo">Photo</CFormLabel>
                                <CFormInput type="file" id="photo" onChange={handleFileChange} />
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
