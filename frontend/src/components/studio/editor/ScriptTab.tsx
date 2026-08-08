'use client';

// Editor Script tab — write, template, snapshot.
//
// Three things live here that a plain textarea does not give you:
//
//  1. TEMPLATES. A blank page is the slowest part of making a
//     video. The picker inserts a professional skeleton matched to
//     the project's content type and recording language — see
//     lib/studio-templates.ts for why those skeletons carry time
//     budgets and prompts rather than placeholders.
//  2. VERSIONS. Autosave overwrites `script` every ~1.2s, so
//     nothing protects a big rewrite. "Save version" takes an
//     immutable snapshot the autosave can never touch.
//  3. PACING. A script is written to fit a slot. The outline rail
//     shows spoken seconds per section and the meter shows the
//     whole script against the project's target duration, so
//     "this is twice too long" is visible while writing instead of
//     while editing footage.
//
// Why still a textarea and not a rich editor: the user is the only
// consumer, a textarea stays snappy at 5000 words where
// contenteditable does not, and pasting from Notion or Google Docs
// just works.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
 AlignLeft,
 BookOpen,
 CheckCircle2,
 Copy,
 Download,
 FileText,
 Hash,
 History,
 ListTree,
 Plus,
 Quote,
 Save,
 Timer,
 Trash2,
 Type,
} from 'lucide-react';
import ScriptTemplatePicker from './ScriptTemplatePicker';
import ScriptVersionPanel from './ScriptVersionPanel';
import { useCreateScriptTemplate, useCreateScriptVersion } from '@/hooks/useContentQueries';
import { useStudioT, type StudioKey } from '@/lib/studio-i18n';
import { formatDuration, scriptStats } from '@/lib/script-utils';
import type { ContentProject } from '@/types';

/** Section headers the toolbar can insert. Labels are translated;
 *  the inserted heading follows the RECORDING language so an
 *  English script never grows a Vietnamese header. */
const SECTIONS: Array<{ key: StudioKey; vi: string; en: string }> = [
 { key: 'secIntro', vi: '## Mở đầu\n\n', en: '## Intro\n\n' },
 { key: 'secHook', vi: '## Hook\n\n', en: '## Hook\n\n' },
 { key: 'secBody', vi: '## Nội dung\n\n', en: '## Body\n\n' },
 { key: 'secCta', vi: '## Kêu gọi hành động\n\n', en: '## Call to action\n\n' },
 { key: 'secOutro', vi: '## Kết\n\n', en: '## Outro\n\n' },
];

interface ScriptTabProps {
 project: ContentProject;
 onChange: (script: string | null) => void;
}

