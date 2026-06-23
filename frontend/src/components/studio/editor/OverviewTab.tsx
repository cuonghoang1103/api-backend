'use client';

// Editor Overview tab — the project's "cover page".
// All 14 form fields live here and the only thing the
// parent has to do is call `onChange` on every edit so
// the autosave hook can fire.
//
// Form state lives entirely in this component — the
// editor shell only owns the projectId and a callback
// for "user changed something" so the parent can also
// debounce + save.

import { useEffect, useState } from 'react';
import { Calendar, Hash, Link2, Sparkles, Tag as TagIcon, Type } from 'lucide-react';
import ThumbnailUploader from '@/components/admin/ThumbnailUploader';
import { CONTENT_STATUS_META, CONTENT_TYPE_META } from '@/lib/studio-meta';
import type {
 ContentProject,
 ContentReferenceLink,
 ContentStatus,
 ContentType,
} from '@/types';

interface OverviewTabProps {
 project: ContentProject;
 onChange: (patch: Partial<ContentProject>) => void;
}

export default function OverviewTab({ project, onChange }: OverviewTabProps) {
 const [tagDraft, setTagDraft] = useState('');
 const [linkDraft, setLinkDraft] = useState<{ label: string; url: string }>({
 label: '',
 url: '',
 });

 // Reset drafts when the project is reloaded (e.g. after
 // a save that returned a new server id).
 useEffect(() => {
 setTagDraft('');
 setLinkDraft({ label: '', url: '' });
 }, [project.id]);

 const update = <K extends keyof ContentProject>(key: K, value: ContentProject[K]) => {
 onChange({ [key]: value } as Partial<ContentProject>);
 };

 const setStatus = (s: ContentStatus) => update('status', s);
 const setType = (t: ContentType) => update('type', t);

 const addTag = () => {
 const t = tagDraft.trim().toLowerCase();
 if (!t) return;
 if (project.tags.includes(t)) {
 setTagDraft('');
 return;
 }
 update('tags', [...project.tags, t]);
 setTagDraft('');
 };

 const removeTag = (t: string) => {
 update('tags', project.tags.filter((x) => x !== t));
 };

 const setDate = (key: 'ideaDate' | 'filmDate' | 'publishDate', value: string) => {
 // The <input type="date"> returns "" when cleared. We
 // keep "" as null so the API clears the field.
 update(key, value === '' ? null : value);
 };

 const links = Array.isArray(project.referenceLinks) ? project.referenceLinks : [];
 const setLinks = (next: ContentReferenceLink[]) => update('referenceLinks', next);

 return (
 <div className="space-y-6">
 {/* Section: title + type + status */}
 <section className="rounded-2xl border border-darkborder bg-darkcard/60 p-5">
 <div className="flex items-center gap-2 mb-3">
 <Type className="w-4 h-4 text-studio-400" />
 <h2 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider">
 Identity
 </h2>
 </div>

 <label className="block">
 <span className="text-xs text-text-muted">Title</span>
 <input
 type="text"
 value={project.title}
 onChange={(e) => update('title', e.target.value)}
 className="mt-1 w-full px-3 py-2 rounded-lg bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50 focus:ring-2 focus:ring-studio-500/20"
 placeholder="Vlog hậu trường AI: tôi build production tool 30 ngày"
 />
 </label>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
 <div>
 <span className="text-xs text-text-muted block mb-1.5">Type</span>
 <div className="flex flex-wrap gap-1.5">
 {(Object.keys(CONTENT_TYPE_META) as ContentType[]).map((t) => (
 <button
 key={t}
 type="button"
 onClick={() => setType(t)}
 className={`inline-flex items-center gap-1 px-2.5 h-8 rounded-lg text-xs font-medium transition-colors ${
 project.type === t
 ? 'bg-studio-500/20 text-studio-300 ring-1 ring-studio-500/40'
 : 'bg-darkcard/60 text-text-secondary border border-darkborder hover:border-studio-500/30'
 }`}
 >
 <span>{CONTENT_TYPE_META[t].emoji}</span>
 {CONTENT_TYPE_META[t].label}
 </button>
 ))}
 </div>
 </div>

 <div>
 <span className="text-xs text-text-muted block mb-1.5">Status</span>
 <div className="flex flex-wrap gap-1.5">
 {(Object.keys(CONTENT_STATUS_META) as ContentStatus[]).map((s) => (
 <button
 key={s}
 type="button"
 onClick={() => setStatus(s)}
 className={`inline-flex items-center gap-1 px-2.5 h-8 rounded-lg text-xs font-semibold transition-colors ${
 project.status === s
 ? 'bg-studio-500/20 text-studio-300 ring-1 ring-studio-500/40'
 : 'bg-darkcard/60 text-text-secondary border border-darkborder hover:border-studio-500/30'
 }`}
 >
 <span
 className="w-1.5 h-1.5 rounded-full"
 style={{ background: CONTENT_STATUS_META[s].color }}
 />
 {CONTENT_STATUS_META[s].label}
 </button>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* Section: hook + concept */}
 <section className="rounded-2xl border border-darkborder bg-darkcard/60 p-5">
 <div className="flex items-center gap-2 mb-3">
 <Sparkles className="w-4 h-4 text-studio-400" />
 <h2 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider">
 The Pitch
 </h2>
 </div>

 <label className="block">
 <span className="text-xs text-text-muted">Main hook (1 sentence viewers see first)</span>
 <input
 type="text"
 value={project.mainHook ?? ''}
 onChange={(e) => update('mainHook', e.target.value)}
 className="mt-1 w-full px-3 py-2 rounded-lg bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50 focus:ring-2 focus:ring-studio-500/20"
 placeholder="Bạn có thấy việc build production tool chán không?"
 />
 </label>

 <label className="block mt-4">
 <span className="text-xs text-text-muted">Concept (full brief)</span>
 <textarea
 value={project.concept ?? ''}
 onChange={(e) => update('concept', e.target.value)}
 rows={5}
 className="mt-1 w-full px-3 py-2 rounded-lg bg-darkbg border border-darkborder text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50 focus:ring-2 focus:ring-studio-500/20 resize-y"
 placeholder="30 ngày, 1 production tool, 0 framework AI hype. Tôi sẽ ghi lại từng commit, từng bug, từng decision..."
 />
 </label>
 </section>

 {/* Section: dates */}
 <section className="rounded-2xl border border-darkborder bg-darkcard/60 p-5">
 <div className="flex items-center gap-2 mb-3">
 <Calendar className="w-4 h-4 text-studio-400" />
 <h2 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider">
 Timeline
 </h2>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 <DateField
 label="Idea date"
 value={project.ideaDate}
 onChange={(v) => setDate('ideaDate', v)}
 />
 <DateField
 label="Film date"
 value={project.filmDate}
 onChange={(v) => setDate('filmDate', v)}
 />
 <DateField
 label="Publish date"
 value={project.publishDate}
 onChange={(v) => setDate('publishDate', v)}
 />
 </div>
 </section>

 {/* Section: tags + thumbnail + refs */}
 <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 <div className="rounded-2xl border border-darkborder bg-darkcard/60 p-5">
 <div className="flex items-center gap-2 mb-3">
 <Hash className="w-4 h-4 text-studio-400" />
 <h2 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider">
 Tags
 </h2>
 </div>
 <div className="flex flex-wrap gap-1.5 mb-2">
 {project.tags.length === 0 ? (
 <p className="text-xs text-text-muted italic">No tags yet</p>
 ) : (
 project.tags.map((t) => (
 <span
 key={t}
 className="inline-flex items-center gap-1 px-2 h-6 rounded-full bg-studio-500/10 text-studio-300 text-[11px] font-semibold border border-studio-500/20"
 >
 #{t}
 <button
 type="button"
 onClick={() => removeTag(t)}
 className="ml-0.5 text-studio-300/60 hover:text-studio-200"
 aria-label={`Remove ${t}`}
 >
 ×
 </button>
 </span>
 ))
 )}
 </div>
 <div className="flex gap-2">
 <input
 type="text"
 value={tagDraft}
 onChange={(e) => setTagDraft(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter') {
 e.preventDefault();
 addTag();
 }
 }}
 placeholder="Add tag…"
 className="flex-1 px-3 h-9 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50"
 />
 <button
 type="button"
 onClick={addTag}
 className="px-3 h-9 rounded-lg bg-studio-500/20 text-studio-300 text-sm font-medium hover:bg-studio-500/30 transition-colors"
 >
 Add
 </button>
 </div>
 </div>

 <div className="rounded-2xl border border-darkborder bg-darkcard/60 p-5">
 <div className="flex items-center gap-2 mb-3">
 <TagIcon className="w-4 h-4 text-studio-400" />
 <h2 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider">
 Thumbnail
 </h2>
 </div>
 <ThumbnailUploader
 value={project.thumbnailUrl ?? ''}
 onChange={(url) => update('thumbnailUrl', url)}
 label="Project thumbnail"
 />
 </div>
 </section>

 {/* Section: reference links */}
 <section className="rounded-2xl border border-darkborder bg-darkcard/60 p-5">
 <div className="flex items-center gap-2 mb-3">
 <Link2 className="w-4 h-4 text-studio-400" />
 <h2 className="font-heading text-sm font-semibold text-text-primary uppercase tracking-wider">
 Reference links
 </h2>
 </div>

 <ul className="space-y-1.5 mb-3">
 {links.length === 0 ? (
 <li className="text-xs text-text-muted italic">No links yet</li>
 ) : (
 links.map((l, i) => (
 <li
 key={`${l.url}-${i}`}
 className="flex items-center gap-2 p-2 rounded-lg bg-darkbg/40 border border-darkborder"
 >
 <span className="text-xs text-text-primary font-medium min-w-0 truncate flex-1">
 {l.label}
 </span>
 <a
 href={l.url}
 target="_blank"
 rel="noopener noreferrer"
 className="text-[11px] text-studio-300 hover:text-studio-200 truncate max-w-[200px]"
 >
 {l.url}
 </a>
 <button
 type="button"
 onClick={() => setLinks(links.filter((_, j) => j !== i))}
 className="text-red-400/70 hover:text-red-300 text-xs"
 aria-label="Remove link"
 >
 ×
 </button>
 </li>
 ))
 )}
 </ul>

 <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2">
 <input
 type="text"
 value={linkDraft.label}
 onChange={(e) => setLinkDraft({ ...linkDraft, label: e.target.value })}
 placeholder="Label"
 className="px-3 h-9 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50"
 />
 <input
 type="url"
 value={linkDraft.url}
 onChange={(e) => setLinkDraft({ ...linkDraft, url: e.target.value })}
 placeholder="https://…"
 className="px-3 h-9 rounded-lg bg-darkbg border border-darkborder text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50"
 />
 <button
 type="button"
 onClick={() => {
 if (!linkDraft.url.trim()) return;
 setLinks([
 ...links,
 { label: linkDraft.label.trim() || linkDraft.url, url: linkDraft.url.trim() },
 ]);
 setLinkDraft({ label: '', url: '' });
 }}
 className="px-3 h-9 rounded-lg bg-studio-500/20 text-studio-300 text-sm font-medium hover:bg-studio-500/30 transition-colors"
 >
 Add
 </button>
 </div>
 </section>
 </div>
 );
}

function DateField({
 label,
 value,
 onChange,
}: {
 label: string;
 value: string | null;
 onChange: (v: string) => void;
}) {
 return (
 <label className="block">
 <span className="text-xs text-text-muted">{label}</span>
 <input
 type="date"
 value={value ? value.split('T')[0] : ''}
 onChange={(e) => onChange(e.target.value)}
 className="mt-1 w-full px-3 py-2 rounded-lg bg-darkbg border border-darkborder text-text-primary focus:outline-none focus:border-studio-500/50 focus:ring-2 focus:ring-studio-500/20"
 />
 </label>
 );
}
