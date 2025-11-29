import React, { useState } from 'react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, audioRef }) => {
  const [isOriginal, setIsOriginal] = useState(true);

  if (!isOpen || !audioRef.current) return null;

  const toggleMode = () => {
    setIsOriginal(!isOriginal);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">👀 A/B Comparison</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Comparison Display */}
        <div className="bg-slate-900/50 rounded-lg p-6 text-center space-y-4">
          <div className="text-6xl">
            {isOriginal ? '🎵' : '🎤'}
          </div>
          
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              {isOriginal ? 'Original' : 'Vocals Removed'}
            </div>
            <div className="text-sm text-slate-400">
              {isOriginal 
                ? 'Listening to original mix'
                : 'Listening with vocal removal processing'}
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleMode}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold text-white transition-all transform hover:scale-105"
          >
            ⇄ Switch Mode
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-slate-700/30 rounded-lg p-4 text-xs text-slate-400 space-y-2">
          <p>📌 <strong>How to use:</strong></p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Click "Switch Mode" to toggle between original and processed</li>
            <li>Use the play button to hear the difference</li>
            <li>Notice how the vocal removal affects the mix</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 text-slate-200 font-bold transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ComparisonModal;
