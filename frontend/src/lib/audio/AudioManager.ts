export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  file: string;
}

export class AudioManager {
  private static instance: AudioManager;
  private currentTrackId: string | null = null;
  private masterVolume: number = 0.8;
  private musicVolume: number = 0.8;
  private effectsVolume: number = 0.5;
  private isMuted: boolean = false;
  private audioEl: HTMLAudioElement | null = null;
  private tracks: Map<string, AudioTrack> = new Map();

  private constructor() {
    this.audioEl = new Audio();
    this.audioEl.preload = 'auto';
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  loadTracks(tracks: AudioTrack[]): void {
    tracks.forEach((t) => this.tracks.set(t.id, t));
  }

  playTrack(trackId: string): void {
    this.currentTrackId = trackId;
    const track = this.tracks.get(trackId);
    if (!track || !this.audioEl) return;

    if (this.audioEl.src !== window.location.origin + track.file && !this.audioEl.src.endsWith(track.file)) {
      this.audioEl.src = track.file;
    }

    this.audioEl.volume = this.isMuted ? 0 : this.masterVolume * this.musicVolume;
    const playPromise = this.audioEl.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play request interrupted or requires user gesture:', err);
      });
    }
  }

  pause(): void {
    if (this.audioEl) {
      this.audioEl.pause();
    }
  }

  resume(): void {
    if (this.currentTrackId) {
      this.playTrack(this.currentTrackId);
    } else if (this.tracks.size > 0) {
      const firstId = Array.from(this.tracks.keys())[0];
      this.playTrack(firstId);
    }
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.masterVolume * this.musicVolume;
    }
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.masterVolume * this.musicVolume;
    }
  }

  setEffectsVolume(volume: number): void {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.masterVolume * this.musicVolume;
    }
  }

  stopAll(): void {
    if (this.audioEl) {
      this.audioEl.pause();
    }
  }

  playEffect(effectId: string): void {
    // Optional SFX if needed
  }
}
