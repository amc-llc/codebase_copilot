// Core types for Codebase Copilot

export type AIProvider = 'ibm' | 'openai' | 'anthropic' | 'google' | 'ollama';

export type ExplanationLevel = 'beginner' | 'intermediate' | 'senior';

export type AnalysisMode = 
  | 'explain' 
  | 'onboard' 
  | 'document' 
  | 'test' 
  | 'refactor' 
  | 'production-ready';

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface UploadedCodeFile {
  path: string;
  name: string;
  content: string;
  size: number;
  lines: number;
}

export interface CodebaseSource {
  type: 'github' | 'upload';
  url?: string;
  files?: UploadedCodeFile[];
  branch?: string;
}

export interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  extension?: string;
  size?: number;
  content?: string;
  lines?: number;
  children?: FileNode[];
}

export interface CodeDefinition {
  name: string;
  type: 'class' | 'function' | 'method' | 'interface' | 'type' | 'variable';
  filePath: string;
  line: number;
  language: string;
  signature?: string;
  documentation?: string;
}

export interface ImportStatement {
  source: string;
  line: number;
  type: 'es6' | 'commonjs' | 'python' | 'java' | 'other';
  imports?: string[];
}

export interface DependencyGraph {
  nodes: DependencyGraphNode[];
  edges: DependencyGraphEdge[];
}

export interface DependencyGraphNode {
  id: string;
  label: string;
  type: 'file' | 'external' | 'module';
  metadata?: Record<string, unknown>;
}

export interface DependencyGraphEdge {
  source: string;
  target: string;
  type: string;
  weight?: number;
}

export interface CodebaseMetadata {
  name: string;
  totalFiles: number;
  totalLines: number;
  languages: LanguageStats[];
  frameworks: string[];
  dependencies: Record<string, string>;
  entryPoints: string[];
}

export interface LanguageStats {
  language: string;
  files: number;
  lines: number;
  percentage: number;
}

export interface ArchitecturePattern {
  type: 'monolith' | 'microservices' | 'mvc' | 'layered' | 'event-driven' | 'unknown';
  confidence: number;
  description: string;
  components: string[];
}

export interface DependencyNode {
  id: string;
  name: string;
  type: 'internal' | 'external';
  dependencies: string[];
  dependents: string[];
}

export interface CodeAnalysis {
  id: string;
  timestamp: Date;
  source: CodebaseSource;
  metadata: CodebaseMetadata;
  architecture: ArchitecturePattern;
  dependencies: DependencyNode[];
  summary: string;
  keyFiles: KeyFile[];
  complexityScore: number;
  risks: Risk[];
}

export interface KeyFile {
  path: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  linesOfCode: number;
}

export interface Risk {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'security' | 'performance' | 'maintainability' | 'complexity';
  description: string;
  location?: string;
  suggestion?: string;
}

export interface Explanation {
  level: ExplanationLevel;
  summary: string;
  details: string;
  codeExamples?: CodeExample[];
  diagrams?: string[];
  nextSteps?: string[];
}

export interface CodeExample {
  title: string;
  code: string;
  language: string;
  explanation: string;
}

export interface OnboardingGuide {
  overview: string;
  gettingStarted: string[];
  keyFiles: KeyFile[];
  architecture: string;
  setupInstructions: string[];
  commonPitfalls: string[];
  suggestedTasks: string[];
  learningPath: LearningStep[];
}

export interface LearningStep {
  order: number;
  title: string;
  description: string;
  files: string[];
  estimatedTime: string;
}

export interface Documentation {
  readme: string;
  apiDocs?: string;
  architectureDocs?: string;
  setupGuide?: string;
  contributingGuide?: string;
  inlineComments?: Record<string, string[]>;
}

export interface TestSuite {
  framework: string;
  tests: GeneratedTest[];
  coverage: TestCoverage;
  setupInstructions: string[];
}

export interface GeneratedTest {
  filePath: string;
  testCode: string;
  description: string;
  targetFunction: string;
  testCases: TestCase[];
}

export interface TestCase {
  name: string;
  input: unknown;
  expectedOutput: unknown;
  description: string;
}

export interface TestCoverage {
  overall: number;
  byFile: Record<string, number>;
  uncoveredFiles: string[];
}

export interface RefactorSuggestion {
  type: 'duplication' | 'naming' | 'complexity' | 'performance' | 'dead-code';
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  issue: string;
  suggestion: string;
  refactoredCode?: string;
  impact: string;
}

export interface ProductionReadinessReport {
  score: number;
  status: 'ready' | 'needs-work' | 'not-ready';
  checklist: ChecklistItem[];
  codeQuality: QualityMetrics;
  documentation: Documentation;
  tests: TestSuite;
  improvements: RefactorSuggestion[];
  securityIssues: Risk[];
  performanceIssues: Risk[];
  deploymentChecklist: string[];
}

export interface ChecklistItem {
  category: string;
  item: string;
  status: 'complete' | 'incomplete' | 'not-applicable';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface QualityMetrics {
  maintainabilityIndex: number;
  cyclomaticComplexity: number;
  codeSmells: number;
  technicalDebt: string;
  testCoverage: number;
}

export interface AnalysisResult {
  analysis: CodeAnalysis;
  explanation?: Explanation;
  onboarding?: OnboardingGuide;
  documentation?: Documentation;
  tests?: TestSuite;
  refactorings?: RefactorSuggestion[];
  productionReadiness?: ProductionReadinessReport;
}

export interface AnalysisRequest {
  source: CodebaseSource;
  mode: AnalysisMode;
  explanationLevel?: ExplanationLevel;
  provider: AIProviderConfig;
  options?: AnalysisOptions;
}

export interface AnalysisOptions {
  includeTests?: boolean;
  includeDocumentation?: boolean;
  includeRefactoring?: boolean;
  maxFileSize?: number;
  excludePatterns?: string[];
  focusAreas?: string[];
}

export interface AppState {
  currentAnalysis: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  providerConfig: AIProviderConfig;
  preferences: UserPreferences;
  isAnalyzing: boolean;
  error: string | null;
}

export interface UserPreferences {
  defaultProvider: AIProvider;
  defaultExplanationLevel: ExplanationLevel;
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  maxHistoryItems: number;
}

// Made with Bob
