import { BaseAIProvider, AIMessage, AIResponse } from './base-provider';
import { AIProviderConfig } from '@/types';
import { listProviderModels, resolveProviderModel } from './provider-models';

export class IBMProvider extends BaseAIProvider {
  constructor(config: AIProviderConfig) {
    super(config);
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const model = await resolveProviderModel(this.config);
      // IBM watsonx.ai API integration
      // This is a placeholder implementation that can be configured with actual IBM credentials
      const response = await fetch('https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model_id: model,
          input: this.formatMessagesForIBM(messages),
          parameters: {
            temperature: this.config.temperature || 0.7,
            max_new_tokens: this.config.maxTokens || 4000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`IBM API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        content: data.results?.[0]?.generated_text || '',
        usage: {
          promptTokens: data.results?.[0]?.input_token_count || 0,
          completionTokens: data.results?.[0]?.generated_token_count || 0,
          totalTokens: (data.results?.[0]?.input_token_count || 0) + (data.results?.[0]?.generated_token_count || 0),
        },
        model,
      };
    } catch (error: any) {
      throw new Error(`IBM watsonx.ai API error: ${error.message}`);
    }
  }

  private formatMessagesForIBM(messages: AIMessage[]): string {
    // Format messages for IBM's expected input format
    return messages
      .map(msg => {
        if (msg.role === 'system') {
          return `System: ${msg.content}`;
        } else if (msg.role === 'user') {
          return `User: ${msg.content}`;
        } else {
          return `Assistant: ${msg.content}`;
        }
      })
      .join('\n\n');
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
