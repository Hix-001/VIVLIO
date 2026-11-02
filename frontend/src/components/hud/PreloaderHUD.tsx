import React, { useEffect, useState } from 'react';
import { useVaultStore } from '../../store/vaultStore';

export const PreloaderHUD: React.FC = () => {
  const { isLoading, setIsLoading } = useVaultStore();
  const [telemetryStep, setTelemetryStep] = useState(0);

  const steps = [
    'ILLUMINATING SUNLIT TRAVERTINE ARCHITECTURE...',
    'CALIBRATING RETINA GRAPHICS & ANISOTROPIC TEXTURES...',
    'SYNCHRONIZING 7 CODEX RELICS & PDF ENGINE...',
    'SANCTUARY READY.',
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setTelemetryStep(1), 350);
    const timer2 = setTimeout(() => setTelemetryStep(2), 700);
    const timer3 = setTimeout(() => setTelemetryStep(3), 1050);
    const timer4 = setTimeout(() => setIsLoading(false), 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [setIsLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#f8f6f0] text-stone-900 font-mono select-none transition-opacity duration-700">
      {/* Central Light Sanctuary Insignia */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border border-stone-300 border-t-[#c59b27] animate-spin" />
        <div className="absolute w-12 h-12 rounded-full border border-[#c59b27]/40 border-b-[#c59b27] animate-spin [animation-duration:2.5s]" />
        <div className="absolute text-sm tracking-widest text-[#c59b27] font-bold">
          Ψ
        </div>
      </div>

      {/* Brand Title */}
      <div className="text-center max-w-sm px-4">
        <h1 className="font-serif text-3xl tracking-widest uppercase text-stone-900 font-normal mb-1">
          Vivlio
        </h1>
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#c59b27] block mb-6">
          Sunlit Archival Sanctuary // 7 Relics
        </span>

        {/* Telemetry Output Line */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-[11px] text-stone-600 tracking-wider animate-pulse">
            {steps[telemetryStep]}
          </p>
        </div>
      </div>
    </div>
  );
};
