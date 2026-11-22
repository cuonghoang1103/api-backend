/**
 * Phòng thi mô phỏng — phần THUẦN (không đụng CSDL), test ở `moPhong.test.ts`.
 *
 *  - Ngân hàng câu FE: câu trắc nghiệm của ĐỀ FE THẬT trong Exam Room (đã gán chương bằng
 *    `ExamQuestion.sectionId`) + câu quiz chương của Academy (`LessonDetail.quizData`, gồm bộ câu FE
 *    tiếng Anh `content/academy/fer202/quizFe*.mjs`). Khử trùng theo đề bài chuẩn hoá.
 *  - Trộn đề "theo phân bố chương như đề thật": trọng số mỗi nhóm = số câu đề FE thật rơi vào nhóm
 *    đó (câu chưa phân chương gom vào nhóm "khác"). Chưa có câu thật nào được phân chương ⇒ chia đều.
 *    Nhóm thiếu câu thì phần dư chia lại cho nhóm còn câu (chiaTheoTrongSo).
 *  - Đề trộn được CHỤP vào `exam_attempts.paper` (câu + đáp án + chương/CLO) ⇒ xem lại được mãi,
 *    không phụ thuộc lần seed đề sau.
 */

export type NguonCau = 'DE_THAT' | 'QUIZ';
export type NguonNganHang = 'mix' | 'real' | 'quiz';
export const NHOM_KHAC = 'khac';

export interface CauNganHang {
  /** ExamQuestion.id (câu đề thật) hoặc số ÂM tổng hợp cho câu quiz (không có dòng ExamQuestion). */
  id: number;
  nguon: NguonCau;
  prompt: string;
  imageUrl: string | null;
  options: Array<{ text: string }>;
  correctIndexes: number[];
  explanation: string | null;
  /** Khoá nhóm phân bố: `s<sectionId>` hoặc `khac`. */
  nhom: string;
  nhomTen: string;
  /** Số chương Academy (Chapter N) — null nếu nhóm không phải chương đánh số. */
  chuong: number | null;
  /** Thứ tự chương để sắp bảng thống kê. */
  thuTu: number;
}

export interface CauPaper extends CauNganHang {
  clo: string[];
  points: number;
}

export interface PaperFe {
  loai: 'FE';
  courseCode: string;
  nguonNganHang: NguonNganHang;
  /** DE_THAT = trọng số theo đề thật · DEU = chia đều (chưa có dữ liệu phân chương). */
  nguonPhanBo: 'DE_THAT' | 'DEU';
  phanBo: Array<{ nhom: string; ten: string; soCau: number }>;
  thangDiem: number;
  diemDat: number;
  cau: CauPaper[];
}

export interface TieuChiPe { id: string; criterion: string; maxScore: number }
export interface CauPe {
  id: number;
  prompt: string;
  points: number;
  imageUrl: string | null;
  rubric: TieuChiPe[];
  /** Chỉ máy chủ giữ — gửi về sau khi nộp. */
  sampleSolution: string | null;
}
export interface PaperPe {
  loai: 'PE';
  courseCode: string;
  nguon: 'EXAM' | 'CODELAB';
  examId: number | null;
  exerciseId: number | null;
  exerciseSlug: string | null;
  title: string;
  code: string | null;
  durationMinutes: number;
  thangDiem: number;
  diemDat: number;
  attachmentUrl: string | null;
  attachmentName: string | null;
  /** CODELAB: Given dựng phía trình duyệt từ tệp khởi đầu + database.json. */
  given: { files: Array<{ name: string; code: string }>; db: unknown } | null;
  /** CODELAB có máy chấm trình duyệt (gradeKind react/dom/…). */
  coMayCham: boolean;
  cau: CauPe[];
}

// ── Chuẩn hoá chuỗi ──────────────────────────────────────────────────
export const chuanHoaDeBai = (s: string | null | undefined): string =>
  String(s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 300);

/** "Chapter 12 — Flux…|||Chương 12 — …" ⇒ 12. Mục 0 / Progress Test / Advanced ⇒ null. */
export function chuongTuTieuDe(title: string | null | undefined): number | null {
  const m = /^\s*(?:chapter|chương)\s+(\d{1,2})\b/i.exec(String(title || ''));
  return m ? Number(m[1]) : null;
}

const escHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const boThoat = (s: string) => s.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\t/g, '  ');

