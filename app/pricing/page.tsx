import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { isSaaSMode } from '@/lib/config/app-mode';
import { redirect } from 'next/navigation';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out Codebase CoPilot',
    icon: Zap,
    color: 'from-gray-600 to-gray-700',
    features: [
      '5 analyses per month',
      'Basic AI models',
      'Community support',
      'Public repositories only',
      'Standard response time (48h)',
    ],
    cta: 'Get Started',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Starter',
    price: '$29',
    period: 'per month',
    description: 'For individual developers and small teams',
    icon: Zap,
    color: 'from-blue-600 to-cyan-600',
    features: [
      '100 analyses per month',
      'All AI models',
      'Priority support (24h)',
      'Private repositories',
      'Export results',
      'API access',
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup?plan=starter',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$99',
    period: 'per month',
    description: 'For growing teams and businesses',
    icon: Crown,
    color: 'from-purple-600 to-pink-600',
    features: [
      'Unlimited analyses',
      'All AI models + custom',
      'Premium support (4h)',
      'Team collaboration',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated account manager',
    ],
    cta: 'Start Free Trial',
    href: '/auth/signup?plan=pro',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large organizations with specific needs',
    icon: Building2,
    color: 'from-orange-600 to-red-600',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'On-premise deployment',
      'SLA guarantee',
      'Dedicated support (1h)',
      'Custom AI training',
      'Security audit',
      'Custom contracts',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
];

export default function PricingPage() {
  if (!isSaaSMode()) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular ? 'border-2 border-blue-600 shadow-xl scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className="block">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Need a custom plan? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Made with Bob
