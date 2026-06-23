'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
 Bold,
 Italic,
 Heading1,
 Heading2,
 Heading3,
 List,
 ListOrdered,
 Link2,
 Code,
 Quote,
 Lightbulb,
 Image as ImageIcon,
 Maximize2,
 Minimize2,
 Eye,
 Pencil,
} from 'lucide-react';
import { toast } from 'sonner';
import { fileApi } from '@/lib/api';
import MarkdownRenderer from '@/components/projects/MarkdownRenderer';

interface MarkdownEditorProps {
 value: string;
 onChange: (v: string) => void;
 placeholder?: string;
 /** Min textarea height. Default 320. */
 minHeight?: number;
 /** Disable the editor (read-only). */
 disabled?: boolean;
}

/**
 * MarkdownEditor — split-pane Markdown editor with toolbar
 * and live preview. The toolbar inserts snippets at the
 * textarea's selection (with sensible fallbacks for empty
 * selections: bold → **bold**, h1 → "# Heading", etc).
 *
 * Preview uses the same MarkdownRenderer component the
 * public detail page uses, so what the admin sees is what
 * the visitor gets. Callout syntax (:::tip, :::note,
 * :::warning, :::danger) works out-of-the-box.
 *
 * Image upload uses the project's existing fileApi.upload
 * helper (R2 backed), which returns a public URL we can
 * drop straight into an `![](url)` snippet.
 */
