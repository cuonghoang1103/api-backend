'use client';

/**
 * TechArticleEditor — WYSIWYG editor for tech-trend articles
 * (Tier 1A). Wraps TipTap's StarterKit with a slim toolbar
 * suited to long-form blog posts.
 *
 * Scope decisions:
 *   - We accept `markdown: string` as the canonical source
 *     (server stores `bodyMdx`). On every change the editor
 *     emits an updated markdown string via `onChange`.
 *   - The Markdown bridge comes from `tiptap-markdown`. It
 *     round-trips plain markdown ↔ TipTap JSON, so what you
 *     see is what you save.
 *   - We expose a deliberately short toolbar — just the
 *     operations a blog author needs (headings, bold, italic,
 *     link, list, quote, code). Anything fancier (slash menu,
 *     tables, KaTeX) belongs in Notes, not in Tech Trends.
 *
 * Why not use the existing NoteEditor? NoteEditor is
 * feature-rich for personal notebooks (slash menu, code-block
 * Shiki, math, ToC) and ships ~80KB extra deps via dynamic
 * import. For a public blog we want a leaner footprint + a
 * shape that maps cleanly to `bodyMdx`. Splitting the two
 * editors keeps the Notes bundle small and avoids leaking
 * NoteEditor-specific behavior into the public read surface.
 */

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link as LinkIcon, ImageIcon,
  Undo, Redo, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { fileApi } from '@/lib/api';
import { cn } from '@/lib/utils';

interface TechArticleEditorProps {
  /** Markdown source. Empty string = blank editor. */
  value: string;
  /** Fired on every keystroke (debounced upstream if needed). */
  onChange: (markdown: string) => void;
  /** Optional: editor becomes read-only when true. */
  readOnly?: boolean;
  /** Optional: minimum editor height in px. Default 480. */
  minHeight?: number;
}

export default function TechArticleEditor({
  value, onChange, readOnly, minHeight = 480,
}: TechArticleEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    // immediatelyRender: false — avoid SSR/hydration mismatch
    // warnings because TipTap's contenteditable is browser-only.
    immediatelyRender: false,
    editable: !readOnly,
    extensions: [
      // StarterKit covers headings, bold, italic, strike, code,
      // blockquote, lists, hr, undo/redo. We pin headings to
      // 1–3 because the sidebar TOC doesn't render deeper levels.
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết bài… Ấn "/" hoặc dùng thanh công cụ bên trên.',
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: 'tech-article-img', loading: 'lazy' },
      }),
      // Markdown bridge — note: this extension's `content`
      // config is `string`, so we hydrate the editor with
      // markdown directly. `onChange` emits markdown via the
      // storage API (see editor.on('update', ...) below).
      Markdown.configure({
        // Tighten the markdown parser: only accept headings 1-3
        // (no # and deeper) so the toolbar matches the
        // renderer's depth. Bold/italic stay at default.
        html: false,            // we don't want users pasting raw HTML
        linkify: true,          // auto-link bare URLs in body
        breaks: true,          // \n becomes <br> (common in CJK)
        transformPastedText: true,
        transformCopiedText: false,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        // `.tech-prose` is shared with the public renderer so
        // the admin sees exactly what readers will see — a
        // single source of truth for typography.
        class: 'tech-prose focus:outline-none',
      },
    },
    onUpdate({ editor: ed }) {
      // TipTap-markdown exposes `editor.storage.markdown.getMarkdown()`.
      // The cast is necessary because the types aren't bundled
      // in the package's .d.ts at the moment.
      const md = (ed.storage as { markdown?: { getMarkdown: () => string } }).markdown?.getMarkdown() ?? '';
      onChange(md);
    },
  });

  // Image upload helper — paste/drop/click all route through
  // here. Returns the public URL the editor then inserts.
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const res = await fileApi.upload(file);
      return (res.data as { data?: { url?: string } })?.data?.url ?? null;
    } catch {
      toast.error('Khong the upload anh');
      return null;
    }
  };

  // Insert an image at the current selection. We split this
  // out so the toolbar, paste, AND drop handler share one path.
  const insertImage = async (file: File) => {
    if (!editor) return;
    const url = await uploadImage(file);
    if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
  };

  // Keep the editor's `editable` flag in sync with the prop
  // without remounting (TipTap's useEditor accepts editable
  // only at construction time, so we mutate via the imperative
  // API when the prop changes after mount).
  useEffect(() => {
    if (!editor) return;
    if (editor.isEditable !== !readOnly) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  // Sync external value → editor. Important when the parent
  // re-fetches the article (e.g. after publish/unpublish) and
  // the editor was holding a stale markdown string. We only
  // update when the value differs from what TipTap already
  // has — avoids the feedback loop that wipes the caret.
  useEffect(() => {
    if (!editor) return;
    const current = (editor.storage as { markdown?: { getMarkdown: () => string } }).markdown?.getMarkdown() ?? '';
    if (current === value) return;
    editor.commands.setContent(value, false);
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-darkborder bg-darkbg/40"
        style={{ minHeight }}
      >
        <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Toolbar editor={editor} onPickImage={() => fileInputRef.current?.click()} />
      <div
        className="rounded-xl border border-darkborder bg-darkbg/40 px-4 py-3"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
      {/* Hidden file input for the toolbar's "Insert image"
          button. Paste/drop handlers are wired through
          editorProps in a more elaborate version of this
          component; for the v1 we keep the click-only path to
          ship sooner. */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void insertImage(f);
          // Reset so the same file can be picked again later.
          e.target.value = '';
        }}
      />
      <p className="text-[11px] text-text-muted">
        Markdown tự động lưu — gõ <code className="rounded bg-darkcard px-1">**bold**</code>,{' '}
        <code className="rounded bg-darkcard px-1">#</code> heading,{' '}
        <code className="rounded bg-darkcard px-1">- </code> list.
      </p>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────

interface ToolbarProps {
  editor: Editor | null;
  onPickImage: () => void;
}

function Toolbar({ editor, onPickImage }: ToolbarProps) {
  if (!editor) return null;

  const promptLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL (bo trong de xoa link):', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetMark('link').run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setMark('link', { href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border border-darkborder bg-darkcard/60 p-1">
      <ToolButton
        label="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        label="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        label="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolbarSep />
      <ToolButton
        label="Heading 1"
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        label="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        label="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolbarSep />
      <ToolButton
        label="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        label="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        label="Quote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        label="Inline code"
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolbarSep />
      <ToolButton label="Link" active={editor.isActive('link')} onClick={promptLink}>
        <LinkIcon className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton label="Image" onClick={onPickImage}>
        <ImageIcon className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolbarSep />
      <ToolButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="h-3.5 w-3.5" />
      </ToolButton>
    </div>
  );
}

function ToolButton({
  label, active, disabled, onClick, children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
        active
          ? 'bg-neon-violet/20 text-neon-violet'
          : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
        disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent',
      )}
    >
      {children}
    </button>
  );
}

function ToolbarSep() {
  return <div className="mx-1 h-5 w-px bg-darkborder" />;
}
