'use client';

/**
 * ============================================================
 * PHÒNG HỌC VIDEO CÙNG AI — bản web
 * ============================================================
 *
 * Người dùng 20/09/2026: *"vừa học ngôn ngữ vừa học kiến thức"*, và muốn nó
 * có trên web như đã có trên app iPhone/iPad.
 *
 * Ba cột việc, cùng một video:
 *   • Phụ đề — bấm câu nào nhảy tới câu đó; có bản dịch thì hiện song ngữ.
 *   • Mục video — các phần có mốc thời gian, như chương của YouTube.
 *   • Hỏi AI — gia sư ĐỌC ĐƯỢC phụ đề, trích dẫn kèm `[mm:ss]` bấm được.
 *
 * ⚠️ NÚT QUAY LẠI PHẢI VỀ ĐÚNG BÀI ĐANG HỌC. Trang `learn` không ghi bài đang
 * mở vào URL (chọn bài chỉ đổi state), nên `/courses/<slug>/learn` trần sẽ mở
 * lại BÀI ĐẦU TIÊN của khoá — người học đang ở bài 27 bấm quay lại thì về bài
 * 1. Đường về đi qua tham số `?ve=`, và bên mời (`MoiVaoPhongVideo`) dựng nó
 * kèm `?lessonId=` — thứ trang `learn` ĐÃ đọc sẵn (xem chỗ `requestedLessonId`).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Languages, MessageCircle, ListVideo, Captions } from 'lucide-react';
import { videoHocApi, type PhuDeBai } from '@/lib/api';
import { useGiaSuBai } from '@/components/academy/useGiaSuBai';
import TrinhPhatYT, { type DieuKhienYT } from './TrinhPhatYT';
import BangPhuDe from './BangPhuDe';
import HoiAiVideo from './HoiAiVideo';
import MucVideo from './MucVideo';

type Tab = 'phude' | 'muc' | 'ai';

const TAB: { ma: Tab; nhan: string; Icon: typeof Captions }[] = [
  { ma: 'phude', nhan: 'Phụ đề', Icon: Captions },
  { ma: 'muc', nhan: 'Mục video', Icon: ListVideo },
  { ma: 'ai', nhan: 'Hỏi AI', Icon: MessageCircle },
];

export default function PhongVideoClient({ lessonId, ve }: {
  lessonId: number;
  /** Đường về ĐÃ ĐƯỢC LỌC ở máy chủ — xem `duongVe()` trong `page.tsx`. */
  ve: string;
}) {
  const router = useRouter();

  const [pd, datPd] = useState<PhuDeBai | null>(null);
  const [loi, datLoi] = useState<string | null>(null);
  const [giay, datGiay] = useState(0);
  const [tab, datTab] = useState<Tab>('ai');

  /*
   * Những tab NGƯỜI HỌC ĐÃ THẬT SỰ MỞ trong phòng này.
   *
   * ⚠️ Phải theo từng phòng, không được là biến cấp module. `MucVideo` bắn
   * một câu hỏi ngay khi gắn vào cây; một `Set` dùng chung sẽ nhớ rằng "đã mở
   * tab Mục video" từ phòng TRƯỚC, nên phòng sau vừa mở đã tự gọi model mà
   * chưa ai bấm vào đâu. Mỗi phòng một `Set` riêng, dọn sạch khi đổi bài.
   */
  const [daMo, datDaMo] = useState<Set<Tab>>(() => new Set<Tab>(['ai']));
  const [hienDich, datHienDich] = useState(true);

  const mayRef = useRef<DieuKhienYT | null>(null);

  /*
   * ⚠️⚠️ MỘT BẢN GIA SƯ DUY NHẤT CHO CẢ PHÒNG, dựng ở đây rồi truyền xuống.
   *
   * Bản đầu tôi cho `HoiAiVideo` và `MucVideo` mỗi bên gọi `useGiaSuBai`
   * riêng. Hai bản hook có hai cờ `asking` RIÊNG nhưng ghi vào CÙNG một hội
   * thoại (khoá là `lessonId`), nên mở tab "Mục video" trong lúc tab chat còn
   * đang chảy là hai lượt hỏi chạy song song — và `aIdx` của lượt sau trỏ
   * trúng bong bóng CÂU HỎI của lượt trước, tức câu trả lời ghi đè lên câu
   * hỏi. Một bản dùng chung thì `asking` chặn được lượt thứ hai.
   */
  const giaSu = useGiaSuBai({ lessonId, phongVideo: true, phuDeGiay: giay });

  useEffect(() => {
    let huy = false;
    videoHocApi.phuDe(lessonId)
      .then((r) => { if (!huy) datPd(r.data.data); })
      .catch(() => { if (!huy) datLoi('Bài này chưa có phụ đề nên chưa mở phòng học được.'); });
    return () => { huy = true; };
  }, [lessonId]);

  const tua = useCallback((g: number) => {
    mayRef.current?.tuaToi(g);
    /* Cập nhật NGAY, đừng đợi nhịp 250ms của trình phát: người học vừa bấm
       một câu mà dòng tô sáng còn nằm ở chỗ cũ thêm một phần tư giây thì cú
       bấm trông như trượt. */
    datGiay(Math.floor(g));
  }, []);

  if (loi) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 pt-16 text-center">
        <p className="text-text-secondary">{loi}</p>
        <button onClick={() => router.push(ve)}
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>
          <ArrowLeft size={15} /> Quay lại bài học
        </button>
      </div>
    );
  }

  if (!pd) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 pt-16 text-text-secondary">
        <Loader2 className="h-5 w-5 animate-spin" /> Đang mở phòng học…
      </div>
    );
  }

  const coDich = !!pd.dichVi && pd.dichVi.length === pd.cues.length;

  /*
   * ⚠️ `pt-16`: thanh điều hướng chung (`Navbar`) là `fixed top-0 h-16`, nằm
   * ĐÈ lên trang chứ không đẩy trang xuống. Thiếu khoảng này thì nút "Quay lại
   * bài học" và tên bài chui xuống dưới nó — thấy lờ mờ mà bấm không được
   * (người dùng báo trên iPad 22/09/2026). Trang `learn` cũng chừa đúng như vậy.
   * Chỉ chừa 4rem: `.app-main` đã tự cộng phần tai thỏ khi chạy dạng PWA
   * (xem `--app-nav-h` trong globals.css), cộng thêm ở đây là tính hai lần.
   *
   * Màn rộng (lg+) khoá đúng chiều cao KHUNG NHÌN THẬT: `100dvh`, không phải
   * `100vh` — trên Safari iPad `100vh` tính cả phần thanh công cụ che mất, nên
   * ô "Hỏi AI" ở đáy bảng bị đẩy ra ngoài màn hình. Trừ phần tai thỏ vì
   * `.app-main` đã đệm nó ở trên. Bảng bên phải tự cuộn bên trong.
   */
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-main,#0f0f13)] pt-16 lg:h-[calc(100dvh_-_env(safe-area-inset-top,0px))] lg:min-h-0 lg:overflow-hidden">
      {/* ── Thanh trên ── */}
      <header className="flex items-center gap-3 border-b border-white/10 px-3 py-2">
        <button onClick={() => router.push(ve)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-neon-violet/50 hover:text-neon-violet">
          <ArrowLeft size={14} /> Quay lại bài học
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{pd.tieuDe}</p>
          {pd.tieuDeVi && pd.tieuDeVi !== pd.tieuDe && (
            <p className="truncate text-xs text-text-muted">{pd.tieuDeVi}</p>
          )}
        </div>
        {coDich && (
          <button onClick={() => datHienDich((v) => !v)}
            title={hienDich ? 'Ẩn bản dịch tiếng Việt' : 'Hiện bản dịch tiếng Việt'}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
              hienDich ? 'border-neon-violet/50 text-neon-violet' : 'border-white/10 text-text-muted'
            }`}>
            <Languages size={14} /> Song ngữ
          </button>
        )}
      </header>

      {/* ── Thân: video bên trái, bảng bên phải (màn rộng) ── */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="lg:flex-1 lg:p-3">
          <div className="aspect-video w-full overflow-hidden bg-black lg:rounded-2xl">
            <TrinhPhatYT
              ref={mayRef}
              videoId={pd.videoId}
              tieuDe={pd.tieuDe}
              onGiay={datGiay}
            />
          </div>
        </div>

        <aside className="flex min-h-[55vh] w-full flex-col border-t border-white/10 lg:min-h-0 lg:w-[420px] lg:shrink-0 lg:border-l lg:border-t-0 xl:w-[460px]">
          <div className="flex shrink-0 border-b border-white/10">
            {TAB.map(({ ma, nhan, Icon }) => (
              <button key={ma} onClick={() => { datTab(ma); datDaMo((c) => (c.has(ma) ? c : new Set(c).add(ma))); }}
                className={`flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-medium transition-colors ${
                  tab === ma
                    ? 'border-b-2 border-neon-violet text-neon-violet'
                    : 'border-b-2 border-transparent text-text-muted hover:text-text-secondary'
                }`}>
                <Icon size={14} /> {nhan}
              </button>
            ))}
          </div>

          {/*
            ⚠️ GIỮ CẢ BA TAB TRONG CÂY, chỉ ẩn bằng CSS.
            Tháo ra khi đổi tab thì mỗi lần quay lại "Hỏi AI" là ô nhập trống,
            vị trí cuộn của phụ đề về đầu, và `MucVideo` coi như chưa hỏi rồi
            BẮN LẠI một lượt — tức là tính tiền cho mỗi lần bấm qua bấm lại.
          */}
          <div className="min-h-0 flex-1">
            <div className={`h-full ${tab === 'phude' ? '' : 'hidden'}`}>
              <BangPhuDe cues={pd.cues} dichVi={pd.dichVi} giay={giay} hienDich={hienDich} onTua={tua} />
            </div>
            <div className={`h-full ${tab === 'muc' ? '' : 'hidden'}`}>
              {/* Chỉ dựng khi ĐÃ mở lần đầu — nó tự hỏi gia sư lúc gắn vào cây. */}
              {daMo.has('muc') && <MucVideo giaSu={giaSu} giay={giay} onTua={tua} />}
            </div>
            <div className={`h-full ${tab === 'ai' ? '' : 'hidden'}`}>
              <HoiAiVideo giaSu={giaSu} giay={giay} onTua={tua} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
