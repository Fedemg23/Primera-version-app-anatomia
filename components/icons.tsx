

import React from 'react';
import { IconComponent } from '../types';

// Utilidad para crear iconos basados en imágenes del directorio public/images
const makeImgIcon = (src: string, alt: string): React.FC<{ className?: string }> =>
  ({ className }) => (
    <div className={`relative ${className || ''} flex items-center justify-center`}>
      <img src={src} alt={alt} className="w-full h-full object-contain" />
    </div>
  );

// Variante con fallback automático de extensión (png → webp → jpg → jpeg → svg)
const makeImgIconFallback = (basename: string, alt: string): React.FC<{ className?: string }> =>
  ({ className }) => {
    const exts = [
      '.png', '.webp', '.jpg', '.jpeg', '.svg', '.gif', '.avif',
      '.PNG', '.WEBP', '.JPG', '.JPEG', '.SVG', '.GIF', '.AVIF'
    ];
    const [extIndex, setExtIndex] = React.useState(0);
    const src = `${basename}${exts[extIndex]}`;
    return (
      <div className={`relative ${className || ''} flex items-center justify-center`}>
        <img src={src} alt={alt} onError={() => setExtIndex(i => Math.min(i + 1, exts.length - 1))} className="w-full h-full object-contain" />
      </div>
    );
  };

export const Heart: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`text-red-500 ${props.className}`} {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
export const HeartCrack: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="m16 13-3.5 3.5-3-3"/><path d="M12.5 8.5 9 5"/></svg>;
export const Send: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
);

// All missing icons are added below
export const BrainCircuit: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5v1.4a4.5 4.5 0 1 0 9 0v-1.4A4.5 4.5 0 0 0 12 2Z" />
    <path d="M12 12.5a4.5 4.5 0 1 1-4.5 4.5" /><path d="M12 2v1.5" /><path d="M18.5 6.5a4.5 4.5 0 1 0-9 0" />
    <path d="M12 12.5a4.5 4.5 0 1 0 4.5 4.5" /><path d="m4.5 12.5 1-1" /><path d="m18.5 11.5 1 1" />
    <path d="M12 21.5V17" /><path d="M9 7.5a2.5 2.5 0 0 1 5 0" /><path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" />
  </svg>
);
export const IconMuscles: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12.3 11.5 2.1 2.1 2.1-2.1" />
      <path d="m9.4 11.5 2.1 2.1 2.1-2.1" />
      <path d="M3.5 10.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2" />
      <path d="M3.5 13.5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2" />
    </svg>
  );
export const IconBones: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 12c0-2.76-2-5-4.5-5S3 9.24 3 12c0 2.76 2 5 4.5 5S12 14.76 12 12zM12 12c0-2.76 2-5 4.5-5s4.5 2.24 4.5 5-2 5-4.5 5-4.5-2.24-4.5-5z"/>
    </svg>
);
export const IconVascular: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 4v18" />
      <path d="M12 4c-4.5 2-8 6-8 10" />
      <path d="M12 4c4.5 2 8 6 8 10" />
    </svg>
);
export const IconCavities: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
      <path d="M12 12c-4.42 0-8-2.69-8-6s3.58-6 8-6 8 2.69 8 6-3.58 6-8 6z" />
    </svg>
);
export const IconIntestine: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 16a4 4 0 100-8 4 4 0 000 8z"/><path d="M12 12h.01"/>
    </svg>
);
export const UserCircle: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662"/>
    </svg>
);
export const Brain: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V12H4.5A2.5 2.5 0 0 1 2 9.5z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5V12h7.5A2.5 2.5 0 0 0 17 9.5z" /><path d="M12 12v9.5A2.5 2.5 0 0 1 9.5 22H4.5A2.5 2.5 0 0 1 2 19.5z" /><path d="M12 12v9.5A2.5 2.5 0 0 0 14.5 22h5A2.5 2.5 0 0 0 22 19.5z" />
    </svg>
);
export const IconInnervation: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2v6" /><path d="m12 16-3 4" /><path d="M12 12h-4" /><path d="m15 21 3-4" /><path d="m9 21 3-4" /><path d="M12 12H8" /><path d="m15 7-3 4-3-4" /><path d="M12 12h4" /><path d="m18 7-3 4" /><path d="m6 7 3 4" />
    </svg>
);
export const IconTopographic: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 8c1.5 2.5 4 4 7 4s5.5-1.5 7-4"/><path d="M3 16c1.5-2.5 4-4 7-4s5.5 1.5 7 4"/><line x1="10" x2="10" y1="4" y2="20"/><line x1="14" x2="14" y1="4" y2="20"/>
    </svg>
);
export const Gift: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C10 2 12 4 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C14 2 12 4 12 7z"/>
    </svg>
);
export const ChevronsUp: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m17 11-5-5-5 5"/><path d="m17 18-5-5-5 5"/>
    </svg>
);
export const Shield: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);
export const Zap: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
);
export const Eraser: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21H7z"/><path d="M22 21H7"/><path d="m5 12 5 5"/>
    </svg>
);
export const Flame: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500" {...props}>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
);
export const CheckCircle: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
    </svg>
);
export const Save: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
);
export const LogOut: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);
export const Settings: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.4l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0 2.4l.15-.09a2 2 0 0 0 .73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);
export const ListCheck: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
       <path d="m16 12 2 2 4-4"/><path d="M10 14H3"/><path d="M10 18H3"/><path d="M10 6H3"/>
    </svg>
);
export const Trophy: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V22"/><path d="M14 14.66V22"/><path d="M17 9v5.66"/><path d="M7 9v5.66"/><path d="M12 9v1.66"/><path d="M12 2v3.34"/><path d="M12 12.33V9"/>
    </svg>
);
export const BookOpen: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
);
export const Store: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M12 7v3"/>
    </svg>
);
export const Award: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 22 12 20 17 22 15.79 13.88"/>
    </svg>
);
export const QuestionMarkCircle: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);
export const Lock: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);
export const StarFilled: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);
export const ChevronRight: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m9 18 6-6-6-6"/>
    </svg>
);
export const PlayCircleIcon: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
);
export const XCircle: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
);
export const Users: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);
export const ChevronDown: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m6 9 6 6 6-6"/>
    </svg>
);
export const CheckSquare: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
);
export const Target: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
);
export const Edit: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);
export const Sun: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
);
export const Moon: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
);
export const Monitor: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
);
export const Star: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);
export const Split: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 3h5v5" />
    <path d="M8 3H3v5" />
    <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
    <path d="M21 3l-7.828 7.828A4 4 0 0 1 12 13.66V22" />
  </svg>
);
export const Lightbulb: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-5.04 11.594C7.366 14.51 8 15.58 8 18h8c0-2.42.634-3.49 1.04-4.406A7 7 0 0 0 12 2Z" />
  </svg>
);
export const Undo2: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a8.5 8.5 0 1 1-4.18 10.63" />
  </svg>
);

