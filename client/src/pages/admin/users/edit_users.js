import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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

const EditUser = () => {
    const { id } = useParams(); // Récupérer l'ID de l'utilisateur à partir de l'URL
    const [formData, setFormData] = useState({
        name: '',
        user_name: '',
        email: '',
        registration_number: '',
        cin: '',
        roleID: '',
        photo: '',
        deleted: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/Users/${id}`);
                const user = response.data;
                setFormData({
                    name: user.name,
                    user_name: user.user_name,
                    email: user.email,
                    registration_number: user.registration_number,
                    cin: user.cin,
                    roleID: user.roleID,
                    photo: user.photo,
                    deleted: user.deleted,
                });
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:5001/roleUsers/');
                setRoles(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des rôles:', error);
            }
        };

        fetchUser();
        fetchRoles();
    }, [id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleRoleChange = (e) => {
        setFormData({ ...formData, roleID: e.target.value });
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
            const response = await axios.put(`http://localhost:5001/Users/${id}`, formData);
            console.log('Réponse serveur:', response.data);
            navigate('/admin/list_users');
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
                        <strong>Modifier</strong> <small>Utilisateur</small>
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
                            <CCol md={6}>
                                <CFormLabel htmlFor="roleID">Rôle</CFormLabel>
                                <CFormSelect id="roleID" value={formData.roleID} onChange={handleRoleChange} required>
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
                                <CFormInput id="photo" value={formData.photo} onChange={handleChange} />
                                {formData.photo && (
                                    <div className="mt-2">
                                        <img src={`http://localhost:5001/users_uploads/${formData.photo}`} alt="Utilisateur" width="100" />
                                    </div>
                                )}
                            </CCol>
                            <CCol xs={12}>
                                <CButton color="primary" type="submit">
                                    Modifier
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

export default EditUser;
