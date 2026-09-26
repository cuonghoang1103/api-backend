/**
 * BỘ NHỚ AI CODE — kho BÀI HỌC agent tự ghi để không lặp lại lỗi cũ.
 *
 * ─── VÌ SAO CÓ ───
 * Mỗi việc agent bắt đầu từ trắng tay. Lần trước nó mất 6 bước mới biết
 * `npm install` ở dự án này phải kèm `--legacy-peer-deps`; lần sau nó lại
 * mất đúng 6 bước đó. Bộ nhớ là chỗ ghi lại "đã hiểu ra điều gì" để lần sau
 * đọc thay vì mò lại.
 *
 * ─── Ở ĐÂU, DẠNG GÌ ───
 * File Markdown có phần đầu YAML, mỗi bài một file `<id>.md`, trong `userData`
 * (KHÔNG trong repo của người dùng — repo lạ không được cài bài học vào đầu
 * agent, và bài học không được lọt vào commit của họ):
 *   - `agent-bo-nho/du-an/<băm 16 hex của gốc dự án>/` — chỉ đúng cho dự án đó
 *   - `agent-bo-nho/chung/`                             — đúng ở mọi nơi
 * Markdown vì người dùng mở ra đọc/sửa tay được, và vì giao diện chỉ việc liệt kê.
 *
 * ─── BỘ NHỚ KHÔNG PHẢI QUYỀN ───
 * Thứ model ghi vào đây sẽ được nạp lại vào prompt ở MỌI lượt sau. Nếu nó ghi
 * được "luôn cho phép xoá file" thì một lần bị tiêm prompt thành một cửa hậu
 * vĩnh viễn. Nên `nhoBaiHoc` từ chối mọi câu kiểu cấp quyền / bỏ duyệt, và từ
 * chối mọi thứ trông như bí mật (khoá API, mật khẩu) — file nằm trần trên đĩa.
 */
import { createHash } from 'node:crypto';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { boBaKyTu, chuanHoaDauHieu, jaccard } from './dauHieuLoi';

export type PhamVi = 'du_an' | 'chung';
export type LoaiBaiHoc = 'loi' | 'quy_uoc' | 'moi_truong' | 'so_thich';

export interface BaiHoc {
  id: string;
  phamVi: PhamVi;
  loai: LoaiBaiHoc;
  tieuDe: string;
  dauHieu?: string;
  viSao: string;
  apDung: string;
  tao: string;
  sua: string;
  lanKhop: number;
}

const PHAM_VI: readonly PhamVi[] = ['du_an', 'chung'];
const LOAI: readonly LoaiBaiHoc[] = ['loi', 'quy_uoc', 'moi_truong', 'so_thich'];
const RE_ID = /^[a-z0-9-]{1,60}$/;

const TRAN_TIEU_DE = 80;
const TRAN_DAU_HIEU = 200;
const TRAN_VI_SAO = 500;
const TRAN_AP_DUNG = 700;
/** Quá ngần này là bộ nhớ đã thành bãi rác — bắt model quên bớt thay vì phình mãi. */
const TRAN_BAI_MOI_PHAM_VI = 60;
const NGUONG_GOP = 0.6;
const TRAN_DONG_MUC_LUC = 110;
const TRAN_BAI_DOC = 5;
const TRAN_KY_TU_DOC = 4000;

// ─── GỐC THƯ MỤC ───────────────────────────────────────────────────

let gocUserData: string | null = null;

/**
 * Đặt thư mục đóng vai `userData` (test dùng thư mục tạm). Không gọi thì lần
 * đầu cần tới mới hỏi electron — để import module này KHÔNG kéo electron vào
 * lúc nạp (test chạy bằng node trần, không có `app`).
 */
export function datGocBoNho(dir: string): void {
  gocUserData = dir;
}

async function thuMucGoc(): Promise<string> {
  if (!gocUserData) {
    /*
     * `require` chứ không `import()`: bản dựng main là CJS và `electron` để
     * external, nên rollup GIỮ NGUYÊN `import()` — mà `import('electron')` qua
     * bộ nạp ESM là một đường khác hẳn `require` đã chạy ổn ở mọi file khác.
     * Cùng cách với `terminal/phienTerminal.ts`.
     */
    const nap = typeof require === 'function' ? require : createRequire(import.meta.url);
    const { app } = nap('electron') as typeof import('electron');
    gocUserData = app.getPath('userData');
  }
  return path.join(gocUserData, 'agent-bo-nho');
}

