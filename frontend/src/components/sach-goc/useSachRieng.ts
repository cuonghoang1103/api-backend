'use client';

/**
 * 📷 Sách gốc — dữ liệu dùng chung: quyền xem, mục lục trang, hướng dẫn từng trang.
 *
 * Ảnh và hướng dẫn chỉ đi qua backend `/api/v1/sach-rieng/*` (đăng nhập + đúng
 * tài khoản được phép) — không có tệp nào trong `public/` hay bundle. Người
 * không được phép: `/quyen` trả `coQuyen: false` và mục này không hiện.
 */
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useLangUser } from '@/components/language/primitives';

export type LoaiMuc =
  | 'mo-bai' | 'hanashite' | 'hoi-thoai' | 'yattemiyou' | 'ittemiyou' | 'kiitemiyou' | 'yondemiyou'
  | 'kaitemiyou' | 'dekiru' | 'kotoba' | 'point' | 'hyo' | 'khac';

export type MucTrang = { loai: LoaiMuc; ten?: string; topic?: number };

export type MucLuc = {
  soTrang: number;
  bai: { n: number; tu: number; den: number; point: [number, number] }[];
  phan: { ten: string; tu: number; den: number }[];
  trang: { p: number; bai: number | null; muc: MucTrang[]; tinCay: number | null; coHuongDan: boolean; point?: number[] }[];
};

/** Một câu tiếng Nhật kèm romaji + nghĩa (ai = người nói, vd "A", "B (từ chối)"). */
export type CauGiang = { ai?: string; ja: string; ro?: string; vi: string };
/**
 * 🎓 Giảng chi tiết MỘT bài tập trên trang (13/10/2026 — người học: "đoạn thoại mẫu
 * + tranh ①–④ phải giảng đầy đủ, hướng dẫn làm"). Soạn tay theo ảnh trang, ghép
 * vào lúc tải lên (scripts/sach-rieng/dekiru-tai-len.mts đọc giang/p-XXX.json).
 */
export type GiangPhan = {
  tieuDe: string;
  gioiThieu?: string;
  /** Hội thoại mẫu 例 đúng như sách. */
  mau?: CauGiang[];
  /** Giảng từng câu/cụm: trợ từ, chia động từ, ポイント. */
  phanTich?: { ja: string; ro?: string; vi: string; giai: string }[];
  /** Khung thay thế, chỗ trống ghi ［…］. */
  khung?: { mau: string; giai?: string }[];
  /** Các bước ghép câu từ gợi ý. */
  buoc?: string[];
  /** Từng gợi ý/tranh: 例 ①②③④ — từ cần dùng + câu hoàn chỉnh. */
  tranh?: { so: string; goiY: string; tu?: { w: string; ro?: string; vi: string }[]; cau: CauGiang[]; ghiChu?: string }[];
  loiSai?: string[];
  /** Nói về bản thân người học. */
  moRong?: CauGiang[];
};

export type HuongDan = {
  trang: number;
  bai: number | null;
  muc: MucTrang[];
  tinCay?: number;
  tomTat?: string;
  mucTieu?: string;
  tuMoi?: { w: string; ro?: string; vi: string }[];
  nguPhap?: { point?: number; mau: string; y?: string }[];
  cau?: { ja: string; ro?: string; vi: string }[];
  tranh?: { so?: string; moTa: string }[];
  cachLam?: string[];
  cauHoiCo?: { ja: string; ro?: string; vi?: string; traLoi?: string; traLoiRo?: string; traLoiVi?: string }[];
  luuY?: string[];
  giang?: GiangPhan[];
};

/** Nhãn + màu từng loại mục (khớp chữ in trên sách). */
export const TEN_MUC: Record<LoaiMuc, { ja: string; vi: string; mau: string }> = {
  'mo-bai': { ja: '課・トピック', vi: 'Mở đầu bài / chủ đề', mau: '#64748b' },
  hanashite: { ja: '話してみよう', vi: 'Khởi động nói', mau: '#a855f7' },
  'hoi-thoai': { ja: 'チャレンジ！', vi: 'Tình huống · hội thoại', mau: '#e11d48' },
  yattemiyou: { ja: 'やってみよう', vi: 'Thử làm', mau: '#f97316' },
  ittemiyou: { ja: '言ってみよう', vi: 'Thử nói', mau: '#ec4899' },
  kiitemiyou: { ja: '聞いてみよう', vi: 'Thử nghe', mau: '#0ea5e9' },
  yondemiyou: { ja: '読んでみよう', vi: 'Thử đọc', mau: '#16a34a' },
  kaitemiyou: { ja: '書いてみよう', vi: 'Thử viết', mau: '#8b5cf6' },
  dekiru: { ja: 'できる！', vi: 'Tự đánh giá', mau: '#0d9488' },
  kotoba: { ja: 'ことば', vi: 'Từ vựng', mau: '#10b981' },
  point: { ja: 'ポイント', vi: 'Ngữ pháp', mau: '#f59e0b' },
  hyo: { ja: '表', vi: 'Bảng', mau: '#b45309' },
  khac: { ja: 'その他', vi: 'Khác', mau: '#94a3b8' },
};

