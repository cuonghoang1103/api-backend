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
import { BookMarked, ChevronDown, Loader2, MessageCirclePlus, Trash2 } from 'lucide-react';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import { useFaqGiaSu, type MucFaq } from '@/components/academy/useFaqGiaSu';

export type { MucFaq };


export default function FaqGiaSu({ duong, khoaDoiBai, onHoiTiep }: {
  /** Đường API, KHÔNG có đuôi. VD: `/code-lab/exercises/12/ai/asks` */
  duong: string;
  /** Đổi giá trị này ⇒ đóng mục và vứt danh sách cũ (chuyển sang bài khác). */
  khoaDoiBai: number | string;
  /** Có ⇒ hiện nút "Hỏi tiếp": nối câu cũ vào cuộc đang mở rồi hỏi thêm. */
  onHoiTiep?: (m: MucFaq) => void;
}) {
  const { mo, batMo, ds, dangTai, moMuc, datMoMuc, xoa, conNua, napThem } = useFaqGiaSu(duong, khoaDoiBai);

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={batMo}
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
                        {onHoiTiep && (
                          /* "Hỏi tiếp": nối câu hỏi + câu trả lời cũ vào cuộc
                             đang mở, rồi người học gõ tiếp. Không có nút này
                             thì muốn đào sâu một câu cũ họ phải chép tay lại
                             cả đoạn — và gia sư mất hẳn ngữ cảnh đã có. */
                          <button
                            type="button"
                            onClick={() => onHoiTiep(f)}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                          >
                            <MessageCirclePlus size={13} /> Hỏi tiếp từ câu này
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {/* Không câu nào bị giấu: danh sách chỉ trả 40 mỗi trang, nhưng CSDL
              giữ hết — xem chú thích ở route. */}
          {conNua && (
            <button
              type="button"
              onClick={() => void napThem()}
              disabled={dangTai}
              className="w-full border-t px-3 py-2 text-center text-xs font-medium disabled:opacity-50"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              {dangTai
                ? <span className="inline-flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Đang tải…</span>
                : 'Xem thêm câu cũ hơn'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
