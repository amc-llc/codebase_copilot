'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Play, Code, FileText, TestTube, Wrench, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const [selectedDemo, setSelectedDemo] = useState<string>('nextjs');

  const demoProjects = {
    nextjs: {
      name: 'Next.js E-Commerce',
      description: 'A modern e-commerce platform built with Next.js 14',
      architecture: 'Microservices',
      languages: [
        { name: 'TypeScript', percentage: 75 },
        { name: 'JavaScript', percentage: 15 },
        { name: 'CSS', percentage: 10 },
      ],
      stats: {
        files: 247,
        lines: 15432,
        complexity: 72,
      },
      features: [
        'Server-side rendering',
        'API routes',
        'Database integration',
        'Authentication',
        'Payment processing',
      ],
    },
    react: {
      name: 'React Dashboard',
      description: 'Analytics dashboard with real-time data visualization',
      architecture: 'MVC',
      languages: [
        { name: 'JavaScript', percentage: 80 },
        { name: 'CSS', percentage: 15 },
        { name: 'HTML', percentage: 5 },
      ],
      stats: {
        files: 156,
        lines: 8934,
        complexity: 65,
      },
      features: [
        'Real-time charts',
        'Data filtering',
        'Export functionality',
        'Responsive design',
        'Dark mode',
      ],
    },
    python: {
      name: 'Python API Server',
      description: 'RESTful API built with FastAPI and PostgreSQL',
      architecture: 'Layered',
      languages: [
        { name: 'Python', percentage: 90 },
        { name: 'SQL', percentage: 8 },
        { name: 'YAML', percentage: 2 },
      ],
      stats: {
        files: 89,
        lines: 5621,
        complexity: 58,
      },
      features: [
        'RESTful endpoints',
        'Database ORM',
        'Authentication',
        'API documentation',
        'Unit tests',
      ],
    },
  };

  const currentDemo = demoProjects[selectedDemo as keyof typeof demoProjects];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Play className="w-3 h-3 mr-1" />
              Interactive Demo
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Try Codebase CoPilot
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore pre-analyzed example projects to see what Codebase CoPilot can do
            </p>
          </div>

          {/* Demo Project Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Object.entries(demoProjects).map(([key, project]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedDemo === key
                    ? 'ring-2 ring-blue-600 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedDemo(key)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{project.architecture}</Badge>
                    <Badge variant="secondary">{project.stats.files} files</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Demo Results */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="documentation">Docs</TabsTrigger>
              <TabsTrigger value="tests">Tests</TabsTrigger>
              <TabsTrigger value="refactoring">Refactoring</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {currentDemo.stats.files}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Files</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {currentDemo.stats.lines.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Lines of Code</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {currentDemo.stats.complexity}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complexity Score</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Language Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentDemo.languages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-gray-600 dark:text-gray-400">{lang.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentDemo.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Architecture Tab */}
            <TabsContent value="architecture">
              <Card>
                <CardHeader>
                  <CardTitle>Architecture Analysis</CardTitle>
                  <CardDescription>
                    Detected pattern: {currentDemo.architecture}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Pattern Description</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This project follows a {currentDemo.architecture.toLowerCase()} architecture pattern,
                      providing clear separation of concerns and maintainable code structure.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Key Components</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Code className="w-5 h-5 text-blue-600 mb-1" />
                        <p className="font-medium text-sm">Frontend Layer</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">UI components and views</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Code className="w-5 h-5 text-green-600 mb-1" />
                        <p className="font-medium text-sm">Business Logic</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Core application logic</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Code className="w-5 h-5 text-purple-600 mb-1" />
                        <p className="font-medium text-sm">Data Layer</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Database and storage</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Code className="w-5 h-5 text-orange-600 mb-1" />
                        <p className="font-medium text-sm">API Layer</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">External interfaces</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="documentation">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Documentation</CardTitle>
                  <CardDescription>Auto-generated project documentation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold">README.md</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Complete project overview with setup instructions and usage examples
                    </p>
                    <Button variant="outline" size="sm">View README</Button>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold">API Documentation</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Comprehensive API reference with endpoints and examples
                    </p>
                    <Button variant="outline" size="sm">View API Docs</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tests Tab */}
            <TabsContent value="tests">
              <Card>
                <CardHeader>
                  <CardTitle>Test Coverage</CardTitle>
                  <CardDescription>Generated test suites and coverage analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Overall Coverage</span>
                        <span className="text-gray-600 dark:text-gray-400">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div className="bg-green-600 h-3 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <TestTube className="w-5 h-5 text-green-600 mb-1" />
                        <p className="font-medium text-sm">Unit Tests</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">142 tests passing</p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <TestTube className="w-5 h-5 text-blue-600 mb-1" />
                        <p className="font-medium text-sm">Integration Tests</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">38 tests passing</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Refactoring Tab */}
            <TabsContent value="refactoring">
              <Card>
                <CardHeader>
                  <CardTitle>Refactoring Suggestions</CardTitle>
                  <CardDescription>Code quality improvements and optimizations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Medium: Code Duplication</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Similar code blocks found in 3 locations. Consider extracting to a shared utility.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <Wrench className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Low: Naming Convention</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Some variables use unclear abbreviations. Use more descriptive names.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA */}
          <Card className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to analyze your own codebase?</h2>
              <p className="mb-6 text-blue-100">
                Get instant insights, documentation, and improvements for any project
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/analyze">
                  <Button size="lg" variant="secondary">
                    Analyze Your Code
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                    Configure Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Made with Bob
