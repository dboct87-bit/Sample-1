import { ToolSpec, ToolInput } from '../types/toolSpec';

export function synthesizeStandaloneHTML(spec: ToolSpec): string {
  const themeColors = {
    'clean-slate': {
      primary: 'bg-slate-900 hover:bg-slate-800 text-white',
      accent: 'text-slate-900',
      border: 'border-slate-200',
      badge: 'bg-slate-100 text-slate-800',
      cardBg: 'bg-white',
      ring: 'focus:ring-slate-900'
    },
    'modern-indigo': {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      accent: 'text-indigo-600',
      border: 'border-indigo-100',
      badge: 'bg-indigo-50 text-indigo-700',
      cardBg: 'bg-white',
      ring: 'focus:ring-indigo-600'
    },
    'emerald-minimal': {
      primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      accent: 'text-emerald-700',
      border: 'border-emerald-100',
      badge: 'bg-emerald-50 text-emerald-800',
      cardBg: 'bg-white',
      ring: 'focus:ring-emerald-600'
    },
    'warm-editorial': {
      primary: 'bg-stone-900 hover:bg-stone-800 text-white',
      accent: 'text-amber-800',
      border: 'border-stone-200',
      badge: 'bg-amber-50 text-amber-900',
      cardBg: 'bg-stone-50',
      ring: 'focus:ring-amber-700'
    }
  }[spec.theme] || {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white',
    accent: 'text-slate-900',
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-800',
    cardBg: 'bg-white',
    ring: 'focus:ring-slate-900'
  };

  const inputsHTML = spec.inputs.map((inp, idx) => {
    return generateInputFieldHTML(inp, idx, themeColors);
  }).join('\n');

  const validationRulesJS = JSON.stringify(spec.inputs.map(inp => ({
    id: inp.id,
    name: inp.name,
    type: inp.type,
    validation: inp.validation,
    validationDetails: inp.validationDetails,
    required: inp.required
  })), null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(spec.toolName || 'Custom HTML Tool')}</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    code, pre {
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header: Component 1 (Goal & Tool Name) -->
    <header class="bg-white border ${themeColors.border} rounded-xl p-6 sm:p-8 shadow-sm mb-6">
      <div class="flex items-center justify-between flex-wrap gap-4 border-b ${themeColors.border} pb-4 mb-4">
        <div>
          <span class="inline-block text-xs font-semibold tracking-wider text-slate-500 uppercase">Standalone HTML Tool</span>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">${escapeHtml(spec.toolName || 'Custom HTML Tool')}</h1>
        </div>
        <span class="px-3 py-1 text-xs font-medium rounded-full ${themeColors.badge}">
          ${spec.inputs.length} Configured Inputs
        </span>
      </div>
      <p class="text-slate-600 text-sm leading-relaxed">${escapeHtml(spec.goal || 'Custom session tool')}</p>
      <div class="mt-4 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-500">
        <div><strong class="text-slate-700">Audience:</strong> ${escapeHtml(spec.targetAudience || 'Session participants')}</div>
        <div><strong class="text-slate-700">Execution:</strong> Client-Side / Standalone (Zero Server)</div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Input Form: Component 2 (Dynamic Inputs) -->
      <section class="lg:col-span-7 bg-white border ${themeColors.border} rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-semibold text-slate-900">Configured Inputs & Validation</h2>
          <span class="text-xs text-slate-500">Live Client Validation</span>
        </div>

        <form id="toolForm" class="space-y-5" onsubmit="event.preventDefault(); processForm();">
          ${inputsHTML}

          <div class="pt-2">
            <button type="submit" id="submitBtn" class="w-full ${themeColors.primary} font-medium py-3 px-4 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 ${themeColors.ring} focus:ring-offset-2 flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <span>Execute & Generate Requirement</span>
            </button>
            <p id="formSummaryError" class="hidden text-xs text-rose-600 font-medium text-center mt-2">
              Please fix the highlighted input errors before executing.
            </p>
          </div>
        </form>
      </section>

      <!-- Results & Outputs: Component 3, 4, 6 -->
      <section class="lg:col-span-5 space-y-6">
        <!-- Output Panel -->
        <div class="bg-white border ${themeColors.border} rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-900">Output Deliverables</h2>
            <span id="statusBadge" class="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Awaiting Input
            </span>
          </div>

          <div id="emptyOutputState" class="py-8 text-center text-slate-500 text-sm">
            <svg class="w-10 h-10 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p>Provide values for the inputs on the left to trigger processing logic and view outputs.</p>
          </div>

          <div id="populatedOutputState" class="hidden space-y-4">
            <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 class="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Processed Summary</h3>
              <div id="outputSummaryContent" class="text-xs text-slate-700 space-y-1.5 font-mono"></div>
            </div>

            <!-- Structured Results View -->
            <div class="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xs font-bold text-emerald-800 uppercase tracking-wider">Requirement Output</h3>
                <span class="text-[11px] text-emerald-700 font-medium">Valid & Ready</span>
              </div>
              <div id="outputDetailedPayload" class="text-xs text-slate-800 bg-white p-3 rounded border border-emerald-100 max-h-48 overflow-y-auto whitespace-pre-wrap"></div>
            </div>

            <!-- Actions: Copy & Download -->
            <div class="flex flex-col gap-2 pt-2">
              <button type="button" onclick="copyOutputPayload()" class="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <span id="copyBtnText">Copy Requirement Output</span>
              </button>
              <button type="button" onclick="downloadArtifact()" class="w-full py-2 px-3 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>Download Generated File (${escapeHtml(spec.downloadableFileName || 'output.txt')})</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Processing Specs Note: Component 3 & 6 -->
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-600 space-y-2">
          <div class="font-semibold text-slate-800 flex items-center gap-1.5">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Processing Specifications</span>
          </div>
          <p class="leading-relaxed">${escapeHtml(spec.logicDescription)}</p>
          <div class="border-t border-slate-200 pt-2 text-[11px] text-slate-500">
            <strong>Guardrails:</strong> ${escapeHtml(spec.edgeCaseHandling)}
          </div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <footer class="mt-8 text-center text-xs text-slate-500 border-t border-slate-200 pt-6">
      Generated for Workshop Session Participants · Self-Contained Offline HTML Application
    </footer>
  </div>

  <script>
    const CONFIG_RULES = ${validationRulesJS};
    const FILE_STORAGE = {};
    let lastGeneratedPayload = '';

    // File input change handler for FileReader
    function handleFileInput(event, inputId, isTextFile) {
      const file = event.target.files[0];
      const previewEl = document.getElementById(inputId + '_preview');
      const errorEl = document.getElementById(inputId + '_error');

      if (!file) {
        FILE_STORAGE[inputId] = null;
        if (previewEl) previewEl.classList.add('hidden');
        return;
      }

      FILE_STORAGE[inputId] = {
        name: file.name,
        size: file.size,
        type: file.type,
        content: null
      };

      if (isTextFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const text = e.target.result;
          FILE_STORAGE[inputId].content = text;
          const lineCount = text.split(/\\r\\n|\\r|\\n/).length;
          if (previewEl) {
            previewEl.classList.remove('hidden');
            previewEl.innerHTML = \`
              <div class="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded p-2 mt-1">
                <span class="truncate max-w-[200px] font-medium">\${file.name}</span>
                <span>\${(file.size / 1024).toFixed(1)} KB · \${lineCount} lines</span>
              </div>
            \`;
          }
          validateField(inputId);
        };
        reader.onerror = function() {
          if (errorEl) {
            errorEl.textContent = 'Could not read text file.';
            errorEl.classList.remove('hidden');
          }
        };
        reader.readAsText(file);
      } else {
        if (previewEl) {
          previewEl.classList.remove('hidden');
          previewEl.innerHTML = \`
            <div class="flex items-center justify-between text-xs text-slate-700 bg-slate-100 border border-slate-200 rounded p-2 mt-1">
              <span class="truncate max-w-[200px] font-medium">\${file.name}</span>
              <span>\${(file.size / 1024).toFixed(1)} KB</span>
            </div>
          \`;
        }
        validateField(inputId);
      }
    }

    // Individual field validation
    function validateField(inputId) {
      const rule = CONFIG_RULES.find(r => r.id === inputId);
      if (!rule) return true;

      const inputEl = document.getElementById(inputId);
      const errorEl = document.getElementById(inputId + '_error');
      let isValid = true;
      let errorMsg = '';

      if (rule.type === 'file-upload' || rule.type === 'text-file') {
        const fileData = FILE_STORAGE[inputId];
        if (rule.required && !fileData) {
          isValid = false;
          errorMsg = 'File attachment is required.';
        } else if (fileData) {
          if (rule.validation === 'max_file_size_2mb' && fileData.size > 2 * 1024 * 1024) {
            isValid = false;
            errorMsg = 'File size exceeds 2 MB limit.';
          } else if (rule.validation === 'max_file_size_5mb' && fileData.size > 5 * 1024 * 1024) {
            isValid = false;
            errorMsg = 'File size exceeds 5 MB limit.';
          } else if (rule.validation === 'allowed_extensions_docs') {
            const ext = fileData.name.split('.').pop().toLowerCase();
            if (!['pdf', 'docx', 'txt'].includes(ext)) {
              isValid = false;
              errorMsg = 'Only .pdf, .docx, or .txt documents are allowed.';
            }
          } else if (rule.validation === 'allowed_extensions_images') {
            const ext = fileData.name.split('.').pop().toLowerCase();
            if (!['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
              isValid = false;
              errorMsg = 'Only image files (.png, .jpg, .webp) are allowed.';
            }
          } else if (rule.validation === 'csv_only_with_header') {
            const ext = fileData.name.split('.').pop().toLowerCase();
            if (ext !== 'csv') {
              isValid = false;
              errorMsg = 'Must be a .csv file.';
            }
          } else if (rule.validation === 'json_valid_syntax' && fileData.content) {
            try {
              JSON.parse(fileData.content);
            } catch (e) {
              isValid = false;
              errorMsg = 'Invalid JSON syntax: ' + e.message;
            }
          }
        }
      } else if (rule.type === 'boolean') {
        if (rule.validation === 'must_accept' && inputEl && !inputEl.checked) {
          isValid = false;
          errorMsg = 'This confirmation checkbox must be accepted.';
        }
      } else {
        const val = inputEl ? inputEl.value.trim() : '';

        if (rule.required && val === '') {
          isValid = false;
          errorMsg = rule.name + ' cannot be blank.';
        } else if (val !== '') {
          if (rule.validation === 'email_format') {
            const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
            if (!emailRegex.test(val)) {
              isValid = false;
              errorMsg = 'Please enter a valid email address (e.g. user@example.com).';
            }
          } else if (rule.validation === 'alphabetic_only') {
            const alphaRegex = /^[a-zA-Z\\s'-]+$/;
            if (!alphaRegex.test(val)) {
              isValid = false;
              errorMsg = 'Must contain only letters and spaces.';
            }
          } else if (rule.validation === 'alphanumeric') {
            const alnumRegex = /^[a-zA-Z0-9\\s]+$/;
            if (!alnumRegex.test(val)) {
              isValid = false;
              errorMsg = 'Must contain only letters and numbers.';
            }
          } else if (rule.validation === 'url_format') {
            const urlRegex = /^https?:\\/\\/[^\\s/$.?#].[^\\s]*$/i;
            if (!urlRegex.test(val)) {
              isValid = false;
              errorMsg = 'Must be a valid URL starting with http:// or https://';
            }
          } else if (rule.validation === 'positive_integer') {
            const num = Number(val);
            if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
              isValid = false;
              errorMsg = 'Must be a positive whole integer (> 0).';
            }
          } else if (rule.validation === 'range_min_max') {
            const num = Number(val);
            if (isNaN(num)) {
              isValid = false;
              errorMsg = 'Must be a valid number.';
            }
          } else if (rule.validation === 'percentage_0_100') {
            const num = Number(val);
            if (isNaN(num) || num < 0 || num > 100) {
              isValid = false;
              errorMsg = 'Percentage must be between 0 and 100.';
            }
          }
        }
      }

      if (errorEl) {
        if (!isValid) {
          errorEl.textContent = errorMsg;
          errorEl.classList.remove('hidden');
          if (inputEl) inputEl.classList.add('border-rose-400');
        } else {
          errorEl.textContent = '';
          errorEl.classList.add('hidden');
          if (inputEl) inputEl.classList.remove('border-rose-400');
        }
      }

      return isValid;
    }

    // Process all inputs on submit
    function processForm() {
      let allValid = true;
      CONFIG_RULES.forEach(r => {
        const fieldValid = validateField(r.id);
        if (!fieldValid) allValid = false;
      });

      const summaryError = document.getElementById('formSummaryError');
      if (!allValid) {
        if (summaryError) summaryError.classList.remove('hidden');
        return;
      }
      if (summaryError) summaryError.classList.add('hidden');

      // Assemble processed result payload
      const collectedData = {};
      CONFIG_RULES.forEach(r => {
        if (r.type === 'file-upload' || r.type === 'text-file') {
          const f = FILE_STORAGE[r.id];
          collectedData[r.name] = f ? { fileName: f.name, sizeBytes: f.size, preview: f.content ? f.content.substring(0, 300) : '[Binary File]' } : null;
        } else if (r.type === 'boolean') {
          const el = document.getElementById(r.id);
          collectedData[r.name] = el ? el.checked : false;
        } else {
          const el = document.getElementById(r.id);
          collectedData[r.name] = el ? el.value : '';
        }
      });

      // Update UI Output states
      document.getElementById('emptyOutputState').classList.add('hidden');
      document.getElementById('populatedOutputState').classList.remove('hidden');
      const statusBadge = document.getElementById('statusBadge');
      statusBadge.textContent = 'Processed Successfully';
      statusBadge.className = 'text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200';

      // Summary lines
      const summaryEl = document.getElementById('outputSummaryContent');
      summaryEl.innerHTML = Object.entries(collectedData).map(([k, v]) => {
        let displayVal = typeof v === 'object' && v !== null ? v.fileName : String(v);
        return \`<div class="flex justify-between border-b border-slate-200 pb-1">
          <span class="text-slate-600">\${k}:</span>
          <span class="font-bold text-slate-900 truncate max-w-[220px]">\${displayVal}</span>
        </div>\`;
      }).join('');

      // Formatted deliverable requirement
      const formattedOutput = \`=== HTML TOOL REQUIREMENT SPECIFICATION ===
Tool: ${escapeHtml(spec.toolName || 'Custom HTML Tool')}
Executed At: \${new Date().toISOString()}

[INPUT VALUES COLLECTED]
\${Object.entries(collectedData).map(([k, v]) => '- ' + k + ': ' + (typeof v === 'object' && v !== null ? v.fileName + ' (' + v.sizeBytes + ' bytes)' : v)).join('\\n')}

[EXECUTION LOGIC VERIFIED]
✓ Verified \${CONFIG_RULES.length} inputs against specified validation rules.
✓ File streams and data formats validated locally.
✓ Standalone single-file HTML execution successful.

[OUTPUT DELIVERABLE READY]\`;

      lastGeneratedPayload = formattedOutput;
      document.getElementById('outputDetailedPayload').textContent = formattedOutput;
    }

    function copyOutputPayload() {
      if (!lastGeneratedPayload) return;
      navigator.clipboard.writeText(lastGeneratedPayload).then(() => {
        const btnText = document.getElementById('copyBtnText');
        const old = btnText.textContent;
        btnText.textContent = 'Copied to Clipboard!';
        setTimeout(() => { btnText.textContent = old; }, 2000);
      });
    }

    function downloadArtifact() {
      if (!lastGeneratedPayload) return;
      const blob = new Blob([lastGeneratedPayload], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '${escapeHtml(spec.downloadableFileName || 'requirement-output.txt')}';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
}

function generateInputFieldHTML(inp: ToolInput, idx: number, themeColors: { border: string; badge: string; ring: string }): string {
  const isRequired = inp.required;
  const reqMark = isRequired ? '<span class="text-rose-500 font-bold ml-0.5">*</span>' : '<span class="text-slate-400 text-xs font-normal ml-1">(Optional)</span>';

  let inputControl = '';

  switch (inp.type) {
    case 'file-upload':
      inputControl = `
        <div class="mt-1">
          <input type="file" id="${inp.id}" onchange="handleFileInput(event, '${inp.id}', false)" class="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 ${themeColors.ring}">
          <div id="${inp.id}_preview" class="hidden"></div>
        </div>`;
      break;

    case 'text-file':
      inputControl = `
        <div class="mt-1">
          <input type="file" accept=".txt,.csv,.json,.md" id="${inp.id}" onchange="handleFileInput(event, '${inp.id}', true)" class="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-slate-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 ${themeColors.ring}">
          <div id="${inp.id}_preview" class="hidden"></div>
        </div>`;
      break;

    case 'number':
      inputControl = `
        <input type="number" id="${inp.id}" placeholder="${escapeHtml(inp.placeholder || 'Enter number')}" value="${escapeHtml(inp.defaultValue || '')}" oninput="validateField('${inp.id}')" class="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${themeColors.ring}">`;
      break;

    case 'textarea':
      inputControl = `
        <textarea id="${inp.id}" rows="3" placeholder="${escapeHtml(inp.placeholder || 'Enter details')}" oninput="validateField('${inp.id}')" class="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${themeColors.ring}">${escapeHtml(inp.defaultValue || '')}</textarea>`;
      break;

    case 'select': {
      const options = inp.selectOptions && inp.selectOptions.length > 0 ? inp.selectOptions : ['Option A', 'Option B', 'Option C'];
      inputControl = `
        <select id="${inp.id}" onchange="validateField('${inp.id}')" class="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${themeColors.ring} bg-white">
          <option value="">${escapeHtml(inp.placeholder || '-- Select an option --')}</option>
          ${options.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
        </select>`;
      break;
    }

    case 'date':
      inputControl = `
        <input type="date" id="${inp.id}" onchange="validateField('${inp.id}')" class="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${themeColors.ring} bg-white">`;
      break;

    case 'boolean':
      inputControl = `
        <div class="mt-2 flex items-center gap-2">
          <input type="checkbox" id="${inp.id}" onchange="validateField('${inp.id}')" class="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900">
          <label for="${inp.id}" class="text-xs text-slate-700">${escapeHtml(inp.placeholder || 'Confirm and activate')}</label>
        </div>`;
      break;

    case 'text':
    default:
      inputControl = `
        <input type="text" id="${inp.id}" placeholder="${escapeHtml(inp.placeholder || 'Enter text')}" value="${escapeHtml(inp.defaultValue || '')}" oninput="validateField('${inp.id}')" class="w-full mt-1 px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${themeColors.ring}">`;
      break;
  }

  return `
    <div class="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
      <div class="flex items-center justify-between mb-1">
        <label for="${inp.id}" class="block text-xs font-semibold text-slate-800">
          <span class="text-slate-400 font-mono mr-1">${idx + 1}.</span>
          ${escapeHtml(inp.name || 'Input ' + (idx + 1))}
          ${reqMark}
        </label>
        <span class="text-[11px] text-slate-500 font-mono">
          Rule: ${escapeHtml(inp.validationDetails || inp.validation)}
        </span>
      </div>
      ${inputControl}
      <p id="${inp.id}_error" class="hidden text-xs text-rose-600 font-medium mt-1"></p>
    </div>
  `;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
