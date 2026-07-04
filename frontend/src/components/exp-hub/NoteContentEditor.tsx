'use client';

// NoteContentEditor — the rich-text editor used for EXP_Hub NOTE records.
//
// Emits HTML (via editor.getHTML()) so the public page can render it with a
// plain `dangerouslySetInnerHTML` + `.prose` — the same path already used for
// a snippet's `explanation`. Images can be pasted, dropped, or picked; each
// one is uploaded to R2 through the shared `fileApi.upload` endpoint and the
// returned URL is inserted inline.

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Heading2, List, ListOrdered, Quote, Code2, ImageIcon, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { fileApi } from '@/lib/api';

interface NoteContentEditorProps {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
}

export default function NoteContentEditor({ value, onChange, minHeight = 320 }: NoteContentEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadingRef = useRef(0);
  const [uploading, setUploading] = useState(0);

  const editor = useEditor({
    // SSR guard — TipTap must render only on the client (Next App Router).
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: 'Viết ghi chú… (dán ảnh trực tiếp được)' }),
    ],
    content: value,
    editorProps: {
      attributes: { class: 'prose prose-invert max-w-none min-h-[16rem] focus:outline-none prose-img:rounded-lg prose-img:border prose-img:border-white/10' },
      handlePaste(_view, event) {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'));
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach((f) => void insertImage(f));
        return true;
      },
      handleDrop(_view, event) {
        const files = Array.from((event as DragEvent).dataTransfer?.files ?? []).filter((f) => f.type.startsWith('image/'));
        if (files.length === 0) return false;
        event.preventDefault();
        files.forEach((f) => void insertImage(f));
        return true;
      },
    },
    onUpdate({ editor: ed }) {
      onChange(ed.getHTML());
    },
  });

  const insertImage = async (file: File) => {
    if (!editor) return;
    uploadingRef.current += 1;
    setUploading(uploadingRef.current);
    try {
      const res = await fileApi.upload(file, 'images');
      const url = (res.data as { data?: { url?: string } })?.data?.url;
      if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      else toast.error('Không lấy được URL ảnh');
    } catch {
      toast.error('Không upload được ảnh');
    } finally {
      uploadingRef.current = Math.max(0, uploadingRef.current - 1);
      setUploading(uploadingRef.current);
    }
  };

  // Sync external value → editor when the parent loads a different note.
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === value) return;
    editor.commands.setContent(value || '', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) {
    return <div className="rounded-lg border border-white/10 bg-white/5" style={{ minHeight }} />;
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5">
      <Toolbar editor={editor} onPickImage={() => fileInputRef.current?.click()} uploading={uploading > 0} />
      <div className="px-3 py-3 overflow-y-auto" style={{ minHeight, maxHeight: 520 }}>
        <EditorContent editor={editor} />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void insertImage(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function Toolbar({ editor, onPickImage, uploading }: { editor: Editor; onPickImage: () => void; uploading: boolean }) {
  const btn = (active: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded transition-colors ${
      active ? 'bg-violet-500/25 text-violet-200' : 'text-slate-400 hover:bg-white/10 hover:text-white'
    }`;
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-white/10 px-2 py-1.5">
      <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} title="Đậm"><Bold className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Nghiêng"><Italic className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Tiêu đề"><Heading2 className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Danh sách"><List className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Danh sách số"><ListOrdered className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Trích dẫn"><Quote className="h-4 w-4" /></button>
      <button type="button" className={btn(editor.isActive('codeBlock'))} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Khối code"><Code2 className="h-4 w-4" /></button>
      <span className="mx-1 h-5 w-px bg-white/10" />
      <button type="button" className={btn(false)} onClick={onPickImage} title="Chèn ảnh">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}
