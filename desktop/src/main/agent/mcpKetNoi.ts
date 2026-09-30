/**
 * ============================================================
 * MCP — TẦNG KẾT NỐI: stdio · Streamable HTTP · SSE (cũ)
 * ============================================================
 *
 * Tách khỏi `mcp.ts` để kiểm được mà không cần Electron: file này không import
 * `electron`, chỉ có Node + `fetch`.
 *
 * ─── Vì sao phải có HTTP ───
 * Bản đầu chỉ nói stdio. Người dùng hỏi 30/09/2026 "cắm được MCP Figma không"
 * — và câu trả lời thật là KHÔNG trực tiếp: server chính thức của Figma (Dev
 * Mode, chạy trong app Figma) chỉ mở một URL `http://127.0.0.1:3845/mcp`. Cả
 * họ server "remote" (Linear, Sentry, Notion…) cũng vậy. Chỉ có stdio là tự
 * khoá mình khỏi nửa hệ sinh thái.
 *
 * ─── Ba kiểu, MỘT lõi ───
 *   stdio  — tiến trình con, JSON-RPC mỗi dòng một thông điệp.
 *   http   — "Streamable HTTP" (spec 2025-03-26 trở đi): POST mỗi thông điệp;
 *            máy chủ trả JSON thẳng HOẶC một luồng SSE chở câu trả lời.
 *   sse    — kiểu cũ (2024-11-05): GET mở một luồng SSE, sự kiện đầu tiên
 *            `endpoint` cho biết POST vào đâu; câu trả lời về qua luồng GET.
 * Cả ba chỉ khác chỗ "gửi đi" và "nhận về". Phần ghép câu hỏi với câu trả lời,
 * hạn giờ, huỷ, trả lời `ping` của server — nằm chung ở `KetNoiMcp`.
 *
 * ─── ⚠️ Server CŨNG hỏi ngược lại client ───
 * Bản đầu bỏ qua mọi thông điệp có cả `method` lẫn `id` từ phía server. Đó là
 * một YÊU CẦU (thường là `ping`), và server đứng chờ câu trả lời — có server
 * treo luôn lời gọi tool đang chạy cho tới khi được trả lời. Giờ: `ping` trả
 * `{}`, `roots/list` trả rỗng, còn lại trả lỗi "không hỗ trợ" để server đi
 * tiếp chứ không chờ vô hạn.
 */
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import path from 'node:path';

export type KieuKetNoi = 'stdio' | 'http' | 'sse';

/** Một mục trong `mcp.json` / `.mcp.json`. Cùng hình dạng với Claude Code. */
export interface CauHinhServer {
  /** 'stdio' | 'http' | 'streamable-http' | 'sse'. Bỏ trống ⇒ đoán theo `command`/`url`. */
  type?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  url?: string;
  headers?: Record<string, string>;
  /** Hạn một lời gọi tool (ms). Mặc định 60s, kẹp 5s–10 phút. */
  timeoutMs?: number;
  /** Hạn khởi động + bắt tay (ms). Mặc định 30s, hoặc 120s với `npx`/`uvx`… */
  startupTimeoutMs?: number;
}

export interface TinNhan {
  jsonrpc?: '2.0';
  id?: number | string | null;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: { code?: number; message?: string; data?: unknown };
}

/** Lỗi HTTP có mã — tầng trên cần mã để biết nên lùi sang SSE hay mở lại phiên. */
export class LoiHttp extends Error {
  constructor(public readonly status: number, noiDung: string) {
    super(`HTTP ${status}${noiDung ? `: ${noiDung}` : ''}`);
  }
}

