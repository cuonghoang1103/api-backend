/**
 * Mảnh giao diện dùng chung của trang Quản trị (05/10/2026): thẻ số liệu, vòng đo,
 * ảnh đại diện, ô trống, hook tải dữ liệu có trạng thái + làm mới.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Loader2, RefreshCw, Inbox } from 'lucide-react';
import { useSession } from '../../auth/session';
import { goi, LoiAdmin, type PhongBi } from './adminApi';

export function useTai<T>(duong: string | null, query?: Record<string, string | number | boolean | undefined | null>) {
  const { api } = useSession();
  const [kq, setKq] = useState<PhongBi<T> | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [dang, setDang] = useState(false);
  const khoa = JSON.stringify(query ?? {});
  const lanGoi = useRef(0);
  const tai = useCallback(async () => {
    if (!api || !duong) return;
    const lan = ++lanGoi.current;
    setDang(true); setLoi(null);
    try {
      const r = await goi<T>(api, duong, { query: JSON.parse(khoa) as Record<string, string> });
      if (lan === lanGoi.current) setKq(r);
    } catch (e) {
      if (lan === lanGoi.current) setLoi(e instanceof LoiAdmin ? e.message : String(e));
    } finally {
      if (lan === lanGoi.current) setDang(false);
    }
  }, [api, duong, khoa]);
  useEffect(() => { void tai(); }, [tai]);
  return { data: kq?.data ?? null, pagination: kq?.pagination, loi, dang, taiLai: tai };
}

/** Gọi một thao tác (POST/PATCH/DELETE) — trả lỗi dạng chuỗi để hiện toast/nhãn. */
export function useThaoTac() {
  const { api } = useSession();
  return useCallback(async <T,>(duong: string, method: string, body?: unknown): Promise<{ ok: true; data: T } | { ok: false; loi: string }> => {
    if (!api) return { ok: false, loi: 'Chưa đăng nhập.' };
    try {
      const r = await goi<T>(api, duong, { method, body: body ?? {} });
      return { ok: true, data: r.data };
    } catch (e) {
      return { ok: false, loi: e instanceof Error ? e.message : String(e) };
    }
  }, [api]);
}

export function TheSo({ nhan, so, phu, mau = '#a78bfa', icon, i = 0 }: { nhan: string; so: ReactNode; phu?: ReactNode; mau?: string; icon?: ReactNode; i?: number }) {
  return (
    <div className="ct-qt-theso" style={{ ['--m' as string]: mau, ['--i' as string]: i }}>
      <div className="ct-qt-theso-dau"><span>{nhan}</span>{icon && <span className="ct-qt-theso-icon">{icon}</span>}</div>
      <b>{so}</b>
      {phu && <small>{phu}</small>}
    </div>
  );
}

/** Vòng đo phần trăm (RAM, đĩa, CPU…) — SVG, đổi màu theo ngưỡng. */
export function VongDo({ phanTram, nhan, phu }: { phanTram: number; nhan: string; phu?: string }) {
  const p = Math.max(0, Math.min(100, phanTram || 0));
  const mau = p >= 90 ? '#f43f5e' : p >= 75 ? '#f59e0b' : '#22c55e';
  const C = 2 * Math.PI * 34;
  return (
    <div className="ct-qt-vong">
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="8" />
        <circle cx="40" cy="40" r="34" fill="none" stroke={mau} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(p / 100) * C} ${C}`} transform="rotate(-90 40 40)" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="800" fill="currentColor">{Math.round(p)}%</text>
      </svg>
      <div><b>{nhan}</b>{phu && <small>{phu}</small>}</div>
    </div>
  );
}

export function Avt({ ten, anh, co = 34 }: { ten?: string | null | undefined; anh?: string | null | undefined; co?: number }) {
  const [hong, setHong] = useState(false);
  const chu = (ten ?? '?').trim().charAt(0).toUpperCase() || '?';
  if (anh && !hong) return <img className="ct-qt-avt" src={anh} alt="" style={{ width: co, height: co }} onError={() => setHong(true)} />;
  return <span className="ct-qt-avt" data-chu="" style={{ width: co, height: co, fontSize: co * 0.42 }}>{chu}</span>;
}

export function Trong({ chu, icon }: { chu: string; icon?: ReactNode }) {
  return <div className="ct-qt-trong">{icon ?? <Inbox size={28} />}<p>{chu}</p></div>;
}

export function DauMuc({ tieuDe, moTa, dang, onLamMoi, children }: { tieuDe: string; moTa?: string; dang?: boolean; onLamMoi?: () => void; children?: ReactNode }) {
  return (
    <header className="ct-qt-daumuc">
      <div>
        <h1>{tieuDe}</h1>
        {moTa && <p>{moTa}</p>}
      </div>
      <div className="ct-qt-daumuc-phai">
        {children}
        {onLamMoi && (
          <button type="button" className="ct-qt-nut-phu" onClick={onLamMoi} disabled={dang} title="Làm mới">
            {dang ? <Loader2 size={15} className="ct-spin" /> : <RefreshCw size={15} />}
          </button>
        )}
      </div>
    </header>
  );
}

export const tgTuongDoi = (iso?: string | null) => {
  if (!iso) return '';
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'vừa xong';
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
};
export const dungLuong = (b?: number | null) => {
  if (b == null) return '—';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0, x = b;
  while (x >= 1024 && i < u.length - 1) { x /= 1024; i++; }
  return `${x.toFixed(x >= 10 || i === 0 ? 0 : 1)} ${u[i]}`;
};
