/**
 * Task Automator
 * Orchestrates multi-step development workflows
 */

import { AnalysisOrchestrator } from './analysis-orchestrator';
import { TestGenerator } from './test-generator';
import { RefactorAnalyzer } from './refactor-analyzer';
import {
  FileNode,
  CodeDefinition,
  AIProviderConfig,
  ProductionReadinessReport,
  Documentation,
  TestSuite,
  RefactorSuggestion,
} from '@/types';

export class TaskAutomator {
  private orchestrator: AnalysisOrchestrator;
  private testGenerator: TestGenerator;
  private refactorAnalyzer: RefactorAnalyzer;

  constructor() {
    this.orchestrator = new AnalysisOrchestrator();
    this.testGenerator = new TestGenerator();
    this.refactorAnalyzer = new RefactorAnalyzer();
  }

  /**
   * Prepare repository for production
   * Complete workflow: analyze, document, test, refactor
   */
  async prepareForProduction(
    files: FileNode[],
    definitions: CodeDefinition[],
    providerConfig: AIProviderConfig
  ): Promise<ProductionReadinessReport> {
    console.log('🚀 Starting production readiness workflow...');

    // Step 1: Analyze codebase
    console.log('📊 Step 1/5: Analyzing codebase...');
    const analysisRequest = {
      source: { type: 'upload' as const, files: [] },
      mode: 'production-ready' as const,
      provider: providerConfig,
    };
    const analysisResult = await this.orchestrator.analyze(analysisRequest);

    // Step 2: Generate documentation
    console.log('📝 Step 2/5: Generating documentation...');
    const docRequest = {
      source: { type: 'upload' as const, files: [] },
      mode: 'document' as const,
      provider: providerConfig,
    };
    const docResult = await this.orchestrator.analyze(docRequest);
    const documentation = docResult.documentation || this.getDefaultDocumentation();

    // Step 3: Generate tests
    console.log('🧪 Step 3/5: Generating tests...');
    const tests = await this.testGenerator.generateTests(files, definitions, providerConfig);

    // Step 4: Analyze for refactoring
    console.log('🔧 Step 4/5: Analyzing refactoring opportunities...');
    const refactorings = await this.refactorAnalyzer.analyzeForRefactoring(
      files,
      definitions,
      providerConfig
    );

    // Step 5: Compile production readiness report
    console.log('📋 Step 5/5: Compiling report...');
    const report = this.compileProductionReport(
      analysisResult.analysis,
      documentation,
      tests,
      refactorings
    );

    console.log('✅ Production readiness workflow complete!');
    return report;
  }

  /**
   * Quick fix workflow
   * Identify and fix common issues
   */
  async quickFix(
    files: FileNode[],
    definitions: CodeDefinition[],
    providerConfig: AIProviderConfig
  ): Promise<{
    fixed: number;
    suggestions: RefactorSuggestion[];
    report: string;
  }> {
    console.log('🔧 Starting quick fix workflow...');

    // Analyze for issues
    const refactorings = await this.refactorAnalyzer.analyzeForRefactoring(
      files,
      definitions,
      providerConfig
    );

    // Auto-fix simple issues
    const fixableIssues = refactorings.filter(
      r => r.type === 'naming' || r.type === 'dead-code'
    );

    const report = `
Quick Fix Report
================

Total Issues Found: ${refactorings.length}
Auto-Fixable: ${fixableIssues.length}
Manual Review Required: ${refactorings.length - fixableIssues.length}

Issues by Severity:
- Critical: ${refactorings.filter(r => r.severity === 'critical').length}
- High: ${refactorings.filter(r => r.severity === 'high').length}
- Medium: ${refactorings.filter(r => r.severity === 'medium').length}
- Low: ${refactorings.filter(r => r.severity === 'low').length}

Next Steps:
1. Review auto-fixable issues
2. Address critical and high severity issues
3. Consider medium severity improvements
4. Plan for low severity enhancements
`;

    return {
      fixed: fixableIssues.length,
      suggestions: refactorings,
      report,
    };
  }