/**
 * Băm gốc dự án. `realpath` để `~/code/x` và symlink tới nó là CÙNG một dự
 * án; trên Windows ổ đĩa và thư mục không phân biệt hoa thường, và `\`/`/`
 * lẫn lộn tuỳ ai gọi — không chuẩn hoá thì một dự án ra hai kho bài học.
 */
export function bamGocDuAn(goc: string): string {
  let p: string;
  try { p = fsSync.realpathSync(goc); } catch { p = path.resolve(goc); }
  if (process.platform === 'win32') p = p.toLowerCase().replace(/\\/g, '/');
  p = p.replace(/\/+$/, '') || p;
  return createHash('sha256').update(p).digest('hex').slice(0, 16);
}

async function thuMucPhamVi(phamVi: PhamVi, goc: string | null): Promise<string | null> {
  const g = await thuMucGoc();
  if (phamVi === 'chung') return path.join(g, 'chung');
  return goc ? path.join(g, 'du-an', bamGocDuAn(goc)) : null;
}

// ─── HÀNG ĐỢI GHI ──────────────────────────────────────────────────

/*
 * MỘT hàng đợi cho cả kho (không phải mỗi phạm vi một hàng): `nhoBaiHoc` cần
 * nhìn CẢ HAI phạm vi để giữ id duy nhất và để `thay_id` chuyển bài giữa hai
 * phạm vi. Hai hàng đợi riêng thì hai lời gọi song song vẫn giẫm nhau đúng ở
 * chỗ đó. Ghi bài học hiếm và nhanh — xếp hàng chung không tốn gì đáng kể.
 */
const hangDoi = new Map<string, Promise<unknown>>();

async function xepHang<T>(fn: () => Promise<T>): Promise<T> {
  const khoa = await thuMucGoc();
  const truoc = hangDoi.get(khoa) ?? Promise.resolve();
  const sau = truoc.catch(() => undefined).then(fn);
  const duoi = sau.catch(() => undefined);
  hangDoi.set(khoa, duoi);
  void duoi.then(() => { if (hangDoi.get(khoa) === duoi) hangDoi.delete(khoa); });
  return sau;
}

// ─── ĐỌC / GHI FILE ────────────────────────────────────────────────

const ngu = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Ghi nguyên tử: `.tmp` rồi `rename`. Chết giữa chừng thì còn file cũ nguyên
 * vẹn chứ không phải nửa bài học. Trên Windows `rename` hay vấp EPERM/EBUSY
 * khi phần mềm diệt virus hoặc trình chỉ mục đang cầm file — thử lại 3 lần.
 */
async function ghiNguyenTu(file: string, noiDung: string): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const tmp = `${file}.${process.pid}.${Math.random().toString(36).slice(2, 8)}.tmp`;
  if (process.platform === 'win32') await fs.writeFile(tmp, noiDung, 'utf8');
  else await fs.writeFile(tmp, noiDung, { encoding: 'utf8', mode: 0o600 });
  for (let lan = 0; ; lan++) {
    try {
      await fs.rename(tmp, file);
      return;
    } catch (e) {
      const ma = (e as NodeJS.ErrnoException).code;
      if (lan < 3 && (ma === 'EPERM' || ma === 'EBUSY' || ma === 'EACCES')) { await ngu(100); continue; }
      await fs.rm(tmp, { force: true }).catch(() => undefined);
      throw e;
    }
  }
}

