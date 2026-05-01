// App Mode Configuration
// Determines if the app runs in OSS or SaaS mode

export type AppMode = 'oss' | 'saas';

export const APP_MODE: AppMode = (process.env.NEXT_PUBLIC_APP_MODE as AppMode) || 'saas';

export const isSaaSMode = () => APP_MODE === 'saas';
export const isOSSMode = () => APP_MODE === 'oss';

// Feature flags based on mode
export const features = {
  // Authentication
  requireAuth: isSaaSMode(),
  allowSignup: isSaaSMode(),
  
  // Organizations
  organizations: isSaaSMode(),
  multiTenant: isSaaSMode(),
  
  // Payments
  stripe: isSaaSMode(),
  subscriptions: isSaaSMode(),
  billing: isSaaSMode(),
  
  // Support
  ticketing: isSaaSMode(),
  emailSupport: isSaaSMode(),
  
  // Admin
  adminPanel: isSaaSMode(),
  userManagement: isSaaSMode(),
  
  // Analytics
  analytics: isSaaSMode(),
  usageTracking: isSaaSMode(),
  
  // Limits
  analysisLimits: isSaaSMode(),
  rateLimiting: isSaaSMode(),
  
  // Pages
  pricing: isSaaSMode(),
  aboutUs: true, // Available in both modes
  contact: true, // Available in both modes
  privacy: true, // Available in both modes
  terms: true, // Available in both modes
};

// Plan limits (SaaS mode only)
export const planLimits = {
  FREE: {
    maxUsers: 1,
    maxAnalyses: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    features: ['basic-analysis', 'github-integration'],
  },
  STARTER: {
    maxUsers: 5,
    maxAnalyses: 100,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    features: ['basic-analysis', 'github-integration', 'documentation', 'tests'],
  },
  PRO: {
    maxUsers: 20,
    maxAnalyses: 1000,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    features: ['all'],
  },
  ENTERPRISE: {
    maxUsers: -1, // Unlimited
    maxAnalyses: -1, // Unlimited
    maxFileSize: 500 * 1024 * 1024, // 500MB
    features: ['all', 'priority-support', 'custom-models'],
  },
};

// Pricing (SaaS mode only)
export const pricing = {
  FREE: {
    name: 'Free',
    price: 0,
    interval: 'month',
    stripePriceId: null,
    features: [
      '10 analyses per month',
      'Basic code analysis',
      'GitHub integration',
      'Community support',
    ],
  },
  STARTER: {
    name: 'Starter',
    price: 29,
    interval: 'month',
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
    features: [
      '100 analyses per month',
      'All analysis modes',
      'Documentation generation',
      'Test generation',
      'Email support',
      'Up to 5 team members',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 99,
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      '1,000 analyses per month',
      'All analysis modes',
      'Priority AI processing',
      'Advanced refactoring',
      'Production readiness checks',
      'Priority support',
      'Up to 20 team members',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 499,
    interval: 'month',
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Unlimited analyses',
      'All features',
      'Custom AI models',
      'Dedicated support',
      'SLA guarantee',
      'Unlimited team members',
      'Custom integrations',
      'On-premise deployment option',
    ],
  },
};

// Default admin account (SaaS mode only)
export const defaultAdmin = {
  email: process.env.DEFAULT_ADMIN_EMAIL || 'support@cobraaisystems.com',
  password: process.env.DEFAULT_ADMIN_PASSWORD || 'change-me-before-production',
  name: process.env.DEFAULT_ADMIN_NAME || 'Admin',
  role: 'SUPER_ADMIN',
};

// App metadata
export const appMetadata = {
  name: 'Codebase Copilot',
  description: 'AI-powered codebase understanding and improvement platform',
  company: 'Cobra AI Systems',
  supportEmail: 'support@cobraaisystems.com',
  website: 'https://codebasecopilot.com',
  version: '1.0.0',
};

// Made with Bob
