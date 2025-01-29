import { Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { isUserLoggedIn } from '../services/Services';
import PropTypes from 'prop-types';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const status = await isUserLoggedIn();
      setAuthenticated(status);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};


export default ProtectedRoute;
