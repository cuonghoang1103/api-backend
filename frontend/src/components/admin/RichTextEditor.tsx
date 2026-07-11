'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  Heading1, Heading2, Heading3, Heading4,
  Link2, List, ListOrdered, Quote, Code, Code2,
  Minus, Palette, Type, ChevronDown, Image as ImageIcon, Loader2,
} from 'lucide-react';
import { fileApi } from '@/lib/api';
import { stripInlineColors } from '@/lib/utils';
import { toast } from 'sonner';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

// ─── Toolbar action types ────────────────────────────────────────────────────
//
// The editor is a controlled <contenteditable> div. Each toolbar
// button calls `document.execCommand` (yes, deprecated, but it's
// the only API that works on a contenteditable element in a
// cross-browser way without dragging in a 200 kB library).
// `execCommand` is fine for our use case — we save the produced
// HTML into state on every input event, so we don't have to
// worry about its lack of undo-stack fidelity.
//
// The output of this editor is HTML stored verbatim in the
// Lesson.content / LessonDetail.teachingNotes columns. It is
// sanitized on the /learn page via DOMPurify
// (see lib/utils.ts → sanitizeHtml).
// ────────────────────────────────────────────────────────────────────────────

const FONT_SIZES = [
  { label: 'Nhỏ', value: '1' },
  { label: 'Bình thường', value: '3' },
  { label: 'Lớn', value: '5' },
  { label: 'Rất lớn', value: '7' },
];

const TEXT_COLORS = [
  '#f8fafc', '#94a3b8', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        // Prevent the contenteditable from losing focus when
        // clicking a toolbar button.
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? 'bg-neon-violet/20 text-neon-violet'
          : 'text-text-muted hover:text-text-primary hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-darkborder/60 mx-1" />;
}

function ColorSwatch({
  color,
  onPick,
  active,
}: {
  color: string;
  onPick: (color: string) => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onPick(color);
      }}
      title={color}
      className={`w-4 h-4 rounded border transition-transform ${
        active ? 'scale-125 border-white' : 'border-darkborder hover:scale-110'
      }`}
      style={{ backgroundColor: color }}
    />
  );
}

function ColorPicker({ onPick, onClose }: { onPick: (c: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClose]);
  return (
    <div
      ref={ref}
      className="absolute z-10 top-full mt-1 left-0 p-2 rounded-lg bg-darkcard border border-darkborder shadow-xl flex gap-1.5"
    >
      {TEXT_COLORS.map((c) => (
        <ColorSwatch key={c} color={c} onPick={(color) => { onPick(color); onClose(); }} />
      ))}
    </div>
  );
}

