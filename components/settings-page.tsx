'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Key, User, Bell, Shield } from 'lucide-react';
import { storage } from '@/lib/utils/storage';
import { AIProvider } from '@/types';
import { getProviderDisplayName } from '@/lib/ai/provider-metadata';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

function getStoredProviderConfig() {
  if (typeof window === 'undefined') {
    return null;
  }

  return storage.getProviderConfig();
}

export function SettingsPage() {
  const storedConfig = getStoredProviderConfig();
  const [provider, setProvider] = useState<AIProvider>(storedConfig?.provider || 'ibm');
  const [apiKey, setApiKey] = useState(storedConfig?.apiKey || '');
  const [model, setModel] = useState(storedConfig?.model || '');
  const [saved, setSaved] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(Boolean(storedConfig?.apiKey));
  const [savedProvider, setSavedProvider] = useState<AIProvider>(storedConfig?.provider || 'ibm');
  const [savedApiKey, setSavedApiKey] = useState(storedConfig?.apiKey || '');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);

  useEffect(() => {
    if (!savedApiKey.trim()) {
      setAvailableModels([]);
      setModelsError(null);
      setIsLoadingModels(false);
      return;
    }

    let cancelled = false;

    const loadModels = async () => {
      setIsLoadingModels(true);
      setModelsError(null);

      try {
        const response = await fetch('/api/provider-models', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: savedProvider,
            apiKey: savedApiKey,
          }),
        });

        const payload = (await response.json()) as { models?: string[]; error?: string };
        if (!response.ok || payload.error) {
          throw new Error(payload.error || 'Failed to load models.');
        }

        if (cancelled) {
          return;
        }

        const models = payload.models || [];
        setAvailableModels(models);
        setModel((currentModel) => (currentModel && !models.includes(currentModel) ? '' : currentModel));
      } catch (error) {
        if (cancelled) {
          return;
        }

        setAvailableModels([]);
        setModelsError(error instanceof Error ? error.message : 'Failed to load models.');
      } finally {
        if (!cancelled) {
          setIsLoadingModels(false);
        }
      }
    };

    void loadModels();

    return () => {
      cancelled = true;
    };
  }, [savedApiKey, savedProvider]);

  const handleSave = () => {
    storage.saveProviderConfig({
      provider,
      apiKey,
      model: model || undefined,
      temperature: 0.7,
      maxTokens: 4000,
    });
    setHasApiKey(!!apiKey);
    setSavedProvider(provider);
    setSavedApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header showSettings={false} showBadge={false} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Configure your AI providers and preferences
          </p>
        </div>

        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="providers">
              <Key className="w-4 h-4 mr-2" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Provider Configuration</CardTitle>
                <CardDescription>
                  Configure your AI provider API keys. They stay in your browser and are only sent when you run an analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Provider</label>
                  <Select value={provider} onValueChange={(value) => setProvider(value as AIProvider)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                      <SelectItem value="ibm" className="h-12 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-600 text-white">Default</Badge>
                          <span>IBM watsonx.ai</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="openai" className="h-12 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span>OpenAI</span>
                      </SelectItem>
                      <SelectItem value="anthropic" className="h-12 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span>Anthropic</span>
                      </SelectItem>
                      <SelectItem value="google" className="h-12 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span>Google AI</span>
                      </SelectItem>
                      <SelectItem value="ollama" className="h-12 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span>Ollama Cloud</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {getProviderDisplayName(provider)}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                    <Input
                      type="password"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(event) => {
                        setApiKey(event.target.value);
                        setModelsError(null);
                      }}
                    />
                  <p className="text-xs text-gray-500">
                    Get your API key from the provider&apos;s dashboard
                  </p>
                </div>

                {hasApiKey && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model (Optional)</label>
                    {isLoadingModels ? (
                      <div className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        Loading models from the provider API...
                      </div>
                    ) : availableModels.length > 0 ? (
                      <>
                        <Select value={model} onValueChange={setModel}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select a model or use the provider default" />
                          </SelectTrigger>
                          <SelectContent className="z-50 max-h-[300px] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                            {availableModels.map((availableModel) => (
                              <SelectItem
                                key={availableModel}
                                value={availableModel}
                                className="h-10 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {availableModel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Leave empty to let the server use the first model returned by the provider API.
                        </p>
                      </>
                    ) : (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                        {modelsError || 'No models were returned for this API key yet.'}
                      </div>
                    )}
                  </div>
                )}

                {!hasApiKey && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Save your API key first to load models directly from the provider API.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                  {saved && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Saved successfully
                    </Badge>
                  )}
                </div>

                <div className="border-t pt-6 space-y-3">
                  <h4 className="font-medium text-sm">Get API Keys:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="https://cloud.ibm.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      IBM watsonx.ai
                    </a>
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      OpenAI
                    </a>
                    <a
                      href="https://console.anthropic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Anthropic
                    </a>
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Google AI
                    </a>
                    <a
                      href="https://ollama.com/cloud"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ollama Cloud
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Profile management is available in SaaS mode. In OSS mode, no account is required.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Notification settings are available in SaaS mode.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Data Storage</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Your API keys are stored locally in your browser using lightweight obfuscation.
                    They are only included in analysis requests that you explicitly start.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      storage.clearAll();
                      setApiKey('');
                      setModel('');
                      alert('All data cleared successfully');
                    }}
                  >
                    Clear All Stored Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
