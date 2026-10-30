/**
 * Code Lab — MỤC LỤC chương/bài của một track (14/10/2026).
 *
 * Chủ web: "đừng ấn vào 1 khoá là hiện ALL chương, bài cùng 1 trang — user không
 * biết nên làm bài nào". Trang track mặc định giờ là MỤC LỤC: chương ▸ bài học
 * (module) ▸ số đề; bấm một bài học mới mở bộ đề của RIÊNG bài đó (`?bai=`).
 *
 * Tệp này là phần THUẦN (không React, không mạng) để test bằng
 *   npx tsx --test frontend/src/lib/codelabToc.test.ts
 *
 * Quy ước dữ liệu (đo trên prod 14/10/2026):
 *   - track luyện tập (`*-practice`) đặt tên module "N.M Tên bài" và slug
 *     `wf-N-M-…` / `fer202-N-…` ⇒ số chương = N;
 *   - track thường (javascript, html-css…) đặt tên "JavaScript Fundamentals" —
 *     không có số chương ⇒ nhóm theo cấp độ nếu cấp độ đi tăng dần theo thứ tự
 *     module, không thì MỘT nhóm "Các bài học" (đổi thứ tự lộ trình để gom theo
 *     cấp độ là phá ý người soạn).
 */

export type DoKhoToc = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type CapDoToc = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

/** Track luyện tập ↔ khoá học — NGƯỢC của `PRACTICE_TRACK_BY_COURSE` (src/services/codeLab.practice.ts). */
export const KHOA_CUA_TRACK: Readonly<Record<string, string>> = Object.freeze({
  'web-foundations-practice': 'web-foundations',
  'fer202-practice': 'front-end-web-development-with-react',
  'swt301-practice': 'software-testing',
  'swr302-practice': 'software-requirements',
  'ky-nang-practice': 'ssg105-communication-and-in-group-working-skills',
  'dbi202-practice': 'introduction-to-databases',
  'osg202-practice': 'operating-systems',
  'cea201-practice': 'computer-organization-and-architecture',
  'mad101-practice': 'discrete-mathematics',
});

/**
 * Tên chương — chép từ tiêu đề section của khoá (content/courses/web-foundations/sXX-*.mjs,
 * và section của khoá FER202 trên prod). Không gọi API khoá học cho việc này: payload
 * `GET /courses/web-foundations` nặng ~300 KB chỉ để lấy 15 dòng tên. Thiếu tên ⇒ "Chương N".
 */