/** Một kiểu vận chuyển. Lõi gắn `onTin` / `onDong` sau khi tạo. */
export interface VanChuyen {
  /** Mở kết nối. stdio: spawn. sse: chờ sự kiện `endpoint`. http: không làm gì. */
  mo(): Promise<void>;
  gui(tin: TinNhan): Promise<void>;
  dong(): Promise<void>;
  /** Phiên bản giao thức đã thoả thuận — HTTP phải gửi lại nó ở mọi yêu cầu. */
  datPhienBan?(pv: string): void;
  /** Quên phiên HTTP (server báo 404) để bắt tay lại từ đầu. */
  quenPhien?(): void;
  /** Vài trăm ký tự cuối stderr / thân lỗi — thứ giải thích vì sao server chết. */
  duoiLog(): string;
  onTin?: (t: TinNhan) => void;
  onDong?: (lyDo: string) => void;
}

/**
 * Thân một phản hồi lỗi → một dòng đọc được. Server Express trả nguyên trang
 * HTML ("<!DOCTYPE html>…<pre>Cannot POST /mcp</pre>") và bảng MCP hiện cả
 * đống thẻ; chỉ phần chữ mới nói được chuyện gì.
 */
export function gonThanLoi(than: string): string {
  let s = than;
  if (/<\/?[a-z!][^>]*>/i.test(s)) {
    const pre = /<pre[^>]*>([\s\S]*?)<\/pre>/i.exec(s)?.[1];
    s = (pre ?? s.replace(/<(script|style|head)[\s\S]*?<\/\1>/gi, ' ')).replace(/<[^>]+>/g, ' ');
  }
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim().slice(0, 300);
}

// ─── Đoán kiểu ─────────────────────────────────────────────────────

export function kieuCua(c: CauHinhServer | null | undefined): KieuKetNoi | null {
  if (!c || typeof c !== 'object') return null;
  const t = typeof c.type === 'string' ? c.type.toLowerCase().replace(/[_\s]/g, '-') : '';
  const coLenh = typeof c.command === 'string' && c.command.trim() !== '';
  const coUrl = typeof c.url === 'string' && c.url.trim() !== '';
  if (t === 'sse') return coUrl ? 'sse' : null;
  if (t === 'http' || t === 'streamable-http' || t === 'streamablehttp') return coUrl ? 'http' : null;
  if (t === 'stdio') return coLenh ? 'stdio' : null;
  if (t !== '') return null;           // kiểu lạ ⇒ báo lỗi, đừng đoán bừa
  if (coLenh) return 'stdio';
  if (coUrl) return /\/sse\/?(\?|$)/.test(c.url!) ? 'sse' : 'http';
  return null;
}

/**
 * Lệnh TẢI GÓI về rồi mới chạy (`npx -y …`, `uvx …`). Lần đầu mất 20–60 giây
 * chỉ để tải — hạn 10 giây cũ làm server báo "không bắt tay xong" đúng lần
 * đầu tiên người dùng cắm nó, tức là đúng lúc họ kết luận "không chạy được".
 */
export function laLenhTaiGoi(command: string | undefined): boolean {
  if (!command) return false;
  const goc = path.basename(command).toLowerCase().replace(/\.(cmd|exe|bat)$/, '');
  return ['npx', 'uvx', 'bunx', 'pnpx', 'pnpm', 'yarn', 'uv', 'pipx', 'docker'].includes(goc);
}

// ─── Lõi JSON-RPC ──────────────────────────────────────────────────

interface Cho {
  xong: (v: unknown) => void;
  hong: (e: Error) => void;
  dongHo: ReturnType<typeof setTimeout>;
  boNghe?: () => void;
}

export class KetNoiMcp {
  private demId = 0;
  private cho = new Map<number, Cho>();
  private _daDong = false;
  private _lyDoDong = '';
  /** Thông báo một chiều từ server (vd. `notifications/tools/list_changed`). */
  onThongBao?: (method: string, params: unknown) => void;
  /** Kết nối chết SAU khi đã chạy được — tầng trên cập nhật bảng trạng thái. */
  onChet?: (lyDo: string) => void;

  constructor(
    public readonly ten: string,
    public readonly kieu: KieuKetNoi,
    public readonly vc: VanChuyen,
  ) {
    vc.onTin = (t) => this.nhan(t);
    vc.onDong = (lyDo) => this.khiDong(lyDo);
  }

  get daDong(): boolean { return this._daDong; }
  get lyDoDong(): string { return this._lyDoDong; }

