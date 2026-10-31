export type InputType =
  | 'text'
  | 'file-upload'
  | 'text-file'
  | 'number'
  | 'textarea'
  | 'select'
  | 'date'
  | 'boolean';

export interface ToolInput {
  id: string;
  name: string; // 1. Name of the input
  type: InputType; // 2. File type / input type
  validation: string; // 3. Validation required (from dropdown)
  validationDetails: string; // 4. Details/parameters for validation & helper
  placeholder?: string;
  required: boolean;
  defaultValue?: string;
  selectOptions?: string[]; // For dropdown/select
}

export interface ToolSpec {
  // Component 1: Goal
  toolName: string;
  goal: string;
  targetAudience: string;
  problemSolved: string;

  // Component 2: Inputs
  inputCount: number;
  inputs: ToolInput[];

  // Component 3: Processing Logic & Calculations
  logicDescription: string;
  calculationType: 'realtime' | 'on-submit' | 'step-by-step';
  processingSteps: string[];

  // Component 4: Outputs & Deliverables
  outputTypes: string[];
  deliverableDescription: string;
  downloadableFileName: string;

  // Component 5: UI & Styling
  theme: 'clean-slate' | 'modern-indigo' | 'warm-editorial' | 'emerald-minimal';
  layout: 'split-preview' | 'stepped-wizard' | 'single-page';
  userExperienceNotes: string;

  // Component 6: Guardrails & Standalone Constraints
  standaloneRequirement: boolean;
  validationStrategy: 'inline-errors' | 'toast-banner' | 'disabled-submit';
  edgeCaseHandling: string;
}

export interface ValidationOption {
  value: string;
  label: string;
  description: string;
  defaultDetail: string;
}

