import React, { useState, useMemo } from 'react';
import { ToolSpec } from '../types/toolSpec';
import { synthesizeStandaloneHTML } from '../utils/htmlToolSynthesizer';
import { generateMasterPrompt } from '../utils/promptGenerator';
import { Play, Copy, Download, Code2, Sparkles, RefreshCw, Check, ExternalLink, Github } from 'lucide-react';

interface LivePreviewPanelProps {
  spec: ToolSpec;
  onExportGitHub?: () => void;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({ spec, onExportGitHub }) => {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'prompt' | 'code'>('sandbox');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Synthesize code and prompt
  const htmlContent = useMemo(() => synthesizeStandaloneHTML(spec), [spec]);
  const masterPrompt = useMemo(() => generateMasterPrompt(spec), [spec]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(label);
      setTimeout(() => setCopyStatus(null), 2500);
    });
  };

  const handleDownloadHTML = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = spec.downloadableFileName || 'standalone-html-tool.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenSandboxTab = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-full min-h-[640px]">
      {/* Top Preview Bar */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3 bg-slate-50/70">
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sandbox'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'prompt'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Master Prompt</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Raw HTML Code</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'prompt' && (
            <button
              onClick={() => handleCopy(masterPrompt, 'Prompt')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copyStatus === 'Prompt' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Prompt!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          )}

          {activeTab === 'code' && (
            <button
              onClick={() => handleCopy(htmlContent, 'Code')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copyStatus === 'Code' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Code!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>
          )}

          {onExportGitHub && (
            <button
              onClick={onExportGitHub}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Export HTML tool and prompt to GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export to GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </button>
          )}

          <button
            onClick={handleDownloadHTML}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .html</span>
          </button>
        </div>
      </div>

      {/* Viewport Content */}
      <div className="flex-1 relative overflow-hidden bg-slate-100 min-h-[560px]">
        {activeTab === 'sandbox' && (
          <div className="w-full h-full flex flex-col">
            <div className="bg-slate-200/60 px-4 py-1.5 border-b border-slate-300 flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-mono truncate">
                Preview: {spec.toolName || 'Custom HTML Tool'} (Standalone Execution)
              </span>
              <button
                onClick={handleOpenSandboxTab}
                className="hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
                title="Open in new window"
              >
                <span>Pop Out</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <iframe
              title="Tool Sandbox Preview"
              srcDoc={htmlContent}
              sandbox="allow-scripts allow-forms allow-downloads"
              className="w-full flex-1 border-0 bg-slate-50"
            />
          </div>
        )}

        {activeTab === 'prompt' && (
          <div className="h-full flex flex-col p-4 bg-slate-900 text-slate-100 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="text-xs text-slate-400">
                AI Engineering Master Prompt · 6 Components Defined · Ready for Gemini / AI Studio
              </div>
              <button
                onClick={() => handleCopy(masterPrompt, 'Prompt')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Entire Prompt</span>
              </button>
            </div>
            <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-200 flex-1 select-all">
              {masterPrompt}
            </pre>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="h-full flex flex-col p-4 bg-slate-900 text-slate-100 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="text-xs text-slate-400 font-mono">
                {spec.downloadableFileName || 'standalone-html-tool.html'} · {htmlContent.length} bytes
              </div>
              <button
                onClick={() => handleCopy(htmlContent, 'Code')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full HTML Source</span>
              </button>
            </div>
            <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-300 flex-1 select-all">
              {htmlContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
