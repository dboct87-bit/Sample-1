import React from 'react';
import { Target, Sliders, Cpu, FileCheck, Palette, ShieldAlert } from 'lucide-react';

export type ComponentTab = 'goal' | 'inputs' | 'logic' | 'outputs' | 'ui' | 'guardrails';

interface ComponentNavigationProps {
  activeTab: ComponentTab;
  onSelectTab: (tab: ComponentTab) => void;
  inputCount: number;
}

export const ComponentNavigation: React.FC<ComponentNavigationProps> = ({
  activeTab,
  onSelectTab,
  inputCount,
}) => {
  const tabs = [
    {
      id: 'goal' as ComponentTab,
      number: '1',
      label: 'Goal',
      sublabel: 'Objective & Problem',
      icon: Target,
    },
    {
      id: 'inputs' as ComponentTab,
      number: '2',
      label: 'Inputs',
      sublabel: `${inputCount} Configured`,
      icon: Sliders,
      badge: inputCount,
    },
    {
      id: 'logic' as ComponentTab,
      number: '3',
      label: 'Processing Logic',
      sublabel: 'Calculations & Rules',
      icon: Cpu,
    },
    {
      id: 'outputs' as ComponentTab,
      number: '4',
      label: 'Outputs',
      sublabel: 'Deliverables & File',
      icon: FileCheck,
    },
    {
      id: 'ui' as ComponentTab,
      number: '5',
      label: 'UI & Layout',
      sublabel: 'Theme & UX Styling',
      icon: Palette,
    },
    {
      id: 'guardrails' as ComponentTab,
      number: '6',
      label: 'Guardrails',
      sublabel: 'Validation & Standalone',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${
                  isActive ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold truncate leading-tight">
                    {tab.label}
                  </span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isActive
                          ? 'bg-slate-800 text-slate-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] truncate leading-tight ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {tab.sublabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
