import React, { createContext, useContext, useState } from 'react';

interface ImagenState {
  imagen: string | null;
  setImagen: (img: string | null) => void;
}

const ImagenContext = createContext<ImagenState>({ imagen: null, setImagen: () => {} });

export const useImagen = () => useContext(ImagenContext);

export const ImagenProvider = ({ children }: { children: React.ReactNode }) => {
  const [imagen, setImagen] = useState<string | null>(null);
  return (
    <ImagenContext.Provider value={{ imagen, setImagen }}>
      {children}
    </ImagenContext.Provider>
  );
};
