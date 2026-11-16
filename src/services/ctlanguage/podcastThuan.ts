/**
 * CT Language — PODCAST theo cấp (16/11/2026): khuôn + luật kiểm (THUẦN — test đọc).
 *
 * User: "app có mục Podcast bằng tiếng theo bài từ cơ bản đến nâng cao để nghe và học chưa? chạm vào từ không biết để
 * xem nghĩa và cách đọc + từ vựng… Podcast tự viết, có ý nghĩa". Mỗi tập là một KỊCH BẢN tự soạn (không chép nguồn nào):
 * 1–3 người nói, mỗi câu một dòng có bản dịch Việt. KHÔNG có tệp âm thanh — app đọc từng dòng bằng giọng máy chủ
 * (`/ctlanguage/doc`, Azure Neural, lưu R2 theo băm) với giọng riêng của từng người ⇒ thêm tập = thêm một tệp JSON.
 *
 * Nội dung: `content/ctlanguage/podcast/<nn>/<id>.json`.
 */

export const NN_PODCAST = ['en', 'ja', 'zh'] as const;
export type NnPodcast = (typeof NN_PODCAST)[number];

/** Cấp theo thứ tự dễ → khó của từng ngôn ngữ. */
export const CAP_PODCAST: Record<NnPodcast, readonly string[]> = {
  en: ['A1', 'A2', 'B1', 'B2', 'C1'],
  ja: ['N5', 'N4', 'N3', 'N2', 'N1'],
  zh: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'],
};

/** Giọng máy chủ hợp lệ theo ngôn ngữ (khớp `GIONG` ở `services/ielts/docTo.service.ts`). */
export const GIONG_PODCAST: Record<NnPodcast, readonly string[]> = {
  en: ['us-nu', 'us-nam', 'uk-nu', 'uk-nam', 'au-nu', 'au-nam'],
  ja: ['ja-nu', 'ja-nam', 'ja2-nu', 'ja2-nam'],
  zh: ['zh-nu', 'zh-nam'],
};

/** Danh mục (16/11/2026 — user): mặc định "Đời sống". Thứ tự = thứ tự hiện trên app. */
export const DANH_MUC_PODCAST = [
  { ma: 'doi-song', ten: 'Đời sống', moTa: 'Câu và hội thoại hằng ngày — từ cơ bản nhất tới hay dùng nhất, ra đường gặp người nước ngoài là dùng được', bieuTuong: 'house.fill' },
  { ma: 'chia-se', ten: 'Podcast chia sẻ', moTa: 'Một người kể chuyện đời, trải nghiệm, bài học thật — như nghe podcast', bieuTuong: 'mic.fill' },
  { ma: 'phan-mem', ten: 'Software Engineering', moTa: 'Từ cơ bản tới chuyên sâu: họp nhóm, code review, phỏng vấn kỹ thuật, thiết kế hệ thống', bieuTuong: 'chevron.left.forwardslash.chevron.right' },
  { ma: 'cong-viec', ten: 'Công sở & phỏng vấn', moTa: 'Đi làm, xin việc, email, họp, báo cáo — nói lịch sự và chuyên nghiệp', bieuTuong: 'briefcase.fill' },
] as const;
export type DanhMucPodcast = (typeof DANH_MUC_PODCAST)[number]['ma'];
export const MA_DANH_MUC: readonly string[] = DANH_MUC_PODCAST.map((d) => d.ma);

/** Kiểu của một cách nói khác. */
export const KIEU_KHAC = ['lịch sự', 'thân mật', 'trang trọng', 'tự nhiên hơn', 'ngắn gọn', 'chuyên nghiệp', 'mềm mỏng', 'nhấn mạnh', 'văn nói', 'văn viết'] as const;

export interface CachNoiKhac { kieu: string; t: string; doc?: string; v: string; ghiChu?: string }

export interface NguoiNoi { ma: string; ten: string; giong: string; vai?: string }
export interface DongPodcast {
  /** mã người nói (`nguoi[].ma`) */
  ai: string;
  /** câu gốc (tiếng đang học) */
  t: string;
  /** cách đọc cả câu: tiếng Nhật = hiragana/katakana, tiếng Trung = pinyin có dấu; tiếng Anh bỏ trống */
  doc?: string;
  /** bản dịch tiếng Việt */
  v: string;
  /** Cách nói khác cho cùng ý (lịch sự / thân mật / trang trọng…) — app hiện khi chạm "Cách nói khác". */
  khac?: CachNoiKhac[];
  /** Ngữ pháp học được từ câu này (16/11/2026 — user: "học ngữ pháp từ từng câu"). */
  np?: NguPhapCau[];
}

