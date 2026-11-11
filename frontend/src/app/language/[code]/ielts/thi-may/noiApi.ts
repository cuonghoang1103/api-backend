/**
 * Gọi API cho phòng thi SPEAKING + xếp lớp đầu vào (12/11/2026). Máy chủ: `src/routes/ielts.hoc.routes.ts`
 * (`/ielts/thi-may/noi/*`, `/ielts/thi-may/xep-lop`). Tách khỏi `../chung/api.ts` để không giẫm lên tệp đang
 * có người khác sửa.
 */
import api from '@/lib/api';
import type { DeNoi } from './de/types';
import type { BanGhiCau, KetQuaChamNoi, KetQuaLuotNoi, XepLopLuuTraVe, XepLopTraVe } from './noiTypes';
import type { DauVaoXepLop } from './xepLop';

const d = <T,>(p: Promise<{ data: { data?: unknown } }>) => p.then((r) => r.data?.data as T);

/** Một câu trả lời: WAV 16 kHz mono (đổi bằng `blobToWav16k`) → chữ + điểm phát âm. ~2–4 giây. */
export const noiLuot = (wav: Blob, part: 1 | 2 | 3, cau: string) => {
  const fd = new FormData();
  fd.append('audio', wav, 'cau.wav');
  fd.append('part', String(part));
  fd.append('cau', cau.slice(0, 400));
  return d<KetQuaLuotNoi>(api.post('/ielts/thi-may/noi/luot', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 90_000 }));
};

export type KqCham = { ketQua: KetQuaChamNoi | null; lyDo?: string; thongBao?: string };

/**
 * Chấm cả bài chạy NỀN: POST nhận `viecId`, hỏi lại mỗi 4 giây (tối đa ~6 phút) — giống `thiChamViet`
 * (Cloudflare cắt yêu cầu quá 100 giây).
 */
export async function noiCham(b: { deId: string; cheDo: 'thi' | 'luyen'; banGhi: BanGhiCau[]; giay: number }, onCho?: (giay: number) => void): Promise<KqCham> {
  const bd = await d<KqCham & { viecId: string | null }>(api.post('/ielts/thi-may/noi/cham', b));
  if (!bd.viecId) return bd;
  const t0 = Date.now();
  while (Date.now() - t0 < 6 * 60_000) {
    await new Promise((r) => setTimeout(r, 4000));
    onCho?.(Math.round((Date.now() - t0) / 1000));
    try {
      const r = await d<KqCham & { xong: boolean }>(api.get(`/ielts/thi-may/noi/cham/${encodeURIComponent(bd.viecId)}`));
      if (r.xong) return r;
    } catch { /* mạng chập chờn: hỏi lại lượt sau */ }
  }
  return { ketQua: null, lyDo: 'qua_lau' };
}

/* ── Xếp lớp ── */
export const xepLopLay = () => d<XepLopTraVe>(api.get('/ielts/thi-may/xep-lop'));
/** Lưu kết quả test đầu vào — máy chủ tự tính lại tập/ngày từ số thô; 429 khi chưa đủ 30 ngày kể từ lần trước. */
export const xepLopLuu = (b: DauVaoXepLop & { deId?: string }) => d<XepLopLuuTraVe>(api.post('/ielts/thi-may/xep-lop', b));

/**
 * Tải một đề Speaking theo id (`noi-00`, `noi-demo`…) — tạm thời ở đây vì `de/index.ts` (đang có người sửa) chưa
 * biết `kyNang: 'noi'`. Tệp đề xuất một hằng kiểu `DeNoi`; lấy export đầu tiên có `kyNang === 'noi'`.
 */
export async function taiDeNoi(id: string): Promise<DeNoi | null> {
  if (!/^[a-z0-9-]{2,40}$/.test(id)) return null;
  try {
    const m = id === 'noi-demo'
      ? await import('./de/noi-demo')
      : ((await import(/* webpackInclude: /noi-[a-z0-9-]+\.ts$/ */ `./de/${id}`)) as Record<string, unknown>);
    const de = Object.values(m as Record<string, unknown>).find((x) => x && typeof x === 'object' && (x as DeNoi).kyNang === 'noi');
    return (de as DeNoi | undefined) ?? null;
  } catch {
    return null;
  }
}
