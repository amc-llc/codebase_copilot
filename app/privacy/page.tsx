import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1.1 Information You Provide</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (email, name, organization details)</li>
                  <li>API keys for AI providers (stored encrypted locally in OSS mode)</li>
                  <li>Repository URLs and uploaded code files</li>
                  <li>Support tickets and communications</li>
                  <li>Payment information (processed securely through Stripe)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1.2 Automatically Collected Information</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Usage data and analytics</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>We use the collected information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve our AI-powered codebase analysis services</li>
                <li>Process your code through selected AI providers (IBM watsonx.ai, OpenAI, Anthropic, Google AI, Ollama Cloud)</li>
                <li>Manage your account and subscriptions</li>
                <li>Send service updates and support communications</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Comply with legal obligations and prevent fraud</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.1 OSS Mode</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>API keys are stored in your browser using lightweight obfuscation</li>
                  <li>Analysis requests run through the application server when you start a job</li>
                  <li>Uploaded code is processed for the active analysis request and is not intended for long-term storage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3.2 SaaS Mode</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Data stored in secure PostgreSQL database (Neon)</li>
                  <li>Encrypted connections (TLS/SSL)</li>
                  <li>Regular security audits and updates</li>
                  <li>Redis caching with automatic expiration</li>
                  <li>Code repositories are processed and not permanently stored</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>We integrate with the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>AI Providers:</strong> IBM watsonx.ai, OpenAI, Anthropic, Google AI, Ollama Cloud</li>
                <li><strong>Payment Processing:</strong> Stripe</li>
                <li><strong>Database:</strong> Neon (PostgreSQL)</li>
                <li><strong>Caching:</strong> Upstash Redis</li>
                <li><strong>Email:</strong> Resend</li>
                <li><strong>Authentication:</strong> NextAuth.js</li>
              </ul>
              <p className="mt-4">
                Each service has its own privacy policy. Your code is sent to your chosen AI provider for analysis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account data: Retained while your account is active</li>
                <li>Analysis results: Stored for 90 days (SaaS mode)</li>
                <li>Support tickets: Retained for 2 years</li>
                <li>Payment records: Retained as required by law (typically 7 years)</li>
                <li>Cached data: Automatically expires after 24 hours</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us through our <Link href="/contact" className="text-blue-600 hover:underline">Contact Form</Link>.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>We use cookies for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Authentication and session management</li>
                <li>User preferences and settings</li>
                <li>Analytics and performance monitoring</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              <p>
                Our service is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              <p>
                Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-300">
              <p>If you have questions about this privacy policy, please contact us through our <Link href="/contact" className="text-blue-600 hover:underline">Contact Form</Link>.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 border-0 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Questions About Privacy?</CardTitle>
              <CardDescription className="text-blue-100">
                We're here to help. Contact our team anytime.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Contact Us
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
