import React from 'react';
import { Download, Sparkles, BookOpen, Github } from 'lucide-react';

interface TopBarProps {
  onExportHTML: () => void;
  onExportGitHub: () => void;
  onOpenFacilitatorGuide: () => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onExportHTML,
  onExportGitHub,
  onOpenFacilitatorGuide,
  activeSection,
  onSelectSection,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single element, whitespace-nowrap) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
            HT
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            HTML Tool Architect
          </span>
        </div>

        {/* Zone 2: Navigation Links (single-line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectSection('builder')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 cursor-pointer ${
              activeSection === 'builder' ? 'text-slate-900 font-semibold' : ''
            }`}
          >
            6-Component Builder
          </button>
          <button
            onClick={() => onSelectSection('preview')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 cursor-pointer ${
              activeSection === 'preview' ? 'text-slate-900 font-semibold' : ''
            }`}
          >
            Live Tool Sandbox
          </button>
          <button
            onClick={() => onSelectSection('prompt')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 cursor-pointer ${
              activeSection === 'prompt' ? 'text-slate-900 font-semibold' : ''
            }`}
          >
            AI Master Prompt
          </button>
          <button
            onClick={onOpenFacilitatorGuide}
            className="flex items-center gap-1.5 whitespace-nowrap transition-colors text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Session Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportGitHub}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Export to GitHub</span>
          </button>
          <button
            onClick={onExportHTML}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export HTML</span>
          </button>
        </div>
      </div>
    </header>
  );
};
