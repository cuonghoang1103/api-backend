/**
 * Máy chấm SQL trong TRÌNH DUYỆT — loại 'sql' (29/10/2026) và 'sql-pg' (31/10/2026). PostgreSQL 18 (PGlite/WASM) chạy trong Web
 * Worker; mỗi kiểm: nạp dữ liệu mẫu ⇒ chạy mã người học ⇒ (truy vấn kiểm) ⇒ so bảng kết quả ⇒ ROLLBACK.
 *
 * Bộ kiểm (`testsJson`, lược đồ đủ: content/codelab/README.md mục "SQL"):
 *   { loai: 'sql', csdl: '<DDL + INSERT kiểu SQL Server>', tepChinh?: 'query.sql', timeoutMs?, kiem: [
 *       { kiem: 'ket-qua',   moTa, mongDoi: {cot, hang}, thuTu?, tenCot?, boQuaThuTuCot?, saiSo?, nullBang?, tep?, csdl?, themCsdl?, an?, nhom? },
 *       { kiem: 'sau-lenh',  moTa, kiemTra: 'SELECT …', mongDoi, …như trên },      // DML/DDL: chạy bài rồi truy vấn kiểm
 *       { kiem: 'bi-chan',   moTa, thu: 'INSERT …', maLoi?: '23514' },             // câu thử PHẢI bị CSDL từ chối
 *       { kiem: 'chay-duoc', moTa, thu: 'INSERT …' },                               // câu thử phải chạy được
 *       { kiem: 'ma-nguon',  moTa, khop, phuDinh? }                                 // regex trên mã (chung với JS)
 *   ]}
 * `mongDoi` do bộ xuất đề dựng bằng cách chạy LỜI GIẢI qua đúng bộ chạy này (scripts/codelab-xuat-de.mjs).
 *
 * Phương ngữ theo loại:
 *   'sql'    (DBI202) — xem sqlLoi.ts (đầu tệp): mã có cú pháp chỉ SQL Server hoặc chỉ PostgreSQL hiểu bị BÁO, không
 *            chấm; hành vi khác nhau với cùng cú pháp được giả lập theo SQL Server.
 *   'sql-pg' (khoá PostgreSQL) — PostgreSQL NGUYÊN BẢN: không dò phương ngữ, dữ liệu mẫu nạp nguyên văn, worker
 *            riêng không citext/cl_ss (sqlRunner cheDo 'pg'). Câu lỗi mà có dấu T-SQL ⇒ thêm gợi ý cách viết PostgreSQL.
 *
 * Giới hạn: mã ≤ 20 000 ký tự, ≤ 40 câu lệnh, không BEGIN/COMMIT/ROLLBACK; mỗi bảng kết quả ≤ 2 000 dòng
 * (sqlRunner.TRAN_DONG); mỗi kiểm ≤ timeoutMs (mặc định 8 s) — quá ⇒ huỷ worker (truy vấn chạy mãi / tích
 * Descartes khổng lồ) và dựng lại cho kiểm sau. Lần đầu tải PGlite ~5 MB từ CDN (sau đó trình duyệt giữ).
 *
 * App desktop: CSP của renderer cấm worker blob: ⇒ chạy trong khung HỘP CÁT `__CT_HOP_CAT_KHUNG__` (CSP
 * riêng đã cho script jsdelivr + 'unsafe-eval' + connect-src jsdelivr — đủ cho PGlite, KHÔNG phải sửa CSP).
 * Khung là iframe gốc mờ; quá giờ ⇒ gỡ khung.
 */
import { kiemMaNguon } from './chamJs';
import { chuGocCot, coLenhGiaoDich, csdlChoPg, goiYTsqlChoPg, kiemPhuongNgu, moTaLoiSql, tachLenhSql, type LoiSql } from './sqlLoi';
import { bangChu, chuanHoaBang, soSanhBang, type BangSql, type TuyChonSo } from './sqlSoSanh';
import { maWorkerSql, trangKhungSql, type CheDoSql } from './sqlRunner';
import type { Kiem, KetQuaKiem, TepMap, TestsJson } from './kieu';

