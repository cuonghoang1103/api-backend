'use client';

/**
 * Phase 9 voice for the Interview (FREE browser layer + optional Groq STT).
 *
 * TTS: SpeechSynthesis, rate 0.95 (an interviewer doesn't rush). If the OS has
 * no voice for the target language we DON'T read with the wrong-language voice —
 * we report it so the UI can fall back to text-only cleanly.
 *
 * STT: two paths, chosen by the server's STT_PROVIDER (passed in by the caller):
 *  - browser: SpeechRecognition (Chrome), free, client-side.
 *  - groq:    record audio (MediaRecorder) → caller POSTs it to /interview/stt.
 * Voice is always an INPUT MODE, never a requirement — everything degrades to
 * typing if a mic/API/voice is unavailable.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

type Lang = 'VI' | 'EN';
const LOCALE: Record<Lang, string> = { VI: 'vi-VN', EN: 'en-US' };
const PREFIX: Record<Lang, string> = { VI: 'vi', EN: 'en' };

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
  onerror: ((e: { error?: string }) => void) | null;
  start: () => void;
  stop: () => void;
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false); // browser STT
  const [recording, setRecording] = useState(false); // groq MediaRecorder
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const ttsSupported = typeof window !== 'undefined' && !!window.speechSynthesis;
  const sttSupported =
    typeof window !== 'undefined' &&
    !!((window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);
  const recordSupported =
    typeof window !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';

  /** Whether the OS has a usable voice for the target language. */
  const hasVoiceFor = useCallback((lang: Lang): boolean => {
    if (!ttsSupported) return false;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return true; // not loaded yet — assume yes, speak() re-checks
    return voices.some((v) => v.lang?.toLowerCase().startsWith(PREFIX[lang]));
  }, [ttsSupported]);

  /** Speak text. Returns false (and does NOT read) if no matching-language voice. */
  const speak = useCallback((text: string, lang: Lang = 'VI'): boolean => {
    if (!ttsSupported) return false;
    const plain = toPlain(text);
    if (!plain) return false;
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const match = voices.find((v) => v.lang?.toLowerCase().startsWith(PREFIX[lang]));
    if (voices.length && !match) return false; // no correct-language voice → let caller fall back to text
    synth.cancel();
    const u = new SpeechSynthesisUtterance(plain);
    u.lang = LOCALE[lang];
    u.rate = 0.95; // an interviewer doesn't rush
    if (match) u.voice = match;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.speak(u);
    return true;
  }, [ttsSupported]);

  const stopSpeak = useCallback(() => {
    if (ttsSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [ttsSupported]);

  // ── Browser STT (SpeechRecognition) ──
  // onError surfaces the failure to the caller (permission blocked, no speech,
  // unsupported) so the UI can toast instead of silently doing nothing.
  const listen = useCallback((lang: Lang, onResult: (text: string) => void, onError?: (code: string) => void) => {
    if (!sttSupported) { onError?.('unsupported'); return; }
    const SR = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SR) { onError?.('unsupported'); return; }
    const rec = new SR();
    rec.lang = LOCALE[lang];
    rec.interimResults = false;
    rec.continuous = false;
    let gotResult = false;
    rec.onresult = (e) => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + ' ';
      t = t.trim();
      if (t) { gotResult = true; onResult(t); }
    };
    rec.onend = () => {
      setListening(false);
      // Ended with nothing captured and no explicit error → treat as "no speech".
      if (!gotResult) onError?.('no-speech');
    };
    rec.onerror = (e) => {
      setListening(false);
      gotResult = true; // suppress the onend no-speech toast (onerror already reports)
      onError?.(e?.error || 'error');
    };
    recRef.current = rec;
    setListening(true);
    try { rec.start(); } catch { setListening(false); onError?.('start-failed'); }
  }, [sttSupported]);

  const stopListen = useCallback(() => {
    try { recRef.current?.stop(); } catch { /* ignore */ }
    setListening(false);
  }, []);

  // ── Groq path: record audio, hand the blob back to the caller to upload ──
  const startRecording = useCallback(async (onStop: (blob: Blob | null) => void): Promise<void> => {
    if (!recordSupported) { onStop(null); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = chunksRef.current.length ? new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' }) : null;
        chunksRef.current = [];
        setRecording(false);
        onStop(blob);
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch {
      setRecording(false);
      onStop(null); // mic denied / unavailable → caller falls back to typing
    }
  }, [recordSupported]);

  const stopRecording = useCallback(() => {
    try { mediaRef.current?.stop(); } catch { setRecording(false); }
  }, []);

  useEffect(() => () => {
    try { recRef.current?.stop(); } catch { /* ignore */ }
    try { mediaRef.current?.stop(); } catch { /* ignore */ }
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  return {
    speak, stopSpeak, speaking, ttsSupported, hasVoiceFor,
    listen, stopListen, listening, sttSupported,
    startRecording, stopRecording, recording, recordSupported,
  };
}
