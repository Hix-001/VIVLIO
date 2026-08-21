import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AudioManager, AudioTrack } from '../lib/audio/AudioManager';

export const TRACKS: AudioTrack[] = [
  {
    id: 'naan_naan',
    title: 'Naan Naan',
    artist: 'Santhosh Narayanan',
    file: '/music/Naan%20Naan%20-%20Santhosh%20Narayanan.flac',
  },
  {
    id: 'buttabomma',
    title: 'Buttabomma',
    artist: 'Armaan Malik',
    file: '/music/Buttabomma%20-%20Armaan%20Malik.flac',
  },
  {
    id: 'ramuloo_ramulaa',
    title: 'Ramuloo Ramulaa',
    artist: 'Anurag Kulkarni',
    file: '/music/Ramuloo%20Ramulaa%20-%20Anurag%20Kulkarni.flac',
  },
];

interface AudioState {
  isPlaying: boolean;
  currentTrackId: string;
  volume: number;
  musicVolume: number;
  effectsVolume: number;
  isMuted: boolean;
  tracks: AudioTrack[];
  currentTrackIndex: number;

  // Actions
  initialize: () => void;
  playTrack: (trackId: string) => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setEffectsVolume: (volume: number) => void;
  toggleMute: () => void;
  playEffect: (effectId: string) => void;
}

const audioManager = AudioManager.getInstance();

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentTrackId: 'naan_naan',
      volume: 0.8,
      musicVolume: 0.8,
      effectsVolume: 0.5,
      isMuted: false,
      tracks: TRACKS,
      currentTrackIndex: 0,

      initialize: () => {
        audioManager.loadTracks(TRACKS);
        const state = get();
        audioManager.setMasterVolume(state.volume);
        audioManager.setMusicVolume(state.musicVolume);
      },

      playTrack: (trackId: string) => {
        const idx = TRACKS.findIndex((t) => t.id === trackId);
        audioManager.playTrack(trackId);
        set({
          isPlaying: true,
          currentTrackId: trackId,
          currentTrackIndex: idx >= 0 ? idx : 0,
        });
      },

      pause: () => {
        audioManager.pause();
        set({ isPlaying: false });
      },

      resume: () => {
        const { currentTrackId } = get();
        audioManager.playTrack(currentTrackId || 'naan_naan');
        set({ isPlaying: true });
      },

      nextTrack: () => {
        const { currentTrackIndex, tracks } = get();
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        const nextTrack = tracks[nextIndex];
        audioManager.playTrack(nextTrack.id);
        set({
          currentTrackId: nextTrack.id,
          currentTrackIndex: nextIndex,
          isPlaying: true,
        });
      },

      previousTrack: () => {
        const { currentTrackIndex, tracks } = get();
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        const prevTrack = tracks[prevIndex];
        audioManager.playTrack(prevTrack.id);
        set({
          currentTrackId: prevTrack.id,
          currentTrackIndex: prevIndex,
          isPlaying: true,
        });
      },

      setVolume: (volume: number) => {
        audioManager.setMasterVolume(volume);
        set({ volume });
      },

      setMusicVolume: (volume: number) => {
        audioManager.setMusicVolume(volume);
        set({ musicVolume: volume });
      },

      setEffectsVolume: (volume: number) => {
        audioManager.setEffectsVolume(volume);
        set({ effectsVolume: volume });
      },

      toggleMute: () => {
        audioManager.toggleMute();
        set((state) => ({ isMuted: !state.isMuted }));
      },

      playEffect: (effectId: string) => {
        audioManager.playEffect(effectId);
      },
    }),
    {
      name: 'vivlio-music-playlist-store-v2',
      partialize: (state) => ({
        volume: state.volume,
        musicVolume: state.musicVolume,
        isMuted: state.isMuted,
        currentTrackId: state.currentTrackId,
      }),
    }
  )
);
