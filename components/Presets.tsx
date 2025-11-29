import React from 'react';
import { Preset } from '../types';
import { PRESETS } from '../services/presets';

interface PresetsProps {
  onPresetSelect: (preset: Preset) => void;
}

const PresetsComponent: React.FC<PresetsProps> = ({ onPresetSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {PRESETS.map((preset) => (
        <button
          key={preset.name}
          onClick={() => onPresetSelect(preset)}
          className="p-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 rounded-lg transition-all text-center"
        >
          <div className="text-2xl mb-1">{preset.icon}</div>
          <div className="text-xs font-bold text-slate-200">{preset.name}</div>
          <div className="text-[10px] text-slate-400">{preset.vocalRemovalLevel}%</div>
        </button>
      ))}
    </div>
  );
};

export default PresetsComponent;