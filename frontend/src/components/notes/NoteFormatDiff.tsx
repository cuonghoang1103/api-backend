'use client';

/**
 * "✨ Sắp xếp lại trang này" — màn so sánh "Bản cũ | Bản mới".
 *
 * ─── Chưa bấm Giữ thì ghi chú KHÔNG đổi một byte ───
 * Màn này chỉ ĐỌC editor (lấy JSON gửi đi, lấy schema để kiểm kết quả). Mọi
 * thứ AI trả về nằm trong state của màn này; ghi chú chỉ đổi khi người dùng
 * bấm "Giữ bản mới", và khi ấy việc ghi là của `onGiu` ở NoteEditor — đi qua
 * đúng đường lưu của editor (REST autosave hoặc Y.Doc cộng tác).
 *
 * ─── Vì sao xem trước bằng TipTap chỉ-đọc, không bằng HTML ───
 * Ảnh, video, bookmark, khối code… chỉ hiện đúng qua NodeView của chúng. Dựng
 * HTML rồi `dangerouslySetInnerHTML` thì mấy khối đó thành `<div>` rỗng — người
 * dùng thấy "AI làm mất ảnh" trong khi ảnh vẫn nằm đó. Xem trước phải là đúng
 * thứ họ sẽ nhận.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import { AlertTriangle, Check, Loader2, RotateCcw, Sparkles, Undo2, X } from 'lucide-react';
import NoteCodeBlock from '@/components/notes/extensions/NoteCodeBlock';
import NoteCallout from '@/components/notes/extensions/NoteCallout';
import NoteMath from '@/components/notes/extensions/NoteMath';
import NoteToggle from '@/components/notes/extensions/NoteToggle';
import NoteMedia from '@/components/notes/extensions/NoteMedia';
import NoteBookmark from '@/components/notes/extensions/NoteBookmark';
import NoteEmbed from '@/components/notes/extensions/NoteEmbed';
import NoteDatabaseBlock from '@/components/notes/extensions/NoteDatabaseBlock';
import NoteSyncedBlock from '@/components/notes/extensions/NoteSyncedBlock';
import { notesApi, type NoteSapXepResult } from '@/lib/api';

type Doc = Record<string, unknown>;

/** Bản xem trước chỉ-đọc, cùng bộ khối với editor thật (trừ cộng tác, tay cầm kéo). */
function XemTruoc({ doc, subjectId }: { doc: Doc; subjectId: number | null }) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false, history: false }),
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { class: 'note-img', loading: 'lazy' } }),
      NoteCodeBlock,
      NoteCallout,
      NoteMath,
      NoteToggle,
      NoteMedia,
      NoteBookmark,
      NoteEmbed,
      NoteDatabaseBlock.configure({ getSubjectId: () => subjectId }),
      NoteSyncedBlock,
      TaskList.configure({ HTMLAttributes: { class: 'note-task-list' } }),
      TaskItem.configure({ nested: true, HTMLAttributes: { class: 'note-task-item' } }),
      Table.configure({ resizable: false, HTMLAttributes: { class: 'note-table' } }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({ openOnClick: true, protocols: ['http', 'https', 'mailto'], HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' } }),
    ],
    content: doc,
    editorProps: { attributes: { class: 'note-prose focus:outline-none' } },
  });
  return <EditorContent editor={editor} />;
}

type TrangThai =
  | { loai: 'dang-chay'; kyTu: number }
  | { loai: 'loi'; thongBao: string }
  | { loai: 'xong'; kq: NoteSapXepResult };

