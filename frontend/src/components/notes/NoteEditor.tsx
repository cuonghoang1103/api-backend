'use client';

// NoteEditor — Notion-like rich editor (TipTap) for a single note.
// Phase 1 scope: StarterKit blocks (headings, lists, blockquote,
// code, hr), placeholder, image paste + drag-drop upload, and a
// debounced auto-save that persists BOTH contentJson and a cached
// contentHtml. A "saved / saving" indicator reflects status.
//
// Calm-study design: comfortable reading width, generous line
// height, one restrained teal accent. Heavy effects are avoided
// on purpose (this is a daily-use tool, not a showcase).

import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { fileApi } from '@/lib/api';
import type { NoteFull } from '@/types';
import { Check, Loader2, CloudOff } from 'lucide-react';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface NoteEditorProps {
  note: NoteFull;
  /** Persist a partial update. Should be idempotent on the server. */
  onSave: (patch: Partial<{ title: string; contentJson: Record<string, unknown> | null; contentHtml: string | null }>) => Promise<void>;
}

const AUTOSAVE_MS = 900;

export default function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  // Track the note id so switching notes resets local state instead
  // of bleeding one note's title/content into another.
  const noteIdRef = useRef(note.id);

  // ─── Debounced save ────────────────────────────────────────
  const queueSave = useCallback(
    (patch: Partial<{ title: string; contentJson: Record<string, unknown> | null; contentHtml: string | null }>) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaveState('saving');
      saveTimer.current = setTimeout(async () => {
        try {
          await onSave(patch);
          setSaveState('saved');
        } catch {
          setSaveState('error');
        }
      }, AUTOSAVE_MS);
    },
    [onSave],
  );

  // ─── Image upload (paste + drop) ───────────────────────────
  const uploadAndInsert = useCallback(async (editor: Editor, file: File) => {
    try {
      const res = await fileApi.upload(file, 'images');
      const url = (res.data as { data?: { url?: string } })?.data?.url;
      if (url) {
        // Insert the image AND a trailing empty paragraph, then put
        // the caret in that paragraph. A bare block image left as the
        // last node traps the cursor on a NodeSelection — you can't
        // type or paste again. The paragraph gives the caret a home.
        editor
          .chain()
          .focus()
          .insertContent([
            { type: 'image', attrs: { src: url, alt: file.name } },
            { type: 'paragraph' },
          ])
          .focus()
          .run();
      }
    } catch {
      // Silent: a failed paste shouldn't break typing. The image
      // simply isn't inserted; the user can retry.
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: 'Bắt đầu viết… (dán ảnh trực tiếp như Notion)' }),
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { class: 'note-img', loading: 'lazy' } }),
    ],
    content: note.contentJson ?? '',
    editorProps: {
      attributes: {
        class: 'note-prose focus:outline-none',
        spellcheck: 'false',
      },
      handlePaste(view, event) {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'));
        if (files.length && editor) {
          event.preventDefault();
          files.forEach((f) => void uploadAndInsert(editor, f));
          return true;
        }
        return false;
      },
      handleDrop(view, event) {
        const files = Array.from((event as DragEvent).dataTransfer?.files ?? []).filter((f) => f.type.startsWith('image/'));
        if (files.length && editor) {
          event.preventDefault();
          files.forEach((f) => void uploadAndInsert(editor, f));
          return true;
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      queueSave({ contentJson: editor.getJSON() as Record<string, unknown>, contentHtml: editor.getHTML() });
    },
  });

  // When the selected note changes, reset title + editor content.
  useEffect(() => {
    if (noteIdRef.current !== note.id) {
      noteIdRef.current = note.id;
      setTitle(note.title);
      setSaveState('idle');
      editor?.commands.setContent(note.contentJson ?? '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id]);

  // Reflect an external rename (e.g. from the sidebar) in the title
  // input — but never while the user is editing the title here, so
  // we don't fight their caret.
  useEffect(() => {
    if (noteIdRef.current === note.id && document.activeElement !== titleRef.current) {
      setTitle(note.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.title]);

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 sm:px-6 py-6">
      {/* Save status */}
      <div className="mb-3 flex h-5 items-center gap-1.5 text-[11px] text-slate-500">
        {saveState === 'saving' && (<><Loader2 className="h-3 w-3 animate-spin" /> Đang lưu…</>)}
        {saveState === 'saved' && (<><Check className="h-3 w-3 text-teal-400" /> Đã lưu</>)}
        {saveState === 'error' && (<span className="flex items-center gap-1.5 text-amber-400"><CloudOff className="h-3 w-3" /> Lưu thất bại — sẽ thử lại khi bạn gõ tiếp</span>)}
      </div>

      {/* Title */}
      <input
        ref={titleRef}
        value={title}
        onChange={(e) => { setTitle(e.target.value); queueSave({ title: e.target.value }); }}
        placeholder="Tiêu đề ghi chú"
        // text-base (16px) avoids iOS focus auto-zoom on mobile.
        className="w-full bg-transparent text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100 placeholder:text-slate-600 focus:outline-none"
      />

      <div className="my-4 h-px w-full bg-white/[0.06]" />

      {/* Body */}
      <EditorContent editor={editor} />
    </div>
  );
}
