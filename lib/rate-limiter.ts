const limits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const limit = limits.get(key);
  
  if (!limit || now > limit.resetAt) {
    limits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (limit.count >= maxRequests) {
    return false;
  }
  
  limit.count++;
  return true;
}

export function resetRateLimit(key: string) {
  limits.delete(key);
}

export function cleanup() {
  const now = Date.now();
  for (const [key, limit] of limits.entries()) {
    if (now > limit.resetAt) {
      limits.delete(key);
    }
  }
}

setInterval(cleanup, 60000);
