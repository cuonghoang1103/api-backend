/**
 * ============================================================
 * Code Lab — máy chấm: phần THUẦN phía máy chủ (đợt Academy 28/10/2026)
 * ============================================================
 *
 * Code người học KHÔNG BAO GIỜ chạy trên VPS (cùng máy với Postgres chứa dữ liệu thật).
 * Máy chấm code chạy trong TRÌNH DUYỆT (frontend/src/components/code-lab/cham/**):
 *   dom · js · console · module · react  ⇒ iframe sandbox / Web Worker
 *   choice · order · table              ⇒ chấm thuần JS — máy chủ chấm LẠI được (không chạy code ai cả)
 *   sql (29/10/2026)                    ⇒ PostgreSQL 18 (PGlite/WASM) trong Web Worker, chế độ giống SQL Server
 *                                         (frontend/.../cham/chamSql.ts + sqlLoi.ts). KHÔNG chấm lại ở máy chủ:
 *                                         chạy PGlite trên VPS = chạy SQL người học cạnh Postgres thật (WASM chặn
 *                                         được tệp/mạng nhưng một truy vấn chạy mãi vẫn chiếm CPU, ~100 MB RAM mỗi
 *                                         phiên trên máy 6 GB) ⇒ như loại code khác: trình duyệt báo, máy chủ kiểm
 *                                         hình dạng ⇒ tiến độ cá nhân. Chấm có chứng thực ⇒ máy chấm T-SQL ở máy nhà.
 *   python                              ⇒ Pyodide (đợt sau)
 *   java · tsql · bash · sql-pg         ⇒ máy chấm máy chủ ở máy Linux nhà (đợt sau) — "sắp có"
 *   text-ai                             ⇒ AI chấm theo rubric (đợt sau)
 *   manual                              ⇒ người học tự đánh dấu
 *
 * TOÀN VẸN (ghi rõ theo yêu cầu): với loại code, kết quả do TRÌNH DUYỆT báo về. Máy chủ chỉ
 * kiểm HÌNH DẠNG (số kết quả = số kiểm của đề, đạt ≤ tổng) rồi tính điểm. Đủ cho TIẾN ĐỘ CÁ
 * NHÂN; KHÔNG dùng cho bảng xếp hạng/thi có điểm. Muốn chống gian thật ⇒ máy chấm máy chủ cô lập.
 *
 * Kiểm ẩn (`an: true`): không nằm trong payload trang bài (chỉ kiểm mẫu ⇒ "Chạy thử"); trình
 * duyệt lấy đủ qua `GET /exercises/:id/tests` lúc NỘP. Lộ được qua tab Network — chấp nhận cho
 * mục đích học (không có xếp hạng). Đáp án trắc nghiệm/sắp xếp/bảng thì KHÔNG bao giờ gửi
 * nguyên văn: chỉ gửi băm sha256 (`dapAnBam`), máy chủ giữ đáp án thật và chấm lại khi Nộp.
 *
 * Lược đồ bộ kiểm: content/codelab/README.md (+ web-foundations-practice/nguon/_luoc-do.mjs).
 * ⚠ `tinhDiem` có bản sao ở frontend/src/components/code-lab/cham/diem.ts — sửa thì sửa cả hai
 *   (test `codeLab.cham.test.ts` so hai bản trên cùng bộ dữ liệu).
 */
import { createHash } from 'node:crypto';

export const GRADE_KINDS = [
  'dom', 'js', 'console', 'module', 'react',
  'choice', 'order', 'table',
  'sql',
  'python', 'java', 'tsql', 'bash', 'sql-pg',
  'text-ai', 'manual',
] as const;
export type GradeKind = (typeof GRADE_KINDS)[number];

/** Chấm được ngay trong trình duyệt hôm nay. */
export const BROWSER_GRADE_KINDS: ReadonlySet<string> = new Set(['dom', 'js', 'console', 'module', 'react', 'choice', 'order', 'table', 'sql']);
/** Chấm thuần dữ liệu — máy chủ chấm lại được từ đáp án người học gửi. */
export const STATIC_GRADE_KINDS: ReadonlySet<string> = new Set(['choice', 'order', 'table']);

export const EXERCISE_KINDS = ['practice', 'lab', 'deep-lab', 'pe', 'project'] as const;
export type ExerciseKind = (typeof EXERCISE_KINDS)[number];

export function isExerciseKind(k: unknown): k is ExerciseKind {
  return typeof k === 'string' && (EXERCISE_KINDS as readonly string[]).includes(k);
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);

/** Loại chấm của một đề: cột `grade_kind`, không có thì `tests_json.loai`, không nữa ⇒ null (= tự đánh dấu). */
export function gradeKindOf(testsJson: unknown, gradeKind?: string | null): string | null {
  if (gradeKind && (GRADE_KINDS as readonly string[]).includes(gradeKind)) return gradeKind;
  if (isObj(testsJson) && typeof testsJson.loai === 'string') return testsJson.loai;
  return null;
}

