'use client';

/**
 * NoteToggle — khối thu gọn được, như "toggle list" của Notion.
 *
 * ─── Vì sao tiêu đề KHÔNG phải một thuộc tính ───
 * Cách hiển nhiên là để tiêu đề trong `attrs.summary` rồi vẽ một ô nhập chữ.
 * Làm thế thì tiêu đề mất hết định dạng: không in đậm, không link, không mã,
 * không công thức — trong khi đó chính là chỗ người ta hay bôi đậm nhất.
 *
 * Ở đây tiêu đề là KHỐI CON ĐẦU TIÊN, còn lại là thân. Thu gọn làm hoàn toàn
 * bằng CSS (ẩn mọi con trừ con đầu). Nhờ vậy tiêu đề là rich text đầy đủ, và
 * trạng thái đóng/mở không đụng gì tới nội dung — đóng lại rồi mở ra thì
 * không có gì để mất.
 *
 * Hình lưu: { type: "toggle", attrs: { open: bool }, content: [block, ...] }
 */
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react';
import { ChevronRight } from 'lucide-react';

export const NoteToggle = Node.create({
  name: 'toggle',
  group: 'block',
  defining: true,
  content: 'block+',

  addAttributes() {
    return {
      open: {
        default: true,
        parseHTML: (el) => el.getAttribute('data-open') !== 'false',
        renderHTML: (attrs) => ({ 'data-open': attrs.open ? 'true' : 'false' }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="toggle"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'toggle' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ToggleView);
  },

  addCommands() {
    return {
      setToggle:
        () =>
        ({ commands }: { commands: any }) =>
          commands.wrapIn(this.name),
    } as Partial<Record<string, (...args: any[]) => any>>;
  },
});

function ToggleView({ node, updateAttributes, editor }: NodeViewProps) {
  const open = node.attrs.open !== false;
  return (
    <NodeViewWrapper
      as="div"
      data-type="toggle"
      data-open={open ? 'true' : 'false'}
      className="note-toggle"
    >
      {/* `contentEditable={false}` là BẮT BUỘC trên mũi tên: thiếu nó,
          ProseMirror coi nút bấm là một phần tài liệu, con trỏ nhảy được vào
          giữa nó và mọi phím gõ tiếp theo rơi ra ngoài nội dung. */}
      <button
        type="button"
        contentEditable={false}
        className="note-toggle__arrow"
        aria-expanded={open}
        aria-label={open ? 'Thu gọn' : 'Mở rộng'}
        title={open ? 'Thu gọn' : 'Mở rộng'}
        onClick={() => updateAttributes({ open: !open })}
        // Không cho ProseMirror giành lại tiêu điểm rồi cuộn trang về con trỏ
        // ngay lúc bấm — nếu không, mỗi lần thu gọn là một lần trang nhảy.
        onMouseDown={(e) => e.preventDefault()}
      >
        <ChevronRight size={14} />
      </button>
      <NodeViewContent className="note-toggle__body" />
      {!open && editor.isEditable && (
        <button
          type="button"
          contentEditable={false}
          className="note-toggle__peek"
          onClick={() => updateAttributes({ open: true })}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Số khối bị giấu — thu gọn mà không nói giấu bao nhiêu thì người
              dùng không biết bên trong còn gì, và dễ tưởng mình đã xoá mất. */}
          {node.childCount - 1} khối bên trong
        </button>
      )}
    </NodeViewWrapper>
  );
}

export default NoteToggle;
