import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Music2,
  Sliders,
  Disc3
} from 'lucide-react';
import { useAudioStore } from '../../store/audioStore';
import { motion, AnimatePresence } from 'framer-motion';

export const AudioControls: React.FC = () => {
  const {
    isPlaying,
    currentTrackId,
    tracks,
    volume,
    musicVolume,
    isMuted,
    playTrack,
    pause,
    resume,
    nextTrack,
    previousTrack,
    setVolume,
    setMusicVolume,
    toggleMute
  } = useAudioStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showTracklist, setShowTracklist] = useState(false);

  const activeTrack = tracks.find((t) => t.id === currentTrackId) || tracks[0];

  return (
    <motion.div 
      className="fixed bottom-6 left-6 z-40"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-[#181411]/92 backdrop-blur-xl border border-[#d4af37]/30 rounded-2xl p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.75)] text-[#f5efe6]">
        {/* Main Controls Bar */}
        <div className="flex items-center gap-3">
          {/* Track Selector & Info */}
          <div className="relative">
            <button
              onClick={() => setShowTracklist(!showTracklist)}
              className="px-3 py-1.5 rounded-xl bg-[#26201b] hover:bg-[#383028] text-xs font-mono flex items-center gap-2 border border-[#d4af37]/25 transition-all text-[#e6d7c3]"
              title="Select Music Track"
            >
              <Disc3 size={14} className={isPlaying ? 'text-[#d4af37] animate-spin' : 'text-[#8e7f6e]'} />
              <div className="flex flex-col text-left max-w-[130px] truncate">
                <span className="truncate text-xs font-semibold text-[#f5efe6]">{activeTrack?.title}</span>
                <span className="truncate text-[10px] text-[#8e7f6e]">{activeTrack?.artist}</span>
              </div>
            </button>

            <AnimatePresence>
              {showTracklist && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute bottom-full mb-2 left-0 bg-[#201a15]/98 backdrop-blur-2xl border border-[#d4af37]/35 rounded-xl p-1.5 min-w-[220px] shadow-2xl z-50 flex flex-col gap-1"
                >
                  <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-[#8e7f6e] border-b border-white/5">
                    Music Playlist
                  </div>
                  {tracks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        playTrack(t.id);
                        setShowTracklist(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-left text-xs font-sans flex items-center justify-between transition-colors ${
                        currentTrackId === t.id
                          ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold'
                          : 'text-[#c4b5a2] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{t.title}</span>
                        <span className="text-[10px] opacity-70">{t.artist}</span>
                      </div>
                      {currentTrackId === t.id && isPlaying && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Playback Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={previousTrack}
              className="p-1.5 rounded-full text-[#c4b5a2] hover:text-white hover:bg-white/5 transition-all"
              aria-label="Previous Track"
            >
              <SkipBack size={14} />
            </button>

            <button
              onClick={isPlaying ? pause : resume}
              className="w-8 h-8 rounded-full bg-[#d4af37] hover:bg-[#e5c26b] transition-all flex items-center justify-center shadow-lg transform hover:scale-105"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={14} className="text-[#100f0d] fill-[#100f0d]" />
              ) : (
                <Play size={14} className="text-[#100f0d] fill-[#100f0d] ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-1.5 rounded-full text-[#c4b5a2] hover:text-white hover:bg-white/5 transition-all"
              aria-label="Next Track"
            >
              <SkipForward size={14} />
            </button>
          </div>

          {/* Volume Mute */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full text-[#c4b5a2] hover:text-white hover:bg-white/5 transition-all"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={15} className="text-red-400" /> : <Volume2 size={15} />}
          </button>

          {/* Sliders toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full text-[#8e7f6e] hover:text-[#d4af37] transition-colors"
            title="Volume Control"
          >
            <Sliders size={14} />
          </button>
        </div>

        {/* Expanded Volume Sliders */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#d4af37]/15 mt-2.5 pt-3 space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase text-[#8e7f6e] w-14">Master</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-black/40 rounded-full appearance-none cursor-pointer accent-[#d4af37]"
                  />
                  <span className="text-[10px] font-mono text-[#c4b5a2] w-7 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase text-[#8e7f6e] w-14">Music</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-black/40 rounded-full appearance-none cursor-pointer accent-[#d4af37]"
                  />
                  <span className="text-[10px] font-mono text-[#c4b5a2] w-7 text-right">
                    {Math.round(musicVolume * 100)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
