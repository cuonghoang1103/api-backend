'use client';

/**
 * Phát âm thanh cho khoá IELTS: ưu tiên file mp3 giọng Anh thật do máy chủ
 * sinh (Google WaveNet, `POST /ielts/doc`, lưu trên R2), lùi về giọng máy
 * của trình duyệt khi chưa đăng nhập / máy chủ chưa có khoá / mất mạng.
 *
 * Một hàng đợi toàn trang: bấm loa khác thì câu đang đọc dừng ngay — hai
 * giọng chồng lên nhau là thứ người học ghét nhất.
 */
import api from '@/lib/api';

import type { Voice } from './types';
export type { Voice };

/**
 * Thời gian chờ cho mọi lời gọi AI của khoá học (gia sư, chấm viết/nói/chữ).
 * Mặc định của axios là 30 giây — đúng bằng lúc cổng rambo treo mới bị coi là
 * hỏng, nên trang bỏ cuộc NGAY trước khi máy chủ kịp chuyển sang cổng dự phòng
 * (đo thật 27/09: rambo treo 2×30s rồi mới lùi sang modelapi).
 */
export const AI_TIMEOUT = { timeout: 150_000 };
export type Clip = {
  text: string;
  voice?: Voice;
  /** Tốc độ 0,6–1,2 (mặc định 0,95). */
  toc?: number;
  /** 'danhvan': "W, A, L, S, H" — đọc từng tên chữ cái, ngắt nhịp. */
  kieu?: 'danhvan';
  /** Phát tệp âm thanh có sẵn (nhạc hiệu) thay vì đọc `text`. */
  sfx?: string;
  /** Im lặng chừng ấy mili-giây (thời gian đọc câu hỏi) thay vì đọc `text`. */
  pauseMs?: number;
};

/**
 * Tốc độ nghe người học chọn (0,75 / 1 / 1,25) — nhớ trên máy. Áp bằng
 * `playbackRate` nên đổi tốc độ KHÔNG phải sinh lại file.
 */
const RATE_KEY = 'sachhoc:toc-do';
let userRate = 1;
try { const v = Number(localStorage.getItem(RATE_KEY)); if (v >= 0.5 && v <= 1.5) userRate = v; } catch { /* SSR / chế độ riêng tư */ }
const rateSubs = new Set<(r: number) => void>();
export function getRate() { return userRate; }
export function setRate(r: number) {
  userRate = r;
  try { localStorage.setItem(RATE_KEY, String(r)); } catch { /* bỏ qua */ }
  if (audio) audio.playbackRate = r * (audio.dataset.nam === '1' ? NAM_RATE : 1);
  rateSubs.forEach((f) => f(r));
}
export function onRate(f: (r: number) => void) { rateSubs.add(f); return () => { rateSubs.delete(f); }; }

/**
 * Giọng Google Dịch chỉ có MỘT giọng mỗi thứ tiếng. Để hai người trong hội
 * thoại nghe khác nhau, câu của vai NAM phát chậm lại một chút và KHÔNG giữ
 * cao độ (preservesPitch = false) — giọng trầm xuống rõ rệt. Có khoá WaveNet
 * thì máy chủ trả giọng nam thật và mẹo này tự tắt.
 */
const NAM_RATE = 0.86;

const cache = new Map<string, { url: string | null; don: boolean }>();
let audio: HTMLAudioElement | null = null;
let run = 0;
/** Kết thúc lời chờ của đoạn đang phát — dừng giữa chừng thì `ended` không bao giờ bắn. */
let cancelCur: (() => void) | null = null;
/** Máy chủ nói không có khoá TTS → khỏi hỏi lại cho mỗi câu. */
let serverOff = false;

/** Giọng mặc định của khoá đang mở (IELTS: uk-nu, tiếng Nhật: ja-nu) — CoursePage đặt. */
let defaultVoice: Voice = 'uk-nu';
export function setDefaultVoice(v: Voice) { defaultVoice = v; }

const keyOf = (c: Clip) => `${c.voice ?? defaultVoice}|${c.toc ?? 0.95}|${c.kieu ?? ''}|${c.text}`;

async function urlFor(c: Clip): Promise<{ url: string | null; don: boolean }> {
  if (serverOff) return { url: null, don: false };
  const k = keyOf(c);
  if (cache.has(k)) return cache.get(k)!;
  try {
    const res = await api.post('/ielts/doc', { text: c.text, giong: c.voice ?? defaultVoice, toc: c.toc, kieu: c.kieu });
    const d = res.data?.data as { url: string | null; lyDo?: string; giongDon?: boolean } | undefined;
    if (d?.lyDo === 'no_tts_key') serverOff = true;
    const v = { url: d?.url ?? null, don: !!d?.giongDon };
    cache.set(k, v);
    return v;
  } catch {
    return { url: null, don: false }; // 401 (chưa đăng nhập) hay mất mạng: lần này đọc bằng trình duyệt
  }
}

