'use client';

import { useState } from 'react';
import { Download, FileText, Code, BookOpen, TestTube, Wrench, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState('summary');

  // Mock data - in production, this would come from the analysis
  const mockAnalysis = {
    projectName: 'Example Project',
    architecture: 'Microservices',
    totalFiles: 247,
    totalLines: 15432,
    languages: [
      { name: 'TypeScript', percentage: 65, files: 160 },
      { name: 'JavaScript', percentage: 20, files: 50 },
      { name: 'CSS', percentage: 10, files: 25 },
      { name: 'JSON', percentage: 5, files: 12 },
    ],
    frameworks: ['Next.js', 'React', 'Tailwind CSS'],
    complexityScore: 72,
    risks: [
      { severity: 'high', category: 'security', description: 'Hardcoded API keys found in config files' },
      { severity: 'medium', category: 'performance', description: 'Large bundle size detected (2.5MB)' },
      { severity: 'low', category: 'maintainability', description: 'Some files exceed 500 lines' },
    ],
  };

  const handleExport = (format: 'pdf' | 'markdown' | 'json') => {
    console.log(`Exporting as ${format}`);
    // TODO: Implement actual export functionality
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Analysis Results
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {mockAnalysis.projectName} • {mockAnalysis.architecture} Architecture
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleExport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => handleExport('markdown')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export MD
                </Button>
                <Button variant="outline" onClick={() => handleExport('json')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {mockAnalysis.totalFiles}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Files</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {mockAnalysis.totalLines.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Lines of Code</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {mockAnalysis.languages.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Languages</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {mockAnalysis.complexityScore}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complexity Score</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
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

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>High-level summary of your codebase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Architecture Pattern</h3>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {mockAnalysis.architecture}
                    </Badge>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      This codebase follows a {mockAnalysis.architecture.toLowerCase()} architecture pattern,
                      with distributed services communicating via APIs.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Technology Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockAnalysis.frameworks.map((framework) => (
                        <Badge key={framework} variant="outline" className="px-3 py-1">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Language Distribution</h3>
                    <div className="space-y-3">
                      {mockAnalysis.languages.map((lang) => (
                        <div key={lang.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{lang.name}</span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {lang.percentage}% ({lang.files} files)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                              style={{ width: `${lang.percentage}%` }}
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
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Well-structured codebase</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Clear separation of concerns with modular architecture
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Modern technology stack</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Uses current frameworks and best practices
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Some areas need attention</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Security and performance improvements recommended
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Architecture Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of system architecture</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Pattern: {mockAnalysis.architecture}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        The codebase implements a microservices architecture with the following characteristics:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>Multiple independent services</li>
                        <li>API-based communication</li>
                        <li>Containerized deployment</li>
                        <li>Service mesh for inter-service communication</li>
                      </ul>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Key Components</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="font-medium">API Gateway</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Central entry point for all client requests
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="font-medium">Authentication Service</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Handles user authentication and authorization
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="font-medium">Data Layer</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Database abstraction and ORM integration
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="font-medium">Business Logic</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Core application logic and workflows
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="documentation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Documentation</CardTitle>
                  <CardDescription>Auto-generated documentation for your codebase</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">README.md</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Comprehensive project overview with setup instructions
                      </p>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View README
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">API Documentation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Complete API reference with endpoints and examples
                      </p>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View API Docs
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Architecture Guide</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Detailed architecture documentation and diagrams
                      </p>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Architecture
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tests Tab */}
            <TabsContent value="tests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Generation</CardTitle>
                  <CardDescription>Auto-generated test suites for your code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TestTube className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Test generation feature coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Refactoring Tab */}
            <TabsContent value="refactoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Refactoring Suggestions</CardTitle>
                  <CardDescription>Code quality improvements and optimizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Wrench className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Refactoring analysis feature coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Risks Tab */}
            <TabsContent value="risks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Identified Risks</CardTitle>
                  <CardDescription>Security, performance, and maintainability concerns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalysis.risks.map((risk, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          risk.severity === 'high'
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                            : risk.severity === 'medium'
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={`w-5 h-5 mt-0.5 ${
                              risk.severity === 'high'
                                ? 'text-red-600 dark:text-red-400'
                                : risk.severity === 'medium'
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-blue-600 dark:text-blue-400'
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant={risk.severity === 'high' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {risk.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {risk.category}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {risk.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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

// Made with Bob
