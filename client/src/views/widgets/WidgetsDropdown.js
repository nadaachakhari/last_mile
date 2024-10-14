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
import { cilArrowBottom, cilArrowTop, cilOptions,cilUser  } from '@coreui/icons'
import axios from 'axios'; // Utiliser axios ou fetch pour appeler l'API

const WidgetsDropdown = (props) => {
  const [articleCount, setArticleCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0); 
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
    // Appeler l'API pour obtenir le nombre de fournisseurs
    const fetchSupplierCount = async () => {
      try {
        const response = await axios.get('http://localhost:5001/Dashboard/count-Suppliers'); 
        setSupplierCount(response.data.supplierCount);
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de fournisseurs:', error);
      }
    };
     // Fonction pour récupérer le nombre de clients
     const fetchClientCount = async () => {
      try {
        const response = await fetch('http://localhost:5001/Dashboard/count-clients', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assurez-vous d'envoyer le token JWT
          },
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des clients');
        }
        
        const data = await response.json();
        setClientCount(data.clientCount);
        setLoading(false);
      } catch (error) {
        console.error('Erreur :', error);
        setLoading(false);
      }
    };
    const fetchArticleCount = async () => {
      try {
        const response = await fetch('http://localhost:5001/Dashboard/count-articles', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
    
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des articles');
        }
    
        const data = await response.json();
        console.log('Article count data:', data); // Pour vérifier la réponse
        // Assurez-vous d'utiliser la bonne clé pour accéder au nombre d'articles
        setArticleCount(data.ArticleCount || 0);
        setLoading(false);
      } catch (error) {
        console.error('Erreur :', error);
        setLoading(false);
      }
    };
    
    
    
    fetchClientCount();
 
    fetchSupplierCount();
    fetchArticleCount ();
  }, []);
  
  const widgetChartRef2 = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])
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
          color="warning"
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
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Articles',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
    )}
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              44K{' '}
              <span className="fs-6 fw-normal">
                (-23.6% <CIcon icon={cilArrowBottom} />)
              </span>
            </>
          }
          title="Sessions"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                  'January',
                  'February',
                  'March',
                  'April',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
