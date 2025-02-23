import { createContext, useContext, useState } from 'react';

const AdminProfileContext = createContext();

export function AdminProfileProvider({ children }) {
  const [adminProfile, setAdminProfile] = useState(null);

  const updateProfile = (userData) => {
    setAdminProfile(userData);
  };

  const clearProfile = () => {
    setAdminProfile(null);
  };

  return (
    <AdminProfileContext.Provider value={{ adminProfile, updateProfile, clearProfile }}>
      {children}
    </AdminProfileContext.Provider>
  );
}

export const useAdminProfile = () => {
  const context = useContext(AdminProfileContext);
  if (!context) {
    throw new Error('useAdminProfile must be used within an AdminProfileProvider');
  }
  return context;
};