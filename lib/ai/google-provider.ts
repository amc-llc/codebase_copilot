import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAIProvider, AIMessage, AIResponse } from './base-provider';
import { AIProviderConfig } from '@/types';
import { listProviderModels, resolveProviderModel } from './provider-models';
import { DEFAULT_MAX_TOKENS } from './provider-metadata';

export class GoogleProvider extends BaseAIProvider {
  private client: GoogleGenerativeAI;

  constructor(config: AIProviderConfig) {
    super(config);
    this.client = new GoogleGenerativeAI(config.apiKey);
  }

  async chat(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const modelName = await resolveProviderModel(this.config);
      const model = this.client.getGenerativeModel({
        model: modelName,
      });

      // Combine system message with first user message for Google
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');

      // Convert messages to Google's format
      const history = userMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const lastMessage = userMessages[userMessages.length - 1];
      let prompt = lastMessage.content;

      // Prepend system message to first user message
      if (systemMessage && history.length === 0) {
        prompt = `${systemMessage.content}\n\n${prompt}`;
      }

      const chat = model.startChat({
        history,
        generationConfig: {
          temperature: this.config.temperature || 0.7,
          maxOutputTokens: this.config.maxTokens || DEFAULT_MAX_TOKENS,
        },
      });

      const result = await chat.sendMessage(prompt);
      const response = result.response;
      const text = response.text();
      const candidate = (response as { candidates?: Array<{ finishReason?: string }> }).candidates?.[0];

      return {
        content: text,
        usage: {
          promptTokens: 0, // Google doesn't provide token counts in the same way
          completionTokens: 0,
          totalTokens: 0,
        },
        model: modelName,
        stopReason: candidate?.finishReason,
      };
    } catch (error: any) {
      throw new Error(`Google AI API error: ${error.message}`);
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
