export const APP_NAME = 'Codebase Copilot';
export const APP_DESCRIPTION = 'AI-powered codebase understanding and improvement platform';
export const APP_VERSION = '1.0.0';

export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'rust',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
] as const;

export const LANGUAGE_EXTENSIONS: Record<string, string[]> = {
  javascript: ['.js', '.jsx', '.mjs'],
  typescript: ['.ts', '.tsx'],
  python: ['.py', '.pyw'],
  java: ['.java'],
  go: ['.go'],
  rust: ['.rs'],
  c: ['.c', '.h'],
  cpp: ['.cpp', '.cc', '.cxx', '.hpp', '.hh'],
  csharp: ['.cs'],
  php: ['.php'],
  ruby: ['.rb'],
  swift: ['.swift'],
  kotlin: ['.kt', '.kts'],
  scala: ['.scala'],
  html: ['.html', '.htm'],
  css: ['.css', '.scss', '.sass', '.less'],
  json: ['.json'],
  yaml: ['.yaml', '.yml'],
  markdown: ['.md', '.markdown'],
};

export const FRAMEWORK_PATTERNS: Record<string, string[]> = {
  'React': ['react', 'react-dom', 'next', 'gatsby'],
  'Vue': ['vue', 'nuxt', 'vuex'],
  'Angular': ['@angular/core', '@angular/common'],
  'Express': ['express'],
  'Django': ['django', 'requirements.txt'],
  'Flask': ['flask'],
  'Spring': ['spring-boot', 'pom.xml'],
  'Rails': ['rails', 'Gemfile'],
  'Laravel': ['laravel', 'composer.json'],
  'FastAPI': ['fastapi'],
  'NestJS': ['@nestjs/core'],
};

export const ARCHITECTURE_INDICATORS = {
  microservices: ['docker-compose', 'kubernetes', 'service', 'api-gateway'],
  monolith: ['single-entry', 'main.py', 'index.js', 'app.js'],
  mvc: ['models', 'views', 'controllers', 'routes'],
  layered: ['presentation', 'business', 'data', 'domain'],
  'event-driven': ['events', 'handlers', 'subscribers', 'publishers'],
};

export const EXCLUDED_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.cache',
  'vendor',
  '__pycache__',
  '.pytest_cache',
  '.venv',
  'venv',
  '.env',
  '.DS_Store',
  'Thumbs.db',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_FILES = 1000;

export const ANALYSIS_MODES = {
  explain: {
    title: 'Explain Codebase',
    description: 'Get a comprehensive explanation of the codebase architecture and components',
    icon: '📖',
  },
  onboard: {
    title: 'Onboard Me',
    description: 'Generate a complete onboarding guide for new developers',
    icon: '🚀',
  },
  document: {
    title: 'Generate Documentation',
    description: 'Create comprehensive documentation including README and API docs',
    icon: '📝',
  },
  test: {
    title: 'Generate Tests',
    description: 'Generate unit and integration tests for critical functions',
    icon: '🧪',
  },
  refactor: {
    title: 'Refactor & Improve',
    description: 'Identify code smells and suggest improvements',
    icon: '🔧',
  },
  'production-ready': {
    title: 'Production Readiness',
    description: 'Complete analysis and preparation for production deployment',
    icon: '✅',
  },
} as const;

export const EXPLANATION_LEVELS = {
  beginner: {
    title: 'Beginner',
    description: 'Simple explanations with analogies',
    icon: '🌱',
  },
  intermediate: {
    title: 'Intermediate',
    description: 'Technical details and best practices',
    icon: '🌿',
  },
  senior: {
    title: 'Senior',
    description: 'Architecture focus and trade-offs',
    icon: '🌳',
  },
} as const;

export const RISK_SEVERITY_COLORS = {
  critical: 'text-red-600 bg-red-50',
  high: 'text-orange-600 bg-orange-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-blue-600 bg-blue-50',
} as const;

export const PROVIDER_COLORS = {
  ibm: 'from-blue-600 to-blue-700',
  openai: 'from-green-600 to-green-700',
  anthropic: 'from-purple-600 to-purple-700',
  google: 'from-red-600 to-orange-600',
} as const;

// Made with Bob