/**
 * Chữ THƯỜNG của quiz Academy (LessonQuizPlayer hiện bằng text, không phải HTML) ⇒ HTML an toàn cho
 * `ExamRichContent`. Giữ cấu trúc "EN|||VI"; `<App />` trong đề hiện đúng là chữ, không thành thẻ.
 */
export function vanBanSangHtml(s: unknown, kemCode?: { code: string } | null): string {
  const raw = String(s ?? '');
  const parts = raw.includes('|||') ? raw.split('|||') : [raw];
  const code = kemCode?.code ? `<pre><code>${escHtml(boThoat(kemCode.code))}</code></pre>` : '';
  const html = parts.slice(0, 2).map((p) => escHtml(boThoat(p.trim())).replace(/\n/g, '<br>') + code);
  return html.join('|||');
}

/** Một câu của `quizData.questions` ⇒ câu ngân hàng (null nếu không phải trắc nghiệm chấm được). */
export function quizSangCau(
  q: Record<string, unknown>,
  meta: { idAm: number; nhom: string; nhomTen: string; chuong: number | null; thuTu: number },
): CauNganHang | null {
  const options = Array.isArray(q.options) ? (q.options as unknown[]) : [];
  if (options.length < 2 || options.length > 6) return null;
  const correct = Array.isArray(q.correctIndexes)
    ? (q.correctIndexes as unknown[]).map(Number)
    : typeof q.correctIndex === 'number' ? [q.correctIndex] : [];
  if (!correct.length || correct.some((i) => !Number.isInteger(i) || i < 0 || i >= options.length)) return null;
  const question = q.question ?? q.prompt;
  if (!question) return null;
  return {
    id: meta.idAm,
    nguon: 'QUIZ',
    prompt: vanBanSangHtml(question, q.code ? { code: String(q.code) } : null),
    imageUrl: null,
    options: options.map((o) => ({ text: vanBanSangHtml(o) })),
    correctIndexes: [...new Set(correct)].sort((a, b) => a - b),
    explanation: q.explanation ? vanBanSangHtml(q.explanation) : null,
    nhom: meta.nhom, nhomTen: meta.nhomTen, chuong: meta.chuong, thuTu: meta.thuTu,
  };
}

/** id âm ổn định cho câu quiz: -(lessonId * 1000 + vị trí + 1). */
export const idCauQuiz = (lessonId: number, viTri: number) => -(lessonId * 1000 + viTri + 1);

/** Gộp + khử trùng (câu đề thật thắng câu quiz trùng nội dung). */
export function khuTrung(cau: CauNganHang[]): CauNganHang[] {
  const thay = new Map<string, CauNganHang>();
  for (const c of [...cau].sort((a, b) => (a.nguon === b.nguon ? 0 : a.nguon === 'DE_THAT' ? -1 : 1))) {
    const k = chuanHoaDeBai(c.prompt) + '¦' + c.options.map((o) => chuanHoaDeBai(o.text)).join('¦');
    if (!k.trim() || thay.has(k)) continue;
    thay.set(k, c);
  }
  return [...thay.values()];
}

/**
 * Chia `tong` câu cho các nhóm theo trọng số, không vượt sức chứa từng nhóm (phương pháp số dư lớn
 * nhất, lặp lại cho tới khi hết câu hoặc hết sức chứa). Trả về số câu mỗi nhóm.
 */
export function chiaTheoTrongSo(trongSo: Record<string, number>, sucChua: Record<string, number>, tong: number): Record<string, number> {
  const ket: Record<string, number> = {};
  const nhom = Object.keys(sucChua).filter((k) => sucChua[k] > 0);
  for (const k of nhom) ket[k] = 0;
  let conLai = Math.min(Math.max(0, Math.floor(tong)), nhom.reduce((s, k) => s + sucChua[k], 0));
  for (let vong = 0; conLai > 0 && vong < 50; vong++) {
    const conCho = nhom.filter((k) => ket[k] < sucChua[k]);
    if (!conCho.length) break;
    let w = conCho.map((k) => Math.max(0, trongSo[k] ?? 0));
    if (w.every((x) => x === 0)) w = conCho.map(() => 1);
    const tongW = w.reduce((s, x) => s + x, 0);
    const chia = conCho.map((k, i) => ({ k, exact: (w[i] / tongW) * conLai }));
    const phan = chia.map((c) => ({ ...c, nguyen: Math.min(Math.floor(c.exact), sucChua[c.k] - ket[c.k]) }));
    let daChia = 0;
    for (const p of phan) { ket[p.k] += p.nguyen; daChia += p.nguyen; }
    let du = conLai - daChia;
    // Số dư lớn nhất trước; hoà thì nhóm có trọng số lớn hơn trước, rồi theo tên cho ổn định.
    const thuTu = phan
      .filter((p) => ket[p.k] < sucChua[p.k])
      .sort((a, b) => (b.exact - Math.floor(b.exact)) - (a.exact - Math.floor(a.exact)) || b.exact - a.exact || a.k.localeCompare(b.k));
    for (const p of thuTu) {
      if (du <= 0) break;
      if (ket[p.k] < sucChua[p.k]) { ket[p.k] += 1; du -= 1; }
    }
    conLai = du;
  }
  return ket;
}

