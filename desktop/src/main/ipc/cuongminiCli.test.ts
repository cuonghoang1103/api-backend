/**
 * Nút "Cài CuongMini CLI" trên WINDOWS — kiểm bằng spawn giả (máy dev là macOS).
 *
 * Vì sao có tệp này: bản 17/10/2026 ghi install.ps1 ra file rồi `powershell -File` — Windows PowerShell 5.1 đọc
 * file UTF-8 không BOM theo ANSI ⇒ ParserError trên MỌI máy Windows (đo thật trên runner windows-latest
 * 18/10/2026). Không phép kiểm nào bắt được vì không có phép kiểm nào cho nút này.
 */
import { EventEmitter } from 'node:events';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

const nenGoc = process.platform;
Object.defineProperty(process, 'platform', { value: 'win32' });
const localGia = mkdtempSync(join(tmpdir(), 'cm-local-'));
process.env.LOCALAPPDATA = localGia;

const handlers = new Map<string, (input: unknown, event: unknown) => Promise<unknown>>();
vi.mock('electron', () => ({ net: { fetch: vi.fn(async () => { throw new Error('Windows không được tải script bằng net.fetch'); }) } }));
vi.mock('../config', () => ({ API_ORIGIN: 'https://api.cuongthai.com', WEB_ORIGIN: 'https://cuongthai.com' }));
vi.mock('./auth', () => ({ readStoredSession: () => null }));
vi.mock('./index', () => ({ handle: (k: string, f: (input: unknown, event: unknown) => Promise<unknown>) => handlers.set(k, f) }));

const m = await import('./cuongminiCli');
m.registerCuongMiniCliHandlers();

interface LanGoi { file: string; args: string[]; opts: { env?: NodeJS.ProcessEnv; detached?: boolean; cwd?: string } }
type KichBan = (con: ConGia, lan: LanGoi) => void;

class ConGia extends EventEmitter {
  stdout = new EventEmitter();
  stderr = new EventEmitter();
  kill = vi.fn();
  unref = vi.fn();
}

let goi: LanGoi[] = [];
let kichBan: Record<string, KichBan> = {};

function spawnGia(file: string, args: string[], opts: LanGoi['opts']) {
  const lan = { file, args, opts };
  goi.push(lan);
  const con = new ConGia();
  const kb = kichBan[file];
  setImmediate(() => (kb ? kb(con, lan) : con.emit('error', Object.assign(new Error(`spawn ${file} ENOENT`), { code: 'ENOENT' }))));
  return con;
}

/** Đẩy chuỗi UTF-8 thành NHIỀU mẩu, cắt ngay giữa một ký tự nhiều byte — như ống thật. */
function dayCatDoi(luong: EventEmitter, chu: string) {
  const b = Buffer.from(chu, 'utf8');
  for (let i = 0; i < b.length; i += 5) luong.emit('data', b.subarray(i, i + 5));
}

const suKien = { sender: { isDestroyed: () => false, send: vi.fn() } };

beforeEach(() => {
  goi = [];
  kichBan = {};
  suKien.sender.send.mockClear();
  m._datSpawnChoTest(spawnGia as never);
});
afterAll(() => { Object.defineProperty(process, 'platform', { value: nenGoc }); });

function datLenhDaCai() {
  mkdirSync(join(localGia, 'CuongMini', 'bin'), { recursive: true });
  writeFileSync(join(localGia, 'CuongMini', 'bin', 'cuongmini.cmd'), '@echo off\r\n');
}

