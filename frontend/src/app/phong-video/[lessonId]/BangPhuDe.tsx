'use client';

/**
 * Cột phụ đề — bấm một câu là nhảy tới đúng giây đó trong video.
 *
 * ⚠️ CÂU KHÔNG CÓ ĐỘ DÀI. `cues` chỉ có `{ t, en }`; câu thứ i kết thúc ở chỗ
 * câu i+1 bắt đầu. Đi tìm một trường `d` là đi tìm thứ không tồn tại.
 *
 * ⚠️ BẢN DỊCH GHÉP THEO CHỈ SỐ, và chỉ khi SỐ PHẦN TỬ KHỚP. Lệch một nhịp là
 * mỗi câu mang nghĩa của câu khác — người học không có cách nào phát hiện, họ
 * sẽ tin bản dịch. Lệch thì bỏ HẲN cột tiếng Việt, đó là lựa chọn đúng.
 */

import { useEffect, useMemo, useRef } from 'react';
import type { CauPhuDe } from '@/lib/api';
import { moc } from './mocThoiGian';

export default function BangPhuDe({ cues, dichVi, giay, hienDich, onTua }: {
  cues: CauPhuDe[];
  dichVi: string[] | null;
  giay: number;
  hienDich: boolean;
  onTua: (giay: number) => void;
}) {
  const voRef = useRef<HTMLDivElement | null>(null);
  const tuCuonRef = useRef(true);

  const coDich = !!dichVi && dichVi.length === cues.length;

  /* Câu đang đọc = câu cuối cùng có `t <= giay`. Tìm nhị phân vì danh sách có
     thể tới vài nghìn câu và hàm này chạy mỗi giây. */
  const dangDoc = useMemo(() => {
    if (!cues.length) return -1;
    let lo = 0, hi = cues.length - 1, ra = 0;
    while (lo <= hi) {
      const giua = (lo + hi) >> 1;
      if (cues[giua].t <= giay) { ra = giua; lo = giua + 1; } else { hi = giua - 1; }
    }
    return ra;
  }, [cues, giay]);

  /* Tự cuộn theo câu đang đọc — nhưng NHƯỜNG khi người học tự cuộn đi đọc chỗ
     khác. Không nhường thì cứ mỗi giây trang lại giật về, và không thể đọc
     lùi được câu nào. Chạm lại đáy ⇒ bật lại. */
  useEffect(() => {
    const v = voRef.current;
    if (!v) return;
    const onCuon = () => {
      const dayDuoi = v.scrollHeight - v.scrollTop - v.clientHeight;
      tuCuonRef.current = dayDuoi < 120 || v.scrollTop < 40 ? tuCuonRef.current : false;
    };
    v.addEventListener('scroll', onCuon, { passive: true });
    return () => v.removeEventListener('scroll', onCuon);
  }, []);

  useEffect(() => {
    if (!tuCuonRef.current || dangDoc < 0) return;
    const v = voRef.current;
    const o = v?.querySelector<HTMLElement>(`[data-cau="${dangDoc}"]`);
    if (!v || !o) return;
    const muon = o.offsetTop - v.clientHeight / 2.6;
    v.scrollTo({ top: Math.max(0, muon), behavior: 'smooth' });
  }, [dangDoc]);

  if (!cues.length) {
    return <p className="p-4 text-sm text-text-muted">Bài này chưa có phụ đề.</p>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-text-muted">
        <span>{cues.length.toLocaleString('vi-VN')} câu</span>
        <button
          onClick={() => { tuCuonRef.current = true; }}
          className="rounded-full border border-white/10 px-2.5 py-1 transition-colors hover:border-neon-violet/50 hover:text-neon-violet"
        >
          Bám theo video
        </button>
      </div>

      <div ref={voRef} className="flex-1 overflow-y-auto px-1 py-2">
        {cues.map((c, i) => {
          const dang = i === dangDoc;
          return (
            <button
              key={`${c.t}-${i}`}
              data-cau={i}
              onClick={() => onTua(c.t)}
              className={`flex w-full gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                dang ? 'bg-neon-violet/15' : 'hover:bg-white/[0.04]'
              }`}
            >
              <span className={`shrink-0 pt-0.5 font-mono text-[11px] tabular-nums ${
                dang ? 'text-neon-violet' : 'text-text-muted'
              }`}>
                {moc(c.t)}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-sm leading-relaxed ${
                  dang ? 'font-medium text-text-primary' : 'text-text-secondary'
                }`}>
                  {c.en}
                </span>
                {hienDich && coDich && dichVi![i] && (
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-text-muted">
                    {dichVi![i]}
                  </span>
                )}
              </span>
            </button>
          );
        })}
        <div className="h-16" />
      </div>
    </div>
  );
}