/** Đề này có máy chấm trình duyệt thật (⇒ không cho "tự đánh dấu đã giải")? */
export function coMayChamTrinhDuyet(testsJson: unknown, gradeKind?: string | null): boolean {
  const k = gradeKindOf(testsJson, gradeKind);
  return !!k && BROWSER_GRADE_KINDS.has(k) && demKiem(testsJson).tong > 0;
}

// ─── đếm kiểm + nhóm (chức năng) của từng kiểm, theo THỨ TỰ chỉ số kết quả ────────────

interface MucKiem { an: boolean; nhom: string | null }

function bangO(b: Obj): string[] {
  return isObj(b.dapAn) ? Object.keys(b.dapAn) : [];
}

/** Danh sách kiểm theo đúng thứ tự chỉ số `i` mà kết quả dùng. */
export function cacKiem(testsJson: unknown): MucKiem[] {
  if (!isObj(testsJson)) return [];
  const loai = testsJson.loai;
  const nhom = (x: unknown) => (typeof x === 'string' && x ? x : null);
  if (loai === 'choice' || loai === 'order') {
    const ds = Array.isArray(testsJson.cauHoi) ? testsJson.cauHoi : [];
    return ds.filter(isObj).map((c) => ({ an: false, nhom: nhom(c.nhom) }));
  }
  if (loai === 'table') {
    const ds = Array.isArray(testsJson.bang) ? testsJson.bang : [];
    return ds.filter(isObj).flatMap((b) => bangO(b).map(() => ({ an: false, nhom: nhom(b.nhom) })));
  }
  const ds = Array.isArray(testsJson.kiem) ? testsJson.kiem : [];
  return ds.filter(isObj).map((k) => ({ an: k.an === true, nhom: nhom(k.nhom) }));
}

export function demKiem(testsJson: unknown): { tong: number; an: number } {
  const ds = cacKiem(testsJson);
  return { tong: ds.length, an: ds.filter((k) => k.an).length };
}

// ─── đáp án chuẩn hoá + băm (choice / order / table) ───────────────────────────────

const chuoi = (v: unknown) => (v == null ? '' : String(v));

/** Dạng chuẩn của một câu trả lời — trình duyệt dựng y hệt trước khi băm. */
export function dapAnChuan(loai: string, traLoi: unknown, opts: { phanBietHoa?: boolean } = {}): string {
  if (loai === 'choice') {
    const ds = Array.isArray(traLoi) ? traLoi : traLoi == null ? [] : [traLoi];
    return [...new Set(ds.map(chuoi).filter(Boolean))].sort().join(',');
  }
  if (loai === 'order') return (Array.isArray(traLoi) ? traLoi : []).map(chuoi).join('>');
  // table: một ô
  const s = chuoi(traLoi).trim().replace(/\s+/g, ' ');
  return opts.phanBietHoa ? s : s.toLowerCase();
}

export function bam(exerciseId: number, ma: string, chuan: string): string {
  return createHash('sha256').update(`${exerciseId}|${ma}|${chuan}`, 'utf8').digest('hex');
}

/** Đáp án tác giả viết ⇒ mảng các đáp án chấp nhận được (mỗi phần tử là một câu trả lời). */
function cacDapAn(loai: string, dapAn: unknown): unknown[] {
  if (loai === 'choice') {
    // ['b'] = một đáp án (chọn b) · [['a','c']] = chọn a VÀ c · 'b' = chọn b
    if (Array.isArray(dapAn) && dapAn.some(Array.isArray)) return dapAn;
    return [Array.isArray(dapAn) ? dapAn : [dapAn]];
  }
  if (loai === 'order') return Array.isArray(dapAn) && Array.isArray(dapAn[0]) ? dapAn : [dapAn];
  return Array.isArray(dapAn) ? dapAn : [dapAn]; // ô bảng: danh sách giá trị chấp nhận
}

const cotPhanBietHoa = (b: Obj, khoaO: string): boolean => {
  const maCot = khoaO.split('.').pop();
  const cot = Array.isArray(b.cot) ? b.cot.filter(isObj).find((c) => c.ma === maCot) : null;
  return !!(cot && cot.phanBietHoa === true);
};

// ─── payload cho trình duyệt ───────────────────────────────────────────────────────

/**
 * Bộ kiểm cho TRANG BÀI (ai cũng xem): bỏ kiểm ẩn, băm đáp án. Kèm `soKiem`/`soAn` để giao diện
 * nói được "3 kiểm mẫu · 7 kiểm ẩn khi Nộp".
 */