function FontSizeSelect({ onPick }: { onPick: (size: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        title="Cỡ chữ"
        className="flex items-center gap-1 px-1.5 py-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 text-xs font-medium"
      >
        <Type className="w-3.5 h-3.5" />
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div
          className="absolute z-10 top-full mt-1 left-0 min-w-[120px] rounded-lg bg-darkcard border border-darkborder shadow-xl py-1"
          onMouseDown={(e) => e.preventDefault()}
        >
          {FONT_SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => { onPick(s.value); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5 hover:text-text-primary"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = 240 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef<string>(value || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [, force] = useState(0);

  // Sync the `value` prop into the contenteditable whenever it changes
  // FROM OUTSIDE — e.g. the admin builder fetching a saved lesson AFTER
  // this component mounted (that async load previously never appeared,
  // so re-editing looked like the notes were lost). We skip the write
  // while the user is actively editing (activeElement === el) so we never
  // fight their cursor; their own edits flow out via onInput instead.
  const [uploadingImg, setUploadingImg] = useState(false);
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (document.activeElement === el) return; // don't clobber active typing
    // Strip baked-in inline colours so OLD notes (pasted with dark source
    // colours before the paste-strip fix) become readable on our dark UI.
    const incoming = stripInlineColors(value || '');
    if (incoming !== el.innerHTML) {
      el.innerHTML = incoming;
      lastHtmlRef.current = incoming;
    }
  }, [value]);

  const exec = useCallback((command: string, valueArg?: string) => {
    // execCommand is deprecated but still universally supported,
    // and is the simplest way to get bold/italic/heading/etc.
    // working on a contenteditable without pulling in a heavy
    // editor framework.
    document.execCommand(command, false, valueArg);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastHtmlRef.current = html;
      onChange(html);
    }
    force((n) => n + 1); // refresh active-state highlighting
  }, [onChange]);

  const insertHtml = useCallback((html: string) => {
    document.execCommand('insertHTML', false, html);
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      lastHtmlRef.current = newHtml;
      onChange(newHtml);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastHtmlRef.current = html;
      onChange(html);
    }
  }, [onChange]);

  // Upload an image to R2 and insert it at the cursor. Used by BOTH the
  // toolbar button and pasting a screenshot straight into the editor.
  const uploadAndInsertImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Ảnh tối đa 10MB'); return; }
    setUploadingImg(true);
    try {
      const res = await fileApi.upload(file, 'images');
      const url = res.data?.data?.url as string | undefined;
      if (!url) { toast.error('Tải ảnh thất bại'); return; }
      editorRef.current?.focus();
      insertHtml(`<img src="${url}" alt="" style="max-width:100%;border-radius:8px" /><p><br></p>`);
    } catch {
      toast.error('Tải ảnh thất bại');
    } finally {
      setUploadingImg(false);
    }
  }, [insertHtml]);

  const pickImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => { const f = input.files?.[0]; if (f) uploadAndInsertImage(f); };
    input.click();
  }, [uploadAndInsertImage]);

  // ── Paste: keep formatting, but strip any image the user
  // might be trying to upload (we don't host external images
  // in lesson content for security/perf reasons) and any
  // style attributes that aren't `color` (the rest are reset
  // to keep the editor output clean and small).
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    // 1) Screenshot / image paste → upload to R2 and insert it.
    const imageFile = Array.from(e.clipboardData.items || [])
      .find((it) => it.kind === 'file' && it.type.startsWith('image/'))
      ?.getAsFile();
    if (imageFile) {
      e.preventDefault();
      uploadAndInsertImage(imageFile);
      return;
    }
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    if (!html) {
      // Plain-text fallback: insert as a single paragraph, line
      // breaks preserved. Don't bother with execCommand here —
      // insertText collapses \n which we don't want.
      const escaped = text
        .split('\n')
        .map((l) => `<p>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`)
        .join('');
      insertHtml(escaped);
      return;
    }
    // Sanitize the pasted HTML — strip <img>, <script>, event
    // handlers, and any style attribute that isn't color. We
    // delegate to the browser's DOMParser so we get a real DOM
    // tree to walk rather than regex.
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('img, script, style, iframe, object, embed').forEach((n) => n.remove());
    doc.querySelectorAll('*').forEach((el) => {
      // Strip ALL inline styles — including `color`. Pasting from Word /
      // Docs / a website carries the SOURCE text color (usually dark),
      // which is invisible on our dark editor + dark lesson page. Text now
      // inherits the theme colour (always readable); use the toolbar's
      // colour picker to set a deliberate, visible colour instead.
      if ((el as HTMLElement).getAttribute('style')) {
        el.removeAttribute('style');
      }
      // Strip every attribute except href (a), src (a/img), class
      // (we use it for the .tok-* token classes), and style (handled
      // above).
      const tag = el.tagName.toLowerCase();
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        const value = attr.value;
        if (name === 'href' && tag === 'a') continue;
        if (name === 'src' && (tag === 'a' || tag === 'img')) continue;
        if (name === 'class' && /^(tok-|hljs-)/.test(value)) continue;
        if (name === 'style') continue;
        el.removeAttribute(attr.name);
      }
      // Make every external link open in a new tab.
      if (tag === 'a') {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    });
    insertHtml(doc.body.innerHTML);
  }, [insertHtml, uploadAndInsertImage]);

  const insertLink = useCallback(() => {
    const url = window.prompt('URL:');
    if (!url) return;
    exec('createLink', url);
  }, [exec]);

  const insertCodeBlock = useCallback(() => {
    const lang = window.prompt('Ngôn ngữ (vd: javascript, python, cpp):', 'javascript') || 'javascript';
    const html = `<pre data-language="${lang}"><code>${'&#10;'}// paste hoặc viết code ở đây${'&#10;'}</code></pre><p><br></p>`;
    insertHtml(html);
  }, [insertHtml]);

  return (
    <div
      className="rounded-xl overflow-hidden border transition-colors"
      style={{
        borderColor: 'rgba(168,85,247,0.2)',
        background: 'rgba(15,10,30,0.5)',
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-0.5 px-3 py-2 border-b flex-wrap"
        style={{ borderColor: 'rgba(168,85,247,0.15)' }}
      >
        <ToolbarButton onClick={() => exec('formatBlock', '<h1>')} title="Tiêu đề 1">
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', '<h2>')} title="Tiêu đề 2">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', '<h3>')} title="Tiêu đề 3">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', '<h4>')} title="Tiêu đề 4">
          <Heading4 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', '<p>')} title="Đoạn văn">
          <span className="text-[10px] font-bold w-4 h-4 flex items-center justify-center">P</span>
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton onClick={() => exec('bold')} title="In đậm (Cmd+B)">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('italic')} title="In nghiêng (Cmd+I)">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('underline')} title="Gạch chân (Cmd+U)">
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('strikeThrough')} title="Gạch ngang">
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton onClick={() => exec('insertUnorderedList')} title="Danh sách">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('insertOrderedList')} title="Danh sách số">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', '<blockquote>')} title="Trích dẫn">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton onClick={insertLink} title="Chèn link">
          <Link2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={pickImage} title="Chèn ảnh (hoặc dán ảnh trực tiếp)">
          {uploadingImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', '<pre>')} title="Code inline">
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={insertCodeBlock} title="Khối code (VSCode style)">
          <Code2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('insertHorizontalRule')} title="Đường kẻ ngang">
          <Minus className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <FontSizeSelect onPick={(size) => exec('fontSize', size)} />
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowColorPicker((v) => !v)}
            title="Màu chữ"
          >
            <Palette className="w-4 h-4" />
          </ToolbarButton>
          {showColorPicker && (
            <ColorPicker
              onPick={(color) => exec('foreColor', color)}
              onClose={() => setShowColorPicker(false)}
            />
          )}
        </div>
      </div>

      {/* Editor body */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder ?? 'Viết nội dung ở đây... Có thể paste từ VSCode/Google Docs/Word — định dạng được giữ nguyên.'}
        className="rich-content px-4 py-3 text-sm text-text-primary outline-none overflow-y-auto"
        style={{
          minHeight,
          maxHeight: 600,
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          lineHeight: 1.7,
        }}
      />
      <style jsx>{`
        /* Placeholder when the editor is empty. Browsers don't
         * have a native ::placeholder for contenteditable so we
         * toggle this via the :empty pseudo-class. */
        div[contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: rgba(148, 163, 184, 0.5);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
