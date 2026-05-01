'use client';

import { useState } from 'react';
import { Upload, GitBranch, Loader2, FileText, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AnalysisMode, ExplanationLevel } from '@/types';

export default function AnalyzePage() {
  const [sourceType, setSourceType] = useState<'github' | 'upload'>('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [files, setFiles] = useState<File[]>([]);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('explain');
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>('intermediate');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      // TODO: Implement actual analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to results page
      window.location.href = '/results';
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = () => {
    if (sourceType === 'github') {
      return githubUrl.trim() !== '';
    }
    return files.length > 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Analyze Your Codebase
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Upload your code or connect a GitHub repository to get instant insights
            </p>
          </div>

          {/* Main Analysis Card */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle>Source Code Input</CardTitle>
              <CardDescription>
                Choose how you want to provide your codebase for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Source Type Tabs */}
              <Tabs value={sourceType} onValueChange={(v) => setSourceType(v as 'github' | 'upload')}>
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

                {/* GitHub Tab */}
                <TabsContent value="github" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="github-url">Repository URL</Label>
                    <Input
                      id="github-url"
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="h-12"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enter the full GitHub repository URL
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch (optional)</Label>
                    <Input
                      id="branch"
                      type="text"
                      placeholder="main"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="h-12"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Defaults to main branch if not specified
                    </p>
                  </div>
                </TabsContent>

                {/* Upload Tab */}
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
                              or drag and drop your code files here
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Supports: JS, TS, Python, Java, Go, Rust, PHP, Ruby, and more
                          </p>
                        </div>
                      </label>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Selected Files ({files.length}):
                        </p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <FileText className="w-4 h-4" />
                              <span>{file.name}</span>
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

              {/* Analysis Options */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Analysis Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Analysis Mode */}
                  <div className="space-y-2">
                    <Label htmlFor="analysis-mode">Analysis Mode</Label>
                    <Select value={analysisMode} onValueChange={(v) => setAnalysisMode(v as AnalysisMode)}>
                      <SelectTrigger id="analysis-mode" className="h-12 bg-white dark:bg-gray-800 z-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                        <SelectItem value="explain" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                          Explain Codebase
                        </SelectItem>
                        <SelectItem value="onboard" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                          Onboarding Guide
                        </SelectItem>
                        <SelectItem value="document" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                          Generate Documentation
                        </SelectItem>
                        <SelectItem value="test" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                          Generate Tests
                        </SelectItem>
                        <SelectItem value="refactor" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                          Refactor Suggestions
                        </SelectItem>
                        <SelectItem value="production-ready" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                          Production Readiness
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Explanation Level */}
                  {analysisMode === 'explain' && (
                    <div className="space-y-2">
                      <Label htmlFor="explanation-level">Explanation Level</Label>
                      <Select value={explanationLevel} onValueChange={(v) => setExplanationLevel(v as ExplanationLevel)}>
                        <SelectTrigger id="explanation-level" className="h-12 bg-white dark:bg-gray-800 z-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                          <SelectItem value="beginner" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                            Beginner (Simple explanations)
                          </SelectItem>
                          <SelectItem value="intermediate" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                            Intermediate (Technical details)
                          </SelectItem>
                          <SelectItem value="senior" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                            Senior (Architecture focus)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Mode Descriptions */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {analysisMode === 'explain' && 'Get a comprehensive explanation of your codebase architecture and components.'}
                    {analysisMode === 'onboard' && 'Generate a complete onboarding guide for new developers.'}
                    {analysisMode === 'document' && 'Create professional documentation including README, API docs, and setup guides.'}
                    {analysisMode === 'test' && 'Generate comprehensive test suites for your codebase.'}
                    {analysisMode === 'refactor' && 'Identify code quality issues and get refactoring suggestions.'}
                    {analysisMode === 'production-ready' && 'Get a complete production readiness assessment with actionable improvements.'}
                  </p>
                </div>
              </div>

              {/* Analyze Button */}
              <div className="pt-6">
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze() || isAnalyzing}
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

          {/* Features Preview */}
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
                <CardTitle className="text-lg">AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uses advanced AI models to understand your code architecture and patterns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instant Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get comprehensive analysis results in seconds, not hours.
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

// Made with Bob
