import { AIProvider, AIProviderConfig } from '@/types';

export const DEFAULT_MAX_TOKENS = 8000;

const defaultConfigs: Record<AIProvider, Partial<AIProviderConfig>> = {
  ibm: {
    temperature: 0.7,
    maxTokens: DEFAULT_MAX_TOKENS,
  },
  openai: {
    temperature: 0.7,
    maxTokens: DEFAULT_MAX_TOKENS,
  },
  anthropic: {
    temperature: 0.7,
    maxTokens: DEFAULT_MAX_TOKENS,
  },
  google: {
    temperature: 0.7,
    maxTokens: DEFAULT_MAX_TOKENS,
  },
  ollama: {
    temperature: 0.7,
    maxTokens: DEFAULT_MAX_TOKENS,
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
