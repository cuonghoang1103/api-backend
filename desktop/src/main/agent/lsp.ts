/**
 * ============================================================
 * LSP (đợt 4, 18/10/2026) — định nghĩa, tham chiếu, chẩn đoán, ký hiệu, hover
 * ============================================================
 *
 * Hai NGUỒN, cùng một mặt (`NguonLsp`) và cùng cách trình bày cho model:
 *
 *   • VS Code: extension bơm nguồn dùng chính API của trình soạn
 *     (`vscode.executeDefinitionProvider`…, `languages.getDiagnostics`) qua
 *     `datNguonLsp()` — mọi ngôn ngữ người dùng đã cài extension đều có.
 *   • App desktop + CLI: tự chạy server ngôn ngữ qua stdio khi TÌM THẤY —
 *     `typescript-language-server --stdio` (TS/JS) và `pyright-langserver
 *     --stdio` (Python), tìm ở `node_modules/.bin` của dự án (đi ngược lên tối
 *     đa 4 cấp cho monorepo) rồi PATH. Không có server ⇒ không khai capability
 *     `lsp` (máy chủ không mời tool) — không phải lỗi.
 *
 * Vòng đời theo CUỘC: mỗi cuộc giữ server của riêng nó (`dongLspCua` khi đóng
 * cuộc; tự tắt sau 10 phút không dùng; tiến trình thoát ⇒ giết hết).
 *
 * Sau mỗi `edit_file`/`create_file`/`sua_nhieu_cho`, `loop.ts` gọi
 * `chanDoanMoiSauSua` để nối LỖI/CẢNH BÁO MỚI của file đó vào kết quả tool —
 * agent thấy ngay lỗi kiểu nó vừa gây ra, không cần hook `tsc`.
 */
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { constants as fsc } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

export interface ViTri { file: string; dong: number; cot: number; dongCuoi?: number }
export type MucChanDoan = 'loi' | 'canhBao' | 'thongTin' | 'goiY';
export interface ChanDoan { dong: number; cot: number; muc: MucChanDoan; thongDiep: string; ma?: string; nguon?: string }
export interface KyHieu { ten: string; loai: string; dong: number; con?: KyHieu[] }

/** Một nguồn LSP. Mọi dòng/cột ở đây là 1-based (như người đọc mã). */
export interface NguonLsp {
  ten: string;
  coChoGoc(goc: string): Promise<boolean>;
  coChoFile(file: string): Promise<boolean>;
  dinhNghia(file: string, dong: number, cot: number): Promise<ViTri[]>;
  thamChieu(file: string, dong: number, cot: number): Promise<ViTri[]>;
  hover(file: string, dong: number, cot: number): Promise<string>;
  kyHieu(file: string): Promise<KyHieu[]>;
  /** `choMs`: chờ server phát chẩn đoán mới (file vừa đổi). */
  chanDoan(file: string, choMs?: number): Promise<ChanDoan[]>;
  /** Chẩn đoán đã biết, KHÔNG khởi động gì (null = chưa biết). */
  chanDoanDaBiet?(file: string): ChanDoan[] | null;
  dong?(): void;
}

// ─── nguồn ngoài (VS Code) ───────────────────────────────────────

let nguonNgoai: NguonLsp | null = null;
/** Extension VS Code bơm nguồn dùng API của trình soạn. `null` = gỡ. */
export function datNguonLsp(n: NguonLsp | null): void { nguonNgoai = n; }

// ─── tìm server ──────────────────────────────────────────────────

export interface MoTaServer { ten: string; lenh: string; args: string[]; duoi: string[] }

const DUOI_TS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts'];
const DUOI_PY = ['.py', '.pyi'];

const UNG_VIEN: Array<{ ten: string; bin: string[]; args: string[]; duoi: string[] }> = [
  { ten: 'typescript', bin: ['typescript-language-server'], args: ['--stdio'], duoi: DUOI_TS },
  { ten: 'python', bin: ['pyright-langserver', 'basedpyright-langserver'], args: ['--stdio'], duoi: DUOI_PY },
];

