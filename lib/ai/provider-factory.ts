import 'server-only';

import { AIProviderConfig, AIProvider } from '@/types';
import { BaseAIProvider } from './base-provider';
import { OpenAIProvider } from './openai-provider';
import { AnthropicProvider } from './anthropic-provider';
import { GoogleProvider } from './google-provider';
import { IBMProvider } from './ibm-provider';
import { OllamaProvider } from './ollama-provider';
import {
  getAvailableModels,
  getDefaultProviderConfig,
  getProviderDisplayName,
} from './provider-metadata';

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
    return getDefaultProviderConfig(provider);
  }

  static getProviderDisplayName(provider: AIProvider): string {
    return getProviderDisplayName(provider);
  }

  static getAvailableModels(provider: AIProvider): string[] {
    return getAvailableModels(provider);
  }
}

// Made with Bob
