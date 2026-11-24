/**
 * Khoá KIỂU SÁCH (Dekiru, JP, CH, IELTS…) cho công cụ `hoc_lieu` — 24/11/2026.
 *
 * Nội dung các khoá này nằm trong mã frontend (TypeScript), không có trong CSDL. Mỗi lần `next build`, prebuild đã chạy
 * `frontend/scripts/sach-hoc-xuat.mts` xuất NGUYÊN VĂN dữ liệu (cùng luật ghép bài của web) ra JSON tĩnh công khai
 * `/sach-hoc/<khoa>/index.json` + `bai-<n>.json` cho app iOS. Backend đọc lại đúng JSON đó qua HTTP — không chép luật,
 * không chép nội dung, không cần React; web đổi bài thì lần deploy sau backend thấy y như vậy. Mức truy cập: các trang
 * khoá này CÔNG KHAI nên JSON cũng công khai — đọc ở đây không mở thêm quyền nào.
 *
 * Nguồn: `SACH_HOC_NGUON_URL` (vd. http://frontend:3000 trong mạng docker) hoặc `FRONTEND_URL`. Đệm theo `phienBan`
 * (sha256 nội dung) — mục lục kiểm lại mỗi 10 phút, tệp bài giữ tới khi phiên bản đổi.
 */
import { config } from '../../config/env.js';

/** Khoá sách đọc được. `bai`: link sâu tới buổi theo SỐ BÀI của sách (Dekiru: `?bai=1` = Bài 1). */
export const SACH: Record<string, { ten: string; trang: string; theoBai?: boolean }> = {
  dekiru: { ten: 'Tiếng Nhật できる日本語 (Dekiru — bài giảng trên lớp, JPD113 = Bài 1–3, JPD123 = Bài 4–7)', trang: '/language/ja/dekiru', theoBai: true },
  jp: { ten: 'JP · Tiếng Nhật từ 0 đến N1 (khoá tự soạn)', trang: '/language/ja/jp' },
  ch: { ten: 'CH · Tiếng Trung từ 0 đến HSK 6', trang: '/language/zh/ch' },
  ielts: { ten: 'IELTS 4 kỹ năng · Tập 1', trang: '/language/en/ielts' },
  'ielts-tap2': { ten: 'IELTS · Tập 2', trang: '/language/en/ielts/tap-2' },
  'ielts-tap3': { ten: 'IELTS · Tập 3', trang: '/language/en/ielts/tap-3' },
  'ielts-tap4': { ten: 'IELTS · Tập 4', trang: '/language/en/ielts/tap-4' },
  'ielts-tap5': { ten: 'IELTS · Tập 5', trang: '/language/en/ielts/tap-5' },
  'en-giao-tiep': { ten: 'Tiếng Anh giao tiếp 30 ngày', trang: '/language/en/giao-tiep' },
};

// ── Nhóm mục lục Dekiru — CHÉP từ frontend/src/app/language/[code]/dekiru/nhom.ts (đổi ở đó thì đổi ở đây). ──
const LOI = /^b\d+-(hoi-thoai|tu-vung|ngu-phap|han-lop|han-tu|nghe|doc|noi|viet|bai-tap|luyen-nho|doc-to|hinh-tu)$|^b0-/;
const BUOI_CO = /^(slot-|slide-tong-hop-|s113-|b\d+-buoi-)/;
const LUYEN = /^(lt-|b\d+-lt-)/;
const ON_THI = /^(bt-|on-giua-ky|chia-the-te-|b\d+-kiem-tra|b\d+-thi-thu)/;
const KHO = /^b\d+-kho-/;
export const TEN_NHOM: Record<string, string> = {
  kho: '📚 Kho từ theo chủ đề', loi: '① Học trước — phần cốt lõi', co: '② Học theo buổi trên lớp',
  luyen: '③ Luyện thêm — từ dễ đến khó', thi: '④ Ôn thi · kiểm tra · đáp án', bs: '⑤ Bổ sung & tra sách',
};
export const THU_TU_NHOM = ['kho', 'loi', 'co', 'luyen', 'thi', 'bs'] as const;
export function nhomDekiru(id: string): (typeof THU_TU_NHOM)[number] {
  if (KHO.test(id)) return 'kho';
  if (LOI.test(id)) return 'loi';
  if (BUOI_CO.test(id)) return 'co';
  if (LUYEN.test(id)) return 'luyen';
  if (ON_THI.test(id)) return 'thi';
  return 'bs';
}

export interface MucBai { id: string; kind: string; title: string; goal?: string; minutes?: number; ready?: boolean; blocks?: unknown[] }
export interface BuoiSach { n: number; so?: number; ten: string; phut?: number; bai: MucBai[]; tep?: string; hash?: string }
export interface MucLucSach { khoa: string; tieuDe: string; donVi?: string; phienBan: string; buoi: BuoiSach[] }

type Lay = (url: string) => Promise<unknown>;
const layMacDinh: Lay = async (url) => {
  const r = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.json();
};
let lay: Lay = layMacDinh;
/** Test thay đường mạng. */
export function _datNguonLay(f: Lay | null): void { lay = f ?? layMacDinh; nhoMucLuc.clear(); nhoBai.clear(); }

const goc = () => (process.env.SACH_HOC_NGUON_URL || config.frontendUrl || 'https://cuongthai.com').replace(/\/+$/, '');
const nhoMucLuc = new Map<string, { luc: number; d: MucLucSach }>();
const nhoBai = new Map<string, MucBai[]>();
const MUC_LUC_MS = 10 * 60_000;

export function khoaHopLe(khoa: string): boolean { return Object.prototype.hasOwnProperty.call(SACH, khoa); }

export async function mucLuc(khoa: string): Promise<MucLucSach> {
  if (!khoaHopLe(khoa)) throw new Error(`Không có khoá sách "${khoa}"`);
  const n = nhoMucLuc.get(khoa);
  if (n && Date.now() - n.luc < MUC_LUC_MS) return n.d;
  const d = (await lay(`${goc()}/sach-hoc/${khoa}/index.json`)) as MucLucSach;
  if (!d || !Array.isArray(d.buoi)) throw new Error(`Mục lục ${khoa} không đúng dạng`);
  nhoMucLuc.set(khoa, { luc: Date.now(), d });
  return d;
}

/** Buổi theo SỐ BÀI của sách (`so`, Dekiru: Bài 1) nếu có, không thì theo `n`. */
export function timBuoi(ml: MucLucSach, so: number): BuoiSach | undefined {
  return ml.buoi.find((b) => b.so === so) ?? ml.buoi.find((b) => b.n === so && b.so === undefined);
}

export async function noiDungBuoi(khoa: string, b: BuoiSach, phienBan: string): Promise<MucBai[]> {
  const khoaNho = `${khoa}:${b.n}:${phienBan}`;
  const co = nhoBai.get(khoaNho);
  if (co) return co;
  const d = (await lay(`${goc()}/sach-hoc/${khoa}/${b.tep || `bai-${b.n}.json`}`)) as { bai?: MucBai[]; lessons?: MucBai[] };
  const ds = d.bai ?? d.lessons ?? [];
  if (nhoBai.size > 60) nhoBai.clear();
  nhoBai.set(khoaNho, ds);
  return ds;
}

/** Link sâu tới một buổi trên web. */
export function linkBuoi(khoa: string, b: BuoiSach): string {
  const s = SACH[khoa]!;
  const base = config.frontendUrl?.replace(/\/+$/, '') || 'https://cuongthai.com';
  if (s.theoBai && b.so !== undefined) return `${base}${s.trang}?bai=${b.so}`;
  return `${base}${s.trang}`;
}
