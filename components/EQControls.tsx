import React from 'react';
import { EQSettings } from '../types';

interface EQControlsProps {
  eqSettings: EQSettings;
  onEQChange: (eqSettings: EQSettings) => void;
}

const EQControls: React.FC<EQControlsProps> = ({ eqSettings, onEQChange }) => {
  const handleChange = (band: 'bass' | 'mid' | 'treble', value: number) => {
    onEQChange({
      ...eqSettings,
      [band]: value
    });
  };

  const getBandColor = (band: 'bass' | 'mid' | 'treble') => {
    switch (band) {
      case 'bass': return 'accent-red-500 hover:accent-red-400';
      case 'mid': return 'accent-yellow-500 hover:accent-yellow-400';
      case 'treble': return 'accent-blue-500 hover:accent-blue-400';
    }
  };

  const getBandLabel = (band: 'bass' | 'mid' | 'treble') => {
    switch (band) {
      case 'bass': return '🔴 Bass';
      case 'mid': return '🟡 Mid';
      case 'treble': return '🔵 Treble';
    }
  };

  return (
    <div className="space-y-4">
      {(['bass', 'mid', 'treble'] as const).map((band) => (
        <div key={band} className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{getBandLabel(band)}</span>
            <span className="text-slate-300 font-mono">
              {eqSettings[band] > 0 ? '+' : ''}{eqSettings[band].toFixed(1)} dB
            </span>
          </div>
          <input
            type="range"
            min={-6}
            max={6}
            step={0.1}
            value={eqSettings[band]}
            onChange={(e) => handleChange(band, Number(e.target.value))}
            className={`w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer transition-all ${getBandColor(band)}`}
          />
        </div>
      ))}

      {/* Reset EQ */}
      <button
        onClick={() => onEQChange({ bass: 0, mid: 0, treble: 0 })}
        className="w-full text-xs py-2 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 text-slate-300 transition-all"
      >
        Reset EQ
      </button>
    </div>
  );
};

export default EQControls;