/** Một điểm ngữ pháp trong câu: mẫu (trích từ câu) + giải thích tiếng Việt + ví dụ khác (tuỳ chọn). */
export interface NguPhapCau { mau: string; giai: string; vd?: string; vdDoc?: string; vdV?: string }
export interface TuPodcast { chu: string; doc?: string; nghia: string; vd?: string }
export interface CauHoiPodcast { hoi: string; chon: string[]; dung: number; giai?: string }
export interface TapPodcast {
  id: string;
  nn: NnPodcast;
  /** danh mục — thiếu ⇒ "doi-song" */
  danhMuc?: DanhMucPodcast;
  cap: string;
  /** thứ tự trong cấp (1, 2, 3…) — duy nhất trong (ngôn ngữ, danh mục, cấp) */
  so: number;
  tieuDe: string;
  tieuDeViet: string;
  moTa: string;
  /** chủ đề ngắn: "Gia đình", "Công việc"… */
  chuDe: string;
  /** SF Symbol cho bìa tập */
  bieuTuong: string;
  nguoi: NguoiNoi[];
  loi: DongPodcast[];
  tuVung: TuPodcast[];
  /** "Điều đáng nhớ" — thông điệp/ý nghĩa của tập (tiếng Việt) */
  yNghia: string;
  /** mẹo ngữ pháp / cách dùng rút từ tập (tiếng Việt), tuỳ chọn */
  meo?: string[];
  cauHoi: CauHoiPodcast[];
}

const ID = /^(en|ja|zh)-[a-z0-9]+(-[a-z0-9]+)*-\d{2}$/;
const SF = /^[a-z0-9.]+$/;

/** Danh sách lỗi của một tập (rỗng = hợp lệ). */
export function kiemTap(t: TapPodcast): string[] {
  const loi: string[] = [];
  const chuoi = (x: unknown, ten: string, max = 4000) => {
    if (typeof x !== 'string' || !x.trim()) loi.push(`thiếu ${ten}`);
    else if (x.length > max) loi.push(`${ten} quá dài`);
  };
  if (!t || typeof t !== 'object') return ['không phải object'];
  if (!NN_PODCAST.includes(t.nn)) return [`nn lạ: ${String(t.nn)}`];
  if (typeof t.id !== 'string' || !ID.test(t.id) || !t.id.startsWith(`${t.nn}-`)) loi.push(`id sai khuôn: ${String(t.id)}`);
  if (!CAP_PODCAST[t.nn].includes(t.cap)) loi.push(`cap lạ: ${String(t.cap)}`);
  if (t.danhMuc !== undefined && !MA_DANH_MUC.includes(t.danhMuc)) loi.push(`danhMuc lạ: ${String(t.danhMuc)}`);
  if (!Number.isInteger(t.so) || t.so < 1 || t.so > 99) loi.push('so phải là số nguyên 1–99');
  chuoi(t.tieuDe, 'tieuDe', 120);
  chuoi(t.tieuDeViet, 'tieuDeViet', 120);
  chuoi(t.moTa, 'moTa', 400);
  chuoi(t.chuDe, 'chuDe', 40);
  chuoi(t.yNghia, 'yNghia', 600);
  if (typeof t.bieuTuong !== 'string' || !SF.test(t.bieuTuong)) loi.push('bieuTuong phải là tên SF Symbol');

  const giongHop = GIONG_PODCAST[t.nn];
  const ma = new Set<string>();
  if (!Array.isArray(t.nguoi) || t.nguoi.length < 1 || t.nguoi.length > 3) loi.push('nguoi: 1–3 người');
  else for (const n of t.nguoi) {
    if (!n?.ma || ma.has(n.ma)) loi.push(`nguoi.ma trùng/thiếu: ${String(n?.ma)}`);
    ma.add(n?.ma);
    chuoi(n?.ten, 'nguoi.ten', 40);
    if (!giongHop.includes(n?.giong)) loi.push(`giọng ${String(n?.giong)} không hợp lệ cho ${t.nn}`);
  }
  if (Array.isArray(t.nguoi) && new Set(t.nguoi.map((n) => n.giong)).size < t.nguoi.length) loi.push('hai người nói trùng giọng');

  if (!Array.isArray(t.loi) || t.loi.length < 6 || t.loi.length > 80) loi.push('loi: 6–80 dòng');
  else t.loi.forEach((d, i) => {
    if (!ma.has(d?.ai)) loi.push(`loi[${i}].ai không có trong nguoi`);
    chuoi(d?.t, `loi[${i}].t`, 400);
    chuoi(d?.v, `loi[${i}].v`, 600);
    if (t.nn !== 'en' && (typeof d?.doc !== 'string' || !d.doc.trim())) loi.push(`loi[${i}].doc thiếu (bắt buộc với ${t.nn})`);
    if (d?.np !== undefined) {
      if (!Array.isArray(d.np) || d.np.length < 1 || d.np.length > 3) loi.push(`loi[${i}].np: 1–3 điểm`);
      else d.np.forEach((g, j) => {
        chuoi(g?.mau, `loi[${i}].np[${j}].mau`, 80);
        chuoi(g?.giai, `loi[${i}].np[${j}].giai`, 600);
        if (g?.vd !== undefined && (typeof g.vd !== 'string' || !g.vd.trim())) loi.push(`loi[${i}].np[${j}].vd rỗng`);
        if (g?.vd && t.nn !== 'en' && (typeof g.vdDoc !== 'string' || !g.vdDoc.trim())) loi.push(`loi[${i}].np[${j}].vdDoc thiếu`);
        if (g?.vd && (typeof g.vdV !== 'string' || !g.vdV.trim())) loi.push(`loi[${i}].np[${j}].vdV thiếu`);
      });
    }
    if (d?.khac !== undefined) {
      if (!Array.isArray(d.khac) || d.khac.length < 1 || d.khac.length > 4) loi.push(`loi[${i}].khac: 1–4 cách`);
      else d.khac.forEach((k, j) => {
        if (!(KIEU_KHAC as readonly string[]).includes(k?.kieu)) loi.push(`loi[${i}].khac[${j}].kieu lạ: ${String(k?.kieu)}`);
        chuoi(k?.t, `loi[${i}].khac[${j}].t`, 400);
        chuoi(k?.v, `loi[${i}].khac[${j}].v`, 600);
        if (t.nn !== 'en' && (typeof k?.doc !== 'string' || !k.doc.trim())) loi.push(`loi[${i}].khac[${j}].doc thiếu`);
        if (k?.t === d.t) loi.push(`loi[${i}].khac[${j}] trùng câu gốc`);
      });
    }
  });

  if (!Array.isArray(t.tuVung) || t.tuVung.length < 4 || t.tuVung.length > 30) loi.push('tuVung: 4–30 từ');
  else t.tuVung.forEach((w, i) => {
    chuoi(w?.chu, `tuVung[${i}].chu`, 60);
    chuoi(w?.nghia, `tuVung[${i}].nghia`, 200);
    if (t.nn !== 'en' && (typeof w?.doc !== 'string' || !w.doc.trim())) loi.push(`tuVung[${i}].doc thiếu`);
    const coTrongBai = Array.isArray(t.loi) && t.loi.some((d) => typeof d?.t === 'string' && d.t.toLowerCase().includes(String(w?.chu ?? '').toLowerCase()));
    if (w?.chu && !coTrongBai) loi.push(`tuVung[${i}] "${w.chu}" không xuất hiện trong lời`);
  });

  if (!Array.isArray(t.cauHoi) || t.cauHoi.length < 2 || t.cauHoi.length > 8) loi.push('cauHoi: 2–8 câu');
  else t.cauHoi.forEach((c, i) => {
    chuoi(c?.hoi, `cauHoi[${i}].hoi`, 300);
    if (!Array.isArray(c?.chon) || c.chon.length < 2 || c.chon.length > 5 || c.chon.some((x) => typeof x !== 'string' || !x.trim())) loi.push(`cauHoi[${i}].chon: 2–5 lựa chọn`);
    else if (new Set(c.chon).size !== c.chon.length) loi.push(`cauHoi[${i}].chon trùng`);
    if (!Number.isInteger(c?.dung) || c.dung < 0 || c.dung >= (c?.chon?.length ?? 0)) loi.push(`cauHoi[${i}].dung ngoài phạm vi`);
  });
  if (t.meo !== undefined && (!Array.isArray(t.meo) || t.meo.some((m) => typeof m !== 'string' || !m.trim()))) loi.push('meo phải là mảng chuỗi');
  return loi;
}