async function chayDuoc(p: string): Promise<boolean> {
  return fs.access(p, process.platform === 'win32' ? fsc.F_OK : fsc.X_OK).then(() => true, () => false);
}

async function timBin(goc: string, ten: string): Promise<string | null> {
  const duoi = process.platform === 'win32' ? ['.cmd', '.exe', ''] : [''];
  let d = goc;
  for (let i = 0; i < 5; i++) {
    for (const x of duoi) {
      const p = path.join(d, 'node_modules', '.bin', ten + x);
      if (await chayDuoc(p)) return p;
    }
    const cha = path.dirname(d);
    if (cha === d) break;
    d = cha;
  }
  for (const dir of (process.env.PATH ?? '').split(path.delimiter).filter(Boolean)) {
    for (const x of duoi) {
      const p = path.join(dir, ten + x);
      if (await chayDuoc(p)) return p;
    }
  }
  return null;
}

let timServer: (goc: string) => Promise<MoTaServer[]> = async (goc: string): Promise<MoTaServer[]> => {
  const ra: MoTaServer[] = [];
  for (const u of UNG_VIEN) {
    for (const b of u.bin) {
      const p = await timBin(goc, b);
      if (p) { ra.push({ ten: u.ten, lenh: p, args: u.args, duoi: u.duoi }); break; }
    }
  }
  return ra;
};
/** Chỉ cho test: thay cách tìm server (trỏ vào server giả). `null` = về mặc định. */
export function _datTimServer(f: ((goc: string) => Promise<MoTaServer[]>) | null): void {
  timServer = f ?? macDinhTim;
  demTim.clear();
}
const macDinhTim = timServer;

const demTim = new Map<string, { luc: number; ds: MoTaServer[] }>();
async function serverCho(goc: string): Promise<MoTaServer[]> {
  const c = demTim.get(goc);
  if (c && Date.now() - c.luc < 60_000) return c.ds;
  const ds = await timServer(goc).catch(() => []);
  demTim.set(goc, { luc: Date.now(), ds });
  return ds;
}

function idNgonNgu(file: string): string {
  const e = path.extname(file).toLowerCase();
  if (e === '.ts' || e === '.mts' || e === '.cts') return 'typescript';
  if (e === '.tsx') return 'typescriptreact';
  if (e === '.jsx') return 'javascriptreact';
  if (e === '.js' || e === '.mjs' || e === '.cjs') return 'javascript';
  if (e === '.py' || e === '.pyi') return 'python';
  return 'plaintext';
}

// ─── khách JSON-RPC qua stdio ────────────────────────────────────

const MUC: Record<number, MucChanDoan> = { 1: 'loi', 2: 'canhBao', 3: 'thongTin', 4: 'goiY' };
const LOAI_KY_HIEU: Record<number, string> = {
  1: 'file', 2: 'module', 3: 'namespace', 4: 'package', 5: 'class', 6: 'method', 7: 'property', 8: 'field', 9: 'constructor',
  10: 'enum', 11: 'interface', 12: 'function', 13: 'variable', 14: 'constant', 15: 'string', 16: 'number', 17: 'boolean',
  18: 'array', 19: 'object', 20: 'key', 21: 'null', 22: 'enumMember', 23: 'struct', 24: 'event', 25: 'operator', 26: 'typeParameter',
};

interface ChoTraLoi { ok: (v: unknown) => void; loi: (e: Error) => void; h: ReturnType<typeof setTimeout> }

export class KhachLsp {
  private buf = Buffer.alloc(0);
  private id = 0;
  private cho = new Map<number, ChoTraLoi>();
  private chanDoanUri = new Map<string, { luc: number; ds: ChanDoan[] }>();
  private moTa = new Map<string, { phienBan: number; chu: string; luc: number }>();
  private nghe = new Set<(uri: string) => void>();
  chet = false;

