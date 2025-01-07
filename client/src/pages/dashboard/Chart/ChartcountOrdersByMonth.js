import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { CCard, CCardBody } from '@coreui/react'
const OrdersByMonthChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState('');
  const [dataByDay, setDataByDay] = useState([]);
  const [dataByMonth, setDataByMonth] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    //
        // Fonction pour récupérer les commandes par jour
        const fetchOrdersByDay = async () => {
            try {
              const response = await axios.get('http://localhost:5001/Dashboard/countOrdersByDay', {
                headers: { Authorization: `Bearer ${token}` },
              });
              const { ordersByDay } = response.data;
              const formattedData = ordersByDay.map(order => ({
                day: order.day,
                orderCount: order.orderCount,
              }));
              setDataByDay(formattedData);
            } catch (err) {
              setError(err.message);
            }
          };
    // Récupérer les données depuis l'API
    const fetchOrdersByMonth = async () => {
      try {
        const response = await axios.get('http://localhost:5001/Dashboard/countOrdersByMonth', {
            headers: { Authorization: `Bearer ${token}` },
          });
        const { ordersByMonth } = response.data;

        // Transformer les données pour Recharts
        const formattedData = ordersByMonth.map(order => ({
          month: order.month,
          orderCount: order.orderCount,
        }));

        setDataByMonth(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    setUserRole(role);
    fetchOrdersByMonth();
    fetchOrdersByDay();
  }, []);

  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <>
      {userRole === 'fournisseur' && (
        <>
          <CCard className="mb-4">
            <CCardBody>
              <div style={{ width: '100%', height: 400 }}>
                <h2>Commandes par Mois</h2>
                <ResponsiveContainer>
                  <LineChart data={dataByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orderCount" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CCardBody>
          </CCard>

          <CCard className="mb-4">
            <CCardBody>
              <div style={{ width: '100%', height: 400 }}>
                <h2>Commandes par Jour</h2>
                <ResponsiveContainer>
                  <LineChart data={dataByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="orderCount" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CCardBody>
          </CCard>
        </>
      )}
    </>
  );
};

export default OrdersByMonthChart;
