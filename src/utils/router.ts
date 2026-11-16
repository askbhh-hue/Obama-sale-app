export function parseOfferSlugFromPath(pathname: string): string | null {
  const cleanPath = pathname.replace(/\/+$/, '');
  const match = cleanPath.match(/^\/offer\/([^/]+)$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function buildOfferPath(slug: string): string {
  return `/offer/${encodeURIComponent(slug)}`;
}
