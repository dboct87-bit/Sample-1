import { ToolSpec } from '../types/toolSpec';

export function generateMasterPrompt(spec: ToolSpec): string {
  const inputsFormatted = spec.inputs.map((inp, idx) => {
    return `### Input ${idx + 1}: ${inp.name}
- **Type**: \`${inp.type}\` (${inp.type === 'file-upload' ? 'Binary/Media File Upload' : inp.type === 'text-file' ? 'Text/Data File (.txt, .csv, .json)' : inp.type})
- **Required**: ${inp.required ? 'Yes (Mandatory)' : 'No (Optional)'}
- **Validation Rule (from Dropdown)**: \`${inp.validation}\`
- **Validation Criteria & Details**: ${inp.validationDetails || 'Standard field constraints'}
${inp.placeholder ? `- **Placeholder / Helper**: "${inp.placeholder}"` : ''}
${inp.defaultValue ? `- **Default Value**: "${inp.defaultValue}"` : ''}
${inp.selectOptions && inp.selectOptions.length > 0 ? `- **Allowed Options**: ${inp.selectOptions.join(', ')}` : ''}`;
  }).join('\n\n');

  const stepsFormatted = spec.processingSteps.map((step) => `- ${step}`).join('\n');
  const outputsFormatted = spec.outputTypes.map((ot) => `- ${ot}`).join('\n');

  return `You are a Principal Frontend Software Engineer and Tool Architect.
Your task is to build a complete, production-ready, standalone single-file HTML application (.html) that satisfies the exact 6-component specification outlined below.

=======================================================
SPECIFICATION OF THE 6 PILLARS
=======================================================

1. COMPONENT 1: GOAL & PURPOSE
- Tool Title: "${spec.toolName}"
- Primary Objective: ${spec.goal}
- Target Audience: ${spec.targetAudience}
- Problem Solved: ${spec.problemSolved}

2. COMPONENT 2: DYNAMIC INPUTS SPECIFICATION
Number of Defined Inputs: ${spec.inputs.length}
Every input has 4 explicit parameters (Name, Type, Validation from Dropdown, and Validation Details):

${inputsFormatted}

3. COMPONENT 3: PROCESSING LOGIC & ENGINE
- Calculation / Execution Trigger: \`${spec.calculationType}\` (${spec.calculationType === 'realtime' ? 'Calculate in real-time as user interacts' : 'Execute on primary Submit/Process click'})
- Core Processing Logic: ${spec.logicDescription}
- Processing Sequence:
${stepsFormatted}

4. COMPONENT 4: OUTPUTS & DELIVERABLES
- Output Formats:
${outputsFormatted}
- Deliverable Specification: ${spec.deliverableDescription}
- Target File Download Name: \`${spec.downloadableFileName || 'generated-tool.html'}\`

5. COMPONENT 5: UI LAYOUT & VISUAL THEME
- Design Theme: ${spec.theme}
- Layout Geometry: ${spec.layout}
- Styling Stack: Modern responsive Tailwind CSS (via CDN) + clean typography
- User Experience Notes: ${spec.userExperienceNotes}

6. COMPONENT 6: GUARDRAILS, VALIDATION & STANDALONE CONSTRAINTS
- Standalone Execution Constraint: The output MUST be a 100% self-contained single HTML file with embedded CSS and JavaScript. No build step, no npm dependencies, no Node server required. It must run immediately when opened locally in Google Chrome, Safari, Firefox, or Edge.
- Validation Feedback Strategy: \`${spec.validationStrategy}\` (Show clear, accessible error messages adjacent to failing inputs without disruptive browser modal alerts).
- Edge Cases & Resiliency: ${spec.edgeCaseHandling}
- File Handling: Use standard browser FileReader API for text files (.txt, .csv, .json) and Blob URLs or Data URLs for media. Never assume a backend endpoint exists.

=======================================================
IMPLEMENTATION REQUIREMENTS FOR THE GENERATED HTML FILE
=======================================================
1. Structure the document with semantic HTML5 elements: \`<header>\`, \`<main>\`, \`<section>\`, \`<form>\`, \`<footer>\`.
2. Include Tailwind CSS CDN (\`https://cdn.tailwindcss.com\`) and Google Fonts for crisp typography.
3. For EVERY input defined in Component 2:
   - Render the appropriate HTML form element (file input with custom drag-and-drop dropzone, text input, number input, select dropdown, etc.).
   - Implement client-side JavaScript validation matching the specified validation rule and details.
   - Display a red validation indicator and helper message if the user enters invalid data or uploads an unauthorized file type/size.
4. Implement the processing logic described in Component 3. If file uploads are included, read their text or metadata using \`FileReader\` and process them inside the client.
5. Provide a clear Outputs section as defined in Component 4, including:
   - Visual result cards / formatted tables
   - A 1-click "Copy Result" button with visual feedback
   - A 1-click "Download Deliverable" button utilizing Blob and \`URL.createObjectURL\`
6. Return only the complete, un-truncated, pristine \`<!DOCTYPE html>\` code.`;
}
