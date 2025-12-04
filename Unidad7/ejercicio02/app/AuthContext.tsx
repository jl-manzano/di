// AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';

// Definir la estructura del contexto
const AuthContext = createContext({
  isLoggedIn: false,
  userName: null as string | null,
  loginUser: (name: string) => {},
  logoutUser: () => {}
});

// Proveedor del contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const loginUser = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto
export const useAuth = () => useContext(AuthContext);