/** Giá trị YAML một dòng: viết trần khi an toàn, còn không thì trích JSON (YAML đọc được). */
function giaTriYaml(v: string): string {
  const motDong = v.replace(/\s*[\r\n]+\s*/g, ' ').trim();
  if (motDong === '' || /^[-?:,[\]{}#&*!|>'"%@`\s]/.test(motDong) || /: | #|\s$/.test(motDong)) {
    return JSON.stringify(motDong);
  }
  return motDong;
}

function docGiaTriYaml(v: string): string {
  const t = v.trim();
  if (t.startsWith('"')) { try { return String(JSON.parse(t)); } catch { /* rơi xuống */ } }
  if (t.length >= 2 && t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1).replace(/''/g, "'");
  return t;
}

function thanhMarkdown(b: BaiHoc): string {
  const dau = [
    `id: ${b.id}`,
    `loai: ${b.loai}`,
    `tieu_de: ${giaTriYaml(b.tieuDe)}`,
    ...(b.dauHieu ? [`dau_hieu: ${giaTriYaml(b.dauHieu)}`] : []),
    `tao: ${b.tao}`,
    `sua: ${b.sua}`,
    `lan_khop: ${b.lanKhop}`,
  ];
  return `---\n${dau.join('\n')}\n---\n**Vì sao:** ${b.viSao}\n\n**Áp dụng:** ${b.apDung}\n`;
}

/** Đọc một file bài học. `null` = hỏng/thiếu trường — bỏ qua chứ không làm chết cả mục lục. */
function phanTich(noiDung: string, id: string, phamVi: PhamVi): BaiHoc | null {
  const s = noiDung.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').normalize('NFC');
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(s);
  if (!m) return null;
  const truong: Record<string, string> = {};
  for (const dong of (m[1] ?? '').split('\n')) {
    const i = dong.indexOf(':');
    if (i <= 0) continue;
    truong[dong.slice(0, i).trim()] = docGiaTriYaml(dong.slice(i + 1));
  }
  const loai = truong.loai as LoaiBaiHoc | undefined;
  const tieuDe = truong.tieu_de ?? '';
  if (!loai || !LOAI.includes(loai) || !tieuDe) return null;
  const than = m[2] ?? '';
  const viSao = /\*\*Vì sao:\*\*\s*([\s\S]*?)(?=\n\s*\*\*Áp dụng:\*\*|$)/.exec(than)?.[1]?.trim() ?? '';
  const apDung = /\*\*Áp dụng:\*\*\s*([\s\S]*)$/.exec(than)?.[1]?.trim() ?? '';
  if (!viSao && !apDung) return null;
  const lanKhop = Number.parseInt(truong.lan_khop ?? '0', 10);
  const homNay = ngayHomNay();
  const bai: BaiHoc = {
    // Tên file là sự thật: người sửa tay đổi `id:` bên trong cũng không làm
    // bài học trỏ sang file khác.
    id,
    phamVi,
    loai,
    tieuDe,
    viSao,
    apDung,
    tao: truong.tao || homNay,
    sua: truong.sua || truong.tao || homNay,
    lanKhop: Number.isFinite(lanKhop) && lanKhop > 0 ? lanKhop : 0,
  };
  if (truong.dau_hieu) bai.dauHieu = truong.dau_hieu;
  return bai;
}

async function docThuMuc(dir: string | null, phamVi: PhamVi): Promise<BaiHoc[]> {
  if (!dir) return [];
  let ten: string[];
  try { ten = await fs.readdir(dir); } catch { return []; }
  const kq: BaiHoc[] = [];
  for (const t of ten) {
    if (!t.endsWith('.md')) continue;
    const id = t.slice(0, -3);
    if (!RE_ID.test(id)) continue;
    try {
      const bai = phanTich(await fs.readFile(path.join(dir, t), 'utf8'), id, phamVi);
      if (bai) kq.push(bai);
    } catch { /* file biến mất giữa chừng / không đọc được — bỏ qua */ }
  }
  return kq;
}

/** Mọi bài học áp dụng được: của dự án (nếu có gốc) + chung. */
export async function docTatCa(goc: string | null): Promise<BaiHoc[]> {
  const [duAn, chung] = await Promise.all([
    docThuMuc(await thuMucPhamVi('du_an', goc), 'du_an'),
    docThuMuc(await thuMucPhamVi('chung', goc), 'chung'),
  ]);
  return [...duAn, ...chung];
}

// ─── MỤC LỤC NẠP VÀO PROMPT ────────────────────────────────────────

function sapXepUuTien(ds: BaiHoc[]): BaiHoc[] {
  return [...ds].sort((a, b) =>
    (a.phamVi === b.phamVi ? 0 : a.phamVi === 'du_an' ? -1 : 1)
    || b.lanKhop - a.lanKhop
    || b.sua.localeCompare(a.sua)
    || a.id.localeCompare(b.id));
}

function dongMucLuc(b: BaiHoc): string {
  const d = `#${b.id} [${b.loai}·${b.phamVi}] ${b.tieuDe}`;
  return d.length > TRAN_DONG_MUC_LUC ? `${d.slice(0, TRAN_DONG_MUC_LUC - 1)}…` : d;
}

/**
 * Mục lục ngắn nạp vào prompt mỗi lượt. Bỏ bài `loi` có `dauHieu`: app tự
 * khớp chúng với đầu ra lệnh và nhắc ĐÚNG lúc lỗi xảy ra — liệt kê sẵn chỉ
 * tốn token ở mọi lượt không gặp lỗi đó.
 */
export async function mucLuc(goc: string | null, tranKyTu = 1800, tranDong = 20): Promise<string> {
  const ds = sapXepUuTien((await docTatCa(goc)).filter((b) => !(b.loai === 'loi' && b.dauHieu)));
  if (ds.length === 0) return '';
  const dong: string[] = [];
  let tong = 0;
  for (const b of ds) {
    if (dong.length >= tranDong) break;
    const d = dongMucLuc(b);
    if (tong + d.length + 1 > tranKyTu) break;
    dong.push(d);
    tong += d.length + 1;
  }
  // Báo còn bài bị cắt — không có dòng này model tưởng mục lục là tất cả,
  // và không bao giờ tra phần còn lại. Dòng báo cũng phải nằm TRONG trần.
  const cuoi = () => `… còn ${ds.length - dong.length} bài nữa — tìm theo từ khoá trong bộ nhớ khi cần`;
  if (dong.length < ds.length) {
    while (dong.length > 0 && tong + cuoi().length + 1 > tranKyTu) tong -= (dong.pop()?.length ?? 0) + 1;
    if (tong + cuoi().length <= tranKyTu) dong.push(cuoi());
  }
  return dong.join('\n');
}

// ─── CHẶN BÍ MẬT VÀ CÂU CẤP QUYỀN ──────────────────────────────────

const MAU_BI_MAT: readonly [RegExp, string][] = [
  // Lookbehind: không có nó thì "task-management-dashboard" chứa "sk-management-…".
  [/(?<![A-Za-z0-9])sk-[A-Za-z0-9_-]{16,}/, 'trông như khoá API (sk-…)'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'trông như khoá truy cập AWS (AKIA…)'],
  [/(?<![A-Za-z0-9])gh[pousr]_[A-Za-z0-9]{20,}/, 'trông như token GitHub (gh*_…)'],
  [/\bxox[baprs]-/, 'trông như token Slack (xox*-)'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY/, 'có khoá riêng (PRIVATE KEY)'],
  [/\beyJ[\w-]+\.[\w-]+\./, 'trông như JWT'],
  [/\b[0-9a-fA-F]{40,}\b/, 'có chuỗi hex dài ≥40 ký tự (trông như bí mật)'],
];

/**
 * `password: $DB_PASS`, `token=<token của bạn>` là CÁCH LÀM, không phải bí
 * mật — bài học "đặt TOKEN=$GITHUB_TOKEN trước khi chạy" là bài học tốt.
 */
const RE_GAN_BI_MAT = /(password|passwd|mật khẩu|token|secret|api[_-]?key)\s*[:=]\s*(\S{6,})/giu;
const RE_GIA_TRI_GIU_CHO = /^['"]?(\$|<|%|\{|process\.env|os\.environ|env\(|\*{3,}|x{3,}|\.{3})/i;

/**
 * Chuỗi base64 dài ≥40 ký tự liền. Đường dẫn cũng là chuỗi `[A-Za-z0-9/]` dài
 * nên phải loại: từng khúc giữa các `/` đều ngắn ⇒ là đường dẫn. Và phải trộn
 * đủ hoa-thường-số (≥3 mỗi loại) — tên biến dài kiểu `my-long-package-name`
 * thì không.
 */
function coBase64Dai(chu: string): boolean {
  for (const m of chu.matchAll(/[A-Za-z0-9+/_-]{40,}={0,2}/g)) {
    const s = m[0];
    if (s.includes('/') && s.split('/').every((k) => k.length < 40)) continue;
    const hoa = (s.match(/[A-Z]/g) ?? []).length;
    const thuong = (s.match(/[a-z]/g) ?? []).length;
    const so = (s.match(/\d/g) ?? []).length;
    if (hoa >= 3 && thuong >= 3 && so >= 3) return true;
  }
  return false;
}

/** Lý do nếu chuỗi trông như chứa bí mật; `null` nếu sạch. */
export function coBiMat(chu: string): string | null {
  for (const [re, lyDo] of MAU_BI_MAT) if (re.test(chu)) return lyDo;
  for (const m of chu.matchAll(RE_GAN_BI_MAT)) {
    if (!RE_GIA_TRI_GIU_CHO.test(m[2] ?? '')) return `có gán giá trị cho "${m[1]}" (trông như mật khẩu/token)`;
  }
  if (coBase64Dai(chu)) return 'có chuỗi base64 dài ≥40 ký tự (trông như bí mật)';
  return null;
}

function boDau(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

/**
 * Câu kiểu cấp quyền. So trên chữ ĐÃ BỎ DẤU, chữ thường — để "Luôn cho phép",
 * "luon cho phep" và "LUÔN CHO PHÉP" cùng bị chặn.
 */
const MAU_CAP_QUYEN: readonly RegExp[] = [
  /\bluon (cho phep|chap nhan|dong y|duyet)\b/,
  /\b(bo qua|khong can|dung|khoi|tu dong) (duyet|hoi|xin phep|xac nhan)\b/,
  /\b(tat|bo qua|vo hieu( hoa)?) (kiem tra|chot chan|sandbox|bao ve)\b/,
  /\b(doc|mo|xem|cat|in ra|read|open|cat|print)\s+(file\s+|tep\s+)?\S*\.env\b/,
  /\balways (allow|approve|accept)\b/,
  /\b(skip|bypass|disable|ignore) (the )?(approval|permission|confirmation|check|checks|sandbox|safety)\b/,
  /\b(auto[- ]?approve|without (asking|approval|permission))\b/,
];

function laCauCapQuyen(chu: string): boolean {
  const t = boDau(chu).toLowerCase().replace(/\s+/g, ' ');
  return MAU_CAP_QUYEN.some((re) => re.test(t));
}

// ─── ID ────────────────────────────────────────────────────────────

const TEN_DANH_RIENG_WIN = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/;

function slug(tieuDe: string): string {
  let s = boDau(tieuDe).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  s = s.slice(0, 60).replace(/-+$/, '');
  if (!s) s = 'bai-hoc';
  // `con.md` không tạo được trên Windows — cả thư mục bộ nhớ sẽ không đồng bộ được qua máy Windows.
  if (TEN_DANH_RIENG_WIN.test(s)) s = `${s}-bai`;
  return s;
}

function idKhongTrung(goc: string, daCo: Set<string>): string {
  if (!daCo.has(goc)) return goc;
  for (let i = 2; ; i++) {
    const hau = `-${i}`;
    const id = `${goc.slice(0, 60 - hau.length).replace(/-+$/, '')}${hau}`;
    if (!daCo.has(id)) return id;
  }
}

// ─── GHI BÀI HỌC ───────────────────────────────────────────────────

function ngayHomNay(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** `/Users/cuong/proj` → `~/proj`: bài học không mang tên tài khoản máy, và dùng được sau khi đổi máy. */
function thayHome(s: string): string {
  const home = os.homedir();
  if (!home || home.length < 2) return s;
  const bien = new Set([home, home.replace(/\\/g, '/')]);
  let kq = s;
  for (const h of bien) kq = kq.split(h).join('~');
  return kq;
}

function chuanHoaSoTrung(s: string): string {
  return boDau(s).toLowerCase().replace(/[^\p{L}\p{N}<>]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

function chuoiThamSo(args: Record<string, unknown>, ten: string): string | undefined | { loi: string } {
  const v = args[ten];
  if (v === undefined || v === null) return undefined;
  if (typeof v !== 'string') return { loi: `"${ten}" phải là chuỗi` };
  return v.trim();
}

function duongDanBai(dir: string, id: string): string {
  return path.join(dir, `${id}.md`);
}

export type KetQuaNho = { ok: true; id: string; gop: boolean } | { ok: false; loi: string };

/**
 * Ghi (hoặc cập nhật) một bài học từ tham số tool của model.
 *
 * Chống trùng: `thay_id` ⇒ ghi đè đúng bài đó; không có thì so `tieu_de +
 * dau_hieu` với các bài CÙNG phạm vi, giống ≥60% ⇒ cập nhật bài cũ thay vì đẻ
 * bài mới. Model hay ghi lại cùng một bài học bằng câu chữ hơi khác — không
 * gộp thì sau một tuần mục lục toàn bản sao.
 */
export async function nhoBaiHoc(goc: string | null, args: Record<string, unknown>): Promise<KetQuaNho> {
  const doc = (ten: string) => chuoiThamSo(args, ten);
  const loiKieu = (['pham_vi', 'loai', 'tieu_de', 'dau_hieu', 'vi_sao', 'ap_dung', 'thay_id'] as const)
    .map(doc).find((v): v is { loi: string } => typeof v === 'object');
  if (loiKieu) return { ok: false, loi: loiKieu.loi };
  const s = (ten: string) => doc(ten) as string | undefined;

  const phamVi = s('pham_vi') as PhamVi | undefined;
  if (!phamVi || !PHAM_VI.includes(phamVi)) return { ok: false, loi: '"pham_vi" phải là "du_an" hoặc "chung"' };
  const loai = s('loai') as LoaiBaiHoc | undefined;
  if (!loai || !LOAI.includes(loai)) return { ok: false, loi: `"loai" phải là một trong: ${LOAI.join(', ')}` };
  const tieuDe = s('tieu_de') ?? '';
  if (!tieuDe) return { ok: false, loi: 'thiếu "tieu_de"' };
  if (tieuDe.length > TRAN_TIEU_DE) return { ok: false, loi: `"tieu_de" dài quá ${TRAN_TIEU_DE} ký tự` };
  const dauHieuTho = s('dau_hieu') || undefined;
  if (dauHieuTho && dauHieuTho.length > TRAN_DAU_HIEU) return { ok: false, loi: `"dau_hieu" dài quá ${TRAN_DAU_HIEU} ký tự` };
  const viSao = s('vi_sao') ?? '';
  if (!viSao) return { ok: false, loi: 'thiếu "vi_sao" — bài học không có lý do thì lần sau không biết khi nào nó còn đúng' };
  if (viSao.length > TRAN_VI_SAO) return { ok: false, loi: `"vi_sao" dài quá ${TRAN_VI_SAO} ký tự` };
  const apDung = s('ap_dung') ?? '';
  if (!apDung) return { ok: false, loi: 'thiếu "ap_dung"' };
  if (apDung.length > TRAN_AP_DUNG) return { ok: false, loi: `"ap_dung" dài quá ${TRAN_AP_DUNG} ký tự` };
  const thayId = (s('thay_id') || undefined)?.replace(/^#/, '');
  if (thayId !== undefined && !RE_ID.test(thayId)) return { ok: false, loi: `"thay_id" không hợp lệ: ${thayId}` };
  if (phamVi === 'du_an' && !goc) return { ok: false, loi: 'không có dự án đang mở — dùng pham_vi "chung" hoặc mở dự án trước' };

  const toanBo = [tieuDe, dauHieuTho ?? '', viSao, apDung].join('\n');
  if (laCauCapQuyen(toanBo)) {
    return { ok: false, loi: 'bộ nhớ không được dùng để cấp quyền hay bỏ qua duyệt/kiểm tra — quyền do người dùng quyết mỗi lần, không ghi nhớ' };
  }
  const biMat = coBiMat(toanBo);
  if (biMat) return { ok: false, loi: `từ chối lưu: ${biMat}. Bộ nhớ là file trần trên đĩa — ghi tên biến môi trường thay vì giá trị` };

  const dauHieu = dauHieuTho ? chuanHoaDauHieu(thayHome(dauHieuTho)) : undefined;
  const moi = {
    loai,
    tieuDe: thayHome(tieuDe),
    viSao: thayHome(viSao),
    apDung: thayHome(apDung),
  };

  return xepHang(async () => {
    const dir = (await thuMucPhamVi(phamVi, goc))!;
    const tatCa = await docTatCa(goc);
    const homNay = ngayHomNay();
    const tao = (id: string, cu?: BaiHoc): BaiHoc => {
      const b: BaiHoc = { id, phamVi, ...moi, tao: cu?.tao ?? homNay, sua: homNay, lanKhop: cu?.lanKhop ?? 0 };
      if (dauHieu) b.dauHieu = dauHieu;
      return b;
    };

    if (thayId) {
      const cu = tatCa.find((b) => b.id === thayId);
      if (!cu) return { ok: false, loi: `không có bài #${thayId} để thay` } as const;
      await ghiNguyenTu(duongDanBai(dir, thayId), thanhMarkdown(tao(thayId, cu)));
      if (cu.phamVi !== phamVi) {
        // Chuyển phạm vi: bài cũ ở phạm vi kia phải đi, không thì hai bản cùng id.
        const dirCu = await thuMucPhamVi(cu.phamVi, goc);
        if (dirCu) await fs.rm(duongDanBai(dirCu, thayId), { force: true });
      }
      return { ok: true, id: thayId, gop: true } as const;
    }

    const cungPhamVi = tatCa.filter((b) => b.phamVi === phamVi);
    const baMoi = boBaKyTu(chuanHoaSoTrung(`${moi.tieuDe} ${dauHieu ?? ''}`));
    let giong: BaiHoc | null = null;
    let diem = 0;
    for (const b of cungPhamVi) {
      const j = jaccard(baMoi, boBaKyTu(chuanHoaSoTrung(`${b.tieuDe} ${b.dauHieu ?? ''}`)));
      if (j >= NGUONG_GOP && j > diem) { diem = j; giong = b; }
    }
    if (giong) {
      await ghiNguyenTu(duongDanBai(dir, giong.id), thanhMarkdown(tao(giong.id, giong)));
      return { ok: true, id: giong.id, gop: true } as const;
    }

    if (cungPhamVi.length >= TRAN_BAI_MOI_PHAM_VI) {
      return { ok: false, loi: `bộ nhớ phạm vi "${phamVi}" đã đủ ${TRAN_BAI_MOI_PHAM_VI} bài — quên bớt bài lỗi thời, hoặc dùng thay_id để sửa một bài có sẵn` } as const;
    }
    // id duy nhất trên CẢ HAI phạm vi: mục lục và `docBoNho({id})` tra id không kèm phạm vi.
    const id = idKhongTrung(slug(moi.tieuDe), new Set(tatCa.map((b) => b.id)));
    await ghiNguyenTu(duongDanBai(dir, id), thanhMarkdown(tao(id)));
    return { ok: true, id, gop: false } as const;
  });
}

// ─── ĐỌC CHO MODEL ─────────────────────────────────────────────────

function thanBai(b: BaiHoc): string {
  return [
    `#${b.id} [${b.loai}·${b.phamVi}] ${b.tieuDe}`,
    ...(b.dauHieu ? [`Dấu hiệu: ${b.dauHieu}`] : []),
    `Vì sao: ${b.viSao}`,
    `Áp dụng: ${b.apDung}`,
    `(sửa ${b.sua}, đã khớp ${b.lanKhop} lần)`,
  ].join('\n');
}

function diemTim(b: BaiHoc, tim: string): number {
  const q = chuanHoaSoTrung(tim);
  if (!q) return 0;
  const chu = chuanHoaSoTrung(`${b.id.replace(/-/g, ' ')} ${b.tieuDe} ${b.dauHieu ?? ''} ${b.viSao} ${b.apDung}`);
  let diem = 0;
  for (const tu of q.split(' ')) if (tu.length >= 2 && chu.includes(tu)) diem += 1;
  const tieuDe = chuanHoaSoTrung(`${b.tieuDe} ${b.dauHieu ?? ''}`);
  if (tieuDe.includes(q)) diem += 3;
  return diem + jaccard(boBaKyTu(q), boBaKyTu(tieuDe));
}

/**
 * Trả nguyên văn tối đa 5 bài (≤4000 ký tự), theo `id` hoặc theo từ khoá `tim`.
 * Không thấy thì NÓI RÕ là không thấy — model nhận chuỗi rỗng hay đoán bừa là
 * "bộ nhớ trống" rồi thôi không tra nữa.
 */
export async function docBoNho(goc: string | null, q: { id?: string; tim?: string }): Promise<string> {
  const tatCa = await docTatCa(goc);
  let chon: BaiHoc[];
  const id = q.id?.trim().replace(/^#/, '');
  const tim = q.tim?.trim();
  if (id) {
    const b = tatCa.find((x) => x.id === id);
    if (!b) {
      return `Không có bài #${id} trong bộ nhớ.${tatCa.length ? ' Xem các id trong mục lục bộ nhớ, hoặc tra bằng từ khoá (tim).' : ' Bộ nhớ đang trống.'}`;
    }
    chon = [b];
  } else if (tim) {
    chon = tatCa
      .map((b) => ({ b, d: diemTim(b, tim) }))
      .filter((x) => x.d >= 1)
      .sort((a, c) => c.d - a.d || c.b.lanKhop - a.b.lanKhop)
      .slice(0, TRAN_BAI_DOC)
      .map((x) => x.b);
    if (chon.length === 0) {
      return `Không có bài học nào khớp «${tim}».${tatCa.length ? ` Bộ nhớ có ${tatCa.length} bài — xem mục lục, hoặc thử từ khoá khác.` : ' Bộ nhớ đang trống.'}`;
    }
  } else {
    const ml = await mucLuc(goc);
    return ml ? `Mục lục bộ nhớ:\n${ml}` : 'Bộ nhớ đang trống.';
  }
  const phan: string[] = [];
  let tong = 0;
  for (const b of chon) {
    let t = thanBai(b);
    const conCho = TRAN_KY_TU_DOC - tong - (phan.length ? 2 : 0);
    if (conCho <= 0) break;
    if (t.length > conCho) t = `${t.slice(0, Math.max(0, conCho - 1))}…`;
    phan.push(t);
    tong += t.length + (phan.length > 1 ? 2 : 0);
  }
  return phan.join('\n\n');
}

// ─── QUÊN / ĐẾM KHỚP / GIAO DIỆN ───────────────────────────────────

async function timFileBai(goc: string | null, id: string): Promise<{ file: string; phamVi: PhamVi } | null> {
  if (!RE_ID.test(id)) return null; // chặn `../` trước khi nó chạm tới path.join
  for (const pv of PHAM_VI) {
    const dir = await thuMucPhamVi(pv, goc);
    if (!dir) continue;
    const file = duongDanBai(dir, id);
    try { await fs.access(file); return { file, phamVi: pv }; } catch { /* thử phạm vi kế */ }
  }
  return null;
}

/**
 * Xoá một bài học. `lyDo` ghi vào `da-quen.log` ở gốc kho — xoá là mất hẳn, nên
 * ít nhất người dùng tra lại được "bài nào đã bị quên, vì sao".
 */
export async function quenBaiHoc(goc: string | null, id: string, lyDo: string): Promise<boolean> {
  const sach = id.trim().replace(/^#/, '');
  return xepHang(async () => {
    const tim = await timFileBai(goc, sach);
    if (!tim) return false;
    await fs.rm(tim.file, { force: true });
    try {
      const nhatKy = path.join(await thuMucGoc(), 'da-quen.log');
      const dong = JSON.stringify({ luc: new Date().toISOString(), id: sach, phamVi: tim.phamVi, lyDo: lyDo.slice(0, 300) });
      await fs.appendFile(nhatKy, `${dong}\n`, 'utf8');
    } catch { /* nhật ký hỏng không được làm hỏng việc xoá */ }
    return true;
  });
}

/** Bài học vừa được app khớp với một lỗi thật — tăng đếm để nó lên đầu mục lục. Không đổi `sua`. */
export async function tangLanKhop(goc: string | null, id: string): Promise<void> {
  await xepHang(async () => {
    const tim = await timFileBai(goc, id);
    if (!tim) return;
    let bai: BaiHoc | null;
    try { bai = phanTich(await fs.readFile(tim.file, 'utf8'), id, tim.phamVi); } catch { return; }
    if (!bai) return;
    bai.lanKhop += 1;
    await ghiNguyenTu(tim.file, thanhMarkdown(bai));
  });
}

/** Danh sách đầy đủ cho màn hình quản lý bộ nhớ: dự án trước, mới sửa trước. */
export async function dsDeGiaoDien(goc: string | null): Promise<BaiHoc[]> {
  return (await docTatCa(goc)).sort((a, b) =>
    (a.phamVi === b.phamVi ? 0 : a.phamVi === 'du_an' ? -1 : 1)
    || b.sua.localeCompare(a.sua)
    || a.id.localeCompare(b.id));
}
