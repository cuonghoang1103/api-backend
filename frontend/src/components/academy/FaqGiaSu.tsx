'use client';

/**
 * Mục "Câu hỏi thường gặp" của gia sư AI — DÙNG CHUNG.
 *
 * Ba nơi cần đúng một thứ này: gia sư khoá học (Academy), gia sư Code Lab, và
 * bất cứ chỗ nào thêm sau. Chép sang từng nơi là mầm trôi dạt: sửa cách hiện
 * ở một chỗ thì hai chỗ kia lặng lẽ khác đi, và không có gì báo.
 *
 * Chỉ nhận ĐƯỜNG DẪN API, không nhận dữ liệu: mỗi nơi có endpoint riêng
 * (`/courses/lessons/:id/ai/asks` vs `/code-lab/exercises/:id/ai/asks`) nhưng
 * hình dạng trả về giống hệt nhau, nên phần hiện là một.
 *
 * KHÔNG nằm sau cổng Pro. Đây là câu trả lời ĐÃ CÓ SẴN, và người chưa Pro
 * đúng là nhóm hưởng lợi nhiều nhất — đọc được thay vì hỏi lại, mà mỗi lần
 * hỏi lại là một lượt gọi model tốn tiền.
 */
import { useCallback, useEffect, useState } from 'react';
import { BookMarked, ChevronDown, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import ChatMarkdown from '@/components/chat/ChatMarkdown';

export interface MucFaq {
  id: number;
  question: string;
  /** NGUYÊN VĂN — máy chủ không cắt, và ở đây cũng không. */
  answer: string;
  lang?: string;
  createdAt: string;
  nguoiHoi: string;
  avatar: string | null;
  cuaToi: boolean;
}

export default function FaqGiaSu({ duong, khoaDoiBai }: {
  /** Đường API, KHÔNG có đuôi. VD: `/code-lab/exercises/12/ai/asks` */
  duong: string;
  /** Đổi giá trị này ⇒ đóng mục và vứt danh sách cũ (chuyển sang bài khác). */
  khoaDoiBai: number | string;
}) {
  const [mo, datMo] = useState(false);
  const [ds, datDs] = useState<MucFaq[] | null>(null);
  const [dangTai, datDangTai] = useState(false);
  const [moMuc, datMoMuc] = useState<number | null>(null);

  /* Nạp LƯỜI: chỉ hỏi máy chủ khi người dùng mở mục ra. Một bài đông người hỏi
     có thể trả về vài trăm KB — không đáng kéo về cho mọi lần mở bài. */
  const nap = useCallback(async () => {
    datDangTai(true);
    try {
      const r = await api.get(duong);
      datDs(r.data?.data?.items ?? []);
    } catch {
      datDs([]);
    } finally {
      datDangTai(false);
    }
  }, [duong]);

  // Đổi bài thì đóng và VỨT danh sách cũ — giữ lại là hiện câu hỏi của bài khác.
  useEffect(() => { datMo(false); datDs(null); datMoMuc(null); }, [khoaDoiBai]);

  const xoa = async (id: number) => {
    if (!window.confirm('Xoá câu hỏi này khỏi mục Câu hỏi thường gặp?')) return;
    try {
      await api.delete(`${duong}/${id}`);
      datDs((cu) => (cu ?? []).filter((x) => x.id !== id));
    } catch {
      toast.error('Xoá không được.');
    }
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => { const m = !mo; datMo(m); if (m && ds === null) void nap(); }}
        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
        title="Câu hỏi mọi người đã hỏi ở bài này, kèm câu trả lời của AI"
      >
        <BookMarked size={14} /> Câu hỏi thường gặp
        {ds && ds.length > 0 && (
          <span className="rounded-full px-1.5 text-[11px]"
            style={{ background: 'var(--accent-color, #8b5cf6)', color: '#fff' }}>{ds.length}</span>
        )}
        <ChevronDown size={13} className={mo ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>

      {mo && (
        <div className="mt-2 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
          {dangTai ? (
            <p className="px-3 py-4 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>Đang tải…</p>
          ) : !ds || ds.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
              Chưa ai hỏi gì ở bài này. Câu bạn hỏi sẽ được lưu lại đây cho người sau.
            </p>
          ) : (
            <ul>
              {ds.map((f) => {
                const dangMo = moMuc === f.id;
                return (
                  <li key={f.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-start gap-2 px-3 py-2">
                      <button type="button" onClick={() => datMoMuc(dangMo ? null : f.id)} className="flex-1 text-left">
                        <span className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {f.question}
                        </span>
                        <span className="mt-0.5 block text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          {f.nguoiHoi}
                          {' · '}
                          {new Date(f.createdAt).toLocaleDateString('vi-VN')}
                          {f.lang === 'en' && ' · EN'}
                          {!dangMo && ' · bấm để xem câu trả lời'}
                        </span>
                      </button>
                      {f.cuaToi && (
                        <button
                          type="button"
                          onClick={() => void xoa(f.id)}
                          aria-label="Xoá câu hỏi này"
                          className="shrink-0 rounded p-1.5 opacity-50 hover:opacity-100"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    {/* Nguyên văn — không cắt, không "xem thêm". Cắt một câu giảng
                        giữa chừng là làm hỏng đúng thứ người ta mở mục này ra để đọc. */}
                    {dangMo && (
                      <div className="px-3 pb-3">
                        <ChatMarkdown content={f.answer} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
