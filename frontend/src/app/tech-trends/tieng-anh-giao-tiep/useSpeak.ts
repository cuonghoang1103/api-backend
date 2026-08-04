'use client';

/**
 * Đọc câu tiếng Anh bằng giọng en-US của trình duyệt.
 *
 * Cố ý viết riêng thay vì dùng `@/hooks/useSpeech`: hook kia gắn với luồng
 * phỏng vấn (kèm cả nhận dạng giọng nói, gọi API STT). Ở đây chỉ cần đọc to
 * một câu, nên giữ độc lập để không kéo theo phần nào của luồng đó.
 *
 * Hai điểm phải xử lý, nếu bỏ qua là tính năng "im lặng" mà không báo lỗi:
 *  1. Chrome trả getVoices() rỗng cho tới khi sự kiện `voiceschanged` bắn —
 *     nên lần bấm ĐẦU TIÊN sẽ không có giọng nếu không chờ.
 *  2. Nếu máy không có giọng tiếng Anh, đọc bằng giọng tiếng Việt nghe sai
 *     hoàn toàn và dạy sai phát âm — thà báo không hỗ trợ còn hơn.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length) {
    cachedVoices = now;
    return Promise.resolve(now);
  }
  return new Promise((resolve) => {
    let done = false;
    const finish = (): void => {
      if (done) return;
      done = true;
      cachedVoices = synth.getVoices();
      resolve(cachedVoices);
    };
    try {
      synth.addEventListener('voiceschanged', finish, { once: true });
    } catch {
      /* trình duyệt cũ */
    }
    setTimeout(finish, 1000);
  });
}

export function useSpeak() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  /** Câu đang đọc — để tô sáng đúng nút vừa bấm. */
  const [current, setCurrent] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSupported(false);
    }
    return () => {
      mounted.current = false;
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* bỏ qua */
      }
    };
  }, []);

  const speak = useCallback(async (text: string, rate = 0.9) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }
    const synth = window.speechSynthesis;
    // Bấm nút khác khi đang đọc thì dừng câu cũ trước, tránh chồng tiếng.
    synth.cancel();

    const voices = await loadVoices();
    const enVoice =
      voices.find((v) => v.lang === 'en-US')
      || voices.find((v) => v.lang?.startsWith('en'));

    if (!enVoice) {
      // Không có giọng tiếng Anh — im lặng còn hơn đọc sai bằng giọng khác.
      setSupported(false);
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = enVoice;
    utter.lang = enVoice.lang || 'en-US';
    utter.rate = rate; // chậm hơn mặc định một chút để người học bắt kịp
    utter.onstart = () => {
      if (!mounted.current) return;
      setSpeaking(true);
      setCurrent(text);
    };
    const clear = (): void => {
      if (!mounted.current) return;
      setSpeaking(false);
      setCurrent(null);
    };
    utter.onend = clear;
    utter.onerror = clear;
    synth.speak(utter);
  }, []);

  const stop = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* bỏ qua */
    }
    setSpeaking(false);
    setCurrent(null);
  }, []);

  return { speak, stop, speaking, supported, current };
}
