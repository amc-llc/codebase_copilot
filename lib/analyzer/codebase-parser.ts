/**
 * Codebase Parser
 * Parses and analyzes code files to extract structure and metadata
 */

import { FileNode, CodeDefinition, ImportStatement, DependencyGraph } from '@/types';

export class CodebaseParser {
  private fileExtensions = {
    javascript: ['.js', '.jsx', '.mjs', '.cjs'],
    typescript: ['.ts', '.tsx', '.mts', '.cts'],
    python: ['.py', '.pyw'],
    java: ['.java'],
    csharp: ['.cs'],
    go: ['.go'],
    rust: ['.rs'],
    php: ['.php'],
    ruby: ['.rb'],
    swift: ['.swift'],
    kotlin: ['.kt'],
    scala: ['.scala'],
    html: ['.html', '.htm'],
    css: ['.css', '.scss', '.sass', '.less'],
    json: ['.json'],
    yaml: ['.yaml', '.yml'],
    markdown: ['.md', '.mdx'],
    sql: ['.sql'],
    shell: ['.sh', '.bash', '.zsh'],
  };

  /**
   * Parse a codebase from file tree
   */
  async parseCodebase(files: FileNode[]): Promise<{
    files: FileNode[];
    definitions: CodeDefinition[];
    dependencies: DependencyGraph;
    statistics: CodebaseStatistics;
  }> {
    const definitions: CodeDefinition[] = [];
    const dependencies: DependencyGraph = { nodes: [], edges: [] };
    const statistics = this.initializeStatistics();

    for (const file of files) {
      if (file.type === 'file') {
        const language = this.detectLanguage(file.path);
        if (language) {
          statistics.filesByLanguage[language] = (statistics.filesByLanguage[language] || 0) + 1;
          statistics.totalFiles++;
          statistics.totalLines += file.lines || 0;

          // Parse file for definitions
          const fileDefs = await this.parseFile(file);
          definitions.push(...fileDefs);

          // Extract imports/dependencies
          const imports = await this.extractImports(file);
          this.addToDependencyGraph(dependencies, file.path, imports);
        }
      }
    }

    return { files, definitions, dependencies, statistics };
  }

  /**
   * Detect programming language from file extension
   */
  detectLanguage(filePath: string): string | null {
    const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    
    for (const [language, extensions] of Object.entries(this.fileExtensions)) {
      if (extensions.includes(ext)) {
        return language;
      }
    }
    
    return null;
  }

  /**
   * Parse a single file for code definitions
   */
  private async parseFile(file: FileNode): Promise<CodeDefinition[]> {
    const definitions: CodeDefinition[] = [];
    const language = this.detectLanguage(file.path);
    
    if (!language || !file.content) return definitions;

    const lines = file.content.split('\n');
    
    // Simple pattern matching for common definitions
    // In production, use proper AST parsers like @babel/parser, typescript compiler API, etc.
    
    if (language === 'typescript' || language === 'javascript') {
      definitions.push(...this.parseJavaScriptTypeScript(file.path, lines));
    } else if (language === 'python') {
      definitions.push(...this.parsePython(file.path, lines));
    } else if (language === 'java') {
      definitions.push(...this.parseJava(file.path, lines));
    }

    return definitions;
  }

  /**
   * Parse JavaScript/TypeScript files
   */
  private parseJavaScriptTypeScript(filePath: string, lines: string[]): CodeDefinition[] {
    const definitions: CodeDefinition[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Class definitions
      if (trimmed.match(/^(export\s+)?(default\s+)?class\s+(\w+)/)) {
        const match = trimmed.match(/class\s+(\w+)/);
        if (match) {
          definitions.push({
            name: match[1],
            type: 'class',
            filePath,
            line: index + 1,
            language: 'typescript',
          });
        }
      }
      
      // Function definitions
      if (trimmed.match(/^(export\s+)?(async\s+)?function\s+(\w+)/)) {
        const match = trimmed.match(/function\s+(\w+)/);
        if (match) {
          definitions.push({
            name: match[1],
            type: 'function',
            filePath,
            line: index + 1,
            language: 'typescript',
          });
        }
      }
      
      // Arrow functions and const functions
      if (trimmed.match(/^(export\s+)?const\s+(\w+)\s*=\s*(async\s*)?\(/)) {
        const match = trimmed.match(/const\s+(\w+)/);
        if (match) {
          definitions.push({
            name: match[1],
            type: 'function',
            filePath,
            line: index + 1,
            language: 'typescript',
          });
        }
      }
      
      // Interface definitions
      if (trimmed.match(/^(export\s+)?interface\s+(\w+)/)) {
        const match = trimmed.match(/interface\s+(\w+)/);
        if (match) {
          definitions.push({
            name: match[1],
            type: 'interface',
            filePath,
            line: index + 1,
            language: 'typescript',
          });
        }
      }
      
      // Type definitions
      if (trimmed.match(/^(export\s+)?type\s+(\w+)/)) {
        const match = trimmed.match(/type\s+(\w+)/);
        if (match) {
          definitions.push({
            name: match[1],
            type: 'type',
            filePath,
            line: index + 1,
            language: 'typescript',
          });
        }
      }
    });
    
    return definitions;
  }