export const TEN_CHUONG: Readonly<Record<string, Readonly<Record<number, string>>>> = Object.freeze({
  'web-foundations-practice': {
    0: 'Giới thiệu, nền tảng & cài đặt',
    1: 'Bộ công cụ: terminal, VS Code, Git, npm',
    2: 'HTML: cấu trúc của mọi trang web',
    3: 'CSS & thiết kế responsive',
    4: 'JavaScript nền tảng',
    5: 'JavaScript bất đồng bộ & modules',
    6: 'HTTP & API',
    7: 'Xác thực & bảo mật',
    8: 'Dữ liệu & SQL',
    9: 'TypeScript cơ bản',
    10: 'Tư duy lập trình, gỡ lỗi & quy trình Git',
    11: 'JavaScript nâng cao',
    12: 'CSS nâng cao',
    13: 'Kiểm thử',
    14: 'Đưa sản phẩm lên mạng',
  },
  'fer202-practice': {
    0: 'Giới thiệu môn học',
    1: 'Tổng quan & cài đặt',
    2: 'ES6 cho React',
    3: 'JSX & render',
    4: 'Bootstrap & React-Bootstrap',
    5: 'Component & State',
    6: 'Xử lý sự kiện',
    7: 'Mẫu props & Context',
    8: 'Hooks',
    9: 'Routing với React Router',
    10: 'Code splitting: lazy & Suspense',
    11: 'Giao tiếp client-server',
    12: 'Kiến trúc Flux & Redux',
    13: 'Luyện PE — đề thực hành có đồng hồ',
    14: 'Nâng cao: hiệu năng, kiểm thử, TypeScript',
    15: 'Assignment — CodeLearn (dự án cuối kỳ)',
  },
  'swt301-practice': {
    1: 'Nền tảng kiểm thử',
    2: 'Kiểm thử trong vòng đời phần mềm',
    3: 'Kiểm thử tĩnh (Static testing)',
    4: 'Kỹ thuật hộp đen (Black-box)',
    5: 'Kỹ thuật hộp trắng (White-box)',
    6: 'Kỹ thuật dựa kinh nghiệm',
    7: 'Quản lý kiểm thử',
    8: 'Công cụ & tự động hoá',
    9: 'Kiểm thử trong Agile',
    10: 'Lab trường — Report 5.1 / 5.2 / 5.3',
    11: 'Luyện PE — đề thực hành có đồng hồ',
  },
  'swr302-practice': {
    1: 'Nền tảng yêu cầu phần mềm',
    2: 'Khách hàng, BA, tầm nhìn & phạm vi',
    3: 'Khai thác yêu cầu (Elicitation)',
    4: 'Phân tích & mô hình hoá',
    5: 'Đặc tả: SRS & thuộc tính chất lượng',
    6: 'Thẩm định yêu cầu (Validation)',
    7: 'Quản lý yêu cầu: thay đổi & truy vết',
    8: 'Từ yêu cầu tới thiết kế & prototype',
    9: 'Yêu cầu trong Agile',
    10: 'Xếp ưu tiên & yêu cầu cho AI/ML',
    11: 'Luyện PE — đề thực hành có đồng hồ',
    12: 'Chuyên đề: nâng cấp/thay thế, gói có sẵn, công cụ, cải tiến, rủi ro',
  },
  // DBI202 (29/10/2026) — số chương theo khoá introduction-to-databases (content/academy/DBI202.mjs).
  'dbi202-practice': {
    5: 'SQL DDL: tạo bảng & ràng buộc',
    6: 'Truy vấn SQL: SELECT, JOIN, GROUP BY, truy vấn con, DML',
    7: 'View (procedure/trigger T-SQL: máy chấm SQL Server — sắp có)',
    9: 'Luyện PE — đề thực hành có đồng hồ',
  },
  // OSG202 (30/10/2026) — số chương theo Tanenbaum/khoá operating-systems (content/academy/OSG202.mjs).
  'osg202-practice': {
    1: 'Giới thiệu: kernel, lời gọi hệ thống, phần cứng',
    2: 'Tiến trình, luồng, đồng bộ & lập lịch CPU',
    3: 'Quản lý bộ nhớ & bộ nhớ ảo',
    4: 'Hệ thống tệp',
    5: 'Vào/ra, đĩa & RAID',
    6: 'Deadlock & thuật toán nhà băng',
    7: 'Linux & shell',
    8: 'Hệ thống nhiều bộ xử lý',
    9: 'Bảo mật',
    13: 'Luyện FE — đề thi thử có đồng hồ',
    14: 'Chuyên sâu cho backend: luồng, bộ nhớ trên máy chủ',
  },
  // CEA201 (30/10/2026) — số chương theo khoá computer-organization-and-architecture (content/academy/CEA201.mjs); 16–18 = các bài nâng cao N1–N3.
  'cea201-practice': {
    1: 'Giới thiệu: tổ chức vs kiến trúc',
    2: 'Tiến hoá & hiệu năng máy tính',
    3: 'Chu trình lệnh, ngắt & bus',
    4: 'Bộ nhớ cache',
    5: 'Bộ nhớ trong & sửa lỗi',
    6: 'Bộ nhớ ngoài: đĩa, RAID, SSD',
    7: 'Nhập/Xuất (I/O)',
    8: 'Hỗ trợ hệ điều hành & bộ nhớ ảo',
    9: 'Logic số',
    10: 'Tập lệnh & biểu diễn dữ liệu',
    11: 'Chế độ địa chỉ',
    12: 'Cấu trúc bộ xử lý & pipeline',
    13: 'RISC và CISC',
    14: 'Song song mức lệnh & superscalar',
    15: 'Đa lõi & nhất quán cache',
    16: 'Hợp ngữ MARIE (thực hành)',
    17: 'Dự đoán rẽ nhánh',
    18: 'Thực hiện suy đoán: Spectre/Meltdown',
    20: 'Luyện FE — đề thi thử có đồng hồ',
  },
  // MAD101 (30/10/2026) — số chương theo khoá discrete-mathematics (content/academy/MAD101.mjs); Lab của chương xếp sau các bài luyện.
  'mad101-practice': {
    1: 'Logic & chứng minh',
    2: 'Tập hợp, hàm, dãy; quan hệ & ma trận',
    3: 'Độ phức tạp thuật toán (Big-O)',
    4: 'Số học: chia hết, đồng dư, Euclid, nguyên tố',
    5: 'Quy nạp, đệ quy & hệ thức truy hồi',
    6: 'Đếm & tổ hợp',
    7: 'Đồ thị & đường đi ngắn nhất',
    8: 'Cây & cây khung nhỏ nhất',
    20: 'Luyện FE — đề thi thử có đồng hồ',
  },
  // Kỹ năng nghề — số chương theo SSG105 (Ch3 Written communication, Ch4 Presentations).
  'ky-nang-practice': {
    3: '📝 Báo cáo kỹ thuật (SSG105 Ch3)',
    4: '🎤 Thuyết trình & bảo vệ Q&A (SSG105 Ch4)',
  },
});

