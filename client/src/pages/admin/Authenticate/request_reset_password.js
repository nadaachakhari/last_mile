import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeClosed } from '@coreui/icons';

const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRequestReset = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5001/password/forgot-password', { email });
            setMessage(response.data.message);
            setError('');
        } catch (error) {
            setError('Erreur lors de la demande de réinitialisation du mot de passe. Veuillez vérifier votre email.');
            setMessage('');
        }
    };

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={8}>
                        <CCardGroup>
                            <CCard className="p-4">
                                <CCardBody>
                                    <CForm onSubmit={handleRequestReset}>
                                        <h1>Demande de réinitialisation du mot de passe</h1>
                                        <p className="text-body-secondary">Entrez votre email pour recevoir un lien de réinitialisation du mot de passe</p>
                                        {message && <p style={{ color: 'green' }}>{message}</p>}
                                        {error && <p style={{ color: 'red' }}>{error}</p>}
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilEnvelopeClosed} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="email"
                                                placeholder="Email"
                                                autoComplete="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </CInputGroup>
                                        <CRow>
                                            <CCol xs={6}>
                                                <CButton type="submit" color="primary" className="px-4">
                                                    Envoyer
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                            <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                                <CCardBody className="text-center">
                                    <div>
                                        <h2>Se connecter</h2>
                                        <p>
                                            Si vous avez déjà un compte, vous pouvez vous connecter en cliquant sur le bouton ci-dessous.
                                        </p>
                                        <Link to="/Authenticate">
                                            <CButton color="primary" className="mt-3" active tabIndex={-1}>
                                                Se connecter
                                            </CButton>
                                        </Link>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
};

export default RequestPasswordReset;
