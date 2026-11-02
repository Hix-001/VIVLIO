import React, { useEffect } from 'react';
import { VaultScene } from './components/3d/VaultScene';
import { VaultHUD } from './components/hud/VaultHUD';
import { HeroReveal } from './components/hero/HeroReveal';
import { BookRelicModal } from './components/hud/BookRelicModal';
import { PreloaderHUD } from './components/hud/PreloaderHUD';
import { OnlineReader } from './components/reader/OnlineReader';
import { useVaultStore } from './store/vaultStore';

export const App: React.FC = () => {
  const { isAudioMuted } = useVaultStore();

  // Subtle Acoustic Harmonic Drone (Zero-distortion gentle sine)
  useEffect(() => {
    if (isAudioMuted) return;

    let audioCtx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
        osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // 65Hz Harmonic resonance
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, audioCtx.currentTime);

        // Very gentle acoustic ambient volume
        gain.gain.setValueAtTime(0.018, audioCtx.currentTime);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
      }
    } catch (e) {
      console.warn('AudioContext ambient init:', e);
    }

    return () => {
      try {
        if (osc) osc.stop();
        if (audioCtx) audioCtx.close();
      } catch {}
    };
  }, [isAudioMuted]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#f5f2eb] text-neutral-900 select-none font-sans">
      {/* 1. Full 3D Sunlit Archival Sanctuary */}
      <VaultScene />

      {/* 2. Apple-Style 3D Book Reveal Hero Section */}
      <HeroReveal />

      {/* 3. Light Mode Frosted Glass HUD Interface for Movable World */}
      <VaultHUD />

      {/* 4. Luxury Relic Examination Modal */}
      <BookRelicModal />

      {/* 5. Full-Featured Two-Page Physical Online Reader */}
      <OnlineReader />

      {/* 6. Atmospheric Preloader Telemetry */}
      <PreloaderHUD />
    </div>
  );
};

export default App;
