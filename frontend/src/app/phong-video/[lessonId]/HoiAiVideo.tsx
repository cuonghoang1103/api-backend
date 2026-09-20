'use client';

/**
 * ============================================================
 * TAB "HỎI AI" CỦA PHÒNG HỌC VIDEO
 * ============================================================
 *
 * Vỏ thứ BA của gia sư bài học (sau mục cuối bài và con robot nổi). Ruột vẫn
 * là `useGiaSuBai` — không chép lại một dòng nào của nó. Xem ghi chú đầu
 * `useGiaSuBai.ts` về lý do không chép.
 *
 * Khác hai vỏ kia đúng hai điểm:
 *   • `phongVideo: true` ⇒ máy chủ nạp phụ đề vào ngữ cảnh và bắt gia sư
 *     trích dẫn kèm mốc `[mm:ss]`.
 *   • `phuDeGiay` ⇒ "đoạn này" là đoạn nào.
 *
 * Và mốc thời gian trong câu trả lời BẤM ĐƯỢC — xem `mocThoiGian.ts`.
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, Loader2, Send, User, Languages, RefreshCw, Crown, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { usePro } from '@/hooks/usePro';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import type { useGiaSuBai } from '@/components/academy/useGiaSuBai';

/** Một bản `useGiaSuBai` dùng CHUNG cho cả phòng — xem ghi chú ở `PhongVideoClient`. */
export type GiaSu = ReturnType<typeof useGiaSuBai>;
import { giayTuURL, moc, themLienKet } from './mocThoiGian';

/**
 * Chip mở màn. `key` CỐ ĐỊNH ⇒ dùng chung cache: ai bấm cùng chip trên cùng
 * bài đều nhận cùng câu trả lời, tức thì, không tốn thêm một lượt gọi model.
 *
 * ⚠️ "Giải thích đoạn này" KHÔNG có `key`. Câu trả lời của nó phụ thuộc giây
 * đang xem, nên cache chung sẽ trả về đoạn của người khác — sai một cách rất
 * khó nghi ngờ, vì câu trả lời vẫn mạch lạc và vẫn nói về đúng video này.
 */
const CHIP: { key?: string; nhan: string; q: string }[] = [
  { key: 'video_tomtat', nhan: 'Tóm tắt video', q: 'Tóm tắt video này theo các phần có mốc thời gian.' },
  { nhan: 'Giải thích đoạn này', q: 'Giải thích kỹ đoạn tôi đang xem: người nói đang nói gì, thuật ngữ nào cần hiểu?' },
  { key: 'video_thuatngu', nhan: 'Thuật ngữ', q: 'Liệt kê các thuật ngữ chuyên môn xuất hiện trong video, kèm nghĩa tiếng Việt và giải thích ngắn.' },
  { key: 'video_sodo', nhan: 'Vẽ sơ đồ', q: 'Vẽ sơ đồ mermaid tóm tắt kiến thức chính của video này.' },
  { key: 'video_tuvung', nhan: 'Từ vựng tiếng Anh', q: 'Chọn 15 từ/cụm từ tiếng Anh đáng học trong video này, kèm phiên âm, nghĩa và câu ví dụ lấy từ chính video (có mốc thời gian).' },
  { key: 'video_vidu', nhan: 'Ví dụ thực tế', q: 'Cho ví dụ thực tế dễ hình dung cho kiến thức trong video này.' },
  { key: 'video_kiemtra', nhan: 'Kiểm tra tôi', q: 'Đặt 5 câu hỏi kiểm tra xem tôi đã hiểu video chưa (kèm đáp án ở cuối).' },
];

