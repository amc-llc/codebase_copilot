/**
 * Analysis Orchestrator
 * Coordinates all analysis components and AI providers
 */

import { CodebaseParser } from './codebase-parser';
import { ArchitectureAnalyzer } from './architecture-analyzer';
import { AIProviderFactory } from '@/lib/ai/provider-factory';
import {
  FileNode,
  AnalysisRequest,
  AnalysisResult,
  CodeAnalysis,
  Explanation,
  OnboardingGuide,
  Documentation,
  TestSuite,
  RefactorSuggestion,
  ProductionReadinessReport,
  ExplanationLevel,
  CodebaseMetadata,
} from '@/types';

export class AnalysisOrchestrator {
  private parser: CodebaseParser;
  private architectureAnalyzer: ArchitectureAnalyzer;

  constructor() {
    this.parser = new CodebaseParser();
    this.architectureAnalyzer = new ArchitectureAnalyzer();
  }

  /**
   * Main analysis entry point
   */
  async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
    // Step 1: Parse codebase
    const files = await this.loadFiles(request.source);
    const { definitions, dependencies, statistics } = await this.parser.parseCodebase(files);

    // Step 2: Analyze architecture
    const frameworks = this.architectureAnalyzer.detectFrameworks(files);
    const entryPoints = this.architectureAnalyzer.identifyEntryPoints(files);
    
    const metadata: CodebaseMetadata = {
      name: this.extractProjectName(files),
      totalFiles: statistics.totalFiles,
      totalLines: statistics.totalLines,
      languages: this.convertToLanguageStats(statistics.filesByLanguage, statistics.totalFiles),
      frameworks,
      dependencies: await this.extractDependencies(files),
      entryPoints,
    };

    const architecture = await this.architectureAnalyzer.analyzeArchitecture(
      files,
      dependencies,
      metadata
    );

    // Step 3: Create base analysis
    const analysis: CodeAnalysis = {
      id: this.generateId(),
      timestamp: new Date(),
      source: request.source,
      metadata,
      architecture,
      dependencies: this.convertDependencyGraph(dependencies),
      summary: await this.generateSummary(metadata, architecture, request.provider),
      keyFiles: await this.identifyKeyFiles(files, definitions),
      complexityScore: this.calculateComplexity(statistics, dependencies),
      risks: await this.identifyRisks(files, statistics),
    };

    // Step 4: Generate mode-specific outputs
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
        result.onboarding = await this.generateOnboarding(analysis, files, request.provider);
        break;

      case 'document':
        result.documentation = await this.generateDocumentation(analysis, files, request.provider);
        break;

      case 'test':
        result.tests = await this.generateTests(analysis, files, definitions, request.provider);
        break;

      case 'refactor':
        result.refactorings = await this.generateRefactorings(analysis, files, request.provider);
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

  /**
   * Generate multi-level explanation
   */
  private async generateExplanation(
    analysis: CodeAnalysis,
    level: ExplanationLevel,
    providerConfig: any
  ): Promise<Explanation> {
    const provider = AIProviderFactory.createProvider(providerConfig);
    
    const prompt = this.buildExplanationPrompt(analysis, level);
    const messages = [
      { role: 'user' as const, content: prompt }
    ];
    const response = await provider.chat(messages);

    return this.parseExplanationResponse(response.content, level);
  }

  /**
   * Build explanation prompt based on level
   */
  private buildExplanationPrompt(analysis: CodeAnalysis, level: ExplanationLevel): string {
    const baseContext = `
Codebase: ${analysis.metadata.name}
Architecture: ${analysis.architecture.type}
Languages: ${analysis.metadata.languages.map(l => l.language).join(', ')}
Frameworks: ${analysis.metadata.frameworks.join(', ')}
Total Files: ${analysis.metadata.totalFiles}
Total Lines: ${analysis.metadata.totalLines}
`;

    switch (level) {
      case 'beginner':
        return `${baseContext}

Explain this codebase in simple terms that a beginner developer can understand.
Use analogies and avoid technical jargon. Focus on:
1. What the application does (in plain English)
2. How the main parts work together (using simple analogies)
3. Where to start reading the code
4. What skills are needed to work on this

Keep it friendly and encouraging.`;

      case 'intermediate':
        return `${baseContext}

Provide a technical explanation of this codebase for an intermediate developer.
Include:
1. High-level architecture overview
2. Key components and their responsibilities
3. Data flow and main execution paths
4. Important design patterns used
5. Technology stack explanation
6. How to navigate the codebase effectively

Be clear and structured.`;

      case 'senior':
        return `${baseContext}

Provide a concise, architecture-focused analysis for a senior engineer.
Focus on:
1. Architectural decisions and trade-offs
2. System boundaries and integration points
3. Scalability and performance considerations
4. Technical debt and improvement opportunities
5. Critical paths and potential bottlenecks

Be direct and technical.`;
    }
  }

