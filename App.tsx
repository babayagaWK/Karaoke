import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ControlsRN from './components/ControlsRN';
import VisualizerRN from './components/VisualizerRN';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [vocalRemovalLevel, setVocalRemovalLevel] = useState(50);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'processor' | 'results'>('processor');

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Initialize audio context
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    };

    initAudioContext();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number) => {
    setCurrentTime(value);
  };

  const handleVocalRemovalChange = (level: number) => {
    setVocalRemovalLevel(level);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
  };

  const handleToggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
    if (!isLiveMode) {
      setIsPlaying(false);
    }
  };

  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎵 Vocal Remover AI</Text>
        <Text style={styles.subtitle}>Remove vocals from any song instantly</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'processor' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('processor')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'processor' && styles.activeTabText,
            ]}
          >
            🎛️ Processor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'results' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('results')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'results' && styles.activeTabText,
            ]}
          >
            📊 Results
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'processor' ? (
          <>
            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  !isLiveMode && styles.activeModeButton,
                ]}
                onPress={() => setIsLiveMode(false)}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    !isLiveMode && styles.activeModeButtonText,
                  ]}
                >
                  📁 File Mode
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  isLiveMode && styles.activeModeButton,
                ]}
                onPress={handleToggleLiveMode}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    isLiveMode && styles.activeModeButtonText,
                  ]}
                >
                  🎤 Live Mode
                </Text>
              </TouchableOpacity>
            </View>

            {/* Visualizer */}
            {isPlaying && (
              <VisualizerRN analyser={analyserRef.current} isPlaying={isPlaying} />
            )}

            {/* Controls */}
            <ControlsRN
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              vocalRemovalLevel={vocalRemovalLevel}
              onVocalRemovalChange={handleVocalRemovalChange}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              isLiveMode={isLiveMode}
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />
          </>
        ) : (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>📊 Processing Results</Text>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Vocal Removal Level</Text>
              <Text style={styles.resultValue}>{vocalRemovalLevel}%</Text>
            </View>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Output Volume</Text>
              <Text style={styles.resultValue}>
                {Math.round(volume * 100)}%
              </Text>
            </View>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Playback Duration</Text>
              <Text style={styles.resultValue}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </View>
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Processing Mode</Text>
              <Text style={styles.resultValue}>
                {isLiveMode ? '🎤 Live' : '📁 File'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ✨ Powered by Gemini AI Technology
        </Text>
      </View>
    </View>
  );
}

const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71, 85, 105, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71, 85, 105, 0.2)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#3b82f6',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  activeModeButtonText: {
    color: '#fff',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  resultLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(71, 85, 105, 0.3)',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});
