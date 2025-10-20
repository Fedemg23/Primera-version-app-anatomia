import React, { memo } from 'react';
import { League } from '../types';

interface AvatarWithFrameProps {
    avatar: string;
    activeFrame: League | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const AvatarWithFrame: React.FC<AvatarWithFrameProps> = memo(({ avatar, activeFrame, size = 'md', className = '' }) => {
    const frameColors = {
        'Bronce': 'from-amber-700 via-amber-600 to-amber-800',
        'Plata': 'from-gray-300 via-gray-200 to-gray-400',
        'Oro': 'from-yellow-400 via-yellow-300 to-yellow-500',
        'Rubí': 'from-red-600 via-red-500 to-pink-600',
        'Esmeralda': 'from-emerald-500 via-teal-400 to-emerald-600',
        'Diamante': 'from-blue-400 via-cyan-300 to-purple-400'
    };

    const sizeClasses = {
        'sm': { container: 'w-12 h-12', inner: 'inset-1', avatar: 'text-2xl w-10 h-10' },
        'md': { container: 'w-16 h-16', inner: 'inset-1.5', avatar: 'text-4xl w-14 h-14' },
        'lg': { container: 'w-24 h-24', inner: 'inset-2', avatar: 'text-6xl w-20 h-20' },
        'xl': { container: 'w-32 h-32', inner: 'inset-2.5', avatar: 'text-7xl w-27 h-27' }
    };

    const sizes = sizeClasses[size];

    // Sin marco
    if (!activeFrame) {
        return (
            <div className={`${sizes.container} rounded-full flex items-center justify-center bg-slate-700 shadow-md overflow-hidden ${className}`}>
                {typeof avatar === 'string' && avatar.includes('/') ? (
                    <img src={avatar} alt="Avatar" className={`${sizes.avatar} object-contain`} />
                ) : (
                    <span className={sizes.avatar.split(' ')[0]}>{avatar}</span>
                )}
            </div>
        );
    }

    // Con marco de liga
    return (
        <div className={`${sizes.container} relative ${className}`}>
            {/* Marco exterior con gradiente de liga */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${frameColors[activeFrame]} opacity-90 shadow-lg`}></div>
            
            {/* Fondo negro interior */}
            <div className={`absolute ${sizes.inner} rounded-full bg-slate-900`}></div>
            
            {/* Avatar */}
            <div className="absolute inset-0 flex items-center justify-center">
                {typeof avatar === 'string' && avatar.includes('/') ? (
                    <img src={avatar} alt="Avatar" className={`${sizes.avatar} object-contain`} />
                ) : (
                    <span className={sizes.avatar.split(' ')[0]}>{avatar}</span>
                )}
            </div>
        </div>
    );
});

AvatarWithFrame.displayName = 'AvatarWithFrame';

export default AvatarWithFrame;


