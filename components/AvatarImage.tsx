import React from 'react';
import { imageAvatars } from '../src/avatarLoader';

interface AvatarImageProps {
  avatarId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AvatarImage: React.FC<AvatarImageProps> = ({ avatarId, size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  // Extraer el nombre del archivo si es una ruta
  let cleanId = avatarId;
  if (avatarId.includes('/') || avatarId.includes('%20')) {
    // Es una ruta, extraer el nombre del archivo
    const parts = avatarId.split('/');
    const filename = parts[parts.length - 1];
    // Remover extensión y decodificar URL
    cleanId = decodeURIComponent(filename.replace(/\.(png|jpg|jpeg|webp|svg)$/i, ''));
    console.log('Avatar path detected:', avatarId, '-> cleanId:', cleanId);
  }

  // Buscar el avatar en imageAvatars por ID o por nombre
  let avatarData = imageAvatars.find(a => a.id === cleanId || a.id === avatarId);
  
  // Si no se encuentra, buscar por similitud de nombre
  if (!avatarData) {
    avatarData = imageAvatars.find(a => 
      a.id.toLowerCase().includes(cleanId.toLowerCase()) ||
      cleanId.toLowerCase().includes(a.id.toLowerCase())
    );
  }

  // Debug: mostrar si no se encontró
  if (!avatarData && (avatarId.includes('/') || avatarId.includes('%20'))) {
    console.log('Avatar not found for:', cleanId);
    console.log('Available avatars:', imageAvatars.map(a => a.id));
  }

  if (avatarData?.url) {
    // Mostrar imagen
    return (
      <img
        src={avatarData.url}
        alt={avatarData.name}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-neutral-600 shadow-lg ${className}`}
      />
    );
  }

  // Fallback: mostrar como emoji si no se encuentra la imagen
  // Si el avatarId es un emoji, mostrarlo directamente
  const isEmoji = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u.test(avatarId);
  
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 border-2 border-neutral-600 shadow-lg flex items-center justify-center ${className}`}
    >
      <span className={isEmoji ? 'text-2xl' : 'text-xs text-neutral-400'}>
        {isEmoji ? avatarId : (cleanId.slice(0, 2).toUpperCase() || '👤')}
      </span>
    </div>
  );
};

export default AvatarImage;

