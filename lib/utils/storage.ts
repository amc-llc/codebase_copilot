import { AIProviderConfig, UserPreferences } from '@/types';
import { DEFAULT_MAX_TOKENS } from '@/lib/ai/provider-metadata';

const STORAGE_KEYS = {
  PROVIDER_CONFIG: 'codebase_copilot_provider_config',
  PREFERENCES: 'codebase_copilot_preferences',
  ANALYSIS_HISTORY: 'codebase_copilot_history',
} as const;

// Lightweight obfuscation for API keys stored in browser storage.
// This is UX-focused, not a substitute for secure server-side secret storage.
const encryptKey = (key: string): string => {
  return btoa(key);
};

const decryptKey = (encrypted: string): string => {
  try {
    return atob(encrypted);
  } catch {
    return '';
  }
};

export const storage = {
  // Provider Configuration
  saveProviderConfig: (config: AIProviderConfig): void => {
    const encrypted = {
      ...config,
      apiKey: encryptKey(config.apiKey),
    };
    localStorage.setItem(STORAGE_KEYS.PROVIDER_CONFIG, JSON.stringify(encrypted));
  },

  getProviderConfig: (): AIProviderConfig | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.PROVIDER_CONFIG);
    if (!stored) return null;
    
    try {
      const config = JSON.parse(stored);
      return {
        ...config,
        apiKey: decryptKey(config.apiKey),
        maxTokens:
          typeof config.maxTokens === 'number' && config.maxTokens !== 4000
            ? config.maxTokens
            : DEFAULT_MAX_TOKENS,
      };
    } catch {
      return null;
    }
  },

  clearProviderConfig: (): void => {
    localStorage.removeItem(STORAGE_KEYS.PROVIDER_CONFIG);
  },

  // User Preferences
  savePreferences: (preferences: UserPreferences): void => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  },

  getPreferences: (): UserPreferences | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  // Analysis History
  saveToHistory: (analysis: any): void => {
    const history = storage.getHistory();
    const updated = [analysis, ...history].slice(0, 10); // Keep last 10
    localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(updated));
  },

  getHistory: (): any[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  clearHistory: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ANALYSIS_HISTORY);
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

// Made with Bob
