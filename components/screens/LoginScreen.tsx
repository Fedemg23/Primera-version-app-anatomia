import React, { useEffect, memo, useState } from 'react';
import { mockFirebase } from '../../services/firebase';
import { Eye, EyeOff } from '../icons';
import { OptimizedLogo } from '../../src/utils/optimizedIcons';

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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [password2, setPassword2] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

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

    const handleEmailAction = async () => {
        setError(null);
        setInfo(null);
        try {
            setIsSigningIn(true);
            if (isRegister) {
                if (!email || !password || password !== password2) {
                    setError('Las contraseñas no coinciden.');
                    return;
                }
                await mockFirebase.auth.signUpWithEmail(email, password);
                setInfo('Verifica tu correo para finalizar el registro.');
            } else {
                await mockFirebase.auth.signInWithEmail(email, password);
                onSignIn();
            }
        } catch (e: any) {
            const code = e?.code || '';
            if (code === 'auth/email-not-verified') {
                setError('Tu email no está verificado. Te hemos reenviado el correo.');
                try { await mockFirebase.auth.resendVerification(email, password); } catch {}
            } else if (code === 'auth/email-verification-sent') {
                setInfo('Te enviamos un correo de verificación. Revisa tu bandeja.');
            } else {
                setError('No se pudo iniciar sesión. Revisa tus datos.');
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    const handleResetPassword = async () => {
        setError(null);
        setInfo(null);
        try {
            await mockFirebase.auth.resetPassword(email);
            setInfo('Te enviamos un enlace para restablecer tu contraseña.');
        } catch {
            setError('No se pudo enviar el correo de restablecimiento.');
        }
    };

    return (
        <div className="bg-transparent min-h-screen w-screen flex items-center justify-center p-4 pb-8" style={{ paddingBottom: 'calc( env(safe-area-inset-bottom) + 2.5rem )' }}>
            {/* Contenido central sin contenedor/caja */}
            <div className="text-center max-w-2xl mx-auto px-2">
                <div className="mx-auto w-56 h-56 md:w-72 md:h-72 flex items-center justify-center mb-0 -mt-16 md:-mt-12">
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
                <div className="flex items-center justify-center mb-0 -mt-12">
                    <OptimizedLogo 
                        className="h-40 md:h-56 object-contain"
                        style={{ 
                            transform: 'scale(2.5)'
                        }}
                    />
                </div>
                <p className="text-slate-600 mb-2 md:mb-3 text-lg -mt-12">Tu aventura de anatomía te espera.</p>

                <div className="space-y-3 max-w-sm mx-auto w-full">
                    <button
                        onClick={handleSignInReal}
                        disabled={isSigningIn}
                        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg shadow-gray-800/20 hover:shadow-xl hover:shadow-gray-800/30 transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation disabled:opacity-60"
                    >
                        {isSigningIn ? 'Entrando…' : 'Iniciar Sesión con Google'}
                    </button>
                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-slate-100 font-bold">{isRegister ? 'Crear cuenta' : 'Entrar con email'}</h3>
                            <button onClick={() => setIsRegister(v => !v)} className="text-sm text-gray-300 font-bold hover:underline">{isRegister ? 'Ya tengo cuenta' : 'Crear cuenta'}</button>
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            className="w-full bg-slate-700/70 border border-slate-600 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                className="w-full bg-slate-700/70 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-white outline-none focus:ring-2 focus:ring-gray-400"
                            />
                            <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white">
                                {showPass ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                            </button>
                        </div>
                        {isRegister && (
                            <div className="relative">
                                <input
                                    type={showPass2 ? 'text' : 'password'}
                                    value={password2}
                                    onChange={e => setPassword2(e.target.value)}
                                    placeholder="Repetir contraseña"
                                    className="w-full bg-slate-700/70 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-white outline-none focus:ring-2 focus:ring-gray-400"
                                />
                                <button type="button" onClick={() => setShowPass2(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white">
                                    {showPass2 ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                </button>
                            </div>
                        )}
                        {error && <div className="text-red-300 text-sm">{error}</div>}
                        {info && <div className="text-sky-300 text-sm">{info}</div>}
                        <div className="flex items-center justify-between">
                            <button onClick={handleEmailAction} disabled={isSigningIn || !email || !password || (isRegister && (!password2 || password2 !== password))} className="px-4 py-2 rounded-lg bg-gray-600 text-white font-bold hover:bg-gray-500 disabled:opacity-60">{isRegister ? 'Registrarme' : 'Entrar'}</button>
                            <button onClick={handleResetPassword} className="text-sm text-slate-300 hover:underline">¿Olvidaste tu contraseña?</button>
                        </div>
                    </div>
                    {/* Eliminado modo Invitado y Simulado */}
                </div>
            </div>
        </div>
    );
};

export default memo(LoginScreen);