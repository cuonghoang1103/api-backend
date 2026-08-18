'use client';

/**
 * Trợ lý ghi chú — hỏi bằng câu thường, trả lời KÈM NGUỒN.
 *
 * Khác `NoteAiMenu` (biến đổi đoạn chữ đang bôi đen): panel này đọc toàn bộ
 * kho ghi chú của bạn rồi trả lời, và mỗi ý đều ghi số nguồn `[1]` `[2]` bấm
 * được để mở đúng ghi chú đó.
 *
 * ⚠️ Trích dẫn KHÔNG phải trang trí. Một trợ lý trả lời trơn tru mà không chỉ
 * được nguồn thì người dùng không có cách nào phân biệt "nó đọc được trong ghi
 * chú của mình" với "nó bịa từ kiến thức chung" — và câu bịa thường nghe hợp
 * lý hơn câu thật.
 */
import { useState } from 'react';
import { Loader2, Send, Sparkles, X } from 'lucide-react';
import { notesApi } from '@/lib/api';

interface Nguon {
  noteId: number;
  title: string;
  trich: string;
}

export default function NoteAssistantPanel({
  onDong,
  onMoGhiChu,
}: {
  onDong: () => void;
  onMoGhiChu?: (noteId: number) => void;
}) {
  const [hoi, setHoi] = useState('');
  const [dangHoi, setDangHoi] = useState(false);
  const [traLoi, setTraLoi] = useState<string | null>(null);
  const [nguon, setNguon] = useState<Nguon[]>([]);
  const [loi, setLoi] = useState<string | null>(null);

  const gui = async () => {
    const cau = hoi.trim();
    if (!cau || dangHoi) return;
    setDangHoi(true);
    setLoi(null);
    setTraLoi(null);
    setNguon([]);
    try {
      const res = await notesApi.aiHoi(cau);
      setTraLoi(res.data.data.answer);
      setNguon(res.data.data.sources ?? []);
    } catch (e) {
      const o = e as { response?: { data?: { message?: string } } };
      setLoi(o.response?.data?.message ?? 'Không hỏi được trợ lý. Thử lại.');
    } finally {
      setDangHoi(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(420px,calc(100vw-2rem))] rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] px-4 py-3">
        <Sparkles size={16} className="text-violet-400" />
        <span className="flex-1 text-sm font-semibold text-[var(--text-primary)]">Hỏi trợ lý về ghi chú</span>
        <button type="button" onClick={onDong} aria-label="Đóng" className="rounded p-1 hover:bg-[var(--bg-hover)]">
          <X size={15} />
        </button>
      </div>

      <div className="max-h-[52vh] overflow-y-auto px-4 py-3">
        {!traLoi && !loi && !dangHoi && (
          <p className="text-xs text-[var(--text-secondary)]">
            Ví dụ: “tôi ghi gì về Prisma migration?”, “tóm tắt các ghi chú về PostgreSQL”.
            Trợ lý chỉ trả lời dựa trên ghi chú của bạn — không thấy thì nó nói thẳng là không thấy.
          </p>
        )}

        {dangHoi && (
          <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Loader2 size={14} className="animate-spin" /> Đang đọc ghi chú của bạn…
          </p>
        )}

        {loi && <p className="text-sm text-red-400">{loi}</p>}

        {traLoi && (
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]">{traLoi}</div>
        )}

        {nguon.length > 0 && (
          <div className="mt-4 border-t border-[var(--border-color)] pt-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Nguồn
            </p>
            <ul className="space-y-2">
              {nguon.map((n, i) => (
                <li key={n.noteId}>
                  <button
                    type="button"
                    onClick={() => onMoGhiChu?.(n.noteId)}
                    className="w-full rounded-lg border border-[var(--border-color)] px-3 py-2 text-left hover:border-violet-500/60"
                  >
                    <span className="text-xs font-semibold text-violet-400">[{i + 1}]</span>{' '}
                    <span className="text-xs font-medium text-[var(--text-primary)]">{n.title}</span>
                    <span className="mt-1 block line-clamp-2 text-[11px] text-[var(--text-secondary)]">{n.trich}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 border-t border-[var(--border-color)] p-3">
        <textarea
          rows={2}
          value={hoi}
          onChange={(e) => setHoi(e.target.value)}
          onKeyDown={(e) => {
            // Nhường Enter cho bộ gõ tiếng Việt: Enter đầu tiên là để CHỐT chữ.
            if ((e.nativeEvent as unknown as { isComposing?: boolean }).isComposing) return;
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void gui(); }
          }}
          placeholder="Hỏi gì về ghi chú của bạn…"
          className="flex-1 resize-none rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-violet-500"
        />
        <button
          type="button"
          onClick={() => void gui()}
          disabled={dangHoi || !hoi.trim()}
          className="rounded-lg bg-violet-600 px-3 py-2 text-white disabled:opacity-50"
          aria-label="Gửi câu hỏi"
        >
          {dangHoi ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
