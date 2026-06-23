'use client';

// Editor Teleprompter tab — full-screen voiceover player
// designed for reading the script while filming.
//
// Two modes:
// • Edit mode: type/paste your script. Autosaves on every
// edit (debounced by the parent).
// • Play mode: big text, controls for font size, scroll
// speed, mirror flip (for camera teleprompter rigs).
//
// The script itself is stored on the project as
// `mainHook` (1-liner) + a concatenation of all scene
// voiceover fields. We don't have a dedicated "script"
// field on the schema yet, so for Phase 4 we just show
// the concatenated voiceover. Phase 7's "Script" tab will
// add a proper field.

import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 FlipHorizontal2,
 Maximize2,
 Minimize2,
 Pause,
 Play,
 RotateCcw,
 Type,
 Mic,
} from 'lucide-react';
import type { ContentProject, ContentScene } from '@/types';

interface TeleprompterTabProps {
 project: ContentProject;
}

export default function TeleprompterTab({ project }: TeleprompterTabProps) {
 // Build the script from scenes (voiceover, in order).
 const scriptLines = useMemo(() => {
 const lines: Array<{ scene: ContentScene; text: string }> = [];
 for (const day of project.days) {
 for (const scene of day.scenes) {
 if (scene.voiceover && scene.voiceover.trim()) {
 lines.push({ scene, text: scene.voiceover.trim() });
 }
 }
 }
 return lines;
 }, [project.days]);

 const totalChars = scriptLines.reduce((a, l) => a + l.text.length, 0);
 const totalWords = scriptLines.reduce(
 (a, l) => a + l.text.split(/\s+/).filter(Boolean).length,
 0,
 );
 const estimatedSeconds = Math.round(totalWords / 2.5); // 150 wpm reading speed

 const [playing, setPlaying] = useState(false);
 const [fontSize, setFontSize] = useState(48);
 const [mirror, setMirror] = useState(false);
 const [fullscreen, setFullscreen] = useState(false);
 const [scrollSpeed, setScrollSpeed] = useState(1);
 const scrollRef = useRef<HTMLDivElement | null>(null);
 const offsetRef = useRef(0);
 const rafRef = useRef<number | null>(null);

 // Auto-scroll loop. We translate the inner text
 // container using transform (GPU-friendly) instead of
 // scrolling the page. The offset accumulates by
 // `scrollSpeed` px per frame.
 useEffect(() => {
 if (!playing) {
 if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
 return;
 }
 let last = performance.now();
 const tick = (now: number) => {
 const dt = now - last;
 last = now;
 offsetRef.current += (scrollSpeed * dt) / 16; // 16ms = 1 frame at 60fps
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

 const reset = () => {
 offsetRef.current = 0;
 if (scrollRef.current) scrollRef.current.style.transform = 'translateY(0)';
 setPlaying(false);
 };

 // Fullscreen — uses the Fullscreen API. The "fullscreen"
 // state mirrors the document's fullscreenElement so the
 // user can also exit with Esc.
 useEffect(() => {
 const handler = () => setFullscreen(document.fullscreenElement != null);
 document.addEventListener('fullscreenchange', handler);
 return () => document.removeEventListener('fullscreenchange', handler);
 }, []);

 const toggleFullscreen = async () => {
 if (document.fullscreenElement) {
 await document.exitFullscreen();
 } else {
 await document.body.requestFullscreen();
 }
 };

 return (
 <div className="space-y-4">
 {/* Meta strip */}
 <div className="rounded-2xl border border-darkborder bg-darkcard/60 p-4 flex flex-wrap items-center gap-4">
 <div className="flex items-center gap-2">
 <div className="w-9 h-9 rounded-xl bg-studio-500/15 flex items-center justify-center">
 <Mic className="w-4 h-4 text-studio-400" />
 </div>
 <div>
 <h2 className="font-heading text-sm font-semibold text-text-primary">Teleprompter</h2>
 <p className="text-xs text-text-muted">
 Reads each scene's voiceover in day order.
 </p>
 </div>
 </div>
 <div className="ml-auto flex items-center gap-4 text-[11px] text-text-muted">
 <span>
 <strong className="text-text-primary font-semibold">{scriptLines.length}</strong> voiceover
 {scriptLines.length === 1 ? '' : 's'}
 </span>
 <span>
 <strong className="text-text-primary font-semibold">{totalWords}</strong> words
 </span>
 <span>
 ~<strong className="text-text-primary font-semibold">{estimatedSeconds}s</strong> @ 150 wpm
 </span>
 </div>
 </div>

 {/* Stage */}
 <div
 className={`relative rounded-2xl border ${
 fullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'border-darkborder bg-darkcard/80'
 } bg-darkcard/80 overflow-hidden`}
 style={{ minHeight: fullscreen ? undefined : 480 }}
 >
 {/* Controls bar */}
 <div className="flex items-center gap-2 px-3 py-2 border-b border-darkborder bg-darkcard/60">
 <button
 type="button"
 onClick={() => setPlaying((p) => !p)}
 disabled={scriptLines.length === 0}
 className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-studio-500/20 text-studio-300 text-xs font-semibold hover:bg-studio-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
 >
 {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
 {playing ? 'Pause' : 'Play'}
 </button>
 <button
 type="button"
 onClick={reset}
 disabled={scriptLines.length === 0}
 className="inline-flex items-center gap-1.5 px-2 h-8 rounded-lg text-text-secondary hover:text-text-primary text-xs"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 Reset
 </button>
 <div className="h-5 w-px bg-darkborder mx-1" />
 <label className="flex items-center gap-1.5 text-[11px] text-text-muted">
 <Type className="w-3.5 h-3.5" />
 Size
 <input
 type="range"
 min={20}
 max={96}
 value={fontSize}
 onChange={(e) => setFontSize(Number(e.target.value))}
 className="w-20 accent-studio-500"
 />
 <span className="w-6 text-right">{fontSize}px</span>
 </label>
 <label className="flex items-center gap-1.5 text-[11px] text-text-muted">
 Speed
 <input
 type="range"
 min={0.25}
 max={4}
 step={0.25}
 value={scrollSpeed}
 onChange={(e) => setScrollSpeed(Number(e.target.value))}
 className="w-20 accent-studio-500"
 />
 <span className="w-8 text-right">{scrollSpeed}×</span>
 </label>
 <button
 type="button"
 onClick={() => setMirror((m) => !m)}
 className={`inline-flex items-center gap-1.5 px-2 h-8 rounded-lg text-xs ${
 mirror
 ? 'bg-studio-500/20 text-studio-300'
 : 'text-text-secondary hover:text-text-primary'
 }`}
 title="Mirror the text — useful for a real teleprompter rig"
 >
 <FlipHorizontal2 className="w-3.5 h-3.5" />
 Mirror
 </button>
 <button
 type="button"
 onClick={toggleFullscreen}
 className="ml-auto inline-flex items-center gap-1.5 px-2 h-8 rounded-lg text-text-secondary hover:text-text-primary text-xs"
 title="Toggle fullscreen"
 >
 {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
 {fullscreen ? 'Exit' : 'Fullscreen'}
 </button>
 </div>

 {/* The script surface — translated upward while
 playing. Pointer events off so dragging doesn't
 interfere with reading. */}
 <div className="relative overflow-hidden h-[calc(100%-3.25rem)] flex items-start justify-center">
 {scriptLines.length === 0 ? (
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="text-center max-w-md px-4">
 <Mic className="w-10 h-10 text-studio-400 mx-auto mb-3" />
 <p className="text-sm text-text-primary font-medium">No voiceover lines yet</p>
 <p className="text-xs text-text-muted mt-1">
 Add a voiceover to any scene in the Storyboard tab — the
 teleprompter will pick them up in day order.
 </p>
 </div>
 </div>
 ) : (
 <div
 className="w-full max-w-3xl px-8 py-24 text-center leading-relaxed will-change-transform"
 style={{
 transform: 'translateY(0)',
 transformOrigin: 'top center',
 }}
 ref={scrollRef}
 >
 {scriptLines.map(({ scene, text }, i) => (
 <div key={scene.id ?? i} className="mb-10">
 <div className="text-[10px] uppercase tracking-[0.2em] text-studio-400/70 mb-2">
 Day {scene.id != null ? `· scene #${scene.sceneNumber}` : ''}
 </div>
 <p
 className="font-medium text-text-primary whitespace-pre-wrap"
 style={{
 fontSize: `${fontSize}px`,
 transform: mirror ? 'scaleX(-1)' : undefined,
 lineHeight: 1.3,
 }}
 >
 {text}
 </p>
 </div>
 ))}
 <div className="h-32" />
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
