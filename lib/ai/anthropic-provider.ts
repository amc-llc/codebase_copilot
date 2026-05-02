import Anthropic from '@anthropic-ai/sdk';
import { BaseAIProvider, AIMessage, AIResponse } from './base-provider';
import { AIProviderConfig } from '@/types';
import { listProviderModels, resolveProviderModel } from './provider-models';
import { DEFAULT_MAX_TOKENS } from './provider-metadata';

export class AnthropicProvider extends BaseAIProvider {
  private client: Anthropic;

  constructor(config: AIProviderConfig) {
    super(config);
    this.client = new Anthropic({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const model = await resolveProviderModel(this.config);
      // Anthropic requires system message separate from messages array
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');

      const response = await this.client.messages.create({
        model,
        max_tokens: this.config.maxTokens || DEFAULT_MAX_TOKENS,
        temperature: this.config.temperature || 0.7,
        system: systemMessage?.content || this.getSystemPrompt(),
        messages: userMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic');
      }

      return {
        content: content.text,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        },
        model: response.model,
        stopReason: response.stop_reason || undefined,
      };
    } catch (error: any) {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const models = await listProviderModels(this.config.provider, this.config.apiKey);
      return models.length > 0;
    } catch {
      return false;
    }
  }
}

// Made with Bob
