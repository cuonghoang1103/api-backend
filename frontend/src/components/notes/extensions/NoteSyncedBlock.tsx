'use client';

/**
 * NoteSyncedBlock — một khối nội dung xuất hiện ở nhiều trang, sửa một chỗ là
 * mọi chỗ đổi theo ("synced block" của Notion).
 *
 * ─── Nội dung nằm ở MÁY CHỦ, không nằm trong tài liệu ───
 * Node chỉ lưu `blockId`; chữ thật nằm trong bảng `note_synced_blocks`. Nếu
 * chép nội dung vào từng tài liệu thì hai bản lệch nhau ngay lần sửa đầu tiên,
 * và đó chính là thứ khối này sinh ra để tránh.
 *
 * ─── Ba cái bẫy đã tính tới ───
 *  1. ĐỆ QUY. Trình soạn thảo lồng bên trong KHÔNG đăng ký chính node này.
 *     Cho phép thì người dùng nhúng khối A vào chính A và giao diện dựng vô
 *     tận cho tới khi tab chết.
 *  2. HAI BẢN SAO TRÊN CÙNG MỘT TRANG. Gõ ở bản này thì bản kia phải đổi
 *     theo ngay, không đợi tải lại. Một bộ phát tin trong bộ nhớ (`listeners`)
 *     lo việc đó; không có nó, cùng một khối trên một màn hình hiện hai nội
 *     dung khác nhau và người dùng mất niềm tin vào cả tính năng.
 *  3. VÒNG LẶP GHI. Bản B nhận tin từ bản A rồi lại tự coi là "người dùng vừa
 *     gõ" và phát tin ngược lại. `applyingRemote` chặn vòng đó.
 *
 * Hình lưu: { type: "syncedBlock", attrs: { blockId: number|null } }
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { EditorContent, ReactNodeViewRenderer, NodeViewWrapper, useEditor, type NodeViewProps } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Loader2, RefreshCw, Trash2, Unlink } from 'lucide-react';
import { noteSyncedBlockApi } from '@/lib/api';

/** Chờ bấy nhiêu mili giây sau nhịp gõ cuối rồi mới ghi lên máy chủ. */
const SAVE_DEBOUNCE_MS = 800;

/**
 * Bộ phát tin giữa các bản sao của cùng một khối TRONG CÙNG MỘT TRANG.
 *
 * Phạm vi chỉ là tab hiện tại — đồng bộ giữa hai máy vẫn phải qua máy chủ.
 * Ở đây giải quyết đúng cái mà người dùng nhìn thấy ngay trước mắt.
 */
type Listener = (content: unknown) => void;
const listeners = new Map<number, Set<Listener>>();

function broadcast(blockId: number, content: unknown, except: Listener): void {
  const set = listeners.get(blockId);
  if (!set) return;
  for (const fn of set) if (fn !== except) fn(content);
}

function subscribe(blockId: number, fn: Listener): () => void {
  let set = listeners.get(blockId);
  if (!set) { set = new Set(); listeners.set(blockId, set); }
  set.add(fn);
  return () => {
    set!.delete(fn);
    if (set!.size === 0) listeners.delete(blockId);
  };
}

export const NoteSyncedBlock = Node.create({
  name: 'syncedBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      blockId: {
        default: null,
        parseHTML: (el: HTMLElement) => Number(el.getAttribute('data-block-id')) || null,
        renderHTML: (a) => (a.blockId ? { 'data-block-id': String(a.blockId) } : {}),
      },
    };
  },

  parseHTML() { return [{ tag: 'div[data-type="synced-block"]' }]; },
  renderHTML({ HTMLAttributes }) { return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'synced-block' })]; },
  addNodeView() { return ReactNodeViewRenderer(SyncedBlockView); },

  addCommands() {
    return {
      /** `blockId` rỗng = tạo khối mới; có số = nhúng khối đã tồn tại. */
      setSyncedBlock:
        (blockId?: number | null) =>
        ({ commands }: { commands: any }) =>
          commands.insertContent([
            { type: this.name, attrs: { blockId: blockId ?? null } },
            { type: 'paragraph' },
          ]),
    } as Partial<Record<string, (...args: any[]) => any>>;
  },
});