  /** Gửi một yêu cầu và chờ trả lời. Huỷ được bằng `signal`. */
  goi(method: string, params: unknown, hanMs: number, signal?: AbortSignal): Promise<unknown> {
    if (this._daDong) return Promise.reject(new Error(this._lyDoDong || `${this.ten}: kết nối đã đóng`));
    if (signal?.aborted) return Promise.reject(new Error('đã huỷ'));
    const id = ++this.demId;
    return new Promise((xong, hong) => {
      const xoa = (): Cho | undefined => {
        const c = this.cho.get(id);
        if (!c) return undefined;
        clearTimeout(c.dongHo);
        c.boNghe?.();
        this.cho.delete(id);
        return c;
      };
      const dongHo = setTimeout(() => {
        if (!xoa()) return;
        void this.bao('notifications/cancelled', { requestId: id, reason: 'timeout' });
        hong(new Error(`${this.ten}: quá ${Math.round(hanMs / 1000)}s không trả lời`));
      }, hanMs);
      const c: Cho = { xong, hong, dongHo };
      if (signal) {
        const khiHuy = (): void => {
          if (!xoa()) return;
          // Báo server dừng việc đang làm — không báo thì nó chạy tiếp cho tới
          // xong, tốn tài nguyên cho một kết quả không ai nhận.
          void this.bao('notifications/cancelled', { requestId: id, reason: 'người dùng dừng' });
          hong(new Error('đã huỷ'));
        };
        signal.addEventListener('abort', khiHuy, { once: true });
        c.boNghe = () => signal.removeEventListener('abort', khiHuy);
      }
      this.cho.set(id, c);
      this.vc.gui({ jsonrpc: '2.0', id, method, ...(params === undefined ? {} : { params }) }).catch((err: Error) => {
        const c2 = xoa();
        if (c2) c2.hong(err);
      });
    });
  }

  /** Gửi một thông báo một chiều. Không ném: không ai chờ nó. */
  async bao(method: string, params?: unknown): Promise<void> {
    if (this._daDong) return;
    try {
      await this.vc.gui({ jsonrpc: '2.0', method, ...(params === undefined ? {} : { params }) });
    } catch {
      /* server đã chết hoặc từ chối — thông báo không cần ai nhận */
    }
  }

  async dong(): Promise<void> {
    this.khiDong(`${this.ten}: đã tắt`, false);
    await this.vc.dong().catch(() => {});
  }

  private nhan(t: TinNhan): void {
    if (!t || typeof t !== 'object') return;
    const coId = t.id !== undefined && t.id !== null;

    // Server HỎI client.
    if (typeof t.method === 'string' && coId) {
      void this.traLoiServer(t.id!, t.method);
      return;
    }
    // Thông báo một chiều.
    if (typeof t.method === 'string') {
      try { this.onThongBao?.(t.method, t.params); } catch { /* nghe hỏng không được giết kết nối */ }
      return;
    }
    // Câu trả lời cho một yêu cầu của ta.
    if (!coId) return;
    const id = typeof t.id === 'number' ? t.id : Number(t.id);
    const c = this.cho.get(id);
    if (!c) return;
    clearTimeout(c.dongHo);
    c.boNghe?.();
    this.cho.delete(id);
    if (t.error) c.hong(new Error(t.error.message || `lỗi MCP ${t.error.code ?? ''}`.trim()));
    else c.xong(t.result);
  }

  private async traLoiServer(id: number | string, method: string): Promise<void> {
    let tin: TinNhan;
    if (method === 'ping') tin = { jsonrpc: '2.0', id, result: {} };
    else if (method === 'roots/list') tin = { jsonrpc: '2.0', id, result: { roots: [] } };
    else tin = { jsonrpc: '2.0', id, error: { code: -32601, message: `client không hỗ trợ "${method}"` } };
    try { await this.vc.gui(tin); } catch { /* server đã đi */ }
  }

