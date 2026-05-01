'use client';

import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = 'Loading...', fullScreen = false }: LoadingStateProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">{message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  );
}

interface AnalysisLoadingProps {
  stage: string;
  progress: number;
}

export function AnalysisLoading({ stage, progress }: AnalysisLoadingProps) {
  return (
    <div className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Analyzing Codebase
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stage}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Stages */}
            <div className="space-y-2 text-sm">
              <StageItem name="Parsing files" completed={progress > 20} active={progress <= 20} />
              <StageItem name="Analyzing architecture" completed={progress > 40} active={progress > 20 && progress <= 40} />
              <StageItem name="Detecting patterns" completed={progress > 60} active={progress > 40 && progress <= 60} />
              <StageItem name="Generating insights" completed={progress > 80} active={progress > 60 && progress <= 80} />
              <StageItem name="Compiling results" completed={progress > 95} active={progress > 80} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StageItem({ name, completed, active }: { name: string; completed: boolean; active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {completed ? (
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : active ? (
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
      )}
      <span className={`${completed ? 'text-gray-900 dark:text-white' : active ? 'text-blue-600 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
        {name}
      </span>
    </div>
  );
}

// Made with Bob