export default function ScriptTab({ project, onChange }: ScriptTabProps) {
 const { t } = useStudioT();
 const value = project.script ?? '';
 const textareaRef = useRef<HTMLTextAreaElement>(null);

 const [copied, setCopied] = useState(false);
 const [pickerOpen, setPickerOpen] = useState(false);
 const [versionsOpen, setVersionsOpen] = useState(false);
 const [saveVersionOpen, setSaveVersionOpen] = useState(false);
 const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
 const [toast, setToast] = useState<string | null>(null);

 const createVersion = useCreateScriptVersion();
 const createTemplate = useCreateScriptTemplate();

 const bodyLang: 'vi' | 'en' = project.scriptLang === 'EN' ? 'en' : 'vi';

 // One derivation for the footer, the meter and the outline, so
 // the three can never report different numbers.
 const stats = useMemo(
 () => scriptStats(value, project.targetDurationSec),
 [value, project.targetDurationSec],
 );

 // Auto-grow the textarea to fit its content, capped so a very
 // long script still leaves the toolbar reachable.
 useEffect(() => {
 const ta = textareaRef.current;
 if (!ta) return;
 ta.style.height = 'auto';
 ta.style.height = Math.min(ta.scrollHeight, 1200) + 'px';
 }, [value]);

 const flash = useCallback((msg: string) => {
 setToast(msg);
 window.setTimeout(() => setToast(null), 2200);
 }, []);

 // ─── Editing helpers ──────────────────────────────────────────

 const insertAtCursor = (text: string) => {
 const ta = textareaRef.current;
 if (!ta) {
 onChange(value + text || null);
 return;
 }
 const start = ta.selectionStart;
 const end = ta.selectionEnd;
 onChange(value.slice(0, start) + text + value.slice(end));
 // React re-renders before the caret can move, so defer a frame.
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
 onChange(value.slice(0, start) + left + selected + right + value.slice(end));
 requestAnimationFrame(() => {
 ta.focus();
 ta.setSelectionRange(start + left.length, end + left.length);
 });
 };

 /** Jump the caret to a section heading and scroll it into view. */
 const gotoSection = (charIndex: number) => {
 const ta = textareaRef.current;
 if (!ta) return;
 ta.focus();
 ta.setSelectionRange(charIndex, charIndex);
 // The textarea is auto-grown to full height, so the page — not
 // the textarea — is what scrolls. Measure the caret's line and
 // scroll the window to it.
 const before = value.slice(0, charIndex).split('\n').length - 1;
 const lineHeight = parseFloat(getComputedStyle(ta).lineHeight || '24') || 24;
 const top = ta.getBoundingClientRect().top + window.scrollY + before * lineHeight;
 window.scrollTo({ top: top - 120, behavior: 'smooth' });
 };

 const handleCopy = async () => {
 try {
 await navigator.clipboard.writeText(value);
 setCopied(true);
 window.setTimeout(() => setCopied(false), 1500);
 } catch {
 // Clipboard permission denied — nothing useful to say.
 }
 };

 const handleDownload = () => {
 const blob = new Blob([value], { type: 'text/markdown' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `${project.slug || 'script'}.md`;
 a.click();
 URL.revokeObjectURL(url);
 };

 const handleClear = () => {
 if (!value) return;
 if (!confirm(t('confirmClearScript'))) return;
 onChange(null);
 };

 // ─── Versions ─────────────────────────────────────────────────

 /**
  * Snapshot the CURRENT on-screen text.
  *
  * We pass `script: value` rather than relying on the stored
  * column: the autosave debounce may not have flushed the last
  * few keystrokes yet, and a snapshot that silently misses the
  * final paragraph is worse than no snapshot at all.
  */
 const snapshot = async (label: string | null, origin: 'MANUAL' | 'TEMPLATE') => {
 if (!value.trim()) {
 flash(t('versionEmptyScript'));
 return false;
 }
 await createVersion.mutateAsync({ projectId: project.id, label, origin, script: value });
 return true;
 };

 const handleApplyTemplate = async (body: string, templateName: string) => {
 // Snapshot first so applying a template is never destructive.
 if (value.trim()) {
 await snapshot(`${t('templates')}: ${templateName}`, 'TEMPLATE');
 }
 onChange(body);
 flash(t('applyTemplate'));
 };

 return (
 <div className="space-y-4">
 {/* ── Toolbar ─────────────────────────────────────────── */}
 <div className="studio-glass rounded-2xl p-3 sm:p-4 shadow-studio-card flex flex-wrap items-center gap-2">
 <div className="inline-flex flex-wrap items-center gap-1">
 <span className="text-[10px] uppercase tracking-wider text-text-muted mr-1">
 {t('insertSection')}
 </span>
 {SECTIONS.map((s) => (
 <button
 key={s.key}
 type="button"
 onClick={() => insertAtCursor(bodyLang === 'en' ? s.en : s.vi)}
 className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-studio-500/10 text-studio-300 text-[11px] font-semibold hover:bg-studio-500/20 transition-colors"
 >
 <Plus className="w-3 h-3" />
 {t(s.key)}
 </button>
 ))}
 </div>

 <div className="hidden sm:block w-px h-5 bg-studio-500/15" />

 <ToolbarButton icon={Type} label={t('bold')} onClick={() => wrapSelection('**', '**')} />
 <ToolbarButton icon={AlignLeft} label={t('italic')} onClick={() => wrapSelection('_', '_')} />
 <ToolbarButton icon={Quote} label={t('quote')} onClick={() => wrapSelection('\n> ', '')} />

 <div className="flex-1" />

 {/* Primary script actions — templates and history are the
     two features people come to this tab for, so they get
     filled treatments rather than the muted toolbar style. */}
 <button
 type="button"
 onClick={() => setPickerOpen(true)}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-studio-500/15 text-studio-300 text-[11px] font-semibold hover:bg-studio-500/25 transition-colors"
 >
 <BookOpen className="w-3 h-3" />
 {t('templates')}
 </button>
 <button
 type="button"
 onClick={() => setSaveVersionOpen(true)}
 disabled={!value.trim()}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/25 transition-colors disabled:opacity-40"
 title={t('saveVersionTitle')}
 >
 <Save className="w-3 h-3" />
 {t('saveVersion')}
 </button>
 <button
 type="button"
 onClick={() => setVersionsOpen(true)}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-bg-elevated/60 text-text-secondary text-[11px] font-semibold hover:text-text-primary hover:bg-bg-elevated/80 transition-colors"
 >
 <History className="w-3 h-3" />
 {t('versions')}
 </button>
 <button
 type="button"
 onClick={() => setSaveTemplateOpen(true)}
 disabled={!value.trim()}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-bg-elevated/60 text-text-secondary text-[11px] font-semibold hover:text-text-primary hover:bg-bg-elevated/80 transition-colors disabled:opacity-40"
 >
 <FileText className="w-3 h-3" />
 {t('saveAsTemplate')}
 </button>

 <div className="hidden sm:block w-px h-5 bg-studio-500/15" />

 <button
 type="button"
 onClick={handleCopy}
 disabled={!value}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-bg-elevated/60 text-text-secondary text-[11px] font-semibold hover:text-text-primary hover:bg-bg-elevated/80 transition-colors disabled:opacity-50"
 >
 {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
 {copied ? t('copied') : t('copy')}
 </button>
 <button
 type="button"
 onClick={handleDownload}
 disabled={!value}
 className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md bg-bg-elevated/60 text-text-secondary text-[11px] font-semibold hover:text-text-primary hover:bg-bg-elevated/80 transition-colors disabled:opacity-50"
 title={t('downloadMd')}
 >
 <Download className="w-3 h-3" />
 MD
 </button>
 <button
 type="button"
 onClick={handleClear}
 disabled={!value}
 className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-rose-400/70 text-[11px] font-semibold hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
 title={t('delete')}
 >
 <Trash2 className="w-3 h-3" />
 </button>
 </div>

 {/* ── Editor + outline rail ───────────────────────────── */}
 <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-4 items-start">
 <div className="studio-glass rounded-2xl shadow-studio-card overflow-hidden">
 <textarea
 ref={textareaRef}
 value={value}
 onChange={(e) => onChange(e.target.value || null)}
 placeholder={t('scriptPlaceholder')}
 spellCheck={false}
 className="w-full min-h-[420px] sm:min-h-[520px] px-4 sm:px-6 py-4 sm:py-5 bg-transparent text-sm sm:text-base text-text-primary font-mono leading-relaxed placeholder:text-text-muted focus:outline-none resize-none"
 />
 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 sm:px-6 py-2.5 border-t border-studio-500/10 bg-bg-elevated/30 text-[11px] text-text-muted">
 <span className="inline-flex items-center gap-1">
 <Hash className="w-3 h-3" />
 {t('words', { n: stats.words })}
 </span>
 <span>{t('lines', { n: stats.lines })}</span>
 <span>{t('chars', { n: stats.chars })}</span>
 <span className="inline-flex items-center gap-1 text-studio-300">
 <Timer className="w-3 h-3" />
 {formatDuration(stats.estimatedSeconds)}
 </span>
 <span className="flex-1" />
 <span className="text-[10px] uppercase tracking-wider">{t('scriptAutosaves')}</span>
 </div>
 </div>

 {/* Right rail: budget meter + outline */}
 <div className="space-y-3 lg:sticky lg:top-20">
 <BudgetMeter
 stats={stats}
 targetSeconds={project.targetDurationSec}
 t={t}
 />

 <div className="studio-glass rounded-2xl shadow-studio-card overflow-hidden">
 <div className="flex items-center gap-2 px-3 py-2.5 border-b border-studio-500/10">
 <ListTree className="w-3.5 h-3.5 text-studio-300" />
 <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
 {t('outline')}
 </p>
 <span className="flex-1" />
 <span className="text-[10px] text-text-muted">{stats.sections.length}</span>
 </div>
 {stats.sections.length === 0 ? (
 <p className="px-3 py-4 text-[11px] text-text-muted italic leading-relaxed">
 {t('outlineEmpty')}
 </p>
 ) : (
 // Capped height with its own scroll: a 20-section
 // lecture outline is taller than the viewport, and a
 // sticky column taller than the screen makes the whole
 // page feel stuck.
 <ul className="max-h-[50vh] overflow-y-auto py-1">
 {stats.sections.map((s) => (
 <li key={`${s.lineIndex}-${s.title}`}>
 <button
 type="button"
 onClick={() => gotoSection(s.charIndex)}
 className="w-full text-left px-3 py-1.5 hover:bg-studio-500/10 transition-colors group"
 >
 <div className="flex items-start gap-2">
 <span className="min-w-0 flex-1 text-[11px] text-text-secondary group-hover:text-text-primary truncate">
 {s.title}
 </span>
 <span className="text-[10px] text-text-muted tabular-nums shrink-0">
 {formatDuration(s.seconds)}
 </span>
 </div>
 </button>
 </li>
 ))}
 </ul>
 )}
 </div>
 </div>
 </div>

 {/* Help footer */}
 <p className="text-[11px] text-text-muted px-2 leading-relaxed">
 {t('scriptFooterHelp', { tele: t('tabTeleprompter') })}
 </p>

 {/* ── Dialogs ─────────────────────────────────────────── */}
 <ScriptTemplatePicker
 open={pickerOpen}
 onClose={() => setPickerOpen(false)}
 projectType={project.type}
 scriptLang={project.scriptLang}
 hasExistingScript={value.trim().length > 0}
 onApply={(body, name) => void handleApplyTemplate(body, name)}
 />

 <ScriptVersionPanel
 open={versionsOpen}
 onClose={() => setVersionsOpen(false)}
 projectId={project.id}
 onRestored={(script) => onChange(script || null)}
 />

 <PromptDialog
 open={saveVersionOpen}
 title={t('saveVersionTitle')}
 fieldLabel={t('versionLabel')}
 placeholder={t('versionLabelPlaceholder')}
 confirmLabel={t('saveVersion')}
 cancelLabel={t('cancel')}
 busy={createVersion.isPending}
 onCancel={() => setSaveVersionOpen(false)}
 onConfirm={async (label) => {
 const ok = await snapshot(label || null, 'MANUAL');
 setSaveVersionOpen(false);
 if (ok) flash(t('saved'));
 }}
 />

 <PromptDialog
 open={saveTemplateOpen}
 title={t('saveAsTemplateTitle')}
 fieldLabel={t('templateName')}
 placeholder={t('templateNamePlaceholder')}
 secondFieldLabel={t('templateDesc')}
 secondPlaceholder={t('templateDescPlaceholder')}
 confirmLabel={t('save')}
 cancelLabel={t('cancel')}
 required
 busy={createTemplate.isPending}
 onCancel={() => setSaveTemplateOpen(false)}
 onConfirm={async (name, description) => {
 if (!name.trim()) return;
 await createTemplate.mutateAsync({
 name: name.trim(),
 description: description?.trim() || null,
 // Saved in whichever language the video is recorded in,
 // so the picker offers it back on the matching side.
 body: bodyLang === 'vi' ? value : '',
 bodyEn: bodyLang === 'en' ? value : null,
 contentType: project.type,
 });
 setSaveTemplateOpen(false);
 flash(t('templateSaved'));
 }}
 />

 {/* Transient confirmation. Deliberately not a global toast
     system — one string, one place, no extra dependency. */}
 {toast && (
 <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 h-10 inline-flex items-center gap-2 rounded-xl bg-darkcard border border-studio-500/30 shadow-lg text-sm text-text-primary">
 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
 {toast}
 </div>
 )}
 </div>
 );
}

// ─── Sub-components ──────────────────────────────────────────────

function ToolbarButton({
 icon: Icon,
 label,
 onClick,
}: {
 icon: React.ComponentType<{ className?: string }>;
 label: string;
 onClick: () => void;
}) {
 return (
 <button
 type="button"
 onClick={onClick}
 title={label}
 className="inline-flex items-center gap-1 h-7 px-2 rounded-md bg-bg-elevated/60 text-text-secondary text-[11px] font-semibold hover:text-text-primary hover:bg-bg-elevated/80 transition-colors"
 >
 <Icon className="w-3 h-3" />
 {label}
 </button>
 );
}

/**
 * Word budget against the project's target duration.
 *
 * Shows nothing but a hint when no target is set — an empty meter
 * would imply the script is 0% done rather than "not measured".
 */
function BudgetMeter({
 stats,
 targetSeconds,
 t,
}: {
 stats: ReturnType<typeof scriptStats>;
 targetSeconds: number | null;
 t: (key: StudioKey, vars?: Record<string, string | number>) => string;
}) {
 if (!targetSeconds || !stats.budget) {
 return (
 <div className="studio-glass rounded-2xl shadow-studio-card p-3">
 <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
 {t('wordBudget')}
 </p>
 <p className="text-[11px] text-text-muted italic leading-relaxed">
 {t('wordBudgetNoTarget')}
 </p>
 </div>
 );
 }

 const ratio = stats.budgetRatio ?? 0;
 const over = (stats.overBy ?? 0) > 0;
 // Clamp the fill so a 300%-over script doesn't paint outside the
 // track; the number underneath still tells the true story.
 const fill = Math.min(100, Math.round(ratio * 100));

 return (
 <div className="studio-glass rounded-2xl shadow-studio-card p-3">
 <div className="flex items-center gap-2 mb-2">
 <Timer className="w-3.5 h-3.5 text-studio-300" />
 <p className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
 {t('wordBudget')}
 </p>
 </div>
 <p className="text-xs text-text-primary mb-2">
 {t('wordBudgetOf', {
 used: stats.spokenWords.toLocaleString(),
 budget: stats.budget.toLocaleString(),
 min: Math.round(targetSeconds / 60),
 })}
 </p>
 <div className="h-1.5 rounded-full bg-bg-elevated/80 overflow-hidden mb-1.5">
 <div
 className={`h-full rounded-full transition-all ${
 over ? 'bg-rose-500' : ratio > 0.85 ? 'bg-amber-400' : 'bg-emerald-500'
 }`}
 style={{ width: `${fill}%` }}
 />
 </div>
 <p className={`text-[11px] ${over ? 'text-rose-300' : 'text-text-muted'}`}>
 {over
 ? t('wordBudgetOver', { n: stats.overBy ?? 0 })
 : t('wordBudgetUnder', { n: Math.abs(stats.overBy ?? 0) })}
 </p>
 </div>
 );
}

/**
 * Small one- or two-field modal.
 *
 * Replaces `window.prompt`, which cannot be styled, cannot show a
 * second field, and is blocked outright in some browsers when the
 * page is not focused.
 */
function PromptDialog({
 open,
 title,
 fieldLabel,
 placeholder,
 secondFieldLabel,
 secondPlaceholder,
 confirmLabel,
 cancelLabel,
 required,
 busy,
 onCancel,
 onConfirm,
}: {
 open: boolean;
 title: string;
 fieldLabel: string;
 placeholder: string;
 secondFieldLabel?: string;
 secondPlaceholder?: string;
 confirmLabel: string;
 cancelLabel: string;
 required?: boolean;
 busy?: boolean;
 onCancel: () => void;
 onConfirm: (value: string, second?: string) => void | Promise<void>;
}) {
 const [value, setValue] = useState('');
 const [second, setSecond] = useState('');

 // Reset on each open so a previous label never leaks into the
 // next snapshot.
 useEffect(() => {
 if (open) {
 setValue('');
 setSecond('');
 }
 }, [open]);

 if (!open) return null;

 const canConfirm = !busy && (!required || value.trim().length > 0);

 return (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
 onClick={onCancel}
 >
 <div
 onClick={(e) => e.stopPropagation()}
 className="w-full max-w-md rounded-2xl border border-studio-500/25 bg-darkcard shadow-2xl p-5"
 >
 <h3 className="font-heading text-base font-bold text-text-primary mb-4">{title}</h3>

 <label className="block text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
 {fieldLabel}
 </label>
 <input
 autoFocus
 value={value}
 onChange={(e) => setValue(e.target.value)}
 placeholder={placeholder}
 onKeyDown={(e) => {
 // Enter confirms only in the single-field case; with two
 // fields it would submit while the user is still tabbing.
 if (e.key === 'Enter' && !secondFieldLabel && canConfirm) {
 void onConfirm(value, second);
 }
 }}
 className="w-full h-10 px-3 rounded-lg bg-bg-elevated/60 border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50"
 />

 {secondFieldLabel && (
 <>
 <label className="block text-[11px] uppercase tracking-wider text-text-muted mt-3 mb-1.5">
 {secondFieldLabel}
 </label>
 <textarea
 value={second}
 onChange={(e) => setSecond(e.target.value)}
 placeholder={secondPlaceholder}
 rows={2}
 className="w-full px-3 py-2 rounded-lg bg-bg-elevated/60 border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50 resize-none"
 />
 </>
 )}

 <div className="flex items-center justify-end gap-2 mt-5">
 <button
 type="button"
 onClick={onCancel}
 className="px-3 h-9 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
 >
 {cancelLabel}
 </button>
 <button
 type="button"
 disabled={!canConfirm}
 onClick={() => void onConfirm(value, second)}
 className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-studio-gradient text-studio-950 font-semibold text-sm disabled:opacity-40"
 >
 <Save className="w-4 h-4" />
 {confirmLabel}
 </button>
 </div>
 </div>
 </div>
 );
}
