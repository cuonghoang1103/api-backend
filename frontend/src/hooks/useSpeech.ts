'use client';

/**
 * useSpeech — Phase 9a voice for the Interview (FREE, browser-native).
 *
 * Text-to-speech (read the question aloud) via SpeechSynthesis and
 * speech-to-text (dictate the answer) via SpeechRecognition. Both are
 * feature-detected — callers hide the buttons when unsupported. No API key, no
 * cost. This is the free tier; a natural-voice server tier (ElevenLabs / OpenAI)
 * can slot in later behind the same call shape.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

type Lang = 'VI' | 'EN';
const LOCALE: Record<Lang, string> = { VI: 'vi-VN', EN: 'en-US' };

// Strip markdown so the reader doesn't pronounce `#`, backticks, etc.
function toPlain(md: string): string {
  return (md || '')
    .replace(/```[\s\S]*?```/g, ' đoạn code ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[#>*_~|]/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000);
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  const ttsSupported = typeof window !== 'undefined' && !!window.speechSynthesis;
  const sttSupported =
    typeof window !== 'undefined' &&
    !!((window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);

  const speak = useCallback((text: string, lang: Lang = 'VI') => {
    if (!ttsSupported) return;
    const plain = toPlain(text);
    if (!plain) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(plain);
    u.lang = LOCALE[lang];
    u.rate = 1;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.speak(u);
  }, [ttsSupported]);

  const stopSpeak = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [ttsSupported]);

  const listen = useCallback((lang: Lang, onResult: (text: string) => void) => {
    if (!sttSupported) return;
    const SR = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = LOCALE[lang];
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + ' ';
      t = t.trim();
      if (t) onResult(t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    try { rec.start(); } catch { setListening(false); }
  }, [sttSupported]);

  const stopListen = useCallback(() => {
    try { recRef.current?.stop(); } catch { /* ignore */ }
    setListening(false);
  }, []);

  useEffect(() => () => {
    try { recRef.current?.stop(); } catch { /* ignore */ }
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  return { speak, stopSpeak, speaking, ttsSupported, listen, stopListen, listening, sttSupported };
}
