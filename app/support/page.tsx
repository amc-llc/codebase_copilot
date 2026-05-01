'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Headphones,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Book,
  Mail,
  Code2
} from 'lucide-react';
import Link from 'next/link';
import { isSaaSMode } from '@/lib/config/app-mode';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'medium',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        priority: 'medium',
        category: 'general',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Redirect to GitHub issues in OSS mode
  if (!isSaaSMode()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              OSS Mode Support
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              For support in OSS mode, please visit our GitHub repository to open an issue or view documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a
                href="https://github.com/cobraaisystems/codebase-copilot/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="w-full sm:w-auto">
                  <Code2 className="w-4 h-4 mr-2" />
                  Open GitHub Issue
                </Button>
              </a>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Book className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  // SaaS Mode Support Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Headphones className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Support Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We're here to help. Get support for any issues or questions.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Support Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Submit a Support Ticket
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Ticket Submitted Successfully!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      We've received your support request and will respond within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleChange('category', value)}
                        >
                          <SelectTrigger id="category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Question</SelectItem>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="api">API Integration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value) => handleChange('priority', value)}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide as much detail as possible..."
                        rows={6}
                        value={formData.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('message', e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Ticket
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSaaSMode() ? (
                  <>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">FREE</Badge>
                      <div>
                        <p className="font-medium text-sm">48 hours</p>
                        <p className="text-xs text-gray-500">Standard support</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="mt-1 bg-blue-600">STARTER</Badge>
                      <div>
                        <p className="font-medium text-sm">24 hours</p>
                        <p className="text-xs text-gray-500">Priority support</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="mt-1 bg-purple-600">PRO</Badge>
                      <div>
                        <p className="font-medium text-sm">4 hours</p>
                        <p className="text-xs text-gray-500">Premium support</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge className="mt-1 bg-gradient-to-r from-blue-600 to-cyan-600">ENTERPRISE</Badge>
                      <div>
                        <p className="font-medium text-sm">1 hour</p>
                        <p className="text-xs text-gray-500">Dedicated support</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">OSS</Badge>
                    <div>
                      <p className="font-medium text-sm">Community Support</p>
                      <p className="text-xs text-gray-500">Best effort basis</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/about" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Book className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Documentation</span>
                </Link>
                <Link href="/contact" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Contact Us</span>
                </Link>
                <Link href="/contact" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Contact Form</span>
                </Link>
              </CardContent>
            </Card>

            {/* Common Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">API Key Issues</p>
                  <p className="text-xs text-gray-500">Check Settings → API Keys</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">Analysis Errors</p>
                  <p className="text-xs text-gray-500">Verify repository access</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900 dark:text-white">Billing Questions</p>
                  <p className="text-xs text-gray-500">See pricing page</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I add my API keys?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-300">
                <p>
                  In OSS mode, go to Settings → API Keys and add your provider keys. They are stored encrypted 
                  in your browser's local storage. In SaaS mode, API keys are managed automatically based on your plan.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Which AI providers are supported?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-300">
                <p>
                  We support IBM watsonx.ai (default), OpenAI GPT-4, Anthropic Claude, Google AI, and Ollama Cloud. 
                  You can switch between providers in the Settings page.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my code secure?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-300">
                <p>
                  In OSS mode, your code is sent directly to your chosen AI provider - we never see it. 
                  In SaaS mode, code is processed securely and not permanently stored. See our Privacy Policy for details.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my subscription?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-300">
                <p>
                  Yes, you can cancel anytime from Settings → Subscription. Your access continues until the end 
                  of your billing period, and your data is retained for 30 days.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
