import { NextResponse } from 'next/server';
import { isSaaSMode } from '@/lib/config/app-mode';
import { listProviderModels } from '@/lib/ai/provider-models';
import { AIProvider } from '@/types';

export const dynamic = 'force-dynamic';

interface ProviderModelsRequest {
  provider?: AIProvider;
  apiKey?: string;
}

export async function POST(request: Request) {
  try {
    if (isSaaSMode()) {
      return NextResponse.json(
        { error: 'Provider settings are gated behind authentication in SaaS mode.' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as ProviderModelsRequest;
    const provider = body.provider;
    const apiKey = body.apiKey?.trim();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'A provider and API key are required to load models.' },
        { status: 400 }
      );
    }

    const models = await listProviderModels(provider, apiKey);
    return NextResponse.json({ models });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to load provider models due to an unexpected server error.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
