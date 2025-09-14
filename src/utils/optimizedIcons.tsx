import React from 'react';
import { IconComponent } from '../../types';
import { base64Images, getOptimizedImage, preloadCriticalImages } from './imageBase64';

// Cargar imágenes críticas al importar este módulo
preloadCriticalImages();

// Utilidad para crear iconos optimizados basados en imágenes
const makeOptimizedImgIcon = (imageName: keyof typeof base64Images, fallbackPath: string, alt: string): React.FC<{ className?: string }> =>
  ({ className }) => {
    const src = getOptimizedImage(imageName, fallbackPath);
    
    return (
      <span className={`relative ${className || ''} inline-flex items-center justify-center`}>
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-contain object-center select-none pointer-events-none" 
          draggable={false} 
          onContextMenu={(e) => e.preventDefault()} 
        />
      </span>
    );
  };

// Utilidad para iconos con fallback automático de extensión (mantenemos para compatibilidad)
const makeImgIconFallback = (basename: string, alt: string): React.FC<{ className?: string }> =>
  ({ className }) => {
    const exts = [
      '.png', '.webp', '.jpg', '.jpeg', '.svg', '.gif', '.avif',
      '.PNG', '.WEBP', '.JPG', '.JPEG', '.SVG', '.GIF', '.AVIF'
    ];
    const [extIndex, setExtIndex] = React.useState(0);
    const src = `${basename}${exts[extIndex]}`;
    return (
      <span className={`relative ${className || ''} inline-flex items-center justify-center`}>
        <img 
          src={src} 
          alt={alt} 
          onError={() => setExtIndex(i => Math.min(i + 1, exts.length - 1))} 
          className="w-full h-full object-contain object-center select-none pointer-events-none" 
          draggable={false} 
          onContextMenu={(e) => e.preventDefault()} 
        />
      </span>
    );
  };

// Iconos optimizados con base64 cuando es posible
export const OptimizedIcons = {
  // Iconos principales optimizados
  logoApp: makeOptimizedImgIcon('logoApp', '/images/logo-app.png', 'Logo de la aplicación'),
  emojiHueso: makeOptimizedImgIcon('emojiHueso', '/images/Emoji hueso png.png', 'Huesitos'),
  
  // Iconos de comodines (algunos usan base64 si son pequeños, otros usan preload)
  lifeline_fifty_fifty: makeImgIconFallback('/images/Descarte', '50/50'),
  lifeline_quick_review: makeImgIconFallback('/images/Pista', 'Pista'),
  lifeline_second_chance: makeImgIconFallback('/images/Revivir', 'Revivir'),
  lifeline_adrenaline: makeImgIconFallback('/images/Adrenalina', 'Adrenalina'),
  lifeline_skip: makeImgIconFallback('/images/Saltar', 'Saltar'),
  lifeline_double: makeImgIconFallback('/images/Duplicar', 'Duplica'),
  lifeline_immunity: makeImgIconFallback('/images/Inmunidad', 'Inmunidad'),
  
  // Iconos de interfaz principal
  heart_img: makeImgIconFallback('/images/Heart', 'Vidas'),
  bones: makeImgIconFallback('/images/huesitos', 'Huesitos'),
  store_img: makeImgIconFallback('/images/Tienda', 'Tienda'),
  
  // Iconos para logros y otros elementos
  llama: makeImgIconFallback('/images/emoji llama', 'Llama'),
  graduation_hat: makeImgIconFallback('/images/png emoji sombrero de graduacion', 'Sombrero de graduación'),
  archery: makeImgIconFallback('/images/Png Emoji tiro al arco', 'Tiro al arco'),
  money_bag: makeImgIconFallback('/images/Png bolsa dinero', 'Bolsa de dinero'),
  daily_gift: makeImgIconFallback('/images/Png regalo del día', 'Regalo del día'),
};

// Función para obtener un icono optimizado
export function getOptimizedIcon(iconName: keyof typeof OptimizedIcons): React.FC<{ className?: string }> {
  return OptimizedIcons[iconName];
}

// Hook para precargar imágenes críticas
export function useImagePreloader() {
  React.useEffect(() => {
    // Las imágenes críticas ya se precargan al importar el módulo
    // Pero podemos agregar más lógica aquí si es necesario
    console.log('🖼️ Imágenes optimizadas cargadas');
  }, []);
}

// Componente optimizado para mostrar el logo principal
export const OptimizedLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  return (
    <div className={className} style={style}>
      <img 
        src={base64Images.logoApp} 
        alt="Logo de la aplicación"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

// Componente optimizado para mostrar huesitos (moneda)
export const OptimizedBones: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  const BonesComponent = OptimizedIcons.emojiHueso;
  return (
    <div className={className} style={style}>
      <BonesComponent className="w-full h-full" />
    </div>
  );
};
