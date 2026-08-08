'use client';

// Editor Teleprompter tab — the surface you actually read from
// while the camera is rolling.
//
// ── What changed and why ────────────────────────────────────────
// This tab used to read ONLY the per-scene `voiceover` fields.
// That made it useless for the studio's main job: you write a
// lecture in the Script tab, hit Teleprompter, and it showed
// "No voiceover lines yet" — the script it was supposed to read
// was never a source. Script is now the DEFAULT source, with
// scenes kept as the second option for shot-by-shot shoots.
//
// Sections are parsed with the same `parseOutline` the Script tab
// uses for its outline rail. When the two had separate parsers the
// progress readout disagreed with the outline the user had just
// written.
//
// Everything here is local UI state — nothing in this tab mutates
// the project, so there is no autosave interaction to worry about.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
 AlignLeft,
 FlipHorizontal2,
 Maximize2,
 Minimize2,
 Minus,
 Pause,
 Play,
 RotateCcw,
 Type,
 Mic,
} from 'lucide-react';
import type { ContentProject, ContentScene } from '@/types';
import { useStudioT } from '@/lib/studio-i18n';
import {
 WORDS_PER_MINUTE,
 countWords,
 formatDuration,
 parseOutline,
 stripComments,
} from '@/lib/script-utils';

interface TeleprompterTabProps {
 project: ContentProject;
}

type Source = 'script' | 'scenes';

/** One readable block on the prompter. */
interface PromptBlock {
 key: string;
 /** Small dim label above the text (section heading / scene no). */
 caption: string | null;
 text: string;
 words: number;
}

