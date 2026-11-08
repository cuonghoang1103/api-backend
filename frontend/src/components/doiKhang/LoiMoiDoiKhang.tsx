'use client';

/**
 * THẺ LỜI MỜI ĐỐI KHÁNG (05/10/2026) — gắn MỘT lần ở layout (web + app desktop), hiện ở mọi trang.
 *
 * Nghe `dk:loi-moi` `{ id, maPhong, tro, tu, hetLuc }` → thẻ nổi góc phải dưới: avatar,
 * "X mời bạn chơi Cờ tướng", Nhận / Từ chối, thanh thời gian chạy lùi tới `hetLuc`, có âm báo.
 * Nhận → `/games/doi-khang?phong=MÃ` (máy chủ coi là đã nhận khi người đó VÀO phòng).
 * Từ chối → `dk:tra-loi-moi { dongY: false }`.
 *
 * 08/11/2026: HẾT GIỜ không còn tự gửi "từ chối" — máy chủ tự hết hạn lời mời và báo người mời.
 * Trước đây mỗi tab/thiết bị đều đếm 30 s riêng, nên người ĐÃ nhận ở máy này vẫn bị tab kia gửi
 * "từ chối" ⇒ chủ phòng thấy "X đã từ chối" trong khi X đang ngồi trong phòng. Giờ thẻ tắt ở mọi
 * thiết bị cùng lúc theo `dk:loi-moi-xong`.
 */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { nghe, traLoiMoi, type LoiMoiDen } from '@/lib/doiKhang/client';
import { AnhDaiDien, TEN_TRO, MAU_TRO } from './chung';
import { amBan } from './amThanhDk';
import css from './doiKhang.module.css';

/** Máy chủ cũ không gửi `hetLuc` ⇒ dùng hạn mặc định. */
const HAN_MS = 60_000;

export default function LoiMoiDoiKhang({
  /** App desktop có router riêng thì truyền hàm điều hướng vào; web dùng next/navigation. */
  dieuHuong,
}: {
  dieuHuong?: (duong: string) => void;
}) {
  const daDangNhap = useAuthStore((s) => s.isAuthenticated && !!s.user);
  const router = useRouter();
  const [ds, setDs] = useState<(LoiMoiDen & { khoa: string; conMs: number })[]>([]);
  const henRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    if (!daDangNhap) return;
    const hen = henRef.current;
    const tat = (khoa: string) => {
      const t = hen.get(khoa);
      if (t) clearTimeout(t);
      hen.delete(khoa);
      setDs((c) => c.filter((x) => x.khoa !== khoa));
    };
    const huy = nghe('dk:loi-moi', (d) => {
      if (!d || !d.maPhong) return;
      const khoa = d.maPhong;
      // Đồng hồ hai máy lệch nhau vài giây là thường — kẹp trong [5 s, 2 phút] để không tắt ngay / treo mãi.
      const conMs = Math.min(120_000, Math.max(5_000, d.hetLuc ? d.hetLuc - Date.now() : HAN_MS));
      setDs((c) => [...c.filter((x) => x.khoa !== khoa), { ...d, khoa, conMs }].slice(-3));
      amBan('loiMoi');
      const cu = hen.get(khoa);
      if (cu) clearTimeout(cu);
      hen.set(khoa, setTimeout(() => tat(khoa), conMs));
    });
    const huyXong = nghe('dk:loi-moi-xong', (d) => { if (d?.maPhong) tat(d.maPhong); });
    return () => {
      huy();
      huyXong();
      hen.forEach(clearTimeout);
      hen.clear();
    };
  }, [daDangNhap]);

  const bo = (khoa: string) => {
    const t = henRef.current.get(khoa);
    if (t) clearTimeout(t);
    henRef.current.delete(khoa);
    setDs((c) => c.filter((x) => x.khoa !== khoa));
  };

  if (!ds.length) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      {ds.map((m) => {
        const mau = MAU_TRO[m.tro] ?? MAU_TRO['co-vua'];
        return (
          <div
            key={m.khoa}
            role="alert"
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border border-white/10 bg-[#121027]/95 p-3.5 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,.7)] backdrop-blur-md ${css.noiLen}`}
          >
            <div aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ background: `linear-gradient(${mau.a}, ${mau.b})` }} />
            <button type="button" className="absolute right-2 top-2 rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white" aria-label="Đóng" onClick={() => { bo(m.khoa); void traLoiMoi(m.maPhong, false); }}>
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-center gap-3 pr-5">
              <AnhDaiDien ten={m.tu?.ten || '?'} src={m.tu?.avatar} kich={42} />
              <div className="min-w-0 text-sm leading-snug">
                <b className="font-semibold">{m.tu?.ten || 'Một người bạn'}</b> mời bạn chơi{' '}
                <b style={{ color: mau.a }}>{TEN_TRO[m.tro] ?? 'đối kháng'}</b>
                <div className="font-mono text-[11px] text-white/40">Phòng {m.maPhong}</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-2 text-sm font-bold shadow-[0_6px_20px_-6px_rgba(217,70,239,.6)] hover:brightness-110"
                onClick={() => {
                  bo(m.khoa);
                  const duong = `/games/doi-khang?phong=${encodeURIComponent(m.maPhong)}`;
                  if (dieuHuong) dieuHuong(duong);
                  else router.push(duong);
                }}
              >
                Nhận
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.06] py-2 text-sm font-semibold text-white/80 hover:bg-white/[0.12]"
                onClick={() => { bo(m.khoa); void traLoiMoi(m.maPhong, false); }}
              >
                Từ chối
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/5">
              <div className={`h-full ${css.thanhChay}`} style={{ animationDuration: `${m.conMs}ms`, background: `linear-gradient(90deg, ${mau.a}, ${mau.b})` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
