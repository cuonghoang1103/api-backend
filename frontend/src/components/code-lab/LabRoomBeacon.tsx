'use client';

/**
 * Mốc Phòng Lab — khối nổi bật neo ở GÓC PHẢI trang track.
 *
 * ─── VÌ SAO CÓ CÁI NÀY ───
 * Lối vào Phòng Lab ban đầu là một pill nhỏ nằm lẫn giữa hàng chip
 * `java` · `54 exercises` · `Official docs` ở đầu trang. Đo bằng người thật:
 * chủ trang mở đúng trang đó, đã đăng nhập, và KHÔNG THẤY nó. Một lối vào mà
 * người viết ra nó còn không tìm thấy thì với người học nó không tồn tại.
 *
 * Nên khối này cố ý phá bố cục: neo cố định, tách khỏi mọi hàng chip, có quầng
 * sáng thở và một vệt sáng quét ngang. Nó KHÔNG thay pill cũ — pill vẫn ở đó
 * cho người đã quen — mà đứng cạnh như một biển chỉ đường.
 *
 * ─── BA THỨ CỐ Ý ───
 * • Thu gọn được, và NHỚ lựa chọn đó (`localStorage`). Một khối nhấp nháy mãi
 *   ở góc màn hình là quảng cáo, không phải công cụ.
 * • `prefers-reduced-motion` tắt sạch chuyển động — người say chuyển động vẫn
 *   phải dùng được tính năng, không phải chịu đựng nó.
 * • Ẩn dưới 1024px. Ở màn hẹp nó sẽ đè lên nội dung, mà thanh chọn bài đã dính
 *   sẵn ở đáy rồi nên không mất lối vào nào.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, FlaskConical, Minus, Target } from 'lucide-react';

const KHOA_THU = 'labroom-beacon-thu';

export function LabRoomBeacon({
  accent, dangChon, soBai, totalLoc, coLoc, onToggle,
}: {
  accent: string;
  dangChon: boolean;
  soBai: number;
  totalLoc: number;
  /** Track này có LOC trong tiêu đề bài không (chỉ LAB211 có). */
  coLoc: boolean;
  onToggle: () => void;
}) {
  const [thu, setThu] = useState(false);
  // Chỉ vẽ sau khi đã đọc xong localStorage: vẽ trước rồi thu lại là một cú
  // giật khung hình ngay chỗ mắt người dùng đang nhìn.
  const [sanSang, setSanSang] = useState(false);

  useEffect(() => {
    try { setThu(localStorage.getItem(KHOA_THU) === '1'); } catch { /* chế độ riêng tư */ }
    setSanSang(true);
  }, []);

  const doiThu = (v: boolean) => {
    setThu(v);
    try { localStorage.setItem(KHOA_THU, v ? '1' : '0'); } catch { /* không sao */ }
  };

  if (!sanSang) return null;

  // Đang tick bài thì luôn bung ra: lúc đó khối này là chỗ duy nhất hiện số
  // bài và tổng LOC ở tầm mắt, thu nó lại là giấu đúng thứ đang cần.
  const moRong = !thu || dangChon;

  if (!moRong) {
    return (
      <button
        onClick={() => doiThu(false)}
        aria-label="Mở Phòng Lab"
        className="lr-beacon lr-float fixed right-5 top-28 z-40 hidden h-12 w-12 items-center justify-center rounded-full border shadow-lg lg:flex"
        style={{ borderColor: accent, background: 'var(--bg-card)', color: accent }}>
        <span className="lr-halo absolute inset-0 rounded-full" style={{ boxShadow: `0 0 0 3px color-mix(in srgb, ${accent} 30%, transparent)` }} />
        <FlaskConical size={20} />
      </button>
    );
  }

  return (
    <aside
      className="lr-beacon lr-pop fixed right-5 top-28 z-40 hidden w-64 overflow-hidden rounded-2xl border shadow-xl lg:block"
      style={{ borderColor: `color-mix(in srgb, ${accent} 45%, var(--border-color))`, background: 'var(--bg-card)' }}>

      {/* Quầng thở phía sau, và vệt sáng quét ngang mặt thẻ. */}
      <span aria-hidden className="lr-halo pointer-events-none absolute inset-0 rounded-2xl"
        style={{ boxShadow: `0 0 26px 2px color-mix(in srgb, ${accent} 34%, transparent)` }} />
      <span aria-hidden className="lr-sweep pointer-events-none absolute inset-y-0 w-1/3"
        style={{ background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent} 22%, transparent), transparent)` }} />

      <div className="relative p-3.5">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
            style={{ background: accent }}>
            <FlaskConical size={11} /> Phòng Lab
          </span>
          <button onClick={() => doiThu(true)} aria-label="Thu gọn"
            className="rounded-md p-1 transition-colors hover:bg-[var(--bg-surface-hover)]"
            style={{ color: 'var(--text-muted)' }}>
            <Minus size={14} />
          </button>
        </div>

        <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
          Tự lập phòng luyện của riêng bạn
        </p>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Chọn bài trong 54 bài, đặt mục tiêu LOC, có AI kèm từng dòng và chấm bài nộp như thầy.
        </p>

        {dangChon && (
          <div className="mt-2.5 flex items-center gap-3 rounded-lg border px-2.5 py-1.5 text-xs"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{soBai}</strong> bài
            </span>
            {coLoc && (
              <span className="inline-flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                <Target size={11} /><strong style={{ color: accent }}>{totalLoc}</strong> LOC
              </span>
            )}
          </div>
        )}

        <button
          onClick={onToggle}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: accent }}>
          <FlaskConical size={13} />
          {dangChon ? 'Xong, thoát chọn' : 'Chọn bài lập phòng'}
        </button>

        <Link href="/code-lab/phong-lab"
          className="mt-1.5 flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--bg-surface-hover)]"
          style={{ color: 'var(--text-secondary)' }}>
          Phòng Lab của tôi <ChevronRight size={13} />
        </Link>
      </div>
    </aside>
  );
}
