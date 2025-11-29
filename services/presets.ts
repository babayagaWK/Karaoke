import { Preset, EQSettings } from '../types';

export const DEFAULT_EQ: EQSettings = {
  bass: 0,
  mid: 0,
  treble: 0
};

export const PRESETS: Preset[] = [
  {
    name: 'Karaoke',
    vocalRemovalLevel: 70,
    eqSettings: {
      bass: 1,
      mid: -2,
      treble: 1
    },
    icon: '🎤'
  },
  {
    name: 'Ballad',
    vocalRemovalLevel: 50,
    eqSettings: {
      bass: 2,
      mid: 0,
      treble: -1
    },
    icon: '🎵'
  },
  {
    name: 'Rock',
    vocalRemovalLevel: 85,
    eqSettings: {
      bass: 3,
      mid: 1,
      treble: 2
    },
    icon: '🎸'
  },
  {
    name: 'Acoustic',
    vocalRemovalLevel: 60,
    eqSettings: {
      bass: 0,
      mid: 1,
      treble: 2
    },
    icon: '🎺'
  },
  {
    name: 'Pop',
    vocalRemovalLevel: 75,
    eqSettings: {
      bass: 1,
      mid: -1,
      treble: 2
    },
    icon: '🎹'
  },
  {
    name: 'Jazz',
    vocalRemovalLevel: 55,
    eqSettings: {
      bass: 2,
      mid: 1,
      treble: 0
    },
    icon: '🎷'
  }
];