  constructor(private proc: ChildProcessWithoutNullStreams, readonly ten: string, readonly duoi: string[]) {
    proc.stdout.on('data', (b: Buffer) => this.nhan(b));
    proc.on('exit', () => { this.chet = true; for (const c of this.cho.values()) { clearTimeout(c.h); c.loi(new Error('server LSP đã thoát')); } this.cho.clear(); });
    proc.on('error', () => { this.chet = true; });
    proc.stdin.on('error', () => { this.chet = true; });
    proc.stderr.on('data', () => { /* bỏ — server hay in log */ });
  }

  static async mo(sv: MoTaServer, goc: string): Promise<KhachLsp | null> {
    let proc: ChildProcessWithoutNullStreams;
    try {
      proc = spawn(sv.lenh, sv.args, { cwd: goc, shell: process.platform === 'win32', windowsHide: true, env: process.env }) as ChildProcessWithoutNullStreams;
    } catch { return null; }
    const k = new KhachLsp(proc, sv.ten, sv.duoi);
    try {
      await k.yeuCau('initialize', {
        processId: process.pid,
        rootUri: pathToFileURL(goc).href,
        rootPath: goc,
        workspaceFolders: [{ uri: pathToFileURL(goc).href, name: path.basename(goc) }],
        capabilities: {
          workspace: { configuration: true, workspaceFolders: true },
          textDocument: {
            synchronization: { didSave: false, dynamicRegistration: false },
            publishDiagnostics: { relatedInformation: false },
            hover: { contentFormat: ['plaintext', 'markdown'] },
            definition: { linkSupport: true },
            references: {},
            documentSymbol: { hierarchicalDocumentSymbolSupport: true },
          },
        },
        initializationOptions: {},
      }, 30_000);
      k.thongBao('initialized', {});
      return k;
    } catch {
      k.dong();
      return null;
    }
  }

  private gui(msg: unknown): void {
    if (this.chet) return;
    const s = JSON.stringify(msg);
    try { this.proc.stdin.write(`Content-Length: ${Buffer.byteLength(s, 'utf8')}\r\n\r\n${s}`); } catch { this.chet = true; }
  }

  yeuCau(method: string, params: unknown, ms = 15_000): Promise<unknown> {
    if (this.chet) return Promise.reject(new Error('server LSP đã thoát'));
    const id = ++this.id;
    return new Promise((ok, loi) => {
      const h = setTimeout(() => { this.cho.delete(id); loi(new Error(`server LSP không trả lời ${method} sau ${Math.round(ms / 1000)}s`)); }, ms);
      (h as unknown as { unref?: () => void }).unref?.();
      this.cho.set(id, { ok, loi, h });
      this.gui({ jsonrpc: '2.0', id, method, params });
    });
  }

  thongBao(method: string, params: unknown): void { this.gui({ jsonrpc: '2.0', method, params }); }

  private nhan(b: Buffer): void {
    this.buf = Buffer.concat([this.buf, b]);
    for (;;) {
      const dau = this.buf.indexOf('\r\n\r\n');
      if (dau < 0) return;
      const m = /Content-Length:\s*(\d+)/i.exec(this.buf.subarray(0, dau).toString('ascii'));
      if (!m) { this.buf = this.buf.subarray(dau + 4); continue; }
      const dai = Number(m[1]);
      if (this.buf.length < dau + 4 + dai) return;
      const than = this.buf.subarray(dau + 4, dau + 4 + dai).toString('utf8');
      this.buf = this.buf.subarray(dau + 4 + dai);
      try { this.xuLy(JSON.parse(than)); } catch { /* bỏ gói hỏng */ }
    }
  }

