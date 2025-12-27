import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('naturevita-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Create a demo user for testing
      const demoUser = {
        id: 1,
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la Paix, 75001 Paris, France'
      };
      setUser(demoUser);
      localStorage.setItem('naturevita-user', JSON.stringify(demoUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('naturevita-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('naturevita-user');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('naturevita-user', JSON.stringify(updatedUser));
  };

  const deleteAccount = () => {
    // Here you would typically make an API call to delete the user account
    setUser(null);
    localStorage.removeItem('naturevita-user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};