import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                By accessing or using Codebase CoPilot ("Service"), you agree to be bound by these Terms of Service ("Terms").
                If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p>
                These Terms apply to all visitors, users, and others who access or use the Service, whether in OSS (Open Source Software) 
                mode or SaaS (Software as a Service) mode.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2.1 OSS Mode</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Free to use with your own AI provider API keys</li>
                  <li>All processing happens client-side or directly with your chosen AI provider</li>
                  <li>No data stored on our servers</li>
                  <li>Supports IBM watsonx.ai, OpenAI, Anthropic, Google AI, and Ollama Cloud</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2.2 SaaS Mode</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Subscription-based service with tiered plans (FREE, STARTER, PRO, ENTERPRISE)</li>
                  <li>Managed AI provider access</li>
                  <li>Additional features: team collaboration, priority support, advanced analytics</li>
                  <li>Data stored securely on our infrastructure</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.1 Account Creation</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You must be at least 13 years old to use the Service</li>
                  <li>One person or legal entity may not maintain more than one free account</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.2 Account Responsibilities</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You are responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Do not share your account credentials</li>
                  <li>Maintain the confidentiality of your API keys</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>You agree NOT to use the Service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or malware</li>
                <li>Attempt to gain unauthorized access to systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use the Service for competitive analysis or benchmarking</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Resell or redistribute the Service without permission</li>
                <li>Upload code you don't have rights to analyze</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5.1 Your Content</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You retain all rights to code you upload</li>
                  <li>You grant us a license to process your code for analysis purposes</li>
                  <li>You are responsible for ensuring you have rights to upload the code</li>
                  <li>We do not claim ownership of your code or analysis results</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">5.2 Our Service</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The Service, including all content and functionality, is owned by us</li>
                  <li>Our trademarks and logos may not be used without permission</li>
                  <li>The Service is protected by copyright, trademark, and other laws</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Payment Terms (SaaS Mode)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">6.1 Subscription Plans</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>FREE: Limited features, no payment required</li>
                  <li>STARTER: $29/month - Enhanced features and limits</li>
                  <li>PRO: $99/month - Advanced features and priority support</li>
                  <li>ENTERPRISE: Custom pricing - Full features and dedicated support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">6.2 Billing</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Subscriptions are billed monthly or annually in advance</li>
                  <li>All fees are in USD and non-refundable except as required by law</li>
                  <li>We use Stripe for payment processing</li>
                  <li>You authorize us to charge your payment method</li>
                  <li>Prices may change with 30 days notice</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">6.3 Cancellation</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You may cancel your subscription at any time</li>
                  <li>Cancellation takes effect at the end of the current billing period</li>
                  <li>No refunds for partial months</li>
                  <li>Your data will be retained for 30 days after cancellation</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. AI Provider Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                When using the Service, your code is processed by third-party AI providers. You agree to comply with their terms:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IBM watsonx.ai Terms of Service</li>
                <li>OpenAI Terms of Use</li>
                <li>Anthropic Terms of Service</li>
                <li>Google AI Terms of Service</li>
                <li>Ollama Cloud Terms of Service</li>
              </ul>
              <p className="mt-4">
                In OSS mode, you are directly responsible for your relationship with AI providers. In SaaS mode, 
                we manage provider relationships on your behalf.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We strive for 99.9% uptime but do not guarantee uninterrupted service</li>
                <li>Scheduled maintenance will be announced in advance when possible</li>
                <li>We are not liable for service interruptions or data loss</li>
                <li>AI provider availability may affect service functionality</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-white">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The Service is provided "AS IS" without warranties of any kind</li>
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid in the last 12 months</li>
                <li>We are not responsible for AI-generated content accuracy</li>
                <li>You are responsible for backing up your data</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              <p>
                You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Content you upload or analyze</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>We may terminate or suspend your account immediately if you:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent activity</li>
                <li>Fail to pay fees (SaaS mode)</li>
                <li>Request account deletion</li>
              </ul>
              <p className="mt-4">
                Upon termination, your right to use the Service ceases immediately. We may delete your data 
                after a 30-day grace period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes 
                via email or through the Service. Continued use after changes constitutes acceptance of new Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              <p>
                These Terms are governed by the laws of the State of Georgia, USA, without regard to conflict of law provisions.
                Any disputes shall be resolved in the courts of the State of Georgia.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              <p>For questions about these Terms, please contact us through our <Link href="/contact" className="text-blue-600 hover:underline">Contact Form</Link>.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 border-0 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-blue-100">
                By using our service, you agree to these terms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button size="lg" variant="secondary">
                  Start Analyzing Code
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Made with Bob