export const TEN_CAP_DO: Readonly<Record<CapDoToc, string>> = Object.freeze({
  BEGINNER: 'Cơ bản',
  INTERMEDIATE: 'Trung cấp',
  ADVANCED: 'Nâng cao',
});

const HANG_CAP_DO: Record<string, number> = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 };

/** Hình dạng tối thiểu cần để dựng mục lục (khớp `CodeModule` / `CodeExerciseListItem`). */
export interface DeToc {
  id: number;
  difficulty: DoKhoToc;
  estimatedMinutes?: number | null;
  sortOrder?: number | null;
}
export interface ModuleToc {
  id: number;
  name: string;
  slug: string;
  level: CapDoToc;
  sortOrder: number;
  description?: string | null;
  hasLesson?: boolean;
  exercises?: DeToc[];
}

/**
 * Số chương của một module. Ưu tiên tên "N.M …" (vd "2.1 HTML là gì" ⇒ 2); track
 * luyện tập (`*-practice`) còn được đọc từ slug `wf-3-3-flexbox` / `fer202-6-ex16-…`.
 * Không xác định ⇒ null.
 */
export function soChuongCuaModule(m: Pick<ModuleToc, 'name' | 'slug'>, trackSlug = ''): number | null {
  const ten = /^\s*(\d{1,2})\.(\d{1,2})\b/.exec(m.name || '');
  if (ten) return Number(ten[1]);
  if (trackSlug.endsWith('-practice')) {
    const s = /^[a-z][a-z0-9]*-(\d{1,2})-/.exec(m.slug || '');
    if (s) return Number(s[1]);
  }
  return null;
}

/** Số chương của một slug bài học/module (`wf-3-0-slides` ⇒ 3) — dùng cho bộ "cả chương". */
export function soChuongTuSlug(slug: string): number | null {
  const s = /^[a-z][a-z0-9]*-(\d{1,2})-/.exec(slug || '');
  return s ? Number(s[1]) : null;
}

/** "3.3 Flexbox: …" ⇒ "Flexbox: …" (số thứ tự hiện riêng ở cột trái). Không có số ⇒ giữ nguyên. */
export function tenBoSo(name: string): string {
  return (name || '').replace(/^\s*\d{1,2}\.\d{1,2}\s*[—–:.-]?\s*/, '') || name;
}

/** "3.3" của "3.3 Flexbox" — null nếu tên không đánh số. */
export function soBaiTrongTen(name: string): string | null {
  const m = /^\s*(\d{1,2}\.\d{1,2})\b/.exec(name || '');
  return m ? m[1] : null;
}

export function tenChuong(trackSlug: string, so: number): string {
  const ten = TEN_CHUONG[trackSlug]?.[so];
  return ten ? `Chương ${so} — ${ten}` : `Chương ${so}`;
}