export const Pencil: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
);

export const PlusCircle: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);

export const Trash2: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
);

export const Body: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="5" r="3" />
        <path d="M6.5 8.5A5 5 0 0 0 12 14a5 5 0 0 0 5.5-5.5" />
        <path d="M12 14v7" />
        <path d="M9 21h6" />
        <path d="M6 15H4a2 2 0 0 0-2 2v2" />
        <path d="M18 15h2a2 2 0 0 1 2 2v2" />
    </svg>
);
export const ArrowLeft: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
);
export const Swords: IconComponent = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.5 3.5l-12 12" />
        <path d="M14.5 3.5a5 5 0 0 1 7 7" />
        <path d="M9.5 20.5l12-12" />
        <path d="M9.5 20.5a5 5 0 0 1-7-7" />
    </svg>
);

export const Copy: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// Animated icon placeholders (static for now)
export const IconMusclesAnimated = IconMuscles;
export const IconBonesAnimated = IconBones;
export const IconVascularAnimated = IconVascular;
export const IconCavitiesAnimated = IconCavities;
export const IconInnervationAnimated = IconInnervation;
export const IconTopographicAnimated = IconTopographic;

// ---- Shop icons (bold/filled) ----
export const HeartFillPlus: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 21s-7-4.35-9.5-7.5A5.5 5.5 0 0 1 7.5 3c1.9 0 3.4.9 4.5 2.3C13.1 3.9 14.6 3 16.5 3A5.5 5.5 0 0 1 21.5 13.5C19 16.65 12 21 12 21Z"/>
    <path d="M12 8v4M10 10h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ShieldSnow: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
      <path d="M12 7v8"/>
      <path d="M8.5 9l7 4"/>
      <path d="M15.5 9l-7 4"/>
      <path d="M9 13h6"/>
    </g>
  </svg>
);

export const BoltUp: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13 2 4 13h6l-1 9 9-11h-6l1-9z"/>
    <path d="M8 4h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const DoubleOrNothingBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="9" cy="12" r="5"/>
    <circle cx="16" cy="12" r="5" fillOpacity=".6"/>
    <path d="M7 12h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const XpPackBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2"/>
    <path d="M7 12l3-4M10 12l-3-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 8v8M17 8h-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const GiftBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M2 7h20v5H2z"/>
    <path d="M4 12v10h16V12"/>
    <path d="M12 2c-2.5 0-3.5 2-3.5 3.5S10 7 12 7V2zM12 2v5c2 0 3.5-1.5 3.5-3.5S14.5 2 12 2z"/>
    <path d="M12 7v15" fill="none" stroke="white" strokeWidth="2"/>
  </svg>
);

export const EraserBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 15.5 12.6 5.9a3 3 0 0 1 4.2 0l3.3 3.3a3 3 0 0 1 0 4.2L11 22H6L3 19v-3.5z"/>
  </svg>
);

export const FiftyFiftyBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 8h6v2H4zM4 14h6v2H4z"/>
    <path d="M14 7h6M14 12h6M14 17h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const LightbulbBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a7 7 0 0 0-5.04 11.594C7.366 14.51 8 15.58 8 18h8c0-2.42.634-3.49 1.04-4.406A7 7 0 0 0 12 2Z"/>
    <path d="M9 19h6M10 22h4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const UndoBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M9 7 4 12l5 5"/>
    <path d="M4 12h9a6 6 0 1 1 0 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// iconMap
