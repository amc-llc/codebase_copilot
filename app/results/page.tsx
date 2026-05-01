'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Download,
  Code,
  BookOpen,
  TestTube,
  Wrench,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { exportAsJSON, exportAsMarkdown, exportAsPDF } from '@/lib/utils/export';

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState('summary');
  const currentAnalysis = useStore((state) => state.currentAnalysis);

  if (!currentAnalysis) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>No Analysis Loaded</CardTitle>
                <CardDescription>
                  Run an analysis first, then come back here to inspect the results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/analyze">
                  <Button>Go To Analyze</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { analysis, documentation, explanation, onboarding, tests, refactorings, productionReadiness } =
    currentAnalysis;

  const exportHandlers = {
    pdf: () => exportAsPDF(currentAnalysis),
    markdown: () => exportAsMarkdown(currentAnalysis),
    json: () => exportAsJSON(currentAnalysis),
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Analysis Results
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {analysis.metadata.name} • {analysis.architecture.type} architecture
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Generated {new Date(analysis.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={exportHandlers.pdf}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={exportHandlers.markdown}>
                  <Download className="w-4 h-4 mr-2" />
                  Export MD
                </Button>
                <Button variant="outline" onClick={exportHandlers.json}>
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {analysis.metadata.totalFiles}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Files</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {analysis.metadata.totalLines.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Lines of Code</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {analysis.metadata.languages.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Languages</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {analysis.complexityScore}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complexity Score</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="architecture" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Architecture
              </TabsTrigger>
              <TabsTrigger value="documentation" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Documentation
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Tests
              </TabsTrigger>
              <TabsTrigger value="refactoring" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Refactoring
              </TabsTrigger>
              <TabsTrigger value="risks" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Risks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>High-level summary of your uploaded codebase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">{analysis.summary}</p>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Technology Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.metadata.frameworks.length > 0 ? (
                        analysis.metadata.frameworks.map((framework) => (
                          <Badge key={framework} variant="outline" className="px-3 py-1">
                            {framework}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          No framework signatures detected.
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Language Distribution</h3>
                    <div className="space-y-3">
                      {analysis.metadata.languages.map((language) => (
                        <div key={language.language}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{language.language}</span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {language.percentage}% ({language.files} files)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                              style={{ width: `${language.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Files</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.keyFiles.length > 0 ? (
                    analysis.keyFiles.map((file) => (
                      <div key={file.path} className="rounded-lg border p-4 bg-white/60 dark:bg-gray-900/40">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">{file.path}</span>
                          <Badge variant="secondary">{file.importance}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{file.reason}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No standout files were identified from the uploaded set.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="architecture" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Architecture Analysis</CardTitle>
                  <CardDescription>Detected pattern and structural signals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Pattern</h3>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {analysis.architecture.type}
                    </Badge>
                    <p className="text-gray-600 dark:text-gray-400 mt-3">
                      {analysis.architecture.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Detected Components</h3>
                    {analysis.architecture.components.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analysis.architecture.components.map((component) => (
                          <Badge key={component} variant="outline">
                            {component}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        The analyzer did not find strong architectural component markers in the uploaded files.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documentation" className="space-y-6">
              {explanation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Explanation</CardTitle>
                    <CardDescription>{explanation.level} walkthrough</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {explanation.details}
                    </p>
                  </CardContent>
                </Card>
              )}

              {onboarding && (
                <Card>
                  <CardHeader>
                    <CardTitle>Onboarding Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {onboarding.overview}
                    </p>
                    {onboarding.gettingStarted.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Getting Started</h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          {onboarding.gettingStarted.map((step) => (
                            <li key={step}>• {step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {documentation ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Documentation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {documentation.readme && (
                      <div>
                        <h3 className="font-semibold mb-2">README Draft</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {documentation.readme}
                        </p>
                      </div>
                    )}
                    {documentation.architectureDocs && (
                      <div>
                        <h3 className="font-semibold mb-2">Architecture Notes</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {documentation.architectureDocs}
                        </p>
                      </div>
                    )}
                    {!documentation.readme && !documentation.architectureDocs && !documentation.apiDocs && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No documentation content was generated for this run.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                !explanation &&
                !onboarding && (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
                      Run explain, onboard, or document mode to populate this tab.
                    </CardContent>
                  </Card>
                )
              )}
            </TabsContent>

            <TabsContent value="tests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Tests</CardTitle>
                  <CardDescription>Detected framework and generated coverage snapshot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tests ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{tests.framework}</Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Coverage: {tests.coverage.overall}%
                        </span>
                      </div>
                      {tests.tests.length > 0 ? (
                        tests.tests.map((test) => (
                          <div key={test.filePath} className="rounded-lg border p-4 bg-white/60 dark:bg-gray-900/40">
                            <p className="font-medium text-gray-900 dark:text-white">{test.filePath}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {test.description}
                            </p>
                            <pre className="overflow-x-auto rounded bg-gray-950 p-3 text-xs text-gray-100">
                              <code>{test.testCode}</code>
                            </pre>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No tests were generated for the uploaded files.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Run test mode to generate this tab’s content.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="refactoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Refactoring Suggestions</CardTitle>
                  <CardDescription>Static heuristics and AI-assisted suggestions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {refactorings && refactorings.length > 0 ? (
                    refactorings.map((suggestion, index) => (
                      <div key={`${suggestion.location}-${index}`} className="rounded-lg border p-4 bg-white/60 dark:bg-gray-900/40">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary">{suggestion.severity}</Badge>
                          <Badge variant="outline">{suggestion.type}</Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{suggestion.location}</span>
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">{suggestion.issue}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{suggestion.suggestion}</p>
                      </div>
                    ))
                  ) : productionReadiness ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Production-readiness mode summarized improvements under the readiness report instead.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Run refactor mode to generate this tab’s content.
                    </p>
                  )}
                </CardContent>
              </Card>

              {productionReadiness && (
                <Card>
                  <CardHeader>
                    <CardTitle>Production Readiness</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{productionReadiness.status}</Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Score: {productionReadiness.score}
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {productionReadiness.deploymentChecklist.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="risks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Identified Risks</CardTitle>
                  <CardDescription>Security, maintainability, and complexity concerns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.risks.length > 0 ? (
                      analysis.risks.map((risk, index) => (
                        <div
                          key={`${risk.location || risk.description}-${index}`}
                          className={`p-4 rounded-lg border-l-4 ${
                            risk.severity === 'critical' || risk.severity === 'high'
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                              : risk.severity === 'medium'
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 mt-0.5 text-current" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="text-xs">
                                  {risk.severity.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {risk.category}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {risk.description}
                              </p>
                              {risk.location && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {risk.location}
                                </p>
                              )}
                              {risk.suggestion && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                  {risk.suggestion}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No major risks were detected in this analysis run.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