  private xuLy(msg: { id?: number | string; method?: string; params?: any; result?: unknown; error?: { message?: string } }): void {
    if (msg.method && msg.id !== undefined) {
      // Yêu cầu TỪ server — trả lời tối thiểu để nó không đứng chờ.
      let ketQua: unknown = null;
      if (msg.method === 'workspace/configuration') ketQua = Array.isArray(msg.params?.items) ? msg.params.items.map(() => null) : [];
      else if (msg.method === 'workspace/workspaceFolders') ketQua = [];
      this.gui({ jsonrpc: '2.0', id: msg.id, result: ketQua });
      return;
    }
    if (msg.method === 'textDocument/publishDiagnostics') {
      const uri = String(msg.params?.uri ?? '');
      const ds: ChanDoan[] = (Array.isArray(msg.params?.diagnostics) ? msg.params.diagnostics : []).map((d: any) => ({
        dong: Number(d.range?.start?.line ?? 0) + 1,
        cot: Number(d.range?.start?.character ?? 0) + 1,
        muc: MUC[Number(d.severity ?? 1)] ?? 'loi',
        thongDiep: String(d.message ?? '').slice(0, 500),
        ...(d.code !== undefined ? { ma: String(d.code) } : {}),
        ...(d.source ? { nguon: String(d.source) } : {}),
      }));
      this.chanDoanUri.set(uri, { luc: Date.now(), ds });
      for (const f of this.nghe) f(uri);
      return;
    }
    if (typeof msg.id === 'number') {
      const c = this.cho.get(msg.id);
      if (!c) return;
      this.cho.delete(msg.id);
      clearTimeout(c.h);
      if (msg.error) c.loi(new Error(msg.error.message ?? 'lỗi LSP'));
      else c.ok(msg.result);
    }
  }

  /** Đồng bộ nội dung file với server (mở lần đầu / đổi ⇒ didChange). Trả mốc thời gian đổi. */
  async dongBo(file: string): Promise<number> {
    const uri = pathToFileURL(file).href;
    const chu = await fs.readFile(file, 'utf8');
    const cu = this.moTa.get(uri);
    if (!cu) {
      const luc = Date.now();
      this.moTa.set(uri, { phienBan: 1, chu, luc });
      this.thongBao('textDocument/didOpen', { textDocument: { uri, languageId: idNgonNgu(file), version: 1, text: chu } });
      return luc;
    }
    if (cu.chu === chu) return cu.luc;
    const luc = Date.now();
    cu.phienBan += 1; cu.chu = chu; cu.luc = luc;
    this.thongBao('textDocument/didChange', { textDocument: { uri, version: cu.phienBan }, contentChanges: [{ text: chu }] });
    return luc;
  }

  daMo(file: string): boolean { return this.moTa.has(pathToFileURL(file).href); }

  chanDoanCua(file: string): ChanDoan[] | null { return this.chanDoanUri.get(pathToFileURL(file).href)?.ds ?? null; }

  /** Chờ chẩn đoán MỚI HƠN `sau` cho file (tối đa `ms`), rồi đợi thêm một nhịp yên. */
  async choChanDoan(file: string, sau: number, ms: number): Promise<ChanDoan[]> {
    const uri = pathToFileURL(file).href;
    const coRoi = (): boolean => (this.chanDoanUri.get(uri)?.luc ?? 0) >= sau;
    if (!coRoi()) {
      await new Promise<void>((ok) => {
        let h: ReturnType<typeof setTimeout> | null = null;
        const f = (u: string): void => { if (u === uri && coRoi()) xong(); };
        const xong = (): void => { if (h) clearTimeout(h); this.nghe.delete(f); ok(); };
        h = setTimeout(xong, ms);
        (h as unknown as { unref?: () => void }).unref?.();
        this.nghe.add(f);
      });
    }
    // Server hay phát 2 lượt (cú pháp rồi ngữ nghĩa) — đợi nhịp yên 250ms.
    let truoc = this.chanDoanUri.get(uri)?.luc ?? 0;
    for (let i = 0; i < 6; i++) {
      await new Promise((r) => setTimeout(r, 250));
      const nay = this.chanDoanUri.get(uri)?.luc ?? 0;
      if (nay === truoc) break;
      truoc = nay;
    }
    return this.chanDoanUri.get(uri)?.ds ?? [];
  }