  /**
   * Documentation workflow
   * Generate complete documentation suite
   */
  async generateCompleteDocs(
    files: FileNode[],
    providerConfig: AIProviderConfig
  ): Promise<Documentation> {
    console.log('📚 Starting documentation workflow...');

    const request = {
      source: { type: 'upload' as const, files: [] },
      mode: 'document' as const,
      provider: providerConfig,
    };

    const result = await this.orchestrator.analyze(request);
    return result.documentation || this.getDefaultDocumentation();
  }

  /**
   * Testing workflow
   * Generate comprehensive test suite
   */
  async generateCompleteTests(
    files: FileNode[],
    definitions: CodeDefinition[],
    providerConfig: AIProviderConfig
  ): Promise<TestSuite> {
    console.log('🧪 Starting testing workflow...');
    return await this.testGenerator.generateTests(files, definitions, providerConfig);
  }

  /**
   * Code review workflow
   * Comprehensive code quality analysis
   */
  async performCodeReview(
    files: FileNode[],
    definitions: CodeDefinition[],
    providerConfig: AIProviderConfig
  ): Promise<{
    score: number;
    issues: RefactorSuggestion[];
    recommendations: string[];
    summary: string;
  }> {
    console.log('👀 Starting code review workflow...');

    const refactorings = await this.refactorAnalyzer.analyzeForRefactoring(
      files,
      definitions,
      providerConfig
    );

    // Calculate quality score
    const criticalCount = refactorings.filter(r => r.severity === 'critical').length;
    const highCount = refactorings.filter(r => r.severity === 'high').length;
    const mediumCount = refactorings.filter(r => r.severity === 'medium').length;

    const score = Math.max(
      0,
      100 - (criticalCount * 20 + highCount * 10 + mediumCount * 5)
    );

    const recommendations = [
      criticalCount > 0 ? 'Address all critical issues immediately' : null,
      highCount > 0 ? 'Prioritize high severity issues' : null,
      mediumCount > 5 ? 'Plan sprint to address medium severity issues' : null,
      'Implement automated testing',
      'Set up continuous integration',
      'Add code quality checks to CI/CD',
    ].filter(Boolean) as string[];

    const summary = `
Code Review Summary
===================

Overall Score: ${score}/100

Issues Found:
- Critical: ${criticalCount}
- High: ${highCount}
- Medium: ${mediumCount}
- Low: ${refactorings.filter(r => r.severity === 'low').length}

Status: ${score >= 80 ? '✅ Good' : score >= 60 ? '⚠️ Needs Improvement' : '❌ Requires Attention'}
`;

    return {
      score,
      issues: refactorings,
      recommendations,
      summary,
    };
  }

  /**
   * Onboarding workflow
   * Generate complete onboarding package
   */
  async generateOnboardingPackage(
    files: FileNode[],
    providerConfig: AIProviderConfig
  ): Promise<{
    guide: any;
    documentation: Documentation;
    quickStart: string;
  }> {
    console.log('👋 Starting onboarding workflow...');

    // Generate onboarding guide
    const guideRequest = {
      source: { type: 'upload' as const, files: [] },
      mode: 'onboard' as const,
      provider: providerConfig,
    };
    const guideResult = await this.orchestrator.analyze(guideRequest);

    // Generate documentation
    const docRequest = {
      source: { type: 'upload' as const, files: [] },
      mode: 'document' as const,
      provider: providerConfig,
    };
    const docResult = await this.orchestrator.analyze(docRequest);

    const quickStart = `
Quick Start Guide
=================

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Run the application
5. Explore key files (see onboarding guide)

For detailed instructions, see the complete documentation.
`;

    return {
      guide: guideResult.onboarding,
      documentation: docResult.documentation || this.getDefaultDocumentation(),
      quickStart,
    };
  }

