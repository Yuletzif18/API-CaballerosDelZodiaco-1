import React, { createContext, useContext, useState } from 'react';

export const CaballeroContext = createContext({
  caballero: null,
  setCaballero: (cab: any) => {},
});

export const useCaballero = () => useContext(CaballeroContext);

export const CaballeroProvider = ({ children }: { children: React.ReactNode }) => {
  const [caballero, setCaballero] = useState(null);
  return (
    <CaballeroContext.Provider value={{ caballero, setCaballero }}>
      {children}
    </CaballeroContext.Provider>
  );
};
