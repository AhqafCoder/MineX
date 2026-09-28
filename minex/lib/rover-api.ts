export function normalizeRoverUrl(ipOrHost: string): string {
  if (!ipOrHost) return "http://winner.local:8080";
  let trimmed = ipOrHost.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `http://${trimmed}`;
  }
  return trimmed.replace(/\/+$/, "");
}

export async function fetchWithTimeout(resource: string | URL | globalThis.Request, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 2500 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}
