import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  vocalRemovalLevel: number;
  onVocalRemovalChange: (level: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  isLiveMode: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const ControlsRN: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  vocalRemovalLevel,
  onVocalRemovalChange,
  currentTime,
  duration,
  onSeek,
  isLiveMode,
  volume,
  onVolumeChange,
}) => {
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getVocalRemovalDescription = () => {
    if (vocalRemovalLevel === 0) {
      return '📊 Hearing original audio with full vocals';
    } else if (vocalRemovalLevel < 50) {
      return '🎵 Reduced vocals - instruments clearer';
    } else if (vocalRemovalLevel < 80) {
      return '🎸 Strong removal - mostly instruments';
    } else {
      return '🥁 Extreme removal - percussion dominant';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* PROGRESS BAR (File Mode Only) */}
      {!isLiveMode && (
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>⏱️ Progress</Text>
            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
          <Slider
            style={styles.progressSlider}
            minimumValue={0}
            maximumValue={duration || 0}
            value={currentTime}
            onValueChange={onSeek}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#475569"
            thumbTintColor="#3b82f6"
          />
        </View>
      )}

      {/* LIVE MODE INDICATOR */}
      {isLiveMode && (
        <View style={[styles.section, styles.liveIndicator]}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              🎤 LIVE INPUT ACTIVE - Audio streaming from microphone
            </Text>
          </View>
        </View>
      )}

      {/* VOLUME CONTROL */}
      <View style={[styles.section, styles.controlSection]}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>🔊 Output Volume</Text>
          <Text style={styles.valueTag}>
            {Math.round(volume * 100)}%
          </Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.05}
          value={volume}
          onValueChange={onVolumeChange}
          minimumTrackTintColor="#22c55e"
          maximumTrackTintColor="#475569"
          thumbTintColor="#22c55e"
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>Mute</Text>
          <Text style={styles.rangeLabel}>Normal</Text>
          <Text style={styles.rangeLabel}>Loud</Text>
        </View>
      </View>

      {/* VOCAL REMOVAL LEVEL */}
      <View style={[styles.section, styles.controlSection]}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>🎤 Vocal Removal</Text>
          <Text style={[styles.valueTag, styles.purpleTag]}>
            {vocalRemovalLevel}%
          </Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={vocalRemovalLevel}
          onValueChange={onVocalRemovalChange}
          minimumTrackTintColor="#a855f7"
          maximumTrackTintColor="#475569"
          thumbTintColor="#a855f7"
        />
        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>Original (0%)</Text>
          <Text style={styles.rangeLabel}>50% Removal</Text>
          <Text style={styles.rangeLabel}>Maximum (100%)</Text>
        </View>
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            {getVocalRemovalDescription()}
          </Text>
        </View>
      </View>

      {/* PLAY/PAUSE BUTTON */}
      <View style={[styles.section, styles.buttonSection]}>
        {!isLiveMode ? (
          <TouchableOpacity
            style={[
              styles.playButton,
              isPlaying && styles.pauseButton,
            ]}
            onPress={onPlayPause}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? '⏸️ PAUSE' : '▶️ PLAY'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.liveButton}>
            <View style={styles.liveDot} />
            <Text style={styles.liveButtonText}>
              🎙️ LISTENING - Vocal removal applied in real-time
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  controlSection: {
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
  liveIndicator: {
    backgroundColor: 'rgba(127, 29, 29, 0.2)',
    borderColor: 'rgba(159, 18, 18, 0.5)',
  },
  buttonSection: {
    marginBottom: 100,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 11,
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  valueTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4ade80',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  purpleTag: {
    color: '#d946ef',
    backgroundColor: 'rgba(217, 70, 239, 0.2)',
  },
  progressSlider: {
    height: 6,
    marginVertical: 8,
  },
  slider: {
    height: 10,
    marginVertical: 8,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  descriptionBox: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.5)',
  },
  pauseButton: {
    backgroundColor: '#1d4ed8',
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  liveButton: {
    backgroundColor: 'rgba(127, 29, 29, 0.3)',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(159, 18, 18, 0.5)',
  },
  liveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },
});

export default ControlsRN;
