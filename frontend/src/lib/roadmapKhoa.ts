/**
 * Roadmap sơ đồ đầu khoá (28/11/2026) — bộ DỰNG dữ liệu sơ đồ từ chương/bài thật của khoá + mô tả 4 ý mỗi bài.
 *
 * Hình (kiểu roadmap.sh/backend): trục dọc ở giữa là các CHƯƠNG (ô vàng), nhánh hai bên là BÀI (ô nhạt) nối bằng
 * đường chấm — trái là bài học lý thuyết, phải là thực hành & kiểm tra (lab, Code Lab, quiz, mốc dự án, đề thi).
 * Thứ tự từ trên xuống đúng thứ tự học (sortOrder).
 *
 * Nguồn:
 *   • `sections` của khoá (API `/courses/:slug`) — id thật để nút "Vào học" mở đúng bài (`?lessonId=`);
 *   • `meta` từ `GET /courses/:slug/roadmap` (content/roadmap-khoa/<slug>.json) — 4 ý: học gì · cần biết trước ·
 *     học xong làm được gì · kết hợp với. Thiếu ⇒ lùi về mô tả bài + bài liền trước + lab/quiz cùng chương.
 *
 * Hàm thuần (không React) ⇒ test được (`npx tsx --test frontend/src/lib/roadmapKhoa.test.ts`) và app dùng lại được.
 */

export type LoaiNut =
  | 'bat-dau' // ⭐ Bắt đầu tại đây / giới thiệu / cài đặt
  | 'bai' // bài giảng (video + bài đọc)
  | 'slide' // học theo slide của trường
  | 'lab'
  | 'code-lab'
  | 'quiz'
  | 'du-an' // 🛠 mốc dự án / 🎓 bảo vệ dự án
  | 'de-thi' // PE / FE / PT, chữa đề
  | 'on-tap' // 🧪 luyện tập + tổng kết chương
  | 'chuyen-sau' // ⭐ phần chuyên sâu (CS.x) — nâng cao sau bài của trường
  | 'tai-lieu';

export type TrangThai = 'xong' | 'dang' | 'chua';

export interface BaiVao {
  id: number; slug?: string | null; title: string; description?: string | null; lessonType?: string | null;
  videoDurationSeconds?: number | null; sortOrder?: number; isFreePreview?: boolean;
}
export interface ChuongVao { id: number; title: string; description?: string | null; sortOrder?: number; lessons?: BaiVao[] }

export interface MoTaBai {
  hoc: string; canBiet: string; lamDuoc: string; ketHop: string;
  canBietBai?: string[]; ketHopBai?: string[]; ketHopKhoa?: string[];
}
export interface MetaRoadmap {
  khoa?: string;
  chuong?: Record<string, { hoc?: string; lamDuoc?: string }>;
  bai?: Record<string, MoTaBai>;
  khoaTen?: Record<string, string>;
}

export interface LienKetBai { id: number; ten: string; loai: LoaiNut }
export interface LienKetKhoa { slug: string; ten: string }

export interface NutRoadmap {
  id: number; slug: string; ten: string; so: string | null; loai: LoaiNut; ben: 'trai' | 'phai';
  thoiLuong: number; trangThai: TrangThai; hocThu: boolean;
  /** Vị trí trong thứ tự học toàn khoá (0-based) — dùng cho phím ↑/↓ và "bài trước / bài sau". */
  thuTu: number;
  hoc: string; canBiet: string; lamDuoc: string; ketHop: string;
  canBietBai: LienKetBai[]; ketHopBai: LienKetBai[]; ketHopKhoa: LienKetKhoa[];
  /** true = 4 ý do biên soạn (meta); false = lùi về mô tả sẵn có. */
  coMoTa: boolean;
}
export interface ChangRoadmap {
  id: number; so: number; ten: string; nhan: string; moTa: string; hoc: string; lamDuoc: string;
  nut: NutRoadmap[]; tong: number; xong: number; thoiLuong: number; trangThai: TrangThai;
}
export interface RoadmapDung {
  chang: ChangRoadmap[]; tongNut: number; soXong: number; soCoMoTa: number; nutHienTai: number | null;
}

