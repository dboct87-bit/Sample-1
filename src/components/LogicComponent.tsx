import React from 'react';
import { ToolSpec } from '../types/toolSpec';
import { Cpu, Play, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface LogicComponentProps {
  spec: ToolSpec;
  onChange: (updates: Partial<ToolSpec>) => void;
}

export const LogicComponent: React.FC<LogicComponentProps> = ({ spec, onChange }) => {
  const handleAddStep = () => {
    const nextIdx = spec.processingSteps.length + 1;
    onChange({
      processingSteps: [...spec.processingSteps, `${nextIdx}. Next validation or calculation step`],
    });
  };

  const handleUpdateStep = (index: number, val: string) => {
    const updated = [...spec.processingSteps];
    updated[index] = val;
    onChange({ processingSteps: updated });
  };

  const handleRemoveStep = (index: number) => {
    const updated = spec.processingSteps.filter((_, i) => i !== index);
    onChange({ processingSteps: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="pb-4 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Component 3 of 6
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Processing Engine & Calculation Logic
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Specify how user inputs are evaluated, what calculations, transformations, or prompt assembly occurs, and when the processing fires.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {/* Execution Trigger */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Execution Trigger
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onChange({ calculationType: 'on-submit' })}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  spec.calculationType === 'on-submit'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">On Primary Submit Button</span>
                  <Play className={`w-3.5 h-3.5 ${spec.calculationType === 'on-submit' ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <p className={`text-[11px] ${spec.calculationType === 'on-submit' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Runs full validation across all inputs, processes file streams, and reveals deliverables upon button click.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onChange({ calculationType: 'realtime' })}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                  spec.calculationType === 'realtime'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">Real-Time Reactive Updates</span>
                  <Cpu className={`w-3.5 h-3.5 ${spec.calculationType === 'realtime' ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <p className={`text-[11px] ${spec.calculationType === 'realtime' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Calculations, format transformations, and output previews immediately update as the participant types or uploads files.
                </p>
              </button>
            </div>
          </div>

          {/* Logic Narrative */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Core Processing & Transformation Logic
            </label>
            <textarea
              rows={3}
              value={spec.logicDescription}
              onChange={(e) => onChange({ logicDescription: e.target.value })}
              placeholder="Describe the calculations, parsing, text transforms, or prompt assembling that happens..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 leading-relaxed"
            />
          </div>

          {/* Step by Step Logic Execution */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-800">
                Step-by-Step Processing Sequence
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Processing Step</span>
              </button>
            </div>

            <div className="space-y-2">
              {spec.processingSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 text-xs font-mono font-bold text-slate-400 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleUpdateStep(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    disabled={spec.processingSteps.length <= 1}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
