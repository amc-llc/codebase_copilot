import 'server-only';

import JSZip from 'jszip';
import {
  EXCLUDED_PATTERNS,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
} from '@/lib/constants';
import { UploadedCodeFile } from '@/types';

type RepositoryProvider = 'github' | 'gitlab';

interface ParsedRepository {
  provider: RepositoryProvider;
  archiveUrl: string;
  defaultBranchUrl: string;
  displayName: string;
}

interface GitHubRepoMetadata {
  default_branch: string;
}

interface GitLabRepoMetadata {
  default_branch: string | null;
}

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, '');
}

function shouldSkipPath(path: string): boolean {
  const normalizedPath = path.toLowerCase();
  return EXCLUDED_PATTERNS.some((pattern) => normalizedPath.includes(pattern.toLowerCase()));
}

function isProbablyText(bytes: Uint8Array): boolean {
  const sampleSize = Math.min(bytes.length, 1024);
  for (let index = 0; index < sampleSize; index += 1) {
    if (bytes[index] === 0) {
      return false;
    }
  }

  return true;
}

function stripZipRoot(path: string): string {
  const segments = path.split('/').filter(Boolean);
  return segments.slice(1).join('/');
}

function parseGitHubRepository(parsedUrl: URL): ParsedRepository {
  const segments = parsedUrl.pathname.split('/').filter(Boolean);

  if (segments.length < 2) {
    throw new Error('GitHub repository URLs should look like https://github.com/owner/repo.');
  }

  const owner = segments[0];
  const repo = segments[1].replace(/\.git$/, '');

  return {
    provider: 'github',
    archiveUrl: `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/{branch}`,
    defaultBranchUrl: `https://api.github.com/repos/${owner}/${repo}`,
    displayName: `${owner}/${repo}`,
  };
}

function parseGitLabRepository(parsedUrl: URL): ParsedRepository {
  const trimmedPath = parsedUrl.pathname.replace(/\/$/, '');
  const projectPath = trimmedPath.split('/-/')[0].replace(/^\/+/, '').replace(/\.git$/, '');

  if (!projectPath || !projectPath.includes('/')) {
    throw new Error('GitLab repository URLs should look like https://gitlab.com/group/project.');
  }

  const encodedProjectPath = encodeURIComponent(projectPath);

  return {
    provider: 'gitlab',
    archiveUrl: `${parsedUrl.origin}/api/v4/projects/${encodedProjectPath}/repository/archive.zip?sha={branch}`,
    defaultBranchUrl: `${parsedUrl.origin}/api/v4/projects/${encodedProjectPath}`,
    displayName: projectPath,
  };
}

function parseRepositoryUrl(url: string): ParsedRepository {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('Enter a valid public repository URL.');
  }

  const hostname = normalizeHostname(parsedUrl.hostname);
  if (hostname === 'github.com') {
    return parseGitHubRepository(parsedUrl);
  }

  if (hostname === 'gitlab.com' || parsedUrl.pathname.includes('/-/')) {
    return parseGitLabRepository(parsedUrl);
  }

  throw new Error('Only public GitHub and GitLab repository URLs are supported right now.');
}

async function getDefaultBranch(repository: ParsedRepository): Promise<string> {
  const response = await fetch(repository.defaultBranchUrl, {
    headers:
      repository.provider === 'github'
        ? {
            Accept: 'application/vnd.github+json',
            'User-Agent': 'codebase-copilot',
          }
        : undefined,
    cache: 'no-store',
  });

  if (response.status === 404) {
    throw new Error(
      `${repository.displayName} was not found. Check the URL or make sure the repository is public.`
    );
  }

  if (!response.ok) {
    throw new Error(`Failed to load repository metadata for ${repository.displayName}.`);
  }

  if (repository.provider === 'github') {
    const metadata = (await response.json()) as GitHubRepoMetadata;
    return metadata.default_branch;
  }

  const metadata = (await response.json()) as GitLabRepoMetadata;
  if (!metadata.default_branch) {
    throw new Error(`No default branch was reported for ${repository.displayName}.`);
  }

  return metadata.default_branch;
}

export async function loadRepositoryFromUrl(
  url: string,
  branch?: string
): Promise<UploadedCodeFile[]> {
  const repository = parseRepositoryUrl(url);
  const resolvedBranch = branch?.trim() || (await getDefaultBranch(repository));
  const archiveUrl = repository.archiveUrl.replace('{branch}', encodeURIComponent(resolvedBranch));

  const archiveResponse = await fetch(archiveUrl, {
    headers: {
      'User-Agent': 'codebase-copilot',
    },
    cache: 'no-store',
  });

  if (archiveResponse.status === 404) {
    throw new Error(`The branch "${resolvedBranch}" was not found on ${repository.displayName}.`);
  }

  if (!archiveResponse.ok) {
    throw new Error(`Failed to download the archive for ${repository.displayName}.`);
  }

  const zipBuffer = await archiveResponse.arrayBuffer();
  const zip = await JSZip.loadAsync(zipBuffer);
  const decoder = new TextDecoder('utf-8');

  const uploadedFiles: UploadedCodeFile[] = [];
  let totalSize = 0;

  for (const zipEntry of Object.values(zip.files)) {
    if (zipEntry.dir) {
      continue;
    }

    const relativePath = stripZipRoot(zipEntry.name);
    if (!relativePath || shouldSkipPath(relativePath)) {
      continue;
    }

    const bytes = await zipEntry.async('uint8array');
    if (bytes.length === 0 || bytes.length > MAX_FILE_SIZE || !isProbablyText(bytes)) {
      continue;
    }

    totalSize += bytes.length;
    if (totalSize > MAX_TOTAL_SIZE) {
      throw new Error('The repository is too large to analyze within the current OSS limits.');
    }

    const content = decoder.decode(bytes);
    uploadedFiles.push({
      path: relativePath,
      name: relativePath.split('/').pop() || relativePath,
      content,
      size: bytes.length,
      lines: content.split('\n').length,
    });

    if (uploadedFiles.length >= MAX_FILES) {
      break;
    }
  }

  if (uploadedFiles.length === 0) {
    throw new Error(`No analyzable text files were found in ${repository.displayName}.`);
  }

  return uploadedFiles;
}
