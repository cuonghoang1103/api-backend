'use client';

/**
 * NoteDatabaseBlock — nhúng một database vào giữa trang ghi chú.
 *
 * ─── Nhúng THAM CHIẾU, không nhúng bản sao ───
 * Khối chỉ lưu `databaseId`. Dữ liệu vẫn nằm ở database gốc, và `NoteDatabaseTable`
 * tự nạp lấy. Nghĩa là sửa ở trang này thì trang kia thấy ngay, xoá dòng ở đây là
 * xoá thật — đúng như Notion, nơi "database nhúng" là một CỬA SỔ nhìn vào cùng một
 * bảng chứ không phải một bản chép.
 *
 * Lưu bản sao nội dung vào tài liệu sẽ dễ hơn nhiều nhưng sai ngay từ đầu: hai chỗ
 * cùng một bảng lập tức lệch nhau, và người dùng không có cách nào biết bản nào
 * đúng.
 *
 * ─── Vì sao dùng lại `NoteDatabaseTable` chứ không vẽ lại ───
 * Component đó đã tự nạp, tự sửa ô, tự thêm/xoá dòng và cột. Vẽ lại một bảng gọn
 * hơn cho khối nhúng nghĩa là nuôi hai bảng: mỗi kiểu thuộc tính mới phải làm hai
 * lần, và bảng nhúng sẽ lặng lẽ tụt lại phía sau.
 *
 * Hình lưu: { type: "databaseBlock", attrs: { databaseId: number|null } }
 */
import { useEffect, useState } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Database, Loader2, Plus, Trash2 } from 'lucide-react';
import { noteDatabaseApi, type NoteDatabaseSummary } from '@/lib/api';
import NoteDatabaseTable from '@/components/notes/NoteDatabaseTable';

export interface DatabaseBlockOptions {
  /**
   * Môn học của ghi chú đang mở — dùng để liệt kê database chọn được và để
   * tạo database mới đúng chỗ. `null` khi editor dựng ngoài ngữ cảnh một ghi
   * chú (ví dụ bản xem trước); khi đó khối chỉ hiện, không cho chọn.
   */
  getSubjectId: () => number | null;
}

export const NoteDatabaseBlock = Node.create<DatabaseBlockOptions>({
  name: 'databaseBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return { getSubjectId: () => null };
  },

  addAttributes() {
    return {
      databaseId: {
        default: null,
        parseHTML: (el: HTMLElement) => Number(el.getAttribute('data-database-id')) || null,
        renderHTML: (a) => (a.databaseId ? { 'data-database-id': String(a.databaseId) } : {}),
      },
    };
  },

  parseHTML() { return [{ tag: 'div[data-type="database-block"]' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'database-block' })]; },
  addNodeView() { return ReactNodeViewRenderer(DatabaseBlockView); },

  addCommands() {
    return {
      setDatabaseBlock:
        (databaseId?: number | null) =>
        ({ commands }: { commands: any }) =>
          commands.insertContent([
            { type: this.name, attrs: { databaseId: databaseId ?? null } },
            // Đoạn rỗng theo sau: một khối atom nằm cuối tài liệu khoá con trỏ
            // vào NodeSelection và người dùng không gõ tiếp được.
            { type: 'paragraph' },
          ]),
    } as Partial<Record<string, (...args: any[]) => any>>;
  },
});

function DatabaseBlockView({ node, updateAttributes, deleteNode, editor, extension }: NodeViewProps) {
  const databaseId = node.attrs.databaseId as number | null;
  const canEdit = editor.isEditable;
  const subjectId = (extension.options as DatabaseBlockOptions).getSubjectId();

  if (databaseId) {
    return (
      <NodeViewWrapper className="note-dbblock" data-type="database-block">
        <div contentEditable={false}>
          <NoteDatabaseTable
            databaseId={databaseId}
            canEdit={canEdit}
            /* Database bị xoá ở nơi khác: gỡ tham chiếu chứ KHÔNG xoá khối.
             * Xoá khối là lặng lẽ lấy đi một dòng người dùng đã đặt vào trang;
             * để lại ô chọn thì họ thấy chỗ đó từng có gì và chọn lại được. */
            onDeleted={() => updateAttributes({ databaseId: null })}
          />
        </div>
        {canEdit && (
          <button type="button" className="note-dbblock__del" onClick={deleteNode} title="Gỡ khối khỏi trang" aria-label="Gỡ khối khỏi trang">
            <Trash2 size={14} />
          </button>
        )}
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="note-dbblock note-dbblock--empty" data-type="database-block">
      <DatabasePicker
        subjectId={subjectId}
        canEdit={canEdit}
        onPick={(id) => updateAttributes({ databaseId: id })}
        onRemove={deleteNode}
      />
    </NodeViewWrapper>
  );
}

function DatabasePicker({
  subjectId, canEdit, onPick, onRemove,
}: {
  subjectId: number | null;
  canEdit: boolean;
  onPick: (id: number) => void;
  onRemove: () => void;
}) {
  const [list, setList] = useState<NoteDatabaseSummary[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (subjectId === null) { setList([]); return; }
    let alive = true;
    noteDatabaseApi.listBySubject(subjectId)
      .then((res) => { if (alive) setList(res.data.data); })
      .catch(() => { if (alive) setList([]); });
    return () => { alive = false; };
  }, [subjectId]);

  const createNew = async () => {
    if (subjectId === null || busy) return;
    setBusy(true);
    try {
      const res = await noteDatabaseApi.create({ subjectId, title: 'Bảng mới' });
      onPick(res.data.data.id);
    } catch {
      setBusy(false);
    }
  };

  return (
    <div contentEditable={false} className="note-dbblock__picker">
      <div className="note-dbblock__head">
        <Database size={15} aria-hidden />
        <span>Chọn bảng để nhúng</span>
        {canEdit && (
          <button type="button" onClick={onRemove} className="note-dbblock__x" title="Bỏ khối" aria-label="Bỏ khối">
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {list === null ? (
        <div className="note-dbblock__hint"><Loader2 size={13} className="note-spin" aria-hidden /> Đang tải danh sách…</div>
      ) : (
        <>
          {list.length > 0 ? (
            <div className="note-dbblock__list">
              {list.map((d) => (
                <button key={d.id} type="button" onClick={() => onPick(d.id)} className="note-dbblock__item">
                  <span>{d.icon ?? '🗂️'}</span>
                  <span className="note-dbblock__item-title">{d.title}</span>
                  <span className="note-dbblock__item-meta">{d._count?.rows ?? 0} dòng</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="note-dbblock__hint">
              {subjectId === null ? 'Không xác định được môn của ghi chú này.' : 'Môn này chưa có bảng nào.'}
            </div>
          )}
          {canEdit && subjectId !== null && (
            <button type="button" onClick={() => void createNew()} disabled={busy} className="note-dbblock__new">
              {busy ? <Loader2 size={13} className="note-spin" aria-hidden /> : <Plus size={13} aria-hidden />}
              Tạo bảng mới
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default NoteDatabaseBlock;
