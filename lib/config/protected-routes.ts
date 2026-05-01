export const SAAS_PROTECTED_PATH_PREFIXES = [
  '/analyze',
  '/results',
  '/demo',
  '/settings',
  '/support',
] as const;

export function isSaaSProtectedPath(pathname: string): boolean {
  return SAAS_PROTECTED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
