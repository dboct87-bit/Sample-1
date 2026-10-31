import React from 'react';
import { ToolSpec } from '../types/toolSpec';
import { Palette, Columns, Layers, Smartphone } from 'lucide-react';

interface UIThemeComponentProps {
  spec: ToolSpec;
  onChange: (updates: Partial<ToolSpec>) => void;
}

export const UIThemeComponent: React.FC<UIThemeComponentProps> = ({ spec, onChange }) => {
  const themes = [
    {
      id: 'clean-slate' as const,
      name: 'Clean Slate & Graphite',
      desc: 'Subtle slate borders, crisp monochrome hierarchy, high readability for workshop sessions.',
      colorClass: 'bg-slate-900 border-slate-700',
    },
    {
      id: 'modern-indigo' as const,
      name: 'Modern Indigo SaaS',
      desc: 'Indigo accents, soft indigo focus rings, modern tech and developer aesthetic.',
      colorClass: 'bg-indigo-600 border-indigo-500',
    },
    {
      id: 'emerald-minimal' as const,
      name: 'Emerald Minimal',
      desc: 'Fresh emerald validation indicators, balanced typography, clean data collection feel.',
      colorClass: 'bg-emerald-600 border-emerald-500',
    },
    {
      id: 'warm-editorial' as const,
      name: 'Warm Stone Editorial',
      desc: 'Warm neutral stone surfaces, refined typographic contrast, executive workshop feel.',
      colorClass: 'bg-amber-800 border-amber-700',
    },
  ];

  const layouts = [
    {
      id: 'split-preview' as const,
      name: '2-Column Split (Form & Live Output)',
      desc: 'Inputs on the left, live outputs and file actions sticky on the right. Best for desktop session participation.',
      icon: Columns,
    },
    {
      id: 'single-page' as const,
      name: 'Single Column Stack',
      desc: 'Sequential top-to-bottom flow. Ideal for mobile or tablet devices.',
      icon: Smartphone,
    },
    {
      id: 'stepped-wizard' as const,
      name: 'Stepped Step-by-Step Flow',
      desc: 'Input groupings broken into clean progressive disclosure stages.',
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="pb-4 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Component 5 of 6
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            UI Layout & Styling Theme
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Select the visual palette, container layout geometry, and responsive experience for the generated HTML tool.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Theme Palette */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Color Palette & Visual Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((theme) => {
                const isSelected = spec.theme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => onChange({ theme: theme.id })}
                    className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/70 shadow-xs ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className={`w-4 h-4 rounded-full ${theme.colorClass}`} />
                      <span className="text-xs font-bold text-slate-900">{theme.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{theme.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Layout Structure */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Layout Structure
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {layouts.map((lay) => {
                const Icon = lay.icon;
                const isSelected = spec.layout === lay.id;
                return (
                  <div
                    key={lay.id}
                    onClick={() => onChange({ layout: lay.id })}
                    className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/70 shadow-xs ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900">{lay.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{lay.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* UX Guidance Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              User Experience Guidance Notes
            </label>
            <textarea
              rows={2}
              value={spec.userExperienceNotes}
              onChange={(e) => onChange({ userExperienceNotes: e.target.value })}
              placeholder="e.g. Crisp single-page dashboard with clear validation error highlights and instant copy action."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
