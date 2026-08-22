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
    console.error('Three.js / WebGL Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#100f0d] text-[#c4b5a2] p-6 z-10 text-center">
            <h2 className="text-xl font-serifDisplay text-[#d4af37] mb-2">3D Scene Loading in Fallback Mode</h2>
            <p className="text-xs font-mono opacity-80 max-w-md">
              Your browser or graphics card switched to hardware acceleration safe mode. You can browse all books in the Library Grid below!
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
