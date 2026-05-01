import { AIProvider, AIProviderConfig } from '@/types';

interface OpenAIModel {
  id: string;
}

interface AnthropicModel {
  id: string;
}

interface GoogleModel {
  name: string;
  supportedGenerationMethods?: string[];
}

interface IBMModel {
  model_id?: string;
}

interface OllamaModel {
  id?: string;
  name?: string;
  model?: string;
}

function uniqueSorted(models: string[]): string[] {
  return [...new Set(models.filter(Boolean))].sort((left, right) => left.localeCompare(right));
}

async function parseJsonResponse<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
}

async function listOpenAIModels(apiKey: string): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    cache: 'no-store',
  });

  const data = await parseJsonResponse<{ data?: OpenAIModel[] }>(
    response,
    'OpenAI rejected the API key or model list request.'
  );

  return uniqueSorted((data.data || []).map((model) => model.id));
}

async function listAnthropicModels(apiKey: string): Promise<string[]> {
  const response = await fetch('https://api.anthropic.com/v1/models', {
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    cache: 'no-store',
  });

  const data = await parseJsonResponse<{ data?: AnthropicModel[] }>(
    response,
    'Anthropic rejected the API key or model list request.'
  );

  return uniqueSorted((data.data || []).map((model) => model.id));
}

async function listGoogleModels(apiKey: string): Promise<string[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
    {
      cache: 'no-store',
    }
  );

  const data = await parseJsonResponse<{ models?: GoogleModel[] }>(
    response,
    'Google AI rejected the API key or model list request.'
  );

  return uniqueSorted(
    (data.models || [])
      .filter((model) => model.supportedGenerationMethods?.includes('generateContent'))
      .map((model) => model.name.replace(/^models\//, ''))
  );
}

async function listIBMModels(apiKey: string): Promise<string[]> {
  const response = await fetch(
    'https://us-south.ml.cloud.ibm.com/ml/v1/foundation_model_specs?version=2024-05-01',
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  );

  const data = await parseJsonResponse<{ resources?: IBMModel[] }>(
    response,
    'IBM watsonx.ai rejected the API key or model list request.'
  );

  return uniqueSorted((data.resources || []).map((model) => model.model_id || ''));
}

async function listOllamaModels(apiKey: string): Promise<string[]> {
  const response = await fetch('https://api.ollama.cloud/v1/models', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    cache: 'no-store',
  });

  const data = await parseJsonResponse<{ data?: OllamaModel[]; models?: OllamaModel[] }>(
    response,
    'Ollama Cloud rejected the API key or model list request.'
  );

  return uniqueSorted(
    [...(data.data || []), ...(data.models || [])].map(
      (model) => model.id || model.name || model.model || ''
    )
  );
}

export async function listProviderModels(provider: AIProvider, apiKey: string): Promise<string[]> {
  const trimmedApiKey = apiKey.trim();
  if (!trimmedApiKey) {
    return [];
  }

  switch (provider) {
    case 'openai':
      return listOpenAIModels(trimmedApiKey);
    case 'anthropic':
      return listAnthropicModels(trimmedApiKey);
    case 'google':
      return listGoogleModels(trimmedApiKey);
    case 'ibm':
      return listIBMModels(trimmedApiKey);
    case 'ollama':
      return listOllamaModels(trimmedApiKey);
    default:
      return [];
  }
}

export async function resolveProviderModel(config: AIProviderConfig): Promise<string> {
  const selectedModel = config.model?.trim();
  if (selectedModel) {
    return selectedModel;
  }

  const availableModels = await listProviderModels(config.provider, config.apiKey);
  const defaultModel = availableModels[0];

  if (!defaultModel) {
    throw new Error(`No available models were returned by the ${config.provider} API.`);
  }

  return defaultModel;
}