export const SQL_TRAN_KY_TU = 20000;
export const SQL_TRAN_CAU = 40;
const MO_TOI_DA_MS = 90000; // lần đầu: tải ~5 MB + biên dịch WASM + initdb
const KIEM_MAC_DINH_MS = 8000;

/** Loại chấm ⇒ chế độ của máy SQL: 'sql-pg' = PostgreSQL nguyên bản; còn lại ('sql') = giả lập SQL Server. */
export function cheDoCua(tj: Pick<TestsJson, 'loai'>): CheDoSql {
  return tj.loai === 'sql-pg' ? 'pg' : 'sqlserver';
}

// ─── phiên máy SQL (dùng lại giữa các lần Chạy thử; tự đóng khi rảnh) ─────────────────────────────

interface BuocKq { ok: boolean; ds?: Array<{ cot: string[]; kieu: number[]; hang: unknown[][]; tong: number; lenh: string | null }>; loi?: LoiSql; soLenh?: number }
interface KqKichBan { buoc: BuocKq[]; ms: number }
type TraLoiMay = { san?: boolean; kq?: KqKichBan; loiMo?: string; loiMay?: string };

interface PhienSql {
  gui(du: { mo?: boolean; kb?: unknown }, hetMs: number): Promise<TraLoiMay | null>;
  huy(): void;
}

let demTin = 0;

function taoPhienWorker(cheDo: CheDoSql): PhienSql {
  const url = URL.createObjectURL(new Blob([maWorkerSql(cheDo)], { type: 'text/javascript' }));
  const w = new Worker(url, { type: 'module', name: 'cl-sql' });
  const cho = new Map<number, (v: TraLoiMay | null) => void>();
  let chet = false;
  w.onmessage = (ev: MessageEvent) => { const d = ev.data as TraLoiMay & { id: number }; cho.get(d.id)?.(d); cho.delete(d.id); };
  w.onerror = (ev: ErrorEvent) => { ev.preventDefault?.(); const loi = ev.message || 'worker SQL hỏng'; cho.forEach((f) => f({ loiMay: loi })); cho.clear(); };
  return {
    gui(du, hetMs) {
      if (chet) return Promise.resolve(null);
      const id = ++demTin;
      return new Promise((resolve) => {
        const hen = setTimeout(() => { cho.delete(id); resolve(null); }, hetMs);
        cho.set(id, (v) => { clearTimeout(hen); resolve(v); });
        w.postMessage({ id, ...du });
      });
    },
    huy() { chet = true; w.terminate(); URL.revokeObjectURL(url); cho.forEach((f) => f(null)); cho.clear(); },
  };
}

function taoPhienKhung(hopCat: string, cheDo: CheDoSql): PhienSql {
  const f = document.createElement('iframe');
  f.setAttribute('sandbox', 'allow-scripts');
  f.setAttribute('aria-hidden', 'true');
  f.setAttribute('tabindex', '-1');
  f.title = 'Máy chấm SQL';
  f.style.cssText = 'position:fixed;left:0;top:0;width:10px;height:10px;border:0;opacity:0.001;pointer-events:none;z-index:-1;';
  const cho = new Map<string, (v: TraLoiMay | null) => void>();
  let san: () => void = () => {};
  const daSan = new Promise<void>((r) => { san = r; });
  let chet = false;
  const nghe = (e: MessageEvent) => {
    if (e.source !== f.contentWindow) return;
    const d = e.data as TraLoiMay & { __clSql?: boolean; id?: string };
    if (!d || !d.__clSql) return;
    if (d.id === 'khung-san') { san(); return; }
    const k = String(d.id);
    cho.get(k)?.(d);
    cho.delete(k);
  };
  window.addEventListener('message', nghe);
  f.addEventListener('load', () => f.contentWindow?.postMessage({ __napTrang: trangKhungSql(cheDo) }, '*'), { once: true });
  f.src = hopCat;
  document.body.appendChild(f);
  return {
    async gui(du, hetMs) {
      if (chet) return null;
      const id = String(++demTin);
      return new Promise((resolve) => {
        const hen = setTimeout(() => { cho.delete(id); resolve(null); }, hetMs);
        cho.set(id, (v) => { clearTimeout(hen); resolve(v); });
        void daSan.then(() => f.contentWindow?.postMessage({ __clSql: true, id, ...du }, '*'));
      });
    },
    huy() { chet = true; window.removeEventListener('message', nghe); f.remove(); cho.forEach((fn) => fn(null)); cho.clear(); },
  };
}

