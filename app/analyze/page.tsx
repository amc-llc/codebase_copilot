'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, GitBranch, Loader2, FileText, FolderOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { storage } from '@/lib/utils/storage';
import { useStore } from '@/lib/store';
import { AnalysisMode, AnalysisResult, ExplanationLevel, UploadedCodeFile } from '@/types';

function getRelativePath(file: File): string {
  const candidate = 'webkitRelativePath' in file ? file.webkitRelativePath : '';
  return typeof candidate === 'string' && candidate.length > 0 ? candidate : file.name;
}

export default function AnalyzePage() {
  const router = useRouter();
  const setCurrentAnalysis = useStore((state) => state.setCurrentAnalysis);
  const addToHistory = useStore((state) => state.addToHistory);
  const setGlobalAnalyzing = useStore((state) => state.setIsAnalyzing);
  const setGlobalError = useStore((state) => state.setError);

  const [sourceType, setSourceType] = useState<'github' | 'upload'>('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [files, setFiles] = useState<File[]>([]);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('explain');
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('intermediate');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    setFiles(Array.from(event.target.files));
    setError(null);
  };

  const serializeFiles = async (inputFiles: File[]): Promise<UploadedCodeFile[]> => {
    return Promise.all(
      inputFiles.map(async (file) => {
        const content = await file.text();
        return {
          path: getRelativePath(file),
          name: file.name,
          content,
          size: file.size,
          lines: content.split('\n').length,
        };
      })
    );
  };

  const handleAnalyze = async () => {
    setError(null);
    setGlobalError(null);

    const providerConfig = storage.getProviderConfig();
    if (!providerConfig?.apiKey) {
      const message = 'Add an AI provider API key in Settings before running analysis.';
      setError(message);
      setGlobalError(message);
      return;
    }

    if (sourceType === 'github') {
      const message = 'GitHub repository analysis is not wired yet. Upload files to analyze a project right now.';
      setError(message);
      setGlobalError(message);
      return;
    }

    setIsAnalyzing(true);
    setGlobalAnalyzing(true);

    try {
      const uploadedFiles = await serializeFiles(files);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: {
            type: 'upload',
            files: uploadedFiles,
          },
          mode: analysisMode,
          explanationLevel,
          provider: providerConfig,
        }),
      });

      const payload = (await response.json()) as AnalysisResult | { error: string };
      if (!response.ok || 'error' in payload) {
        throw new Error('error' in payload ? payload.error : 'Analysis failed.');
      }

      setCurrentAnalysis(payload);
      addToHistory(payload);
      router.push('/results');
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Analysis failed unexpectedly.';
      setError(message);
      setGlobalError(message);
    } finally {
      setIsAnalyzing(false);
      setGlobalAnalyzing(false);
    }
  };

  const canAnalyze = sourceType === 'upload' ? files.length > 0 : githubUrl.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Analyze Your Codebase
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Upload your code or connect a GitHub repository to get instant insights
            </p>
          </div>

          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle>Source Code Input</CardTitle>
              <CardDescription>
                Choose how you want to provide your codebase for analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={sourceType} onValueChange={(value) => setSourceType(value as 'github' | 'upload')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="github" className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    GitHub Repository
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Files
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="github" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="github-url">Repository URL</Label>
                    <Input
                      id="github-url"
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={githubUrl}
                      onChange={(event) => setGithubUrl(event.target.value)}
                      className="h-12"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      GitHub repository import is planned, but file upload is the working path right now.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch (optional)</Label>
                    <Input
                      id="branch"
                      type="text"
                      placeholder="main"
                      value={branch}
                      onChange={(event) => setBranch(event.target.value)}
                      className="h-12"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Upload Files or Folder</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".js,.jsx,.ts,.tsx,.py,.java,.go,.rs,.php,.rb,.swift,.kt,.scala,.html,.css,.json,.yaml,.yml,.md"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <FolderOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                              Click to upload files
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Drag-and-drop is supported by your browser file picker too.
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Supports JS, TS, Python, Java, Go, Rust, PHP, Ruby, and more.
                          </p>
                        </div>
                      </label>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Selected Files ({files.length})
                        </p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {files.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <FileText className="w-4 h-4" />
                              <span>{getRelativePath(file)}</span>
                              <span className="text-xs text-gray-400">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Analysis Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="analysis-mode">Analysis Mode</Label>
                    <Select value={analysisMode} onValueChange={(value) => setAnalysisMode(value as AnalysisMode)}>
                      <SelectTrigger id="analysis-mode" className="h-12 bg-white dark:bg-gray-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                        <SelectItem value="explain">Explain Codebase</SelectItem>
                        <SelectItem value="onboard">Onboarding Guide</SelectItem>
                        <SelectItem value="document">Generate Documentation</SelectItem>
                        <SelectItem value="test">Generate Tests</SelectItem>
                        <SelectItem value="refactor">Refactor Suggestions</SelectItem>
                        <SelectItem value="production-ready">Production Readiness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {analysisMode === 'explain' && (
                    <div className="space-y-2">
                      <Label htmlFor="explanation-level">Explanation Level</Label>
                      <Select
                        value={explanationLevel}
                        onValueChange={(value) => setExplanationLevel(value as ExplanationLevel)}
                      >
                        <SelectTrigger id="explanation-level" className="h-12 bg-white dark:bg-gray-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {analysisMode === 'explain' && 'Generate a plain-language or technical walkthrough of the uploaded codebase.'}
                    {analysisMode === 'onboard' && 'Create an onboarding guide that points new teammates at the right files and concepts first.'}
                    {analysisMode === 'document' && 'Use your configured AI provider to draft documentation sections for the codebase.'}
                    {analysisMode === 'test' && 'Generate a first-pass test suite for key functions and methods detected in the uploaded files.'}
                    {analysisMode === 'refactor' && 'Identify duplication, naming issues, dead code, and complexity hotspots.'}
                    {analysisMode === 'production-ready' && 'Combine heuristics and generated outputs into a production-readiness snapshot.'}
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div className="pt-6">
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze || isAnalyzing}
                  className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Codebase...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Multi-Language Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Supports JavaScript, TypeScript, Python, Java, Go, Rust, PHP, Ruby, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Server-Side Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analysis requests now run through a Next.js route handler instead of a fake client-side timer.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The results page reads the actual analysis payload and lets you export it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