export default function TeleprompterTab({ project }: TeleprompterTabProps) {
 const { t } = useStudioT();

 // Default to whichever source actually has content, so opening
 // the tab never lands on an empty screen when the other source
 // is full.
 const hasScript = Boolean(project.script && project.script.trim());
 const [source, setSource] = useState<Source>(hasScript ? 'script' : 'scenes');

 const [playing, setPlaying] = useState(false);
 const [fontSize, setFontSize] = useState(48);
 const [mirror, setMirror] = useState(false);
 const [guide, setGuide] = useState(true);
 const [fullscreen, setFullscreen] = useState(false);
 const [scrollSpeed, setScrollSpeed] = useState(1);
 const [elapsed, setElapsed] = useState(0);

 const scrollRef = useRef<HTMLDivElement | null>(null);
 const stageRef = useRef<HTMLDivElement | null>(null);
 const offsetRef = useRef(0);
 const rafRef = useRef<number | null>(null);

 // ─── Content ──────────────────────────────────────────────────

 const scriptBlocks: PromptBlock[] = useMemo(() => {
 const raw = project.script ?? '';
 if (!raw.trim()) return [];

 const sections = parseOutline(raw);
 // No `##` headings at all — read the whole thing as one block
 // rather than showing nothing.
 if (sections.length === 0) {
 const body = stripComments(raw).trim();
 return body ? [{ key: 'all', caption: null, text: body, words: countWords(body) }] : [];
 }

 const lines = raw.split('\n');
 return sections
 .map((s, i) => {
 const end = i + 1 < sections.length ? sections[i + 1].lineIndex : lines.length;
 const body = stripComments(lines.slice(s.lineIndex + 1, end).join('\n')).trim();
 return {
 key: `s-${s.lineIndex}`,
 caption: s.title,
 text: body,
 words: countWords(body),
 };
 })
 // A heading with no body under it would render as a dim label
 // floating over blank space — skip it.
 .filter((b) => b.text.length > 0);
 }, [project.script]);

 const sceneBlocks: PromptBlock[] = useMemo(() => {
 const out: PromptBlock[] = [];
 for (const day of project.days) {
 for (const scene of day.scenes as ContentScene[]) {
 const vo = scene.voiceover?.trim();
 if (!vo) continue;
 out.push({
 key: `sc-${scene.id ?? `${day.dayNumber}-${scene.sceneNumber}`}`,
 caption: t('teleSceneN', { n: scene.sceneNumber }),
 text: vo,
 words: countWords(vo),
 });
 }
 }
 return out;
 }, [project.days, t]);

 const blocks = source === 'script' ? scriptBlocks : sceneBlocks;
 const totalWords = blocks.reduce((a, b) => a + b.words, 0);
 const estimatedSeconds = Math.round((totalWords / WORDS_PER_MINUTE) * 60);

 // ─── Scroll loop ──────────────────────────────────────────────
 // Translating the inner container is GPU-friendly and, unlike
 // scrollTop, keeps working when the stage is in fullscreen.

 useEffect(() => {
 if (!playing) {
 if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
 return;
 }
 let last = performance.now();
 const tick = (now: number) => {
 const dt = now - last;
 last = now;
 // 16ms ≈ one frame at 60Hz, so `scrollSpeed` reads as
 // "pixels per frame" regardless of the real refresh rate —
 // a 120Hz display scrolls at the same speed, not double.
 offsetRef.current += (scrollSpeed * dt) / 16;
 if (scrollRef.current) {
 scrollRef.current.style.transform = `translateY(-${offsetRef.current}px)`;
 }
 rafRef.current = requestAnimationFrame(tick);
 };
 rafRef.current = requestAnimationFrame(tick);
 return () => {
 if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
 };
 }, [playing, scrollSpeed]);

 // Elapsed clock — how long you have been rolling. Separate from
 // the scroll loop so pausing stops the clock too.
 useEffect(() => {
 if (!playing) return;
 const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
 return () => window.clearInterval(id);
 }, [playing]);

 const reset = useCallback(() => {
 offsetRef.current = 0;
 if (scrollRef.current) scrollRef.current.style.transform = 'translateY(0)';
 setPlaying(false);
 setElapsed(0);
 }, []);

 // Switching source resets the scroll — otherwise the new content
 // starts half-way up, mid-sentence.
 useEffect(() => {
 reset();
 }, [source, reset]);

 // ─── Fullscreen ───────────────────────────────────────────────
 // Request fullscreen on the STAGE, not document.body: the body
 // carries the site chrome, so a body-level fullscreen still
 // shows the navbar behind the prompter on some browsers.

 useEffect(() => {
 const handler = () => setFullscreen(document.fullscreenElement != null);
 document.addEventListener('fullscreenchange', handler);
 return () => document.removeEventListener('fullscreenchange', handler);
 }, []);

 const toggleFullscreen = useCallback(async () => {
 try {
 if (document.fullscreenElement) {
 await document.exitFullscreen();
 } else if (stageRef.current) {
 await stageRef.current.requestFullscreen();
 }
 } catch {
 // Fullscreen can be refused (permissions policy, iframes).
 // The prompter still works windowed, so this is not worth
 // interrupting a take for.
 }
 }, []);

 // ─── Keyboard ─────────────────────────────────────────────────
 // You are standing in front of a camera, not at the keyboard.
 // Space/R/F/arrows mean the controls are reachable with one hand
 // without looking.

 useEffect(() => {
 const onKey = (e: KeyboardEvent) => {
 // Never steal keys from a field the user is typing in — this
 // component shares the page with the editor's inputs.
 const el = e.target as HTMLElement | null;
 if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
 if (el?.isContentEditable) return;

 switch (e.key) {
 case ' ':
 e.preventDefault();
 setPlaying((p) => !p);
 break;
 case 'r':
 case 'R':
 reset();
 break;
 case 'f':
 case 'F':
 void toggleFullscreen();
 break;
 case 'ArrowUp':
 e.preventDefault();
 setScrollSpeed((s) => Math.min(4, +(s + 0.25).toFixed(2)));
 break;
 case 'ArrowDown':
 e.preventDefault();
 setScrollSpeed((s) => Math.max(0.25, +(s - 0.25).toFixed(2)));
 break;
 }
 };
 window.addEventListener('keydown', onKey);
 return () => window.removeEventListener('keydown', onKey);
 }, [reset, toggleFullscreen]);

 const isEmpty = blocks.length === 0;
 const remaining = Math.max(0, estimatedSeconds - elapsed);

 return (
 <div className="space-y-4">
 {/* ── Meta strip ──────────────────────────────────────── */}
 <div className="rounded-2xl border border-darkborder bg-darkcard/60 p-4 flex flex-wrap items-center gap-4">
 <div className="flex items-center gap-2">
 <div className="w-9 h-9 rounded-xl bg-studio-500/15 flex items-center justify-center">
 <Mic className="w-4 h-4 text-studio-400" />
 </div>
 <div>
 <h2 className="font-heading text-sm font-semibold text-text-primary">
 {t('teleTitle')}
 </h2>
 <p className="text-xs text-text-muted">
 {t(source === 'script' ? 'teleSubtitleScript' : 'teleSubtitleScenes')}
 </p>
 </div>
 </div>

 {/* Source switch */}
 <div className="inline-flex rounded-lg bg-bg-elevated/60 p-0.5">
 {(['script', 'scenes'] as const).map((id) => (
 <button
 key={id}
 type="button"
 onClick={() => setSource(id)}
 className={`px-3 h-8 rounded-md text-xs font-semibold transition-colors ${
 source === id
 ? 'bg-studio-500/20 text-studio-200'
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 {t(id === 'script' ? 'teleSourceScript' : 'teleSourceScenes')}
 <span className="ml-1.5 text-[10px] opacity-60">
 {id === 'script' ? scriptBlocks.length : sceneBlocks.length}
 </span>
 </button>
 ))}
 </div>

 <div className="ml-auto flex items-center gap-4 text-[11px] text-text-muted">
 <span>{t('words', { n: totalWords })}</span>
 <span>
 ~
 <strong className="text-text-primary font-semibold">
 {formatDuration(estimatedSeconds)}
 </strong>{' '}
 · {t('teleAtWpm', { n: WORDS_PER_MINUTE })}
 </span>
 </div>
 </div>

 {/* ── Stage ───────────────────────────────────────────── */}
 <div
 ref={stageRef}
 className="relative rounded-2xl border border-darkborder bg-darkcard/80 overflow-hidden"
 style={{ minHeight: 480, height: fullscreen ? '100dvh' : undefined }}
 >
 {/* Controls */}
 <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-darkborder bg-darkcard/60">
 <button
 type="button"
 onClick={() => setPlaying((p) => !p)}
 disabled={isEmpty}
 className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-studio-500/20 text-studio-300 text-xs font-semibold hover:bg-studio-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
 >
 {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
 {playing ? t('telePause') : t('teleStart')}
 </button>
 <button
 type="button"
 onClick={reset}
 disabled={isEmpty}
 className="inline-flex items-center gap-1.5 px-2 h-8 rounded-lg text-text-secondary hover:text-text-primary text-xs disabled:opacity-40"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 {t('teleReset')}
 </button>

 <div className="h-5 w-px bg-darkborder mx-1" />

 <label className="flex items-center gap-1.5 text-[11px] text-text-muted">
 <Type className="w-3.5 h-3.5" />
 {t('teleFontSize')}
 <input
 type="range"
 min={20}
 max={96}
 value={fontSize}
 onChange={(e) => setFontSize(Number(e.target.value))}
 className="w-20 accent-studio-500"
 />
 <span className="w-9 text-right tabular-nums">{fontSize}px</span>
 </label>

 <label className="flex items-center gap-1.5 text-[11px] text-text-muted">
 {t('teleSpeed')}
 <input
 type="range"
 min={0.25}
 max={4}
 step={0.25}
 value={scrollSpeed}
 onChange={(e) => setScrollSpeed(Number(e.target.value))}
 className="w-20 accent-studio-500"
 />
 <span className="w-9 text-right tabular-nums">{scrollSpeed}×</span>
 </label>

 <button
 type="button"
 onClick={() => setGuide((g) => !g)}
 className={`inline-flex items-center gap-1.5 px-2 h-8 rounded-lg text-xs ${
 guide ? 'bg-studio-500/20 text-studio-300' : 'text-text-secondary hover:text-text-primary'
 }`}
 title={t('teleGuideTitle')}
 >
 <Minus className="w-3.5 h-3.5" />
 {t('teleGuide')}
 </button>

 <button
 type="button"
 onClick={() => setMirror((m) => !m)}
 className={`inline-flex items-center gap-1.5 px-2 h-8 rounded-lg text-xs ${
 mirror ? 'bg-studio-500/20 text-studio-300' : 'text-text-secondary hover:text-text-primary'
 }`}
 title={t('teleMirrorTitle')}
 >
 <FlipHorizontal2 className="w-3.5 h-3.5" />
 {t('teleMirror')}
 </button>

 {/* Clock — elapsed vs estimated remaining. The number that
     matters mid-take is "how much is left". */}
 <div className="ml-auto flex items-center gap-3 text-[11px] tabular-nums">
 <span className="text-text-muted">
 {t('teleElapsed')}{' '}
 <strong className="text-text-primary">{formatDuration(elapsed)}</strong>
 </span>
 <span className="text-text-muted">
 {t('teleRemaining')}{' '}
 <strong className={remaining === 0 ? 'text-rose-300' : 'text-studio-300'}>
 {formatDuration(remaining)}
 </strong>
 </span>
 <button
 type="button"
 onClick={() => void toggleFullscreen()}
 className="inline-flex items-center gap-1.5 px-2 h-8 rounded-lg text-text-secondary hover:text-text-primary text-xs"
 title={t('teleFullscreenTitle')}
 >
 {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
 {fullscreen ? t('teleExit') : t('teleFullscreen')}
 </button>
 </div>
 </div>

 {/* Reading surface */}
 <div
 className="relative overflow-hidden flex items-start justify-center"
 style={{ height: fullscreen ? 'calc(100dvh - 3.25rem)' : 'calc(100% - 3.25rem)', minHeight: 420 }}
 >
 {isEmpty ? (
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="text-center max-w-md px-4">
 {source === 'script' ? (
 <AlignLeft className="w-10 h-10 text-studio-400 mx-auto mb-3" />
 ) : (
 <Mic className="w-10 h-10 text-studio-400 mx-auto mb-3" />
 )}
 <p className="text-sm text-text-primary font-medium">
 {t(source === 'script' ? 'teleNoScript' : 'teleNoVoiceover')}
 </p>
 <p className="text-xs text-text-muted mt-1 leading-relaxed">
 {t(source === 'script' ? 'teleNoScriptHint' : 'teleNoVoiceoverHint')}
 </p>
 </div>
 </div>
 ) : (
 <>
 {/* Fixed eye-line. Sits at 38% rather than dead centre —
     that is roughly where a reader's gaze rests when the
     text is scrolling upward. */}
 {guide && (
 <div
 className="pointer-events-none absolute left-0 right-0 z-10 border-t border-studio-500/40"
 style={{ top: '38%' }}
 >
 <span className="absolute -top-2 left-3 w-1.5 h-4 bg-studio-500/60 rounded-sm" />
 <span className="absolute -top-2 right-3 w-1.5 h-4 bg-studio-500/60 rounded-sm" />
 </div>
 )}

 <div
 ref={scrollRef}
 className="w-full max-w-3xl px-8 py-24 text-center leading-relaxed will-change-transform"
 style={{ transform: 'translateY(0)', transformOrigin: 'top center' }}
 >
 {blocks.map((b) => (
 <div key={b.key} className="mb-10">
 {b.caption && (
 <div className="text-[10px] uppercase tracking-[0.2em] text-studio-400/70 mb-2">
 {b.caption}
 </div>
 )}
 <p
 className="font-medium text-text-primary whitespace-pre-wrap"
 style={{
 fontSize: `${fontSize}px`,
 transform: mirror ? 'scaleX(-1)' : undefined,
 lineHeight: 1.3,
 }}
 >
 {b.text}
 </p>
 </div>
 ))}
 {/* Tail space so the last line can scroll up to the
     eye-line instead of stopping at the bottom edge. */}
 <div className="h-[60vh]" />
 </div>
 </>
 )}
 </div>
 </div>

 <p className="text-[11px] text-text-muted px-2">{t('teleShortcuts')}</p>
 </div>
 );
}
