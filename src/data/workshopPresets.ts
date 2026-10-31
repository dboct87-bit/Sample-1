import { ToolSpec } from '../types/toolSpec';

export const WORKSHOP_PRESETS: { id: string; title: string; subtitle: string; spec: ToolSpec }[] = [
  {
    id: 'html-tool-prompt-builder',
    title: 'Session Prompt Architect (Default Goal)',
    subtitle: 'Helps session participants specify inputs, validations & generate an HTML tool prompt',
    spec: {
      toolName: 'HTML Tool Prompt & Requirement Generator',
      goal: 'To create a standalone HTML file that helps session participants formulate structured prompts for custom HTML tools, specifying dynamic inputs, exact validation rules, processing logic, and instant single-file deliverables.',
      targetAudience: 'Workshop participants, educators, prompt engineering trainees, and citizen developers',
      problemSolved: 'Participants often struggle to formulate precise prompts for AI tools with clear input data types, validation constraints, and self-contained execution rules.',
      inputCount: 4,
      inputs: [
        {
          id: 'inp-1',
          name: 'Participant Full Name',
          type: 'text',
          validation: 'required_non_empty',
          validationDetails: 'Mandatory field (Min 2 characters)',
          placeholder: 'e.g. Sarah Jenkins',
          required: true
        },
        {
          id: 'inp-2',
          name: 'Target Requirement Specification File',
          type: 'text-file',
          validation: 'required_text_file',
          validationDetails: 'Accepts .txt, .csv, or .json with requirement notes',
          placeholder: 'Upload requirements.txt or prompt_draft.md',
          required: true
        },
        {
          id: 'inp-3',
          name: 'Target Number of Tool Fields',
          type: 'number',
          validation: 'range_min_max',
          validationDetails: 'Min: 1 field, Max: 12 fields',
          placeholder: '4',
          required: true,
          defaultValue: '4'
        },
        {
          id: 'inp-4',
          name: 'Supporting Asset / Mockup File',
          type: 'file-upload',
          validation: 'max_file_size_5mb',
          validationDetails: 'Allowed: .png, .jpg, .pdf (Max 5MB)',
          placeholder: 'Upload reference wireframe or diagram',
          required: false
        }
      ],
      logicDescription: 'Parses all input specifications, evaluates validation rules client-side, reads the text file content into a prompt context, and formats the output into an AI-ready prompt block and live interactive standalone HTML code.',
      calculationType: 'on-submit',
      processingSteps: [
        '1. Inspect input values and execute type-specific validation rules',
        '2. Read text-file contents asynchronously using FileReader API',
        '3. Assemble structured JSON schema and prompt blueprint',
        '4. Render live interactive preview and generate downloadable HTML file'
      ],
      outputTypes: ['downloadable-html', 'interactive-prompt', 'summary-cards'],
      deliverableDescription: 'A standalone HTML tool with interactive form fields, live validation feedback, formatted prompt preview, and 1-click download button.',
      downloadableFileName: 'participant-html-tool.html',
      theme: 'clean-slate',
      layout: 'split-preview',
      userExperienceNotes: 'Crisp single-page dashboard with clear validation error highlights and instant copy action.',
      standaloneRequirement: true,
      validationStrategy: 'inline-errors',
      edgeCaseHandling: 'Gracefully alerts user if uploaded file exceeds 5MB or contains invalid text encoding; disables generator button when required fields are empty.'
    }
  },
  {
    id: 'csv-data-profiler',
    title: 'CSV Data Profiler & Cleaner Tool',
    subtitle: 'Upload CSV text file, configure row count, and inspect column summary',
    spec: {
      toolName: 'CSV Data Inspector & Profiler',
      goal: 'Allow business users to upload a spreadsheet file or paste CSV text, validate column structures, and generate summary metrics and clean exports.',
      targetAudience: 'Data analysts, operations teams, and inventory managers',
      problemSolved: 'Non-technical users need quick local data verification without uploading sensitive rows to external servers.',
      inputCount: 4,
      inputs: [
        {
          id: 'csv-inp-1',
          name: 'Dataset CSV File',
          type: 'text-file',
          validation: 'csv_only_with_header',
          validationDetails: 'Must be comma-separated with header row',
          placeholder: 'Select sales_data.csv',
          required: true
        },
        {
          id: 'csv-inp-2',
          name: 'Expected Row Threshold',
          type: 'number',
          validation: 'positive_integer',
          validationDetails: 'Whole number > 0 (e.g. 50)',
          placeholder: '50',
          required: true,
          defaultValue: '50'
        },
        {
          id: 'csv-inp-3',
          name: 'Notification Email',
          type: 'text',
          validation: 'email_format',
          validationDetails: 'Standard email address',
          placeholder: 'analyst@company.com',
          required: true
        },
        {
          id: 'csv-inp-4',
          name: 'Include Raw Data Export',
          type: 'boolean',
          validation: 'optional_toggle',
          validationDetails: 'Toggle for export bundling',
          placeholder: 'Checked = yes',
          required: false
        }
      ],
      logicDescription: 'Reads CSV lines in the browser, calculates row count, identifies unique columns, flags empty cells, and creates statistical cards.',
      calculationType: 'on-submit',
      processingSteps: [
        '1. Check file extension is .csv and size < 5MB',
        '2. Parse first row to extract column names',
        '3. Count populated rows and compare against Expected Row Threshold',
        '4. Display summary stats with clean table preview'
      ],
      outputTypes: ['data-table', 'summary-cards', 'downloadable-html'],
      deliverableDescription: 'Local interactive data inspection table with missing-value alerts and column distribution metrics.',
      downloadableFileName: 'csv-profiler.html',
      theme: 'modern-indigo',
      layout: 'split-preview',
      userExperienceNotes: 'Fast drag-and-drop file zone with immediate tabular display.',
      standaloneRequirement: true,
      validationStrategy: 'inline-errors',
      edgeCaseHandling: 'Notifies when delimiter is semicolon instead of comma; safely truncates large displays to first 50 rows.'
    }
  },
  {
    id: 'workshop-badge-maker',
    title: 'Participant Badge & Certificate Generator',
    subtitle: 'Generate customized HTML participant badges with QR placeholders',
    spec: {
      toolName: 'Session Badge & Certificate Studio',
      goal: 'Produce printable, styled session attendee badges and completion certificates in HTML format directly from participant inputs.',
      targetAudience: 'Workshop facilitators, conference organizers, and course instructors',
      problemSolved: 'Generating individualized participant credentials quickly during live interactive sessions.',
      inputCount: 4,
      inputs: [
        {
          id: 'bdg-1',
          name: 'Attendee Full Name',
          type: 'text',
          validation: 'alphabetic_only',
          validationDetails: 'Letters and spaces only (Min 3 chars)',
          placeholder: 'Alex Morgan',
          required: true
        },
        {
          id: 'bdg-2',
          name: 'Attendee Headshot Avatar',
          type: 'file-upload',
          validation: 'allowed_extensions_images',
          validationDetails: '.png, .jpg, or .webp (Max 2MB)',
          placeholder: 'Upload photo',
          required: false
        },
        {
          id: 'bdg-3',
          name: 'Assigned Table Number',
          type: 'number',
          validation: 'range_min_max',
          validationDetails: 'Range: 1 to 30',
          placeholder: '12',
          required: true,
          defaultValue: '1'
        },
        {
          id: 'bdg-4',
          name: 'Workshop Track',
          type: 'select',
          validation: 'required_selection',
          validationDetails: 'Must select track',
          placeholder: 'Select track',
          required: true,
          selectOptions: ['Foundations of AI Tools', 'Advanced Prompt Engineering', 'Full-Stack Rapid Prototyping']
        }
      ],
      logicDescription: 'Renders an official conference-style badge layout with attendee photo, badge tier styling, and printable CSS media print rules.',
      calculationType: 'realtime',
      processingSteps: [
        '1. Validate attendee name length and characters',
        '2. Convert avatar image to base64 Data URL for standalone offline inclusion',
        '3. Populate badge card with track styling and table assignment',
        '4. Offer one-click print and HTML download'
      ],
      outputTypes: ['summary-cards', 'downloadable-html'],
      deliverableDescription: 'Print-ready attendee badge layout with live preview and download capability.',
      downloadableFileName: 'attendee-badge.html',
      theme: 'emerald-minimal',
      layout: 'split-preview',
      userExperienceNotes: 'Instant visual card updates as participant types.',
      standaloneRequirement: true,
      validationStrategy: 'inline-errors',
      edgeCaseHandling: 'Falls back to initials circle if no photo is attached; validates that table number does not exceed 30.'
    }
  }
];
