
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export const useAuth = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken); // Check the content of the decoded token
      setRole(decodedToken.role);
    } else {
      navigate('/authenticate');
    }
  }, [navigate]);

  return { role };
};
