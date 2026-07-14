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

// Any Vietnamese diacritic → the token is Vietnamese for sure.
const VIET_RE = /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;

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

/**
 * Split mixed Vietnamese/English text into language-tagged, sentence-sized units
 * so each is spoken by the right voice at a natural pace:
 *  - a word with Vietnamese diacritics → VI
 *  - a pure-ASCII alphabetic word (≥2 letters) → EN. LLM-written Vietnamese
 *    always carries diacritics, so bare-ASCII words are almost always English
 *    technical terms (Kubernetes, database, async) — reading them with a
 *    Vietnamese voice mangles the pronunciation.
 *  - digits / punctuation inherit the surrounding language.
 * Each unit is further split at sentence enders (. ! ? …) so the queue inserts a
 * natural pause between sentences instead of reading in one flat run.
 */
function toSpeechUnits(text: string, primary: Lang): Array<{ lang: Lang; text: string }> {
  const tokens = text.match(/[\p{L}][\p{L}\d'’.\-]*|\d[\d.,:/]*|\s+|[^\p{L}\p{N}\s]+/gu) || [text];
  const segs: Array<{ lang: Lang; text: string }> = [];
  let cur: Lang = primary;
  for (const tok of tokens) {
    let lang: Lang = cur;
    if (/\p{L}/u.test(tok)) {
      if (VIET_RE.test(tok)) lang = 'VI';
      else if (/^[A-Za-z][A-Za-z'’.\-]*$/.test(tok) && tok.replace(/[^A-Za-z]/g, '').length >= 2) lang = 'EN';
      else lang = cur; // single letters / mixed → keep flowing in the current voice
    }
    const last = segs[segs.length - 1];
    if (last && last.lang === lang) last.text += tok;
    else segs.push({ lang, text: tok });
    cur = lang;
  }
  // Split each language segment into sentences for natural pauses.
  const units: Array<{ lang: Lang; text: string }> = [];
  for (const seg of segs) {
    const sentences = seg.text.match(/[^.!?…]+[.!?…]*\s*/g) || [seg.text];
    for (const s of sentences) if (s.trim()) units.push({ lang: seg.lang, text: s });
  }
  return units;
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
   * Speak text with a bilingual, natural cadence. Returns false (and reads
   * nothing) if there's no voice for the primary language.
   *  - Vietnamese and embedded English terms are each read by their own voice
   *    (so "dùng Kubernetes để" pronounces "Kubernetes" in English, not mangled).
   *  - Text is queued sentence-by-sentence so there are real pauses at . ! ? …
   *  - The most natural installed voice per language is chosen (see pickVoice).
   */
  const speak = useCallback((text: string, lang: Lang = 'VI'): boolean => {
    if (!ttsSupported) return false;
    const plain = toPlain(text);
    if (!plain) return false;
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const primaryVoice = pickVoice(voices, lang);
    if (voices.length && !primaryVoice) return false; // no primary voice → caller falls back to text

    const units = toSpeechUnits(plain, lang);
    if (!units.length) return false;

    // Resolve one voice per language; if the secondary language has no installed
    // voice, fall back to the primary voice rather than dropping the text.
    const viVoice = pickVoice(voices, 'VI') || (lang === 'VI' ? primaryVoice : undefined);
    const enVoice = pickVoice(voices, 'EN') || (lang === 'EN' ? primaryVoice : undefined);

    synth.cancel();
    let pending = units.length;
    setSpeaking(true);
    const finishOne = (): void => { pending -= 1; if (pending <= 0) setSpeaking(false); };

    for (const unit of units) {
      const u = new SpeechSynthesisUtterance(unit.text);
      const v = unit.lang === 'EN' ? (enVoice || primaryVoice) : (viVoice || primaryVoice);
      if (v) u.voice = v;
      u.lang = v?.lang || LOCALE[unit.lang];
      u.rate = unit.lang === 'VI' ? 0.92 : 0.98; // VI a touch slower reads clearer
      u.pitch = 1;
      u.onend = finishOne;
      u.onerror = finishOne;
      synth.speak(u);
    }
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
