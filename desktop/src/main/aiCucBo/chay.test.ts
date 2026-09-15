/**
 * Bật/tắt máy chủ AI trên máy người dùng.
 *
 * Phép kiểm ở đây KHÔNG tải llama.cpp thật — nó dựng lại đúng hai cấu trúc gói
 * đã QUAN SÁT ĐƯỢC (macOS có thư mục bọc, Windows phẳng) và một tệp chạy giả
 * đóng vai `llama-server`. Vì thứ cần chốt là logic của app: tìm đúng tệp,
 * chờ đúng lúc, chết thì nói vì sao.
 *
 * Cấu trúc gói là số liệu thật, lấy bằng `tar -tzf` và `unzip -l` ngày
 * 15/09/2026 trên chính hai gói b10976:
 *
 *     macOS   llama-b10976/llama-server      (có thư mục bọc)
 *     Windows llama-server.exe               (PHẲNG, không bọc)
 */
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { LoiChay, bat, daCoTron, tat, tenLlamaServer, timTep, trangThai, xinCong } from './chay';

async function thuMucTam(): Promise<string> {
  return mkdtemp(join(tmpdir(), 'aichay-'));
}

afterEach(async () => { await tat(); });

describe('tìm tệp chạy trong gói', () => {
  it('gói macOS/Linux — tệp nằm trong thư mục bọc', async () => {
    const g = await thuMucTam();
    await mkdir(join(g, 'llama-b10976'), { recursive: true });
    await writeFile(join(g, 'llama-b10976', 'llama-server'), '#!/bin/sh\n');
    expect(await timTep(g, 'llama-server')).toBe(join(g, 'llama-b10976', 'llama-server'));
    await rm(g, { recursive: true, force: true });
  });

  it('gói Windows — tệp nằm PHẲNG ở mức trên cùng', async () => {
    const g = await thuMucTam();
    await writeFile(join(g, 'llama-server.exe'), 'x');
    await writeFile(join(g, 'ggml-base.dll'), 'x');
    expect(await timTep(g, 'llama-server.exe')).toBe(join(g, 'llama-server.exe'));
    await rm(g, { recursive: true, force: true });
  });

  it('không có thì trả null, không ném', async () => {
    const g = await thuMucTam();
    expect(await timTep(g, 'llama-server')).toBeNull();
    expect(await timTep(join(g, 'khong-ton-tai'), 'llama-server')).toBeNull();
    await rm(g, { recursive: true, force: true });
  });

  it('không đào sâu vô hạn — cây lồng sâu vẫn dừng', async () => {
    const g = await thuMucTam();
    const sau = join(g, 'a', 'b', 'c', 'd', 'e', 'f');
    await mkdir(sau, { recursive: true });
    await writeFile(join(sau, 'llama-server'), 'x');
    expect(await timTep(g, 'llama-server')).toBeNull();
    await rm(g, { recursive: true, force: true });
  });

  it('tên tệp chạy đổi theo hệ', () => {
    expect(tenLlamaServer('win32')).toBe('llama-server.exe');
    expect(tenLlamaServer('darwin')).toBe('llama-server');
    expect(tenLlamaServer('linux')).toBe('llama-server');
  });
});

describe('xin cổng', () => {
  it('trả cổng dùng được, và hai lần gọi không trùng nhau', async () => {
    const a = await xinCong();
    const b = await xinCong();
    expect(a).toBeGreaterThan(1024);
    expect(b).toBeGreaterThan(1024);
  });
});

