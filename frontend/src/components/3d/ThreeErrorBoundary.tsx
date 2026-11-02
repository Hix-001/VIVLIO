import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ThreeErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Three.js Canvas Error Caught:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a090b] text-[#f5efe6] p-8 text-center select-none font-mono">
          <div className="w-12 h-12 rounded-full border border-[#ff003c] flex items-center justify-center text-[#ff003c] mb-4 shadow-[0_0_20px_rgba(255,0,60,0.3)]">
            !
          </div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-[#f5efe6] mb-2">
            Vault Neural Link Interrupted
          </h2>
          <p className="text-xs text-[#8e7f6e] max-w-md mb-6 leading-relaxed">
            Hardware acceleration or WebGL context was reset. Please reload the chamber to re-establish synchronous link.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs uppercase tracking-widest hover:bg-[#d4af37]/20 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            Re-Initialize Vault
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
