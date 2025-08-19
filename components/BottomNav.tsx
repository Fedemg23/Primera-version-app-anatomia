




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
        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg relative group transition-colors duration-200 z-10 touch-manipulation bg-black border ${
            isActive 
                ? 'text-slate-100 border-white ring-2 ring-amber-400/50' 
                : 'text-slate-400 hover:text-slate-200 border-white/40 ring-2 ring-amber-400/30'
        }`}
    >
        <div className={`relative flex items-center justify-center h-8 w-8 mb-0.5`}>
           {icon}
           {hasNotification && (
               <span className="absolute top-0 right-0 block h-2.5 w-2.5 transform -translate-y-1/4 translate-x-1/4 rounded-full bg-red-500 ring-2 ring-slate-900 animate-notification-pulse"></span>
           )}
        </div>
        <span className="text-[11px] font-semibold tracking-tight">{label}</span>
    </button>
));

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, pendingClaims }) => {
    
    const tabsConfig: {id: View, label: string, icon: React.ReactNode}[] = [
        { id: 'play', label: "JUGAR", icon: <BookOpen className="w-7 h-7"/> },
        { id: 'challenges', label: "DESAFÍOS", icon: <ListCheck className="w-7 h-7"/> },
        { id: 'shop', label: "TIENDA", icon: <Store className="w-7 h-7"/> },
        { id: 'achievements', label: "LOGROS", icon: <Award className="w-7 h-7"/> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-black">
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