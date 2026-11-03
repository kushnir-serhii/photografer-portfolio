// Click-to-play films. Called from site.ts on astro:page-load. Nothing of a film is requested before
// the visitor plays it: the page renders a poster and a play link to the file (or the provider's page),
// and the script swaps the link for the player in place. createFilmPlayer is shared with the /work/ dialog.
import { filmEmbedUrl, parseFilmPlayerData, type FilmPlayerData } from '../data/film';

// Builds the player for a film: a native <video> for a file, the provider's iframe for Vimeo / YouTube.
export function createFilmPlayer({ source, label }: FilmPlayerData): HTMLVideoElement | HTMLIFrameElement {
  if (source.type === 'file') {
    const video = document.createElement('video');
    video.className = 'sh-film__player';
    video.controls = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'auto';
    video.setAttribute('aria-label', label);
    const mp4 = document.createElement('source');
    mp4.src = source.src;
    mp4.type = 'video/mp4';
    video.append(mp4);
    if (source.captions) {
      const track = document.createElement('track');
      track.kind = 'captions';
      track.srclang = 'en';
      track.label = 'English';
      track.src = source.captions;
      track.default = true;
      video.append(track);
    }
    return video;
  }
  const frame = document.createElement('iframe');
  frame.className = 'sh-film__player';
  frame.src = filmEmbedUrl(source);
  frame.title = label;
  frame.allow = 'autoplay; fullscreen; picture-in-picture';
  frame.allowFullscreen = true;
  return frame;
}

export function initFilms() {
  document.querySelectorAll<HTMLElement>('[data-film-reel]').forEach((reel) => {
    const stage = reel.querySelector<HTMLElement>('[data-film-stage]');
    const play = reel.querySelector<HTMLAnchorElement>('[data-film-play]');
    const data = parseFilmPlayerData(reel.dataset.film);
    // Bad data: leave the plain link, which still opens the film.
    if (!stage || !play || !data) return;

    play.addEventListener('click', (e) => {
      // Let modified clicks (new tab, download) do what the link does.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      const player = createFilmPlayer(data);
      // Video and iframe are focusable already; this makes sure (Safari) so focus lands on the player.
      player.tabIndex = 0;
      stage.replaceChildren(player);
      reel.classList.add('is-playing');
      player.focus({ preventScroll: true });
      if (player instanceof HTMLVideoElement) {
        // Autoplay can be refused (data saver, browser policy); the controls are there either way.
        player.play().catch(() => {});
      }
    });
  });
}