function browserVoice(v?: Voice): SpeechSynthesisVoice | undefined {
  const all = window.speechSynthesis.getVoices();
  const vv = v ?? defaultVoice;
  const nam = vv.endsWith('nam');
  const lang = vv.startsWith('ja') ? 'ja' : 'en';
  const want = vv.startsWith('ja') ? 'ja-JP' : vv.startsWith('us') ? 'en-US' : 'en-GB';
  const pool = all.filter((x) => x.lang?.replace('_', '-').startsWith(lang));
  // Giọng hệ thống không ghi giới tính — đoán theo tên quen thuộc của macOS/Windows/Chrome.
  const MALE = /(daniel|alex|fred|tom|oliver|arthur|aaron|rishi|david|mark|george|guy|ryan|otoya|hattori|ichiro|keita|male|男)/i;
  const FEMALE = /(samantha|karen|serena|kate|moira|tessa|victoria|susan|zira|hazel|libby|sonia|kyoko|o-ren|haruka|ayumi|nanami|female|女)/i;
  // Ưu tiên giọng chất lượng cao (Premium/Enhanced/Natural/Google) hơn giọng "compact".
  const score = (x: SpeechSynthesisVoice) =>
    (x.lang?.replace('_', '-') === want ? 4 : 0) + (/premium|enhanced|natural|neural|google/i.test(x.name) ? 3 : 0)
    + ((nam ? MALE : FEMALE).test(x.name) ? 5 : 0) - ((nam ? FEMALE : MALE).test(x.name) ? 5 : 0);
  return pool.sort((a, b) => score(b) - score(a))[0];
}

function browserSay(c: Clip): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve();
    // Đánh vần: mỗi chữ một câu riêng, nếu gộp "W, A, L" giọng máy đọc "A" như mạo từ.
    const parts = c.kieu === 'danhvan' ? c.text.split(/\s*,\s*/) : [c.text];
    const voice = browserVoice(c.voice);
    parts.forEach((t, i) => {
      const u = new SpeechSynthesisUtterance(t);
      if (voice) u.voice = voice;
      u.lang = voice?.lang || ((c.voice ?? defaultVoice).startsWith('ja') ? 'ja-JP' : 'en-GB');
      u.rate = (c.toc ?? 0.95) * (c.kieu === 'danhvan' ? 0.85 : 0.95) * userRate;
      if ((c.voice ?? defaultVoice).endsWith('nam')) u.pitch = 0.8;
      if (i === parts.length - 1) { u.onend = () => resolve(); u.onerror = () => resolve(); }
      window.speechSynthesis.speak(u);
    });
  });
}

/** Bỏ qua đoạn đang phát (một câu dẫn, khoảng lặng, nhạc hiệu) — phát tiếp đoạn sau. */
export function skipClip() {
  audio?.pause();
  cancelCur?.();
}

export function stopAudio() {
  run += 1;
  audio?.pause();
  cancelCur?.();
  cancelCur = null;
  audio = null;
  try { window.speechSynthesis?.cancel(); } catch { /* bỏ qua */ }
}

/**
 * Phát lần lượt các đoạn; `onEnd` gọi khi xong hết hoặc bị dừng.
 * `opt.onClip(i)` báo đoạn thứ i bắt đầu (tô sáng dòng đang đọc), `opt.gapMs`
 * nghỉ giữa hai đoạn (người học kịp chép bài nghe).
 */
export async function play(clips: Clip | Clip[], onEnd?: () => void, opt?: { onClip?: (i: number) => void; gapMs?: number }) {
  stopAudio();
  const my = run;
  // Bỏ markup trước khi đọc: {漢字|かな} → 漢字, **đậm** → đậm.
  const clean = (t: string) => t.replace(/\{([^|}]+)\|[^}]+\}/g, '$1').replace(/\*\*|==|~~/g, '');
  const list = (Array.isArray(clips) ? clips : [clips]).map((c) => ({ ...c, text: clean(c.text) }));
  try {
    for (const [i, c] of list.entries()) {
      if (my !== run) return;
      if (i > 0 && opt?.gapMs) {
        await new Promise((r) => setTimeout(r, opt.gapMs));
        if (my !== run) return;
      }
      if (c.pauseMs) {
        opt?.onClip?.(i);
        await new Promise<void>((resolve) => { const t = setTimeout(resolve, c.pauseMs); cancelCur = () => { clearTimeout(t); resolve(); }; });
        continue;
      }
      const { url, don } = c.sfx ? { url: c.sfx, don: false } : await urlFor(c);
      if (my !== run) return;
      opt?.onClip?.(i);
      if (url) {
        await new Promise<void>((resolve) => {
          const a = new Audio(url);
          const nam = don && (c.voice ?? defaultVoice).endsWith('nam');
          a.dataset.nam = nam ? '1' : '0';
          a.preservesPitch = !nam;
          // Nhạc hiệu luôn phát đúng tốc độ gốc — chỉnh 0.75× là cho lời nói.
          a.defaultPlaybackRate = c.sfx ? 1 : userRate * (nam ? NAM_RATE : 1);
          a.playbackRate = a.defaultPlaybackRate;
          audio = a;
          cancelCur = resolve;
          a.onended = () => resolve();
          // Nhạc hiệu hỏng thì bỏ qua lặng lẽ — không đọc chữ rỗng.
          a.onerror = () => { (c.sfx ? Promise.resolve() : browserSay(c)).then(resolve); };
          a.play().catch(() => { (c.sfx ? Promise.resolve() : browserSay(c)).then(resolve); });
        });
      } else {
        await new Promise<void>((resolve) => {
          cancelCur = resolve;
          browserSay(c).then(resolve);
        });
      }
    }
  } finally {
    // Gọi cả khi bị dừng giữa chừng — nút loa cũ phải tắt đèn "đang đọc".
    onEnd?.();
  }
}
