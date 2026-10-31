import React from 'react';
import { X, CheckCircle2, Clock, Users, Lightbulb, Download, HelpCircle } from 'lucide-react';

interface SessionFacilitatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionFacilitatorModal: React.FC<SessionFacilitatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Facilitator & Participant Guide
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Teaching the 6-Component HTML Tool Framework
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              A structured guide for session leaders to guide participants in designing their own prompt and building a custom HTML tool.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-600 leading-relaxed">
          {/* Section 1: The 6 Pillars Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              The 6 Pillars Every Participant Must Define:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">1. Tool Goal & Objective</span>
                <p className="text-slate-600">
                  Participants must articulate the specific problem their HTML tool solves. Prompt: <em>"My goal is to create a file, an HTML file that can help participants of my session..."</em>
                </p>
              </div>

              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200">
                <span className="font-bold text-indigo-950 block mb-1">
                  2. Dynamic Inputs (The Core)
                </span>
                <p className="text-indigo-900">
                  Select the number of inputs and specify the 4 must-have elements: <strong>(1) Name</strong>, <strong>(2) File/Field Type</strong> (file upload, text file, text, number), <strong>(3) Validation Dropdown</strong>, and <strong>(4) Validation Details</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">3. Processing Engine & Logic</span>
                <p className="text-slate-600">
                  What calculations, conversions, or prompt assemblies happen when the participant submits? Real-time or submit-triggered?
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">4. Outputs & Deliverables</span>
                <p className="text-slate-600">
                  Define the tangible deliverable: formatted results, summary cards, and a 1-click downloadable standalone file.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">5. UI Layout & Visual Styling</span>
                <p className="text-slate-600">
                  Establish a clean theme (Clean Slate, Modern Indigo, Warm Editorial) and responsive layout (2-column split or stacked).
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">6. Guardrails & Standalone Constraints</span>
                <p className="text-slate-600">
                  100% self-contained single HTML file constraint (runs in any browser without npm, server, or build step) with inline error handling.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Recommended 30-Minute Workshop Schedule */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Suggested 30-Minute Session Flow:
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-16 font-mono font-bold text-slate-700 shrink-0">00–05 Min</div>
                <div>
                  <strong className="text-slate-900 block">Introduction to HTML Tools</strong>
                  Explain what a standalone single-file HTML tool is and demonstrate the live sandbox.
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-16 font-mono font-bold text-slate-700 shrink-0">05–15 Min</div>
                <div>
                  <strong className="text-slate-900 block">Defining the 4 Items for Every Input</strong>
                  Participants select their input count (e.g. 4) and configure Name, Type (File upload, Text file, Text, Number), Validation Dropdown, and Details.
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-16 font-mono font-bold text-slate-700 shrink-0">15–25 Min</div>
                <div>
                  <strong className="text-slate-900 block">Interactive Sandbox Testing & Verification</strong>
                  Participants test their tool in the live embedded preview: upload files, trigger validation dropdown rules, verify edge cases.
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-16 font-mono font-bold text-slate-700 shrink-0">25–30 Min</div>
                <div>
                  <strong className="text-slate-900 block">Exporting Prompts & Standalone HTML</strong>
                  Every participant downloads their working <code className="bg-slate-200 px-1 py-0.5 rounded">.html</code> file to take home and copies the AI master prompt.
                </div>
              </div>
            </div>
          </div>

          {/* Facilitator Tips */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Facilitator Tip:</strong>
              Emphasize to participants that standalone HTML tools do not require backend servers. By using standard browser APIs like <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">FileReader</code>, participants can build tools that read text files, CSVs, and documents securely on their local machine.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Got It, Back to Tool
          </button>
        </div>
      </div>
    </div>
  );
};
