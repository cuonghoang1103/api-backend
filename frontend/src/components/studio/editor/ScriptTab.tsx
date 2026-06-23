'use client';

// Editor Script tab — Phase 7.
//
// A long-form freeform script editor. Distinct from
// Storyboard (which is per-scene fields) and
// Teleprompter (which is the read-aloud player). The
// script is one big textarea, treated as markdown-ish
// (the user is the renderer for now — we don't ship a
// preview pane to keep the surface area small). The
// field is the new `script` column on
// content_projects (added in migration
// 20260626120000_content_creator_script).
//
// Why a textarea, not a rich editor
// ─────────────────────────────────
// 1. The user is the only consumer. There's no
// public-facing script view, so a rich editor would
// be over-engineering.
// 2. A textarea can be enormous and still snappy
// — no contenteditable perf cliff.
// 3. The user can paste from any other tool
// (Notion, Google Docs) and the formatting just
// works.

import { useMemo, useRef, useState, useEffect } from 'react';
import {
 FileText,
 Type,
 AlignLeft,
 Hash,
 Quote,
 Plus,
 Trash2,
 Download,
 Copy,
 CheckCircle2,
} from 'lucide-react';
import type { ContentProject } from '@/types';

interface ScriptTabProps {
 script: string | null;
 onChange: (script: string | null) => void;
}

const SECTIONS = [
 { label: 'INTRO', text: '## Intro\n\n' },
 { label: 'HOOK', text: '## Hook\n\n' },
 { label: 'BODY', text: '## Body\n\n' },
 { label: 'CTA', text: '## CTA\n\n' },
 { label: 'OUTRO', text: '## Outro\n\n' },
];

const TEMPLATE_VLOG = `## Hook (5s)
- One-sentence teaser that creates curiosity.

## Intro (10s)
- Who I am + why this matters.
- Promise: what the viewer will get in 60s.

## Body (3-4 segments, 8-12s each)
- Segment 1: core idea.
- Segment 2: example / B-roll.
- Segment 3: result or proof.
- Segment 4: nuance / counter-argument.

## CTA (5s)
- One specific action (subscribe / comment / link in bio).

## Outro
- Restate the promise. Sign off.
`;

