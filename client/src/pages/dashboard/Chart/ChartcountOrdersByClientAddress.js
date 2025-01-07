import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios';
const ChartcountOrdersByClientAddress = () => {
    
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState('');
    const token = localStorage.getItem('token');
  
   
    const fetchOrdersByClientAddress = async () => {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:5001/Dashboard/countOrdersByClientAddress');
          console.log('API Response:', response.data); // Debugging API response
          const formattedData = response.data.ordersByAddress?.map((item) => ({
            clientAddress: item.clientAddress || 'Adresse inconnue',
            orderCount: item.orderCount || 0,
          })) || [];
          setOrdersData(formattedData);
        } catch (error) {
          setError('Erreur lors de la récupération des données');
          console.error('Erreur:', error);
        } finally {
          setLoading(false);
        }
      };
      
    
  
    useEffect(() => {
   
        const role = localStorage.getItem('role');
        setUserRole(role);
     
       fetchOrdersByClientAddress();
    }, []); // Effectue la requête à chaque changement du token
  
    return (
      <>

        {userRole === 'Administrateur' && (
        <CCard className="mb-4">
        <CCardBody>
       
      <div style={{ padding: '20px' }}>
        <h3>Nombre de commandes par Address</h3>
        {loading ? (
          <p>Chargement des données...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height={400} style={{margin_top: "20px"}}>
            <BarChart data={ordersData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="clientAddress" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orderCount" fill="#8884d8" name="Nombre de commandes" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      </CCardBody>
        </CCard>
        
        )}
        </>
    )
  }
  
  export default ChartcountOrdersByClientAddress