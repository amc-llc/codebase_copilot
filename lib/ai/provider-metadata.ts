import { AIProvider, AIProviderConfig } from '@/types';

const defaultConfigs: Record<AIProvider, Partial<AIProviderConfig>> = {
  ibm: {
    temperature: 0.7,
    maxTokens: 4000,
  },
  openai: {
    temperature: 0.7,
    maxTokens: 4000,
  },
  anthropic: {
    temperature: 0.7,
    maxTokens: 4000,
  },
  google: {
    temperature: 0.7,
    maxTokens: 4000,
  },
  ollama: {
    temperature: 0.7,
    maxTokens: 4000,
  },
};

const providerDisplayNames: Record<AIProvider, string> = {
  ibm: 'IBM watsonx.ai (Powered by Bob)',
  openai: 'OpenAI',
  anthropic: 'Anthropic Claude',
  google: 'Google AI',
  ollama: 'Ollama Cloud',
};

export function getDefaultProviderConfig(
  provider: AIProvider
): Partial<AIProviderConfig> {
  return defaultConfigs[provider];
}

export function getProviderDisplayName(provider: AIProvider): string {
  return providerDisplayNames[provider];
}
