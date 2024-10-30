import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  CRow,
  CCol,
  CCard ,
  CCardBody,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions, cilUser, cilTruck, cilWarning, cilBriefcase } from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTruck, faTimesCircle, faClock, faBell, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { faBox } from '@fortawesome/free-solid-svg-icons';

import { FiShoppingCart ,FiPackage } from 'react-icons/fi'; 
import axios from 'axios'; 

const WidgetsDropdown = (props) => {
  const [articleCount, setArticleCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0); 
  const [adminCount, setadminCount] = useState(0); 
  const [totalCommands, setTotalCommands] = useState(0);
  const [deliveryOrderCount, setDeliveryOrderCount] = useState(0); 
  const [claimCount, setClaimCount] = useState(0);
  const [orderStates, setOrderStates] = useState([0]);


  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('')
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setUserRole(role);
    
    console.log('Rôle de l\'utilisateur:', role); 
  
    if (!token) {
      console.error('Token non trouvé dans localStorage.');
      return;
    }
    
    const fetchData = async () => {
      try {
        const [
          supplierRes,
          adminRes,
          commandsRes,
          clientRes,
          articleRes,
          deliveryOrdersRes,
          claimRes,
          orderCountsRes,
        ] = await Promise.all([
          axios.get('http://localhost:5001/Dashboard/count-Suppliers'),
          axios.get('http://localhost:5001/Dashboard/count-admin'),
          axios.get('http://localhost:5001/Dashboard/total-commands', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5001/Dashboard/count-clients', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5001/Dashboard/count-articles', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5001/Dashboard/count-orders-delivery', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5001/Dashboard/countClaims'),
          axios.get('http://localhost:5001/Dashboard/countOrdersByState'),
        ]);

        setSupplierCount(supplierRes.data.supplierCount || 0);
        setadminCount(adminRes.data.adminCount || 0);
        setTotalCommands(commandsRes.data.totalCommands || 0);
        setClientCount(clientRes.data.clientCount || 0);
        setArticleCount(articleRes.data.ArticleCount || 0);
        setDeliveryOrderCount(deliveryOrdersRes.data.orderCount || 0);
        setClaimCount(claimRes.data.totalClaims || 0);
        setOrderStates(orderCountsRes.data || [] );
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }
  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      
       {userRole === 'Administrateur' && (
       <CCol sm={6} xl={4} xxl={3}>
      <CWidgetStatsA
        style={{ height: '164px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        color="primary"
        value={
          <>
            <span className="fs-3 fw-bold">{supplierCount}</span>{' '} 
            <span className="fs-6 fw-normal">
            Fournisseurs
            </span>
          </>
        }
        action={
          <div className="position-absolute top-0 end-0 p-3">
           <CDropdown alignment="end">
           <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
            <CIcon icon={cilOptions} className="text-light" style={{ cursor: 'pointer' }} />
            </CDropdownToggle>
            <CDropdownMenu>
              <Link to="/admin/list_fournisseur" >
                <CDropdownItem>Afficher fournisseur</CDropdownItem>
                </Link>
              </CDropdownMenu>
            </CDropdown>
          </div>
        }
        chart={
          <div className="position-absolute top-50 end-0 translate-middle-y p-3">
            <CIcon icon={cilUser} size="3xl" className="opacity-75 text-white" />
          </div>
        }
      />
    </CCol>
          )}
                 {userRole === 'Administrateur' && (
       <CCol sm={6} xl={4} xxl={3}>
      <CWidgetStatsA
        style={{ height: '164px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        color="primary"
        value={
          <>
            <span className="fs-3 fw-bold">{adminCount}</span>{' '} 
            <span className="fs-6 fw-normal">
            Administrateur
            </span>
          </>
        }
        action={
          <div className="position-absolute top-0 end-0 p-3">
           <CDropdown alignment="end">
           <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
            <CIcon icon={cilOptions} className="text-light" style={{ cursor: 'pointer' }} />
            </CDropdownToggle>
            <CDropdownMenu>
              <Link to="/admin/list_fournisseur" >
                <CDropdownItem>Afficher Administrateur</CDropdownItem>
                </Link>
              </CDropdownMenu>
            </CDropdown>
          </div>
        }
        chart={
          <div className="position-absolute top-50 end-0 translate-middle-y p-3">
            <CIcon icon={cilUser} size="3xl" className="opacity-75 text-white" />
          </div>
        }
      />
    </CCol>
          )}
              {userRole === 'fournisseur' && (
    <CCol sm={6} xl={4} xxl={3}>
      <CWidgetStatsA
       style={{ height: '164px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        color="info"
        value={
          <>
            {clientCount}{' '}
            <span className="fs-6 fw-normal">
              Clients
            </span>
          </>
        }
        title="Nombre de Clients"
        action={
          <div className="position-absolute top-0 end-0 p-3">
           <CDropdown alignment="end">
           <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
            <CIcon icon={cilOptions} className="text-light" style={{ cursor: 'pointer' }} />
            </CDropdownToggle>
            <CDropdownMenu>
              <Link to="/admin/list_client" >
                <CDropdownItem>Afficher Clients</CDropdownItem>
                </Link>
              </CDropdownMenu>
            </CDropdown>
          </div>
        }
        chart={
          <div className="position-absolute top-50 end-0 translate-middle-y p-3">
            <CIcon icon={cilUser} size="3xl" className="opacity-75 text-white" />
          </div>
        }
      />
    </CCol>
    )}
 {userRole === 'fournisseur' && (
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
           style={{ height: '164px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          color="success"
          value={
            <>
            
              {articleCount} {' '} 
              <span className="fs-6 fw-normal">Articles</span>
            </>
          }
          title="Nombre d'Articles"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
              <Link to="/admin/list_article" >
                <CDropdownItem>Afficher Articles</CDropdownItem>
                </Link>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <div className="position-absolute top-50 end-0 translate-middle-y p-3">
          
              <FiPackage size={70} style={{ marginRight: '8px' }} className="opacity-75 text-white" /> 
            </div>
          }
        />
      </CCol>
    )}

{userRole === 'fournisseur' && (
        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
             style={{ height: '164px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            color="warning"
            value={
              <>
                {totalCommands}{' '}
                <span className="fs-6 fw-normal">Commandes Reçues</span>
              </>
            }
            title="Total Commandes Reçues"
            chart={
              <div className="position-absolute top-50 end-0 translate-middle-y p-3">
            
                <FiShoppingCart size={70} style={{ marginRight: '8px' }} className="opacity-75 text-white" /> 
              </div>
            }
          />
        </CCol>
      )}
         {userRole === 'livreur' && (
        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            style={{ height: '164px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} // Rounded corners and shadow
            color="warning"
            value={
              <>
                <span className="fs-3 fw-bold">{deliveryOrderCount}</span>{' '} 
                <span className="fs-6 fw-normal">Commandes Livrées</span>
              </>
            }
            title={<span className="text-light">Nombre de Commandes Livrées</span>} 
            action={
              <div className="position-absolute top-0 end-0 p-3">
                <CDropdown alignment="end">
                  <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                    <CIcon icon={cilOptions} className="text-light" style={{ cursor: 'pointer' }} />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <Link to="/livreur/list_orders">
                      <CDropdownItem>Afficher les commandes</CDropdownItem>
                    </Link>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            }
            chart={
              <div className="position-absolute top-50 end-0 translate-middle-y p-3">
                <CIcon icon={cilTruck} size="3xl" className="opacity-75 text-white" /> {/* Delivery truck icon */}
              </div>
            }
          />
        </CCol>
      )}
  {userRole === 'Administrateur' && (
        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            style={{ height: '164px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            color="danger"
            value={
              <>
                <h2></h2>
                <span className="fs-3 fw-bold">{claimCount}</span>{' '}
                <span className="fs-6 fw-normal">Réclamations</span>
              </>
            }
            title={<span className="text-light">Nombre de Réclamations</span>}
            action={
              <div className="position-absolute top-0 end-0 p-3">
                <CDropdown alignment="end">
                  <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                    <CIcon icon={cilOptions} className="text-light" style={{ cursor: 'pointer' }} />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <Link to="/admin/list_claim">
                      <CDropdownItem>Afficher Réclamations</CDropdownItem>
                    </Link>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            }
            chart={
              <div className="position-absolute top-50 end-0 translate-middle-y p-3">
                <CIcon icon={cilWarning} size="3xl" className="opacity-75 text-white" />
              </div>
            }
          />
        </CCol>
      )}
     {userRole === 'Administrateur' && (    
     <CRow className={props.className} xs={{ gutter: 4 }}>
  <CRow>
    <CCol sm={5}>
      <h4 id="traffic" className="card-title mb-0">Nombre des colis par état</h4>
    </CCol>
  </CRow>

  {orderStates.map((state, index) => {
  
    let icon = faBox; 
    let boxColor = 'primary'; 
    if (state.state.value === 'Livraison effectuée') {
      icon = faCheckCircle; 
      boxColor = 'success'; 
    } else if (state.state.value === 'en cours de livraison') {
      icon = faTruck; 
      boxColor = 'warning'; 
    } else if (state.state.value === 'Commande annulée') {
      icon = faTimesCircle; 
      boxColor = 'danger'; 
    } else if (state.state.value === 'En attente de livraison') {
      icon = faClock; 
      boxColor = 'info'; 
    } else if (state.state.value === 'Livraison imminente') {
      icon = faBell; 
      boxColor = 'primary';
    } else if (state.state.value === 'Adresse changée') {
      icon = faMapMarkerAlt; 
      boxColor = 'dark'; 
    }

    return (
      <CCol sm={6} xl={4} xxl={3} key={index}>
        <CWidgetStatsA
          style={{ height: '164px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          color={boxColor} 
          value={
            <>
              <span className="fs-3 fw-bold">{state.count !== undefined ? state.count : "0"}</span>{' '}
              <span className="fs-6 fw-normal">Commandes</span>
            </>
          }
          title={<span className="text-light">{state.state.value}</span>} // Display state value
          action={
            <div className="position-absolute top-0 end-0 p-3">
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} className="text-light" style={{ cursor: 'pointer' }} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Voir Détails</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </div>
          }
          chart={
            <div className="position-absolute top-50 end-0 translate-middle-y p-3">
              <FontAwesomeIcon icon={icon} size="3x" className="opacity-75 text-white" />
            </div>
          }
        />
      </CCol>
    );
  })}

</CRow>
)}

    </CRow>   
  )
}
WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}
export default WidgetsDropdown
