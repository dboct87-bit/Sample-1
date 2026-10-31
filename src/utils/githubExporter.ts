import JSZip from 'jszip';
import { ToolSpec } from '../types/toolSpec';

export function generateGitHubReadme(spec: ToolSpec): string {
  const inputsTable = spec.inputs.map((inp, idx) => {
    return `| ${idx + 1} | **${inp.name}** | \`${inp.type}\` | \`${inp.validation}\` | ${inp.validationDetails || 'Standard'} | ${inp.required ? '✅ Required' : '⚪ Optional'} |`;
  }).join('\n');

  const stepsList = spec.processingSteps.map((step) => `- ${step}`).join('\n');

  return `# ${spec.toolName || 'Custom HTML Tool'}

> A standalone single-file HTML application built using the 6-component framework for workshop participants and prompt engineering.

[![GitHub Pages Deployment](https://img.shields.io/badge/Deploy-GitHub%20Pages-22c55e?logo=github)](https://pages.github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Standalone)-indigo)](index.html)

---

## 1. Goal & Objectives
${spec.goal}

- **Target Audience:** ${spec.targetAudience}
- **Problem Solved:** ${spec.problemSolved}

---

## 2. Dynamic Inputs Specification
This tool configures **${spec.inputs.length} inputs**. Each input is governed by 4 essential properties:

| # | Input Name | Data / File Type | Validation Rule | Validation Details & Constraints | Requirement |
|---|---|---|---|---|---|
${inputsTable}

---

## 3. Processing Engine & Calculations
- **Trigger:** \`${spec.calculationType}\` (${spec.calculationType === 'realtime' ? 'Reactive real-time updates' : 'Triggered on Primary Submit'})
- **Processing Logic:** ${spec.logicDescription}

### Execution Sequence:
${stepsList}

---

## 4. Outputs & Deliverables
- **Deliverables:** ${spec.outputTypes.join(', ')}
- **Deliverable Details:** ${spec.deliverableDescription}
- **Default Export File:** \`${spec.downloadableFileName || 'output.txt'}\`

---

## 5. UI Layout & Styling
- **Theme:** \`${spec.theme}\`
- **Layout:** \`${spec.layout}\`
- **Notes:** ${spec.userExperienceNotes}

---

## 6. Guardrails & Standalone Constraints
- **Zero-Server Requirement:** 100% self-contained single HTML file (\`index.html\`). Runs offline on any modern browser (Chrome, Safari, Firefox, Edge).
- **Validation Feedback:** \`${spec.validationStrategy}\`
- **Edge Cases & Error Handling:** ${spec.edgeCaseHandling}

---

## 🚀 How to Run Locally

No Node.js, npm, or build tooling required!
1. Clone this repository:
   \`\`\`bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   \`\`\`
2. Open \`index.html\` directly in your browser:
   \`\`\`bash
   # On macOS
   open index.html

   # On Linux
   xdg-open index.html

   # On Windows
   start index.html
   \`\`\`

---

## 🌐 Deploy to GitHub Pages (Free Instant Hosting)

1. Go to your repository **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3. Choose branch \`main\` (or \`master\`), folder \`/(root)\`, and click **Save**.
4. Your standalone tool will be live in ~60 seconds at \`https://<your-username>.github.io/<repo-name>/\`.

---

Generated with [HTML Tool Prompt Architect](https://github.com).
`;
}

export function generateGitHubPagesWorkflow(): string {
  return `name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;
}

export function generateMITLicense(): string {
  return `MIT License

Copyright (c) 2026 HTML Tool Workshop

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
}

export async function generateGitHubRepoZip(
  spec: ToolSpec,
  htmlContent: string,
  promptContent: string
): Promise<Blob> {
  const zip = new JSZip();

  // 1. Root index.html (the standalone tool)
  zip.file('index.html', htmlContent);

  // 2. Comprehensive README.md
  zip.file('README.md', generateGitHubReadme(spec));

  // 3. AI Engineering Master Prompt
  zip.file('prompt.md', promptContent);

  // 4. Raw specification JSON
  zip.file('tool-specification.json', JSON.stringify(spec, null, 2));

  // 5. MIT License
  zip.file('LICENSE', generateMITLicense());

  // 6. .gitignore
  zip.file('.gitignore', '.DS_Store\n*.log\n');

  // 7. GitHub Pages Workflow
  const githubFolder = zip.folder('.github');
  if (githubFolder) {
    const workflowsFolder = githubFolder.folder('workflows');
    if (workflowsFolder) {
      workflowsFolder.file('deploy.yml', generateGitHubPagesWorkflow());
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

// GitHub REST API: Create repository and push files
export async function pushToGitHubApi(
  token: string,
  repoName: string,
  isPrivate: boolean,
  description: string,
  files: Record<string, string>
): Promise<{ repoUrl: string; pagesUrl: string }> {
  // Step 1: Verify token and get username
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!userRes.ok) {
    const err = await userRes.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid GitHub token. Please verify token permissions.');
  }

  const userData = await userRes.json();
  const username = userData.login;

  // Step 2: Create repository
  const createRepoRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: repoName,
      description: description || 'Standalone HTML Tool generated with 6-component framework',
      private: isPrivate,
      auto_init: true, // initializes with default branch
    }),
  });

  let repoData;
  if (!createRepoRes.ok) {
    const err = await createRepoRes.json().catch(() => ({}));
    // If repo already exists, check if we can write to it
    if (err.message && err.message.includes('already exists')) {
      const getExisting = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (getExisting.ok) {
        repoData = await getExisting.json();
      } else {
        throw new Error(`Repository "${repoName}" already exists and could not be accessed.`);
      }
    } else {
      throw new Error(err.message || 'Failed to create GitHub repository.');
    }
  } else {
    repoData = await createRepoRes.json();
  }

  // Step 3: Commit each file
  for (const [filePath, content] of Object.entries(files)) {
    // Check if file already exists to get SHA
    let fileSha: string | undefined = undefined;
    const existingFileRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    if (existingFileRes.ok) {
      const fileData = await existingFileRes.json();
      fileSha = fileData.sha;
    }

    // Base64 encode file content safely (supporting UTF-8)
    const base64Content = btoa(unescape(encodeURIComponent(content)));

    const putRes = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add ${filePath} via HTML Tool Architect`,
          content: base64Content,
          sha: fileSha,
        }),
      }
    );

    if (!putRes.ok) {
      const putErr = await putRes.json().catch(() => ({}));
      console.warn(`Could not commit ${filePath}:`, putErr);
    }
  }

  return {
    repoUrl: repoData.html_url || `https://github.com/${username}/${repoName}`,
    pagesUrl: `https://${username}.github.io/${repoName}/`,
  };
}

// GitHub REST API: Create Gist
export async function createGitHubGist(
  token: string,
  description: string,
  isPublic: boolean,
  files: Record<string, string>
): Promise<string> {
  const gistFiles: Record<string, { content: string }> = {};
  for (const [filename, content] of Object.entries(files)) {
    gistFiles[filename] = { content };
  }

  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description,
      public: isPublic,
      files: gistFiles,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create GitHub Gist.');
  }

  const gistData = await res.json();
  return gistData.html_url;
}
