import React, { useEffect, useState } from 'react';
import { useVaultStore } from '../../store/vaultStore';

export const PreloaderHUD: React.FC = () => {
  const { isLoading, setIsLoading } = useVaultStore();
  const [telemetryStep, setTelemetryStep] = useState(0);

  const steps = [
    'ILLUMINATING SUNLIT TRAVERTINE ARCHITECTURE...',
    'CALIBRATING RETINA GRAPHICS & TEXTURES...',
    'SYNCHRONIZING 7 CODEX RELICS & PDF ENGINE...',
    'SANCTUARY READY.',
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setTelemetryStep(1), 300);
    const timer2 = setTimeout(() => setTelemetryStep(2), 600);
    const timer3 = setTimeout(() => setTelemetryStep(3), 900);
    const timer4 = setTimeout(() => setIsLoading(false), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [setIsLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#f8f6f0] text-neutral-900 select-none transition-opacity duration-700 font-sans">
      {/* Central Sanctuary Insignia */}
      <div className="relative mb-7 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border border-neutral-300 border-t-[#c59b27] animate-spin" />
        <div className="absolute w-12 h-12 rounded-full border border-[#c59b27]/40 border-b-[#c59b27] animate-spin [animation-duration:2.5s]" />
        <div className="absolute font-serif text-base tracking-widest text-[#c59b27] font-semibold">
          Ψ
        </div>
      </div>

      {/* Brand Title in Apple's New York Serif */}
      <div className="text-center max-w-sm px-4">
        <h1 className="font-serif text-4xl tracking-tight text-neutral-900 font-light mb-1">
          Vivlio
        </h1>
        <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#9b781e] block mb-5 font-medium">
          Archival Sanctuary &middot; 7 Codices
        </span>

        {/* Telemetry Output Line in Apple's San Francisco Sans */}
        <div className="h-6 flex items-center justify-center">
          <p className="font-mono text-[10px] text-neutral-500 tracking-wider uppercase animate-pulse">
            {steps[telemetryStep]}
          </p>
        </div>
      </div>
    </div>
  );
};
