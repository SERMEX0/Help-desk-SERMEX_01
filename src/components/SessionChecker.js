import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (!token || !user) {
      navigate('/login');
    }
  }, [navigate]);

  return null;
};

export default SessionChecker;