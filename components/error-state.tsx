'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface ErrorStateProps {
  title?: string;
  message: string;
  error?: Error;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  showHomeButton = true,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">{message}</p>

          {error && process.env.NODE_ENV === 'development' && (
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Error Details
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                {error.stack || error.message}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {showHomeButton && (
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface APIErrorProps {
  error: {
    status?: number;
    message: string;
  };
  onRetry?: () => void;
}

export function APIError({ error, onRetry }: APIErrorProps) {
  const getErrorMessage = () => {
    switch (error.status) {
      case 401:
        return 'Authentication failed. Please check your API key in Settings.';
      case 403:
        return 'Access denied. You may have exceeded your API quota.';
      case 429:
        return 'Rate limit exceeded. Please try again in a few moments.';
      case 500:
        return 'Server error. The AI provider may be experiencing issues.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  };

  return (
    <ErrorState
      title="API Error"
      message={getErrorMessage()}
      onRetry={onRetry}
      showHomeButton={false}
    />
  );
}

interface ValidationErrorProps {
  errors: string[];
  onClose?: () => void;
}

export function ValidationError({ errors, onClose }: ValidationErrorProps) {
  return (
    <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              Validation Error
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-200">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="mt-3 border-red-300 dark:border-red-700"
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function NotFoundError() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-12">
          <div className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// Made with Bob
