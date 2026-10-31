# HTML Tool Prompt & Requirement Architect

> An interactive workshop application that guides participants through a 6-component specification framework to craft structured prompts and instantly generate standalone, single-file HTML tools with real client-side validation.

[![Built for Workshops](https://img.shields.io/badge/Workshop-Prompt%20Architect-indigo)](https://github.com)
[![GitHub Pages Compatible](https://img.shields.io/badge/Deploy-GitHub%20Pages-22c55e?logo=github)](https://pages.github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🎯 The 6-Component Framework

Every participant defines the 6 foundational pillars required to formulate requirements and generate working HTML tools:

1. **Component 1: Goal & Purpose**
   - Core objective: *"To create a file, an HTML file that can help participants of my session to develop their own prompt for HTML tool, which can generate their requirement."*
   - Target user audience and problem solved.
2. **Component 2: Dynamic Inputs Specification**
   - Participants select their desired number of inputs (1 to 10+).
   - Every input defines 4 mandatory properties:
     1. **Name of the input** (e.g., Participant Name, Dataset File, Item Count).
     2. **File / Field Type** (File Upload, Text File [.txt, .csv, .json], Short Text, Number, Textarea, Select Dropdown, Date, Boolean Toggle).
     3. **Validation Rule (from Dropdown)** (Tailored rules like Max 5MB, Documents only, CSV with header row, Valid JSON format, Positive integer, Email format, Bounded ranges).
     4. **Validation Details & Constraints** (Specific bounds, size limits, and helper instructions).
3. **Component 3: Processing Engine & Logic**
   - Calculation/transformation rules, execution triggers (Reactive Real-time vs. On-Submit), and browser FileReader pipeline.
4. **Component 4: Outputs & Deliverables**
   - Deliverable presentation, downloadable single-file HTML, structured requirement cards, and AI Master Prompt block.
5. **Component 5: UI Layout & Styling Theme**
   - Clean Slate, Modern Indigo, Emerald Minimal, or Warm Stone themes with responsive split or stacked geometry.
6. **Component 6: Guardrails & Standalone Constraints**
   - 100% self-contained single HTML file guarantee (runs locally offline in any web browser without Node/npm) with inline validation indicators.

---

## 🚀 Features

- **Live Sandboxed Preview:** Test inputs, attach sample CSV/JSON/text files, and verify validation rules directly inside an embedded iframe.
- **Direct GitHub Export:**
  - **Direct GitHub API Push:** Create a repository and commit files directly with a Personal Access Token.
  - **GitHub Pages Workflow:** Automatically deploy to GitHub Pages with included `.github/workflows/deploy.yml`.
  - **Repository ZIP Archive:** Download a complete, packaged repository ready to push.
  - **GitHub Gist Publishing:** Share prompts and standalone tools via GitHub Gists.
  - **CLI Instructions:** Pre-formulated terminal commands.
- **Session Facilitator Guide:** Built-in workshop timing, 30-minute agenda, and teaching tips.

---

## 🛠 Local Development

To run this React & Vite web application locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the app.

---

## 📄 License

MIT License. Free to use in workshops, training sessions, and educational courses.
