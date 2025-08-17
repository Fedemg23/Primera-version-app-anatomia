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
            {/* Columna izquierda de imágenes (oculta en pantallas pequeñas) */}
            <div className="hidden md:flex flex-col items-center justify-center gap-4 mr-2 md:mr-0 md:translate-x-8 lg:translate-x-16">
                {sideImages.slice(0, Math.ceil(sideImages.length / 2)).map((src, i) => (
                    <img
                        key={`left-${i}`}
                        src={src}
                        alt="decoración"
                        className="w-24 h-24 object-contain opacity-80 select-none pointer-events-none float-bob"
                        draggable={false}
                    />
                ))}
            </div>

            {/* Contenido central sin contenedor/caja */}
            <div className="text-center max-w-xl mx-auto">
                <div className="mx-auto w-52 h-52 md:w-64 md:h-64 flex items-center justify-center mb-6 mt-6 md:mt-10">
                    {!showFallbackEmoji ? (
                        <img
                            src={candidateLogos[logoIdx]}
                            alt="AnatomyGO"
                            className="h-full w-auto object-contain select-none pointer-events-none"
                            onError={handleLogoError}
                        />
                    ) : (
                        <span className="text-9xl" role="img" aria-label="AnatomyGO Logo">🦴</span>
                    )}
                </div>
                <h1 className="text-5xl font-black title-white-clean">AnatomyGO</h1>
                <p className="text-slate-300 mb-6 text-lg">Tu aventura de anatomía te espera.</p>

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

            {/* Columna derecha de imágenes (oculta en pantallas pequeñas) */}
            <div className="hidden md:flex flex-col items-center justify-center gap-4 ml-2 md:ml-0 md:-translate-x-8 lg:-translate-x-16">
                {sideImages.slice(Math.ceil(sideImages.length / 2)).map((src, i) => (
                    <img
                        key={`right-${i}`}
                        src={src}
                        alt="decoración"
                        className="w-24 h-24 object-contain opacity-80 select-none pointer-events-none float-bob"
                        draggable={false}
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(LoginScreen);