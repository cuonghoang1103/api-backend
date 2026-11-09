/** Máy có vẽ WebGL được không — kiểm MỘT lần cho cả phiên (máy ≤ 2 nhân / RAM < 2 GB coi như không). */
let cache: boolean | null = null;
export function hoTro3D(): boolean {
  if (cache !== null) return cache;
  if (typeof window === 'undefined') return false;
  try {
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.hardwareConcurrency ?? 4) <= 2 || (nav.deviceMemory ?? 4) < 2) return (cache = false);
    const cv = document.createElement('canvas');
    const gl = cv.getContext('webgl2') ?? cv.getContext('webgl');
    cache = !!gl;
    (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext();
    return cache;
  } catch {
    return (cache = false);
  }
}
