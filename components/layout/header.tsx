import { Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { isSaaSMode } from '@/lib/config/app-mode';

interface HeaderProps {
  showSettings?: boolean;
  showBadge?: boolean;
}

export function Header({ showSettings = true, showBadge = true }: HeaderProps) {
  const saasMode = isSaaSMode();
  
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Codebase CoPilot</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Analysis</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {saasMode && (
            <>
              <Link href="/pricing">
                <Button variant="ghost" size="sm">Pricing</Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
          {showSettings && (
            <Link href="/settings">
              <Button variant="ghost" size="sm">Settings</Button>
            </Link>
          )}
          {showBadge && (
            <Badge variant="secondary" className="hidden sm:flex">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}

// Made with Bob
