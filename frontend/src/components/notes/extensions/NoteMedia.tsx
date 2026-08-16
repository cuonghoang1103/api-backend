'use client';

/**
 * NoteMedia — khối VIDEO và khối FILE ĐÍNH KÈM.
 *
 * Gộp hai loại vào một node vì chúng giống nhau ở mọi chỗ quan trọng: cùng đi
 * qua một luồng tải lên R2, cùng lưu một bộ thuộc tính (địa chỉ, tên, cỡ,
 * kiểu MIME), cùng cần một chỗ hiện lỗi khi tải hỏng. Khác nhau đúng một
 * điểm — vẽ ra `<video>` hay vẽ ra một thẻ tải về. Tách thành hai node sẽ
 * nhân đôi phần khung mà không tách được gì có thật.
 *
 * Node là ATOM (không chứa nội dung con): người dùng không gõ chữ vào trong
 * một file đính kèm, và cho nó nhận con sẽ tạo ra chỗ để con trỏ mắc kẹt.
 *
 * Hình lưu: { type: "media", attrs: { kind, src, name, size, mime, poster } }
 */
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { FileText, Download, Trash2, AlertCircle } from 'lucide-react';

export type MediaKind = 'video' | 'file';

/** Đổi số byte thành chuỗi người đọc được. */
function humanSize(bytes: number | null): string {
  if (!bytes || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) { value /= 1024; i += 1; }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export const NoteMedia = Node.create({
  name: 'media',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      kind:   { default: 'file' as MediaKind, parseHTML: (el: HTMLElement) => el.getAttribute('data-kind') ?? 'file', renderHTML: (a) => ({ 'data-kind': a.kind }) },
      src:    { default: '',   parseHTML: (el: HTMLElement) => el.getAttribute('data-src') ?? '',   renderHTML: (a) => ({ 'data-src': a.src }) },
      name:   { default: '',   parseHTML: (el: HTMLElement) => el.getAttribute('data-name') ?? '',  renderHTML: (a) => ({ 'data-name': a.name }) },
      size:   { default: null, parseHTML: (el: HTMLElement) => Number(el.getAttribute('data-size')) || null, renderHTML: (a) => (a.size ? { 'data-size': String(a.size) } : {}) },
      mime:   { default: '',   parseHTML: (el: HTMLElement) => el.getAttribute('data-mime') ?? '',  renderHTML: (a) => ({ 'data-mime': a.mime }) },
      poster: { default: '',   parseHTML: (el: HTMLElement) => el.getAttribute('data-poster') ?? '', renderHTML: (a) => ({ 'data-poster': a.poster }) },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="media"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'media' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaView);
  },

  addCommands() {
    return {
      setMedia:
        (attrs: { kind: MediaKind; src: string; name?: string; size?: number | null; mime?: string; poster?: string }) =>
        ({ commands }: { commands: any }) =>
          commands.insertContent({ type: this.name, attrs }),
    } as Partial<Record<string, (...args: any[]) => any>>;
  },
});

function MediaView({ node, deleteNode, editor }: NodeViewProps) {
  const { kind, src, name, size, mime, poster } = node.attrs as {
    kind: MediaKind; src: string; name: string; size: number | null; mime: string; poster: string;
  };
  const editable = editor.isEditable;

  // Chưa có địa chỉ = lần tải lên đã hỏng. Hiện rõ ra thay vì vẽ một ô trống:
  // một khối rỗng im lặng trông y hệt một khối đang tải, và người dùng sẽ ngồi
  // đợi mãi một thứ không bao giờ tới.
  if (!src) {
    return (
      <NodeViewWrapper className="note-media note-media--broken" data-type="media">
        <AlertCircle size={16} aria-hidden />
        <span>Tệp chưa tải lên được{name ? ` — ${name}` : ''}</span>
        {editable && (
          <button type="button" onClick={deleteNode} title="Xoá khối" aria-label="Xoá khối">
            <Trash2 size={14} />
          </button>
        )}
      </NodeViewWrapper>
    );
  }

  if (kind === 'video') {
    return (
      <NodeViewWrapper className="note-media note-media--video" data-type="media">
        {/* `contentEditable={false}` để phím Space chạy vào trình phát chứ
            không chèn dấu cách vào tài liệu. */}
        <div contentEditable={false}>
          <video src={src} poster={poster || undefined} controls preload="metadata" />
        </div>
        {editable && (
          <button type="button" className="note-media__del" onClick={deleteNode} title="Xoá video" aria-label="Xoá video">
            <Trash2 size={14} />
          </button>
        )}
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="note-media note-media--file" data-type="media">
      <a href={src} target="_blank" rel="noopener noreferrer" contentEditable={false} download={name || undefined}>
        <FileText size={18} aria-hidden />
        <span className="note-media__name">{name || 'Tệp đính kèm'}</span>
        <span className="note-media__meta">{[humanSize(size), mime].filter(Boolean).join(' · ')}</span>
        <Download size={14} aria-hidden />
      </a>
      {editable && (
        <button type="button" className="note-media__del" onClick={deleteNode} title="Xoá tệp" aria-label="Xoá tệp">
          <Trash2 size={14} />
        </button>
      )}
    </NodeViewWrapper>
  );
}

export default NoteMedia;