  private khiDong(lyDo: string, baoChet = true): void {
    if (this._daDong) return;
    this._daDong = true;
    const duoi = this.vc.duoiLog().trim();
    this._lyDoDong = duoi ? `${lyDo} — ${duoi.slice(-300)}` : lyDo;
    const e = new Error(this._lyDoDong);
    for (const [, c] of this.cho) { clearTimeout(c.dongHo); c.boNghe?.(); c.hong(e); }
    this.cho.clear();
    if (baoChet) { try { this.onChet?.(this._lyDoDong); } catch { /* */ } }
  }
}

// ─── Đọc luồng SSE ─────────────────────────────────────────────────

export interface SuKienSse { event: string; data: string }

/**
 * Đọc luồng `text/event-stream` thành từng sự kiện.
 *
 * Tự viết thay vì kéo thư viện: định dạng chỉ có bốn loại dòng, và phần dễ sai
 * nhất — một sự kiện bị cắt đôi giữa hai mẩu mạng — là thứ vòng đệm dưới đây
 * lo. Dòng `data:` nhiều lần trong MỘT sự kiện thì nối bằng xuống dòng, đúng
 * chuẩn WHATWG.
 */
export async function docSse(
  body: ReadableStream<Uint8Array>,
  moiSuKien: (e: SuKienSse) => void,
): Promise<void> {
  const reader = body.getReader();
  const giai = new TextDecoder();
  let dem = '';
  let event = '';
  let data: string[] = [];
  const phat = (): void => {
    if (data.length) moiSuKien({ event: event || 'message', data: data.join('\n') });
    event = '';
    data = [];
  };
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      dem += giai.decode(value, { stream: true });
      // Trần bộ đệm: một server hỏng gửi mãi không xuống dòng sẽ ăn hết RAM.
      if (dem.length > 16_000_000) dem = '';
      let i: number;
      while ((i = dem.search(/\r\n|\r|\n/)) >= 0) {
        const dong = dem.slice(0, i);
        dem = dem.slice(i + (dem[i] === '\r' && dem[i + 1] === '\n' ? 2 : 1));
        if (dong === '') { phat(); continue; }
        if (dong.startsWith(':')) continue;               // chú thích / nhịp giữ kết nối
        const hai = dong.indexOf(':');
        const truong = hai < 0 ? dong : dong.slice(0, hai);
        let giaTri = hai < 0 ? '' : dong.slice(hai + 1);
        if (giaTri.startsWith(' ')) giaTri = giaTri.slice(1);
        if (truong === 'event') event = giaTri;
        else if (truong === 'data') data.push(giaTri);
      }
    }
    dem += giai.decode();
    if (dem) { /* dòng cuối không có xuống dòng — theo chuẩn thì bỏ */ }
    phat();
  } finally {
    try { reader.releaseLock(); } catch { /* */ }
  }
}

function phanTichTin(chu: string, nhan: (t: TinNhan) => void): void {
  let j: unknown;
  try { j = JSON.parse(chu); } catch { return; }
  // JSON-RPC cho phép gửi theo lô (mảng).
  if (Array.isArray(j)) for (const x of j) nhan(x as TinNhan);
  else nhan(j as TinNhan);
}

// ─── stdio ─────────────────────────────────────────────────────────

export interface TuyChonStdio {
  command: string;
  args: string[];
  env: NodeJS.ProcessEnv;
  cwd?: string;
}

