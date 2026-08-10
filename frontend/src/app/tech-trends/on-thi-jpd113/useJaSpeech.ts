'use client';

/**
 * Đọc tiếng Nhật bằng SpeechSynthesis của trình duyệt.
 *
 * Vì sao KHÔNG dùng `hooks/useSpeech.ts` chung: hook đó chỉ nhận 'VI' | 'EN'
 * và cố tình rơi về giọng ngôn ngữ khác khi thiếu giọng. Ở đây thì ngược lại —
 * đọc một câu tiếng Nhật bằng giọng tiếng Việt là VÔ DỤNG cho việc luyện nghe,
 * còn tệ hơn im lặng vì người học sẽ nhớ sai âm. Nên hook này:
 *
 *  - CHỈ đọc khi máy thật sự có giọng ja-*; không có thì báo `voiceReady=false`
 *    để UI hiện hướng dẫn cài giọng thay vì phát bậy.
 *  - Có `rate` để nghe chậm (0,6-0,7×) rồi tăng dần lên tốc độ thật — cách
 *    luyện nghe chuẩn.
 *  - Đọc nguyên câu một lần, KHÔNG cắt câu: tiếng Nhật không có dấu cách và
 *    「。」 nằm ngay trong chuỗi, cắt ra rồi speak nhiều lần làm mất ngữ điệu.
 *
 * Cài giọng tiếng Nhật:
 *  - macOS: Cài đặt hệ thống → Trợ năng → Nội dung đọc → Giọng nói → Tiếng Nhật (Kyoko/Otoya)
 *  - Windows: Settings → Time & language → Speech → Add voices → Japanese
 *  - Android/Chrome: thường có sẵn giọng Google 日本語
 */
import { useCallback, useEffect, useRef, useState } from 'react';

let voicesCache: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve([]);
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length) {
    voicesCache = now;
    return Promise.resolve(now);
  }
  return new Promise((resolve) => {
    let done = false;
    const finish = (): void => {
      if (done) return;
      done = true;
      voicesCache = synth.getVoices();
      resolve(voicesCache);
    };
    try {
      synth.addEventListener('voiceschanged', finish, { once: true });
    } catch {
      /* trình duyệt cũ không có addEventListener trên synth */
    }
    setTimeout(finish, 1200); // phòng khi sự kiện không bao giờ bắn
  });
}

/** Chọn giọng Nhật nghe tự nhiên nhất trong số giọng đã cài */
function pickJaVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const cands = voices.filter((v) => v.lang?.toLowerCase().startsWith('ja'));
  if (!cands.length) return undefined;
  const score = (v: SpeechSynthesisVoice): number => {
    const n = (v.name || '').toLowerCase();
    let s = 0;
    if (/natural|neural/.test(n)) s += 6;
    if (n.includes('google')) s += 5;
    if (/kyoko|otoya|siri|premium|enhanced/.test(n)) s += 4;
    if (v.localService === false) s += 2;
    return s;
  };
  return [...cands].sort((a, b) => score(b) - score(a))[0];
}

export interface JaSpeech {
  /** Đọc một câu tiếng Nhật. Trả false nếu máy không có giọng Nhật. */
  speak: (text: string, rate?: number) => boolean;
  stop: () => void;
  speaking: boolean;
  /** Máy có giọng tiếng Nhật hay không (chỉ đúng sau khi mount) */
  voiceReady: boolean;
  /** Tên giọng đang dùng — hiện ra để người học biết mình đang nghe ai */
  voiceName: string;
  supported: boolean;
}

export function useJaSpeech(): JaSpeech {
  const [speaking, setSpeaking] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const [voiceName, setVoiceName] = useState('');
  const voiceRef = useRef<SpeechSynthesisVoice | undefined>(undefined);

  const supported = typeof window !== 'undefined' && !!window.speechSynthesis;

  useEffect(() => {
    if (!supported) return;
    let alive = true;
    void loadVoices().then((vs) => {
      if (!alive) return;
      const v = pickJaVoice(vs);
      voiceRef.current = v;
      setVoiceReady(!!v);
      setVoiceName(v?.name ?? '');
    });
    return () => {
      alive = false;
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* bỏ qua */
      }
    };
  }, [supported]);

  const speak = useCallback(
    (text: string, rate = 1): boolean => {
      if (!supported) return false;
      const plain = (text || '').replace(/\s+/g, ' ').trim();
      if (!plain) return false;

      const synth = window.speechSynthesis;
      const run = (voice: SpeechSynthesisVoice | undefined): void => {
        if (!voice) return; // không có giọng Nhật — im lặng, UI đã báo trước
        synth.cancel();
        const u = new SpeechSynthesisUtterance(plain);
        u.voice = voice;
        u.lang = voice.lang || 'ja-JP';
        u.rate = Math.min(1.4, Math.max(0.5, rate));
        u.pitch = 1;
        u.onend = () => setSpeaking(false);
        u.onerror = () => setSpeaking(false);
        setSpeaking(true);
        synth.speak(u);
      };

      if (voiceRef.current) {
        run(voiceRef.current);
        return true;
      }
      // Lần bấm đầu trước khi giọng kịp nạp: nạp rồi đọc.
      void loadVoices().then((vs) => {
        const v = pickJaVoice(vs);
        voiceRef.current = v;
        setVoiceReady(!!v);
        setVoiceName(v?.name ?? '');
        run(v);
      });
      return true;
    },
    [supported],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* bỏ qua */
    }
    setSpeaking(false);
  }, [supported]);

  return { speak, stop, speaking, voiceReady, voiceName, supported };
}