describe('bật máy chủ', () => {
  /**
   * Tệp chạy giả: dựng một máy chủ HTTP trả `/health` giống llama-server.
   * `doiGiay` để giả lập việc nạp model lâu.
   */
  async function lamTepGia(g: string, kich: { doiGiay?: number; chetNgay?: boolean }): Promise<string> {
    const p = join(g, 'llama-server');
    const than = kich.chetNgay
      ? 'console.error("không đủ bộ nhớ để nạp model"); process.exit(1);'
      : `
const http=require('http');
const cong=Number(process.argv[process.argv.indexOf('--port')+1]);
setTimeout(()=>{
  http.createServer((q,s)=>{s.writeHead(200,{'Content-Type':'application/json'});s.end('{"status":"ok"}');})
      .listen(cong,'127.0.0.1');
}, ${(kich.doiGiay ?? 0) * 1000});
setInterval(()=>{},1000);`;
    await writeFile(p, `#!/usr/bin/env node\n${than}\n`);
    await chmod(p, 0o755);
    return p;
  }

  it('chỉ trả về KHI /health đã ok, không phải khi spawn xong', async () => {
    const g = await thuMucTam();
    const tep = await lamTepGia(g, { doiGiay: 2 });
    const t0 = Date.now();
    const kq = await bat({
      duongLlamaServer: tep, duongModel: join(g, 'x.gguf'), maModel: 'vua', coGpu: true,
    });
    /* Nếu nó trả về ngay lúc spawn thì lượt chat đầu tiên của người dùng sẽ
       ăn lỗi kết nối — đúng lỗi mà phép kiểm này chặn. */
    expect(Date.now() - t0).toBeGreaterThanOrEqual(1800);
    expect(kq.goc).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
    expect(trangThai()?.maModel).toBe('vua');
    await tat();
    expect(trangThai()).toBeNull();
    await rm(g, { recursive: true, force: true });
  }, 30_000);

  it('chết lúc khởi động ⇒ báo LÝ DO THẬT, không nuốt thành câu cố định', async () => {
    const g = await thuMucTam();
    const tep = await lamTepGia(g, { chetNgay: true });
    await expect(bat({
      duongLlamaServer: tep, duongModel: join(g, 'x.gguf'), maModel: 'vua', coGpu: true,
    })).rejects.toThrow(LoiChay);
    /* Lý do phải đi kèm — [[feedback_dung_nuot_loi_thanh_cau_co_dinh]]. */
    await expect(bat({
      duongLlamaServer: tep, duongModel: join(g, 'x.gguf'), maModel: 'vua', coGpu: true,
    })).rejects.toThrow(/không đủ bộ nhớ/);
    await rm(g, { recursive: true, force: true });
  }, 30_000);

  it('tệp chạy KHÔNG TỒN TẠI ⇒ vẫn báo lỗi (spawn không ném)', async () => {
    const g = await thuMucTam();
    await expect(bat({
      duongLlamaServer: join(g, 'khong-co-that'),
      duongModel: join(g, 'x.gguf'), maModel: 'vua', coGpu: true,
    })).rejects.toThrow(LoiChay);
    await rm(g, { recursive: true, force: true });
  }, 30_000);

  it('bật lại CÙNG model ⇒ dùng lại, không dựng tiến trình mới', async () => {
    const g = await thuMucTam();
    const tep = await lamTepGia(g, {});
    const a = await bat({
      duongLlamaServer: tep, duongModel: join(g, 'x.gguf'), maModel: 'vua', coGpu: true,
    });
    const b = await bat({
      duongLlamaServer: tep, duongModel: join(g, 'x.gguf'), maModel: 'vua', coGpu: true,
    });
    expect(b.cong).toBe(a.cong);
    await tat();
    await rm(g, { recursive: true, force: true });
  }, 30_000);

  it('bật model KHÁC ⇒ tắt cái cũ rồi mới bật, không chạy hai cái cùng lúc', async () => {
    const g = await thuMucTam();
    const tep = await lamTepGia(g, {});
    const a = await bat({
      duongLlamaServer: tep, duongModel: join(g, 'x.gguf'), maModel: 'vua', coGpu: true,
    });
    const b = await bat({
      duongLlamaServer: tep, duongModel: join(g, 'y.gguf'), maModel: 'nho', coGpu: true,
    });
    expect(b.cong).not.toBe(a.cong);
    expect(trangThai()?.maModel).toBe('nho');
    /* Cổng cũ phải im — hai model 2,5 GB cùng sống là hết RAM tức khắc. */
    await expect(fetch(`http://127.0.0.1:${a.cong}/health`, { signal: AbortSignal.timeout(1500) }))
      .rejects.toThrow();
    await tat();
    await rm(g, { recursive: true, force: true });
  }, 40_000);

  it('tắt khi chưa chạy ⇒ không ném', async () => {
    await expect(tat()).resolves.toBeUndefined();
  });
});

describe('kiểm tệp đã tải trọn', () => {
  it('cỡ khớp ⇒ đúng; lệch nhiều ⇒ sai; không có ⇒ sai', async () => {
    const g = await thuMucTam();
    const p = join(g, 'm.gguf');
    await writeFile(p, Buffer.alloc(10_000));
    expect(await daCoTron(p, 10_000)).toBe(true);
    expect(await daCoTron(p, 10_100)).toBe(true); // lệch 1% — chấp nhận
    expect(await daCoTron(p, 20_000)).toBe(false);
    expect(await daCoTron(join(g, 'khong-co'), 10_000)).toBe(false);
    /* Thư mục trùng tên KHÔNG được tính là tệp đã tải xong. */
    await mkdir(join(g, 'thuMuc'));
    expect(await daCoTron(join(g, 'thuMuc'), 0)).toBe(false);
    await rm(g, { recursive: true, force: true });
  });
});