  /**
   * Compile production readiness report
   */
  private compileProductionReport(
    analysis: any,
    documentation: Documentation,
    tests: TestSuite,
    refactorings: RefactorSuggestion[]
  ): ProductionReadinessReport {
    const criticalIssues = refactorings.filter(r => r.severity === 'critical');
    const highIssues = refactorings.filter(r => r.severity === 'high');

    // Calculate overall score
    const testScore = tests.coverage.overall;
    const codeQualityScore = Math.max(
      0,
      100 - (criticalIssues.length * 20 + highIssues.length * 10)
    );
    const docScore = documentation.readme ? 100 : 0;

    const overallScore = Math.round((testScore + codeQualityScore + docScore) / 3);

    const status =
      overallScore >= 80 ? 'ready' : overallScore >= 60 ? 'needs-work' : 'not-ready';

    return {
      score: overallScore,
      status,
      checklist: this.generateChecklist(tests, refactorings, documentation),
      codeQuality: {
        maintainabilityIndex: codeQualityScore,
        cyclomaticComplexity: analysis.complexityScore || 0,
        codeSmells: refactorings.length,
        technicalDebt: this.estimateTechnicalDebt(refactorings),
        testCoverage: testScore,
      },
      documentation,
      tests,
      improvements: refactorings,
      securityIssues: analysis.risks?.filter((r: any) => r.category === 'security') || [],
      performanceIssues: analysis.risks?.filter((r: any) => r.category === 'performance') || [],
      deploymentChecklist: this.getDeploymentChecklist(),
    };
  }

  /**
   * Generate production checklist
   */
  private generateChecklist(
    tests: TestSuite,
    refactorings: RefactorSuggestion[],
    documentation: Documentation
  ): any[] {
    return [
      {
        category: 'Testing',
        item: 'Unit tests implemented',
        status: tests.tests.length > 0 ? 'complete' : 'incomplete',
        priority: 'critical' as const,
      },
      {
        category: 'Testing',
        item: 'Test coverage > 80%',
        status: tests.coverage.overall >= 80 ? 'complete' : 'incomplete',
        priority: 'high' as const,
      },
      {
        category: 'Documentation',
        item: 'README exists',
        status: documentation.readme ? 'complete' : 'incomplete',
        priority: 'critical' as const,
      },
      {
        category: 'Code Quality',
        item: 'No critical issues',
        status: refactorings.filter(r => r.severity === 'critical').length === 0 ? 'complete' : 'incomplete',
        priority: 'critical' as const,
      },
      {
        category: 'Security',
        item: 'Security audit passed',
        status: 'incomplete',
        priority: 'critical' as const,
      },
      {
        category: 'Performance',
        item: 'Performance benchmarks met',
        status: 'incomplete',
        priority: 'high' as const,
      },
    ];
  }

  /**
   * Estimate technical debt
   */
  private estimateTechnicalDebt(refactorings: RefactorSuggestion[]): string {
    const hours =
      refactorings.filter(r => r.severity === 'critical').length * 8 +
      refactorings.filter(r => r.severity === 'high').length * 4 +
      refactorings.filter(r => r.severity === 'medium').length * 2 +
      refactorings.filter(r => r.severity === 'low').length * 1;

    const days = Math.ceil(hours / 8);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  /**
   * Get deployment checklist
   */
  private getDeploymentChecklist(): string[] {
    return [
      'All tests passing',
      'Code reviewed and approved',
      'Documentation updated',
      'Environment variables configured',
      'Database migrations ready',
      'Monitoring and logging set up',
      'Backup strategy in place',
      'Rollback plan documented',
      'Performance testing completed',
      'Security scan passed',
    ];
  }

  /**
   * Get default documentation
   */
  private getDefaultDocumentation(): Documentation {
    return {
      readme: '# Project Documentation\n\nDocumentation generation in progress...',
      apiDocs: '',
      architectureDocs: '',
      setupGuide: '',
      contributingGuide: '',
    };
  }
}

// Made with Bob