export default function MarkdownEditor({
 value,
 onChange,
 placeholder,
 minHeight = 320,
 disabled = false,
}: MarkdownEditorProps) {
 const textareaRef = useRef<HTMLTextAreaElement>(null);
 const [view, setView] = useState<'edit' | 'split' | 'preview'>('split');
 const [uploading, setUploading] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 // Auto-resize the textarea as the user types. Keeps the
 // caret position stable by leaving scrollTop alone.
 useEffect(() => {
 const ta = textareaRef.current;
 if (!ta) return;
 ta.style.height = 'auto';
 ta.style.height = `${Math.max(minHeight, ta.scrollHeight)}px`;
 }, [value, minHeight]);

 const insert = useCallback(
 (before: string, after = '', placeholderText = '') => {
 const ta = textareaRef.current;
 if (!ta) return;
 const start = ta.selectionStart;
 const end = ta.selectionEnd;
 const selected = ta.value.substring(start, end) || placeholderText;
 const next = ta.value.substring(0, start) + before + selected + after + ta.value.substring(end);
 onChange(next);
 // Restore caret position after the inserted snippet.
 const newPos = start + before.length + selected.length;
 requestAnimationFrame(() => {
 ta.focus();
 ta.setSelectionRange(newPos, newPos);
 });
 },
 [onChange],
 );

 const wrap = (left: string, right: string, sample: string) => {
 insert(left, right, sample);
 };

 const onImageUpload = useCallback(
 async (file: File) => {
 setUploading(true);
 try {
 const res = await fileApi.upload(file, 'projects');
 const url = res.data?.data?.url as string | undefined;
 if (url) {
 insert(`![${file.name.replace(/\.[^.]+$/, '')}](${url})`, '', '');
 } else {
 toast.error('Upload thất bại');
 }
 } catch (err: unknown) {
 toast.error(
 (err as { response?: { data?: { message?: string } } })?.response?.data?.message
 ?? 'Upload thất bại',
 );
 } finally {
 setUploading(false);
 if (fileInputRef.current) fileInputRef.current.value = '';
 }
 },
 [insert],
 );

 const onPaste = useCallback(
 (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
 const items = e.clipboardData?.items;
 if (!items) return;
 for (const it of Array.from(items)) {
 if (it.type.startsWith('image/')) {
 const file = it.getAsFile();
 if (file) {
 e.preventDefault();
 onImageUpload(file);
 return;
 }
 }
 }
 },
 [onImageUpload],
 );

 const onDrop = useCallback(
 (e: React.DragEvent<HTMLTextAreaElement>) => {
 e.preventDefault();
 const file = e.dataTransfer.files?.[0];
 if (file && file.type.startsWith('image/')) {
 onImageUpload(file);
 }
 },
 [onImageUpload],
 );

 return (
 <div className="rounded-xl border border-darkborder bg-darkcard overflow-hidden">
 {/* Toolbar */}
 <div className="flex items-center gap-1 px-3 py-2 border-b border-darkborder bg-darkbg/40 flex-wrap">
 <ToolbarButton onClick={() => wrap('**', '**', 'bold')} title="Bold (Ctrl+B)" disabled={disabled}>
 <Bold className="w-4 h-4" />
 </ToolbarButton>
 <ToolbarButton onClick={() => wrap('*', '*', 'italic')} title="Italic" disabled={disabled}>
 <Italic className="w-4 h-4" />
 </ToolbarButton>
 <span className="w-px h-5 bg-darkborder mx-1" />
 <ToolbarButton onClick={() => insert('\n## ', '', 'Heading')} title="Heading 2" disabled={disabled}>
 <Heading1 className="w-4 h-4" />
 </ToolbarButton>
 <ToolbarButton onClick={() => insert('\n### ', '', 'Subheading')} title="Heading 3" disabled={disabled}>
 <Heading2 className="w-4 h-4" />
 </ToolbarButton>
 <ToolbarButton onClick={() => insert('\n#### ', '', 'Minor')} title="Heading 4" disabled={disabled}>
 <Heading3 className="w-4 h-4" />
 </ToolbarButton>
 <span className="w-px h-5 bg-darkborder mx-1" />
 <ToolbarButton onClick={() => insert('\n- ', '', 'item')} title="Bullet list" disabled={disabled}>
 <List className="w-4 h-4" />
 </ToolbarButton>
 <ToolbarButton onClick={() => insert('\n1. ', '', 'item')} title="Numbered list" disabled={disabled}>
 <ListOrdered className="w-4 h-4" />
 </ToolbarButton>
 <ToolbarButton onClick={() => insert('\n> ', '', 'quote')} title="Blockquote" disabled={disabled}>
 <Quote className="w-4 h-4" />
 </ToolbarButton>
 <span className="w-px h-5 bg-darkborder mx-1" />
 <ToolbarButton onClick={() => wrap('`', '`', 'code')} title="Inline code" disabled={disabled}>
 <Code className="w-4 h-4" />
 </ToolbarButton>
 <ToolbarButton onClick={() => insert('\n```\n', '\n```\n', 'language-ts')} title="Code block" disabled={disabled}>
 <span className="text-[10px] font-mono px-1">{'</>'}</span>
 </ToolbarButton>
 <ToolbarButton onClick={() => insert('[', '](https://)', 'text')} title="Link" disabled={disabled}>
 <Link2 className="w-4 h-4" />
 </ToolbarButton>
 <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Upload image" disabled={disabled || uploading}>
 <ImageIcon className={`w-4 h-4 ${uploading ? 'animate-pulse' : ''}`} />
 </ToolbarButton>
 <input
 ref={fileInputRef}
 type="file"
 accept="image/*"
 className="hidden"
 onChange={(e) => {
 const f = e.target.files?.[0];
 if (f) onImageUpload(f);
 }}
 />
 <span className="w-px h-5 bg-darkborder mx-1" />
 <ToolbarButton
 onClick={() => insert('\n\n:::tip[Tên tiêu đề]\n', '\n:::\n\n', 'Nội dung tip...')}
 title="Tip callout"
 disabled={disabled}
 >
 <Lightbulb className="w-4 h-4 text-emerald-400" />
 </ToolbarButton>

 <div className="ml-auto flex items-center gap-1">
 <ViewToggle view={view} onChange={setView} />
 </div>
 </div>

 {/* Editor + Preview */}
 <div className={`grid ${view === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
 {(view === 'edit' || view === 'split') && (
 <div className={view === 'split' ? 'border-r border-darkborder' : ''}>
 <textarea
 ref={textareaRef}
 value={value}
 onChange={(e) => onChange(e.target.value)}
 onPaste={onPaste}
 onDrop={onDrop}
 placeholder={placeholder ?? 'Viết nội dung case study bằng Markdown...'}
 disabled={disabled}
 spellCheck={false}
 className="w-full bg-transparent px-4 py-3 text-sm text-text-primary font-mono leading-relaxed resize-none focus:outline-none placeholder:text-text-muted disabled:opacity-60"
 style={{ minHeight }}
 />
 </div>
 )}
 {(view === 'preview' || view === 'split') && (
 <div className="px-5 py-4 max-h-[600px] overflow-y-auto bg-[#0f0a1e]/40">
 {value.trim() ? (
 <MarkdownRenderer mdx={value} openLinksInNewTab={false} />
 ) : (
 <p className="text-sm text-text-muted italic">Preview sẽ hiển thị ở đây...</p>
 )}
 </div>
 )}
 </div>

 {/* Hint footer */}
 <div className="px-4 py-1.5 text-[10px] text-text-muted border-t border-darkborder flex items-center justify-between flex-wrap gap-2">
 <span>
 Hỗ trợ: <code className="text-neon-violet">**bold**</code>, <code className="text-neon-violet">*italic*</code>, <code className="text-neon-violet">## heading</code>, <code className="text-neon-violet">- list</code>, <code className="text-neon-violet">```code```</code>, <code className="text-neon-violet">:::tip[Title] … :::</code>
 </span>
 <span>{value.length} ký tự</span>
 </div>
 </div>
 );
}

// ────────────────────────────────────────────────────────────────────────
// Toolbar bits
// ────────────────────────────────────────────────────────────────────────

function ToolbarButton({
 children,
 onClick,
 title,
 disabled,
}: {
 children: React.ReactNode;
 onClick: () => void;
 title?: string;
 disabled?: boolean;
}) {
 return (
 <button
 type="button"
 onClick={onClick}
 disabled={disabled}
 title={title}
 className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
 >
 {children}
 </button>
 );
}

function ViewToggle({
 view,
 onChange,
}: {
 view: 'edit' | 'split' | 'preview';
 onChange: (v: 'edit' | 'split' | 'preview') => void;
}) {
 const items: { value: typeof view; icon: typeof Pencil; label: string }[] = [
 { value: 'edit', icon: Pencil, label: 'Chỉ soạn' },
 { value: 'split', icon: Maximize2, label: 'Song song' },
 { value: 'preview', icon: Eye, label: 'Chỉ xem' },
 ];
 return (
 <div className="flex bg-darkbg/60 rounded-lg p-0.5 border border-darkborder">
 {items.map(({ value, icon: Icon, label }) => (
 <button
 key={value}
 type="button"
 onClick={() => onChange(value)}
 title={label}
 className={`px-2 py-1 rounded-md transition-colors ${
 view === value
 ? 'bg-neon-violet/20 text-neon-violet'
 : 'text-text-muted hover:text-text-primary'
 }`}
 >
 <Icon className="w-3.5 h-3.5" />
 </button>
 ))}
 </div>
 );
}