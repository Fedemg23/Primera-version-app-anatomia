import React, { useEffect, useState } from 'react';
import { preloadCriticalImages } from '../utils/imageBase64';

interface ImagePreloaderProps {
  children: React.ReactNode;
  onPreloadComplete?: () => void;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({ 
  children, 
  onPreloadComplete 
}) => {
  const [isPreloaded, setIsPreloaded] = useState(false);

  useEffect(() => {
    // Precargar imágenes críticas
    preloadCriticalImages();
    
    // Simular un pequeño delay para asegurar que las imágenes se carguen
    const timer = setTimeout(() => {
      setIsPreloaded(true);
      onPreloadComplete?.();
    }, 100); // Muy corto porque las imágenes base64 son instantáneas

    return () => clearTimeout(timer);
  }, [onPreloadComplete]);

  // Renderizar inmediatamente ya que las imágenes base64 no necesitan tiempo de carga
  return <>{children}</>;
};

// Hook personalizado para usar el preloader
export const useImagePreloader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    preloadCriticalImages();
    setIsLoaded(true);
  }, []);

  return isLoaded;
};