export function taoStdio(o: TuyChonStdio): VanChuyen {
  let tienTrinh: ChildProcessWithoutNullStreams | null = null;
  let stderr = '';
  let dem = '';
  let daThoat = false;

  const vc: VanChuyen = {
    async mo() {
      /*
       * Windows: `npx`, `npm`… là file `.cmd`, và Node (từ bản vá CVE-2024-27980)
       * không cho spawn `.cmd` nếu không qua shell — lỗi EINVAL câm. Đi qua
       * `cmd.exe /c` cho đúng mấy lệnh đó.
       */
      let lenh = o.command;
      let thamSo = o.args;
      if (process.platform === 'win32' && /^(npx|npm|pnpm|pnpx|yarn|bunx)$/i.test(o.command)) {
        lenh = process.env.ComSpec || 'cmd.exe';
        thamSo = ['/d', '/c', o.command, ...o.args];
      }
      const tt = spawn(lenh, thamSo, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: o.env,
        ...(o.cwd ? { cwd: o.cwd } : {}),
        windowsHide: true,
      }) as ChildProcessWithoutNullStreams;
      tienTrinh = tt;

      // `spawn` KHÔNG ném khi lệnh không tồn tại — nó báo qua sự kiện `error`.
      tt.once('error', (e: Error) => {
        daThoat = true;
        vc.onDong?.(`không chạy được "${o.command}": ${e.message}`);
      });
      tt.once('exit', (code, sig) => {
        daThoat = true;
        vc.onDong?.(`server đã thoát (${code !== null ? `mã ${code}` : `tín hiệu ${sig}`})`);
      });
      // Ghi vào stdin của một tiến trình đã chết phát sự kiện `error` trên
      // STREAM (EPIPE). Không ai nghe thì nó thành lỗi không bắt được và làm
      // sập cả tiến trình main của app.
      tt.stdin.on('error', () => {});

      tt.stdout.on('data', (mau: Buffer) => {
        dem += mau.toString('utf8');
        if (dem.length > 16_000_000) dem = dem.slice(-4_000_000);
        const dong = dem.split('\n');
        dem = dong.pop() ?? '';
        for (const d of dong) {
          const s = d.trim();
          if (s) phanTichTin(s, (t) => vc.onTin?.(t));
        }
      });
      // stderr là LOG của server, không phải lỗi giao thức. Phải đọc — không
      // đọc thì ống đầy và server treo — và giữ phần đuôi: khi server chết,
      // đó là nơi duy nhất có câu "thiếu FIGMA_API_KEY".
      tt.stderr.on('data', (mau: Buffer) => {
        stderr = (stderr + mau.toString('utf8')).slice(-4000);
      });
    },
    async gui(tin) {
      if (!tienTrinh || daThoat || !tienTrinh.stdin.writable) throw new Error('server stdio không còn chạy');
      tienTrinh.stdin.write(`${JSON.stringify(tin)}\n`);
    },
    async dong() {
      const tt = tienTrinh;
      if (!tt || daThoat) return;
      try { tt.stdin.end(); } catch { /* */ }
      try { tt.kill('SIGTERM'); } catch { /* */ }
      // Server lì không chịu tắt thì giết hẳn — không thì mỗi lần "Nạp lại"
      // lại để lại một tiến trình mồ côi.
      const hen = setTimeout(() => { if (!daThoat) { try { tt.kill('SIGKILL'); } catch { /* */ } } }, 2000);
      hen.unref?.();
    },
    duoiLog: () => stderr.replace(/\s+/g, ' ').trim(),
  };
  return vc;
}

// ─── Streamable HTTP ───────────────────────────────────────────────

type FetchFn = typeof fetch;

