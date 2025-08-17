import React, { useEffect, memo, useState } from 'react';
import { mockFirebase } from '../../services/firebase';

interface LoginScreenProps {
    onSignIn: () => void;
}

const candidateLogos = [
    '/images/Emoji hueso png.png',
    '/images/logo-bone.png',
];

const sideImages = [
    '/images/emoji llama.png',
    '/images/huesitos.png',
    '/images/lifeline-5050.png',
    '/images/lifeline-second-chance.png',
    '/images/lifeline-tips.png',
    '/images/Png Emoji tienda.png',
    '/images/Png bolsa dinero.png',
    '/images/Png Emoji tiro al arco.png',
    '/images/png emoji sombrero de graduacion.png',
];

const LoginScreen: React.FC<LoginScreenProps> = ({ onSignIn }) => {
    const [logoIdx, setLogoIdx] = useState(0);
    const [showFallbackEmoji, setShowFallbackEmoji] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);

    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    const handleLogoError = () => {
        if (logoIdx < candidateLogos.length - 1) setLogoIdx(i => i + 1);
        else setShowFallbackEmoji(true);
    };

    const handleSignInReal = async () => {
        try {
            setIsSigningIn(true);
            await mockFirebase.auth.signIn();
            onSignIn();
        } catch {
            setIsSigningIn(false);
            onSignIn();
        }
    };

    return (
        <div className="bg-black min-h-screen w-screen flex items-center justify-center p-4">
            {/* Contenido central sin contenedor/caja */}
            <div className="text-center max-w-2xl mx-auto px-2">
                <div className="mx-auto w-56 h-56 md:w-72 md:h-72 flex items-center justify-center mb-8 mt-6 md:mt-12">
                    {!showFallbackEmoji ? (
                        <img
                            src={candidateLogos[logoIdx]}
                            alt="AnatomyGO"
                            className="h-full w-auto object-contain select-none pointer-events-none transform scale-[1.6] md:scale-[1.85] translate-y-8 md:translate-y-10"
                            onError={handleLogoError}
                        />
                    ) : (
                        <span className="text-9xl transform scale-[1.6] md:scale-[1.85] translate-y-8 md:translate-y-10" role="img" aria-label="AnatomyGO Logo">🦴</span>
                    )}
                </div>
                <h1 className="text-6xl md:text-7xl font-black title-white-clean">AnatomyGO</h1>
                <p className="text-slate-300 mb-8 md:mb-10 text-lg">Tu aventura de anatomía te espera.</p>

                <div className="space-y-3">
                    <button
                        onClick={handleSignInReal}
                        disabled={isSigningIn}
                        className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation disabled:opacity-60"
                    >
                        {isSigningIn ? 'Entrando…' : 'Iniciar Sesión con Google'}
                    </button>
                    <button
                        onClick={handleSignInReal}
                        disabled={isSigningIn}
                        className="w-full bg-slate-800/70 text-slate-200 font-bold py-3 px-8 rounded-xl text-lg border border-slate-600 hover:bg-slate-800 transition-colors touch-manipulation disabled:opacity-60"
                    >
                        {isSigningIn ? 'Entrando…' : 'Entrar como Invitado'}
                    </button>
                    <button
                        onClick={onSignIn}
                        className="w-full bg-slate-700 text-slate-300 font-bold py-2.5 px-8 rounded-lg text-sm hover:bg-slate-600 transition-colors"
                    >
                        Modo Simulado (fallback)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(LoginScreen);