import { AIProvider, AIProviderConfig } from '@/types';

const defaultConfigs: Record<AIProvider, Partial<AIProviderConfig>> = {
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

const providerDisplayNames: Record<AIProvider, string> = {
  ibm: 'IBM watsonx.ai (Powered by Bob)',
  openai: 'OpenAI',
  anthropic: 'Anthropic Claude',
  google: 'Google AI',
  ollama: 'Ollama Cloud',
};

const availableModels: Record<AIProvider, string[]> = {
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

export function getDefaultProviderConfig(
  provider: AIProvider
): Partial<AIProviderConfig> {
  return defaultConfigs[provider];
}

export function getProviderDisplayName(provider: AIProvider): string {
  return providerDisplayNames[provider];
}

export function getAvailableModels(provider: AIProvider): string[] {
  return availableModels[provider];
}