export interface ThongKeModule {
  soDe: number;
  doKho: Record<DoKhoToc, number>;
  /** Ước lượng phút cả bộ — đề không khai phút tính 10 (cùng luật `estimateMinutes` của backend). */
  phut: number;
  daLam: number;
}

export function thongKeModule(m: Pick<ModuleToc, 'exercises'>, daGiai: (id: number) => boolean = () => false): ThongKeModule {
  const doKho: Record<DoKhoToc, number> = { EASY: 0, MEDIUM: 0, HARD: 0, EXPERT: 0 };
  let phut = 0;
  let daLam = 0;
  const ds = m.exercises || [];
  for (const e of ds) {
    if (e.difficulty in doKho) doKho[e.difficulty]++;
    phut += e.estimatedMinutes && e.estimatedMinutes > 0 ? e.estimatedMinutes : 10;
    if (daGiai(e.id)) daLam++;
  }
  return { soDe: ds.length, doKho, phut, daLam };
}

export interface DongMucLuc<M extends ModuleToc = ModuleToc> {
  module: M;
  /** Số thứ tự 1..N của bài học trong cả track (không nhảy khi gập/tìm). */
  stt: number;
  /** "3.3" nếu tên module có đánh số. */
  soBai: string | null;
  tk: ThongKeModule;
}
export interface NhomMucLuc<M extends ModuleToc = ModuleToc> {
  key: string;
  /** Số chương (kiểu `chuong`) — null với nhóm cấp độ / nhóm phẳng. */
  so: number | null;
  ten: string;
  dong: DongMucLuc<M>[];
  soDe: number;
  daLam: number;
}
export type KieuMucLuc = 'chuong' | 'capdo' | 'phang';

export interface MucLuc<M extends ModuleToc = ModuleToc> {
  kieu: KieuMucLuc;
  nhom: NhomMucLuc<M>[];
}

