import React from 'react';
import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Home, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-eco-bg p-4">
          <div className="card p-8 max-w-md w-full text-center">
            <AlertTriangle className="w-16 h-16 text-eco-neon mx-auto mb-4 animate-pulse" aria-hidden="true" />
            <h2 className="font-display font-bold text-2xl text-white mb-3">Algo salió mal</h2>
            <p className="text-eco-green/60 mb-6">Esta vista no pudo cargarse. El resto de la app sigue funcionando.</p>
            <details className="text-left mb-4 p-3 rounded-lg bg-eco-surface/50 border border-eco-border/30">
              <summary className="text-xs font-medium text-eco-green/60 cursor-pointer">Detalles técnicos</summary>
              <pre className="mt-2 text-xs text-eco-green/50 overflow-auto max-h-40">{this.state.error?.message || 'Error desconocido'}</pre>
            </details>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.resetError}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Reintentar
              </button>
              <Link to="/" className="btn-secondary flex items-center justify-center gap-2">
                <Home className="w-4 h-4" aria-hidden="true" />
                Inicio
              </Link>
            </div>
            <p className="text-xs text-eco-green/40 mt-4">
              Si el problema persiste, contacta a soporte.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };
}

export default ErrorBoundary;