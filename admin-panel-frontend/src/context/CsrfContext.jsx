import { createContext, useContext, useEffect } from 'react';
import { fetchCsrfToken } from '../utils/csrf';

const CsrfContext = createContext();

export function CsrfProvider({ children }) {
  useEffect(() => {
    // Fetch token when app loads
    fetchCsrfToken();

    // Refresh token periodically
    const interval = setInterval(() => {
      fetchCsrfToken();
    }, 25 * 60 * 1000); // Refresh every 25 minutes

    return () => clearInterval(interval);
  }, []);

  return <CsrfContext.Provider value={null}>{children}</CsrfContext.Provider>;
}