/** Tách "EN|||VI" theo ngôn ngữ (giống pickLang của web, nhưng không kéo cả utils vào). */
export const chonNgu = (s: string | null | undefined, lang: 'vi' | 'en' = 'vi') => {
  const p = String(s ?? '').split('|||');
  if (p.length < 2) return p[0].trim();
  return (lang === 'en' ? p[0] : p[1]).trim() || p[0].trim();
};

/** Đoán loại nút từ slug / tiêu đề / lessonType (quét thật 14 khoá đủ chuẩn, 28/11/2026). */
export function loaiBai(b: Pick<BaiVao, 'slug' | 'title' | 'lessonType'>): LoaiNut {
  const s = String(b.slug ?? '').toLowerCase();
  const t = chonNgu(b.title, 'en') + ' ' + chonNgu(b.title, 'vi');
  const tl = t.toLowerCase();
  if (b.lessonType === 'QUIZ' || /(^|-)quiz(-|$)/.test(s) || /\bquiz\b|kiểm tra chương/i.test(t)) return 'quiz';
  if (/tai-lieu-tham-khao/.test(s)) return 'tai-lieu';
  if (/(^|-)moc-\d|bao-ve-du-an|du-an-cuoi/.test(s) || /^\s*[🛠🎓]/u.test(chonNgu(b.title, 'vi'))) return 'du-an';
  if (/(^|-)(pe|fe|pt)\d*(-|$)|chua-tron-de|chua-de|de-thi|-thi-thuc-hanh|-thi-cuoi/.test(s) || /\b(PE|FE|PT)\d*\b.*(solved|đề)|chữa (trọn )?đề|final exam|practical exam/i.test(t)) return 'de-thi';
  if (/code-?lab/.test(s) || /code lab/i.test(tl)) return 'code-lab';
  if (/(^|-)lab(-|\d|$)/.test(s) || /^\s*lab\s*\d/i.test(chonNgu(b.title, 'vi')) || /^\s*lab\s*\d/i.test(chonNgu(b.title, 'en'))) return 'lab';
  if (/(^|-)on-ch|on-tap|luyen-tap|tong-ket/.test(s) || /🧪/u.test(t)) return 'on-tap';
  if (/slide/.test(s) || /📑|slide by slide|học theo (từng )?slide|—\s*Slide\b|\bSlide:|slide bài giảng|slide gốc/i.test(t)) return 'slide';
  const tenVi = chonNgu(b.title, 'vi');
  // "⭐ Bắt đầu tại đây", "⭐ Cài môi trường", "⭐ Buổi thực hành đầu tiên" là điểm vào; "⭐ CS.3"/"⭐ Chuyên sâu" là phần nâng cao.
  if (/bat-dau-tai-day|start-here|cai-moi-truong|hoc-the-nao|dieu-kien-qua-mon|chuan-dau-ra|buoi-dau-tien|(^|-)0-\d+[a-z]?-(gioi-thieu|cai-dat|cach-hoc|cong-cu)/.test(s)
    || /^[a-z0-9]+-(gioi-thieu|cai-dat|cong-cu|cach-hoc)$/.test(s)
    || (/^\s*⭐/u.test(tenVi) && !/chuyên sâu|deep dive|\bCS\./i.test(t) && /bắt đầu|start here|cài|install|buổi .*đầu|first/i.test(t))) return 'bat-dau';
  if (/^\s*⭐/u.test(tenVi) || /(^|-)cs\d|chuyen-sau/.test(s) || /chuyên sâu|deep dive/i.test(t)) return 'chuyen-sau';
  return 'bai';
}

/** Bên của nhánh: lý thuyết ⇒ trái, thực hành & kiểm tra ⇒ phải. */
export const LOAI_PHAI: ReadonlySet<LoaiNut> = new Set<LoaiNut>(['lab', 'code-lab', 'quiz', 'du-an', 'de-thi', 'on-tap']);

