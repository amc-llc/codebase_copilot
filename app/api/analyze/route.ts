import { NextResponse } from 'next/server';
import { AnalysisOrchestrator } from '@/lib/analyzer/analysis-orchestrator';
import { AnalysisRequest } from '@/types';

export const dynamic = 'force-dynamic';

const orchestrator = new AnalysisOrchestrator();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalysisRequest;

    if (!body?.provider?.apiKey) {
      return NextResponse.json(
        { error: 'Add an AI provider API key in Settings before running analysis.' },
        { status: 400 }
      );
    }

    const result = await orchestrator.analyze(body);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Analysis failed due to an unexpected server error.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
