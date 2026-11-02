import React, { useEffect } from 'react';
import { VaultScene } from './components/3d/VaultScene';
import { VaultHUD } from './components/hud/VaultHUD';
import { BookRelicModal } from './components/hud/BookRelicModal';
import { PreloaderHUD } from './components/hud/PreloaderHUD';
import { useVaultStore } from './store/vaultStore';

export const App: React.FC = () => {
  const { isAudioMuted } = useVaultStore();

  // Procedural Cyber-Monastic Ambient Drone (55Hz sacred low drone)
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

        // 55Hz Low Monastic drone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, audioCtx.currentTime);

        // Very gentle ambient volume
        gain.gain.setValueAtTime(0.035, audioCtx.currentTime);

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
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a090b] text-[#f5efe6] select-none font-sans">
      {/* 1. Full 3D Cyber-Monastic Vault Scene */}
      <VaultScene />

      {/* 2. Cyber-Monastic HUD Interface Overlay */}
      <VaultHUD />

      {/* 3. Holographic Relic Examination & PDF Reader / Download Modal */}
      <BookRelicModal />

      {/* 4. Atmospheric Preloader Telemetry */}
      <PreloaderHUD />
    </div>
  );
};

export default App;
