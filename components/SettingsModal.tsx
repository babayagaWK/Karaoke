import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onApiKeyChange
}) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onApiKeyChange(tempApiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setTempApiKey(apiKey);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">⚙️</span> Settings
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-all text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700"></div>

        {/* Settings Content */}
        <div className="space-y-6">
          {/* API Key Section */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="text-2xl mt-1">🔑</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">Google Gemini API Key</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Required for AI-powered lyrics detection and song identification
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-3">
              <div className="flex gap-2">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="AIzaSyD1234567890abcdefghijk..."
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-all"
                  title={showApiKey ? "Hide key" : "Show key"}
                >
                  {showApiKey ? "👁️" : "🔒"}
                </button>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p>📌 <strong>How to get API Key:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Visit <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">https://ai.google.dev/</a></li>
                  <li>Click "Get API Key"</li>
                  <li>Sign in with Google account</li>
                  <li>Copy your API key and paste it here</li>
                </ol>
              </div>

              <div className="text-xs text-yellow-600 bg-yellow-900/30 p-3 rounded border border-yellow-700/50">
                ⚠️ <strong>Security Notice:</strong> Your API key is stored locally in browser storage only. Never share it publicly.
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="text-2xl mt-1">ℹ️</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">Features Status</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Which features require API key and which work offline
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-3">
              {/* Works without API Key */}
              <div>
                <p className="text-sm font-semibold text-green-400 mb-2">✅ Works Without API Key (Offline):</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>• Vocal Removal (70-75%)</div>
                  <div>• EQ Controls (3-band)</div>
                  <div>• 6 Genre Presets</div>
                  <div>• Visualizer</div>
                  <div>• Undo/Redo</div>
                  <div>• A/B Comparison</div>
                  <div>• Export as WAV</div>
                  <div>• Live Audio Input</div>
                </div>
              </div>

              {/* Requires API Key */}
              <div className="border-t border-slate-700 pt-3">
                <p className="text-sm font-semibold text-blue-400 mb-2">🔑 Requires API Key:</p>
                <div className="text-xs text-slate-300">
                  <div>• AI Lyrics Detection</div>
                  <div>• Song Title & Artist Recognition</div>
                  <div>• Automatic Lyrics Extraction</div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="text-2xl mt-1">🎵</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">About This App</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Application information and technology stack
                </p>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2 text-sm text-slate-300">
              <div><strong>Version:</strong> 1.0.0</div>
              <div><strong>Technology:</strong> React 19 + TypeScript + Web Audio API</div>
              <div><strong>Vocal Removal:</strong> Multi-band phase cancellation (70-75% effective)</div>
              <div><strong>AI Provider:</strong> Google Gemini 2.0 Flash</div>
              <div><strong>Browser Support:</strong> Chrome, Firefox, Safari, Edge</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700"></div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg text-white font-semibold transition-all flex items-center gap-2"
          >
            <span>💾</span> Save Settings
          </button>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-green-400 text-sm font-semibold flex items-center gap-2">
            <span>✅</span> Settings saved successfully! Restart the app to apply changes.
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
