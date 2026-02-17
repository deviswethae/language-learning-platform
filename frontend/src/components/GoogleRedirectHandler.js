import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const user = params.get('user'); // Assume backend returns JSON stringified

    if (token && user) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', user);

      const redirectPath = localStorage.getItem('preAuthPath') || '/';
      localStorage.removeItem('preAuthPath');

      navigate(redirectPath, { replace: true });
    } else {
      navigate('/login'); // fallback
    }
  }, [navigate]);

  return null;
};

export default GoogleRedirectHandler;
