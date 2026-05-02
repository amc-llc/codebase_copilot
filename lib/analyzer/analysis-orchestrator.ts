/**
 * Analysis Orchestrator
 * Coordinates parsing, heuristics, and optional AI-assisted outputs.
 */

import { CodebaseParser, CodebaseStatistics } from './codebase-parser';
import { ArchitectureAnalyzer } from './architecture-analyzer';
import { TestGenerator } from './test-generator';
import { RefactorAnalyzer } from './refactor-analyzer';
import { loadRepositoryFromUrl } from './repository-loader';
import { AIProviderFactory } from '@/lib/ai/provider-factory';
import {
  AIProviderConfig,
  AnalysisRequest,
  AnalysisResult,
  CodeAnalysis,
  CodeDefinition,
  CodebaseMetadata,
  CodebaseSource,
  DependencyGraph,
  DependencyNode,
  Documentation,
  Explanation,
  ExplanationLevel,
  FileNode,
  KeyFile,
  LanguageStats,
  OnboardingGuide,
  ProductionReadinessReport,
  RefactorSuggestion,
  Risk,
  TestSuite,
  UploadedCodeFile,
} from '@/types';

const PROJECT_NAME_FALLBACK = 'Uploaded Codebase';
const MAX_CONTINUATION_ATTEMPTS = 2;

export class AnalysisOrchestrator {
  private parser: CodebaseParser;
  private architectureAnalyzer: ArchitectureAnalyzer;
  private testGenerator: TestGenerator;
  private refactorAnalyzer: RefactorAnalyzer;

  constructor() {
    this.parser = new CodebaseParser();
    this.architectureAnalyzer = new ArchitectureAnalyzer();
    this.testGenerator = new TestGenerator();
    this.refactorAnalyzer = new RefactorAnalyzer();
  }

  async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
    const files = await this.loadFiles(request.source);
    const { definitions, dependencies, statistics } = await this.parser.parseCodebase(files);

    const frameworks = this.architectureAnalyzer.detectFrameworks(files);
    const entryPoints = this.architectureAnalyzer.identifyEntryPoints(files);
    const metadata: CodebaseMetadata = {
      name: this.extractProjectName(files),
      totalFiles: statistics.totalFiles,
      totalLines: statistics.totalLines,
      languages: this.convertToLanguageStats(statistics),
      frameworks,
      dependencies: await this.extractDependencies(files),
      entryPoints,
    };

    const architecture = await this.architectureAnalyzer.analyzeArchitecture(
      files,
      dependencies,
      metadata
    );

    const analysis: CodeAnalysis = {
      id: this.generateId(),
      timestamp: new Date(),
      source: request.source,
      metadata,
      architecture,
      dependencies: this.convertDependencyGraph(dependencies),
      summary: this.generateSummary(metadata, architecture),
      keyFiles: this.identifyKeyFiles(files, definitions),
      complexityScore: this.calculateComplexity(statistics, dependencies),
      risks: this.identifyRisks(files, statistics),
    };

    const result: AnalysisResult = { analysis };

    switch (request.mode) {
      case 'explain':
        result.explanation = await this.generateExplanation(
          analysis,
          request.explanationLevel || 'intermediate',
          request.provider
        );
        break;
      case 'onboard':
        result.onboarding = await this.generateOnboarding(analysis, request.provider);
        break;
      case 'document':
        result.documentation = await this.generateDocumentation(analysis, request.provider);
        break;
      case 'test':
        result.tests = await this.generateTests(files, definitions, request.provider);
        break;
      case 'refactor':
        result.refactorings = await this.generateRefactorings(files, definitions, request.provider);
        break;
      case 'production-ready':
        result.productionReadiness = await this.generateProductionReadiness(
          analysis,
          files,
          definitions,
          request.provider
        );
        break;
    }