export default function ScriptTab({ script, onChange }: ScriptTabProps) {
 const value = script ?? '';
 const textareaRef = useRef<HTMLTextAreaElement>(null);
 const [copied, setCopied] = useState(false);

 // Word/line/char count — derived from the live
 // value so it updates as you type.
 const stats = useMemo(() => {
 const trimmed = value.trim();
 if (trimmed.length === 0) {
 return { words: 0, lines: 0, chars: 0, readMin: 0 };
 }
 // Word count: split on any whitespace, ignore
 // empty parts. Doesn't try to be smart about
 // markdown (otherwise ## becomes 1 word).
 const words = trimmed.split(/\s+/).length;
 const lines = value.split('\n').length;
 const chars = value.length;
 // Average speaking rate is ~150 words/min. The
 // script is the "script", not the on-camera
 // length, so this is a rough estimate.
 const readMin = Math.max(0, Math.round(words / 150));
 return { words, lines, chars, readMin };
 }, [value]);

 // Auto-grow the textarea to fit content (capped).
 // We measure scrollHeight after each value change.
 useEffect(() => {
 const ta = textareaRef.current;
 if (!ta) return;
 ta.style.height = 'auto';
 ta.style.height = Math.min(ta.scrollHeight, 1200) + 'px';
 }, [value]);

 const insertAtCursor = (text: string) => {
 const ta = textareaRef.current;
 if (!ta) {
 onChange((value + text) || null);
 return;
 }
 const start = ta.selectionStart;
 const end = ta.selectionEnd;
 const next = value.slice(0, start) + text + value.slice(end);
 onChange(next);
 // Restore cursor + selection. Need a tick
 // because React's onChange rerenders before we
 // can move the cursor.
 requestAnimationFrame(() => {
 ta.focus();
 ta.setSelectionRange(start + text.length, start + text.length);
 });
 };

 const wrapSelection = (left: string, right: string) => {
 const ta = textareaRef.current;
 if (!ta) return;
 const start = ta.selectionStart;
 const end = ta.selectionEnd;
 const selected = value.slice(start, end);
 const next =
 value.slice(0, start) +
 left +
 selected +
 right +
 value.slice(end);
 onChange(next);
 requestAnimationFrame(() => {
 ta.focus();
 ta.setSelectionRange(start + left.length, end + left.length);
 });
 };

 const handleCopy = async () => {
 try {
 await navigator.clipboard.writeText(value);
 setCopied(true);
 setTimeout(() => setCopied(false), 1500);
 } catch {
 // ignore
 }
 };

 const handleDownload = () => {
 const blob = new Blob([value], { type: 'text/markdown' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = 'script.md';
 a.click();
 URL.revokeObjectURL(url);
 };

 const handleClear = () => {
 if (value.length === 0) return;
 if (!confirm('Clear the entire script? This cannot be undone.')) return;
 onChange(null);
 };

 return (
 <div className="space-y-4">
 {/* Toolbar */}
 <div className="studio-glass rounded-2xl p-3 sm:p-4 shadow-studio-card flex flex-wrap items-center gap-2">
 {/* Section inserts */}
 <div className="inline-flex flex-wrap items-center gap-1">
 <span className="text-[10px] uppercase tracking-wider text-text-muted mr-1">
 Insert section:
 </span>
 {SECTIONS.map((s) => (
 <button
 key={s.label}
 type="button"
 onClick={() => insertAtCursor(s.text)}
 className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-studio-500/10 text-studio-300 text-[11px] font-semibold hover:bg-studio-500/20 transition-colors"
 >
 <Plus className="w-3 h-3" />
 {s.label}
 </button>
 ))}
 </div>

 <div className="hidden sm:block w-px h-5 bg-studio-500/15" />

 {/* Wrap helpers */}
 <button
 type="button"
 onClick={() => wrapSelection('**', '**')}
 className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-bg-elevated/60 text-text-secondary text-[11px] font-semibold hover:text-text-primary hover:bg-bg-elevated/80 transition-colors"
 title="Bold (wraps selection in **)"
 >
 <Type className="w-3 h-3" />
 Bold
 </button>
 <button
 type="button"
 onClick={() => wrapSelection('_', '_')}
 className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-bg-elevated/60 text-text-secondary text-[11px] font-semibold hover:text-text-primary hover:bg-bg-elevated/80 transition-colors"
 title="Italic"
 >
 <AlignLeft className="w-3 h-3" />
 Italic
 </button>
 <button
 type="button"
 onClick={() => wrapSelection('\n> ', '')}
 className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-bg-elevated/60 text-text-secondary text-[11px] font-semibold hover:text-text-primary hover:bg-bg-elevated/80 transition-colors"
 title="Quote (prefixes line with >)"
 >
 <Quote className="w-3 h-3" />
 Quote
 </button>

 <div className="flex-1" />

 {/* Right cluster */}
 <button
 type="button"
 onClick={() => insertAtCursor(TEMPLATE_VLOG)}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-studio-500/15 text-studio-300 text-[11px] font-semibold hover:bg-studio-500/25 transition-colors"
 title="Insert a vlog script template"
 >
 <FileText className="w-3 h-3" />
 Template
 </button>
 <button
 type="button"
 onClick={handleCopy}
 disabled={!value}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-bg-elevated/60 text-text-secondary text-[11px] font-semibold hover:text-text-primary hover:bg-bg-elevated/80 transition-colors disabled:opacity-50"
 >
 {copied ? (
 <CheckCircle2 className="w-3 h-3 text-emerald-400" />
 ) : (
 <Copy className="w-3 h-3" />
 )}
 {copied ? 'Copied' : 'Copy'}
 </button>
 <button
 type="button"
 onClick={handleDownload}
 disabled={!value}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-bg-elevated/60 text-text-secondary text-[11px] font-semibold hover:text-text-primary hover:bg-bg-elevated/80 transition-colors disabled:opacity-50"
 title="Download as .md"
 >
 <Download className="w-3 h-3" />
 MD
 </button>
 <button
 type="button"
 onClick={handleClear}
 disabled={!value}
 className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-rose-400/70 text-[11px] font-semibold hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
 title="Clear script"
 >
 <Trash2 className="w-3 h-3" />
 </button>
 </div>

 {/* Editor + stats */}
 <div className="studio-glass rounded-2xl shadow-studio-card overflow-hidden">
 <textarea
 ref={textareaRef}
 value={value}
 onChange={(e) => onChange(e.target.value || null)}
 placeholder={`Start typing your script…\n\nUse the toolbar above to insert section headers (Intro / Hook / Body / CTA / Outro), wrap text in **bold** or _italic_, or load a vlog template.\n\nTip: ## at the start of a line becomes a section header.`}
 spellCheck={false}
 className="w-full min-h-[420px] sm:min-h-[520px] px-4 sm:px-6 py-4 sm:py-5 bg-transparent text-sm sm:text-base text-text-primary font-mono leading-relaxed placeholder:text-text-muted focus:outline-none resize-none"
 />
 {/* Stats footer */}
 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 sm:px-6 py-2.5 border-t border-studio-500/10 bg-bg-elevated/30 text-[11px] text-text-muted">
 <span className="inline-flex items-center gap-1">
 <Hash className="w-3 h-3" />
 {stats.words.toLocaleString()} word{stats.words === 1 ? '' : 's'}
 </span>
 <span>{stats.lines.toLocaleString()} lines</span>
 <span>{stats.chars.toLocaleString()} chars</span>
 <span className="inline-flex items-center gap-1">
 ~ {stats.readMin} min read
 </span>
 <span className="flex-1" />
 <span className="text-[10px] uppercase tracking-wider">
 Auto-saves
 </span>
 </div>
 </div>

 {/* Help footer */}
 <div className="text-[11px] text-text-muted px-2">
 Plain text / markdown. Saved automatically with the rest of the project.
 Use the <span className="text-studio-300">Teleprompter</span> tab to read it
 aloud while filming.
 </div>
 </div>
 );
}