  dong(): void {
    if (this.chet) return;
    try { void this.yeuCau('shutdown', null, 2000).catch(() => {}).then(() => { this.thongBao('exit', null); }); } catch { /* */ }
    const p = this.proc;
    setTimeout(() => { try { p.kill(); } catch { /* */ } }, 2500).unref?.();
    this.chet = true;
  }
}

// ─── nguồn stdio theo cuộc ───────────────────────────────────────

function viTriTu(x: any): ViTri | null {
  const uri = x?.uri ?? x?.targetUri;
  const r = x?.range ?? x?.targetSelectionRange ?? x?.targetRange;
  if (typeof uri !== 'string' || !r) return null;
  let file = uri;
  try { file = fileURLToPath(uri); } catch { /* giữ uri */ }
  return { file, dong: Number(r.start?.line ?? 0) + 1, cot: Number(r.start?.character ?? 0) + 1, dongCuoi: Number(r.end?.line ?? r.start?.line ?? 0) + 1 };
}

function chuHover(h: any): string {
  const c = h?.contents;
  if (!c) return '';
  const motCai = (x: any): string => (typeof x === 'string' ? x : typeof x?.value === 'string' ? (x.language ? `\`\`\`${x.language}\n${x.value}\n\`\`\`` : x.value) : '');
  return (Array.isArray(c) ? c.map(motCai) : [motCai(c)]).filter(Boolean).join('\n\n');
}

function kyHieuTu(ds: any[]): KyHieu[] {
  return (Array.isArray(ds) ? ds : []).slice(0, 400).map((s) => ({
    ten: String(s?.name ?? '?'),
    loai: LOAI_KY_HIEU[Number(s?.kind)] ?? 'symbol',
    dong: Number((s?.selectionRange ?? s?.range ?? s?.location?.range)?.start?.line ?? 0) + 1,
    ...(Array.isArray(s?.children) && s.children.length ? { con: kyHieuTu(s.children) } : {}),
  }));
}

const HET_RANH_MS = 10 * 60_000;

class NguonStdio implements NguonLsp {
  ten = 'stdio';
  private khach = new Map<string, Promise<KhachLsp | null>>();
  private hen: ReturnType<typeof setTimeout> | null = null;
  constructor(private goc: string) {}

  private chamDung(): void {
    if (this.hen) clearTimeout(this.hen);
    this.hen = setTimeout(() => this.dong(), HET_RANH_MS);
    (this.hen as unknown as { unref?: () => void }).unref?.();
  }

  async coChoGoc(goc: string): Promise<boolean> { return (await serverCho(goc)).length > 0; }
  async coChoFile(file: string): Promise<boolean> {
    const e = path.extname(file).toLowerCase();
    return (await serverCho(this.goc)).some((s) => s.duoi.includes(e));
  }

  private async khachCho(file: string, khoiDong = true): Promise<KhachLsp | null> {
    const e = path.extname(file).toLowerCase();
    const sv = (await serverCho(this.goc)).find((s) => s.duoi.includes(e));
    if (!sv) return null;
    let p = this.khach.get(sv.ten);
    if (p) {
      const k = await p;
      if (k && !k.chet) { this.chamDung(); return k; }
      this.khach.delete(sv.ten);
      p = undefined;
    }
    if (!khoiDong) return null;
    p = KhachLsp.mo(sv, this.goc);
    this.khach.set(sv.ten, p);
    this.chamDung();
    return p;
  }

  async dinhNghia(file: string, dong: number, cot: number): Promise<ViTri[]> {
    const k = await this.khachCho(file);
    if (!k) throw new Error('không có server ngôn ngữ cho loại file này');
    await k.dongBo(file);
    const r = await k.yeuCau('textDocument/definition', { textDocument: { uri: pathToFileURL(file).href }, position: { line: dong - 1, character: cot - 1 } });
    return (Array.isArray(r) ? r : r ? [r] : []).map(viTriTu).filter((x): x is ViTri => x !== null);
  }