    return result;
  }

  private async generateExplanation(
    analysis: CodeAnalysis,
    level: ExplanationLevel,
    providerConfig: AIProviderConfig
  ): Promise<Explanation> {
    const prompt = this.buildExplanationPrompt(analysis, level);
    const response = await this.generateLongFormText(providerConfig, prompt);

    return this.parseExplanationResponse(response, level);
  }

  private buildExplanationPrompt(analysis: CodeAnalysis, level: ExplanationLevel): string {
    const context = [
      `Codebase: ${analysis.metadata.name}`,
      `Architecture: ${analysis.architecture.type}`,
      `Languages: ${analysis.metadata.languages.map((language) => language.language).join(', ') || 'Unknown'}`,
      `Frameworks: ${analysis.metadata.frameworks.join(', ') || 'None detected'}`,
      `Entry points: ${analysis.metadata.entryPoints.join(', ') || 'None detected'}`,
      `Summary: ${analysis.summary}`,
    ].join('\n');

    if (level === 'beginner') {
      return `${context}

Explain this codebase in beginner-friendly terms.
Cover what it does, how the main parts fit together, where to start reading, and what a new developer should learn first.`;
    }

    if (level === 'senior') {
      return `${context}

Provide a concise senior-level architecture review.
Focus on system boundaries, trade-offs, critical paths, and likely technical debt.`;
    }

    return `${context}

Provide an intermediate developer explanation of the codebase.
Cover architecture, key modules, runtime flow, and how to navigate it effectively.`;
  }

  private parseExplanationResponse(response: string, level: ExplanationLevel): Explanation {
    const sections = response.split('\n\n').filter(Boolean);

    return {
      level,
      summary: sections[0] || response.slice(0, 240),
      details: response,
      codeExamples: [],
      diagrams: [],
      nextSteps: this.extractNextSteps(response),
    };
  }

  private extractNextSteps(response: string): string[] {
    return response
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^[\d*-]/.test(line))
      .map((line) => line.replace(/^[\d*.-]+\s*/, ''))
      .slice(0, 5);
  }

  private async generateOnboarding(
    analysis: CodeAnalysis,
    providerConfig: AIProviderConfig
  ): Promise<OnboardingGuide> {
    const prompt = `Generate an onboarding guide for this codebase:

${JSON.stringify(analysis.metadata, null, 2)}

Architecture: ${analysis.architecture.description}
Key files: ${analysis.keyFiles.map((file) => file.path).join(', ')}

Return a practical guide with setup steps, common pitfalls, and a short learning path.`;
    const response = await this.generateLongFormText(providerConfig, prompt);

    return {
      overview: response,
      gettingStarted: this.extractBullets(response, ['setup', 'getting started']),
      keyFiles: analysis.keyFiles,
      architecture: analysis.architecture.description,
      setupInstructions: this.extractBullets(response, ['setup', 'install']),
      commonPitfalls: this.extractBullets(response, ['pitfall', 'watch out']),
      suggestedTasks: this.extractBullets(response, ['task', 'next']),
      learningPath: this.buildLearningPath(analysis.keyFiles),
    };
  }

  private async generateDocumentation(
    analysis: CodeAnalysis,
    providerConfig: AIProviderConfig
  ): Promise<Documentation> {
    const prompt = `Generate documentation for this codebase:

${JSON.stringify(analysis.metadata, null, 2)}

Create sections for README, architecture, setup, and contributing.`;
    const response = await this.generateLongFormText(providerConfig, prompt);

    return {
      readme: this.extractSection(response, 'readme') || response,
      architectureDocs: this.extractSection(response, 'architecture'),
      setupGuide: this.extractSection(response, 'setup'),
      contributingGuide: this.extractSection(response, 'contributing'),
      apiDocs: this.extractSection(response, 'api'),
    };
  }

  private async generateLongFormText(
    providerConfig: AIProviderConfig,
    prompt: string
  ): Promise<string> {
    const provider = AIProviderFactory.createProvider(providerConfig);
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      { role: 'user', content: prompt },
    ];
    const chunks: string[] = [];

    for (let attempt = 0; attempt <= MAX_CONTINUATION_ATTEMPTS; attempt += 1) {
      const response = await provider.chat(messages);
      const chunk = response.content.trim();

      if (!chunk) {
        break;
      }

      chunks.push(chunk);

      if (!this.shouldContinueResponse(response.stopReason)) {
        break;
      }

      messages.push({ role: 'assistant', content: chunk });
      messages.push({
        role: 'user',
        content:
          'Continue exactly where you left off. Do not repeat anything you already wrote. Finish the remaining response only.',
      });
    }

    return chunks.join('\n\n').trim();
  }

  private shouldContinueResponse(stopReason: string | undefined): boolean {
    if (!stopReason) {
      return false;
    }

    const normalized = stopReason.toLowerCase();
    const truncationSignals = ['length', 'max_tokens', 'model_length', 'max_output_tokens'];

    return truncationSignals.includes(normalized);
  }

  private extractSection(text: string, sectionName: string): string {
    const lines = text.split('\n');
    const collected: string[] = [];
    let inSection = false;

    for (const line of lines) {
      const lowered = line.toLowerCase();
      if (lowered.includes(sectionName)) {
        inSection = true;
        continue;
      }

      if (inSection && line.startsWith('#')) {
        break;
      }

      if (inSection) {
        collected.push(line);
      }
    }

    return collected.join('\n').trim();
  }

  private async generateTests(
    files: FileNode[],
    definitions: CodeDefinition[],
    providerConfig: AIProviderConfig
  ): Promise<TestSuite> {
    return this.testGenerator.generateTests(files, definitions, providerConfig);
  }

  private async generateRefactorings(
    files: FileNode[],
    definitions: CodeDefinition[],
    providerConfig: AIProviderConfig
  ): Promise<RefactorSuggestion[]> {
    return this.refactorAnalyzer.analyzeForRefactoring(files, definitions, providerConfig);
  }

  private async generateProductionReadiness(
    analysis: CodeAnalysis,
    files: FileNode[],
    definitions: CodeDefinition[],
    providerConfig: AIProviderConfig
  ): Promise<ProductionReadinessReport> {
    const tests = await this.testGenerator.generateTests(files, definitions, providerConfig);
    const refactorings = await this.refactorAnalyzer.analyzeForRefactoring(
      files,
      definitions,
      providerConfig
    );

    const criticalIssues = refactorings.filter((item) => item.severity === 'critical').length;
    const highIssues = refactorings.filter((item) => item.severity === 'high').length;
    const score = Math.max(
      0,
      Math.round((tests.coverage.overall + (100 - criticalIssues * 20 - highIssues * 10)) / 2)
    );

    return {
      score,
      status: score >= 80 ? 'ready' : score >= 60 ? 'needs-work' : 'not-ready',
      checklist: [
        {
          category: 'Testing',
          item: 'Automated tests generated',
          status: tests.tests.length > 0 ? 'complete' : 'incomplete',
          priority: 'high',
        },
        {
          category: 'Code Quality',
          item: 'No critical refactoring issues',
          status: criticalIssues === 0 ? 'complete' : 'incomplete',
          priority: 'critical',
        },
        {
          category: 'Security',
          item: 'No detected secret-like strings in source files',
          status: analysis.risks.some((risk) => risk.category === 'security') ? 'incomplete' : 'complete',
          priority: 'critical',
        },
      ],
      codeQuality: {
        maintainabilityIndex: Math.max(0, 100 - refactorings.length * 3),
        cyclomaticComplexity: Math.round(analysis.complexityScore / 5),
        codeSmells: refactorings.length,
        technicalDebt: `${Math.max(1, Math.ceil(refactorings.length / 3))} day(s)`,
        testCoverage: tests.coverage.overall,
      },
      documentation: {
        readme: analysis.summary,
      },
      tests,
      improvements: refactorings,
      securityIssues: analysis.risks.filter((risk) => risk.category === 'security'),
      performanceIssues: analysis.risks.filter((risk) => risk.category === 'performance'),
      deploymentChecklist: [
        'Add real authentication and authorization checks',
        'Add environment validation for SaaS deployments',
        'Run automated tests in CI',
        'Configure observability and error tracking',
      ],
    };
  }

  private async loadFiles(source: CodebaseSource): Promise<FileNode[]> {
    if (source.type === 'github') {
      if (!source.url) {
        throw new Error('A public repository URL is required for repository analysis.');
      }

      const repositoryFiles = await loadRepositoryFromUrl(source.url, source.branch);
      return repositoryFiles.map((file) => this.toFileNode(file));
    }

    const uploadedFiles = source.files || [];
    if (uploadedFiles.length === 0) {
      throw new Error('No uploaded files were provided for analysis.');
    }

    return uploadedFiles.map((file) => this.toFileNode(file));
  }

  private toFileNode(file: UploadedCodeFile): FileNode {
    const extensionIndex = file.name.lastIndexOf('.');
    const extension = extensionIndex >= 0 ? file.name.slice(extensionIndex) : undefined;

    return {
      path: file.path,
      name: file.name,
      type: 'file',
      extension,
      size: file.size,
      content: file.content,
      lines: file.lines,
    };
  }

  private extractProjectName(files: FileNode[]): string {
    const packageJson = files.find((file) => file.name === 'package.json');
    if (!packageJson?.content) {
      return PROJECT_NAME_FALLBACK;
    }

    try {
      const pkg = JSON.parse(packageJson.content) as { name?: string };
      return pkg.name || PROJECT_NAME_FALLBACK;
    } catch {
      return PROJECT_NAME_FALLBACK;
    }
  }

  private convertToLanguageStats(statistics: CodebaseStatistics): LanguageStats[] {
    const totalFiles = statistics.totalFiles || 1;

    return Object.entries(statistics.filesByLanguage)
      .map(([language, fileCount]) => ({
        language,
        files: fileCount,
        lines: 0,
        percentage: Number(((fileCount / totalFiles) * 100).toFixed(1)),
      }))
      .sort((left, right) => right.files - left.files);
  }

  private async extractDependencies(files: FileNode[]): Promise<Record<string, string>> {
    const packageJson = files.find((file) => file.name === 'package.json');
    if (!packageJson?.content) {
      return {};
    }

    try {
      const pkg = JSON.parse(packageJson.content) as {
        dependencies?: Record<string, string>;
      };
      return pkg.dependencies || {};
    } catch {
      return {};
    }
  }

  private convertDependencyGraph(graph: DependencyGraph): DependencyNode[] {
    const nodeMap = new Map<string, DependencyNode>();

    for (const node of graph.nodes) {
      nodeMap.set(node.id, {
        id: node.id,
        name: node.label,
        type: node.type === 'external' ? 'external' : 'internal',
        dependencies: [],
        dependents: [],
      });
    }

    for (const edge of graph.edges) {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      if (!source || !target) {
        continue;
      }

      source.dependencies.push(target.id);
      target.dependents.push(source.id);
    }

    return [...nodeMap.values()].sort((left, right) => right.dependents.length - left.dependents.length);
  }

  private generateSummary(metadata: CodebaseMetadata, architecture: CodeAnalysis['architecture']): string {
    const frameworks = metadata.frameworks.length > 0 ? metadata.frameworks.join(', ') : 'no clear framework';
    const languages = metadata.languages.map((language) => language.language).join(', ') || 'unknown languages';

    return `${metadata.name} looks like a ${architecture.type} codebase built with ${frameworks}. It contains ${metadata.totalFiles} source files across ${languages}.`;
  }

  private identifyKeyFiles(files: FileNode[], definitions: CodeDefinition[]): KeyFile[] {
    const definitionCounts = new Map<string, number>();
    for (const definition of definitions) {
      definitionCounts.set(
        definition.filePath,
        (definitionCounts.get(definition.filePath) || 0) + 1
      );
    }

    const scoredFiles = files
      .filter((file) => file.type === 'file')
      .map((file) => {
        const path = file.path.toLowerCase();
        let score = definitionCounts.get(file.path) || 0;
        let reason = 'Contains notable code definitions or project structure.';

        if (path.endsWith('package.json')) {
          score += 10;
          reason = 'Defines the project package metadata, scripts, and dependencies.';
        } else if (path.includes('app/layout') || path.includes('app/page')) {
          score += 8;
          reason = 'Acts as a top-level entry point for the application UI.';
        } else if (path.includes('prisma/schema.prisma')) {
          score += 8;
          reason = 'Defines the database schema and core SaaS data model.';
        } else if (path.includes('auth') || path.includes('settings')) {
          score += 6;
          reason = 'Touches a user-critical SaaS workflow.';
        } else if (path.endsWith('next.config.ts')) {
          score += 6;
          reason = 'Controls build and runtime behavior for the app.';
        }

        return {
          path: file.path,
          score,
          reason,
          linesOfCode: file.lines || 0,
        };
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, 8);

    return scoredFiles.map((file, index) => ({
      path: file.path,
      importance: index < 2 ? 'critical' : index < 5 ? 'high' : 'medium',
      reason: file.reason,
      linesOfCode: file.linesOfCode,
    }));
  }

  private calculateComplexity(statistics: CodebaseStatistics, dependencies: DependencyGraph): number {
    const fileWeight = statistics.totalFiles * 0.6;
    const lineWeight = statistics.totalLines * 0.0025;
    const dependencyWeight = dependencies.edges.length * 0.8;
    return Math.min(100, Math.round(fileWeight + lineWeight + dependencyWeight));
  }

  private identifyRisks(files: FileNode[], statistics: CodebaseStatistics): Risk[] {
    const risks: Risk[] = [];
    const secretPattern = /(api[_-]?key|secret|token|password)\s*[:=]\s*['"`][^'"`\n]{8,}['"`]/i;

    for (const file of files) {
      if (file.type !== 'file' || !file.content) {
        continue;
      }

      if (secretPattern.test(file.content)) {
        risks.push({
          severity: 'high',
          category: 'security',
          description: 'Potential hardcoded credential or token found in source.',
          location: file.path,
          suggestion: 'Move secrets to environment variables or a secure secrets manager.',
        });
      }

      if ((file.lines || 0) > 500) {
        risks.push({
          severity: 'medium',
          category: 'maintainability',
          description: `Large file detected (${file.lines} lines).`,
          location: file.path,
          suggestion: 'Split the file into smaller focused modules.',
        });
      }
    }

    const hasTests = files.some((file) =>
      /\.(test|spec)\.(js|jsx|ts|tsx|py)$/.test(file.name)
    );
    if (!hasTests && statistics.totalFiles > 10) {
      risks.push({
        severity: 'medium',
        category: 'complexity',
        description: 'No automated test files were detected in the uploaded codebase.',
        suggestion: 'Add unit and integration tests around critical workflows.',
      });
    }

    return risks.slice(0, 10);
  }

  private extractBullets(text: string, keywords: string[]): string[] {
    const lines = text.split('\n').map((line) => line.trim());
    const keywordSet = keywords.map((keyword) => keyword.toLowerCase());
    const items: string[] = [];
    let inSection = false;

    for (const line of lines) {
      const lowered = line.toLowerCase();
      if (keywordSet.some((keyword) => lowered.includes(keyword))) {
        inSection = true;
        continue;
      }

      if (inSection && /^[\d*-]/.test(line)) {
        items.push(line.replace(/^[\d*.-]+\s*/, ''));
      } else if (inSection && line === '') {
        break;
      }
    }

    return items.slice(0, 5);
  }

  private buildLearningPath(keyFiles: KeyFile[]) {
    return keyFiles.slice(0, 3).map((file, index) => ({
      order: index + 1,
      title: `Read ${file.path.split('/').pop() || file.path}`,
      description: file.reason,
      files: [file.path],
      estimatedTime: `${index + 1}0 minutes`,
    }));
  }

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}
