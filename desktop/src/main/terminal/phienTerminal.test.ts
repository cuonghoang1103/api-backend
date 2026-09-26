/**
 * Terminal thật (PTY) — chạy PTY THẬT, không giả lập.
 *
 * Phép kiểm quan trọng nhất ở đây là lệnh HỎI MẬT KHẨU: đó là cả lý do module
 * này tồn tại. Một bộ kiểm chỉ gọi `lamSach` trên chuỗi mẫu sẽ xanh ngay cả khi
 * PTY không nạp được trên CI — tức xanh vì lý do sai.
 */
import { afterAll, describe, expect, it } from 'vitest';
import os from 'node:os';
import {
  choVaDoc, coPty, doChoNhap, dongMoiTerminal, dsTerminal, guiVao, lamSach, moTerminal,
} from './phienTerminal';

afterAll(() => dongMoiTerminal());

describe('lamSach — dựng lại dòng như mắt người thấy', () => {
  it('gỡ màu ANSI và lấy phần sau \\r cuối (thanh tiến trình)', () => {
    expect(lamSach('\x1b[32mOK\x1b[0m\r\n')).toBe('OK\n');
    expect(lamSach('Tải 10%\rTải 55%\rTải 100%\n')).toBe('Tải 100%\n');
    expect(lamSach('\x1b]0;tiêu đề\x07xin chào')).toBe('xin chào');
  });
});

describe('doChoNhap — nhận ra terminal đang hỏi', () => {
  it('mật khẩu', () => {
    expect(doChoNhap('user@1.2.3.4\'s password: ')).toBe('matKhau');
    expect(doChoNhap('[sudo] password for cuong: ')).toBe('matKhau');
    expect(doChoNhap('Enter passphrase for key \'/home/a/.ssh/id_ed25519\': ')).toBe('matKhau');
  });
  it('xác nhận', () => {
    expect(doChoNhap('Do you want to continue? [Y/n] ')).toBe('xacNhan');
    expect(doChoNhap('Are you sure you want to continue connecting (yes/no/[fingerprint])? ')).toBe('xacNhan');
    expect(doChoNhap('Need to install the following packages:\ncreate-vite@5\nOk to proceed? (y) ')).toBe('xacNhan');
  });
  it('không nhầm log thường', () => {
    expect(doChoNhap('password reset email sent\n$ ')).toBeNull();
    expect(doChoNhap('Build xong trong 3.2s\n')).toBeNull();
  });
});

/* Windows CI không có bash; phần PTY thật chỉ chạy trên macOS/Linux. */
const coBash = process.platform !== 'win32';

describe.runIf(coBash)('PTY THẬT', () => {
  it('nạp được @lydell/node-pty trên máy này', () => {
    const t = coPty();
    expect(t.loi).toBeNull();
    expect(t.co).toBe(true);
  });

  it('lệnh hỏi mật khẩu: phát hiện đúng, gõ vào thì chạy tiếp', async () => {
    const k = moTerminal({
      cuocId: 'thu-pty', cwd: os.tmpdir(), nguon: 'agent',
      lenh: `bash -c 'read -s -p "Password: " x; echo; echo "NHAN:$x"'`,
    });
    expect(k.ok).toBe(true);
    const id = k.phien!.id;
    const r1 = await choVaDoc(id, { imMs: 600, toiDaMs: 8000 });
    expect(r1?.choNhap).toBe('matKhau');
    // Người dùng gõ mật khẩu (ở app: qua khung xterm → `pty:gui`).
    expect(guiVao(id, 'bi-mat\r')).toBe(true);
    const r2 = await choVaDoc(id, { imMs: 600, toiDaMs: 8000 });
    expect(r2?.moi).toContain('NHAN:bi-mat');
    expect(r2?.choNhap).toBeNull();
  }, 20_000);

  it('shell SỐNG sau lệnh đầu — gõ tiếp được, có tty thật', async () => {
    const k = moTerminal({ cuocId: 'thu-pty', cwd: os.tmpdir(), nguon: 'agent', lenh: 'echo DAU' });
    const id = k.phien!.id;
    await choVaDoc(id, { imMs: 500, toiDaMs: 8000 });
    guiVao(id, 'tty && echo TIEP\r');
    const r = await choVaDoc(id, { imMs: 500, toiDaMs: 8000 });
    expect(r?.moi).toContain('TIEP');
    expect(r?.moi).toMatch(/\/dev\/(tty|pts)/);
    expect(r?.dangChay).toBe(true);
    guiVao(id, 'exit\r');
    const r3 = await choVaDoc(id, { imMs: 300, toiDaMs: 5000 });
    expect(r3?.dangChay).toBe(false);
  }, 20_000);

  it('dọn theo cuộc', () => {
    expect(dsTerminal('thu-pty').length).toBeGreaterThan(0);
    dongMoiTerminal();
    expect(dsTerminal('thu-pty').filter((p) => p.dangChay)).toHaveLength(0);
  });
});
