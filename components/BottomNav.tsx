




import React, { memo } from 'react';
import { BookOpen, Store, Award, Body, ListCheck } from './icons';
import { View } from '../types';

interface BottomNavProps {
    activeTab: View;
    onTabChange: (tab: View) => void;
    pendingClaims: boolean;
}

const NavButton = memo(({
    label,
    icon,
    isActive,
    onClick,
    hasNotification,
}: {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    hasNotification?: boolean;
}) => (
    <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl relative group transition-colors duration-300 z-10 touch-manipulation ${
            isActive 
                ? 'text-blue-300' 
                : 'text-slate-400 hover:text-white'
        }`}
    >
        {isActive && (
            <div className="absolute inset-x-2 top-1 h-10 bg-blue-500/10 rounded-xl transition-all duration-300"></div>
        )}
        <div className={`relative flex items-center justify-center h-8 w-8 mb-0.5 ${isActive ? 'animate-icon-pop' : ''}`}>
           {icon}
           {hasNotification && (
               <span className="absolute top-0 right-0 block h-2.5 w-2.5 transform -translate-y-1/4 translate-x-1/4 rounded-full bg-red-500 ring-2 ring-slate-900 animate-notification-pulse"></span>
           )}
        </div>
        <span className="text-xs font-bold tracking-tight">{label}</span>
    </button>
));

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, pendingClaims }) => {
    
    const tabsConfig: {id: View, label: string, icon: React.ReactNode}[] = [
        { id: 'play', label: "JUGAR", icon: <BookOpen className="w-7 h-7"/> },
        { id: 'atlas', label: "PROGRESO", icon: <Body className="w-7 h-7"/> },
        { id: 'challenges', label: "DESAFÍOS", icon: <ListCheck className="w-7 h-7"/> },
        { id: 'shop', label: "TIENDA", icon: <Store className="w-7 h-7"/> },
        { id: 'achievements', label: "LOGROS", icon: <Award className="w-7 h-7"/> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-lg">
            <div className="max-w-4xl mx-auto flex items-stretch justify-around gap-1 p-1" style={{ paddingBottom: 'calc(0.25rem + env(safe-area-inset-bottom))' }}>
                {tabsConfig.map((tab) => (
                     <NavButton
                        key={tab.id}
                        label={tab.label}
                        icon={tab.icon}
                        isActive={activeTab === tab.id}
                        onClick={() => onTabChange(tab.id)}
                        hasNotification={tab.id === 'achievements' && pendingClaims}
                    />
                ))}
            </div>
        </nav>
    );
};

export default memo(BottomNav);