/**
 * Gọi API cho 3 trang IELTS đợt 1 (07/10/2026): phòng thi máy tính, flashcard SRS, Sổ lỗi.
 * Backend: src/routes/ielts.hoc.routes.ts (gắn dưới /api/v1/ielts).
 */
import api from '@/lib/api';

const d = <T,>(p: Promise<{ data: { data?: unknown } }>) => p.then((r) => r.data?.data as T);

export const loiMang = (e: unknown): { status?: number; message?: string } => {
  const r = (e as { response?: { status?: number; data?: { message?: string } } })?.response;
  return { status: r?.status, message: r?.data?.message };
};

/* ── Flashcard ── */
export type TheSrs = { tu: string; ease: number; khoang: number; lan: number; quen: number; hanLuc: string };
export type HomNay = { ngay: string; mucTieu: number; moiHomNay: number; denHan: TheSrs[]; daCo: string[] };
export type ThongKeTu = {
  mucTieu: number; tongThe: number; daThuoc: number; denHan: number; chuoi: number;
  ngay30: { ngay: string; moi: number; on: number }[];
  nho7: { tong: number; nho: number; tiLe: number | null };
};
export const tuHomNay = () => d<HomNay>(api.get('/ielts/vocab/hom-nay'));
export const tuThongKe = () => d<ThongKeTu>(api.get('/ielts/vocab/thong-ke'));
export const tuDanhGia = (tu: string, diem: 1 | 2 | 3 | 4) => d<{ the: TheSrs; thuoc: boolean }>(api.post('/ielts/vocab/danh-gia', { tu, diem }));
export const tuMucTieu = (tuMoi: number) => d<{ mucTieu: number }>(api.put('/ielts/vocab/muc-tieu', { tuMoi }));

/* ── Sổ lỗi ── */
export type KyNangLoi = 'doc' | 'nghe' | 'viet' | 'noi' | 'tuvung';
export type MucLoi = {
  id: number; nguon: string; kyNang: KyNangLoi; dang: string; cauHoi: string; daChon: string; dapAn: string;
  giaiThich: string | null; lyDo: string | null; congThuc: string | null; duLieu: Record<string, unknown> | null;
  lanSai: number; buoc: number; hanOn: string; daXong: boolean; lanOnCuoi: string | null; createdAt: string; updatedAt: string;
};
export type DsLoi = {
  items: MucLoi[]; lyDoNhan: Record<string, string>;
  thongKe: { tong: number; denHan: number; theoDang: { dang: string; so: number; lanSai: number }[]; theoLyDo: { lyDo: string | null; so: number }[]; theoKyNang: { kyNang: string; so: number }[] };
};
export type GhiLoi = { nguon: string; kyNang: KyNangLoi; dang: string; cauHoi: string; daChon: string; dapAn: string; giaiThich?: string; lyDo?: string | null; duLieu?: Record<string, unknown> };
export const loiDs = (q: Record<string, string | undefined>) => {
  const p = Object.fromEntries(Object.entries(q).filter(([, v]) => v));
  return d<DsLoi>(api.get('/ielts/so-loi', { params: p }));
};
export const loiGhi = (muc: GhiLoi[]) => d<{ moi: number; congDon: number }>(api.post('/ielts/so-loi/ghi', { muc }));
export const loiSua = (id: number, b: { lyDo?: string | null; congThuc?: string | null }) => d<MucLoi>(api.patch(`/ielts/so-loi/${id}`, b));
export const loiXoa = (id: number) => d<{ daXoa: boolean }>(api.delete(`/ielts/so-loi/${id}`));
export const loiLamLai = (id: number, dung: boolean, traLoi?: string) => d<MucLoi>(api.post(`/ielts/so-loi/${id}/lam-lai`, { dung, traLoi }));
export const loiGoiY = (id: number) => d<{ goiY: { lyDo: string | null; congThuc: string } | null; lyDo?: string }>(api.post(`/ielts/so-loi/${id}/goi-y`, {}, { timeout: 120_000 }));

export const LY_DO_NHAN: Record<string, string> = {
  paraphrase: 'Bẫy paraphrase / đồng nghĩa',
  'so-tu': 'Không đọc kỹ yêu cầu số từ',
  'chinh-ta': 'Sai chính tả',
  'ngu-phap': 'Sai ngữ pháp (số ít/nhiều, dạng từ)',
  'ng-false': 'Nhầm NOT GIVEN với FALSE/NO',
  'doc-sot': 'Đọc lướt sót ý / sai vị trí',
  'nghe-sot': 'Nghe sót / không theo kịp',
  'tu-vung': 'Không biết từ',
  'het-gio': 'Hết giờ / bỏ trống',
  khac: 'Lý do khác',
};
export const TEN_KY_NANG_LOI: Record<KyNangLoi, string> = { doc: 'Reading', nghe: 'Listening', viet: 'Writing', noi: 'Speaking', tuvung: 'Từ vựng' };

/* ── Phòng thi máy tính ── */
export type LuotThi = { id: number; deId: string; kyNang: string; cheDo: 'practice' | 'full'; dung: number | null; tong: number | null; band: number | null; giay: number; createdAt: string; chiTiet?: Record<string, unknown> | null };
export const thiDsLuot = (deId?: string) => d<{ items: LuotThi[] }>(api.get('/ielts/thi-may/luot', { params: deId ? { deId } : {} }));
export const thiMotLuot = (id: number) => d<LuotThi>(api.get(`/ielts/thi-may/luot/${id}`));
export const thiLuuLuot = (b: { deId: string; kyNang: string; cheDo: string; dung?: number | null; tong?: number | null; band?: number | null; giay: number; chiTiet: Record<string, unknown> }) =>
  d<{ id: number; band: number | null }>(api.post('/ielts/thi-may/luot', b));
export type KetQuaViet = {
  tieuChi: { ma: string; ten: string; band: number; manh: string; sua: string }[];
  band: number; loi: { goc: string; sua: string; vi: string }[]; banVietLai: string; nhanXet: string;
};
/**
 * AI chấm Writing chạy NỀN: POST nhận `viecId`, rồi hỏi lại mỗi 4 giây (tối đa ~6 phút).
 * Một bài Task 2 mất ~1–2 phút — quá trần 100 giây Cloudflare nếu chờ thẳng một yêu cầu.
 */
export async function thiChamViet(b: { bai: string; de: string; task: 1 | 2; moTaHinh?: string }, onCho?: (giay: number) => void) {
  type Kq = { ketQua: KetQuaViet | null; lyDo?: string; soTu?: number; thongBao?: string };
  const bd = await d<Kq & { viecId: string | null }>(api.post('/ielts/thi-may/cham-viet', b));
  if (!bd.viecId) return bd as Kq;
  const t0 = Date.now();
  while (Date.now() - t0 < 6 * 60_000) {
    await new Promise((r) => setTimeout(r, 4000));
    onCho?.(Math.round((Date.now() - t0) / 1000));
    try {
      const r = await d<Kq & { xong: boolean }>(api.get(`/ielts/thi-may/cham-viet/${encodeURIComponent(bd.viecId)}`));
      if (r.xong) return r as Kq;
    } catch { /* mạng chập chờn: hỏi lại lượt sau */ }
  }
  return { ketQua: null, lyDo: 'qua_lau' } as Kq;
}
export const thiCapNhatLuot = (id: number, b: { band: number | null; chiTiet: Record<string, unknown> }) =>
  d<{ id: number; band: number | null }>(api.patch(`/ielts/thi-may/luot/${id}`, b));
