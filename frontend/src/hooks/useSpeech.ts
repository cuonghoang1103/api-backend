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
    // Generous cap so long grades/reports are read in full (was 4000 → cut off).
    .slice(0, 16000);
}

/**
 * Load the installed voices, waiting for the async `voiceschanged` event the
 * first time (Chrome returns [] from getVoices() until it fires). Without this,
 * the very first "hear question" click speaks with no voice — or nothing.
 */
let voicesCache: SpeechSynthesisVoice[] = [];
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length) { voicesCache = now; return Promise.resolve(now); }
  return new Promise((resolve) => {
    let done = false;
    const finish = (): void => {
      if (done) return;
      done = true;
      voicesCache = synth.getVoices();
      resolve(voicesCache);
    };
    try { synth.addEventListener('voiceschanged', finish, { once: true }); } catch { /* older browsers */ }
    setTimeout(finish, 1000); // fallback if the event never fires
  });
}

/** Split into sentence-sized chunks for natural pauses at . ! ? … — every chunk
 *  is read by the SAME voice (see speak), never a second voice mid-passage. */
function splitSentences(text: string): string[] {
  return (text.match(/[^.!?…]+[.!?…]*\s*/g) || [text]).filter((s) => s.trim());
}

/**
 * Pick the most natural-sounding installed voice for a language. Browser default
 * voices are robotic; Google/Neural/Siri/premium network voices sound far
 * better, so score and prefer them.
 */
function pickVoice(voices: SpeechSynthesisVoice[], lang: Lang): SpeechSynthesisVoice | undefined {
  const cands = voices.filter((v) => v.lang?.toLowerCase().startsWith(PREFIX[lang]));
  if (!cands.length) return undefined;
  const score = (v: SpeechSynthesisVoice): number => {
    const n = (v.name || '').toLowerCase();
    let s = 0;
    if (/natural|neural/.test(n)) s += 6;
    if (n.includes('google')) s += 5;
    if (/siri|premium|enhanced/.test(n)) s += 4;
    if (v.localService === false) s += 2; // network voices are usually higher quality
    if (v.lang?.toLowerCase() === LOCALE[lang].toLowerCase()) s += 1;
    return s;
  };
  return [...cands].sort((a, b) => score(b) - score(a))[0];
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

  /**
   * Read text aloud with ONE continuous voice — no mid-sentence voice switching.
   *  - A single voice reads the whole passage: the session language first, then
   *    the other language, then the browser default. A Vietnamese voice reading
   *    embedded English terms ("class", "object") in a Vietnamese cadence is far
   *    less jarring than swapping to a second voice for each term (the old
   *    behaviour that made it sound like two different people).
   *  - Voices are awaited on the first call so the first click isn't silent.
   *  - Never returns false for "no VI voice": it falls back to any voice so the
   *    button always produces audio.
   * Returns true whenever TTS will be attempted (kept sync for existing callers).
   */
  const speak = useCallback((text: string, lang: Lang = 'VI'): boolean => {
    if (!ttsSupported) return false;
    const plain = toPlain(text);
    if (!plain) return false;
    const synth = window.speechSynthesis;

    const run = (voices: SpeechSynthesisVoice[]): void => {
      // One voice for the entire passage.
      const voice = pickVoice(voices, lang) || pickVoice(voices, lang === 'VI' ? 'EN' : 'VI');
      const chunks = splitSentences(plain);
      synth.cancel();
      let pending = chunks.length;
      setSpeaking(true);
      const finishOne = (): void => { pending -= 1; if (pending <= 0) setSpeaking(false); };
      for (const chunk of chunks) {
        const u = new SpeechSynthesisUtterance(chunk);
        if (voice) u.voice = voice;
        u.lang = voice?.lang || LOCALE[lang];
        u.rate = 0.95;
        u.pitch = 1;
        u.onend = finishOne;
        u.onerror = finishOne;
        synth.speak(u);
      }
    };

    const cached = synth.getVoices();
    if (cached.length) run(cached);
    else void loadVoices().then(run); // first click before voices load: wait, then speak
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

  // Warm the voice list on mount so the first "hear question" click takes the
  // synchronous path — calling speak() after an await can lose the user-gesture
  // context and get blocked on Safari/mobile.
  useEffect(() => {
    if (ttsSupported) void loadVoices();
  }, [ttsSupported]);

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
