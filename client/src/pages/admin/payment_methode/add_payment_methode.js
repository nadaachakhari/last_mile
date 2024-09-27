import React, { useState,useEffect  } from 'react';
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
} from '@coreui/react';
import { useAuth } from '../../../Middleware/Use_Auth'
const AddPaymentMethod = () => {
    const [formData, setFormData] = useState({
        value: '',
        deleted: 'false',
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
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
    },  [role, navigate])
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token non trouvé dans localStorage.');
          return;
        }
        try {
            const response = await axios.post('http://localhost:5001/PaymentMethode/', formData,{
                headers: {
                
               Authorization: `Bearer ${token}`,
             
           
           },
         });
            console.log('Réponse serveur:', response.data);
            navigate('/admin/list_payment_methode');
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
                        <strong>Ajouter</strong> <small>méthode de paiement</small>
                    </CCardHeader>
                    <CCardBody>
                        <CForm className="row g-3" onSubmit={handleSubmit}>
                            <CCol md={6}>
                                <CFormLabel htmlFor="value">Nom de la méthode de paiement</CFormLabel>
                                <CFormInput id="value" value={formData.value} onChange={handleChange} />
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

export default AddPaymentMethod;
