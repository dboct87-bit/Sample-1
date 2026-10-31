import React, { useState } from 'react';
import { ToolSpec } from '../types/toolSpec';
import {
  generateGitHubReadme,
  generateGitHubPagesWorkflow,
  generateGitHubRepoZip,
  pushToGitHubApi,
  createGitHubGist,
} from '../utils/githubExporter';
import {
  X,
  Github,
  Download,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  FolderArchive,
  Globe,
  Loader2,
  AlertCircle,
  FileCode,
} from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  spec: ToolSpec;
  htmlContent: string;
  promptContent: string;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({
  isOpen,
  onClose,
  spec,
  htmlContent,
  promptContent,
}) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'zip' | 'cli' | 'gist'>('direct');

  // Direct GitHub API states
  const [githubToken, setGithubToken] = useState('');
  const [repoName, setRepoName] = useState(() => {
    return (
      spec.toolName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'html-tool-spec'
    );
  });
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ repoUrl: string; pagesUrl: string } | null>(null);
  const [pushError, setPushError] = useState<string | null>(null);

  // Gist states
  const [gistResult, setGistResult] = useState<string | null>(null);
  const [isGistLoading, setIsGistLoading] = useState(false);

  // Copy status
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleDirectPush = async () => {
    if (!githubToken.trim()) {
      setPushError('Please enter a GitHub Personal Access Token with repo scope.');
      return;
    }
    if (!repoName.trim()) {
      setPushError('Please enter a valid repository name.');
      return;
    }

    setIsPushing(true);
    setPushError(null);
    setPushResult(null);

    try {
      const readme = generateGitHubReadme(spec);
      const workflow = generateGitHubPagesWorkflow();

      const files = {
        'index.html': htmlContent,
        'README.md': readme,
        'prompt.md': promptContent,
        'spec.json': JSON.stringify(spec, null, 2),
        '.github/workflows/deploy.yml': workflow,
      };

      const result = await pushToGitHubApi(
        githubToken,
        repoName.trim(),
        isPrivate,
        spec.goal || 'Generated Standalone HTML Tool',
        files
      );

      setPushResult(result);
    } catch (err: any) {
      setPushError(err.message || 'An error occurred while pushing to GitHub.');
    } finally {
      setIsPushing(false);
    }
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zipBlob = await generateGitHubRepoZip(spec, htmlContent, promptContent);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${repoName}-github-repo.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to generate ZIP archive.');
    } finally {
      setIsZipping(false);
    }
  };

  const handleCreateGist = async () => {
    if (!githubToken.trim()) {
      setPushError('Please enter a GitHub Token with gist scope.');
      return;
    }
    setIsGistLoading(true);
    setPushError(null);
    try {
      const url = await createGitHubGist(
        githubToken,
        spec.toolName || 'HTML Tool Prompt',
        !isPrivate,
        {
          'index.html': htmlContent,
          'README.md': generateGitHubReadme(spec),
          'prompt.md': promptContent,
        }
      );
      setGistResult(url);
    } catch (err: any) {
      setPushError(err.message || 'Failed to create Gist.');
    } finally {
      setIsGistLoading(false);
    }
  };

  const gitCliSnippet = `# 1. Create and enter project directory
mkdir ${repoName} && cd ${repoName}

# 2. Initialize git repository
git init -b main

# 3. Add files (place index.html and README.md here)
git add .
git commit -m "feat: initial commit of ${spec.toolName || 'HTML tool'}"

# 4. Link to your GitHub repository and push
git remote add origin https://github.com/<your-username>/${repoName}.git
git push -u origin main`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(gitCliSnippet).then(() => {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                GitHub Repository Exporter
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                Export HTML Tool to GitHub
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Method Tabs */}
        <div className="px-6 pt-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('direct')}
              className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'direct'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>Direct Push (GitHub API)</span>
            </button>
            <button
              onClick={() => setActiveTab('zip')}
              className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'zip'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>Download Repo ZIP</span>
            </button>
            <button
              onClick={() => setActiveTab('gist')}
              className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'gist'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>GitHub Gist</span>
            </button>
            <button
              onClick={() => setActiveTab('cli')}
              className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'cli'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Git CLI Commands</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5 flex-1">
          {/* TAB 1: Direct GitHub Push */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically create a new GitHub repository and push your standalone HTML tool (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">index.html</code>), complete <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">README.md</code>, specification JSON, and GitHub Pages workflow directly via the GitHub API.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  GitHub Personal Access Token
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_... or github_pat_..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <span>Requires <code className="text-slate-700 font-semibold">repo</code> or <code className="text-slate-700 font-semibold">public_repo</code> scope.</span>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=HTML+Tool+Architect"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-0.5"
                  >
                    <span>Generate token on GitHub</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="my-html-tool"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700">Make Private Repository</span>
                  </label>
                </div>
              </div>

              {pushError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{pushError}</span>
                </div>
              )}

              {pushResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Successfully Exported to GitHub!</span>
                  </div>
                  <div className="text-xs text-emerald-800 space-y-1">
                    <div>
                      <strong>Repository URL: </strong>
                      <a
                        href={pushResult.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-emerald-900 font-mono inline-flex items-center gap-1 hover:text-emerald-950"
                      >
                        {pushResult.repoUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div>
                      <strong>Free GitHub Pages URL (once enabled): </strong>
                      <span className="font-mono">{pushResult.pagesUrl}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleDirectPush}
                disabled={isPushing}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isPushing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing to GitHub...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4" />
                    <span>Push & Create GitHub Repository</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: Download Repo ZIP */}
          {activeTab === 'zip' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Download a fully structured, ready-to-push GitHub repository as a ZIP archive.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-mono text-slate-700">
                <div className="font-bold text-slate-900 mb-1 font-sans">
                  Files Included in Archive:
                </div>
                <div>📁 .github/workflows/deploy.yml <span className="text-slate-400 font-sans text-[11px]">(Auto GitHub Pages)</span></div>
                <div>📄 index.html <span className="text-slate-400 font-sans text-[11px]">(Standalone tool)</span></div>
                <div>📄 README.md <span className="text-slate-400 font-sans text-[11px]">(6-component documentation)</span></div>
                <div>📄 prompt.md <span className="text-slate-400 font-sans text-[11px]">(AI Master Prompt)</span></div>
                <div>📄 tool-specification.json <span className="text-slate-400 font-sans text-[11px]">(Spec data)</span></div>
                <div>📄 LICENSE <span className="text-slate-400 font-sans text-[11px]">(MIT License)</span></div>
              </div>

              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Packaging Archive...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Complete Repository ZIP</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: Gist */}
          {activeTab === 'gist' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Instantly publish as a GitHub Gist (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">gist.github.com</code>). Ideal for sharing prompts and code snippets with workshop participants.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  GitHub Token (with gist scope)
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_..."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {gistResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
                  <span>Gist published successfully!</span>
                  <a
                    href={gistResult}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold inline-flex items-center gap-1"
                  >
                    <span>View on GitHub Gist</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={handleCreateGist}
                disabled={isGistLoading}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isGistLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Gist...</span>
                  </>
                ) : (
                  <>
                    <FileCode className="w-4 h-4" />
                    <span>Publish to GitHub Gist</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 4: CLI Instructions */}
          {activeTab === 'cli' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Copy these commands to push from your local terminal:</span>
                <button
                  onClick={handleCopyCli}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Commands</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto select-all">
                {gitCliSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>GitHub Pages compatible</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