let phien: PhienSql | null = null;
let phienCheDo: CheDoSql = 'sqlserver';
let phienSan = false;
let henDong: ReturnType<typeof setTimeout> | null = null;

/** Một phiên (một worker ~100 MB) tại một thời điểm: đổi chế độ ⇒ đóng phiên cũ, mở phiên mới. */
function layPhien(cheDo: CheDoSql): PhienSql {
  if (henDong) { clearTimeout(henDong); henDong = null; }
  if (phien && phienCheDo !== cheDo) boPhien();
  if (!phien) {
    const hopCat = (globalThis as { __CT_HOP_CAT_KHUNG__?: string }).__CT_HOP_CAT_KHUNG__;
    phien = hopCat ? taoPhienKhung(hopCat, cheDo) : taoPhienWorker(cheDo);
    phienCheDo = cheDo;
    phienSan = false;
  }
  return phien;
}
function boPhien() {
  phien?.huy();
  phien = null;
  phienSan = false;
}
/** Rảnh 3 phút ⇒ đóng worker (giải phóng ~100 MB của PostgreSQL WASM). */
function henDongPhien() {
  if (henDong) clearTimeout(henDong);
  henDong = setTimeout(boPhien, 180000);
}

async function moPhien(cheDo: CheDoSql): Promise<{ loi?: string }> {
  const p = layPhien(cheDo);
  if (phienSan) return {};
  const r = await p.gui({ mo: true }, MO_TOI_DA_MS);
  if (!r) { boPhien(); return { loi: 'Không khởi động được PostgreSQL (WASM) sau 90 giây — mạng chậm hoặc CDN cdn.jsdelivr.net bị chặn. Thử lại. · Could not start PostgreSQL (WASM) within 90 s — slow network or the CDN is blocked.' }; }
  if (r.loiMo || r.loiMay) { boPhien(); return { loi: `Không nạp được PostgreSQL (WASM): ${r.loiMo || r.loiMay}` }; }
  phienSan = true;
  return {};
}

// ─── chấm ─────────────────────────────────────────────────────────────────────────────────────

const hai = (vi: string, en: string) => `${vi}\n— ${en}`;

/** Tệp SQL người học cho một kiểm: `k.tep` → `tj.tepChinh` → tệp .sql đầu tiên. */
export function tepCuaKiem(tj: TestsJson, k: Kiem, files: TepMap): string {
  if (typeof k.tep === 'string') return k.tep;
  if (typeof tj.tepChinh === 'string') return tj.tepChinh;
  return Object.keys(files).find((t) => /\.sql$/i.test(t)) ?? 'query.sql';
}