export const urlAnh = (p: number, nho = false) => `/api/v1/sach-rieng/dekiru/trang/${p}${nho ? '?nho=1' : ''}`;

/* ── Ảnh trang trong APP DESKTOP (05/10/2026) ──────────────────────────────
 * Web dùng thẳng `urlAnh` làm `src`: cùng tên miền, cookie đăng nhập tự đi kèm.
 * App chạy ở `app://cuongthai` — đường tương đối trỏ vào app, và thẻ <img> không
 * gửi được khoá phiên ⇒ "Không tải được trang". Ở app: tải qua axios (đã gắn máy
 * chủ thật + khoá phiên) thành blob, giữ trong bộ nhớ đệm nhỏ (lật qua lại tức thì).
 */
const laApp = () => typeof window !== 'undefined' && window.location.protocol === 'app:';
const demAnh = new Map<string, Promise<string>>();
function taiAnhApp(duong: string): Promise<string> {
  const co = demAnh.get(duong);
  if (co) return co;
  const p = api.get(duong.replace(/^\/api\/v1/, ''), { responseType: 'blob' }).then((r) => URL.createObjectURL(r.data as Blob));
  p.catch(() => demAnh.delete(duong));
  demAnh.set(duong, p);
  if (demAnh.size > 60) { // bỏ ảnh cũ nhất, trả bộ nhớ
    const [k, v] = demAnh.entries().next().value as [string, Promise<string>];
    demAnh.delete(k);
    void v.then((u) => URL.revokeObjectURL(u)).catch(() => {});
  }
  return p;
}

/** Nạp trước trang kế/trước — web dùng Image(), app kéo vào bộ đệm blob. */
export function taiTruocAnh(p: number) {
  if (laApp()) void taiAnhApp(urlAnh(p)).catch(() => {});
  else { const i = new Image(); i.src = urlAnh(p); }
}

/** `src` dùng được cho ảnh trang: web = URL thẳng; app = blob đã tải (rỗng khi đang tải, 'loi' khi hỏng). */
export function useAnhTrang(p: number, nho = false): string {
  const duong = urlAnh(p, nho);
  const [src, setSrc] = useState<string>(() => (laApp() ? '' : duong));
  useEffect(() => {
    if (!laApp()) { setSrc(duong); return; }
    let huy = false;
    setSrc('');
    taiAnhApp(duong).then((u) => { if (!huy) setSrc(u); }).catch(() => { if (!huy) setSrc('loi'); });
    return () => { huy = true; };
  }, [duong]);
  return src;
}

let quyenDem: Promise<boolean> | null = null;

/** true = tài khoản này xem được Sách gốc. null = đang hỏi. */
export function useQuyenSachRieng(): boolean | null {
  const { isAuthenticated } = useLangUser();
  const [co, setCo] = useState<boolean | null>(null);
  useEffect(() => {
    if (!isAuthenticated) { setCo(false); return; }
    let live = true;
    quyenDem ??= api.get('/sach-rieng/quyen')
      .then((r) => !!r.data?.data?.coQuyen)
      .catch(() => { quyenDem = null; return false; });
    quyenDem.then((v) => { if (live) setCo(v); });
    return () => { live = false; };
  }, [isAuthenticated]);
  return co;
}

let mucLucDem: Promise<MucLuc> | null = null;
export function layMucLuc(): Promise<MucLuc> {
  mucLucDem ??= api.get('/sach-rieng/dekiru/muc-luc').then((r) => r.data.data as MucLuc).catch((e) => { mucLucDem = null; throw e; });
  return mucLucDem;
}

const hdDem = new Map<number, Promise<HuongDan | null>>();
export function layHuongDan(p: number): Promise<HuongDan | null> {
  let x = hdDem.get(p);
  if (!x) {
    x = api.get(`/sach-rieng/dekiru/huong-dan/${p}`).then((r) => (r.data.data as HuongDan) ?? null).catch((e) => { hdDem.delete(p); throw e; });
    hdDem.set(p, x);
  }
  return x;
}

/** Loại bài của khoá → mục tương ứng trong sách (để nút trong bài mở đúng chỗ). */
export const MUC_CUA_KIND: Record<string, LoaiMuc | undefined> = {
  conversation: 'hoi-thoai', vocab: 'kotoba', grammar: 'point', kanji: 'kotoba',
  listening: 'kiitemiyou', speaking: 'ittemiyou', reading: 'yondemiyou', writing: 'kaitemiyou',
  homework: 'yattemiyou', review: 'mo-bai',
};