describe('lệnh cài trên Windows', () => {
  it('là `irm … | iex` qua -Command, KHÔNG -File; UTF-8 + TLS 1.2 trước irm', () => {
    const l = m.lenhCaiWindows('https://cuongthai.com/cli/install.ps1?t=1');
    expect(l.file).toBe('powershell.exe');
    expect(l.args.slice(0, 5)).toEqual(['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command']);
    expect(l.args).not.toContain('-File');
    const ps = l.args[5]!;
    expect(ps).toMatch(/OutputEncoding = New-Object Text\.UTF8Encoding/);
    expect(ps.indexOf('SecurityProtocol')).toBeLessThan(ps.indexOf('irm '));
    expect(ps).toMatch(/irm 'https:\/\/cuongthai\.com\/cli\/install\.ps1\?t=1' \| iex$/);
    expect(l.env.CUONGMINI_TU_APP).toBe('1');
  });

  it('cli:cai thành công: chạy powershell, tiến độ giữ nguyên chữ Việt bị cắt đôi, rồi kiểm --version bằng cmd', async () => {
    datLenhDaCai();
    kichBan['powershell.exe'] = (con) => {
      dayCatDoi(con.stdout, '✻ CuongMini CLI — trợ lý lập trình\r\n✓ Đã cài CuongMini 0.5.0\r\n');
      con.emit('close', 0);
    };
    kichBan['cmd.exe'] = (con) => { con.stdout.emit('data', Buffer.from('0.5.0\r\n')); con.emit('close', 0); };
    const kq = await handlers.get('cli:cai')!(null, suKien) as { ok: boolean; phienBan?: string };
    expect(kq.ok).toBe(true);
    expect(kq.phienBan).toBe('0.5.0');
    expect(goi[0]!.file).toBe('powershell.exe');
    expect(goi[0]!.args.join(' ')).toMatch(/irm 'https:\/\/cuongthai\.com\/cli\/install\.ps1\?t=\d+' \| iex/);
    expect(goi[0]!.opts.env?.CUONGMINI_TU_APP).toBe('1');
    const dong = suKien.sender.send.mock.calls.map((c) => (c[1] as { dong?: string }).dong);
    expect(dong).toContain('✓ Đã cài CuongMini 0.5.0');
    expect(dong).toContain('✻ CuongMini CLI — trợ lý lập trình');
    expect(goi[1]!.file).toBe('cmd.exe');
    expect(goi[1]!.args).toEqual(['/d', '/c', join(localGia, 'CuongMini', 'bin', 'cuongmini.cmd'), '--version']);
  });

  it('cli:cai hỏng: trả lỗi THẬT (dòng ✗ của trình cài) kèm log, không chỉ "mã 1"', async () => {
    kichBan['powershell.exe'] = (con) => {
      con.stdout.emit('data', Buffer.from('▸ Tải CuongMini 0.5.0…\r\n'));
      con.stdout.emit('data', Buffer.from('✗ SHA-256 của gói CuongMini KHÔNG khớp latest.json — dừng.\r\n'));
      con.stderr.emit('data', Buffer.from('At line:1 char:1\r\n'));
      con.emit('close', 1);
    };
    const kq = await handlers.get('cli:cai')!(null, suKien) as { ok: boolean; loi?: string; log?: string };
    expect(kq.ok).toBe(false);
    expect(kq.loi).toMatch(/mã 1/);
    expect(kq.loi).toMatch(/✗ SHA-256 của gói CuongMini KHÔNG khớp/);
    expect(kq.log).toMatch(/Tải CuongMini/);
  });

  it('cli:cai: máy không chạy được powershell.exe ⇒ nói rõ', async () => {
    const kq = await handlers.get('cli:cai')!(null, suKien) as { ok: boolean; loi?: string };
    expect(kq.ok).toBe(false);
    expect(kq.loi).toMatch(/ENOENT/);
  });
});

describe('loiThat', () => {
  it('lấy lỗi PowerShell khi không có dòng ✗', () => {
    const chu = "x\r\niex : The term 'Get-FileHash' is not recognized as the name of a cmdlet\r\nAt line:1 char:47\r\n";
    expect(m.loiThat(chu)).toMatch(/Get-FileHash' is not recognized/);
  });
  it('rỗng ⇒ null', () => { expect(m.loiThat('\r\n')).toBeNull(); });
});

describe('mở terminal mới chạy cuongmini', () => {
  const giai = (args: string[]) => Buffer.from(args[args.indexOf('-EncodedCommand') + 1]!, 'base64').toString('utf16le');

  it('lệnh PowerShell mã hoá: nạp lại PATH, cd đúng thư mục có dấu cách/chữ Việt/nháy, gọi đường tuyệt đối', () => {
    const ds = m.lenhMoTerminalWindows("C:\\Users\\Cường\\dự án 'x'", 'C:\\Users\\Cường\\AppData\\Local\\CuongMini\\bin\\cuongmini.cmd');
    expect(ds.map((d) => d.file)).toEqual(['wt.exe', 'powershell.exe']);
    expect(ds[0]!.args.slice(0, 3)).toEqual(['-d', "C:\\Users\\Cường\\dự án 'x'", 'powershell.exe']);
    for (const d of ds) expect(d.args.join(' ')).not.toMatch(/;/); // wt cắt dòng lệnh ở `;`
    const ps = giai(ds[1]!.args);
    expect(ps).toMatch(/\$env:Path = \[Environment\]::GetEnvironmentVariable\('Path', 'Machine'\)/);
    expect(ps).toContain("Set-Location -LiteralPath 'C:\\Users\\Cường\\dự án ''x'''");
    expect(ps).toContain("& 'C:\\Users\\Cường\\AppData\\Local\\CuongMini\\bin\\cuongmini.cmd'");
  });

  it('có Windows Terminal ⇒ mở wt (detached)', async () => {
    datLenhDaCai();
    kichBan['wt.exe'] = (con) => con.emit('spawn');
    const kq = await handlers.get('cli:moTerminal')!({ thuMuc: localGia }, suKien) as { ok: boolean };
    expect(kq.ok).toBe(true);
    expect(goi.map((g) => g.file)).toEqual(['wt.exe']);
    expect(goi[0]!.opts.detached).toBe(true);
  });

  it('không có wt.exe ⇒ lùi về cửa sổ PowerShell riêng', async () => {
    datLenhDaCai();
    kichBan['powershell.exe'] = (con) => con.emit('spawn');
    const kq = await handlers.get('cli:moTerminal')!({ thuMuc: localGia }, suKien) as { ok: boolean };
    expect(kq.ok).toBe(true);
    expect(goi.map((g) => g.file)).toEqual(['wt.exe', 'powershell.exe']);
    expect(goi[1]!.args.slice(0, 3)).toEqual(['-NoExit', '-ExecutionPolicy', 'Bypass']);
  });
});