export default function NoteFormatDiff({
  editor,
  noteId,
  subjectId,
  onGiu,
  onDong,
}: {
  /** Editor thật — chỉ để ĐỌC nội dung hiện tại và lấy schema kiểm kết quả. */
  editor: Editor;
  noteId: number;
  subjectId: number | null;
  /** Áp bản mới. Chỉ gọi khi người dùng bấm Giữ. */
  onGiu: (docMoi: Doc, docCu: Doc) => Promise<void>;
  onDong: () => void;
}) {
  // Bản gốc chụp ĐÚNG lúc gửi đi — cột trái so với cái này, và lúc bấm Giữ ta
  // so lại để biết trang có bị gõ thêm trong lúc chờ AI không.
  const [docCu, setDocCu] = useState<Doc>(() => editor.getJSON() as Doc);
  const [trangThai, setTrangThai] = useState<TrangThai>({ loai: 'dang-chay', kyTu: 0 });
  const [giay, setGiay] = useState(0);
  const [tab, setTab] = useState<'cu' | 'moi'>('moi');
  const [dangGiu, setDangGiu] = useState(false);
  /** Trang đã đổi kể từ lúc gửi — bấm Giữ lần nữa nghĩa là chấp nhận ghi đè. */
  const [doiRoi, setDoiRoi] = useState(false);
  const [luot, setLuot] = useState(0);
  const huyRef = useRef<AbortController | null>(null);

  const chay = useCallback(() => {
    huyRef.current?.abort();
    const ctl = new AbortController();
    huyRef.current = ctl;
    const goc = editor.getJSON() as Doc;
    setDocCu(goc);
    setDoiRoi(false);
    setGiay(0);
    setTrangThai({ loai: 'dang-chay', kyTu: 0 });
    setLuot((n) => n + 1);
    notesApi.aiSapXep(noteId, goc, {
      signal: ctl.signal,
      onProgress: (kyTu) => setTrangThai((s) => (s.loai === 'dang-chay' ? { loai: 'dang-chay', kyTu } : s)),
    })
      .then((kq) => {
        if (ctl.signal.aborted) return;
        // Kiểm bằng CHÍNH schema của editor trước khi cho xem: JSON sai schema
        // thì TipTap lặng lẽ thay bằng trang trống — tức "Giữ" sẽ xoá sạch trang.
        try {
          editor.schema.nodeFromJSON(kq.doc).check();
        } catch (e) {
          setTrangThai({ loai: 'loi', thongBao: `Kết quả AI không hợp lệ với trình soạn thảo (${(e as Error).message}). Trang giữ nguyên.` });
          return;
        }
        setTrangThai({ loai: 'xong', kq });
      })
      .catch((e: unknown) => {
        if (ctl.signal.aborted) return;
        setTrangThai({ loai: 'loi', thongBao: (e as Error)?.message || 'AI chưa sắp xếp được trang.' });
      });
  }, [editor, noteId]);

  // Chạy một lần khi mở. Đóng màn giữa chừng thì huỷ luồng — không để một lời
  // gọi mồ côi tiếp tục đốt hạn mức.
  useEffect(() => {
    chay();
    return () => huyRef.current?.abort();
  }, [chay]);

  useEffect(() => {
    if (trangThai.loai !== 'dang-chay') return;
    const t = setInterval(() => setGiay((g) => g + 1), 1000);
    return () => clearInterval(t);
  }, [trangThai.loai]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !dangGiu) onDong(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dangGiu, onDong]);

  const giu = async () => {
    if (trangThai.loai !== 'xong' || dangGiu) return;
    const hienTai = JSON.stringify(editor.getJSON());
    if (!doiRoi && hienTai !== JSON.stringify(docCu)) { setDoiRoi(true); return; }
    setDangGiu(true);
    try {
      // Luôn lấy bản HIỆN TẠI làm "bản cũ" để khôi phục: nếu người dùng chọn ghi
      // đè thì thứ họ mất là bản hiện tại, không phải bản lúc gửi đi.
      await onGiu(trangThai.kq.doc, JSON.parse(hienTai) as Doc);
      onDong();
    } finally {
      setDangGiu(false);
    }
  };

  const tk = trangThai.loai === 'xong' ? trangThai.kq.thongKe : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-stretch justify-center bg-black/50 p-0 sm:p-4" role="dialog" aria-modal="true" aria-label="Sắp xếp lại trang bằng AI">
      <div className="flex h-full w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-950 sm:rounded-xl sm:border sm:border-slate-200 sm:dark:border-white/[0.08]">
        {/* Đầu */}
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
          <Sparkles className="h-4 w-4 text-violet-500" aria-hidden />
          <h2 className="flex-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Sắp xếp lại trang</h2>
          {tk && (
            <span className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:inline">
              {[tk.muc && `${tk.muc} mục`, tk.bang && `${tk.bang} bảng`, tk.khoiCode && `${tk.khoiCode} khối code`].filter(Boolean).join(' · ')}
            </span>
          )}
          <button type="button" onClick={onDong} disabled={dangGiu} aria-label="Đóng" className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-white/[0.06]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {trangThai.loai === 'dang-chay' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-violet-500 motion-reduce:animate-none" aria-hidden />
            <p className="text-sm text-slate-700 dark:text-slate-200" aria-live="polite">
              {trangThai.kyTu > 0
                ? `AI đang viết lại… ${trangThai.kyTu.toLocaleString('vi-VN')} ký tự`
                : 'AI đang đọc trang…'}
            </p>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              {giay}s · Trang của bạn chưa bị đổi gì. Trang dài có thể mất 1–2 phút.
            </p>
            <button type="button" onClick={onDong} className="mt-2 rounded-md border border-slate-300 px-3 py-1.5 text-[12px] text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]">
              Huỷ
            </button>
          </div>
        )}

        {trangThai.loai === 'loi' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertTriangle className="h-6 w-6 text-amber-500" aria-hidden />
            <p className="max-w-md text-sm text-slate-700 dark:text-slate-200">{trangThai.thongBao}</p>
            <div className="flex gap-2">
              <button type="button" onClick={chay} className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-violet-700">
                <RotateCcw className="h-3.5 w-3.5" /> Thử lại
              </button>
              <button type="button" onClick={onDong} className="rounded-md border border-slate-300 px-3 py-1.5 text-[12px] text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]">
                Đóng
              </button>
            </div>
          </div>
        )}

        {trangThai.loai === 'xong' && (
          <>
            {(trangThai.kq.canhBao.length > 0 || doiRoi) && (
              <div className="space-y-1 border-b border-amber-300/50 bg-amber-50 px-4 py-2 text-[12px] text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                {doiRoi && (
                  <p className="flex gap-1.5 font-medium">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    Trang vừa thay đổi kể từ lúc gửi cho AI (bạn hoặc người cùng sửa gõ thêm). Giữ bản mới sẽ bỏ các thay đổi đó — bấm &quot;Vẫn giữ&quot; nếu chắc, hoặc &quot;Chạy lại&quot;.
                  </p>
                )}
                {trangThai.kq.canhBao.map((c) => (
                  <p key={c} className="flex gap-1.5">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> {c}
                  </p>
                ))}
              </div>
            )}

            {/* Điện thoại: tab chuyển. Màn rộng: hai cột. */}
            <div className="flex border-b border-slate-200 text-[12px] dark:border-white/[0.08] md:hidden" role="tablist">
              {([['cu', 'Bản cũ'], ['moi', 'Bản mới']] as const).map(([k, nhan]) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={`flex-1 py-2 font-medium ${tab === k ? 'border-b-2 border-violet-500 text-violet-700 dark:text-violet-300' : 'text-slate-500 dark:text-slate-400'}`}
                >
                  {nhan}
                </button>
              ))}
            </div>

            <div className="grid min-h-0 flex-1 md:grid-cols-2 md:divide-x md:divide-slate-200 md:dark:divide-white/[0.08]">
              <section className={`min-h-0 overflow-y-auto px-4 py-3 ${tab === 'cu' ? '' : 'hidden'} md:block`} aria-label="Bản cũ">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bản cũ</p>
                <XemTruoc key={`cu-${luot}`} doc={docCu} subjectId={subjectId} />
              </section>
              <section className={`min-h-0 overflow-y-auto px-4 py-3 ${tab === 'moi' ? '' : 'hidden'} md:block`} aria-label="Bản mới">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300">Bản mới (AI đề xuất)</p>
                <XemTruoc key={`moi-${luot}`} doc={trangThai.kq.doc} subjectId={subjectId} />
              </section>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-white/[0.08]">
              <p className="mr-auto text-[11px] text-slate-500 dark:text-slate-400">
                Giữ xong vẫn khôi phục được: nút &quot;Khôi phục bản cũ&quot;, Ctrl+Z, hoặc Lịch sử phiên bản.
              </p>
              {doiRoi && (
                <button type="button" onClick={chay} disabled={dangGiu} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-slate-300 px-3 text-[12.5px] text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]">
                  <RotateCcw className="h-3.5 w-3.5" /> Chạy lại
                </button>
              )}
              <button type="button" onClick={onDong} disabled={dangGiu} className="inline-flex min-h-10 items-center gap-1.5 rounded-md border border-slate-300 px-3 text-[12.5px] text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06]">
                <Undo2 className="h-3.5 w-3.5" /> Hoàn tác (bỏ bản mới)
              </button>
              <button type="button" onClick={() => void giu()} disabled={dangGiu} className="inline-flex min-h-10 items-center gap-1.5 rounded-md bg-violet-600 px-3 text-[12.5px] font-medium text-white hover:bg-violet-700 disabled:opacity-50">
                {dangGiu ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {doiRoi ? 'Vẫn giữ bản mới' : 'Giữ bản mới'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
