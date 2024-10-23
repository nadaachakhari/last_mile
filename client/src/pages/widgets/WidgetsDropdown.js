import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions,cilUser ,cilTruck   } from '@coreui/icons'
import { FiShoppingCart ,FiPackage } from 'react-icons/fi'; 
import axios from 'axios'; 

const WidgetsDropdown = (props) => {
  const [articleCount, setArticleCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0); 
  const [totalCommands, setTotalCommands] = useState(0);
  const [deliveryOrderCount, setDeliveryOrderCount] = useState(0); 
  const widgetChartRef1 = useRef();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('')
  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    setUserRole(role)
  
    if (!token) {
      console.error('Token non trouvé dans localStorage.')
      return
    }
    const fetchData = async () => {
      try {
        const [supplierRes, commandsRes, clientRes, articleRes, deliveryOrdersRes] = await Promise.all([
          axios.get('http://localhost:5001/Dashboard/count-Suppliers', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5001/Dashboard/total-commands', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5001/Dashboard/count-clients', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5001/Dashboard/count-articles', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5001/Dashboard/count-orders-delivery', { headers: { Authorization: `Bearer ${token}` } })
        ]);
  
        setSupplierCount(supplierRes.data.supplierCount || 0);
        setTotalCommands(commandsRes.data.totalCommands || 0);
        setClientCount(clientRes.data.clientCount || 0);
        setArticleCount(articleRes.data.ArticleCount || 0);
        
        // Correction ici pour attribuer orderCount à deliveryOrderCount
        setDeliveryOrderCount(deliveryOrdersRes.data.orderCount || 0); 
  
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  
  const widgetChartRef2 = useRef(null)


  if (loading) {
    return <p>Chargement...</p>;
  }
  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
       {userRole === 'Administrateur' && (
       <CCol sm={6} xl={4} xxl={3}>
      <CWidgetStatsA
        style={{ height: '164px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} // Ajout de coins arrondis et d'une ombre
        color="primary"
        value={
          <>
            <span className="fs-3 fw-bold">{supplierCount}</span>{' '} {/* Taille de la valeur ajustée */}
            <span className="fs-6 fw-normal">
            Fournisseurs
            </span>
          </>
        }
        title={<span className="text-light">Nombre de Fournisseurs</span>} // Titre plus clair
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
            {/* Ajout d'une icône avec un style subtile et taille ajustée */}
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
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