export function testsCongKhai(testsJson: unknown, exerciseId: number): Obj | null {
  if (!isObj(testsJson)) return null;
  const { tong, an } = demKiem(testsJson);
  const loai = String(testsJson.loai ?? '');
  if (STATIC_GRADE_KINDS.has(loai)) return { ...baoDapAn(testsJson, exerciseId), soKiem: tong, soAn: 0 };
  const kiem = (Array.isArray(testsJson.kiem) ? testsJson.kiem : []).filter(isObj);
  // giữ chỉ số GỐC (`i`) để kết quả Chạy thử khớp với kết quả Nộp
  const mau = kiem.map((k, i): Obj => ({ ...k, i })).filter((k) => k.an !== true);
  return { ...testsJson, kiem: mau, soKiem: tong, soAn: an };
}

/** Bộ kiểm ĐỦ cho lúc Nộp (loại code). Loại tĩnh: như công khai (đáp án vẫn chỉ là băm). */
export function testsDayDu(testsJson: unknown, exerciseId: number): Obj | null {
  if (!isObj(testsJson)) return null;
  const { tong, an } = demKiem(testsJson);
  const loai = String(testsJson.loai ?? '');
  if (STATIC_GRADE_KINDS.has(loai)) return { ...baoDapAn(testsJson, exerciseId), soKiem: tong, soAn: 0 };
  const kiem = (Array.isArray(testsJson.kiem) ? testsJson.kiem : []).filter(isObj).map((k, i) => ({ ...k, i }));
  return { ...testsJson, kiem, soKiem: tong, soAn: an };
}

function baoDapAn(tj: Obj, exId: number): Obj {
  const loai = String(tj.loai);
  if (loai === 'table') {
    const bang = (Array.isArray(tj.bang) ? tj.bang : []).filter(isObj).map((b) => {
      const ma = String(b.ma ?? '');
      const dapAnBam: Record<string, string[]> = {};
      for (const [o, v] of Object.entries(isObj(b.dapAn) ? b.dapAn : {})) {
        const hoa = cotPhanBietHoa(b, o);
        dapAnBam[o] = cacDapAn('table', v).map((x) => bam(exId, `${ma}.${o}`, dapAnChuan('table', x, { phanBietHoa: hoa })));
      }
      const { dapAn: _bo, ...rest } = b;
      void _bo;
      return { ...rest, dapAnBam };
    });
    return { ...tj, bang };
  }
  const cauHoi = (Array.isArray(tj.cauHoi) ? tj.cauHoi : []).filter(isObj).map((c) => {
    const ma = String(c.ma ?? '');
    const { dapAn, ...rest } = c;
    return { ...rest, dapAnBam: cacDapAn(loai, dapAn).map((x) => bam(exId, ma, dapAnChuan(loai, x))) };
  });
  return { ...tj, cauHoi };
}

// ─── chấm lại phía máy chủ (choice / order / table) ────────────────────────────────

export interface KetQuaKiem {
  i: number;
  dat: boolean;
  an?: boolean;
  nhom?: string | null;
  moTa?: string;
  thay?: string;
  ms?: number;
}

/** traLoi: choice/order ⇒ { [maCau]: giá trị } · table ⇒ { "<maBang>.<maHang>.<maCot>": "giá trị" } */
export function chamTinh(testsJson: unknown, traLoi: unknown): KetQuaKiem[] {
  if (!isObj(testsJson)) return [];
  const loai = String(testsJson.loai ?? '');
  const tl = isObj(traLoi) ? traLoi : {};
  const out: KetQuaKiem[] = [];
  if (loai === 'table') {
    for (const b of (Array.isArray(testsJson.bang) ? testsJson.bang : []).filter(isObj)) {
      const ma = String(b.ma ?? '');
      for (const [o, v] of Object.entries(isObj(b.dapAn) ? b.dapAn : {})) {
        const hoa = cotPhanBietHoa(b, o);
        const cua = dapAnChuan('table', tl[`${ma}.${o}`], { phanBietHoa: hoa });
        const dat = cua !== '' && cacDapAn('table', v).some((x) => dapAnChuan('table', x, { phanBietHoa: hoa }) === cua);
        out.push({ i: out.length, dat, nhom: typeof b.nhom === 'string' ? b.nhom : null, moTa: nhanO(b, o) });
      }
    }
    return out;
  }
  for (const c of (Array.isArray(testsJson.cauHoi) ? testsJson.cauHoi : []).filter(isObj)) {
    const ma = String(c.ma ?? '');
    const cua = dapAnChuan(loai, tl[ma]);
    const dat = cua !== '' && cacDapAn(loai, c.dapAn).some((x) => dapAnChuan(loai, x) === cua);
    out.push({ i: out.length, dat, nhom: typeof c.nhom === 'string' ? c.nhom : null, moTa: `Câu ${out.length + 1}` });
  }
  return out;
}