/** Module theo thứ tự lộ trình (sortOrder, rồi id) — không đổi mảng gốc. */
export function sapModule<M extends ModuleToc>(mods: readonly M[]): M[] {
  return [...mods].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

/**
 * Dựng mục lục:
 *   - mọi module có đề đều đọc được số chương ⇒ nhóm theo CHƯƠNG (tăng dần);
 *   - không thì cấp độ đi TĂNG DẦN theo thứ tự module và có ≥2 cấp ⇒ nhóm theo CẤP ĐỘ;
 *   - còn lại ⇒ MỘT nhóm "Các bài học" giữ nguyên thứ tự lộ trình.
 */
export function dungMucLuc<M extends ModuleToc>(
  trackSlug: string,
  modules: readonly M[],
  daGiai: (id: number) => boolean = () => false,
): MucLuc<M> {
  const ds = sapModule(modules);
  const dong: DongMucLuc<M>[] = ds.map((m, i) => ({
    module: m,
    stt: i + 1,
    soBai: soBaiTrongTen(m.name),
    tk: thongKeModule(m, daGiai),
  }));
  const tong = (rows: DongMucLuc<M>[]) => ({
    soDe: rows.reduce((n, r) => n + r.tk.soDe, 0),
    daLam: rows.reduce((n, r) => n + r.tk.daLam, 0),
  });

  const chuongCua = ds.map((m) => soChuongCuaModule(m, trackSlug));
  const coDe = ds.map((m) => (m.exercises || []).length > 0);
  const duSoChuong = ds.length > 0 && chuongCua.every((c, i) => c != null || !coDe[i]) && chuongCua.some((c) => c != null);
  if (duSoChuong) {
    const map = new Map<number, DongMucLuc<M>[]>();
    // Module không có số chương (và không có đề) theo chương của module đứng trước nó.
    let truoc = chuongCua.find((c) => c != null) as number;
    dong.forEach((d, i) => {
      const c = chuongCua[i] ?? truoc;
      truoc = c;
      if (!map.has(c)) map.set(c, []);
      map.get(c)!.push(d);
    });
    const nhom = [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([so, rows]) => ({ key: `ch-${so}`, so, ten: tenChuong(trackSlug, so), dong: rows, ...tong(rows) }));
    return { kieu: 'chuong', nhom };
  }

  const hang = ds.map((m) => HANG_CAP_DO[m.level] ?? 0);
  const tangDan = hang.every((h, i) => i === 0 || h >= hang[i - 1]);
  if (tangDan && new Set(hang).size >= 2) {
    const nhom: NhomMucLuc<M>[] = [];
    for (const d of dong) {
      const lv = d.module.level;
      let g = nhom[nhom.length - 1];
      if (!g || g.key !== `lv-${lv}`) {
        g = { key: `lv-${lv}`, so: null, ten: TEN_CAP_DO[lv] ?? lv, dong: [], soDe: 0, daLam: 0 };
        nhom.push(g);
      }
      g.dong.push(d);
    }
    for (const g of nhom) Object.assign(g, tong(g.dong));
    return { kieu: 'capdo', nhom };
  }

  return { kieu: 'phang', nhom: [{ key: 'all', so: null, ten: 'Các bài học', dong, ...tong(dong) }] };
}

/** Bài học (module có đề) chưa làm xong đầu tiên theo thứ tự lộ trình — "Bắt đầu từ". Xong hết ⇒ null. */
export function baiChuaLamDauTien<M extends ModuleToc>(ml: MucLuc<M>): { nhom: NhomMucLuc<M>; dong: DongMucLuc<M> } | null {
  for (const nhom of ml.nhom) {
    for (const dong of nhom.dong) {
      if (dong.tk.soDe > 0 && dong.tk.daLam < dong.tk.soDe) return { nhom, dong };
    }
  }
  return null;
}

/** Bỏ dấu tiếng Việt + thường hoá, để ô tìm "flex" khớp "Flexbox", "bieu mau" khớp "Biểu mẫu". */
export function chuanHoaTim(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/** Lọc mục lục theo ô tìm (tên/mô tả/slug module). Nhóm rỗng bị bỏ. Chuỗi trống ⇒ giữ nguyên. */
export function locMucLuc<M extends ModuleToc>(ml: MucLuc<M>, q: string): MucLuc<M> {
  const k = chuanHoaTim(q);
  if (!k) return ml;
  const khop = (m: M) => chuanHoaTim(`${m.name} ${m.description || ''} ${m.slug}`).includes(k);
  return {
    kieu: ml.kieu,
    nhom: ml.nhom
      .map((g) => ({ ...g, dong: g.dong.filter((d) => khop(d.module)) }))
      .filter((g) => g.dong.length > 0),
  };
}

/** Module (có đề) kế tiếp/trước trong lộ trình — nút "Bài học tiếp theo →". */
export function moduleLanCan<M extends ModuleToc>(modules: readonly M[], slug: string): { truoc: M | null; sau: M | null } {
  const ds = sapModule(modules).filter((m) => (m.exercises || []).length > 0 || m.slug === slug);
  const i = ds.findIndex((m) => m.slug === slug);
  if (i < 0) return { truoc: null, sau: null };
  return { truoc: i > 0 ? ds[i - 1] : null, sau: i < ds.length - 1 ? ds[i + 1] : null };
}

/**
 * Đường tới trang bài học của một module: `/code-lab/<track>?bai=<module>` (+ `khoa`
 * khi track gắn khoá — trang bài học khi đó hỏi `GET /code-lab/practice/:khoa/:bai`
 * và nhận cờ `solved`). `them` = tham số mang theo khác (vd `ref`, `reflabel`).
 */
export function duongBaiHoc(trackSlug: string, moduleSlug: string, them?: Record<string, string | null | undefined>): string {
  const q = new URLSearchParams();
  q.set('bai', moduleSlug);
  const khoa = KHOA_CUA_TRACK[trackSlug];
  if (khoa) q.set('khoa', khoa);
  for (const [k, v] of Object.entries(them || {})) if (v) q.set(k, v);
  return `/code-lab/${encodeURIComponent(trackSlug)}?${q.toString()}`;
}

/** Đường tới mục lục, mở sẵn một chương (`?chuong=N`). */
export function duongMucLuc(trackSlug: string, chuong?: number | null): string {
  return chuong == null ? `/code-lab/${encodeURIComponent(trackSlug)}` : `/code-lab/${encodeURIComponent(trackSlug)}?chuong=${chuong}`;
}
