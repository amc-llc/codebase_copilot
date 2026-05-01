/**
 * Architecture Analyzer
 * Detects architecture patterns and analyzes system structure
 */

import { FileNode, ArchitecturePattern, DependencyGraph, CodebaseMetadata } from '@/types';

export class ArchitectureAnalyzer {
  /**
   * Analyze codebase architecture
   */
  async analyzeArchitecture(
    files: FileNode[],
    dependencies: DependencyGraph,
    metadata: CodebaseMetadata
  ): Promise<ArchitecturePattern> {
    const patterns = [
      this.detectMicroservices(files, metadata),
      this.detectMVC(files, metadata),
      this.detectLayered(files, metadata),
      this.detectEventDriven(files, metadata),
      this.detectMonolith(files, metadata),
    ];

    // Return pattern with highest confidence
    const bestPattern = patterns.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );

    return bestPattern;
  }

  /**
   * Detect microservices architecture
   */
  private detectMicroservices(files: FileNode[], metadata: CodebaseMetadata): ArchitecturePattern {
    let confidence = 0;
    const components: string[] = [];

    // Check for multiple service directories
    const servicePatterns = ['services/', 'microservices/', 'apps/'];
    const hasServiceDirs = files.some(f => 
      servicePatterns.some(pattern => f.path.includes(pattern))
    );

    if (hasServiceDirs) {
      confidence += 30;
      components.push('Multiple service directories');
    }

    // Check for Docker/containerization
    const hasDocker = files.some(f => 
      f.name === 'Dockerfile' || f.name === 'docker-compose.yml'
    );

    if (hasDocker) {
      confidence += 20;
      components.push('Docker containerization');
    }

    // Check for API gateway patterns
    const hasGateway = files.some(f => 
      f.path.includes('gateway') || f.path.includes('proxy')
    );

    if (hasGateway) {
      confidence += 15;
      components.push('API Gateway');
    }

    // Check for message queues
    const hasMessageQueue = files.some(f => 
      f.content?.includes('kafka') || 
      f.content?.includes('rabbitmq') ||
      f.content?.includes('redis') ||
      f.content?.includes('pubsub')
    );

    if (hasMessageQueue) {
      confidence += 15;
      components.push('Message Queue');
    }

    // Check for service mesh
    const hasServiceMesh = files.some(f => 
      f.content?.includes('istio') || f.content?.includes('linkerd')
    );

    if (hasServiceMesh) {
      confidence += 10;
      components.push('Service Mesh');
    }

    return {
      type: 'microservices',
      confidence,
      description: 'Microservices architecture with distributed services communicating via APIs',
      components,
    };
  }

  /**
   * Detect MVC (Model-View-Controller) pattern
   */
  private detectMVC(files: FileNode[], metadata: CodebaseMetadata): ArchitecturePattern {
    let confidence = 0;
    const components: string[] = [];

    // Check for MVC directory structure
    const hasMVC = files.some(f => {
      const path = f.path.toLowerCase();
      return path.includes('models') || path.includes('views') || path.includes('controllers');
    });

    if (hasMVC) {
      confidence += 40;
      components.push('MVC directory structure');
    }

    // Check for web frameworks that use MVC
    const mvcFrameworks = ['rails', 'django', 'laravel', 'spring', 'asp.net'];
    const hasFramework = metadata.frameworks.some(fw => 
      mvcFrameworks.some(mvc => fw.toLowerCase().includes(mvc))
    );

    if (hasFramework) {
      confidence += 30;
      components.push('MVC framework detected');
    }

    // Check for routing
    const hasRoutes = files.some(f => 
      f.path.includes('routes') || f.path.includes('routing')
    );

    if (hasRoutes) {
      confidence += 15;
      components.push('Routing layer');
    }

    // Check for templates/views
    const hasTemplates = files.some(f => 
      f.extension === '.erb' || 
      f.extension === '.ejs' || 
      f.extension === '.blade.php' ||
      f.extension === '.jsp'
    );

    if (hasTemplates) {
      confidence += 15;
      components.push('Template engine');
    }

    return {
      type: 'mvc',
      confidence,
      description: 'Model-View-Controller pattern separating data, presentation, and logic',
      components,
    };
  }

  /**
   * Detect layered architecture
   */
  private detectLayered(files: FileNode[], metadata: CodebaseMetadata): ArchitecturePattern {
    let confidence = 0;
    const components: string[] = [];

    // Check for typical layers
    const layers = ['presentation', 'business', 'data', 'domain', 'infrastructure', 'application'];
    const foundLayers = layers.filter(layer => 
      files.some(f => f.path.toLowerCase().includes(layer))
    );

    if (foundLayers.length >= 3) {
      confidence += 40;
      components.push(`${foundLayers.length} architectural layers`);
    }

    // Check for separation of concerns
    const hasSeparation = files.some(f => 
      f.path.includes('services') && f.path.includes('repositories')
    );

    if (hasSeparation) {
      confidence += 20;
      components.push('Clear separation of concerns');
    }

    // Check for dependency injection
    const hasDI = files.some(f => 
      f.content?.includes('inject') || 
      f.content?.includes('dependency injection') ||
      f.content?.includes('@Injectable')
    );

    if (hasDI) {
      confidence += 20;
      components.push('Dependency injection');
    }

    // Check for interfaces/abstractions
    const hasInterfaces = files.some(f => 
      f.path.includes('interfaces') || f.path.includes('abstractions')
    );

    if (hasInterfaces) {
      confidence += 20;
      components.push('Interface abstractions');
    }

    return {
      type: 'layered',
      confidence,
      description: 'Layered architecture with clear separation between presentation, business, and data layers',
      components,
    };
  }

  /**
   * Detect event-driven architecture
   */
  private detectEventDriven(files: FileNode[], metadata: CodebaseMetadata): ArchitecturePattern {
    let confidence = 0;
    const components: string[] = [];

    // Check for event handlers
    const hasEventHandlers = files.some(f => 
      f.path.includes('events') || 
      f.path.includes('handlers') ||
      f.path.includes('listeners')
    );

    if (hasEventHandlers) {
      confidence += 30;
      components.push('Event handlers');
    }

    // Check for message brokers
    const hasBroker = files.some(f => 
      f.content?.includes('kafka') || 
      f.content?.includes('rabbitmq') ||
      f.content?.includes('eventbridge') ||
      f.content?.includes('sns') ||
      f.content?.includes('sqs')
    );

    if (hasBroker) {
      confidence += 30;
      components.push('Message broker');
    }

    // Check for event sourcing
    const hasEventSourcing = files.some(f => 
      f.content?.includes('event sourcing') || 
      f.content?.includes('event store')
    );

    if (hasEventSourcing) {
      confidence += 20;
      components.push('Event sourcing');
    }

    // Check for CQRS
    const hasCQRS = files.some(f => 
      f.content?.includes('command') && f.content?.includes('query')
    );

    if (hasCQRS) {
      confidence += 20;
      components.push('CQRS pattern');
    }

    return {
      type: 'event-driven',
      confidence,
      description: 'Event-driven architecture with asynchronous message passing',
      components,
    };
  }

  /**
   * Detect monolithic architecture
   */
  private detectMonolith(files: FileNode[], metadata: CodebaseMetadata): ArchitecturePattern {
    let confidence = 50; // Default baseline
    const components: string[] = [];

    // Single application structure
    const hasMultipleApps = files.filter(f => 
      f.path.includes('app/') || f.path.includes('src/')
    ).length > 1;

    if (!hasMultipleApps) {
      confidence += 20;
      components.push('Single application');
    }

    // Shared database
    const hasSharedDB = files.some(f => 
      f.path.includes('database') || f.path.includes('migrations')
    );

    if (hasSharedDB) {
      confidence += 15;
      components.push('Shared database');
    }

    // Single deployment unit
    const hasSingleDeploy = !files.some(f => 
      f.name === 'docker-compose.yml' && f.content?.includes('services:')
    );

    if (hasSingleDeploy) {
      confidence += 15;
      components.push('Single deployment unit');
    }

    return {
      type: 'monolith',
      confidence,
      description: 'Monolithic architecture with all components in a single application',
      components,
    };
  }

  /**
   * Detect frameworks and technologies
   */
  detectFrameworks(files: FileNode[]): string[] {
    const frameworks: Set<string> = new Set();

    // Check package.json for Node.js projects
    const packageJson = files.find(f => f.name === 'package.json');
    if (packageJson?.content) {
      try {
        const pkg = JSON.parse(packageJson.content);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        if (deps['next']) frameworks.add('Next.js');
        if (deps['react']) frameworks.add('React');
        if (deps['vue']) frameworks.add('Vue.js');
        if (deps['angular']) frameworks.add('Angular');
        if (deps['express']) frameworks.add('Express.js');
        if (deps['nestjs']) frameworks.add('NestJS');
        if (deps['fastify']) frameworks.add('Fastify');
      } catch (e) {
        // Invalid JSON
      }
    }

    // Check requirements.txt for Python projects
    const requirements = files.find(f => f.name === 'requirements.txt');
    if (requirements?.content) {
      if (requirements.content.includes('django')) frameworks.add('Django');
      if (requirements.content.includes('flask')) frameworks.add('Flask');
      if (requirements.content.includes('fastapi')) frameworks.add('FastAPI');
    }

    // Check pom.xml or build.gradle for Java projects
    const hasMaven = files.some(f => f.name === 'pom.xml');
    const hasGradle = files.some(f => f.name === 'build.gradle');
    
    if (hasMaven || hasGradle) {
      const buildFile = files.find(f => f.name === 'pom.xml' || f.name === 'build.gradle');
      if (buildFile?.content) {
        if (buildFile.content.includes('spring')) frameworks.add('Spring Boot');
        if (buildFile.content.includes('quarkus')) frameworks.add('Quarkus');
        if (buildFile.content.includes('micronaut')) frameworks.add('Micronaut');
      }
    }

    // Check Gemfile for Ruby projects
    const gemfile = files.find(f => f.name === 'Gemfile');
    if (gemfile?.content) {
      if (gemfile.content.includes('rails')) frameworks.add('Ruby on Rails');
      if (gemfile.content.includes('sinatra')) frameworks.add('Sinatra');
    }

    // Check composer.json for PHP projects
    const composer = files.find(f => f.name === 'composer.json');
    if (composer?.content) {
      try {
        const pkg = JSON.parse(composer.content);
        const deps = { ...pkg.require, ...pkg['require-dev'] };
        
        if (deps['laravel/framework']) frameworks.add('Laravel');
        if (deps['symfony/symfony']) frameworks.add('Symfony');
      } catch (e) {
        // Invalid JSON
      }
    }

    return Array.from(frameworks);
  }

  /**
   * Identify entry points
   */
  identifyEntryPoints(files: FileNode[]): string[] {
    const entryPoints: string[] = [];

    // Common entry point files
    const entryPointNames = [
      'index.js', 'index.ts', 'main.js', 'main.ts', 'app.js', 'app.ts',
      'server.js', 'server.ts', 'index.php', 'main.py', '__main__.py',
      'Main.java', 'Application.java', 'main.go'
    ];

    files.forEach(file => {
      if (entryPointNames.includes(file.name)) {
        entryPoints.push(file.path);
      }
    });

    // Check package.json main field
    const packageJson = files.find(f => f.name === 'package.json');
    if (packageJson?.content) {
      try {
        const pkg = JSON.parse(packageJson.content);
        if (pkg.main) entryPoints.push(pkg.main);
      } catch (e) {
        // Invalid JSON
      }
    }

    return entryPoints;
  }
}

// Made with Bob
