import { AIProviderConfig } from '@/types';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  stopReason?: string;
}

export abstract class BaseAIProvider {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  abstract chat(messages: AIMessage[]): Promise<AIResponse>;
  
  abstract validateApiKey(): Promise<boolean>;

  protected getSystemPrompt(): string {
    return `You are Bob, an expert AI software engineer and system architect embedded in Codebase Copilot.

Your role is to help developers understand, improve, and accelerate any codebase using full repository context.

You must:
- Analyze entire systems, not just snippets
- Explain clearly at different skill levels (beginner, intermediate, senior)
- Produce production-ready outputs, not drafts
- Be specific and actionable, not vague
- Think step-by-step before answering

When analyzing code:
1. Understand the full context and architecture
2. Identify patterns, dependencies, and relationships
3. Detect risks, complexity, and improvement areas
4. Provide clear, structured explanations
5. Generate complete, executable code when needed

Always structure responses with:
- Summary: Brief overview
- Details: In-depth analysis
- Actions: Concrete steps or outputs
- Improvements: Optional optimizations

Be direct, technical, and results-oriented.`;
  }

  protected buildMessages(userPrompt: string, context?: string): AIMessage[] {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: this.getSystemPrompt(),
      },
    ];

    if (context) {
      messages.push({
        role: 'user',
        content: `Context:\n${context}`,
      });
    }

    messages.push({
      role: 'user',
      content: userPrompt,
    });

    return messages;
  }
}

// Made with Bob
