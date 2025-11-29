import React from 'react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  vocalRemovalLevel: number;
  onVocalRemovalChange: (level: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLiveMode: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, 
  onPlayPause, 
  vocalRemovalLevel,
  onVocalRemovalChange,
  currentTime, 
  duration, 
  onSeek,
  isLiveMode,
  volume,
  onVolumeChange
}) => {
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-slate-800/80 backdrop-blur-md rounded-xl sm:rounded-2xl border border-slate-700 shadow-xl p-0">
      
      {/* -------- PROGRESS BAR (File Mode Only) -------- */}
      {!isLiveMode && (
        <div className="px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">⏱️ Progress</label>
            <span className="text-xs text-slate-500 font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
        </div>
      )}

      {/* LIVE MODE INDICATOR */}
      {isLiveMode && (
        <div className="px-4 sm:px-5 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-0">
          <div className="flex items-center gap-2 py-2 px-3 text-xs text-red-400 font-semibold bg-red-900/30 rounded-lg border border-red-900/50 animate-pulse">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
            <span>🎤 LIVE INPUT ACTIVE - Audio streaming from microphone</span>
          </div>
        </div>
      )}

      <div className="px-4 sm:px-5 md:px-6 flex flex-col gap-4">
        
        {/* -------- VOLUME CONTROL -------- */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <span>🔊 Output Volume</span>
              <span className="text-xs font-normal text-slate-500">(Master Gain)</span>
            </label>
            <span className="text-sm font-bold text-green-400 bg-green-900/30 px-2.5 py-1 rounded">{Math.round(volume * 100)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="flex-grow h-2.5 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Mute</span>
            <span>Normal</span>
            <span>Loud</span>
          </div>
        </div>

        {/* -------- VOCAL REMOVAL LEVEL -------- */}
        <div className="space-y-2 pt-2 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <span>🎤 Vocal Removal</span>
              <span className="text-xs font-normal text-slate-500">(Intensity)</span>
            </label>
            <span className="text-sm font-bold text-purple-400 bg-purple-900/30 px-2.5 py-1 rounded">{vocalRemovalLevel}%</span>
          </div>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 10H17a1 1 0 001-1v-3a1 1 0 00-1-1h-3z" />
            </svg>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={vocalRemovalLevel}
              onChange={(e) => onVocalRemovalChange(Number(e.target.value))}
              className="flex-grow h-2.5 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Original (0%)</span>
            <span>50% Removal</span>
            <span>Maximum (100%)</span>
          </div>
          <div className="text-xs text-slate-400 bg-slate-900/30 p-2 rounded mt-2">
            {vocalRemovalLevel === 0 
              ? "📊 Hearing original audio with full vocals"
              : vocalRemovalLevel < 50 
                ? "🎵 Reduced vocals - instruments clearer"
                : vocalRemovalLevel < 80
                  ? "🎸 Strong removal - mostly instruments"
                  : "🥁 Extreme removal - percussion dominant"}
          </div>
        </div>

        {/* -------- PLAY/PAUSE BUTTON -------- */}
        <div className="pt-2 border-t border-slate-700">
          {!isLiveMode ? (
            <button
              onClick={onPlayPause}
              className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all active:scale-95 shadow-lg border border-blue-500/50"
            >
              {isPlaying ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>⏸️ PAUSE</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>▶️ PLAY</span>
                </>
              )}
            </button>
          ) : (
            <div className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-3 bg-red-900/50 text-red-400 font-bold border border-red-500/50">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>🎙️ LISTENING - Vocal removal applied in real-time</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controls;