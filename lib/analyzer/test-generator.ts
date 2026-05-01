/**
 * Test Generator
 * Generates comprehensive test suites for codebases
 */

import { AIProviderFactory } from '@/lib/ai/provider-factory';
import { FileNode, CodeDefinition, TestSuite, GeneratedTest, AIProviderConfig } from '@/types';

export class TestGenerator {
  /**
   * Generate test suite for codebase
   */
  async generateTests(
    files: FileNode[],
    definitions: CodeDefinition[],
    providerConfig: AIProviderConfig
  ): Promise<TestSuite> {
    const provider = AIProviderFactory.createProvider(providerConfig);
    
    // Detect test framework
    const framework = this.detectTestFramework(files);
    
    // Generate tests for key functions
    const tests: GeneratedTest[] = [];
    
    // Focus on critical functions (limit to avoid overwhelming)
    const criticalDefinitions = definitions
      .filter(d => d.type === 'function' || d.type === 'method')
      .slice(0, 10); // Generate tests for top 10 functions
    
    for (const definition of criticalDefinitions) {
      const file = files.find(f => f.path === definition.filePath);
      if (!file?.content) continue;
      
      const test = await this.generateTestForFunction(
        definition,
        file.content,
        framework,
        provider,
        providerConfig
      );
      
      if (test) {
        tests.push(test);
      }
    }
    
    return {
      framework,
      tests,
      coverage: this.calculateCoverage(definitions, tests),
      setupInstructions: this.getSetupInstructions(framework),
    };
  }

  /**
   * Detect test framework from package.json or files
   */
  private detectTestFramework(files: FileNode[]): string {
    const packageJson = files.find(f => f.name === 'package.json');
    
    if (packageJson?.content) {
      try {
        const pkg = JSON.parse(packageJson.content);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        if (deps['jest']) return 'jest';
        if (deps['mocha']) return 'mocha';
        if (deps['vitest']) return 'vitest';
        if (deps['pytest']) return 'pytest';
        if (deps['junit']) return 'junit';
      } catch (e) {
        // Invalid JSON
      }
    }
    
    // Check for test files
    const hasJestConfig = files.some(f => f.name === 'jest.config.js' || f.name === 'jest.config.ts');
    if (hasJestConfig) return 'jest';
    
    const hasPytestConfig = files.some(f => f.name === 'pytest.ini');
    if (hasPytestConfig) return 'pytest';
    
    // Default based on language
    const hasTypeScript = files.some(f => f.extension === '.ts' || f.extension === '.tsx');
    if (hasTypeScript) return 'jest';
    
    const hasPython = files.some(f => f.extension === '.py');
    if (hasPython) return 'pytest';
    
    return 'jest'; // Default
  }

  /**
   * Generate test for a specific function
   */
  private async generateTestForFunction(
    definition: CodeDefinition,
    fileContent: string,
    framework: string,
    provider: any,
    providerConfig: AIProviderConfig
  ): Promise<GeneratedTest | null> {
    // Extract function code
    const functionCode = this.extractFunctionCode(fileContent, definition);
    
    const prompt = `Generate comprehensive ${framework} tests for this function:

\`\`\`
${functionCode}
\`\`\`

Function: ${definition.name}
File: ${definition.filePath}
Language: ${definition.language}

Generate:
1. Unit tests covering normal cases
2. Edge cases and boundary conditions
3. Error handling tests
4. Mock any external dependencies

Provide complete, runnable test code with proper imports and setup.`;

    try {
      const messages = [{ role: 'user' as const, content: prompt }];
      const response = await provider.chat(messages);
      
      return {
        filePath: this.getTestFilePath(definition.filePath, framework),
        testCode: response.content,
        description: `Tests for ${definition.name}`,
        targetFunction: definition.name,
        testCases: this.extractTestCases(response.content),
      };
    } catch (error) {
      console.error(`Failed to generate test for ${definition.name}:`, error);
      return null;
    }
  }

  /**
   * Extract function code from file content
   */
  private extractFunctionCode(content: string, definition: CodeDefinition): string {
    const lines = content.split('\n');
    const startLine = definition.line - 1;
    
    // Simple extraction - get function and next 20 lines
    const endLine = Math.min(startLine + 20, lines.length);
    return lines.slice(startLine, endLine).join('\n');
  }

  /**
   * Get test file path
   */
  private getTestFilePath(sourcePath: string, framework: string): string {
    const dir = sourcePath.substring(0, sourcePath.lastIndexOf('/'));
    const filename = sourcePath.substring(sourcePath.lastIndexOf('/') + 1);
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    const ext = filename.substring(filename.lastIndexOf('.'));
    
    if (framework === 'pytest') {
      return `${dir}/test_${nameWithoutExt}.py`;
    }
    
    return `${dir}/${nameWithoutExt}.test${ext}`;
  }

  /**
   * Extract test cases from generated code
   */
  private extractTestCases(testCode: string): any[] {
    const cases: any[] = [];
    const lines = testCode.split('\n');
    
    for (const line of lines) {
      // Match test function names
      const match = line.match(/(?:test|it)\s*\(\s*['"]([^'"]+)['"]/);
      if (match) {
        cases.push({
          name: match[1],
          input: 'various',
          expectedOutput: 'as specified',
          description: match[1],
        });
      }
    }
    
    return cases;
  }

  /**
   * Calculate test coverage
   */
  private calculateCoverage(definitions: CodeDefinition[], tests: GeneratedTest[]): any {
    const totalFunctions = definitions.filter(d => d.type === 'function' || d.type === 'method').length;
    const testedFunctions = tests.length;
    const overall = totalFunctions > 0 ? (testedFunctions / totalFunctions) * 100 : 0;
    
    const byFile: Record<string, number> = {};
    const uncoveredFiles: string[] = [];
    
    // Group by file
    const fileGroups = new Map<string, { total: number; tested: number }>();
    
    definitions.forEach(def => {
      if (def.type === 'function' || def.type === 'method') {
        const group = fileGroups.get(def.filePath) || { total: 0, tested: 0 };
        group.total++;
        fileGroups.set(def.filePath, group);
      }
    });
    
    tests.forEach(test => {
      const sourcePath = test.filePath.replace(/\.test\.(ts|js|py)$/, '.$1');
      const group = fileGroups.get(sourcePath);
      if (group) {
        group.tested++;
      }
    });
    
    fileGroups.forEach((group, path) => {
      const coverage = (group.tested / group.total) * 100;
      byFile[path] = coverage;
      if (coverage === 0) {
        uncoveredFiles.push(path);
      }
    });
    
    return {
      overall: Math.round(overall),
      byFile,
      uncoveredFiles,
    };
  }

  /**
   * Get setup instructions for framework
   */
  private getSetupInstructions(framework: string): string[] {
    const instructions: Record<string, string[]> = {
      jest: [
        'npm install --save-dev jest @types/jest ts-jest',
        'npx ts-jest config:init',
        'npm test',
      ],
      vitest: [
        'npm install --save-dev vitest',
        'Add "test": "vitest" to package.json scripts',
        'npm test',
      ],
      mocha: [
        'npm install --save-dev mocha @types/mocha chai',
        'Add "test": "mocha" to package.json scripts',
        'npm test',
      ],
      pytest: [
        'pip install pytest pytest-cov',
        'pytest',
        'pytest --cov=. --cov-report=html',
      ],
      junit: [
        'Add JUnit dependency to pom.xml or build.gradle',
        'mvn test (Maven) or gradle test (Gradle)',
      ],
    };
    
    return instructions[framework] || instructions.jest;
  }
}

// Made with Bob