export const iconMap: Record<string, any> = {
    // General
    'IconBones': IconBones,
    'IconMuscles': IconMuscles,
    'IconInnervation': IconInnervation,
    'IconVascular': IconVascular,
    'IconCavities': IconCavities,
    'BrainCircuit': BrainCircuit,
    'Brain': Brain,
    'Heart': Heart,
    'Body': Body,
    'IconIntestine': IconIntestine,
    'IconTopographic': IconTopographic,
    // Imagen de llama para racha/logro (usa el archivo "emoji llama.*" en public/images)
    'llama': makeImgIconFallback('/images/emoji llama', 'Llama'),
    // Sombrero de graduación para logros/avatares (archivo: "png emoji sombrero de graduacion.*")
    'graduation_hat': makeImgIconFallback('/images/png emoji sombrero de graduacion', 'Sombrero de graduación'),
    // Tiro al arco (archivo: "Png Emoji tiro al arco.*")
    'archery': makeImgIconFallback('/images/Png Emoji tiro al arco', 'Tiro al arco'),
    // Tienda (archivo: "Png Emoji tienda.*")
    'store_img': makeImgIconFallback('/images/Png Emoji tienda', 'Tienda'),
    // Bolsa de dinero para logro "Comprador Compulsivo" (archivo: "Png bolsa dinero.*")
    'money_bag': makeImgIconFallback('/images/Png bolsa dinero', 'Bolsa de dinero'),
    // Regalo del Día (archivo: "Png regalo del día.*" con tilde)
    'daily_gift': makeImgIconFallback('/images/Png regalo del día', 'Regalo del día'),
    // Shop (mejorados)
    'buy_one_heart': HeartFillPlus,
    'streak_freeze': ShieldSnow,
    'xp_boost': BoltUp,
    'double_or_nothing': DoubleOrNothingBold,
    'xp_pack': XpPackBold,
    'mystery_box': GiftBold,
    'neural_eraser': EraserBold,
    // Comodines reemplazados por imágenes
    'lifeline_fifty_fifty': makeImgIconFallback('/images/lifeline-5050', '50/50'),
    'lifeline_quick_review': makeImgIconFallback('/images/lifeline-tips', 'Tips'),
    'lifeline_second_chance': makeImgIconFallback('/images/lifeline-second-chance', 'Second Chance'),
    // Huesitos (moneda): usar imagen pública '/images/huesitos.*'
    'bones': makeImgIconFallback('/images/huesitos', 'Huesitos'),
    '🦴': () => <span>🦴</span>,
    'Swords': Swords,
    'ListCheck': ListCheck,
};

// Iconos mejorados para Home
export const HomeIconStudy: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H18a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.8.4L16 16.5l-3.2 1.9a.5.5 0 0 1-.6 0L9 16.5 5 18.9a.5.5 0 0 1-.8-.4V5.5Z"/>
    <path d="M7 6.5h8.5v2H7z" fill="rgba(255,255,255,.6)"/>
  </svg>
);

export const HomeIconExam: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l4 2" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="9" fill="none" stroke="white" strokeOpacity=".12"/>
  </svg>
);

export const HomeIconDuel: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 19l6-6-2-2-6 6v2h2zM21 5l-6 6 2 2 6-6V5h-2z"/>
    <path d="M14 4l6 6M4 14l6 6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const HomeIconProgress: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="6" r="3"/>
    <path d="M7 22a5 5 0 0 1 10 0"/>
  </svg>
);

export const HomeIconShop: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 7h18l-1 12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 7Z"/>
    <path d="M7 7a5 5 0 0 1 10 0" fill="none" stroke="white" strokeWidth="2"/>
    <path d="M10 14h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="14" r="0.5" fill="white"/>
  </svg>
);

export const HomeIconAchievements: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="8" r="6"/>
    <path d="M8 14l-1 7 5-2 5 2-1-7"/>
    <path d="M9 8l2 2 4-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const HomeIconChallenges: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 3h6l1 2h9v11h-9l-1 2H4z"/>
    <path d="M8 10l2 2 4-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const HomeIconNotes: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5 3h11a2 2 0 0 1 2 2v14l-4-2-4 2-4-2V5a2 2 0 0 1 2-2z"/>
    <path d="M8 7h7M8 10h7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ShopCartBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 5h2l2 12h10l2-8H7"/>
    <circle cx="9" cy="19" r="2"/>
    <circle cx="17" cy="19" r="2"/>
  </svg>
);

export const ChallengeTargetBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2"/>
    <path d="M12 7v5l3 2" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ChallengeBoltBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13 2 4 13h6l-1 9 9-11h-6l1-9z"/>
  </svg>
);

export const ChecklistBold: IconComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 6h9v3H4zM4 11h9v3H4zM4 16h9v3H4z"/>
    <path d="m17 7 2 2 4-4" fill="none" stroke="white" strokeWidth="2"/>
  </svg>
);