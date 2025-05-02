import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [employer, setEmployer] = useState(null);

  const isLogin = token !== null;

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setEmployer(null);
  };

  return (
    <AuthContext.Provider value={{ isLogin, token, employer, setToken, setEmployer, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
