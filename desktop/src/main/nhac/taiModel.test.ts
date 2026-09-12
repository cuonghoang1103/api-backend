/**
 * Kiểm bộ tải model bằng `fetch` giả.
 *
 * Tải 1,26 GB hỏng giữa chừng là kiểu lỗi tệ nhất trong cả tính năng này: tệp
 * cụt vẫn nằm đó trông như đã xong, và lần mở sau onnxruntime báo một lỗi phân
 * tích protobuf chẳng liên quan gì tới nguyên nhân. Những phép kiểm dưới đây
 * chốt đúng các cửa đó.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  KHO_MODEL, kiemVanTay, taiModel, thuMucModel, tinhTrangKho, xoaModel,
} from './taiModel';

const MA = 'htdemucs-vocals';
let goc = '';

beforeEach(async () => {
  goc = await fs.mkdtemp(path.join(os.tmpdir(), 'model-'));
});

afterEach(async () => {
  vi.unstubAllGlobals();
  await fs.rm(goc, { recursive: true, force: true });
});

/** `fetch` giả phát nội dung thành nhiều mẩu, như mạng thật. */
function fetchGia(noiDung: Uint8Array, opts: { khai?: number; ma?: number } = {}) {
  return vi.fn(async () => ({
    ok: (opts.ma ?? 200) < 400,
    status: opts.ma ?? 200,
    statusText: 'OK',
    headers: { get: (h: string) => (h === 'content-length' ? String(opts.khai ?? noiDung.length) : null) },
    body: (async function* () {
      for (let i = 0; i < noiDung.length; i += 7) yield noiDung.subarray(i, i + 7);
    })(),
  }));
}

const noiDungMau = () => Uint8Array.from({ length: 100 }, (_, i) => i % 251);

describe('kho model', () => {
  it('mỗi mục có đủ thông tin để hiện lên giao diện', () => {
    expect(KHO_MODEL.length).toBeGreaterThan(0);
    for (const m of KHO_MODEL) {
      expect(m.ma).toBeTruthy();
      expect(m.ten).toBeTruthy();
      expect(m.moTa.length).toBeGreaterThan(10);
      expect(m.url).toMatch(/^https:\/\//);
      expect(m.byte).toBeGreaterThan(0);
    }
  });

  it('mã model không trùng nhau', () => {
    expect(new Set(KHO_MODEL.map((m) => m.ma)).size).toBe(KHO_MODEL.length);
  });
});

describe('tình trạng kho', () => {
  it('thư mục chưa tồn tại thì báo chưa có gì, không nổ', async () => {
    const tt = await tinhTrangKho(goc);
    expect(tt.every((t) => !t.coRoi)).toBe(true);
  });

  it('thấy model đã tải', async () => {
    vi.stubGlobal('fetch', fetchGia(noiDungMau()));
    await taiModel(goc, MA);
    const tt = await tinhTrangKho(goc);
    expect(tt.find((t) => t.ma === MA)?.coRoi).toBe(true);
  });
});

describe('tải model', () => {
  it('ghi đúng nội dung và ghi kèm vân tay', async () => {
    const nd = noiDungMau();
    vi.stubGlobal('fetch', fetchGia(nd));
    const duong = await taiModel(goc, MA);

    expect(Buffer.from(await fs.readFile(duong))).toEqual(Buffer.from(nd));
    const vanTay = await fs.readFile(path.join(thuMucModel(goc), `${MA}.sha256`), 'utf8');
    expect(vanTay).toBe(createHash('sha256').update(nd).digest('hex'));
  });

  it('báo tiến độ tăng dần tới đủ', async () => {
    const nd = noiDungMau();
    vi.stubGlobal('fetch', fetchGia(nd));
    const moc: number[] = [];
    await taiModel(goc, MA, { tienDo: (t) => moc.push(t.daNhan) });

    expect(moc[moc.length - 1]).toBe(nd.length);
    for (let i = 1; i < moc.length; i++) expect(moc[i]!).toBeGreaterThan(moc[i - 1]!);
  });

  it('đã có sẵn thì KHÔNG tải lại', async () => {
    const f = fetchGia(noiDungMau());
    vi.stubGlobal('fetch', f);
    await taiModel(goc, MA);
    await taiModel(goc, MA);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('⛔ hai lời gọi cùng lúc chỉ tải MỘT lần — không giẫm lên cùng tệp .part', async () => {
    const f = fetchGia(noiDungMau());
    vi.stubGlobal('fetch', f);
    const [a, b] = await Promise.all([taiModel(goc, MA), taiModel(goc, MA)]);
    expect(a).toBe(b);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('⛔ tải thiếu byte thì XOÁ tệp tạm và báo lỗi, không để lại tệp cụt', async () => {
    // Máy chủ khai 500 byte nhưng chỉ gửi 100.
    vi.stubGlobal('fetch', fetchGia(noiDungMau(), { khai: 500 }));
    await expect(taiModel(goc, MA)).rejects.toThrow(/nhận 100 byte, máy chủ khai 500/);

    const conLai = await fs.readdir(thuMucModel(goc)).catch(() => []);
    expect(conLai.filter((f) => f.endsWith('.part'))).toEqual([]);
    expect(conLai.filter((f) => f.endsWith('.onnx'))).toEqual([]);
  });

  it('⛔ HTTP lỗi thì báo kèm mã và URL', async () => {
    vi.stubGlobal('fetch', fetchGia(new Uint8Array(0), { ma: 404 }));
    await expect(taiModel(goc, MA)).rejects.toThrow(/HTTP 404/);
  });

  it('model lạ thì báo lỗi', async () => {
    await expect(taiModel(goc, 'khong-co')).rejects.toThrow(/Không biết model/);
  });
});

describe('vân tay', () => {
  it('tệp nguyên vẹn ⇒ khớp', async () => {
    vi.stubGlobal('fetch', fetchGia(noiDungMau()));
    await taiModel(goc, MA);
    expect(await kiemVanTay(goc, MA)).toBe(true);
  });

  it('⛔ tệp bị sửa một byte ⇒ phát hiện ra', async () => {
    vi.stubGlobal('fetch', fetchGia(noiDungMau()));
    const duong = await taiModel(goc, MA);
    const hong = Buffer.from(await fs.readFile(duong));
    hong[50] = hong[50]! ^ 0xff;
    await fs.writeFile(duong, hong);
    expect(await kiemVanTay(goc, MA)).toBe(false);
  });
});

describe('xoá model', () => {
  it('xoá cả tệp model lẫn vân tay', async () => {
    vi.stubGlobal('fetch', fetchGia(noiDungMau()));
    await taiModel(goc, MA);
    await xoaModel(goc, MA);
    expect((await tinhTrangKho(goc)).find((t) => t.ma === MA)?.coRoi).toBe(false);
    expect(await fs.readdir(thuMucModel(goc))).toEqual([]);
  });

  it('xoá thứ chưa có thì im lặng, không nổ', async () => {
    await expect(xoaModel(goc, MA)).resolves.toBeUndefined();
  });
});
