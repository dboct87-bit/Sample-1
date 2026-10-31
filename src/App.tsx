/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ToolSpec } from './types/toolSpec';
import { WORKSHOP_PRESETS } from './data/workshopPresets';
import { TopBar } from './components/TopBar';
import { ComponentNavigation, ComponentTab } from './components/ComponentNavigation';
import { GoalComponent } from './components/GoalComponent';
import { InputsComponent } from './components/InputsComponent';
import { LogicComponent } from './components/LogicComponent';
import { OutputsComponent } from './components/OutputsComponent';
import { UIThemeComponent } from './components/UIThemeComponent';
import { GuardrailsComponent } from './components/GuardrailsComponent';
import { LivePreviewPanel } from './components/LivePreviewPanel';
import { SessionFacilitatorModal } from './components/SessionFacilitatorModal';
import { GitHubExportModal } from './components/GitHubExportModal';
import { synthesizeStandaloneHTML } from './utils/htmlToolSynthesizer';
import { generateMasterPrompt } from './utils/promptGenerator';
import { BookOpen, Sparkles, CheckCircle2, Download, RefreshCw, Eye, Github } from 'lucide-react';

export default function App() {
  // Initialize with the user's default goal and 4 configured inputs
  const [spec, setSpec] = useState<ToolSpec>(WORKSHOP_PRESETS[0].spec);
  const [activeTab, setActiveTab] = useState<ComponentTab>('inputs');
  const [isFacilitatorGuideOpen, setIsFacilitatorGuideOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'builder' | 'preview' | 'prompt'>('builder');

  const handleUpdateSpec = (updates: Partial<ToolSpec>) => {
    setSpec((prev) => ({
      ...prev,
      ...updates,
      inputCount: updates.inputs ? updates.inputs.length : prev.inputCount,
    }));
  };

  const handleApplyPreset = (presetSpec: ToolSpec) => {
    setSpec(presetSpec);
  };

  const handleExportHTML = () => {
    const html = synthesizeStandaloneHTML(spec);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = spec.downloadableFileName || 'standalone-html-tool.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar following Top Bar Contract */}
      <TopBar
        onExportHTML={handleExportHTML}
        onExportGitHub={() => setIsGitHubModalOpen(true)}
        onOpenFacilitatorGuide={() => setIsFacilitatorGuideOpen(true)}
        activeSection={activeSection}
        onSelectSection={(sec) => {
          if (sec === 'preview' || sec === 'prompt') {
            setActiveSection(sec);
            // Scroll to preview on mobile/smaller screens
            const el = document.getElementById('preview-panel');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
            setActiveSection('builder');
          }
        }}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Session Kicker & Hero Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Workshop Participant Tool</span>
                <span>·</span>
                <span className="text-indigo-600 font-bold">6-Component Framework</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                HTML Tool Prompt & Requirement Architect
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Design custom HTML tools for session participants. Specify multiple dynamic inputs with 4 mandatory parameters
                (Name, Type, Validation from Dropdown, and Details), preview in real-time, and export directly to GitHub or download standalone files.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setIsFacilitatorGuideOpen(true)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                <span>Facilitator Guide</span>
              </button>
              <button
                type="button"
                onClick={() => setIsGitHubModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Export to GitHub</span>
              </button>
              <button
                type="button"
                onClick={handleExportHTML}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download HTML Tool</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Strip */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-600">Sample Session Templates:</span>
              {WORKSHOP_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.spec)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    spec.toolName === preset.spec.toolName
                      ? 'bg-slate-900 text-white font-medium shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {preset.title.split('(')[0].trim()}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Inputs Configured: <strong className="text-slate-800">{spec.inputs.length}</strong> · Standalone: <span className="text-emerald-700 font-semibold">Ready</span>
            </div>
          </div>
        </div>

        {/* 6-Component Navigation Tabs */}
        <ComponentNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          inputCount={spec.inputs.length}
        />

        {/* Two-Column Workspace: 6-Component Builder (Left) + Live Preview Sandbox (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Active Component Form (7 Cols) */}
          <div className="lg:col-span-7">
            {activeTab === 'goal' && (
              <GoalComponent
                spec={spec}
                onChange={handleUpdateSpec}
                onApplyPreset={handleApplyPreset}
              />
            )}

            {activeTab === 'inputs' && (
              <InputsComponent
                inputs={spec.inputs}
                onChangeInputs={(newInputs) => handleUpdateSpec({ inputs: newInputs })}
              />
            )}

            {activeTab === 'logic' && (
              <LogicComponent spec={spec} onChange={handleUpdateSpec} />
            )}

            {activeTab === 'outputs' && (
              <OutputsComponent spec={spec} onChange={handleUpdateSpec} />
            )}

            {activeTab === 'ui' && (
              <UIThemeComponent spec={spec} onChange={handleUpdateSpec} />
            )}

            {activeTab === 'guardrails' && (
              <GuardrailsComponent spec={spec} onChange={handleUpdateSpec} />
            )}
          </div>

          {/* Right Column: Live Sandboxed HTML Preview & Prompt Generator (5 Cols) */}
          <div id="preview-panel" className="lg:col-span-5 sticky top-22">
            <LivePreviewPanel
              spec={spec}
              onExportGitHub={() => setIsGitHubModalOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Session Facilitator Modal */}
      <SessionFacilitatorModal
        isOpen={isFacilitatorGuideOpen}
        onClose={() => setIsFacilitatorGuideOpen(false)}
      />

      {/* GitHub Exporter Modal */}
      <GitHubExportModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        spec={spec}
        htmlContent={synthesizeStandaloneHTML(spec)}
        promptContent={generateMasterPrompt(spec)}
      />
    </div>
  );
}