/** Trang đầu tiên của bài n có mục `loai` (ngữ pháp: trang ポイント cuối sách có ポイント của bài). */
export function timTrang(ml: MucLuc, n: number, loai?: LoaiMuc): number {
  const b = ml.bai.find((x) => x.n === n);
  if (!b) return 1;
  if (!loai || loai === 'mo-bai') return b.tu;
  if (loai === 'point') {
    const t = ml.trang.find((t) => t.p >= 270 && t.p <= 281 && t.point?.some((k) => k >= b.point[0] && k <= b.point[1]));
    if (t) return t.p;
  }
  const t = ml.trang.find((t) => t.p >= b.tu && t.p <= b.den && t.muc.some((m) => m.loai === loai));
  return t?.p ?? b.tu;
}

/** Nhãn ngắn của một mục: mục `khac` thì dùng đúng tên in trên sách (vd. 教室の外へ). */
export function nhanMuc(m: MucTrang): string {
  if (m.loai === 'khac' && m.ten) return m.ten.replace(/\{([^|}]+)\|[^}]+\}/g, '$1').slice(0, 14);
  return TEN_MUC[m.loai]?.ja ?? m.loai;
}

/** 🎧 Một track nghe CD đã chép + dịch (bản chép riêng, chỉ tài khoản được phép). */
export type TrackNghe = {
  track: number;
  lesson: number;
  ten: string;
  tinCay: 'cao' | 'vua' | 'thap';
  loi: { ai?: string; ja: string; ro?: string; vi: string }[];
  ghiChu?: string[];
  nghiNgo?: string[];
};

export function layNghe(): Promise<TrackNghe[]> {
  return api.get('/sach-rieng/dekiru/nghe').then((r) => r.data.data as TrackNghe[]);
}

/* ── 🖼️ Tài liệu gốc JPD123 + âm thanh track CD (23/10/2026) — cùng cổng quyền với Sách gốc ───────────────── */
export type TaiLieuGoc = { id: string; nhom: string; ten: string; soTrang: number; bai?: number; lienKet: string[] };
export type DanhMucTaiLieu = { taiLieu: TaiLieuGoc[]; lienNgoai: Array<{ ten: string; url: string }>; track: number[] };

export const NHOM_TAI_LIEU: Array<{ id: string; ten: string; mota: string }> = [
  { id: 'slide-lop', ten: 'Slide của cô (Slot 1–20, 30)', mota: 'Đúng slide cô dạy trên lớp, theo thứ tự buổi.' },
  { id: 'tong-hop', ten: 'Slide tổng hợp từ vựng & ngữ pháp', mota: 'Bộ slide ôn nhanh từng bài (4–7).' },
  { id: 'bai-tap', ten: 'Bài tập của cô', mota: 'BT từ vựng, ngữ pháp, chia thể て (đề gốc để tự làm).' },
  { id: 'on-thi', ten: 'Đề ôn giữa kỳ & cuối kỳ', mota: 'Đề ôn của cô: giữa kỳ, Kanji, ngữ pháp, chữ Hán cuối kỳ.' },
  { id: 'thi-noi', ten: 'Thi nói', mota: 'Hướng dẫn thi nói + bài mẫu.' },
  { id: 'doc-them', ten: 'Bài đọc thêm (Irodori)', mota: 'Đọc thêm khi muốn luyện đọc.' },
  { id: 'tu-moi', ten: 'Danh sách từ mới', mota: 'Toàn bộ từ mới Dekiru Nihongo.' },
];

let taiLieuDem: Promise<DanhMucTaiLieu> | null = null;
export function layTaiLieu(): Promise<DanhMucTaiLieu> {
  taiLieuDem ??= api.get('/sach-rieng/dekiru/tai-lieu').then((r) => r.data.data as DanhMucTaiLieu).catch((e) => { taiLieuDem = null; throw e; });
  return taiLieuDem;
}
export const urlTaiLieu = (id: string, p: number) => `/api/v1/sach-rieng/dekiru/tai-lieu/${encodeURIComponent(id)}/${p}`;
export const urlAmNghe = (track: number) => `/api/v1/sach-rieng/dekiru/nghe/am/${track}`;

/** `src` cho một ảnh riêng tư bất kỳ (web = URL thẳng; app = blob qua axios). Chỉ nạp khi `bat` = true. */
export function useAnhDuong(duong: string, bat = true): string {
  const [src, setSrc] = useState<string>('');
  useEffect(() => {
    if (!bat) return;
    if (!laApp()) { setSrc(duong); return; }
    let huy = false;
    taiAnhApp(duong).then((u) => { if (!huy) setSrc(u); }).catch(() => { if (!huy) setSrc('loi'); });
    return () => { huy = true; };
  }, [duong, bat]);
  return src;
}

/** Tải âm thanh thành blob URL (cần cookie đăng nhập; chạy được cả trong app). */
export async function taiAmThanh(track: number): Promise<string> {
  const r = await api.get(urlAmNghe(track).replace(/^\/api\/v1/, ''), { responseType: 'blob' });
  return URL.createObjectURL(r.data as Blob);
}
