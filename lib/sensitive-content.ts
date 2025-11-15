const SENSITIVE_PATTERNS = [
  /password/i,
  /passw0rd/i,
  /passwd/i,
  /\bssn\b/i,
  /social\s*security/i,
  /\d{3}-\d{2}-\d{4}/,
  /credit\s*card/i,
  /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/,
  /cvv/i,
  /\bpin\b/i,
  /private\s*key/i,
  /secret/i,
  /token/i,
  /api[_\s]?key/i,
];

export function containsSensitiveContent(text: string): boolean {
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(text));
}
