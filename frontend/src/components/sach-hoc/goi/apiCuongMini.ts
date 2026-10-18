'use client';

/**
 * Lời gọi máy chủ của phòng CuongMini (19/10/2026) — gom một chỗ, KHÔNG thêm vào
 * `lib/api.ts` (tệp dùng chung nhiều phiên đang sửa). Dùng axios `api` cho JSON và
 * `fetch` + đọc luồng SSE cho lượt trò chuyện chảy dần.
 */
import api from '@/lib/api';
import { AI_TIMEOUT } from '../audio';

export type NgonNguGoi = 'en' | 'ja' | 'zh';

export interface ChuDeWeb {
  id: string; nhom: string; nhomEn: string; ten: string; tenEn: string; tenGoc?: string;
  cueCard?: { de: string; goiY: string[] }; giamKhao?: boolean;
}
export interface PhienTomTat {
  muc: string; cheDo: 'tro-chuyen' | 'phat-am'; ten: string; soLuot: number; viTri: number; tongCau: number; cauCuoi: string; capNhat: string;
}
export interface DuLieuPhien {
  cheDo: 'tro-chuyen' | 'phat-am'; ten: string; lichSu?: { ai: boolean; text: string }[];
  viTri?: number; tongCau?: number; soLuot?: number; soLoi?: number; giayNoi?: number; diemTb?: number | null;
}
export interface TheSua { ban: string; dung: string; viSao: string; doc?: string }
export interface TuMoi { tu: string; doc?: string; nghia: string }
export interface MetaLuot { sua: TheSua | null; tu: TuMoi[]; dich: string; cam: 'khen' | 'sua' | 'hoi' | 'vui' }
export type MocLuot = Partial<Record<'stt' | 'chuDau' | 'cauDau' | 'ttsDau' | 'het' | 'xong', number>>;
export type SuKien =
  | { type: 'nghe'; text: string; ms: number }
  | { type: 'cau'; i: number; text: string; audioUrls: string[]; giongThat: string }
  | { type: 'xong'; noi: string; nghe: string; meta: MetaLuot; moc: MocLuot; duong: string; usd?: number }
  | { type: 'loi'; lyDo: string; message: string };
export interface KetQuaCham { thang: 'band' | 'diem'; tong: number; tieuChi: { ma: string; ten: string; diem: number; nhanXet: string }[]; nhanXet: string; goiY: string[] }

const data = <T,>(p: Promise<{ data?: { data?: T } }>) => p.then((r) => r.data?.data as T);

export const layChuDe = (nn: NgonNguGoi) => data<{ items: ChuDeWeb[] }>(api.get('/ielts/ai/tro-chuyen/chu-de', { params: { ngonNgu: nn } }));
export const dsPhien = (stage: string) => data<{ items: PhienTomTat[] }>(api.get('/ielts/cuongmini/phien', { params: { stage } }));
export const layPhien = (stage: string, muc: string) => data<{ muc: string; duLieu: DuLieuPhien }>(api.get('/ielts/cuongmini/phien', { params: { stage, muc } }));
export const luuPhien = (stage: string, muc: string, duLieu: DuLieuPhien) => api.put('/ielts/cuongmini/phien', { stage, muc, duLieu });
export const xoaPhien = (stage: string, muc: string) => api.delete('/ielts/cuongmini/phien', { params: { stage, muc } });
export const chamBuoi = (b: { ngonNgu: NgonNguGoi; chuDeId: string; tenBai: string; luot: { ai: boolean; text: string }[] }) =>
  data<KetQuaCham | { lyDo: string }>(api.post('/ielts/ai/tro-chuyen/cham', b, AI_TIMEOUT));
export const layChuoi = (stage: string) => data<{ chuoi: number; kyLuc: number; daHocHomNay: boolean }>(api.get('/ielts/chuoi', { params: { stage } }));
export const ghiNgayHoc = (stage: string) => api.post('/ielts/chuoi/ghi', { stage });

/** Lưu thẻ sửa lỗi / từ mới vào Sổ lỗi (ôn giãn cách 2 ngày → 7 ngày). */
export function luuSoOn(muc: { nguon: string; kyNang: 'noi' | 'tuvung'; dang: string; cauHoi: string; daChon: string; dapAn: string; giaiThich?: string; duLieu?: object }[]) {
  return api.post('/ielts/so-loi/ghi', { muc });
}

/** Băm ngắn (ổn định) cho khoá nguồn của sổ lỗi. */
export function bam(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}

function layToken(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;)\s*backend_token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : '';
}

/**
 * MỘT lượt trò chuyện chảy dần (SSE qua POST). ĐƯỜNG DẪN TUYỆT ĐỐI dựng từ `baseURL`
 * của axios — app desktop chạy ở origin `app://`, `fetch('/api/v1/…')` tương đối bay vào hư không.
 * Trả khi luồng đóng. Ném lỗi có `status` khi HTTP hỏng (401 ⇒ chưa đăng nhập).
 */
export async function luongTroChuyen(fd: FormData, onSuKien: (e: SuKien) => void, signal: AbortSignal): Promise<void> {
  const goc = String(api.defaults.baseURL ?? '').replace(/\/api\/v1\/?$/, '');
  const tok = layToken();
  const res = await fetch(`${goc}/api/v1/ielts/ai/tro-chuyen/luong`, {
    method: 'POST',
    headers: tok ? { Authorization: `Bearer ${tok}` } : {},
    body: fd,
    signal,
  });
  if (!res.ok || !res.body) { const e = new Error(`HTTP ${res.status}`) as Error & { status?: number }; e.status = res.status; throw e; }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const khung = buf.split('\n\n');
    buf = khung.pop() ?? '';
    for (const k of khung) {
      for (const dong of k.split('\n')) {
        if (!dong.startsWith('data:')) continue;
        try { onSuKien(JSON.parse(dong.slice(5).trim()) as SuKien); } catch { /* khung hỏng: bỏ */ }
      }
    }
  }
}
