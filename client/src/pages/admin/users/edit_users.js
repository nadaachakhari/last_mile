import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../Middleware/Use_Auth'; 
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput,
    CFormLabel, CRow, CModal, CModalHeader, CModalTitle, CModalBody,
    CModalFooter, CFormSelect
} from '@coreui/react';

const EditUser = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '', user_name: '', password: '', email: '', registration_number: '',
        cin: '', photo: '', role_usersID: '', deleted: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const navigate = useNavigate();
    const { role } = useAuth();
    useEffect(() => {
        if (!role) {
            return; // N'exécutez rien tant que le rôle n'est pas récupéré
          }
      
          console.log('User role:', role);
      
          if (role !== 'Administrateur') {
            navigate('/unauthorized');
          }
        const fetchRoles = async () => {
            try {
                const rolesResponse = await axios.get('http://localhost:5001/roleUsers/');
                setRoles(rolesResponse.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des rôles:', error);
            }
        };

        fetchRoles();
    }, [role, navigate]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:5001/Users/${id}`);
                const user = userResponse.data;
                setFormData({
                    name: user.name,
                    user_name: user.user_name,
                    password: '', 
                    email: user.email,
                    registration_number: user.registration_number || '',
                    cin: user.cin || '',
                    photo: user.photo || '',
                    role_usersID: user.role_usersID || '',
                    deleted: user.deleted || false,
                });
                const role = roles.find(role => role.id === user.role_usersID);
                if (role) {
                    setSelectedRole(role.name);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            }
        };

        fetchUser();
    }, [id, roles]);

    useEffect(() => {
        const role = roles.find(role => role.id === formData.role_usersID);
        if (role) {
            setSelectedRole(role.name);
        }
    }, [formData.role_usersID, roles]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        if (id === 'role_usersID') {
            const selectedRoleObject = roles.find(role => role.id === parseInt(value));
            setSelectedRole(selectedRoleObject ? selectedRoleObject.name : '');
        }
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('user_name', formData.user_name);
        data.append('password', formData.password); // Send password if provided
        data.append('email', formData.email);
        data.append('registration_number', formData.registration_number);
        data.append('cin', formData.cin);
        data.append('role_usersID', formData.role_usersID);
        data.append('deleted', formData.deleted);
        if (imageFile) {
            data.append('photo', imageFile);
        }

        try {
            const response = await axios.put(`http://localhost:5001/Users/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
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

    const showFieldsForRole = selectedRole === 'livreur';

    return (
        <CRow>
                    {role === 'Administrateur' && ( 
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
                          
                            {showFieldsForRole && (
                                <>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="registration_number">Numéro d'enregistrement</CFormLabel>
                                        <CFormInput id="registration_number" value={formData.registration_number} onChange={handleChange} />
                                    </CCol>
                                    <CCol md={6}>
                                        <CFormLabel htmlFor="cin">CIN</CFormLabel>
                                        <CFormInput id="cin" value={formData.cin} onChange={handleChange} />
                                    </CCol>
                                </>
                            )}
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
                            <CCol xs={12}>
                                <CButton color="primary" type="submit">Modifier</CButton>
                            </CCol>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
                    )}
            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader>
                    <CModalTitle>Erreur</CModalTitle>
                </CModalHeader>
                <CModalBody>{modalMessage}</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>Fermer</CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default EditUser;