  async thamChieu(file: string, dong: number, cot: number): Promise<ViTri[]> {
    const k = await this.khachCho(file);
    if (!k) throw new Error('không có server ngôn ngữ cho loại file này');
    await k.dongBo(file);
    const r = await k.yeuCau('textDocument/references', { textDocument: { uri: pathToFileURL(file).href }, position: { line: dong - 1, character: cot - 1 }, context: { includeDeclaration: true } }, 30_000);
    return (Array.isArray(r) ? r : []).map(viTriTu).filter((x): x is ViTri => x !== null);
  }

  async hover(file: string, dong: number, cot: number): Promise<string> {
    const k = await this.khachCho(file);
    if (!k) throw new Error('không có server ngôn ngữ cho loại file này');
    await k.dongBo(file);
    return chuHover(await k.yeuCau('textDocument/hover', { textDocument: { uri: pathToFileURL(file).href }, position: { line: dong - 1, character: cot - 1 } }));
  }

  async kyHieu(file: string): Promise<KyHieu[]> {
    const k = await this.khachCho(file);
    if (!k) throw new Error('không có server ngôn ngữ cho loại file này');
    await k.dongBo(file);
    return kyHieuTu(await k.yeuCau('textDocument/documentSymbol', { textDocument: { uri: pathToFileURL(file).href } }) as any[]);
  }

  async chanDoan(file: string, choMs = 8000): Promise<ChanDoan[]> {
    const k = await this.khachCho(file);
    if (!k) throw new Error('không có server ngôn ngữ cho loại file này');
    const luc = await k.dongBo(file);
    return k.choChanDoan(file, luc, choMs);
  }

  /** Bản bất đồng bộ của `chanDoanDaBiet` (đợi khách đã có, không khởi động mới). */
  async chanDoanDaBietAsync(file: string): Promise<ChanDoan[] | null> {
    const k = await this.khachCho(file, false);
    return k?.daMo(file) ? k.chanDoanCua(file) : null;
  }

  dong(): void {
    if (this.hen) { clearTimeout(this.hen); this.hen = null; }
    for (const p of this.khach.values()) void p.then((k) => k?.dong());
    this.khach.clear();
  }
}

const nguonCuoc = new Map<string, { goc: string; n: NguonStdio }>();
process.once('exit', () => { for (const v of nguonCuoc.values()) v.n.dong(); });

/** Nguồn LSP cho cuộc + thư mục (VS Code bơm thì dùng của VS Code). */
export function nguonCho(cuocId: string, goc: string): NguonLsp {
  if (nguonNgoai) return nguonNgoai;
  const c = nguonCuoc.get(cuocId);
  if (c && c.goc === goc) return c.n;
  c?.n.dong();
  const n = new NguonStdio(goc);
  nguonCuoc.set(cuocId, { goc, n });
  return n;
}

/** Đóng mọi server LSP của cuộc (đóng tab / xoá cuộc). */
export function dongLspCua(cuocId: string): void {
  const c = nguonCuoc.get(cuocId);
  if (!c) return;
  c.n.dong();
  nguonCuoc.delete(cuocId);
}

/** Có khai capability `lsp` cho thư mục này không. Không ném. */
export async function coLsp(goc: string | null): Promise<boolean> {
  if (!goc) return false;
  try { return nguonNgoai ? await nguonNgoai.coChoGoc(goc) : (await serverCho(goc)).length > 0; } catch { return false; }
}

// ─── trình bày cho model ─────────────────────────────────────────

function rel(goc: string, f: string): string {
  const r = path.relative(goc, f);
  return r && !r.startsWith('..') && !path.isAbsolute(r) ? r.split(path.sep).join('/') : f;
}

const NHAN_MUC: Record<MucChanDoan, string> = { loi: 'error', canhBao: 'warning', thongTin: 'info', goiY: 'hint' };

