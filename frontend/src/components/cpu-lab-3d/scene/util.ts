/**
 * Tiện ích thuần cho cảnh 3D "Hành trình vào máy tính" — KHÔNG phụ thuộc React, KHÔNG dùng Math.random.
 * Mọi thứ ngẫu nhiên đi qua `rng(seed)` ⇒ cùng một khung hình luôn ra cùng một ảnh (video Remotion dựng song song nhiều tab).
 *
 * ⚠️ Thư mục `scene/` được CHÉP NGUYÊN sang dự án video (~/Documents/video-bai-giang/src/khung/may3d/scene/).
 * NGUỒN DUY NHẤT là ở đây (repo web). Sửa ở đây rồi chạy `bash src/khung/may3d/dong-bo.sh` bên dự án video.
 */

/** Mulberry32 — PRNG 32 bit đủ đều cho hoạ tiết. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** smoothstep(a, b, x) */
export const sstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
/** băm số nguyên → [0, 1) (cho pha của hạt, không cần trạng thái) */
export const hash1 = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const fract = (x: number) => x - Math.floor(x);
