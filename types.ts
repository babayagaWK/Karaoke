export interface SongMetadata {
  title: string;
  artist: string;
  album?: string;
  lyrics: string;
  detectedLanguage?: string;
}

export interface AudioProcessingState {
  isVocalRemoved: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export interface EQSettings {
  bass: number;      // -6 to +6 dB
  mid: number;       // -6 to +6 dB
  treble: number;    // -6 to +6 dB
}

export interface NoiseGateSettings {
  enabled: boolean;
  threshold: number; // -80 to -20 dB
}

export interface ProcessingSnapshot {
  vocalRemovalLevel: number;
  eqSettings: EQSettings;
  volume: number;
  timestamp: number;
}

export interface Preset {
  name: string;
  vocalRemovalLevel: number;
  eqSettings: EQSettings;
  icon?: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
