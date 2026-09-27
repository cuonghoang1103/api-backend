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

export type Voice = 'uk-nu' | 'uk-nam' | 'us-nu' | 'us-nam';
export type Clip = {
  text: string;
  voice?: Voice;
  /** Tốc độ 0,6–1,2 (mặc định 0,95). */
  toc?: number;
  /** 'danhvan': "W, A, L, S, H" — đọc từng tên chữ cái, ngắt nhịp. */
  kieu?: 'danhvan';
};

const cache = new Map<string, string | null>();
let audio: HTMLAudioElement | null = null;
let run = 0;
/** Kết thúc lời chờ của đoạn đang phát — dừng giữa chừng thì `ended` không bao giờ bắn. */
let cancelCur: (() => void) | null = null;
/** Máy chủ nói không có khoá TTS → khỏi hỏi lại cho mỗi câu. */
let serverOff = false;

const keyOf = (c: Clip) => `${c.voice ?? 'uk-nu'}|${c.toc ?? 0.95}|${c.kieu ?? ''}|${c.text}`;

async function urlFor(c: Clip): Promise<string | null> {
  if (serverOff) return null;
  const k = keyOf(c);
  if (cache.has(k)) return cache.get(k)!;
  try {
    const res = await api.post('/ielts/doc', { text: c.text, giong: c.voice ?? 'uk-nu', toc: c.toc, kieu: c.kieu });
    const d = res.data?.data as { url: string | null; lyDo?: string } | undefined;
    if (d?.lyDo === 'no_tts_key') serverOff = true;
    cache.set(k, d?.url ?? null);
    return d?.url ?? null;
  } catch {
    return null; // 401 (chưa đăng nhập) hay mất mạng: lần này đọc bằng trình duyệt
  }
}

function browserVoice(v?: Voice): SpeechSynthesisVoice | undefined {
  const all = window.speechSynthesis.getVoices();
  const want = v?.startsWith('us') ? 'en-US' : 'en-GB';
  return all.find((x) => x.lang === want) || all.find((x) => x.lang?.startsWith('en'));
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
      u.lang = voice?.lang || 'en-GB';
      u.rate = (c.toc ?? 0.95) * (c.kieu === 'danhvan' ? 0.85 : 0.95);
      if (i === parts.length - 1) { u.onend = () => resolve(); u.onerror = () => resolve(); }
      window.speechSynthesis.speak(u);
    });
  });
}

export function stopAudio() {
  run += 1;
  audio?.pause();
  cancelCur?.();
  cancelCur = null;
  audio = null;
  try { window.speechSynthesis?.cancel(); } catch { /* bỏ qua */ }
}

/** Phát lần lượt các đoạn; `onEnd` gọi khi xong hết hoặc bị dừng. */
export async function play(clips: Clip | Clip[], onEnd?: () => void) {
  stopAudio();
  const my = run;
  const list = Array.isArray(clips) ? clips : [clips];
  try {
    for (const c of list) {
      if (my !== run) return;
      const url = await urlFor(c);
      if (my !== run) return;
      if (url) {
        await new Promise<void>((resolve) => {
          const a = new Audio(url);
          audio = a;
          cancelCur = resolve;
          a.onended = () => resolve();
          a.onerror = () => { browserSay(c).then(resolve); };
          a.play().catch(() => { browserSay(c).then(resolve); });
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
