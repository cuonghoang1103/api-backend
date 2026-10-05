'use client';

/**
 * Đối kháng — mảnh dùng chung cho sảnh và bàn chơi (05/10/2026).
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { MaTro } from '@/lib/doiKhang/luat';

export const TEN_TRO: Record<MaTro, string> = {
  'co-vua': 'Cờ vua',
  'co-tuong': 'Cờ tướng',
  'tien-len': 'Tiến lên',
  caro: 'Caro',
};

export const MO_TA_TRO: Record<MaTro, string> = {
  'co-vua': 'Nhập thành, bắt tốt qua đường, phong cấp — luật quốc tế đầy đủ.',
  'co-tuong': 'Sở hà – Hán giới. Tướng không đối mặt, hết nước là thua.',
  'tien-len': 'Miền Nam, 2–4 người. Sảnh, đôi thông, tứ quý chặt heo.',
  caro: 'Bàn 15×15, năm quân liền là thắng — chặn hai đầu vẫn tính.',
};

/** Màu nhấn riêng từng trò (chip, viền thẻ, nút). */
export const MAU_TRO: Record<MaTro, { a: string; b: string }> = {
  'co-vua': { a: '#f5c56b', b: '#a8693a' },
  'co-tuong': { a: '#f87171', b: '#b45309' },
  'tien-len': { a: '#34d399', b: '#0f766e' },
  caro: { a: '#60a5fa', b: '#6366f1' },
};

const LY_DO: Record<string, string> = {
  'chieu-het': 'Chiếu hết',
  bi: 'Hết nước đi',
  'het-nuoc': 'Hết nước đi',
  'nam-lien': 'Năm quân liền',
  'het-bai': 'Đánh hết bài',
  'hoa-50': 'Quá nhiều nước không ăn quân',
  'lap-3': 'Lặp thế cờ 3 lần',
  'thieu-quan': 'Không đủ quân để chiếu hết',
  'het-gio': 'Hết giờ',
  'dau-hang': 'Đầu hàng',
  thoat: 'Rời ván',
  'thoa-thuan': 'Hai bên đồng ý hoà',
  'day-ban': 'Kín bàn cờ',
};
export const lyDoChu = (ma: string) => LY_DO[ma] ?? ma;

/** Đo khung chứa — bàn chơi co giãn theo nó (kể cả khi toàn màn hình). */
export function useKichThuoc<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [kt, setKt] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const doc = () => {
      const r = el.getBoundingClientRect();
      setKt((c) => (Math.abs(c.w - r.width) < 0.5 && Math.abs(c.h - r.height) < 0.5 ? c : { w: r.width, h: r.height }));
    };
    doc();
    const ro = new ResizeObserver(doc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, kt] as const;
}

export function useGiamChuyenDong() {
  const [giam, setGiam] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    setGiam(mq.matches);
    const f = () => setGiam(mq.matches);
    mq.addEventListener?.('change', f);
    return () => mq.removeEventListener?.('change', f);
  }, []);
  return giam;
}

/** Ảnh đại diện tròn; không có ảnh (hoặc ảnh hỏng) thì hiện chữ cái đầu trên nền chuyển màu. */
export function AnhDaiDien({ ten, src, kich = 40, bot }: { ten: string; src?: string | null; kich?: number; bot?: boolean }) {
  const [hong, setHong] = useState(false);
  const chu = (ten || '?').trim().charAt(0).toUpperCase();
  const mau = mauTuTen(ten);
  const coAnh = !!src && !hong && (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:'));
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white"
      style={{
        width: kich,
        height: kich,
        fontSize: kich * 0.42,
        background: bot ? 'linear-gradient(135deg,#334155,#0f172a)' : `linear-gradient(135deg, ${mau[0]}, ${mau[1]})`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25), 0 2px 8px rgba(0,0,0,.35)',
      }}
    >
      {coAnh ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src!} alt="" className="h-full w-full object-cover" onError={() => setHong(true)} />
      ) : bot ? (
        <BieuTuongMay kich={kich * 0.6} />
      ) : (
        chu
      )}
    </span>
  );
}

function mauTuTen(ten: string): [string, string] {
  const bang: [string, string][] = [
    ['#8b5cf6', '#ec4899'], ['#06b6d4', '#6366f1'], ['#f59e0b', '#ef4444'], ['#10b981', '#0ea5e9'], ['#f472b6', '#a855f7'],
  ];
  let h = 0;
  for (const c of ten || '') h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return bang[h % bang.length];
}

export function BieuTuongMay({ kich = 20 }: { kich?: number }) {
  return (
    <svg width={kich} height={kich} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="7" width="16" height="12" rx="4" fill="#cbd5e1" />
      <rect x="4" y="7" width="16" height="12" rx="4" fill="url(#gMay)" />
      <circle cx="9.5" cy="13" r="1.7" fill="#0f172a" />
      <circle cx="14.5" cy="13" r="1.7" fill="#0f172a" />
      <path d="M12 3.5v3.5" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1.4" fill="#f472b6" />
      <defs>
        <linearGradient id="gMay" x1="0" y1="7" x2="0" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity=".5" />
          <stop offset="1" stopColor="#64748b" stopOpacity=".4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Định dạng đồng hồ: 9:05 · dưới 10 giây hiện thêm phần mười. */
export function chuDongHo(ms: number) {
  const m = Math.max(0, ms);
  if (m < 10_000) return (m / 1000).toFixed(1);
  const giay = Math.ceil(m / 1000);
  return `${Math.floor(giay / 60)}:${String(giay % 60).padStart(2, '0')}`;
}

export const CHIP =
  'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/80 backdrop-blur-md';
export const NUT =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40';
export const NUT_CHINH = `${NUT} bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[0_6px_24px_-6px_rgba(217,70,239,.6)] hover:brightness-110`;
export const NUT_KINH = `${NUT} border border-white/10 bg-white/[0.06] text-white/90 hover:bg-white/[0.12]`;
