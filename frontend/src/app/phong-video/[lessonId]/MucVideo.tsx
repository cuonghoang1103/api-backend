'use client';

/**
 * ============================================================
 * "MỤC VIDEO" — các phần có mốc thời gian, như chương của YouTube
 * ============================================================
 *
 * Người dùng 20/09/2026: *"tôi thấy trên youtube nó có phân chia đúng đoạn
 * thời gian cụ thể như này đây"*.
 *
 * ⚠️ MỤC LỤC LẤY TỪ CHÍNH CÂU TÓM TẮT CỦA GIA SƯ, không phải một lượt gọi
 * riêng. `THEM_PHONG_VIDEO` (xem `courseTutor.service.ts`) đã bắt gia sư mở
 * câu tóm tắt bằng khối **Các phần trong video** với mốc `[mm:ss - mm:ss]`.
 * Gọi thêm một lượt nữa chỉ để xin mục lục là trả tiền hai lần cho cùng một
 * thứ, và hai lần đó có thể chia phần KHÁC NHAU — người học bấm chương ở tab
 * này rồi đọc tóm tắt ở tab kia sẽ thấy hai bản đồ không khớp.
 *
 * `cacheKey: 'video_tomtat'` nên bài đã có người tóm tắt thì mục lục hiện
 * TỨC THÌ và không tốn lượt nào.
 */

import { useEffect, useMemo, useRef } from 'react';
import { Loader2, ListVideo, Sparkles } from 'lucide-react';
import ChatMarkdown from '@/components/chat/ChatMarkdown';
import type { GiaSu } from './HoiAiVideo';
import { bocPhan, moc, themLienKet, giayTuURL, type Phan } from './mocThoiGian';

const CAU_TOM_TAT = 'Tóm tắt video này theo các phần có mốc thời gian.';
const KHOA_CACHE = 'video_tomtat';

export default function MucVideo({ giaSu, giay, onTua }: {
  giaSu: GiaSu;
  giay: number;
  onTua: (giay: number) => void;
}) {
  const { turns, asking, hoi } = giaSu;

  /* Lượt trả lời sinh ra TỪ đúng câu tóm tắt — không phải lượt cuối cùng.
     Người học hỏi thêm vài câu rồi mở tab này thì lượt cuối là câu khác hẳn. */
  const luot = useMemo(
    () => [...turns].reverse().find((t) => t.role === 'assistant' && t.srcCacheKey === KHOA_CACHE),
    [turns],
  );

  const phan = useMemo(() => (luot?.content ? bocPhan(luot.content) : []), [luot?.content]);

  /* Hỏi MỘT lần khi người học mở tab này — và chỉ khi chưa có. `useRef` chứ
     không phải state: state đổi làm chạy lại effect, và câu hỏi bắn hai lần. */
  const daHoi = useRef(false);
  useEffect(() => {
    /* `asking` giờ là cờ DÙNG CHUNG của cả phòng, nên nó thật sự chặn được
       lượt hỏi đang chảy ở tab chat. `daHoi` chỉ cắm một lần cho mỗi phòng. */
    if (daHoi.current || luot || asking) return;
    daHoi.current = true;
    void hoi(CAU_TOM_TAT, { cacheKey: KHOA_CACHE });
  }, [luot, asking, hoi]);

  const dangCho = !luot || (luot.streaming && phan.length === 0);

  if (dangCho) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: '#8b5cf6' }} />
        <p className="text-sm text-text-secondary">Gia sư đang đọc phụ đề và chia phần…</p>
        <p className="text-xs text-text-muted">Bài đã có người xem thì lần sau hiện ngay.</p>
      </div>
    );
  }

  const dangO = phan.findIndex((p, i) => {
    const het = p.den ?? phan[i + 1]?.tu ?? Number.POSITIVE_INFINITY;
    return giay >= p.tu && giay < het;
  });

  return (
    <div className="h-full overflow-y-auto px-2 py-2">
      {phan.length > 0 ? (
        <>
          <div className="mb-1.5 flex items-center gap-1.5 px-1.5 text-xs font-semibold uppercase text-text-muted">
            <ListVideo size={13} /> {phan.length} phần
          </div>
          {phan.map((p, i) => (
            <button
              key={`${p.tu}-${i}`}
              onClick={() => onTua(p.tu)}
              className={`mb-1 flex w-full gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                i === dangO ? 'bg-neon-violet/15' : 'hover:bg-white/[0.04]'
              }`}
            >
              <span className={`shrink-0 pt-0.5 font-mono text-[11px] tabular-nums ${
                i === dangO ? 'text-neon-violet' : 'text-text-muted'
              }`}>
                {moc(p.tu)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-text-primary">{p.ten}</span>
                {p.y && <span className="mt-0.5 block text-[13px] leading-relaxed text-text-secondary">{p.y}</span>}
              </span>
            </button>
          ))}
          <div className="h-8" />
        </>
      ) : (
        /* Không bóc được phần nào thì HIỆN NGUYÊN câu tóm tắt, đừng bỏ trống.
           Câu trả lời vẫn hữu ích kể cả khi nó không theo đúng khuôn. */
        <div
          className="px-1.5 py-1 text-sm"
          onClick={(e) => {
            const a = (e.target as HTMLElement | null)?.closest?.('a');
            const g = giayTuURL(a?.getAttribute('href'));
            if (g === null) return;
            e.preventDefault();
            onTua(g);
          }}
        >
          <div className="mb-2 flex items-center gap-1.5 text-xs text-text-muted">
            <Sparkles size={12} /> Tóm tắt của gia sư
          </div>
          <ChatMarkdown content={themLienKet(luot.content)} renderMath={!luot.streaming} />
        </div>
      )}
    </div>
  );
}
