'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Target, Zap, Heart, Globe } from 'lucide-react';
import Link from 'next/link';
import { isOSSMode, isSaaSMode } from '@/lib/config/app-mode';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4">About Us</Badge>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Empowering Developers with AI
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
          Codebase CoPilot is on a mission to make every codebase instantly understandable,
          well-documented, and production-ready through the power of AI.
        </p>
        {isOSSMode() && (
          <Badge variant="secondary" className="text-sm">
            Open Source • Available on GitHub
          </Badge>
        )}
        {isSaaSMode() && (
          <Badge variant="secondary" className="text-sm">
            Hosted on Vercel • Enterprise Ready
          </Badge>
        )}
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                To eliminate the complexity barrier in software development by providing
                AI-powered tools that instantly analyze, document, and improve any codebase,
                making development faster and more accessible for everyone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-12 h-12 text-cyan-600 mb-4" />
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                A world where every developer can understand any codebase in minutes,
                where documentation writes itself, and where code quality is automatically
                maintained through intelligent AI assistance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 py-16 bg-white/50 dark:bg-gray-800/50 rounded-3xl my-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h3>
          <p className="text-gray-600 dark:text-gray-300">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Developer-First
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Every feature is designed with developers in mind, solving real problems
              they face every day.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Open & Transparent
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              We believe in open-source principles and transparent AI that developers
              can trust and understand.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Accessible to All
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              From solo developers to enterprise teams, our tools are designed to be
              accessible and valuable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powered by Leading AI
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We integrate with the best AI providers to give you choice and flexibility
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {['IBM watsonx.ai', 'OpenAI', 'Anthropic', 'Google AI', 'Ollama'].map((provider) => (
              <div
                key={provider}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 transition-colors"
              >
                <p className="font-semibold text-gray-900 dark:text-white">{provider}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Built by COBRA AI Systems
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A team of passionate developers and AI researchers dedicated to making
            software development more efficient and enjoyable.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto bg-gradient-to-br from-blue-600 to-cyan-600 border-0 text-white text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-blue-100 text-lg">
              Join thousands of developers using Codebase CoPilot to understand and improve their code
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button size="lg" variant="secondary">
                  Try It Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}

// Made with Bob
