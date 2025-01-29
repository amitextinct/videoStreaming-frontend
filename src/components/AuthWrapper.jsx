import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isUserLoggedIn } from '../services/Services';

function AuthWrapper({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const status = await isUserLoggedIn();
      setIsAuthenticated(status);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children[0] : children[1];
}

AuthWrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default AuthWrapper;
