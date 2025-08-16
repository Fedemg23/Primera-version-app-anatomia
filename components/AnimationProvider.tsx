import React, { useCallback, createContext, useContext, useRef, ReactNode } from 'react';
import { AnimationConfig as AppAnimationConfig, AnimationType } from '../types';

interface AnimationContextType {
    triggerAnimation: (config: AppAnimationConfig) => void;
    setTargetRef: (type: AnimationType, ref: HTMLElement | null) => void;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

export const useAnimation = () => {
    const context = useContext(AnimationContext);
    if (!context) {
        throw new Error('useAnimation must be used within an AnimationProvider');
    }
    return context;
};

interface AnimationProviderProps {
    children: ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
    const targetsRef = useRef<{ [key in AnimationType]?: HTMLElement | null }>({});

    const setTargetRef = useCallback((type: AnimationType, ref: HTMLElement | null) => {
        targetsRef.current[type] = ref;
    }, []);

    // The particle animation functionality has been removed as per the new design focus.
    // The triggerAnimation function is now a no-op to maintain compatibility with existing calls
    // without producing any visual effect.
    const triggerAnimation = useCallback(() => {
        // This function is intentionally left empty.
    }, []);

    return (
        <AnimationContext.Provider value={{ triggerAnimation, setTargetRef }}>
            {children}
            {/* The particle container is no longer needed. */}
        </AnimationContext.Provider>
    );
};
