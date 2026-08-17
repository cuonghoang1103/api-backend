'use client';

/**
 * Nút AI trong thanh công cụ nổi: bôi đen chữ rồi chọn một việc.
 *
 * ─── Vì sao THAY THẾ đoạn đã chọn, và vì sao phải hoàn tác được ───
 * Kết quả ghi đè thẳng lên đoạn người dùng bôi đen — đó là điều họ mong đợi
 * khi bấm "Viết lại". Nhưng AI cũng có lúc trả về thứ tệ hơn bản gốc, nên
 * thao tác này BẮT BUỘC phải lùi lại được bằng Cmd+Z: mọi thay đổi đi qua một
 * transaction duy nhất của TipTap, tức là một bước hoàn tác duy nhất.
 *
 * Chèn theo Markdown chứ không chèn chữ thô: "Chuyển thành checklist" và "Tạo
 * bảng" trả về cú pháp Markdown, và chèn thô sẽ ra một đoạn văn đầy dấu gạch
 * ngang với dấu ống thay vì một checklist và một cái bảng.
 */
import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { toast } from 'sonner';
import { notesApi } from '@/lib/api';

/**
 * Danh sách việc — CHÉP TAY từ `AI_ACTIONS` ở backend.
 *
 * Có endpoint `/notes/ai/actions` trả về đúng danh sách này, nhưng gọi nó mỗi
 * lần mở thanh công cụ là một lượt mạng cho một hằng số. Đổi lại, hai bên có
 * thể lệch nhau: khoá lạ sẽ bị backend từ chối bằng lỗi rõ ràng chứ không hỏng
 * câm, nên cái giá của việc lệch là một thông báo lỗi chứ không phải dữ liệu
 * sai.
 */
const ACTIONS: { key: string; label: string }[] = [
  { key: 'continue', label: 'Viết tiếp' },
  { key: 'improve', label: 'Viết lại cho hay hơn' },
  { key: 'fix', label: 'Sửa chính tả và ngữ pháp' },
  { key: 'shorten', label: 'Rút gọn' },
  { key: 'summarize', label: 'Tóm tắt' },
  { key: 'checklist', label: 'Chuyển thành checklist' },
  { key: 'tasks', label: 'Rút trích nhiệm vụ' },
  { key: 'table', label: 'Tạo bảng' },
  { key: 'translate_en', label: 'Dịch sang tiếng Anh' },
  { key: 'translate_vi', label: 'Dịch sang tiếng Việt' },
];

export default function NoteAiMenu({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (action: string) => {
    const { from, to } = editor.state.selection;
    const selection = editor.state.doc.textBetween(from, to, '\n');
    if (!selection.trim()) { toast.error('Chưa chọn đoạn chữ nào'); return; }

    setBusy(action);
    try {
      const res = await notesApi.aiAssist(action, selection);
      const text = res.data.data.text;
      if (!text) { toast.error('AI không trả về nội dung'); return; }

      // "Viết tiếp" CHÈN THÊM, các việc khác THAY THẾ. Thay thế ở "viết tiếp"
      // sẽ xoá mất đúng đoạn người dùng vừa viết — thứ họ muốn giữ.
      if (action === 'continue') {
        editor.chain().focus().insertContentAt(to, `\n\n${text}`).run();
      } else {
        editor.chain().focus().insertContentAt({ from, to }, text).run();
      }
      setOpen(false);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      // Hiện đúng câu backend trả về: "hết hạn mức hôm nay" và "đoạn chọn quá
      // dài" cần hai cách xử lý khác nhau, gộp thành "AI lỗi" thì người dùng
      // không biết phải làm gì.
      toast.error(message || 'Không gọi được AI');
    } finally {
      setBusy(null);
    }
  };

  return (
    <span className="relative">
      <button
        type="button"
        title="Nhờ AI"
        aria-label="Nhờ AI"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`note-bubble__btn${open ? ' is-active' : ''}`}
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-2xl dark:border-white/[0.1] dark:bg-slate-900"
          // Giữ vùng chọn khi bấm vào menu: mất tiêu điểm là ProseMirror thu
          // vùng chọn về con trỏ, và lượt gọi sẽ đi với chuỗi rỗng.
          onMouseDown={(e) => e.preventDefault()}
        >
          {ACTIONS.map((action) => (
            <button
              key={action.key}
              type="button"
              disabled={busy !== null}
              onClick={() => void run(action.key)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-200 dark:hover:bg-white/[0.06]"
            >
              {busy === action.key && <Loader2 className="h-3 w-3 animate-spin" aria-hidden />}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
