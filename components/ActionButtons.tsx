import React from 'react';

interface ActionButtonsProps {
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onCompare: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isExporting: boolean;
  hasFile: boolean;
  showComparison?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onUndo,
  onRedo,
  onExport,
  onCompare,
  canUndo,
  canRedo,
  isExporting,
  hasFile,
  showComparison
}) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
      <h3 className="text-sm font-bold text-slate-200 mb-3">⚙️ Actions</h3>

      <div className="grid grid-cols-2 gap-2">
        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded border transition-all text-xs font-bold flex items-center justify-center gap-2 ${
            canUndo
              ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 cursor-pointer'
              : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          <span>↶</span> Undo
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded border transition-all text-xs font-bold flex items-center justify-center gap-2 ${
            canRedo
              ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 cursor-pointer'
              : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          <span>↷</span> Redo
        </button>

        {/* Compare */}
        <button
          onClick={onCompare}
          disabled={!hasFile}
          className={`p-2 rounded border transition-all text-xs font-bold flex items-center justify-center gap-2 ${
            hasFile
              ? showComparison
                ? 'bg-purple-600 border-purple-500 text-white cursor-pointer ring-2 ring-purple-400'
                : 'bg-slate-700 hover:bg-purple-700 border-slate-600 hover:border-purple-600 text-slate-200 cursor-pointer'
              : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          <span>👀</span> Compare
        </button>

        {/* Export */}
        <button
          onClick={onExport}
          disabled={isExporting || !hasFile}
          className={`p-2 rounded border transition-all text-xs font-bold flex items-center justify-center gap-2 ${
            !isExporting && hasFile
              ? 'bg-green-700 hover:bg-green-600 border-green-600 text-white cursor-pointer'
              : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          <span>{isExporting ? '⏳' : '💾'}</span>
          {isExporting ? 'Exporting...' : 'Export'}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
