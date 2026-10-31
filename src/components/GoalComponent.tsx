import React from 'react';
import { ToolSpec } from '../types/toolSpec';
import { Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { WORKSHOP_PRESETS } from '../data/workshopPresets';

interface GoalComponentProps {
  spec: ToolSpec;
  onChange: (updates: Partial<ToolSpec>) => void;
  onApplyPreset: (presetSpec: ToolSpec) => void;
}

export const GoalComponent: React.FC<GoalComponentProps> = ({
  spec,
  onChange,
  onApplyPreset,
}) => {
  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Component 1 of 6
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Tool Goal & Core Objective
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Define what this standalone HTML tool aims to accomplish for session participants, who will use it, and what requirement it fulfills.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Workshop Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {WORKSHOP_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onApplyPreset(preset.spec)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                  title={preset.subtitle}
                >
                  {preset.title.split('(')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {/* Tool Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              HTML Tool Name / Title
            </label>
            <input
              type="text"
              value={spec.toolName}
              onChange={(e) => onChange({ toolName: e.target.value })}
              placeholder="e.g. HTML Tool Prompt & Requirement Generator"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              The headline title rendered at the top of the exported HTML file.
            </p>
          </div>

          {/* Primary Goal */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Primary Goal (Session Objective)
              </label>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    goal: 'To create a file, an HTML file that can help participants of my session to develop their own prompt for HTML tool, which can generate their requirement.',
                  })
                }
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                Insert Session Prompt Goal
              </button>
            </div>
            <textarea
              rows={3}
              value={spec.goal}
              onChange={(e) => onChange({ goal: e.target.value })}
              placeholder="State clearly what the tool will do..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This core statement anchors the AI prompt and defines what calculations and outputs will be created.
            </p>
          </div>

          {/* Target Audience & Problem Solved */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Target Audience / Participants
              </label>
              <input
                type="text"
                value={spec.targetAudience}
                onChange={(e) => onChange({ targetAudience: e.target.value })}
                placeholder="e.g. Session participants, prompt engineers"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Problem Solved / User Benefit
              </label>
              <input
                type="text"
                value={spec.problemSolved}
                onChange={(e) => onChange({ problemSolved: e.target.value })}
                placeholder="e.g. Eliminates manual prompt formulation errors"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Goal Validation Checklist */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
          Component 1 Verification Checklist
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${spec.toolName ? 'text-emerald-600' : 'text-slate-300'}`} />
            <span>Descriptive Tool Title declared</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${spec.goal.length > 20 ? 'text-emerald-600' : 'text-slate-300'}`} />
            <span>Clear participant goal defined</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${spec.targetAudience ? 'text-emerald-600' : 'text-slate-300'}`} />
            <span>Target session persona identified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