/** Kiểm trước khi chạy (giới hạn, giao dịch, phương ngữ — chỉ chế độ SQL Server). null ⇒ qua. */
export function kiemTruocKhiChay(sql: string, cheDo: CheDoSql = 'sqlserver'): { vi: string; en: string; maPhuongNgu?: string[] } | null {
  if (!sql.trim() || !tachLenhSql(sql).length) return { vi: 'Tệp chưa có câu SQL nào.', en: 'The file has no SQL statement yet.' };
  if (sql.length > SQL_TRAN_KY_TU) return { vi: `Mã dài quá ${SQL_TRAN_KY_TU} ký tự.`, en: `Code longer than ${SQL_TRAN_KY_TU} characters.` };
  if (tachLenhSql(sql).length > SQL_TRAN_CAU) return { vi: `Quá ${SQL_TRAN_CAU} câu lệnh.`, en: `More than ${SQL_TRAN_CAU} statements.` };
  if (coLenhGiaoDich(sql)) {
    return {
      vi: 'Bỏ BEGIN/COMMIT/ROLLBACK: máy chấm tự bọc mỗi kiểm trong một giao dịch rồi huỷ (dữ liệu mẫu luôn sạch).',
      en: 'Remove BEGIN/COMMIT/ROLLBACK: the grader wraps every check in its own transaction and rolls it back.',
    };
  }
  // PostgreSQL nguyên bản: không chặn cú pháp nào — PostgreSQL tự báo lỗi (kèm gợi ý T-SQL nếu có, danhGiaKichBan)
  const vp = cheDo === 'pg' ? [] : kiemPhuongNgu(sql);
  if (vp.length) {
    const tsql = vp.filter((v) => v.phia === 'tsql');
    const pg = vp.filter((v) => v.phia === 'pg');
    const vi: string[] = [];
    const en: string[] = [];
    if (tsql.length) {
      vi.push(`Cú pháp chỉ SQL Server có — máy chấm này (PostgreSQL WASM) không chấm, máy chấm SQL Server thật sắp có:\n${tsql.map((v) => `• ${v.vi}`).join('\n')}`);
      en.push(`SQL Server-only syntax — this grader (PostgreSQL WASM) does not grade it; a real SQL Server grader is coming:\n${tsql.map((v) => `• ${v.en}`).join('\n')}`);
    }
    if (pg.length) {
      vi.push(`Cú pháp chỉ PostgreSQL có — chạy được ở đây nhưng SQL Server (môi trường thi) sẽ báo lỗi, nên không tính đạt:\n${pg.map((v) => `• ${v.vi}`).join('\n')}`);
      en.push(`PostgreSQL-only syntax — it runs here but SQL Server (the exam environment) rejects it, so it does not count:\n${pg.map((v) => `• ${v.en}`).join('\n')}`);
    }
    return { vi: vi.join('\n'), en: en.join('\n'), maPhuongNgu: vp.map((v) => v.ma) };
  }
  return null;
}

/** Các bước của một kiểm (`cheDo` đi kèm để danhGiaKichBan biết cách giải thích lỗi; bộ chạy bỏ qua nó). */
export function dungKichBan(tj: TestsJson, k: Kiem, sqlBai: string): { buoc: Array<{ loai: string; sql: string }>; cheDo: CheDoSql } {
  const cheDo = cheDoCua(tj);
  const csdl = [typeof k.csdl === 'string' ? k.csdl : String(tj.csdl ?? ''), typeof k.themCsdl === 'string' ? k.themCsdl : ''].filter((x) => x.trim()).join(';\n');
  const buoc: Array<{ loai: string; sql: string }> = [];
  // 'sql': dữ liệu mẫu viết kiểu SQL Server ⇒ dịch sang PostgreSQL giả lập SQL Server; 'sql-pg': nạp nguyên văn
  if (csdl.trim()) buoc.push({ loai: 'csdl', sql: cheDo === 'pg' ? csdl : csdlChoPg(csdl) });
  buoc.push({ loai: 'bai', sql: sqlBai });
  if (k.kiem === 'sau-lenh') buoc.push({ loai: 'truyVan', sql: String(k.kiemTra ?? '') });
  if (k.kiem === 'bi-chan' || k.kiem === 'chay-duoc') buoc.push({ loai: 'thu', sql: String(k.thu ?? '') });
  return { buoc, cheDo };
}

export interface DanhGiaSql {
  dat: boolean;
  thay?: string;
  bangSql?: KetQuaKiem['bangSql'];
  /** Bảng THỰC (để bộ xuất dựng `mongDoi` từ lời giải). */
  bang?: BangSql;
  loiDe?: string;
}

