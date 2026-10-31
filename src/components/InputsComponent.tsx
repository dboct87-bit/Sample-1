import React from 'react';
import { ToolInput, InputType, VALIDATION_OPTIONS_BY_TYPE } from '../types/toolSpec';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, FileText, Upload, Hash, Type, Calendar, CheckSquare, ListFilter, AlertCircle } from 'lucide-react';

interface InputsComponentProps {
  inputs: ToolInput[];
  onChangeInputs: (newInputs: ToolInput[]) => void;
}

export const InputsComponent: React.FC<InputsComponentProps> = ({
  inputs,
  onChangeInputs,
}) => {
  // Preset counts helper
  const handleSetCount = (targetCount: number) => {
    if (targetCount <= 0) return;
    if (targetCount > inputs.length) {
      const added: ToolInput[] = [];
      for (let i = inputs.length; i < targetCount; i++) {
        added.push(createDefaultInput(i + 1));
      }
      onChangeInputs([...inputs, ...added]);
    } else if (targetCount < inputs.length) {
      onChangeInputs(inputs.slice(0, targetCount));
    }
  };

  const handleAddInput = () => {
    const nextIdx = inputs.length + 1;
    onChangeInputs([...inputs, createDefaultInput(nextIdx)]);
  };

  const handleRemoveInput = (id: string) => {
    if (inputs.length <= 1) {
      alert('At least one input is required for the HTML tool.');
      return;
    }
    onChangeInputs(inputs.filter((i) => i.id !== id));
  };

  const handleDuplicateInput = (index: number) => {
    const source = inputs[index];
    const duplicated: ToolInput = {
      ...source,
      id: `inp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${source.name} (Copy)`,
    };
    const updated = [...inputs];
    updated.splice(index + 1, 0, duplicated);
    onChangeInputs(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === inputs.length - 1)
    ) {
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...inputs];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChangeInputs(updated);
  };

  const handleUpdateInput = (id: string, updates: Partial<ToolInput>) => {
    onChangeInputs(
      inputs.map((inp) => {
        if (inp.id !== id) return inp;
        const merged = { ...inp, ...updates };

        // If the type changed, automatically reset validation to the first valid option for that type
        if (updates.type && updates.type !== inp.type) {
          const validOpts = VALIDATION_OPTIONS_BY_TYPE[updates.type];
          if (validOpts && validOpts.length > 0) {
            merged.validation = validOpts[0].value;
            merged.validationDetails = validOpts[0].defaultDetail;
          }
        }

        // If validation changed, populate defaultDetail if currently empty or matches previous default
        if (updates.validation) {
          const currentOpts = VALIDATION_OPTIONS_BY_TYPE[merged.type] || [];
          const matched = currentOpts.find((o) => o.value === updates.validation);
          if (matched && (!inp.validationDetails || inp.validationDetails === 'Standard field constraints')) {
            merged.validationDetails = matched.defaultDetail;
          }
        }

        return merged;
      })
    );
  };

  const getTypeIcon = (type: InputType) => {
    switch (type) {
      case 'file-upload':
        return <Upload className="w-4 h-4 text-slate-700" />;
      case 'text-file':
        return <FileText className="w-4 h-4 text-indigo-700" />;
      case 'number':
        return <Hash className="w-4 h-4 text-emerald-700" />;
      case 'select':
        return <ListFilter className="w-4 h-4 text-amber-700" />;
      case 'date':
        return <Calendar className="w-4 h-4 text-blue-700" />;
      case 'boolean':
        return <CheckSquare className="w-4 h-4 text-purple-700" />;
      default:
        return <Type className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Component 2 of 6
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              Dynamic Inputs & Validation Architecture
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Participants select the number of inputs. For <strong>every input</strong>, define the 4 essential specifications:
              (1) Input Name, (2) File / Input Type, (3) Validation (from dropdown), and (4) Validation Details & Parameters.
            </p>
          </div>

          {/* Quick Number of Inputs Selector */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-800">Select Number of Inputs:</span>
              <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                {inputs.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 8].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleSetCount(count)}
                  className={`w-7 h-7 text-xs font-semibold rounded transition-colors cursor-pointer ${
                    inputs.length === count
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {count}
                </button>
              ))}
              <button
                type="button"
                onClick={handleAddInput}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer shadow-xs ml-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Input</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Required Items Pill Guide */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">1. Input Name</span>
            <span className="text-slate-500 text-[11px]">Human-readable label for the user</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">2. File / Field Type</span>
            <span className="text-slate-500 text-[11px]">File upload, text file, text, number, etc.</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">3. Validation Rule</span>
            <span className="text-slate-500 text-[11px]">Selected directly from dropdown</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">4. Validation Details</span>
            <span className="text-slate-500 text-[11px]">Parameters, size bounds, placeholder</span>
          </div>
        </div>

        {/* List of Defined Inputs */}
        <div className="mt-6 space-y-4">
          {inputs.map((inp, idx) => {
            const validationOptions = VALIDATION_OPTIONS_BY_TYPE[inp.type] || [];
            const selectedValObj = validationOptions.find((v) => v.value === inp.validation);

            return (
              <div
                key={inp.id}
                className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs hover:border-slate-300 transition-colors"
              >
                {/* Input Card Header & Reorder Controls */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {idx + 1}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getTypeIcon(inp.type)}
                      <span className="text-sm font-bold text-slate-900">
                        {inp.name || `Input #${idx + 1}`}
                      </span>
                    </div>
                    {inp.required ? (
                      <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        Required
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Optional
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === inputs.length - 1}
                      title="Move Down"
                      className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateInput(idx)}
                      title="Duplicate Input"
                      className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveInput(inp.id)}
                      title="Delete Input"
                      className="p-1 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* The 4 Specified Items */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* 1. Name of the Input */}
                  <div className="md:col-span-4">
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      1. Input Name / Label
                    </label>
                    <input
                      type="text"
                      value={inp.name}
                      onChange={(e) => handleUpdateInput(inp.id, { name: e.target.value })}
                      placeholder="e.g. Customer Name, Dataset File"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>

                  {/* 2. File Type / Input Type */}
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      2. Type (File or Data)
                    </label>
                    <select
                      value={inp.type}
                      onChange={(e) => handleUpdateInput(inp.id, { type: e.target.value as InputType })}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    >
                      <option value="text">Text (Single-Line)</option>
                      <option value="text-file">Text File (.txt, .csv, .json)</option>
                      <option value="file-upload">File Upload (Binary, PDF, Image)</option>
                      <option value="number">Number (Integer / Decimal)</option>
                      <option value="textarea">Textarea (Multi-Line)</option>
                      <option value="select">Select / Dropdown</option>
                      <option value="date">Date Picker</option>
                      <option value="boolean">Toggle / Checkbox</option>
                    </select>
                  </div>

                  {/* 3. Validation Required (FROM DROPDOWN) */}
                  <div className="md:col-span-5">
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      3. Validation Rule (Dropdown)
                    </label>
                    <select
                      value={inp.validation}
                      onChange={(e) => handleUpdateInput(inp.id, { validation: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    >
                      {validationOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {selectedValObj && (
                      <p className="text-[11px] text-slate-500 mt-1 truncate">
                        {selectedValObj.description}
                      </p>
                    )}
                  </div>

                  {/* 4. Validation Details, Constraints & Helper */}
                  <div className="md:col-span-8">
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      4. Validation Details & Helper Note
                    </label>
                    <input
                      type="text"
                      value={inp.validationDetails}
                      onChange={(e) => handleUpdateInput(inp.id, { validationDetails: e.target.value })}
                      placeholder="e.g. Max 5MB (.csv, .xlsx), or Min: 3 chars, Max: 50 chars"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                    />
                  </div>

                  {/* Required Switch & Placeholder */}
                  <div className="md:col-span-4 flex items-center justify-between gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={inp.required}
                        onChange={(e) => handleUpdateInput(inp.id, { required: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-700">Required Field</span>
                    </label>

                    <div className="flex-1 min-w-[120px]">
                      <input
                        type="text"
                        value={inp.placeholder || ''}
                        onChange={(e) => handleUpdateInput(inp.id, { placeholder: e.target.value })}
                        placeholder="Placeholder text"
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  {/* If dropdown/select: show options editor */}
                  {inp.type === 'select' && (
                    <div className="md:col-span-12 bg-amber-50/60 border border-amber-200 rounded-lg p-3">
                      <label className="block text-xs font-semibold text-amber-900 mb-1">
                        Dropdown Choice Options (Comma separated)
                      </label>
                      <input
                        type="text"
                        value={(inp.selectOptions || []).join(', ')}
                        onChange={(e) =>
                          handleUpdateInput(inp.id, {
                            selectOptions: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Option A, Option B, Option C"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Input Footer CTA */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Total active input specifications: <strong className="text-slate-800">{inputs.length}</strong>
          </p>
          <button
            type="button"
            onClick={handleAddInput}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Input</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function createDefaultInput(index: number): ToolInput {
  const sampleConfigs: Array<{ name: string; type: InputType; val: string; detail: string }> = [
    { name: 'Session Participant Name', type: 'text', val: 'required_non_empty', detail: 'Min 2 characters' },
    { name: 'Requirement Specification Document', type: 'text-file', val: 'required_text_file', detail: '.txt, .csv, or .json' },
    { name: 'Target Item Count', type: 'number', val: 'range_min_max', detail: 'Min: 1, Max: 20' },
    { name: 'Reference Mockup / Diagram', type: 'file-upload', val: 'max_file_size_5mb', detail: 'Max 5MB (.png, .pdf)' },
    { name: 'Project Category', type: 'select', val: 'required_selection', detail: 'One of pre-set categories' },
  ];

  const preset = sampleConfigs[(index - 1) % sampleConfigs.length];

  return {
    id: `inp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: preset.name,
    type: preset.type,
    validation: preset.val,
    validationDetails: preset.detail,
    placeholder: `Enter ${preset.name.toLowerCase()}`,
    required: true,
  };
}