export default function HoiAiVideo({ giaSu, giay, onTua }: {
  giaSu: GiaSu;
  giay: number;
  onTua: (giay: number) => void;
}) {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const { isPro } = usePro();

  const {
    turns, question, setQuestion, asking,
    hoi, hoiTiengAnh, hoiLaiMoi, xoaHoiThoai,
  } = giaSu;

  /*
   * ⚠️ CUỘN TRONG CỘT, KHÔNG DÙNG `scrollIntoView`.
   *
   * Trên màn hẹp bố cục xếp DỌC (video trên, bảng dưới) nên cả trang cuộn
   * được — và `scrollIntoView` sẽ kéo luôn cả trang xuống đáy khung chat mỗi
   * lần AI gõ thêm một mẩu, tức là giật video ra khỏi tầm mắt người đang xem.
   * Đặt `scrollTop` của đúng cột thì phần còn lại của trang đứng yên.
   */
  const khungRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const v = khungRef.current;
    if (!v) return;
    v.scrollTop = v.scrollHeight;
  }, [turns.length, turns[turns.length - 1]?.content]);

  /*
   * Bấm mốc `[2:19]` trong câu trả lời ⇒ tua video.
   *
   * Bắt ở CẤP KHUNG chứ không sửa `ChatMarkdown`: nó là component dùng chung
   * cho mọi câu trả lời AI của cả web, và thêm một prop chỉ để phục vụ phòng
   * này là kéo cả nhà theo một chỗ. `closest('a')` vì cú bấm có thể rơi trúng
   * thẻ con bên trong liên kết.
   */
  const bamTrongCauTraLoi = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement | null)?.closest?.('a');
    const g = giayTuURL(a?.getAttribute('href'));
    if (g === null) return;
    e.preventDefault();
    onTua(g);
  }, [onTua]);

  const chuaHoi = turns.length === 0;

  const tieuDeChip = useMemo(() => (
    <div className="flex flex-wrap gap-1.5">
      {CHIP.map((c) => (
        <button
          key={c.nhan}
          type="button"
          disabled={asking}
          onClick={() => void hoi(c.q, c.key ? { cacheKey: c.key } : undefined)}
          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-neon-violet/50 hover:text-neon-violet disabled:opacity-40"
        >
          {c.nhan}
          {!c.key && <span className="ml-1 font-mono text-[10px] text-text-muted">{moc(giay)}</span>}
        </button>
      ))}
    </div>
  ), [asking, hoi, giay]);

  if (!isAuthed) {
    return (
      <div className="p-4 text-sm">
        <Link href="/login" className="underline" style={{ color: '#6366f1' }}>
          Đăng nhập để học cùng gia sư AI
        </Link>
      </div>
    );
  }
  if (!isPro) {
    return (
      <div className="p-4">
        <p className="mb-3 text-sm text-text-secondary">
          Phòng học video cùng AI là tính năng Pro — gia sư đọc được phụ đề của video
          và giảng lại đúng đoạn bạn đang xem.
        </p>
        <Link href="/pro" className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>
          <Crown size={15} /> Nâng cấp Pro
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={khungRef} className="flex-1 overflow-y-auto px-3 py-3">
        {chuaHoi && (
          <div className="mb-3">
            <p className="mb-2 text-sm text-text-secondary">
              Gia sư đã đọc phụ đề của video này. Hỏi bất cứ điều gì — hoặc bắt đầu bằng một gợi ý:
            </p>
            {tieuDeChip}
          </div>
        )}

        <div className="space-y-2.5" onClick={bamTrongCauTraLoi}>
          {turns.map((t, i) => (
            <div key={i} className="flex gap-2">
              <span className="mt-0.5 shrink-0">
                {t.role === 'user'
                  ? <User size={14} className="text-text-muted" />
                  : <Sparkles size={14} style={{ color: '#8b5cf6' }} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-text-primary">
                  {t.role === 'user'
                    ? <span className="whitespace-pre-wrap">{t.content}</span>
                    : (t.streaming && !t.content)
                      ? <span className="inline-flex items-center gap-2 opacity-70"><Loader2 size={13} className="animate-spin" /> Đang soạn…</span>
                      : (
                        <>
                          {/* Chèn liên kết vào mốc thời gian TRƯỚC khi dựng markdown. */}
                          <ChatMarkdown content={themLienKet(t.content)} renderMath={!t.streaming} />
                          {t.streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse align-middle" style={{ background: '#8b5cf6' }} />}
                        </>
                      )}
                </div>
                {t.role === 'assistant' && !t.streaming && (t.cached || t.srcQuestion) && (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
                    {t.cached && <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5" style={{ color: '#8b5cf6' }}>⚡ Trả lời có sẵn</span>}
                    {!t.english && t.srcQuestion && !t.enDone && (
                      <button type="button" onClick={() => hoiTiengAnh(i)} disabled={asking}
                        className="inline-flex items-center gap-1 disabled:opacity-40">
                        <Languages size={12} /> Bản tiếng Anh
                      </button>
                    )}
                    {t.srcQuestion && (
                      <button type="button" onClick={() => hoiLaiMoi(i)} disabled={asking}
                        className="inline-flex items-center gap-1 disabled:opacity-40">
                        <RefreshCw size={11} /> Hỏi lại mới
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); void hoi(question); }}
        className="border-t border-white/10 p-2.5"
      >
        {!chuaHoi && (
          <div className="mb-2 flex items-center justify-between">
            <div className="min-w-0 flex-1 overflow-x-auto pb-1">{tieuDeChip}</div>
            <button type="button" onClick={xoaHoiThoai} title="Xoá hội thoại"
              className="ml-2 shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:text-red-400">
              <Trash2 size={14} />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Hỏi về video… (đang ở ${moc(giay)})`}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-neon-violet/50"
          />
          <button type="submit" disabled={asking || !question.trim()}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>
            {asking ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
      </form>
    </div>
  );
}