/** Nhãn dễ đọc của một ô bảng: "<giá trị cột đầu của hàng> · <tên cột>" (vd "TC04 · Expected"). */
export function nhanO(b: Obj, khoaO: string): string {
  const [maHang, maCot] = khoaO.split('.');
  const cot = (Array.isArray(b.cot) ? b.cot : []).filter(isObj);
  const hang = (Array.isArray(b.hang) ? b.hang : []).filter(isObj).find((h) => h.ma === maHang);
  const dau = cot[0] && hang && isObj(hang.o) ? hang.o[String(cot[0].ma)] : null;
  const tenCot = cot.find((c) => c.ma === maCot)?.ten ?? maCot;
  return `${dau ?? maHang} · ${tenCot}`;
}

// ─── kiểm hình dạng kết quả trình duyệt gửi về (loại code) ─────────────────────────

/** null ⇒ hợp lệ; chuỗi ⇒ lý do từ chối. Trả lại mảng đã chuẩn hoá qua `ra`. */
export function chuanHoaKetQuaClient(testsJson: unknown, raw: unknown): { loi: string } | { ketQua: KetQuaKiem[] } {
  const ds = cacKiem(testsJson);
  if (!ds.length) return { loi: 'Đề này không có bộ kiểm.' };
  if (!Array.isArray(raw)) return { loi: 'Thiếu kết quả từng kiểm.' };
  if (raw.length !== ds.length) return { loi: `Cần đúng ${ds.length} kết quả (nhận ${raw.length}) — tải lại trang rồi nộp lại.` };
  const ketQua: KetQuaKiem[] = [];
  for (let i = 0; i < raw.length; i++) {
    const r = raw[i];
    if (!isObj(r) || typeof r.dat !== 'boolean') return { loi: `Kết quả #${i + 1} sai dạng.` };
    const ms = typeof r.ms === 'number' && Number.isFinite(r.ms) ? Math.max(0, Math.min(600000, Math.round(r.ms))) : undefined;
    ketQua.push({
      i,
      dat: r.dat,
      an: ds[i].an || undefined,
      nhom: ds[i].nhom,
      // kiểm ẩn: không lưu "thấy gì" (có thể chứa giá trị mong đợi suy ra được)
      ...(ds[i].an ? {} : { thay: typeof r.thay === 'string' ? r.thay.slice(0, 400) : undefined }),
      ...(ms !== undefined ? { ms } : {}),
    });
  }
  return { ketQua };
}

// ─── điểm ──────────────────────────────────────────────────────────────────────────

export interface DiemNhom { ma: string; ten: string; diem: number; dat: number; tong: number; diemDat: number }
export interface Diem { score: number; maxScore: number; nhom: DiemNhom[] }

const lamTron025 = (x: number) => Math.round(x * 4) / 4;

/**
 * Điểm của một lượt:
 *  - đề có `thangDiem: [{ ma, ten, diem }]` (đề lớn kiểu PE, tổng thường = 10) ⇒ mỗi chức năng được
 *    `diem × (kiểm đạt / kiểm của chức năng)`, làm tròn 0,25 như bảng điểm PE; kiểm không gắn `nhom`
 *    vẫn tính vào đạt/tổng nhưng không cộng điểm;
 *  - không có ⇒ phần trăm kiểm đạt (0–100).
 * ⚠ Bản sao: frontend/src/components/code-lab/cham/diem.ts
 */
export function tinhDiem(testsJson: unknown, ketQua: ReadonlyArray<Pick<KetQuaKiem, 'dat' | 'nhom'>>): Diem {
  const thang = isObj(testsJson) && Array.isArray(testsJson.thangDiem) ? testsJson.thangDiem.filter(isObj) : [];
  if (thang.length) {
    const nhom: DiemNhom[] = thang.map((t) => {
      const ma = String(t.ma ?? '');
      const cua = ketQua.filter((r) => r.nhom === ma);
      const dat = cua.filter((r) => r.dat).length;
      const diem = Number(t.diem) || 0;
      return { ma, ten: String(t.ten ?? ma), diem, dat, tong: cua.length, diemDat: cua.length ? lamTron025((diem * dat) / cua.length) : 0 };
    });
    return {
      score: Math.round(nhom.reduce((s, n) => s + n.diemDat, 0) * 100) / 100,
      maxScore: Math.round(nhom.reduce((s, n) => s + n.diem, 0) * 100) / 100,
      nhom,
    };
  }
  const tong = ketQua.length;
  const dat = ketQua.filter((r) => r.dat).length;
  return { score: tong ? Math.round((dat * 100) / tong) : 0, maxScore: 100, nhom: [] };
}
