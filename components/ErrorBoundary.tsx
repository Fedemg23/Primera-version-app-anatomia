import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualizar el estado para mostrar la UI de error
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    // Filtrar errores de Firestore para recuperación automática
    const firestoreErrors = [
      'FIRESTORE',
      'Missing or insufficient permissions',
      'INTERNAL ASSERTION FAILED'
    ];
    
    const isFirestoreError = firestoreErrors.some(pattern => 
      error.message?.includes(pattern) || error.stack?.includes(pattern)
    );
    
    if (isFirestoreError) {
      console.warn('Error de Firestore detectado, recuperando automáticamente...');
      // Resetear el estado después de un breve delay para permitir recuperación
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 2000);
    }
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">
              Algo salió mal
            </h2>
            <p className="text-slate-300 mb-4">
              Se ha producido un error temporal. La aplicación se recuperará automáticamente.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
