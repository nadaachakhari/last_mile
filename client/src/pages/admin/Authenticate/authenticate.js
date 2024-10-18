import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode }from 'jwt-decode';

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
  CAvatar,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import avatar from '../../../assets/images/pages/login/Livraison6.png';

const Authenticate = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserDetails(decodedToken);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/Authenticate', { username, password });
      const { token, role, nameTiers, nameusers } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', nameTiers || nameusers);

      const decodedToken = jwtDecode(token);
      setUserDetails(decodedToken);

      switch (role) {
        case 'admin':
          navigate('/dashboard');
          break;
        case 'livreur':
          navigate('/admin/list_order');
          break;
        case 'client':
          navigate('/admin/list_order');
          break;
        case 'fournisseur':
          navigate('/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Login failed. Please check your username and password.');
      }
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={3}>
            <img src={avatar} style={{ width: '280px', height: '330px', marginLeft: '0px' }} />
          </CCol>
          <CCol md={6}>
            <CCardGroup>
              {/* Adjusted width of the login card */}
              <CCard className="p-4" style={{ width: '100%' }}>
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Se connecter</h1>
                    <p className="text-body-secondary">Connectez-vous à votre compte</p>
                    {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Nom d'utilisateur"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Mot de passe"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      {/* Adjusted width for login button and forgot password link to be on the same row */}
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="w-100">
                          Se connecter
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="d-flex justify-content-end">
                        <Link to="/request_reset_password">
                          <CButton color="link" className="px-0">
                            Mot de passe oublié?
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>S'inscrire</h2>
                    <p>Bienvenue sur notre plateforme GoLivraison.</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Créer un compte?
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

export default Authenticate;
