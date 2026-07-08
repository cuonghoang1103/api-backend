let ytApiReady = false;
let ytApiCallbacks: Array<() => void> = [];

function onYouTubeIframeAPIReady() {
  ytApiReady = true;
  ytApiCallbacks.forEach((cb) => cb());
  ytApiCallbacks = [];
}

export function loadYouTubeAPI(): Promise<void> {
  if (ytApiReady) return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    ytApiCallbacks.push(resolve);
    if (document.getElementById('youtube-iframe-api')) return;

    // The YouTube IFrame script calls `window.onYouTubeIframeAPIReady`
    // when it finishes loading. It MUST be assigned on `window` — a
    // module-local function is never seen by the script, so the queued
    // resolve callbacks would hang on first load (the first play only
    // worked by luck once `window.YT` happened to exist on a later
    // call). Assign it here so the very first load resolves promptly.
    (window as unknown as { onYouTubeIframeAPIReady: () => void }).onYouTubeIframeAPIReady =
      onYouTubeIframeAPIReady;

    const tag = document.createElement('script');
    tag.id = 'youtube-iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(tag, firstScript);
  });
}

export function isYouTubeUrl(url: string | undefined): { isYT: boolean; videoId: string } {
  if (!url) return { isYT: false, videoId: '' };
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? { isYT: true, videoId: match[1] } : { isYT: false, videoId: '' };
}
