// Film sources and the provider URLs built from them. No imports on purpose: client scripts
// (src/scripts/film.ts) import this file without pulling in site.ts (and its images).

// A self-hosted mp4 (with an optional WebVTT captions file) or a Vimeo / YouTube video id.
export type FilmSource =
  | { type: 'file'; src: string; captions?: string }
  | { type: 'vimeo' | 'youtube'; id: string };

// What the player needs, written into the page as JSON (data-film) and read back by the script.
export interface FilmPlayerData {
  source: FilmSource;
  // Accessible name of the player: "Kiln Ceramics — Hands, clay and a slow wheel".
  label: string;
}

// The address the play link points to without JavaScript: the file itself or the provider's page.
export function filmWatchUrl(source: FilmSource): string {
  switch (source.type) {
    case 'file':
      return source.src;
    case 'youtube':
      return `https://www.youtube.com/watch?v=${encodeURIComponent(source.id)}`;
    case 'vimeo':
      return `https://vimeo.com/${encodeURIComponent(source.id)}`;
    default: {
      const never: never = source;
      return never;
    }
  }
}

// Privacy-friendly embeds that start playing once loaded (they are only loaded after a click).
export function filmEmbedUrl(source: { type: 'vimeo' | 'youtube'; id: string }): string {
  const id = encodeURIComponent(source.id);
  return source.type === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
    : `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Reads data-film back defensively: anything unexpected gives null, never an exception.
export function parseFilmPlayerData(json: string | undefined): FilmPlayerData | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json ?? '');
  } catch {
    return null;
  }
  if (!isRecord(parsed) || typeof parsed.label !== 'string' || !isRecord(parsed.source)) return null;
  const s = parsed.source;
  if (s.type === 'file' && typeof s.src === 'string' && s.src) {
    const captions = typeof s.captions === 'string' && s.captions ? s.captions : undefined;
    return { label: parsed.label, source: captions ? { type: 'file', src: s.src, captions } : { type: 'file', src: s.src } };
  }
  if ((s.type === 'vimeo' || s.type === 'youtube') && typeof s.id === 'string' && s.id) {
    return { label: parsed.label, source: { type: s.type, id: s.id } };
  }
  return null;
}