export function taoHttp(url: string, headers: Record<string, string>, fetchFn: FetchFn = fetch): VanChuyen {
  let phien: string | null = null;
  let phienBan: string | null = null;
  let loiCuoi = '';
  const dangBay = new Set<AbortController>();

  const tieuDe = (): Record<string, string> => ({
    ...headers,
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
    ...(phien ? { 'mcp-session-id': phien } : {}),
    ...(phienBan ? { 'mcp-protocol-version': phienBan } : {}),
  });

  const vc: VanChuyen = {
    async mo() { /* không có gì để mở — mỗi thông điệp là một POST */ },
    async gui(tin) {
      const ac = new AbortController();
      dangBay.add(ac);
      let giuLai = false;
      try {
        const res = await fetchFn(url, { method: 'POST', headers: tieuDe(), body: JSON.stringify(tin), signal: ac.signal });
        const sid = res.headers.get('mcp-session-id');
        if (sid) phien = sid;
        if (res.status === 202 || res.status === 204) { await res.body?.cancel().catch(() => {}); return; }
        if (!res.ok) {
          const than = gonThanLoi(await res.text().catch(() => ''));
          loiCuoi = than;
          throw new LoiHttp(res.status, than);
        }
        const ct = (res.headers.get('content-type') ?? '').toLowerCase();
        if (ct.includes('text/event-stream') && res.body) {
          // Câu trả lời đi trong một luồng SSE — đọc ở NỀN. Lõi đã đăng ký chờ
          // theo id, và hạn giờ của nó lo trường hợp luồng không bao giờ trả.
          giuLai = true;
          void docSse(res.body, (e) => { if (e.event === 'message') phanTichTin(e.data, (t) => vc.onTin?.(t)); })
            .catch(() => {})
            .finally(() => dangBay.delete(ac));
          return;
        }
        const chu = await res.text();
        if (chu.trim()) phanTichTin(chu, (t) => vc.onTin?.(t));
      } finally {
        if (!giuLai) dangBay.delete(ac);
      }
    },
    async dong() {
      for (const ac of dangBay) ac.abort();
      dangBay.clear();
      // Báo server dọn phiên. Server không hỗ trợ thì trả 405 — không sao.
      if (phien) {
        const ac = new AbortController();
        const hen = setTimeout(() => ac.abort(), 2000);
        await fetchFn(url, { method: 'DELETE', headers: tieuDe(), signal: ac.signal }).catch(() => {});
        clearTimeout(hen);
      }
      phien = null;
    },
    datPhienBan(pv) { phienBan = pv; },
    quenPhien() { phien = null; phienBan = null; },
    duoiLog: () => loiCuoi,
  };
  return vc;
}

// ─── SSE kiểu cũ ───────────────────────────────────────────────────

export function taoSse(url: string, headers: Record<string, string>, fetchFn: FetchFn = fetch): VanChuyen {
  let diemGui: string | null = null;
  let loiCuoi = '';
  const ac = new AbortController();

  const vc: VanChuyen = {
    async mo() {
      const res = await fetchFn(url, {
        method: 'GET',
        headers: { ...headers, accept: 'text/event-stream' },
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        const than = gonThanLoi(await res.text().catch(() => ''));
        loiCuoi = than;
        throw new LoiHttp(res.status, than);
      }
      await new Promise<void>((xong, hong) => {
        let daCo = false;
        void docSse(res.body!, (e) => {
          if (e.event === 'endpoint') {
            try {
              // Endpoint thường là đường dẫn TƯƠNG ĐỐI (`/messages?sessionId=…`).
              const u = new URL(e.data.trim(), url);
              // Không cho server chuyển hướng POST sang MÁY KHÁC: POST mang
              // theo `headers` — tức token của người dùng.
              if (u.origin !== new URL(url).origin) throw new Error(`endpoint khác máy chủ: ${u.origin}`);
              diemGui = u.toString();
              if (!daCo) { daCo = true; xong(); }
            } catch (err) {
              if (!daCo) { daCo = true; hong(err as Error); }
            }
          } else if (e.event === 'message') {
            phanTichTin(e.data, (t) => vc.onTin?.(t));
          }
        })
          .then(() => {
            if (!daCo) { daCo = true; hong(new Error('luồng SSE đóng trước khi có "endpoint"')); }
            vc.onDong?.('luồng SSE đã đóng');
          })
          .catch((err: Error) => {
            if (!daCo) { daCo = true; hong(err); }
            vc.onDong?.(`luồng SSE đứt: ${err.message}`);
          });
      });
    },
    async gui(tin) {
      if (!diemGui) throw new Error('SSE chưa có endpoint');
      const res = await fetchFn(diemGui, {
        method: 'POST',
        headers: { ...headers, 'content-type': 'application/json' },
        body: JSON.stringify(tin),
      });
      if (!res.ok) {
        const than = gonThanLoi(await res.text().catch(() => ''));
        loiCuoi = than;
        throw new LoiHttp(res.status, than);
      }
      await res.body?.cancel().catch(() => {});
    },
    async dong() { ac.abort(); },
    duoiLog: () => loiCuoi,
  };
  return vc;
}
