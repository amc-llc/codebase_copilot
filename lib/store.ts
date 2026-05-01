import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AppState, 
  AIProviderConfig, 
  UserPreferences, 
  AnalysisResult,
  AIProvider,
  ExplanationLevel 
} from '@/types';

interface StoreState extends AppState {
  // Actions
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  addToHistory: (analysis: AnalysisResult) => void;
  clearHistory: () => void;
  setProviderConfig: (config: AIProviderConfig) => void;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  defaultProvider: 'ibm',
  defaultExplanationLevel: 'intermediate',
  theme: 'system',
  autoSave: true,
  maxHistoryItems: 10,
};

const defaultProviderConfig: AIProviderConfig = {
  provider: 'ibm',
  apiKey: '',
  model: 'ibm/granite-13b-chat-v2',
  temperature: 0.7,
  maxTokens: 4000,
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      currentAnalysis: null,
      analysisHistory: [],
      providerConfig: defaultProviderConfig,
      preferences: defaultPreferences,
      isAnalyzing: false,
      error: null,

      // Actions
      setCurrentAnalysis: (analysis) => 
        set({ currentAnalysis: analysis, error: null }),

      addToHistory: (analysis) =>
        set((state) => ({
          analysisHistory: [
            analysis,
            ...state.analysisHistory.slice(0, state.preferences.maxHistoryItems - 1),
          ],
        })),

      clearHistory: () => set({ analysisHistory: [] }),

      setProviderConfig: (config) => 
        set({ providerConfig: config }),

      setPreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),

      setIsAnalyzing: (isAnalyzing) => 
        set({ isAnalyzing }),

      setError: (error) => 
        set({ error, isAnalyzing: false }),

      reset: () =>
        set({
          currentAnalysis: null,
          analysisHistory: [],
          providerConfig: defaultProviderConfig,
          preferences: defaultPreferences,
          isAnalyzing: false,
          error: null,
        }),
    }),
    {
      name: 'codebase-copilot-storage',
      partialize: (state) => ({
        analysisHistory: state.analysisHistory,
        providerConfig: {
          ...state.providerConfig,
          apiKey: '', // Don't persist API key in localStorage
        },
        preferences: state.preferences,
      }),
    }
  )
);

// Made with Bob
