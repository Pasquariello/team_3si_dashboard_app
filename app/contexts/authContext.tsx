import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    // init for auth outside react tree
    setToken(storedToken);
  }, []);

  const setToken = (newToken: string | null) => {
    const tokenValue = newToken ?? '';
    setTokenState(tokenValue);
    localStorage.setItem('auth_token', tokenValue);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
