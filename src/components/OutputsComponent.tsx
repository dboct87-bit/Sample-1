import React from 'react';
import { ToolSpec } from '../types/toolSpec';
import { FileCode, FileSpreadsheet, LayoutTemplate, Copy, Check } from 'lucide-react';

interface OutputsComponentProps {
  spec: ToolSpec;
  onChange: (updates: Partial<ToolSpec>) => void;
}

export const OutputsComponent: React.FC<OutputsComponentProps> = ({ spec, onChange }) => {
  const availableOutputs = [
    {
      id: 'downloadable-html',
      label: 'Downloadable Standalone HTML File',
      desc: 'Users can download the tool as a single .html file that opens locally in any browser.',
      icon: FileCode,
    },
    {
      id: 'interactive-prompt',
      label: 'AI-Ready Prompt Block with 1-Click Copy',
      desc: 'Generates a pristine prompt that can be pasted into AI Studio / Gemini / Claude.',
      icon: Copy,
    },
    {
      id: 'summary-cards',
      label: 'Visual Summary KPI Cards',
      desc: 'Displays computed totals, status badges, and validated input counts.',
      icon: LayoutTemplate,
    },
    {
      id: 'data-table',
      label: 'Formatted Data Table & Export',
      desc: 'Tabular rendering of processed rows with CSV or JSON data export.',
      icon: FileSpreadsheet,
    },
  ];

  const toggleOutput = (id: string) => {
    const exists = spec.outputTypes.includes(id);
    if (exists && spec.outputTypes.length <= 1) {
      alert('At least one output format must be enabled.');
      return;
    }
    const updated = exists
      ? spec.outputTypes.filter((o) => o !== id)
      : [...spec.outputTypes, id];
    onChange({ outputTypes: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="pb-4 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Component 4 of 6
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Outputs & Deliverables Architecture
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Configure what tangible artifacts the HTML tool generates for session participants—including local file downloads, prompt blocks, and summary dashboards.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          {/* Output Types Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Deliverable Formats
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableOutputs.map((item) => {
                const Icon = item.icon;
                const isChecked = spec.outputTypes.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleOutput(item.id)}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isChecked
                        ? 'border-slate-900 bg-slate-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isChecked ? 'text-slate-900' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-white text-[10px] ${
                          isChecked ? 'bg-slate-900' : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deliverable Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Deliverable Description & Presentation
            </label>
            <textarea
              rows={3}
              value={spec.deliverableDescription}
              onChange={(e) => onChange({ deliverableDescription: e.target.value })}
              placeholder="Describe how the generated results appear to the participant..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 leading-relaxed"
            />
          </div>

          {/* Download File Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Target Download File Name (.html or .txt)
            </label>
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={spec.downloadableFileName}
                onChange={(e) => onChange({ downloadableFileName: e.target.value })}
                placeholder="my-session-tool.html"
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Participants will download the file under this default name.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