  /**
   * Parse Python files
   */
  private parsePython(filePath: string, lines: string[]): CodeDefinition[] {
    const definitions: CodeDefinition[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Class definitions
      if (trimmed.match(/^class\s+(\w+)/)) {
        const match = trimmed.match(/class\s+(\w+)/);
        if (match) {
          definitions.push({
            name: match[1],
            type: 'class',
            filePath,
            line: index + 1,
            language: 'python',
          });
        }
      }
      
      // Function definitions
      if (trimmed.match(/^def\s+(\w+)/)) {
        const match = trimmed.match(/def\s+(\w+)/);
        if (match) {
          definitions.push({
            name: match[1],
            type: 'function',
            filePath,
            line: index + 1,
            language: 'python',
          });
        }
      }
    });
    
    return definitions;
  }

  /**
   * Parse Java files
   */
  private parseJava(filePath: string, lines: string[]): CodeDefinition[] {
    const definitions: CodeDefinition[] = [];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Class definitions
      if (trimmed.match(/^(public\s+)?(abstract\s+)?class\s+(\w+)/)) {
        const match = trimmed.match(/class\s+(\w+)/);
        if (match) {
          definitions.push({
            name: match[1],
            type: 'class',
            filePath,
            line: index + 1,
            language: 'java',
          });
        }
      }
      
      // Interface definitions
      if (trimmed.match(/^(public\s+)?interface\s+(\w+)/)) {
        const match = trimmed.match(/interface\s+(\w+)/);
        if (match) {
          definitions.push({
            name: match[1],
            type: 'interface',
            filePath,
            line: index + 1,
            language: 'java',
          });
        }
      }
      
      // Method definitions
      if (trimmed.match(/^(public|private|protected)\s+(\w+)\s+(\w+)\s*\(/)) {
        const match = trimmed.match(/\s+(\w+)\s*\(/);
        if (match) {
          definitions.push({
            name: match[1],
            type: 'method',
            filePath,
            line: index + 1,
            language: 'java',
          });
        }
      }
    });
    
    return definitions;
  }

  /**
   * Extract import statements from a file
   */
  private async extractImports(file: FileNode): Promise<ImportStatement[]> {
    const imports: ImportStatement[] = [];
    
    if (!file.content) return imports;
    
    const lines = file.content.split('\n');
    const language = this.detectLanguage(file.path);
    
    if (language === 'typescript' || language === 'javascript') {
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        // ES6 imports
        if (trimmed.startsWith('import ')) {
          const match = trimmed.match(/from\s+['"]([^'"]+)['"]/);
          if (match) {
            imports.push({
              source: match[1],
              line: index + 1,
              type: 'es6',
            });
          }
        }
        
        // CommonJS require
        if (trimmed.includes('require(')) {
          const match = trimmed.match(/require\(['"]([^'"]+)['"]\)/);
          if (match) {
            imports.push({
              source: match[1],
              line: index + 1,
              type: 'commonjs',
            });
          }
        }
      });
    } else if (language === 'python') {
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
          const match = trimmed.match(/(?:from|import)\s+([\w.]+)/);
          if (match) {
            imports.push({
              source: match[1],
              line: index + 1,
              type: 'python',
            });
          }
        }
      });
    }
    
    return imports;
  }

  /**
   * Add file and its dependencies to the dependency graph
   */
  private addToDependencyGraph(
    graph: DependencyGraph,
    filePath: string,
    imports: ImportStatement[]
  ): void {
    // Add node if not exists
    if (!graph.nodes.find(n => n.id === filePath)) {
      graph.nodes.push({
        id: filePath,
        label: filePath.split('/').pop() || filePath,
        type: 'file',
      });
    }
    
    // Add edges for each import
    imports.forEach(imp => {
      const targetPath = this.resolveImportPath(filePath, imp.source);
      
      // Add target node if not exists
      if (!graph.nodes.find(n => n.id === targetPath)) {
        graph.nodes.push({
          id: targetPath,
          label: targetPath.split('/').pop() || targetPath,
          type: imp.source.startsWith('.') ? 'file' : 'external',
        });
      }
      
      // Add edge
      graph.edges.push({
        source: filePath,
        target: targetPath,
        type: imp.type,
      });
    });
  }

  /**
   * Resolve import path relative to current file
   */
  private resolveImportPath(currentFile: string, importPath: string): string {
    if (importPath.startsWith('.')) {
      // Relative import
      const currentDir = currentFile.substring(0, currentFile.lastIndexOf('/'));
      return `${currentDir}/${importPath}`;
    }
    // External package
    return importPath;
  }

  /**
   * Initialize statistics object
   */
  private initializeStatistics(): CodebaseStatistics {
    return {
      totalFiles: 0,
      totalLines: 0,
      filesByLanguage: {},
      complexity: 0,
    };
  }
}

export interface CodebaseStatistics {
  totalFiles: number;
  totalLines: number;
  filesByLanguage: Record<string, number>;
  complexity: number;
}

// Made with Bob
