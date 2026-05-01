/**
 * Refactor Analyzer
 * Identifies code quality issues and suggests improvements
 */

import { AIProviderFactory } from '@/lib/ai/provider-factory';
import { FileNode, CodeDefinition, RefactorSuggestion, AIProviderConfig } from '@/types';

export class RefactorAnalyzer {
  /**
   * Analyze codebase for refactoring opportunities
   */
  async analyzeForRefactoring(
    files: FileNode[],
    definitions: CodeDefinition[],
    providerConfig: AIProviderConfig
  ): Promise<RefactorSuggestion[]> {
    const suggestions: RefactorSuggestion[] = [];
    
    // 1. Detect code duplication
    suggestions.push(...this.detectDuplication(files));
    
    // 2. Detect naming issues
    suggestions.push(...this.detectNamingIssues(definitions));
    
    // 3. Detect complexity issues
    suggestions.push(...this.detectComplexity(files, definitions));
    
    // 4. Detect dead code
    suggestions.push(...this.detectDeadCode(files, definitions));
    
    // 5. Use AI for advanced analysis
    const aiSuggestions = await this.getAISuggestions(files, providerConfig);
    suggestions.push(...aiSuggestions);
    
    // Sort by severity
    return suggestions.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  /**
   * Detect code duplication
   */
  private detectDuplication(files: FileNode[]): RefactorSuggestion[] {
    const suggestions: RefactorSuggestion[] = [];
    const codeBlocks = new Map<string, string[]>();
    
    files.forEach(file => {
      if (!file.content || file.type !== 'file') return;
      
      const lines = file.content.split('\n');
      
      // Look for blocks of 5+ similar lines
      for (let i = 0; i < lines.length - 5; i++) {
        const block = lines.slice(i, i + 5).join('\n').trim();
        if (block.length < 50) continue; // Skip small blocks
        
        const locations = codeBlocks.get(block) || [];
        locations.push(`${file.path}:${i + 1}`);
        codeBlocks.set(block, locations);
      }
    });
    
    // Find duplicates
    codeBlocks.forEach((locations, block) => {
      if (locations.length > 1) {
        suggestions.push({
          type: 'duplication',
          severity: 'medium',
          location: locations[0],
          issue: `Code duplicated in ${locations.length} locations`,
          suggestion: 'Extract common code into a reusable function or module',
          impact: 'Reduces maintenance burden and potential bugs',
        });
      }
    });
    
    return suggestions.slice(0, 10); // Limit to top 10
  }

  /**
   * Detect naming issues
   */
  private detectNamingIssues(definitions: CodeDefinition[]): RefactorSuggestion[] {
    const suggestions: RefactorSuggestion[] = [];
    
    definitions.forEach(def => {
      const name = def.name;
      
      // Check for single letter names (except common ones like i, j, x, y)
      if (name.length === 1 && !['i', 'j', 'k', 'x', 'y', 'z'].includes(name)) {
        suggestions.push({
          type: 'naming',
          severity: 'low',
          location: `${def.filePath}:${def.line}`,
          issue: `Single letter variable name: ${name}`,
          suggestion: 'Use descriptive variable names',
          impact: 'Improves code readability',
        });
      }
      
      // Check for unclear abbreviations
      const unclearAbbreviations = ['tmp', 'temp', 'data', 'info', 'obj', 'arr'];
      if (unclearAbbreviations.some(abbr => name.toLowerCase().includes(abbr))) {
        suggestions.push({
          type: 'naming',
          severity: 'low',
          location: `${def.filePath}:${def.line}`,
          issue: `Unclear name: ${name}`,
          suggestion: 'Use more specific, descriptive names',
          impact: 'Improves code clarity',
        });
      }
      
      // Check for inconsistent casing
      if (def.type === 'class' && name[0] !== name[0].toUpperCase()) {
        suggestions.push({
          type: 'naming',
          severity: 'low',
          location: `${def.filePath}:${def.line}`,
          issue: `Class name should start with uppercase: ${name}`,
          suggestion: `Rename to ${name[0].toUpperCase() + name.slice(1)}`,
          impact: 'Follows naming conventions',
        });
      }
    });
    
    return suggestions.slice(0, 10);
  }

  /**
   * Detect complexity issues
   */
  private detectComplexity(files: FileNode[], definitions: CodeDefinition[]): RefactorSuggestion[] {
    const suggestions: RefactorSuggestion[] = [];
    
    files.forEach(file => {
      if (!file.content || file.type !== 'file') return;
      
      const lines = file.content.split('\n');
      
      // Check file length
      if (lines.length > 500) {
        suggestions.push({
          type: 'complexity',
          severity: 'medium',
          location: file.path,
          issue: `Large file with ${lines.length} lines`,
          suggestion: 'Consider splitting into smaller, focused modules',
          impact: 'Improves maintainability and testability',
        });
      }
      
      // Check for deeply nested code
      lines.forEach((line, index) => {
        const indentation = line.match(/^\s*/)?.[0].length || 0;
        if (indentation > 24) { // More than 6 levels of nesting (4 spaces each)
          suggestions.push({
            type: 'complexity',
            severity: 'high',
            location: `${file.path}:${index + 1}`,
            issue: 'Deeply nested code (6+ levels)',
            suggestion: 'Extract nested logic into separate functions',
            impact: 'Reduces cognitive complexity',
          });
        }
      });
      
      // Check for long functions
      definitions.forEach(def => {
        if (def.filePath === file.path && (def.type === 'function' || def.type === 'method')) {
          const functionLines = this.getFunctionLength(lines, def.line);
          if (functionLines > 50) {
            suggestions.push({
              type: 'complexity',
              severity: 'medium',
              location: `${file.path}:${def.line}`,
              issue: `Long function: ${def.name} (${functionLines} lines)`,
              suggestion: 'Break down into smaller, single-purpose functions',
              impact: 'Improves readability and testability',
            });
          }
        }
      });
    });
    
    return suggestions.slice(0, 10);
  }

  /**
   * Detect dead code
   */
  private detectDeadCode(files: FileNode[], definitions: CodeDefinition[]): RefactorSuggestion[] {
    const suggestions: RefactorSuggestion[] = [];
    
    // Build usage map
    const usageMap = new Map<string, number>();
    definitions.forEach(def => usageMap.set(def.name, 0));
    
    // Count references
    files.forEach(file => {
      if (!file.content) return;
      definitions.forEach(def => {
        const regex = new RegExp(`\\b${def.name}\\b`, 'g');
        const matches = file.content!.match(regex);
        if (matches) {
          usageMap.set(def.name, (usageMap.get(def.name) || 0) + matches.length);
        }
      });
    });
    
    // Find unused definitions
    usageMap.forEach((count, name) => {
      if (count <= 1) { // Only defined, never used
        const def = definitions.find(d => d.name === name);
        if (def && !name.startsWith('_')) { // Ignore private/internal
          suggestions.push({
            type: 'dead-code',
            severity: 'low',
            location: `${def.filePath}:${def.line}`,
            issue: `Unused ${def.type}: ${name}`,
            suggestion: 'Remove if truly unused, or export if intended for external use',
            impact: 'Reduces codebase size and maintenance',
          });
        }
      }
    });
    
    return suggestions.slice(0, 10);
  }

  /**
   * Get AI-powered suggestions
   */
  private async getAISuggestions(
    files: FileNode[],
    providerConfig: AIProviderConfig
  ): Promise<RefactorSuggestion[]> {
    const provider = AIProviderFactory.createProvider(providerConfig);
    
    // Analyze a sample of files
    const sampleFiles = files
      .filter(f => f.type === 'file' && f.content)
      .slice(0, 5);
    
    if (sampleFiles.length === 0) return [];
    
    const prompt = `Analyze these code files for refactoring opportunities:

${sampleFiles.map(f => `
File: ${f.path}
\`\`\`
${f.content?.substring(0, 1000)}
\`\`\`
`).join('\n')}

Identify:
1. Performance issues
2. Security vulnerabilities
3. Best practice violations
4. Design pattern improvements

Provide specific, actionable suggestions.`;

    try {
      const messages = [{ role: 'user' as const, content: prompt }];
      const response = await provider.chat(messages);
      
      return this.parseAISuggestions(response.content);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      return [];
    }
  }

  /**
   * Parse AI suggestions from response
   */
  private parseAISuggestions(response: string): RefactorSuggestion[] {
    const suggestions: RefactorSuggestion[] = [];
    const lines = response.split('\n');
    
    let currentSuggestion: Partial<RefactorSuggestion> = {};
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.toLowerCase().includes('performance')) {
        currentSuggestion.type = 'performance';
        currentSuggestion.severity = 'medium';
      } else if (trimmed.toLowerCase().includes('security')) {
        currentSuggestion.type = 'complexity';
        currentSuggestion.severity = 'high';
      }
      
      if (trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
        if (currentSuggestion.issue) {
          suggestions.push(currentSuggestion as RefactorSuggestion);
          currentSuggestion = {};
        }
        currentSuggestion.issue = trimmed.replace(/^[-\d\.]\s*/, '');
        currentSuggestion.location = 'Multiple files';
        currentSuggestion.suggestion = 'See AI analysis';
        currentSuggestion.impact = 'Improves code quality';
      }
    });
    
    if (currentSuggestion.issue) {
      suggestions.push(currentSuggestion as RefactorSuggestion);
    }
    
    return suggestions.slice(0, 5);
  }

  /**
   * Get function length
   */
  private getFunctionLength(lines: string[], startLine: number): number {
    let braceCount = 0;
    let length = 0;
    let started = false;
    
    for (let i = startLine - 1; i < lines.length; i++) {
      const line = lines[i];
      length++;
      
      if (line.includes('{')) {
        braceCount++;
        started = true;
      }
      if (line.includes('}')) {
        braceCount--;
      }
      
      if (started && braceCount === 0) {
        break;
      }
      
      if (length > 100) break; // Safety limit
    }
    
    return length;
  }
}

// Made with Bob
