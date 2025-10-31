import React, { createContext, useContext, useState } from 'react';

interface AuthState {
  user: string | null;
  setUser: (user: string | null) => void;
}

const AuthContext = createContext<AuthState>({ user: null, setUser: () => {} });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
