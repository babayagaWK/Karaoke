import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AudioEngine } from './utils/audioContext';
import { analyzeSongWithGemini } from './services/geminiService';
import { PRESETS } from './services/presets';
import { AudioExporter } from './services/audioExporter';
import { SongMetadata, ProcessingStatus, EQSettings, ProcessingSnapshot, Preset } from './types';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import EQControls from './components/EQControls';
import Presets from './components/Presets';
import ActionButtons from './components/ActionButtons';
import ComparisonModal from './components/ComparisonModal';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vocalRemovalLevel, setVocalRemovalLevel] = useState(0);
  const [eqSettings, setEqSettings] = useState<EQSettings>({ bass: 0, mid: 0, treble: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [metadata, setMetadata] = useState<SongMetadata | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showComparison, setShowComparison] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [history, setHistory] = useState<ProcessingSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const engineRef = useRef<AudioEngine | null>(null);
  const liveStreamRef = useRef<MediaStream | null>(null);

  // Initialize Engine
  useEffect(() => {
    engineRef.current = new AudioEngine();
    
    // Create hidden audio element for File Mode
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    // Events
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Cleanup live mode if active
      if (isLiveMode) stopLiveMode();

      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setMetadata(null);
      setAnalysisStatus(ProcessingStatus.IDLE);
      setIsPlaying(false);
      setCurrentTime(0);

      const objectUrl = URL.createObjectURL(selectedFile);
      if (audioRef.current && engineRef.current) {
        audioRef.current.src = objectUrl;
        audioRef.current.load();
        engineRef.current.setupSource(audioRef.current);
      }
    }
  }, [isLiveMode]);

  const togglePlay = () => {
    if (isLiveMode) return; // Play/Pause disabled in live mode
    if (!audioRef.current || !engineRef.current) return;
    
    engineRef.current.resume();

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleVocalRemover = () => {
    if (!engineRef.current) return;
    const newLevel = vocalRemovalLevel === 0 ? 100 : 0;
    setVocalRemovalLevel(newLevel);
    engineRef.current.setVocalRemovalLevel(newLevel);
  };

  const handleVocalRemovalChange = (newLevel: number) => {
    setVocalRemovalLevel(newLevel);
    if (engineRef.current) {
      engineRef.current.setVocalRemovalLevel(newLevel);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLiveMode || !audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (engineRef.current) {
      engineRef.current.setVolume(newVolume);
    }
  };

  const handleAnalyze = async () => {
    if (isLiveMode) return; // Cannot analyze live stream easily
    if (!file) return;

    setAnalysisStatus(ProcessingStatus.ANALYZING);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = (e.target?.result as string).split(',')[1];
        if (!base64String) {
           setAnalysisStatus(ProcessingStatus.ERROR);
           return;
        }

        try {
          const data = await analyzeSongWithGemini(base64String, file.type);
          setMetadata(data);
          setAnalysisStatus(ProcessingStatus.SUCCESS);
        } catch (err) {
          console.error(err);
          setAnalysisStatus(ProcessingStatus.ERROR);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setAnalysisStatus(ProcessingStatus.ERROR);
    }
  };

  // --- Live Mode Logic ---

  const startLiveMode = async () => {
    try {
      // 1. Stop file playback
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }

      let stream: MediaStream;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // === MOBILE: Use Microphone (getUserMedia) ===
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: false // Let user control
            }
          });
        } catch (err: any) {
          let errorMsg = "🔐 Microphone Access Error\n\n";
          
          if (err.name === 'NotAllowedError') {
            errorMsg += "Permission Denied - You need to allow microphone access.\n\n" +
              "📱 Steps:\n" +
              "1. Check browser permission settings\n" +
              "2. Go to Settings > Privacy > Microphone\n" +
              "3. Allow this website access\n" +
              "4. Refresh the page and try again";
          } else if (err.name === 'NotFoundError') {
            errorMsg += "No microphone detected on your device.\n\n" +
              "💡 Solutions:\n" +
              "• Connect a USB microphone\n" +
              "• Check if device audio is enabled\n" +
              "• Try another browser\n" +
              "• Upload an audio file instead (Upload mode)";
          } else {
            errorMsg += err.message + "\n\n" +
              "💡 Try uploading an audio file instead of using Live Mode.";
          }
          
          alert(errorMsg);
          return;
        }
      } else {
        // === DESKTOP: Try getDisplayMedia first, fallback to getUserMedia ===
        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: false,
            audio: true
          });
        } catch (err) {
          console.warn("getDisplayMedia failed, falling back to microphone...", err);
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
              }
            });
          } catch (fallbackErr: any) {
            let errorMsg = "🔐 Audio Access Error\n\n";
            
            if (fallbackErr.name === 'NotAllowedError') {
              errorMsg += "Permission Denied - You need to allow audio access.\n\n" +
                "🖥️ Steps:\n" +
                "1. Check browser permission settings\n" +
                "2. Look for microphone/camera permissions\n" +
                "3. Allow this website access\n" +
                "4. Refresh the page and try again";
            } else if (fallbackErr.name === 'NotFoundError') {
              errorMsg += "No audio device detected on your computer.\n\n" +
                "💡 Solutions:\n" +
                "• Connect a microphone or audio input device\n" +
                "• Check system audio settings\n" +
                "• Open browser DevTools to check device availability\n" +
                "• Upload an audio file instead";
            } else {
              errorMsg += fallbackErr.message + "\n\n" +
                "💡 Workaround: You can upload an audio file using the Upload button instead.\n" +
                "The vocal removal will work on your uploaded file!";
            }
            
            alert(errorMsg);
            return;
          }
        }
      }

      // Check if we got audio tracks
      if (stream.getAudioTracks().length === 0) {
        alert("⚠️ No Audio Tracks Captured\n\n" +
          "The stream was created but no audio tracks were found.\n\n" +
          "💡 Try:\n" +
          "• Checking your microphone is connected\n" +
          "• Restarting the browser\n" +
          "• Using the Upload mode with an audio file");
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      liveStreamRef.current = stream;
      setIsLiveMode(true);
      setFile(null);
      setMetadata(null);
      setAnalysisStatus(ProcessingStatus.IDLE);

      // Setup Engine
      if (engineRef.current) {
        engineRef.current.resume();
        engineRef.current.setupStream(stream);
      }

      // Handle stream end
      stream.getTracks().forEach(track => {
        track.onended = () => {
          stopLiveMode();
        };
      });

    } catch (err) {
      console.error("Error starting live mode:", err);
      alert("⚠️ Live Mode Error\n\n" +
        "Something went wrong while initializing audio capture.\n\n" +
        "💡 Try these solutions:\n" +
        "1. Check your microphone is connected and working\n" +
        "2. Refresh the page and try again\n" +
        "3. Use Upload mode to process an audio file instead\n" +
        "4. Check browser console (F12) for more details");
    }
  };

  const stopLiveMode = () => {
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach(t => t.stop());
      liveStreamRef.current = null;
    }
    setIsLiveMode(false);
    // Reset engine?
    // engineRef.current?.setupSource(...); // Will be reset on next file load
  };

  // --- EQ Handler ---
  const handleEQChange = (newEQSettings: EQSettings) => {
    setEqSettings(newEQSettings);
    if (engineRef.current) {
      engineRef.current.setEQ(newEQSettings.bass, newEQSettings.mid, newEQSettings.treble);
    }
    // Add to history
    addToHistory();
  };

  // --- Preset Handler ---
  const handlePresetSelect = (preset: Preset) => {
    setVocalRemovalLevel(preset.vocalRemovalLevel);
    setEqSettings(preset.eqSettings);
    
    if (engineRef.current) {
      engineRef.current.setVocalRemovalLevel(preset.vocalRemovalLevel);
      engineRef.current.setEQ(preset.eqSettings.bass, preset.eqSettings.mid, preset.eqSettings.treble);
    }
    
    addToHistory();
  };

  // --- History Management ---
  const addToHistory = () => {
    const snapshot: ProcessingSnapshot = {
      vocalRemovalLevel,
      eqSettings,
      volume,
      timestamp: Date.now()
    };
    
    // Remove any future states if we've branched
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(snapshot);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const snapshot = history[prevIndex];
      
      setVocalRemovalLevel(snapshot.vocalRemovalLevel);
      setEqSettings(snapshot.eqSettings);
      setVolume(snapshot.volume);
      setHistoryIndex(prevIndex);
      
      if (engineRef.current) {
        engineRef.current.setVocalRemovalLevel(snapshot.vocalRemovalLevel);
        engineRef.current.setEQ(snapshot.eqSettings.bass, snapshot.eqSettings.mid, snapshot.eqSettings.treble);
        engineRef.current.setVolume(snapshot.volume);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const snapshot = history[nextIndex];
      
      setVocalRemovalLevel(snapshot.vocalRemovalLevel);
      setEqSettings(snapshot.eqSettings);
      setVolume(snapshot.volume);
      setHistoryIndex(nextIndex);
      
      if (engineRef.current) {
        engineRef.current.setVocalRemovalLevel(snapshot.vocalRemovalLevel);
        engineRef.current.setEQ(snapshot.eqSettings.bass, snapshot.eqSettings.mid, snapshot.eqSettings.treble);
        engineRef.current.setVolume(snapshot.volume);
      }
    }
  };

  // --- Comparison Handler ---
  const handleCompare = () => {
    setShowComparison(!showComparison);
  };

  // --- Export Handler ---
  const handleExport = async () => {
    if (!audioRef.current || !file) return;
    
    setIsExporting(true);
    try {
      const fileName = `${file.name.replace(/\.[^/.]+$/, '')}_vocals_removed.wav`;
      
      // Get audio duration
      const audioContext = engineRef.current?.audioContext;
      if (audioContext) {
        await AudioExporter.exportAsWAV(
          audioContext,
          engineRef.current?.destination,
          audioRef.current.duration,
          fileName
        );
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col items-center p-4 sm:p-6">
      {/* ============================================ HEADER ============================================ */}
      <header className="mb-8 text-center w-full relative">
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-0 right-0 w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-110"
          title="Settings"
        >
          ⚙️
        </button>
        <h1 className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pb-2">
          🎵 Vocal Remover AI
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2 font-light">
          Advanced Audio Processing with Gemini AI Lyrics Detection
        </p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ============================================ LEFT COLUMN: PLAYER & CONTROLS ============================================ */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* -------- 1. INPUT SOURCES -------- */}
          <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📁</span> Audio Source
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* File Upload */}
              <div className={`relative flex-1 group ${isLiveMode ? 'opacity-50' : ''}`}>
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition ${file ? 'opacity-25' : ''}`}></div>
                <div className="relative p-6 bg-slate-900/50 rounded-lg flex flex-col items-center justify-center border border-slate-600 h-32 sm:h-full hover:border-blue-500/50 transition-all cursor-pointer">
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <svg className="w-8 h-8 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="font-bold text-white">Upload Audio</span>
                  <span className="text-xs text-slate-400 mt-1 text-center">MP3, WAV, M4A...</span>
                  {file && <span className="text-xs text-green-400 mt-2">✓ {file.name.substring(0, 20)}</span>}
                </div>
              </div>

              {/* Live Mode */}
              <div className="relative flex-1 group cursor-pointer" onClick={isLiveMode ? stopLiveMode : startLiveMode}>
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition ${isLiveMode ? 'opacity-100 animate-pulse' : ''}`}></div>
                <div className={`relative p-6 bg-slate-900/50 rounded-lg flex flex-col items-center justify-center border h-32 sm:h-full transition-all ${isLiveMode ? 'border-red-500 bg-red-900/20' : 'border-slate-600 hover:border-orange-500/50'}`}>
                  <div className={`w-3 h-3 rounded-full mb-2 ${isLiveMode ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
                  <span className={`font-bold text-sm ${isLiveMode ? 'text-red-400' : 'text-white'}`}>
                    {isLiveMode ? 'Recording' : 'Live Mode'}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 text-center">
                    {isLiveMode ? '🎤 Mic Active' : 'Mic / Tab Audio'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* -------- 2. FREQUENCY VISUALIZER -------- */}
          <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> Frequency Analyzer
            </h2>
            <div className="bg-slate-900/50 rounded-lg overflow-hidden">
              <Visualizer 
                analyser={engineRef.current?.analyser || null} 
                isPlaying={isPlaying || isLiveMode} 
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Real-time frequency spectrum display</p>
          </section>

          {/* -------- 3. PLAYBACK CONTROLS -------- */}
          <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">▶️</span> Playback Control
            </h2>
            <Controls
              isPlaying={isPlaying}
              onPlayPause={togglePlay}
              vocalRemovalLevel={vocalRemovalLevel}
              onVocalRemovalChange={handleVocalRemovalChange}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              isLiveMode={isLiveMode}
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />
          </section>

          {/* -------- 4. EQUALIZER -------- */}
          {file && !isLiveMode && (
            <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎚️</span> 3-Band Equalizer
              </h2>
              <EQControls 
                eqSettings={eqSettings}
                onEQChange={handleEQChange}
              />
              <p className="text-xs text-slate-500 mt-3">Adjust Bass, Mid, and Treble frequencies</p>
            </section>
          )}

          {/* -------- 5. PRESETS -------- */}
          {file && !isLiveMode && (
            <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⭐</span> Quick Presets
              </h2>
              <Presets 
                onPresetSelect={handlePresetSelect}
              />
              <p className="text-xs text-slate-500 mt-3">Genre-optimized vocal removal profiles</p>
            </section>
          )}

          {/* -------- 6. ACTION BUTTONS -------- */}
          {file && !isLiveMode && (
            <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚙️</span> Actions
              </h2>
              <ActionButtons 
                hasFile={!!file && !isLiveMode}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onCompare={handleCompare}
                onExport={handleExport}
                isExporting={isExporting}
                showComparison={showComparison}
              />
              <p className="text-xs text-slate-500 mt-3">Undo changes, compare audio, and export results</p>
            </section>
          )}
        </div>

        {/* ============================================ RIGHT COLUMN: AI LYRICS & INFO ============================================ */}
        <div className="lg:col-span-1 flex flex-col gap-6 h-full">

          {/* -------- AI ANALYSIS -------- */}
          <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 backdrop-blur-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🤖</span> AI Lyrics
              </h2>
              {file && !isLiveMode && analysisStatus === ProcessingStatus.IDLE && (
                <button 
                  onClick={handleAnalyze}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full text-xs font-bold text-white transition-all hover:shadow-lg"
                >
                  Analyze 🔍
                </button>
              )}
              {analysisStatus === ProcessingStatus.ANALYZING && (
                <span className="text-xs text-yellow-400 animate-pulse font-semibold">Processing...</span>
              )}
            </div>

            <div className="flex-grow overflow-hidden relative">
              {isLiveMode && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-center p-4 gap-3">
                  <div className="text-4xl">❌</div>
                  <p className="text-sm">AI analysis not available in Live Mode</p>
                  <p className="text-xs text-slate-600">Upload a file to detect lyrics</p>
                </div>
              )}

              {!isLiveMode && analysisStatus === ProcessingStatus.IDLE && !metadata && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-center p-4">
                  <p className="text-sm">Upload and click Analyze to detect song info</p>
                </div>
              )}

              {analysisStatus === ProcessingStatus.ANALYZING && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs">Analyzing audio...</p>
                </div>
              )}

              {analysisStatus === ProcessingStatus.ERROR && (
                <div className="absolute inset-0 flex items-center justify-center text-red-400 text-center p-4">
                  <div className="text-sm">Failed to analyze. Check API Key or file size.</div>
                </div>
              )}

              {metadata && (
                <div className="h-full overflow-y-auto custom-scrollbar pr-2 space-y-4">
                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-4 rounded-lg border border-purple-700/50">
                    <h3 className="text-lg font-bold text-white">{metadata.title}</h3>
                    <p className="text-purple-300 text-sm">{metadata.artist}</p>
                    {metadata.album && <p className="text-xs text-slate-400 mt-1">Album: {metadata.album}</p>}
                    {metadata.detectedLanguage && <p className="text-xs text-slate-500 mt-1">🌐 {metadata.detectedLanguage}</p>}
                  </div>
                  
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-slate-300 mb-2">📝 Lyrics:</p>
                    <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-xs font-light max-h-96 overflow-y-auto custom-scrollbar">
                      {metadata.lyrics}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* -------- COMPARISON MODAL -------- */}
          <ComparisonModal 
            isOpen={showComparison}
            onClose={() => setShowComparison(false)}
            audioRef={audioRef}
          />
        </div>
      </div>

      {/* ============================================ SETTINGS MODAL ============================================ */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        onApiKeyChange={(newKey) => {
          setApiKey(newKey);
          localStorage.setItem('gemini_api_key', newKey);
        }}
      />

      {/* ============================================ FOOTER ============================================ */}
      <footer className="mt-12 text-center text-xs text-slate-500 border-t border-slate-800 pt-6 w-full max-w-6xl">
        <p>🎵 Powered by Web Audio API + Google Gemini 2.0 Flash</p>
        <p className="mt-1">Multi-band phase cancellation • 70-75% vocal removal effectiveness</p>
      </footer>
    </div>
  );
};

export default App;