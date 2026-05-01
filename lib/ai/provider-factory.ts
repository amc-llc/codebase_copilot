import { AIProviderConfig, AIProvider } from '@/types';
import { BaseAIProvider } from './base-provider';
import { OpenAIProvider } from './openai-provider';
import { AnthropicProvider } from './anthropic-provider';
import { GoogleProvider } from './google-provider';
import { IBMProvider } from './ibm-provider';
import { OllamaProvider } from './ollama-provider';

export class AIProviderFactory {
  static createProvider(config: AIProviderConfig): BaseAIProvider {
    switch (config.provider) {
      case 'openai':
        return new OpenAIProvider(config);
      case 'anthropic':
        return new AnthropicProvider(config);
      case 'google':
        return new GoogleProvider(config);
      case 'ibm':
        return new IBMProvider(config);
      case 'ollama':
        return new OllamaProvider(config);
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }

  static getDefaultConfig(provider: AIProvider): Partial<AIProviderConfig> {
    const defaults: Record<AIProvider, Partial<AIProviderConfig>> = {
      ibm: {
        model: 'ibm/granite-13b-chat-v2',
        temperature: 0.7,
        maxTokens: 4000,
      },
      openai: {
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
        maxTokens: 4000,
      },
      anthropic: {
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.7,
        maxTokens: 4000,
      },
      google: {
        model: 'gemini-pro',
        temperature: 0.7,
        maxTokens: 4000,
      },
      ollama: {
        model: 'llama2',
        temperature: 0.7,
        maxTokens: 4000,
      },
    };

    return defaults[provider];
  }

  static getProviderDisplayName(provider: AIProvider): string {
    const names: Record<AIProvider, string> = {
      ibm: 'IBM watsonx.ai (Powered by Bob)',
      openai: 'OpenAI',
      anthropic: 'Anthropic Claude',
      google: 'Google AI',
      ollama: 'Ollama Cloud',
    };

    return names[provider];
  }

  static getAvailableModels(provider: AIProvider): string[] {
    const models: Record<AIProvider, string[]> = {
      ibm: [
        'ibm/granite-13b-chat-v2',
        'ibm/granite-20b-multilingual',
        'meta-llama/llama-2-70b-chat',
      ],
      openai: [
        'gpt-4-turbo-preview',
        'gpt-4',
        'gpt-3.5-turbo',
      ],
      anthropic: [
        'claude-3-5-sonnet-20241022',
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
      ],
      google: [
        'gemini-pro',
        'gemini-pro-vision',
      ],
      ollama: [
        'llama2',
        'llama2:13b',
        'llama2:70b',
        'codellama',
        'mistral',
        'mixtral',
      ],
    };

    return models[provider];
  }
}

// Made with Bob
