/**
 * `read_file` đọc được ẢNH.
 *
 * Người dùng 20/08/2026: "sao Claude Code chụp được màn hình điện thoại qua
 * cáp USB rồi đưa thẳng vào chat, mà AI Code trong app tôi thì không?"
 *
 * Hoá ra khoảng cách chỉ có ĐÚNG MỘT BƯỚC. Claude Code làm hai việc:
 *   1. `adb exec-out screencap -p > man.png`   ← `run_command`, app ĐÃ CÓ
 *   2. đọc `man.png` NHƯ MỘT TẤM ẢNH           ← chỗ này app thiếu
 *
 * Bước 2 rơi vào bộ bắt file nhị phân và trả "không đọc thành chữ được", nên
 * model kết luận nó "không có tool chụp màn hình" — trong khi thứ thiếu là
 * khả năng ĐỌC tấm ảnh đã nằm sẵn trên đĩa.
 *
 * Phép kiểm này dựng PNG THẬT bằng byte (không nhờ thư viện), rồi đối chứng
 * bằng một file nhị phân KHÔNG phải ảnh — thiếu vế đối chứng thì một hàm
 * "cái gì cũng trả về ảnh" vẫn qua được bài kiểm.
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('electron', () => ({ app: { getPath: () => tmpdir(), isPackaged: false } }));

const goc = mkdtempSync(path.join(tmpdir(), 'docanh-'));

/** PNG hợp lệ dựng bằng tay: w×h, toàn một màu. */
function pngThat(w: number, h: number): Buffer {
  const raw = Buffer.concat(
    Array.from({ length: h }, () => Buffer.concat([
      Buffer.from([0]), Buffer.from(Array.from({ length: w * 3 }, (_, i) => [220, 40, 40][i % 3]!)),
    ])),
  );
  const khoi = (ten: string, d: Buffer): Buffer => {
    const than = Buffer.concat([Buffer.from(ten), d]);
    const len = Buffer.alloc(4); len.writeUInt32BE(d.length);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(than) >>> 0);
    return Buffer.concat([len, than, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    khoi('IHDR', ihdr), khoi('IDAT', zlib.deflateSync(raw)), khoi('IEND', Buffer.alloc(0)),
  ]);
}

let chay: (ten: string, args: Record<string, unknown>) => Promise<any>;

beforeAll(async () => {
  const m = await import('./tools');
  chay = (ten, args) => m.chayToolAgent(goc, ten, args);
  writeFileSync(path.join(goc, 'man.png'), pngThat(200, 120));
  writeFileSync(path.join(goc, 'CHU.PNG'), pngThat(8, 8));       // đuôi VIẾT HOA
  /* Nhị phân THẬT: byte 0x80–0xFF đứng một mình là chuỗi UTF-8 KHÔNG hợp lệ
     ⇒ đọc 'utf8' ra U+FFFD ⇒ bộ bắt nhị phân thấy. Lần đầu tôi dùng
     `Buffer.alloc(3000, 7)` và phép kiểm ĐỎ: 0x07 là ký tự điều khiển UTF-8
     HỢP LỆ, nên nó đọc ra chữ thật. Dữ liệu thử sai, không phải mã sai — và
     nếu tôi chỉ nhìn màu đỏ rồi nới bộ bắt nhị phân thì đã hỏng đúng thứ
     đang chạy tốt. */
  writeFileSync(path.join(goc, 'rac.bin'), Buffer.from(
    Array.from({ length: 3000 }, (_, i) => 0x80 + (i % 0x7f)),
  ));
  writeFileSync(path.join(goc, 'ma.ts'), 'const a = 1;\n');
});

describe('read_file với ảnh', () => {
  it('PNG trả về KHỐI ẢNH, không phải chữ', async () => {
    const r = await chay('read_file', { path: 'man.png' });
    expect(r.anh?.[0]?.media_type).toBe('image/png');
    // base64 phải giải ngược ra đúng chữ ký PNG — chuỗi rỗng hay chữ thường
    // cũng "có anh[0]", nên phải kiểm tới byte.
    const b = Buffer.from(r.anh[0].data, 'base64');
    expect([...b.subarray(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
  });

  it('đuôi VIẾT HOA vẫn nhận', async () => {
    const r = await chay('read_file', { path: 'CHU.PNG' });
    expect(r.anh?.[0]?.media_type).toBe('image/png');
  });

  it('ĐỐI CHỨNG: nhị phân KHÔNG phải ảnh vẫn báo đúng lý do', async () => {
    const r = await chay('read_file', { path: 'rac.bin' });
    expect(r.anh).toBeUndefined();
    expect(r.noiDung).toContain('nhị phân');
  });

  it('ĐỐI CHỨNG: file chữ vẫn ra chữ có đánh số dòng', async () => {
    const r = await chay('read_file', { path: 'ma.ts' });
    expect(r.anh).toBeUndefined();
    expect(r.noiDung).toContain('1\tconst a = 1;');
  });
});