function SyncedBlockView({ node, updateAttributes, deleteNode, editor: outerEditor }: NodeViewProps) {
  const blockId = node.attrs.blockId as number | null;
  const canEdit = outerEditor.isEditable;

  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [saving, setSaving] = useState(false);

  /** Bật khi đang NẠP nội dung từ nơi khác vào, để không phát tin ngược lại. */
  const applyingRemote = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenerRef = useRef<Listener | null>(null);

  const inner = useEditor({
    immediatelyRender: false,
    editable: canEdit,
    // KHÔNG có NoteSyncedBlock ở đây — xem bẫy số 1 trong chú thích đầu tệp.
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, protocols: ['http', 'https', 'mailto'] }),
      TaskList.configure({ HTMLAttributes: { class: 'note-task-list' } }),
      TaskItem.configure({ nested: true, HTMLAttributes: { class: 'note-task-item' } }),
    ],
    editorProps: { attributes: { class: 'note-prose note-synced__prose focus:outline-none' } },
    onUpdate: ({ editor }) => {
      if (applyingRemote.current || !blockId) return;
      const content = editor.getJSON();
      if (listenerRef.current) broadcast(blockId, content, listenerRef.current);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        setSaving(true);
        noteSyncedBlockApi.update(blockId, content)
          .catch(() => setState('error'))
          .finally(() => setSaving(false));
      }, SAVE_DEBOUNCE_MS);
    },
  }, [blockId, canEdit]);

  /** Nạp nội dung vào trình soạn thảo lồng mà không kích hoạt lưu. */
  const applyContent = useCallback((content: unknown) => {
    if (!inner) return;
    applyingRemote.current = true;
    inner.commands.setContent((content ?? { type: 'doc', content: [{ type: 'paragraph' }] }) as never, false);
    // Nhả cờ ở nhịp sau: `setContent` phát `onUpdate` đồng bộ, nhả ngay tại
    // đây thì lượt phát đó vẫn bị coi là người dùng gõ.
    setTimeout(() => { applyingRemote.current = false; }, 0);
  }, [inner]);

  // Chưa có khối thì tạo. Chạy MỘT lần — `creating` chặn lần hai, vì
  // React 18 ở chế độ Strict chạy effect hai lượt và sẽ tạo hai bản ghi mồ côi.
  const creating = useRef(false);
  useEffect(() => {
    if (blockId !== null || creating.current || !canEdit) return;
    creating.current = true;
    noteSyncedBlockApi.create({ type: 'doc', content: [{ type: 'paragraph' }] })
      .then((res) => updateAttributes({ blockId: res.data.data.id }))
      .catch(() => setState('error'));
  }, [blockId, canEdit, updateAttributes]);

  // Nạp nội dung + lắng nghe các bản sao khác trên cùng trang.
  useEffect(() => {
    if (!blockId || !inner) return;
    let alive = true;

    const onRemote: Listener = (content) => { if (alive) applyContent(content); };
    listenerRef.current = onRemote;
    const unsubscribe = subscribe(blockId, onRemote);

    noteSyncedBlockApi.get(blockId)
      .then((res) => { if (!alive) return; applyContent(res.data.data.contentJson); setState('ready'); })
      .catch(() => { if (alive) setState('error'); });

    return () => {
      alive = false;
      unsubscribe();
      listenerRef.current = null;
      // Ghi nốt phần đang chờ trước khi khối biến mất — người dùng gõ xong rồi
      // chuyển trang ngay thì nhịp gõ cuối không được phép mất.
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        if (inner && canEdit) void noteSyncedBlockApi.update(blockId, inner.getJSON()).catch(() => {});
      }
    };
  }, [blockId, inner, canEdit, applyContent]);

  const reload = () => {
    if (!blockId) return;
    setState('loading');
    noteSyncedBlockApi.get(blockId)
      .then((res) => { applyContent(res.data.data.contentJson); setState('ready'); })
      .catch(() => setState('error'));
  };

  return (
    <NodeViewWrapper className="note-synced" data-type="synced-block">
      <div contentEditable={false} className="note-synced__bar">
        <Unlink size={12} aria-hidden />
        <span>Khối dùng chung{blockId ? ` #${blockId}` : ''}</span>
        {saving && <Loader2 size={11} className="note-spin" aria-hidden />}
        {state === 'error' && <span className="note-synced__err">lỗi đồng bộ</span>}
        <span className="note-synced__spacer" />
        <button type="button" onClick={reload} title="Tải lại nội dung" aria-label="Tải lại nội dung">
          <RefreshCw size={12} />
        </button>
        {canEdit && (
          /* "Gỡ khỏi trang này", KHÔNG phải "xoá". Nội dung vẫn còn ở các trang
             khác đang nhúng nó — nhãn phải nói đúng điều đó, nếu không người
             dùng tưởng mình vừa xoá mất và đi tìm lại. */
          <button type="button" onClick={deleteNode} title="Gỡ khỏi trang này" aria-label="Gỡ khỏi trang này">
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <div contentEditable={false} className="note-synced__body">
        {state === 'loading' && !inner
          ? <div className="note-synced__hint"><Loader2 size={13} className="note-spin" aria-hidden /> Đang tải…</div>
          : <EditorContent editor={inner} />}
      </div>
    </NodeViewWrapper>
  );
}

export default NoteSyncedBlock;
