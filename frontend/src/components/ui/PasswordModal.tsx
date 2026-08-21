import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';

interface PasswordModalProps {
  onSuccess: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1907') {
      setIsUnlocked(true);
      setError(false);
      localStorage.setItem('vivlio_unlocked', '1907');
      setTimeout(() => {
        onSuccess();
      }, 400);
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0807]/92 backdrop-blur-2xl p-4 select-none animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#181410] border border-[#d4af37]/40 rounded-3xl p-8 shadow-[0_20px_70px_rgba(0,0,0,0.95)] text-center">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#d4af37]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#241c16] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shadow-inner">
          {isUnlocked ? <ShieldCheck size={32} /> : <Lock size={28} />}
        </div>

        <h2 className="font-serifDisplay text-2xl text-[#f5efe6] tracking-wide mb-1">
          Vivlio Scriptorium
        </h2>
        <p className="font-sans text-xs text-[#a89988] mb-6">
          Enter master PIN code to unlock personal library
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              maxLength={8}
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="••••"
              className={`w-full text-center text-2xl tracking-[0.4em] font-mono py-3.5 px-4 rounded-2xl bg-[#0e0c0a] border ${
                error
                  ? 'border-red-500/80 text-red-300'
                  : 'border-[#d4af37]/30 focus:border-[#d4af37] text-[#f5efe6]'
              } outline-none transition-all shadow-inner`}
            />
            <KeyRound size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8e7f6e] pointer-events-none" />
          </div>

          {error && (
            <div className="text-[11px] font-mono text-red-400 animate-shake">
              Incorrect passcode. Try again.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#e5c26b] text-[#100f0d] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-95 transform active:scale-[0.98] transition-all shadow-lg shadow-[#d4af37]/20"
          >
            <span>{isUnlocked ? 'Access Granted' : 'Unlock Library'}</span>
            <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