export function dinhDangChanDoan(goc: string, file: string, ds: ChanDoan[], tran = 40): string {
  if (!ds.length) return `${rel(goc, file)}: không có lỗi/cảnh báo nào.`;
  const sap = [...ds].sort((a, b) => (a.muc === b.muc ? a.dong - b.dong : a.muc === 'loi' ? -1 : b.muc === 'loi' ? 1 : a.muc.localeCompare(b.muc)));
  const dong = sap.slice(0, tran).map((d) => `${rel(goc, file)}:${d.dong}:${d.cot} ${NHAN_MUC[d.muc]}${d.ma ? ` ${d.nguon ? `${d.nguon} ` : ''}${d.ma}` : ''}: ${d.thongDiep.split('\n')[0]}`);
  return dong.join('\n') + (ds.length > tran ? `\n… còn ${ds.length - tran} mục nữa` : '');
}

async function dongMa(f: string, dong: number): Promise<string> {
  try {
    const s = await fs.readFile(f, 'utf8');
    const d = s.split('\n')[dong - 1];
    return d === undefined ? '' : d.trim().slice(0, 160);
  } catch { return ''; }
}

function veKyHieu(ds: KyHieu[], thut = 0, ra: string[] = [], tran = 200): string[] {
  for (const k of ds) {
    if (ra.length >= tran) break;
    ra.push(`${'  '.repeat(thut)}${k.loai} ${k.ten} — dòng ${k.dong}`);
    if (k.con) veKyHieu(k.con, thut + 1, ra, tran);
  }
  return ra;
}

export type LoaiHoi = 'dinh_nghia' | 'tham_chieu' | 'chan_doan' | 'ky_hieu' | 'hover';

/** Tool `lsp_hoi`. `file` tương đối gốc dự án (hoặc tuyệt đối trong dự án). Không ném. */
export async function hoiLsp(cuocId: string, goc: string, args: Record<string, unknown>): Promise<{ noiDung: string; tomTat: string }> {
  const loai = String(args.loai ?? '') as LoaiHoi;
  const fRaw = typeof args.file === 'string' ? args.file.trim() : '';
  if (!['dinh_nghia', 'tham_chieu', 'chan_doan', 'ky_hieu', 'hover'].includes(loai)) {
    return { noiDung: 'LỖI: "loai" phải là dinh_nghia | tham_chieu | chan_doan | ky_hieu | hover.', tomTat: 'sai loại' };
  }
  if (!fRaw) return { noiDung: 'LỖI: thiếu "file".', tomTat: 'thiếu file' };
  const file = path.resolve(goc, fRaw);
  const r = path.relative(goc, file);
  if (r.startsWith('..') || path.isAbsolute(r)) return { noiDung: 'LỖI: file phải nằm trong dự án.', tomTat: 'ngoài dự án' };
  if (!(await fs.stat(file).then((s) => s.isFile(), () => false))) return { noiDung: `LỖI: không có file ${fRaw}.`, tomTat: 'không có file' };
  const n = nguonCho(cuocId, goc);
  if (!(await n.coChoFile(file))) return { noiDung: `LỖI: không có server ngôn ngữ cho ${path.extname(file) || 'file này'} (đang có: ${n.ten === 'stdio' ? (await serverCho(goc)).map((s) => s.ten).join(', ') || 'không' : n.ten}). Dùng grep.`, tomTat: 'không có LSP' };
  const dong = Math.max(1, Math.round(Number(args.dong) || 1));
  const cot = Math.max(1, Math.round(Number(args.cot) || 1));
  const canViTri = loai === 'dinh_nghia' || loai === 'tham_chieu' || loai === 'hover';
  if (canViTri && (!Number(args.dong) || !Number(args.cot))) return { noiDung: `LỖI: loai "${loai}" cần "dong" và "cot" (1-based) trỏ vào tên ký hiệu.`, tomTat: 'thiếu vị trí' };
  try {
    switch (loai) {
      case 'chan_doan': {
        const ds = await n.chanDoan(file);
        const loi = ds.filter((d) => d.muc === 'loi').length;
        return { noiDung: dinhDangChanDoan(goc, file, ds), tomTat: `${loi} lỗi · ${ds.length - loi} khác` };
      }
      case 'ky_hieu': {
        const ds = await n.kyHieu(file);
        return { noiDung: ds.length ? veKyHieu(ds).join('\n') : 'Không có ký hiệu nào.', tomTat: `${ds.length} ký hiệu` };
      }
      case 'hover': {
        const h = await n.hover(file, dong, cot);
        return { noiDung: h ? h.slice(0, 4000) : 'Không có thông tin ở vị trí này.', tomTat: h ? 'có kiểu' : 'trống' };
      }
      default: {
        const ds = loai === 'dinh_nghia' ? await n.dinhNghia(file, dong, cot) : await n.thamChieu(file, dong, cot);
        if (!ds.length) return { noiDung: `Không tìm thấy ${loai === 'dinh_nghia' ? 'định nghĩa' : 'tham chiếu'} nào ở ${fRaw}:${dong}:${cot} (con trỏ phải nằm TRÊN tên ký hiệu).`, tomTat: '0 kết quả' };
        const tran = loai === 'dinh_nghia' ? 10 : 60;
        const dongRa: string[] = [];
        for (const v of ds.slice(0, tran)) dongRa.push(`${rel(goc, v.file)}:${v.dong}:${v.cot}  ${await dongMa(v.file, v.dong)}`);
        return { noiDung: dongRa.join('\n') + (ds.length > tran ? `\n… còn ${ds.length - tran} chỗ nữa` : ''), tomTat: `${ds.length} chỗ` };
      }
    }
  } catch (e) {
    return { noiDung: `LỖI LSP: ${(e as Error).message}. Dùng grep/read_file thay thế.`, tomTat: 'LSP lỗi' };
  }
}