  /**
   * Parse AI response into structured explanation
   */
  private parseExplanationResponse(response: string, level: ExplanationLevel): Explanation {
    // Simple parsing - in production, use more sophisticated parsing
    const sections = response.split('\n\n');
    
    return {
      level,
      summary: sections[0] || response.substring(0, 200),
      details: response,
      codeExamples: [],
      diagrams: [],
      nextSteps: this.extractNextSteps(response),
    };
  }

  /**
   * Extract next steps from response
   */
  private extractNextSteps(response: string): string[] {
    const steps: string[] = [];
    const lines = response.split('\n');
    
    let inNextSteps = false;
    for (const line of lines) {
      if (line.toLowerCase().includes('next step') || line.toLowerCase().includes('getting started')) {
        inNextSteps = true;
        continue;
      }
      
      if (inNextSteps && line.trim().match(/^[\d\-\*]/)) {
        steps.push(line.trim().replace(/^[\d\-\*\.]\s*/, ''));
      }
    }
    
    return steps;
  }

  /**
   * Generate onboarding guide
   */
  private async generateOnboarding(
    analysis: CodeAnalysis,
    files: FileNode[],
    providerConfig: any
  ): Promise<OnboardingGuide> {
    const provider = AIProviderFactory.createProvider(providerConfig);
    
    const prompt = `
Generate a comprehensive onboarding guide for this codebase:

${JSON.stringify(analysis.metadata, null, 2)}

Architecture: ${analysis.architecture.type}
Key Files: ${analysis.keyFiles.map(f => f.path).join(', ')}

Provide:
1. Project overview (what it does, why it exists)
2. Getting started steps (setup, installation, running)
3. Architecture explanation
4. Key files to read first and why
5. Common pitfalls to avoid
6. Suggested first tasks for new developers
7. Learning path (ordered steps to understand the codebase)

Format as a structured guide.`;

    const messages = [
      { role: 'user' as const, content: prompt }
    ];
    const response = await provider.chat(messages);

    return this.parseOnboardingResponse(response.content, analysis);
  }

  /**
   * Parse onboarding response
   */
  private parseOnboardingResponse(response: string, analysis: CodeAnalysis): OnboardingGuide {
    return {
      overview: response.substring(0, 500),
      gettingStarted: this.extractListItems(response, 'getting started'),
      keyFiles: analysis.keyFiles,
      architecture: analysis.architecture.description,
      setupInstructions: this.extractListItems(response, 'setup'),
      commonPitfalls: this.extractListItems(response, 'pitfall'),
      suggestedTasks: this.extractListItems(response, 'task'),
      learningPath: this.extractLearningPath(response),
    };
  }

  /**
   * Extract list items from text
   */
  private extractListItems(text: string, keyword: string): string[] {
    const items: string[] = [];
    const lines = text.toLowerCase().split('\n');
    
    let inSection = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(keyword)) {
        inSection = true;
        continue;
      }
      