/** "3.2 — Khoá ngoại…" ⇒ số "3.2" + tên "Khoá ngoại…". "Lab 1 — CT Shop…" ⇒ "Lab 1". */
export function tachSo(ten: string): { so: string | null; ten: string } {
  const m = /^\s*((?:\d+(?:\.\d+)*[a-z]?|[A-Z]\.?\d*|\d+\.[A-Z]|Lab\s*\d+|PE\d+|FE\d+|PT\d+))\s*[—–:-]\s*(.+)$/u.exec(ten);
  if (m && m[2].trim()) return { so: m[1].replace(/\s+/g, ' '), ten: m[2].trim() };
  return { so: null, ten: ten.trim() };
}

const cat = (s: string, n = 260) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/**
 * Dựng sơ đồ. `xong(id)` = bài đã học xong; `hienTai` = id bài đang học (trang learn) hoặc null ⇒ tự lấy bài
 * chưa xong đầu tiên làm "đang học" khi người học đã học ít nhất một bài.
 */
export function dungRoadmap(
  sections: ChuongVao[] | null | undefined,
  meta: MetaRoadmap | null | undefined,
  opts: { xong?: (id: number) => boolean; hienTai?: number | null; lang?: 'vi' | 'en' } = {},
): RoadmapDung {
  const lang = opts.lang ?? 'vi';
  const xong = opts.xong ?? (() => false);
  const chuongDs = [...(sections ?? [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((c) => ({ ...c, lessons: [...(c.lessons ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) }))
    .filter((c) => c.lessons.length > 0);

  // Thứ tự học phẳng + tra slug → bài
  const phang: Array<{ b: BaiVao; ci: number }> = chuongDs.flatMap((c, ci) => c.lessons.map((b) => ({ b, ci })));
  const theoSlug = new Map<string, BaiVao>();
  phang.forEach(({ b }) => { if (b.slug) theoSlug.set(b.slug, b); });
  const lk = (slug: string): LienKetBai | null => {
    const b = theoSlug.get(slug);
    return b ? { id: b.id, ten: tachSo(chonNgu(b.title, lang)).ten, loai: loaiBai(b) } : null;
  };

  let nutHienTai: number | null = opts.hienTai ?? null;
  if (nutHienTai == null && phang.some(({ b }) => xong(b.id))) nutHienTai = phang.find(({ b }) => !xong(b.id))?.b.id ?? null;

  let thuTu = 0; let soCoMoTa = 0;
  const chang: ChangRoadmap[] = chuongDs.map((c, ci) => {
    const tenDu = chonNgu(c.title, lang);
    // "Chương 3 — Bảng, ràng buộc…" ⇒ nhãn "Chương 3" + tên "Bảng, ràng buộc…"
    const m = /^\s*((?:Chương|Chapter|Section|Mục|Phần|Part)\s*[\dA-Z]+|⭐\s*\S+)\s*[—–:-]\s*(.+)$/iu.exec(tenDu);
    const nhan = m ? m[1] : `Chặng ${ci + 1}`;
    const ten = m ? m[2] : tenDu;
    const dau = c.lessons[0]?.slug ?? '';
    const mc = (dau && meta?.chuong?.[dau]) || {};
    const nut: NutRoadmap[] = c.lessons.map((b, bi) => {
      const loai = loaiBai(b);
      const { so, ten: tenBai } = tachSo(chonNgu(b.title, lang));
      const md = b.slug ? meta?.bai?.[b.slug] : undefined;
      const truoc = bi > 0 ? c.lessons[bi - 1] : (ci > 0 ? chuongDs[ci - 1].lessons[chuongDs[ci - 1].lessons.length - 1] : undefined);
      const cungChuongThucHanh = c.lessons.filter((x) => x.id !== b.id && LOAI_PHAI.has(loaiBai(x))).slice(0, 2);
      const trangThai: TrangThai = xong(b.id) ? 'xong' : b.id === nutHienTai ? 'dang' : 'chua';
      if (md) soCoMoTa++;
      const moTa = cat(chonNgu(b.description, lang));
      const nutMoi: NutRoadmap = {
        id: b.id, slug: b.slug ?? String(b.id), ten: tenBai, so, loai, ben: LOAI_PHAI.has(loai) ? 'phai' : 'trai',
        thoiLuong: Math.max(0, Number(b.videoDurationSeconds) || 0), trangThai, hocThu: Boolean(b.isFreePreview), thuTu: thuTu++,
        hoc: md?.hoc || moTa,
        canBiet: md?.canBiet || (truoc ? `Học xong bài trước: ${tachSo(chonNgu(truoc.title, lang)).ten}.` : 'Không cần nền trước — đây là điểm bắt đầu của khoá.'),
        lamDuoc: md?.lamDuoc || '',
        // Không có mô tả biên soạn ⇒ KHÔNG tự viết câu; ngăn chi tiết chỉ hiện link lab/quiz cùng chương (dữ liệu thật).
        ketHop: md?.ketHop || '',
        canBietBai: (md ? (md.canBietBai ?? []).map(lk) : [truoc?.slug ? lk(truoc.slug) : null]).filter((x): x is LienKetBai => Boolean(x)),
        ketHopBai: (md ? (md.ketHopBai ?? []).map(lk) : cungChuongThucHanh.map((x) => (x.slug ? lk(x.slug) : null))).filter((x): x is LienKetBai => Boolean(x)),
        ketHopKhoa: (md?.ketHopKhoa ?? []).map((s) => ({ slug: s, ten: meta?.khoaTen?.[s] ?? s })),
        coMoTa: Boolean(md),
      };
      return nutMoi;
    });
    // Chương toàn lý thuyết (vd Mục 0) mà dài ⇒ chia đôi sang phải cho cân; chương toàn thực hành (Thi cuối khoá) cũng vậy.
    const trai = nut.filter((n) => n.ben === 'trai');
    const phai = nut.filter((n) => n.ben === 'phai');
    if ((phai.length === 0 || trai.length === 0) && nut.length >= 3) {
      const nua = Math.ceil(nut.length / 2);
      nut.forEach((n, i) => { n.ben = i < nua ? 'trai' : 'phai'; });
    }
    const soXong = nut.filter((n) => n.trangThai === 'xong').length;
    return {
      id: c.id, so: ci, ten, nhan, moTa: cat(chonNgu(c.description, lang), 320),
      hoc: mc.hoc || cat(chonNgu(c.description, lang), 320), lamDuoc: mc.lamDuoc || '',
      nut, tong: nut.length, xong: soXong, thoiLuong: nut.reduce((t, n) => t + n.thoiLuong, 0),
      trangThai: soXong === nut.length ? 'xong' : nut.some((n) => n.trangThai !== 'chua') ? 'dang' : 'chua',
    };
  });
  const tongNut = thuTu;
  return { chang, tongNut, soXong: chang.reduce((t, c) => t + c.xong, 0), soCoMoTa, nutHienTai };
}

export const NHAN_LOAI_NUT: Record<LoaiNut, { vi: string; en: string; mau: string }> = {
  'bat-dau': { vi: 'Bắt đầu', en: 'Start here', mau: '#f59e0b' },
  bai: { vi: 'Bài giảng', en: 'Lesson', mau: '#3b82f6' },
  slide: { vi: 'Slide', en: 'Slides', mau: '#0ea5e9' },
  lab: { vi: 'Lab', en: 'Lab', mau: '#10b981' },
  'code-lab': { vi: 'Code Lab', en: 'Code Lab', mau: '#22c55e' },
  quiz: { vi: 'Quiz', en: 'Quiz', mau: '#8b5cf6' },
  'du-an': { vi: 'Dự án', en: 'Project', mau: '#ec4899' },
  'de-thi': { vi: 'Đề thi', en: 'Exam', mau: '#ef4444' },
  'on-tap': { vi: 'Ôn tập', en: 'Review', mau: '#14b8a6' },
  'chuyen-sau': { vi: 'Chuyên sâu', en: 'Deep dive', mau: '#f97316' },
  'tai-lieu': { vi: 'Tài liệu', en: 'Materials', mau: '#64748b' },
};

/** "1 giờ 5 phút" / "12 phút" / "" */
export function thoiLuongChu(giay: number, lang: 'vi' | 'en' = 'vi'): string {
  const p = Math.round(giay / 60);
  if (p <= 0) return '';
  const h = Math.floor(p / 60); const m = p % 60;
  if (lang === 'en') return h ? `${h}h${m ? ` ${m}m` : ''}` : `${m} min`;
  return h ? `${h} giờ${m ? ` ${m} phút` : ''}` : `${m} phút`;
}