/** Chẩn đoán ĐÃ BIẾT trước khi sửa (không khởi động server). */
export async function chupTruocSua(cuocId: string, goc: string, file: string): Promise<ChanDoan[] | null> {
  try {
    const n = nguonCho(cuocId, goc);
    if (n instanceof NguonStdio) return await n.chanDoanDaBietAsync(file);
    return n.chanDoanDaBiet?.(file) ?? null;
  } catch { return null; }
}

const khoa = (d: ChanDoan): string => `${d.muc}|${d.ma ?? ''}|${d.thongDiep}`;

/**
 * Sau khi sửa: chẩn đoán MỚI (lỗi + cảnh báo) của file, so với `truoc`.
 * Rỗng ⇒ '' (không nối gì). Không ném, trần thời gian ~8s.
 */
export async function chanDoanMoiSauSua(cuocId: string, goc: string, file: string, truoc: ChanDoan[] | null): Promise<string> {
  try {
    const n = nguonCho(cuocId, goc);
    if (!(await n.coChoFile(file))) return '';
    const sau = (await n.chanDoan(file, 8000)).filter((d) => d.muc === 'loi' || d.muc === 'canhBao');
    let con = sau;
    if (truoc) {
      const dem = new Map<string, number>();
      for (const d of truoc) dem.set(khoa(d), (dem.get(khoa(d)) ?? 0) + 1);
      con = sau.filter((d) => { const k = khoa(d); const c = dem.get(k) ?? 0; if (c > 0) { dem.set(k, c - 1); return false; } return true; });
    }
    if (!con.length) return '';
    const loi = con.filter((d) => d.muc === 'loi').length;
    return `\n\n[LSP — ${truoc ? 'MỚI sau lần sửa này' : 'file này hiện có'}: ${loi} lỗi, ${con.length - loi} cảnh báo]\n${dinhDangChanDoan(goc, file, con, 15)}`;
  } catch { return ''; }
}