      if (inSection && lines[i].trim().match(/^[\d\-\*]/)) {
        items.push(lines[i].trim().replace(/^[\d\-\*\.]\s*/, ''));
      } else if (inSection && lines[i].trim() === '') {
        break;
      }
    }
    
    return items;
  }

  /**
   * Extract learning path
   */
  private extractLearningPath(text: string): any[] {
    // Simplified - in production, use better parsing
    return [
      { order: 1, title: 'Understand the architecture', description: 'Review system design', files: [], estimatedTime: '1 hour' },
      { order: 2, title: 'Explore key files', description: 'Read main components', files: [], estimatedTime: '2 hours' },
      { order: 3, title: 'Run the application', description: 'Set up and test locally', files: [], estimatedTime: '1 hour' },
    ];
  }

  /**
   * Generate documentation
   */
  private async generateDocumentation(
    analysis: CodeAnalysis,
    files: FileNode[],
    providerConfig: any
  ): Promise<Documentation> {
    const provider = AIProviderFactory.createProvider(providerConfig);
    
    const prompt = `
Generate comprehensive documentation for this codebase:

${JSON.stringify(analysis.metadata, null, 2)}

Create:
1. README.md with project overview, setup, usage
2. Architecture documentation
3. API documentation (if applicable)
4. Setup guide
5. Contributing guide

Make it professional and complete.`;

    const messages = [
      { role: 'user' as const, content: prompt }
    ];
    const response = await provider.chat(messages);

    return {
      readme: this.extractSection(response.content, 'readme'),
      apiDocs: this.extractSection(response.content, 'api'),
      architectureDocs: this.extractSection(response.content, 'architecture'),
      setupGuide: this.extractSection(response.content, 'setup'),
      contributingGuide: this.extractSection(response.content, 'contributing'),
    };
  }

  /**
   * Extract section from documentation
   */
  private extractSection(text: string, section: string): string {
    const lines = text.split('\n');
    let inSection = false;
    const sectionLines: string[] = [];
    
    for (const line of lines) {
      if (line.toLowerCase().includes(section)) {
        inSection = true;
        continue;
      }
      
      if (inSection) {
        if (line.startsWith('#') && !line.toLowerCase().includes(section)) {
          break;
        }
        sectionLines.push(line);
      }
    }
    
    return sectionLines.join('\n').trim();
  }

  /**
   * Generate tests
   */
  private async generateTests(
    analysis: CodeAnalysis,
    files: FileNode[],
    definitions: any[],
    providerConfig: any
  ): Promise<TestSuite> {
    // Simplified implementation
    return {
      framework: 'jest',
      tests: [],
      coverage: { overall: 0, byFile: {}, uncoveredFiles: [] },
      setupInstructions: ['npm install --save-dev jest', 'npm test'],
    };
  }

  /**
   * Generate refactoring suggestions
   */
  private async generateRefactorings(
    analysis: CodeAnalysis,
    files: FileNode[],
    providerConfig: any
  ): Promise<RefactorSuggestion[]> {
    // Simplified implementation
    return [];
  }

  /**
   * Generate production readiness report
   */
  private async generateProductionReadiness(
    analysis: CodeAnalysis,
    files: FileNode[],
    definitions: any[],
    providerConfig: any
  ): Promise<ProductionReadinessReport> {
    // Simplified implementation
    return {
      score: 75,
      status: 'needs-work',
      checklist: [],
      codeQuality: {
        maintainabilityIndex: 70,
        cyclomaticComplexity: 15,
        codeSmells: 5,
        technicalDebt: '2 days',
        testCoverage: 60,
      },
      documentation: { readme: '' },
      tests: { framework: 'jest', tests: [], coverage: { overall: 0, byFile: {}, uncoveredFiles: [] }, setupInstructions: [] },
      improvements: [],
      securityIssues: [],
      performanceIssues: [],
      deploymentChecklist: [],
    };
  }

  // Helper methods

  private async loadFiles(source: any): Promise<FileNode[]> {
    // Simplified - in production, implement actual file loading
    return [];
  }

  private extractProjectName(files: FileNode[]): string {
    const packageJson = files.find(f => f.name === 'package.json');
    if (packageJson?.content) {
      try {
        const pkg = JSON.parse(packageJson.content);
        return pkg.name || 'Unknown Project';
      } catch (e) {
        return 'Unknown Project';
      }
    }
    return 'Unknown Project';
  }

  private convertToLanguageStats(filesByLanguage: Record<string, number>, totalFiles: number): any[] {
    return Object.entries(filesByLanguage).map(([language, files]) => ({
      language,
      files,
      lines: 0,
      percentage: (files / totalFiles) * 100,
    }));
  }

  private async extractDependencies(files: FileNode[]): Promise<Record<string, string>> {
    const packageJson = files.find(f => f.name === 'package.json');
    if (packageJson?.content) {
      try {
        const pkg = JSON.parse(packageJson.content);
        return pkg.dependencies || {};
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  private convertDependencyGraph(graph: any): any[] {
    return [];
  }

  private async generateSummary(metadata: any, architecture: any, provider: any): Promise<string> {
    return `${metadata.name} is a ${architecture.type} application built with ${metadata.frameworks.join(', ')}.`;
  }

  private async identifyKeyFiles(files: FileNode[], definitions: any[]): Promise<any[]> {
    return [];
  }

  private calculateComplexity(statistics: any, dependencies: any): number {
    return Math.min(100, statistics.totalFiles * 0.5 + statistics.totalLines * 0.001);
  }

  private async identifyRisks(files: FileNode[], statistics: any): Promise<any[]> {
    return [];
  }

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Made with Bob