const tuyChon = (k: Kiem): TuyChonSo => ({
  thuTu: k.thuTu === true,
  tenCot: k.tenCot !== false,
  boQuaThuTuCot: k.boQuaThuTuCot === true,
  saiSo: typeof k.saiSo === 'number' ? k.saiSo : undefined,
  nullBang: k.nullBang === 'rong' ? 'rong' : 'chat',
});

/**
 * Đánh giá kết quả một kịch bản (thuần — Node dùng lại để dựng `mongDoi` từ lời giải). `mong` = null ⇒ chỉ
 * lấy bảng thực.
 */
export function danhGiaKichBan(k: Kiem, kb: { buoc: Array<{ loai: string }>; cheDo?: CheDoSql }, sqlBai: string, kq: KqKichBan, mong: BangSql | null): DanhGiaSql {
  const vt = (loai: string) => kb.buoc.findIndex((b) => b.loai === loai);
  const lay = (loai: string) => { const i = vt(loai); return i >= 0 ? kq.buoc[i] : undefined; };
  const csdl = lay('csdl');
  if (vt('csdl') >= 0 && (!csdl || !csdl.ok)) {
    const ly = csdl?.loi?.thongDiep ?? 'không chạy';
    return { dat: false, loiDe: `dữ liệu mẫu của đề lỗi: ${ly}`, thay: hai(`Đề lỗi (dữ liệu mẫu không nạp được: ${ly}) — báo cho người soạn.`, `Task error (sample data failed: ${ly}).`) };
  }
  const bai = lay('bai');
  if (!bai) return { dat: false, thay: hai('Không chạy được mã của bạn.', 'Your code did not run.') };
  if (!bai.ok) {
    const m = moTaLoiSql(sqlBai, bai.loi ?? { thongDiep: 'lỗi' });
    // PostgreSQL nguyên bản: câu lỗi mà mang dấu T-SQL ⇒ chỉ cách viết của PostgreSQL
    const gy = kb.cheDo === 'pg' ? goiYTsqlChoPg(sqlBai) : [];
    if (gy.length) {
      return { dat: false, thay: hai(`${m.vi}\nCú pháp SQL Server (T-SQL) — PostgreSQL viết khác:\n${gy.map((g) => `• ${g.vi}`).join('\n')}`, `${m.en}\nSQL Server (T-SQL) syntax — PostgreSQL spells it differently:\n${gy.map((g) => `• ${g.en}`).join('\n')}`) };
    }
    return { dat: false, thay: hai(m.vi, m.en) };
  }
  const so = (thayTho: BangSql, nguonTen: string): DanhGiaSql => {
    const thay = { ...thayTho, cot: chuGocCot(nguonTen, thayTho.cot) };
    if (!mong) return { dat: true, bang: thay };
    const r = soSanhBang(mong, thay, tuyChon(k));
    return {
      dat: r.dat, bang: thay,
      thay: hai(r.vi, r.en),
      bangSql: r.dat ? undefined : { mong: catBang(mong), thay: catBang(thay), thieu: r.thieu, thua: r.thua, dongLech: r.dongLech },
    };
  };
  if (k.kiem === 'ket-qua') {
    const ds = bai.ds ?? [];
    const cuoi = ds[ds.length - 1];
    if (!cuoi) return { dat: false, thay: hai('Mã không trả về bảng kết quả nào — bài này cần một câu SELECT.', 'No result set returned — this task needs a SELECT statement.') };
    if (cuoi.tong > cuoi.hang.length) return { dat: false, thay: hai(`Kết quả ${cuoi.tong} dòng — quá nhiều (thiếu điều kiện nối ⇒ tích Descartes?).`, `${cuoi.tong} rows — too many (missing join condition ⇒ Cartesian product?).`) };
    return so(chuanHoaBang(cuoi.cot, cuoi.kieu, cuoi.hang), sqlBai);
  }
  if (k.kiem === 'sau-lenh') {
    const tv = lay('truyVan');
    if (!tv || !tv.ok) {
      const ly = tv?.loi?.thongDiep ?? 'không chạy';
      // truy vấn kiểm hỏng sau khi chạy bài ⇒ thường do bài xoá/đổi tên bảng/cột mà đề cần
      return { dat: false, thay: hai(`Truy vấn kiểm của đề không chạy được sau mã của bạn: ${ly}. Bạn có đặt đúng tên bảng/cột/view như đề yêu cầu?`, `The task's check query failed after your code: ${ly}. Did you use the exact table/column/view names?`) };
    }
    const cuoi = (tv.ds ?? [])[(tv.ds ?? []).length - 1];
    if (!cuoi) return { dat: false, loiDe: 'truy vấn kiểm không trả bảng', thay: hai('Đề lỗi: truy vấn kiểm không trả bảng.', 'Task error: check query returned no rows.') };
    return so(chuanHoaBang(cuoi.cot, cuoi.kieu, cuoi.hang), String(k.kiemTra ?? ''));
  }
  if (k.kiem === 'bi-chan' || k.kiem === 'chay-duoc') {
    const thu = lay('thu');
    const cau = String(k.thu ?? '').replace(/\s+/g, ' ').trim();
    const ngan = cau.length > 140 ? `${cau.slice(0, 137)}…` : cau;
    if (!thu) return { dat: false, thay: hai('Không chạy được câu thử.', 'Probe did not run.') };
    if (k.kiem === 'bi-chan') {
      if (thu.ok) return { dat: false, thay: hai(`Câu này lẽ ra phải BỊ CHẶN nhưng lại chạy được: ${ngan}\nRàng buộc (PRIMARY KEY / FOREIGN KEY / NOT NULL / UNIQUE / CHECK) còn thiếu hoặc sai.`, `This statement should be REJECTED but it ran: ${ngan}\nA constraint is missing or wrong.`) };
      if (typeof k.maLoi === 'string' && thu.loi?.ma && !String(k.maLoi).split('|').includes(thu.loi.ma)) {
        return { dat: false, thay: hai(`Bị chặn nhưng vì lý do khác: ${thu.loi.thongDiep}`, `Rejected, but for another reason: ${thu.loi.thongDiep}`) };
      }
      return { dat: true, thay: hai(`Bị chặn đúng: ${thu.loi?.thongDiep ?? ''}`, `Correctly rejected: ${thu.loi?.thongDiep ?? ''}`) };
    }
    if (!thu.ok) return { dat: false, thay: hai(`Câu hợp lệ này lẽ ra chạy được nhưng bị chặn: ${ngan}\n${thu.loi?.thongDiep ?? ''}`, `This valid statement should succeed but failed: ${ngan}\n${thu.loi?.thongDiep ?? ''}`) };
    const cuoi = (thu.ds ?? [])[(thu.ds ?? []).length - 1];
    if (mong && cuoi) return so(chuanHoaBang(cuoi.cot, cuoi.kieu, cuoi.hang), String(k.thu ?? ''));
    return { dat: true, bang: cuoi ? chuanHoaBang(cuoi.cot, cuoi.kieu, cuoi.hang) : undefined };
  }
  return { dat: false, loiDe: `loại kiểm lạ: ${String(k.kiem)}`, thay: `Loại kiểm "${String(k.kiem)}" không có trong máy chấm SQL.` };
}

