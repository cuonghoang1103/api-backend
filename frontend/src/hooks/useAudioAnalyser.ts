/**
 * Shared audio analyser for CyberAudioVisualizer.
 *
 * Created once by MusicAudioController and read by CyberAudioVisualizer.
 * Uses Web Audio API AnalyserNode to get real-time frequency data.
 */
export function getAudioAnalyser(): AnalyserNode | null {
  // This will be set by MusicAudioController
  return (globalThis as Record<string, unknown>).__audioAnalyser as AnalyserNode | undefined ?? null;
}

export function setAudioAnalyser(analyser: AnalyserNode): void {
  (globalThis as Record<string, unknown>).__audioAnalyser = analyser;
}