export function tronMang<T>(a: T[], rand: () => number): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** PRNG có hạt (mulberry32) — test lặp lại được. */
export function taoRand(hat: number): () => number {
  let a = hat >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Bốc đề: chia số câu theo trọng số (sức chứa = số câu ngân hàng mỗi nhóm), bốc ngẫu nhiên trong
 * từng nhóm, rồi trộn thứ tự cả đề (đề FE thật không xếp theo chương).
 */
export function bocDe(nganHang: CauNganHang[], trongSo: Record<string, number>, soCau: number, rand: () => number) {
  const theoNhom = new Map<string, CauNganHang[]>();
  for (const c of nganHang) {
    if (!theoNhom.has(c.nhom)) theoNhom.set(c.nhom, []);
    theoNhom.get(c.nhom)!.push(c);
  }
  const sucChua: Record<string, number> = {};
  for (const [k, v] of theoNhom) sucChua[k] = v.length;
  const soMoiNhom = chiaTheoTrongSo(trongSo, sucChua, soCau);
  const chon: CauNganHang[] = [];
  for (const [k, v] of theoNhom) chon.push(...tronMang(v, rand).slice(0, soMoiNhom[k] ?? 0));
  const phanBo = [...theoNhom.entries()]
    .map(([k, v]) => ({ nhom: k, ten: v[0]?.nhomTen ?? k, thuTu: v[0]?.thuTu ?? 999, soCau: soMoiNhom[k] ?? 0 }))
    .filter((p) => p.soCau > 0)
    .sort((a, b) => a.thuTu - b.thuTu)
    .map(({ nhom, ten, soCau: n }) => ({ nhom, ten, soCau: n }));
  return { cau: tronMang(chon, rand), phanBo };
}

// ── Chấm FE ──────────────────────────────────────────────────────────
function cungTapHop(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

/** Lọc câu trả lời người dùng gửi: chỉ id có trong đề, chỉ số nguyên trong tầm phương án. */
export function locTraLoi(cau: Array<{ id: number; options: unknown[] | null }>, raw: unknown): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  if (!raw || typeof raw !== 'object') return out;
  const theoId = new Map(cau.map((c) => [String(c.id), Array.isArray(c.options) ? c.options.length : 0]));
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const n = theoId.get(k);
    if (n == null || !Array.isArray(v)) continue;
    const sel = [...new Set(v.map(Number).filter((i) => Number.isInteger(i) && i >= 0 && i < n))].sort((a, b) => a - b);
    out[k] = sel.slice(0, 6);
  }
  return out;
}

export function chamPaperFe(paper: PaperFe, traLoi: Record<string, number[]>) {
  let raw = 0;
  let max = 0;
  const perQuestion = paper.cau.map((c) => {
    const selected = traLoi[String(c.id)] ?? [];
    const correct = c.correctIndexes.length > 0 && cungTapHop(selected, c.correctIndexes);
    max += c.points;
    if (correct) raw += c.points;
    return { questionId: c.id, points: c.points, correct, selected };
  });
  const score = Math.round((raw / (max || 1)) * paper.thangDiem * 100) / 100;
  return {
    perQuestion,
    correctCount: perQuestion.filter((p) => p.correct).length,
    total: perQuestion.length,
    score,
    passed: score >= paper.diemDat,
  };
}

// ── Thống kê theo chương / CLO ───────────────────────────────────────
export interface MucThongKe { khoa: string; ten: string; dung: number; tong: number; tiLe: number; thuTu: number }