const catBang = (b: BangSql, max = 30): BangSql & { tong: number } => ({ cot: b.cot, hang: b.hang.slice(0, max), tong: b.hang.length });

function laMongDoi(v: unknown): v is BangSql {
  return !!v && typeof v === 'object' && Array.isArray((v as BangSql).cot) && Array.isArray((v as BangSql).hang);
}

/** Chấm danh sách kiểm (Chạy thử = kiểm mẫu, Nộp = đủ). */
export async function chamSql(tj: TestsJson, kiem: Kiem[], files: TepMap, onTung?: (r: KetQuaKiem) => void): Promise<KetQuaKiem[]> {
  const out: KetQuaKiem[] = [];
  const xong = (idx: number, r: Omit<KetQuaKiem, 'i'>) => {
    const k = kiem[idx];
    const kq: KetQuaKiem = { ...r, i: typeof k.i === 'number' ? k.i : idx, an: !!k.an, nhom: (k.nhom as string) ?? null, moTa: k.moTa };
    if (kq.an) delete kq.bangSql;
    out.push(kq);
    onTung?.(kq);
  };
  const hetMs = Math.min(30000, Number(tj.timeoutMs) || KIEM_MAC_DINH_MS);
  const cheDo = cheDoCua(tj);
  let loiMo: string | null = null;
  // mã đã quá giờ một lần ⇒ các kiểm sau dùng CÙNG mã báo ngay (khỏi đợi thêm N × timeout)
  const quaGio = new Set<string>();
  for (const [idx, k] of kiem.entries()) {
    const t0 = performance.now();
    if (k.kiem === 'ma-nguon') { xong(idx, kiemMaNguon(k, files)); continue; }
    const tep = tepCuaKiem(tj, k, files);
    const sql = files[tep];
    if (sql == null) { xong(idx, { dat: false, thay: hai(`Thiếu tệp ${tep}.`, `Missing file ${tep}.`) }); continue; }
    const truoc = kiemTruocKhiChay(sql, cheDo);
    if (truoc) { xong(idx, { dat: false, thay: hai(truoc.vi, truoc.en) }); continue; }
    if (loiMo) { xong(idx, { dat: false, thay: loiMo }); continue; }
    const mo = await moPhien(cheDo);
    if (mo.loi) { loiMo = mo.loi; xong(idx, { dat: false, thay: loiMo }); continue; }
    const thongBaoQuaGio = cheDo === 'pg'
      ? hai(`Quá ${hetMs / 1000} giây — máy chấm đã dừng PostgreSQL. Truy vấn chạy mãi? (CTE đệ quy thiếu điều kiện dừng / gặp vòng lặp trong dữ liệu, vòng LOOP không EXIT, nối thiếu điều kiện ⇒ tích Descartes)`, `Over ${hetMs / 1000} s — the grader stopped PostgreSQL. Runaway query? (recursive CTE without a stop condition / a cycle in the data, a LOOP without EXIT, missing join condition ⇒ Cartesian product)`)
      : hai(`Quá ${hetMs / 1000} giây — truy vấn chạy mãi? (nối thiếu điều kiện ⇒ tích Descartes, hay truy vấn con lồng quá sâu)`, `Over ${hetMs / 1000} s — runaway query? (missing join condition ⇒ Cartesian product, or deeply nested subqueries)`);
    if (quaGio.has(sql)) { xong(idx, { dat: false, thay: thongBaoQuaGio }); continue; }
    const kb = dungKichBan(tj, k, sql);
    const t1 = performance.now();
    const r = await layPhien(cheDo).gui({ kb }, hetMs);
    if (!r) {
      boPhien(); // worker đang kẹt trong một truy vấn — huỷ, kiểm sau dựng lại
      quaGio.add(sql);
      xong(idx, { dat: false, ms: Math.round(performance.now() - t1), thay: thongBaoQuaGio });
      continue;
    }
    if (!r.kq) { boPhien(); xong(idx, { dat: false, thay: `Máy SQL hỏng: ${r.loiMay ?? r.loiMo ?? '?'}` }); continue; }
    const mong = laMongDoi(k.mongDoi) ? k.mongDoi : null;
    const dg = danhGiaKichBan(k, kb, sql, r.kq, mong);
    xong(idx, { dat: dg.dat, thay: dg.thay, ms: Math.round(performance.now() - t0), ...(dg.bangSql ? { bangSql: dg.bangSql } : {}) });
  }
  henDongPhien();
  return out;
}

/** Bảng mong đợi dạng chữ (tab "Kiểm mẫu", ví dụ trong đề). */
export function moTaMongDoi(k: Kiem, max = 6): string | null {
  return laMongDoi(k.mongDoi) ? bangChu(k.mongDoi, max) : null;
}
