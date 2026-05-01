'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronDown, FileCode, Folder, Copy, Check } from 'lucide-react';

interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
}

interface CodeViewerProps {
  files: FileNode[];
  onFileSelect?: (file: FileNode) => void;
}

export function CodeViewer({ files, onFileSelect }: CodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const toggleDirectory = (path: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedDirs(newExpanded);
  };

  const handleFileClick = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      onFileSelect?.(file);
    } else {
      toggleDirectory(file.path);
    }
  };

  const copyToClipboard = async () => {
    if (selectedFile?.content) {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    const langMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.php': 'php',
      '.rb': 'ruby',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.css': 'css',
      '.html': 'html',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.md': 'markdown',
    };
    return langMap[ext] || 'text';
  };

  const renderFileTree = (nodes: FileNode[], depth: number = 0): React.ReactElement[] => {
    return nodes.map((node) => {
      const isExpanded = expandedDirs.has(node.path);
      const isSelected = selectedFile?.path === node.path;

      return (
        <div key={node.path}>
          <div
            className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded ${
              isSelected ? 'bg-blue-100 dark:bg-blue-900' : ''
            }`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => handleFileClick(node)}
          >
            {node.type === 'directory' ? (
              <>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <Folder className="w-4 h-4 text-blue-500" />
              </>
            ) : (
              <>
                <div className="w-4" />
                <FileCode className="w-4 h-4 text-gray-500" />
              </>
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">{node.name}</span>
          </div>
          {node.type === 'directory' && isExpanded && node.children && (
            <div>{renderFileTree(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  const renderLineNumbers = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="text-right pr-4 text-gray-500 dark:text-gray-400 select-none font-mono text-sm">
        {lines.map((_, index) => (
          <div key={index} className="leading-6">
            {index + 1}
          </div>
        ))}
      </div>
    );
  };

  const renderCode = (content: string) => {
    return (
      <div className="flex-1 overflow-x-auto">
        <pre className="font-mono text-sm leading-6">
          <code className="text-gray-800 dark:text-gray-200">{content}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
      {/* File Tree */}
      <Card className="md:col-span-1 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Files</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-y-auto h-[500px]">{renderFileTree(files)}</div>
        </CardContent>
      </Card>

      {/* Code Display */}
      <Card className="md:col-span-3 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {selectedFile ? selectedFile.name : 'Select a file'}
              </CardTitle>
              {selectedFile && (
                <Badge variant="secondary" className="text-xs">
                  {getLanguage(selectedFile.name)}
                </Badge>
              )}
            </div>
            {selectedFile?.content && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto h-[500px] bg-gray-50 dark:bg-gray-900">
            {selectedFile?.content ? (
              <div className="flex">
                {renderLineNumbers(selectedFile.content)}
                {renderCode(selectedFile.content)}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a file to view its contents</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Made with Bob