export function thongKe(items: Array<{ nhom: string; nhomTen: string; thuTu: number; clo: string[]; dung: boolean; daLam?: boolean }>) {
  const ch = new Map<string, MucThongKe>();
  const clo = new Map<string, MucThongKe>();
  for (const it of items) {
    const a = ch.get(it.nhom) ?? { khoa: it.nhom, ten: it.nhomTen, dung: 0, tong: 0, tiLe: 0, thuTu: it.thuTu };
    a.tong += 1; if (it.dung) a.dung += 1;
    ch.set(it.nhom, a);
    for (const c of it.clo) {
      const b = clo.get(c) ?? { khoa: c, ten: c, dung: 0, tong: 0, tiLe: 0, thuTu: Number(c.replace(/\D/g, '')) || 99 };
      b.tong += 1; if (it.dung) b.dung += 1;
      clo.set(c, b);
    }
  }
  const xong = (m: Map<string, MucThongKe>) => [...m.values()]
    .map((x) => ({ ...x, tiLe: x.tong ? Math.round((x.dung / x.tong) * 100) : 0 }))
    .sort((a, b) => a.thuTu - b.thuTu || a.khoa.localeCompare(b.khoa));
  return { theoChuong: xong(ch), theoClo: xong(clo) };
}

// ── Nộp zip PE: kiểm tên tệp (dùng chung ý với bản frontend lib/examMoPhong.ts) ──
export interface KiemZip { loi: string[]; canhBao: string[]; goc: string | null; soTep: number }

/** `entries`: tên tệp trong zip. Lỗi/cảnh báo dạng "EN|||VI". */
export function kiemTenTepZip(entries: string[]): KiemZip {
  const ten = entries.map((e) => e.replace(/\\/g, '/')).filter((e) => !e.endsWith('/'));
  const loi: string[] = [];
  const canhBao: string[] = [];
  const nm = ten.filter((e) => /(^|\/)node_modules\//.test(e));
  if (nm.length) loi.push(`The zip still contains node_modules (${nm.length} files). Delete node_modules and zip again.|||File zip còn thư mục node_modules (${nm.length} tệp). Xoá node_modules rồi nén lại.`);
  const pkg = ten.filter((e) => /(^|\/)package\.json$/.test(e) && !/(^|\/)node_modules\//.test(e))
    .sort((a, b) => a.split('/').length - b.split('/').length)[0] ?? null;
  const goc = pkg ? pkg.replace(/package\.json$/, '') : null;
  if (!pkg) loi.push('No package.json found — zip the project folder itself (the one you ran npm start in).|||Không thấy package.json — hãy nén đúng thư mục dự án (thư mục bạn chạy npm start).');
  if (goc != null && !ten.some((e) => e.startsWith(`${goc}src/`))) canhBao.push('No src/ folder next to package.json — is this the right project?|||Không có thư mục src/ cạnh package.json — có đúng dự án không?');
  if (ten.some((e) => /(^|\/)(build|dist)\//.test(e))) canhBao.push('The zip includes build/ or dist/ output — not needed, you can delete it.|||Zip có thư mục build/ hoặc dist/ — không cần, có thể xoá.');
  if (ten.some((e) => /(^|\/)\.git\//.test(e))) canhBao.push('The zip includes the .git folder — not needed.|||Zip có thư mục .git — không cần.');
  return { loi, canhBao, goc, soTep: ten.length };
}

/** Điểm tự chấm: mỗi tiêu chí 0 | 0.5 | 1 phần của maxScore; tổng quy về thang của đề. */
export function diemTuCham(paper: Pick<PaperPe, 'cau' | 'thangDiem' | 'diemDat'>, chon: unknown) {
  const c = (chon && typeof chon === 'object') ? chon as Record<string, Record<string, unknown>> : {};
  let raw = 0;
  let max = 0;
  const theoCau = paper.cau.map((q) => {
    const mucCau = c[String(q.id)] ?? {};
    const rubric = q.rubric.length ? q.rubric : [{ id: 'all', criterion: '', maxScore: q.points }];
    const tongTc = rubric.reduce((s, r) => s + r.maxScore, 0) || 1;
    let dat = 0;
    const tieuChi = rubric.map((r) => {
      const v = Number(mucCau[r.id]);
      const muc = v === 1 || v === 0.5 ? v : 0;
      dat += muc * r.maxScore;
      return { id: r.id, muc };
    });
    const diem = Math.round((dat / tongTc) * q.points * 100) / 100;
    raw += diem; max += q.points;
    return { questionId: q.id, diem, toiDa: q.points, tieuChi };
  });
  const score = Math.round((raw / (max || 1)) * paper.thangDiem * 100) / 100;
  return { theoCau, score, passed: score >= paper.diemDat };
}
