import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useAuth } from '../../../Middleware/Use_Auth'; 
const EditArticle = () => {
  const { id } = useParams(); 
  const [formData, setFormData] = useState({

    name: '',
    vatID: '',
    sale_ht: '',
    sale_ttc: '',
    categoryID: '',
    photo: '',
    bar_code: '',
    deleted: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [vats, setVats] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { role } = useAuth(); 
  useEffect(() => {
    if (!role) {
      return;
    }

    console.log('User role:', role);

    if (role !== 'fournisseur') {
      navigate('/unauthorized');
    }
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/Article/${id}`);
        const article = response.data;
        setFormData({
          code: article.code,
          name: article.name,
          vatID: article.vatID,
          sale_ht: article.sale_ht,
          sale_ttc: article.sale_ttc,
          categoryID: article.categoryID,
          photo: article.photo,
          bar_code: article.bar_code,
          deleted: article.deleted,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
      }
    };

    const fetchVatsAndCategories = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token non trouvé dans localStorage.');
        return;
      }
      try {
        const [vatsResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:5001/Vat', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          axios.get('http://localhost:5001/Category', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
        ]);
        setVats(vatsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des TVA et des catégories:', error);
      }
    };

    fetchArticle();
    fetchVatsAndCategories();
  }, [id,role,navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleVatChange = (e) => {
    const vatID = e.target.value;
    const selectedVat = vats.find(vat => vat.id === parseInt(vatID));
    const sale_ttc = formData.sale_ht ? formData.sale_ht * (1 + selectedVat.value / 100) : '';

    setFormData({
      ...formData,
      vatID,
      sale_ttc,
    });
  };

  const handleSaleHtChange = (e) => {
    const sale_ht = e.target.value;
    const selectedVat = vats.find(vat => vat.id === parseInt(formData.vatID));
    const sale_ttc = selectedVat ? sale_ht * (1 + selectedVat.value / 100) : '';

    setFormData({
      ...formData,
      sale_ht,
      sale_ttc,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('code', formData.code);
    data.append('name', formData.name);
    data.append('vatID', formData.vatID);
    data.append('sale_ht', formData.sale_ht);
    data.append('sale_ttc', formData.sale_ttc);
    data.append('categoryID', formData.categoryID);
    data.append('bar_code', formData.bar_code);
    data.append('deleted', formData.deleted);
    if (imageFile) {
      data.append('photo', imageFile);
    }

    try {
      const response = await axios.put(`http://localhost:5001/Article/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Réponse serveur:', response.data);
      navigate('/list_article');
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
               {role === 'fournisseur' && ( 
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Modifier</strong> <small>Article</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3" onSubmit={handleSubmit}>
             
              <CCol md={6}>
                <CFormLabel htmlFor="name">Nom</CFormLabel>
                <CFormInput id="name" value={formData.name} onChange={handleChange} required />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="vatID">TVA</CFormLabel>
                <CFormSelect id="vatID" value={formData.vatID} onChange={handleVatChange} required>
                  <option value="">Choisir...</option>
                  {vats.map((vat) => (
                    <option key={vat.id} value={vat.id}>
                      {vat.value}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2} className="align-self-end" >
              <Link to={`/admin/add_category`}>
                  <CButton color="primary">
                    Ajouter TVA
                  </CButton>
                </Link>
                </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="sale_ht">Prix HT</CFormLabel>
                <CFormInput type="number" step="0.01" id="sale_ht" value={formData.sale_ht} onChange={handleSaleHtChange} required />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="sale_ttc">Prix TTC</CFormLabel>
                <CFormInput type="number" step="0.01" id="sale_ttc" value={formData.sale_ttc} readOnly />
              </CCol>
              <CCol md={4}>
                <CFormLabel htmlFor="categoryID">Catégorie</CFormLabel>
                <CFormSelect id="categoryID" value={formData.categoryID} onChange={handleChange} required>
                  <option value="">Choisir...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3} className="align-self-end">
                <Link to={`/admin/add_category`}>
                  <CButton color="primary">
                    Ajouter Catégorie
                  </CButton>
                </Link>
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="bar_code">Code Barre</CFormLabel>
                <CFormInput id="bar_code" value={formData.bar_code} onChange={handleChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="photo">Photo</CFormLabel>
                <CFormInput type="file" id="photo" onChange={handleImageChange} />
                {formData.photo && (
                  <div className="mt-2">
                    <img src={`http://localhost:5001/uploads/${formData.photo}`} alt="Article" width="100" />
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
               )}
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

export default EditArticle;
