import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeSharp } from 'react-icons/io5';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../../Middleware/Use_Auth';
const ListVat = () => {
  const [vats, setVats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vatToDelete, setVatToDelete] = useState(null);
  const navigate = useNavigate();
  const { role } = useAuth(); 
  useEffect(() => {
    if (!role) {
      return; // N'exécutez rien tant que le rôle n'est pas récupéré
    }

    console.log('User role:', role);

    if (role !== 'fournisseur') {
      navigate('/unauthorized');
    }
    const fetchVats = async () => {
        const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token non trouvé dans localStorage.');
        return;
      }
      try {
        const response = await axios.get('http://localhost:5001/vat', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setVats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des TVA:', error);
        setModalMessage('Erreur lors de la récupération des TVA.');
        setShowModal(true);
      }
    };

    fetchVats();
  }, [role,navigate]);

  const handleDelete = async () => {
    try {
      await axios.put(`http://localhost:5001/vat/update_deleted/${vatToDelete}`);
      setVats(vats.filter(vat => vat.id !== vatToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la TVA avec l'ID ${vatToDelete}:`, error);
      setModalMessage('Erreur lors de la suppression de la TVA.');
      setShowModal(true);
      setShowDeleteModal(false);
    }
  };

  const confirmDelete = (id) => {
    setVatToDelete(id);
    setShowDeleteModal(true);
  };

  const handleModifier = (id) => {
    navigate(`/admin/edit_vat/${id}`);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Liste des TVA</strong>
          </CCardHeader>
          <CCardBody>
            <Link to={`/admin/add_vat`}>
              <CButton color="primary" className="mb-3">
                Ajouter TVA
              </CButton>
            </Link>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Valeur</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {vats.map((vat, index) => (
                  <CTableRow key={vat.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{vat.value}%</CTableDataCell>
                    <CTableDataCell>
                      <Link to={`/admin/detail_vat/${vat.id}`}>
                        <CButton size="md" color="info" className="me-2">
                          <IoEyeSharp className="icon-white icon-lg me-7" />
                        </CButton>
                      </Link>
                      <Link to={`/admin/edit_vat/${vat.id}`}>
                        <CButton
                          size="md"
                          color="warning"
                          onClick={() => handleModifier(vat.id)}
                          className="me-2"
                        >
                          <FaEdit className="icon-white icon-lg me-7" />
                        </CButton>
                      </Link>
                      <CButton
                        size="md"
                        color="danger"
                        onClick={() => confirmDelete(vat.id)}
                        className="me-2"
                      >
                        <FaTrash className="icon-white icon-lg me-7" />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>Erreur</CModalTitle>
        </CModalHeader>
        <CModalBody>{modalMessage}</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Fermer</CButton>
        </CModalFooter>
      </CModal>
      <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>Êtes-vous sûr de vouloir supprimer cette TVA ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</CButton>
          <CButton color="danger" onClick={handleDelete}>Supprimer</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
};

export default ListVat;