/** Ước số phút nghe (~2,6 từ/giây tiếng Anh; ~6 ký tự/giây Nhật/Trung) + nghỉ giữa câu. */
export function uocPhut(t: TapPodcast): number {
  const giay = t.loi.reduce((s, d) => s + 0.6 + (t.nn === 'en' ? d.t.split(/\s+/).length / 2.6 : d.t.length / 6), 0);
  return Math.max(1, Math.round(giay / 60));
}

export function tomTatTap(t: TapPodcast) {
  return {
    id: t.id, nn: t.nn, danhMuc: danhMucCua(t), cap: t.cap, so: t.so, tieuDe: t.tieuDe, tieuDeViet: t.tieuDeViet, moTa: t.moTa,
    chuDe: t.chuDe, bieuTuong: t.bieuTuong, phut: uocPhut(t), soDong: t.loi.length, soTu: t.tuVung.length,
    nguoi: t.nguoi.map((n) => n.ten),
    soCachNoi: t.loi.reduce((s, d) => s + (d.khac?.length ?? 0), 0),
    soNguPhap: t.loi.reduce((s, d) => s + (d.np?.length ?? 0), 0),
  };
}

export function danhMucCua(t: TapPodcast): DanhMucPodcast { return t.danhMuc ?? 'doi-song'; }

/** Sắp tập: theo ngôn ngữ → cấp (dễ → khó) → số. */
export function soSanhTap(a: TapPodcast, b: TapPodcast): number {
  return NN_PODCAST.indexOf(a.nn) - NN_PODCAST.indexOf(b.nn)
    || MA_DANH_MUC.indexOf(danhMucCua(a)) - MA_DANH_MUC.indexOf(danhMucCua(b))
    || CAP_PODCAST[a.nn].indexOf(a.cap) - CAP_PODCAST[b.nn].indexOf(b.cap)
    || a.so - b.so || a.id.localeCompare(b.id);
}
