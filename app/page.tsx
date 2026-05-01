'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Code2,
  Upload,
  GitBranch,
  BookOpen,
  TestTube,
  Wrench,
  CheckCircle2,
  ArrowRight,
  FileCode,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { ANALYSIS_MODES } from '@/lib/constants';
import Link from 'next/link';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { isSaaSMode } from '@/lib/config/app-mode';

export default function Home() {
  const [githubUrl, setGithubUrl] = useState('');
  const primaryHref = isSaaSMode() ? '/auth/signup' : '/analyze';
  const primaryLabel = isSaaSMode() ? 'Get Started' : 'Analyze Repository';
  const secondaryHref = isSaaSMode() ? '/auth/signin' : '/analyze';
  const secondaryLabel = isSaaSMode() ? 'Sign In To Analyze' : 'Upload Files';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="mb-4" variant="secondary">
            <Zap className="w-3 h-3 mr-1" />
            Multi-Provider AI Support
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Understand Any Codebase
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              In Minutes
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-powered analysis, documentation, testing, and refactoring for any repository.
            Turn complex codebases into clear, maintainable systems.
          </p>

          {/* Input Section */}
          <div className="mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="url"
                  placeholder="https://github.com/owner/repo or https://gitlab.com/group/project"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Link href={primaryHref}>
                <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  {primaryLabel}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>or</span>
              <Link href={secondaryHref}>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  {secondaryLabel}
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>IBM watsonx.ai</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>OpenAI GPT-4</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Anthropic Claude</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Google AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Analysis Modes
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from multiple analysis modes to get exactly what you need
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Object.entries(ANALYSIS_MODES).map(([key, mode]) => {
            const icons: Record<string, LucideIcon> = {
              explain: BookOpen,
              onboard: GitBranch,
              document: FileCode,
              test: TestTube,
              refactor: Wrench,
              'production-ready': CheckCircle2,
            };
            const Icon = icons[key] || Code2;

            return (
              <Card key={key} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{mode.icon}</span>
                    {mode.title}
                  </CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 bg-white/50 dark:bg-gray-800/50 rounded-3xl my-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Three simple steps to understand any codebase
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              1
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upload or Connect
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Provide a GitHub URL or upload your codebase files
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              2
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Analysis
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI analyzes architecture, dependencies, and code quality
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
              3
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
              Get Results
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Receive comprehensive insights, docs, tests, and improvements
            </p>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}

// Made with Bob
