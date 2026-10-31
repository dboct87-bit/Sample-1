import React from 'react';
import { ToolSpec } from '../types/toolSpec';
import { ShieldCheck, AlertTriangle, CheckCircle, FileCode } from 'lucide-react';

interface GuardrailsComponentProps {
  spec: ToolSpec;
  onChange: (updates: Partial<ToolSpec>) => void;
}

export const GuardrailsComponent: React.FC<GuardrailsComponentProps> = ({ spec, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="pb-4 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Component 6 of 6
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Guardrails & Standalone Constraints
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Enforce client-side error handling, ensure the output runs as a 100% self-contained single HTML file, and safeguard edge cases.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Standalone Single File Constraint */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Standalone Single HTML File Constraint
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Guarantees the produced file is 100% self-contained. All styles, JavaScript logic, and FileReader handlers are embedded directly into one <code className="text-slate-800 bg-slate-200/70 px-1 py-0.5 rounded text-[11px]">.html</code> file. No server setup, no npm dependencies, no build steps required.
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Active & Enforced
              </span>
            </div>
          </div>

          {/* Validation Strategy */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Validation Strategy & Feedback
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'inline-errors' as const,
                  title: 'Inline Error Labels',
                  desc: 'Renders clear red error messages immediately beneath the invalid input without popup interruptions.',
                },
                {
                  id: 'toast-banner' as const,
                  title: 'Top Warning Banner',
                  desc: 'Summarizes all validation issues in a prominent sticky alert box above the form.',
                },
                {
                  id: 'disabled-submit' as const,
                  title: 'Disabled Submit Button',
                  desc: 'Prevents the action button from being clicked until all required fields pass validation.',
                },
              ].map((strat) => {
                const isSelected = spec.validationStrategy === strat.id;
                return (
                  <div
                    key={strat.id}
                    onClick={() => onChange({ validationStrategy: strat.id })}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/70 shadow-xs ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block mb-1">
                      {strat.title}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{strat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Edge Cases & Defensive Measures */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Edge Cases & Error Handling Specifications
            </label>
            <textarea
              rows={3}
              value={spec.edgeCaseHandling}
              onChange={(e) => onChange({ edgeCaseHandling: e.target.value })}
              placeholder="e.g. Alerts if uploaded file exceeds 5MB or contains non-UTF8 encoding; safely ignores empty optional inputs."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Passed directly into the generated AI prompt to ensure resilient code without unexpected uncaught runtime errors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
