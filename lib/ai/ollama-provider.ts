import { BaseAIProvider, AIMessage, AIResponse } from './base-provider';
import { AIProviderConfig } from '@/types';

export class OllamaProvider extends BaseAIProvider {
  constructor(config: AIProviderConfig) {
    super(config);
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    try {
      // Ollama Cloud API integration
      const response = await fetch('https://api.ollama.cloud/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model || 'llama2',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      
      if (!choice || !choice.message) {
        throw new Error('No response from Ollama');
      }

      return {
        content: choice.message.content || '',
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens || 0,
          completionTokens: data.usage.completion_tokens || 0,
          totalTokens: data.usage.total_tokens || 0,
        } : undefined,
        model: data.model || this.config.model || 'llama2',
      };
    } catch (error: any) {
      throw new Error(`Ollama Cloud API error: ${error.message}`);
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.ollama.cloud/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Made with Bob