export const VALIDATION_OPTIONS_BY_TYPE: Record<InputType, ValidationOption[]> = {
  'file-upload': [
    {
      value: 'required_any_file',
      label: 'Required (Any file uploaded)',
      description: 'User must attach at least one file before proceeding',
      defaultDetail: 'Must not be empty'
    },
    {
      value: 'max_file_size_2mb',
      label: 'Max File Size (2 MB)',
      description: 'File cannot exceed 2 Megabytes in size',
      defaultDetail: 'Max 2MB'
    },
    {
      value: 'max_file_size_5mb',
      label: 'Max File Size (5 MB)',
      description: 'File cannot exceed 5 Megabytes in size',
      defaultDetail: 'Max 5MB'
    },
    {
      value: 'allowed_extensions_docs',
      label: 'Allowed Formats: Documents (.pdf, .docx, .txt)',
      description: 'Only PDF, Word, or plain text documents accepted',
      defaultDetail: '.pdf, .docx, .txt'
    },
    {
      value: 'allowed_extensions_images',
      label: 'Allowed Formats: Images (.png, .jpg, .webp)',
      description: 'Only standard web images accepted',
      defaultDetail: '.png, .jpg, .jpeg, .webp'
    },
    {
      value: 'custom_extension_and_size',
      label: 'Custom Extension & Max Size',
      description: 'Participant specifies custom allowed file extensions and maximum MB',
      defaultDetail: '.pdf, .csv (Max 10MB)'
    },
    {
      value: 'optional_file',
      label: 'Optional (No validation)',
      description: 'User can optionally attach a file or leave empty',
      defaultDetail: 'Optional'
    }
  ],
  'text-file': [
    {
      value: 'required_text_file',
      label: 'Required Text/Data File (.txt, .csv, .json)',
      description: 'Must upload a plain text, CSV, or JSON document',
      defaultDetail: '.txt, .csv, .json'
    },
    {
      value: 'csv_only_with_header',
      label: 'CSV File Only (Must have header row)',
      description: 'Requires comma-separated values with column names in row 1',
      defaultDetail: '.csv format with header line'
    },
    {
      value: 'json_valid_syntax',
      label: 'Valid JSON Format (Strict parse)',
      description: 'Must parse cleanly as JSON object or array without syntax error',
      defaultDetail: '.json valid schema'
    },
    {
      value: 'max_lines_limit',
      label: 'Line Limit (Max 500 lines)',
      description: 'File must contain between 1 and 500 lines',
      defaultDetail: '1 to 500 lines'
    },
    {
      value: 'optional_text_file',
      label: 'Optional Text File',
      description: 'Text file input is optional for the user',
      defaultDetail: 'Optional'
    }
  ],
  'text': [
    {
      value: 'required_non_empty',
      label: 'Required (Cannot be blank)',
      description: 'Must contain at least 1 non-whitespace character',
      defaultDetail: 'Mandatory field'
    },
    {
      value: 'email_format',
      label: 'Valid Email Address format',
      description: 'Must conform to user@domain.com pattern',
      defaultDetail: 'user@example.com'
    },
    {
      value: 'min_max_length',
      label: 'Length Bounds (e.g. 3 to 60 characters)',
      description: 'Constrains character count between minimum and maximum',
      defaultDetail: 'Min: 3 chars, Max: 60 chars'
    },
    {
      value: 'alphabetic_only',
      label: 'Letters & Spaces Only (No digits/symbols)',
      description: 'Accepts only alphabetic characters, spaces, and hyphens',
      defaultDetail: 'Alpha only'
    },
    {
      value: 'alphanumeric',
      label: 'Alphanumeric Only (Letters & digits)',
      description: 'Restricts input to numbers and letters',
      defaultDetail: 'A-Z, 0-9'
    },
    {
      value: 'url_format',
      label: 'Valid Web URL (https://...)',
      description: 'Must start with http:// or https:// with valid hostname',
      defaultDetail: 'https://example.com'
    },
    {
      value: 'phone_number',
      label: 'Phone Number format',
      description: 'Standard 10-digit or international format',
      defaultDetail: '10 digits or +1 format'
    },
    {
      value: 'optional_text',
      label: 'Optional (Any text allowed)',
      description: 'Can be left empty or filled freely',
      defaultDetail: 'Optional'
    }
  ],
  'number': [
    {
      value: 'required_number',
      label: 'Required Number (Cannot be blank)',
      description: 'Must be a valid numeric value',
      defaultDetail: 'Mandatory number'
    },
    {
      value: 'positive_integer',
      label: 'Positive Integer (> 0, whole number)',
      description: 'Must be greater than 0 with no decimal part',
      defaultDetail: 'Whole number > 0'
    },
    {
      value: 'non_negative_integer',
      label: 'Non-Negative Number (>= 0)',
      description: 'Zero or positive value',
      defaultDetail: '>= 0'
    },
    {
      value: 'range_min_max',
      label: 'Bounded Range (e.g. 1 to 100)',
      description: 'Must fall inclusively between specified min and max',
      defaultDetail: 'Min: 1, Max: 100'
    },
    {
      value: 'percentage_0_100',
      label: 'Percentage (0 to 100)',
      description: 'Valid percentage value between 0 and 100',
      defaultDetail: '0% to 100%'
    },
    {
      value: 'currency_decimal',
      label: 'Currency Amount (Max 2 decimal places)',
      description: 'Financial figure formatted to 2 decimals',
      defaultDetail: '$0.00'
    },
    {
      value: 'optional_number',
      label: 'Optional Number',
      description: 'Not required',
      defaultDetail: 'Optional'
    }
  ],
  'textarea': [
    {
      value: 'required_textarea',
      label: 'Required Text Block',
      description: 'Must not be empty',
      defaultDetail: 'Mandatory description'
    },
    {
      value: 'min_words_20',
      label: 'Minimum Word Count (Min 20 words)',
      description: 'Ensures participant provides substantive description',
      defaultDetail: 'At least 20 words'
    },
    {
      value: 'max_chars_1000',
      label: 'Maximum Character Limit (Max 1,000 chars)',
      description: 'Prevents overflowing payload size',
      defaultDetail: 'Max 1,000 characters'
    },
    {
      value: 'optional_textarea',
      label: 'Optional Long Text',
      description: 'Optional open-ended remarks',
      defaultDetail: 'Optional'
    }
  ],
  'select': [
    {
      value: 'required_selection',
      label: 'Required Selection (Cannot pick default placeholder)',
      description: 'User must pick one valid option from the dropdown list',
      defaultDetail: 'Must choose one option'
    },
    {
      value: 'single_choice',
      label: 'Single Choice from Defined List',
      description: 'One option selected',
      defaultDetail: 'Defined options'
    },
    {
      value: 'optional_selection',
      label: 'Optional Selection',
      description: 'Can remain unselected',
      defaultDetail: 'Optional'
    }
  ],
  'date': [
    {
      value: 'required_date',
      label: 'Required Date',
      description: 'Must specify a valid calendar date',
      defaultDetail: 'YYYY-MM-DD'
    },
    {
      value: 'future_date_only',
      label: 'Future Date Only (>= Today)',
      description: 'Date cannot be in the past',
      defaultDetail: 'Today or later'
    },
    {
      value: 'past_date_only',
      label: 'Past Date Only (<= Today)',
      description: 'Date cannot be in the future',
      defaultDetail: 'Today or earlier'
    },
    {
      value: 'optional_date',
      label: 'Optional Date',
      description: 'Date input is optional',
      defaultDetail: 'Optional'
    }
  ],
  'boolean': [
    {
      value: 'must_accept',
      label: 'Must Be Checked / Accepted (e.g. Terms, Confirmation)',
      description: 'Checkbox must be toggled ON to proceed',
      defaultDetail: 'Checked = required'
    },
    {
      value: 'optional_toggle',
      label: 'Optional Toggle (Default False)',
      description: 'Can be true or false freely',
      defaultDetail: 'True / False toggle'
    }
  ]
};
