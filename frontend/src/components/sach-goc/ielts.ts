'use client';

/**
 * 🔒 Tài liệu riêng IELTS — dữ liệu dùng chung (12/11/2026). Mọi tên/tiêu đề tài liệu CHỈ đến từ API
 * `/api/v1/sach-rieng/ielts/*` (đăng nhập + tài khoản được phép) — không có chữ nào trong bundle hay public/.
 * Người không có quyền: `/sach-rieng/quyen` không có 'ielts' ⇒ không gọi thêm API nào.
 */
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useSachRiengDs } from './useSachRieng';

export type MocIelts = { giay: number; ghiChu: string };
export type BaiGanIelts = { lessonId: string; trongTam: string; moc?: MocIelts[] };
export type MucIelts = {
  id: string;
  loai: 'video' | 'audio' | 'pdf';
  tieuDe: string;
  nguon: string;
  nhom?: string;
  tomTat?: string;
  baiGan: BaiGanIelts[];
  thoiLuongGiay?: number;
  soTrang?: number;
  kichThuoc: number;
  mime?: string;
};

/** true = tài khoản này có 🔒 Tài liệu riêng IELTS. null = đang hỏi. */
export function useCoIelts(): boolean | null {
  const ds = useSachRiengDs();
  return ds === null ? null : ds.includes('ielts');
}

let dmDem: Promise<{ capNhat: string | null; muc: MucIelts[] }> | null = null;
export function layDanhMucIelts() {
  dmDem ??= api.get('/sach-rieng/ielts/danh-muc').then((r) => r.data.data as { capNhat: string | null; muc: MucIelts[] })
    .catch((e) => { dmDem = null; throw e; });
  return dmDem;
}

/** Các mục gắn một bài — lấy từ danh mục (một lần cho cả khoá, lật bài không gọi lại). */
export function useMucCuaBai(lessonId: string, bat: boolean): MucIelts[] | null {
  const [ds, setDs] = useState<MucIelts[] | null>(null);
  useEffect(() => {
    if (!bat) { setDs(null); return; }
    let live = true;
    layDanhMucIelts().then((dm) => { if (live) setDs(dm.muc.filter((m) => m.baiGan.some((b) => b.lessonId === lessonId))); }).catch(() => { if (live) setDs([]); });
    return () => { live = false; };
  }, [lessonId, bat]);
  return ds;
}

/** Gốc API (web: '/api/v1'; app desktop: máy chủ thật) — thẻ <video> cần URL tuyệt đối/đúng gốc. */
const gocApi = () => String(api.defaults.baseURL ?? '/api/v1').replace(/\/+$/, '');

/** URL phát media kèm vé 30 phút (thẻ <video>/<audio> không gửi được header; app không có cookie). */
export async function urlMedia(id: string): Promise<{ url: string; het: number }> {
  const r = await api.get(`/sach-rieng/ielts/ve/${encodeURIComponent(id)}`);
  const d = r.data.data as { duong: string; het: number };
  return { url: `${gocApi()}${d.duong}`, het: d.het };
}

export const urlTrangIelts = (id: string, p: number) => `/api/v1/sach-rieng/ielts/trang/${encodeURIComponent(id)}/${p}`;

/** Đường tới bài trong khoá: id `t2…` ⇒ Tập 2. */
export const duongBai = (lessonId: string) => (lessonId.startsWith('t2') ? `/language/en/ielts/tap-2?bai=${encodeURIComponent(lessonId)}` : `/language/en/ielts?bai=${encodeURIComponent(lessonId)}`);

export function dongHo(giay: number): string {
  const g = Math.max(0, Math.floor(giay));
  const h = Math.floor(g / 3600), m = Math.floor((g % 3600) / 60), s = g % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}

export const NHAN_LOAI: Record<MucIelts['loai'], string> = { video: '🎬 Video', audio: '🎧 Audio', pdf: '📄 PDF' };

export function moTaNgan(m: MucIelts): string {
  if (m.loai === 'pdf') return m.soTrang ? `${m.soTrang} trang` : '';
  return m.thoiLuongGiay ? dongHo(m.thoiLuongGiay) : '';
}
