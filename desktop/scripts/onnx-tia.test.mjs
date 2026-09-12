/**
 * Kiểm móc `afterPack` tỉa nhị phân ONNX.
 *
 * Móc này chỉ chạy lúc đóng gói ba nền — tức là chỗ khó thử nhất trong cả dự
 * án, và cũng là chỗ hỏng đắt nhất: tỉa nhầm thì bản cài vẫn dựng xanh, vẫn
 * cài được, rồi Xưởng Remix báo "chưa cài được onnxruntime-node" trên máy
 * người dùng. Ở đây ta dựng một cây thư mục ĐÚNG HÌNH DẠNG mà
 * electron-builder tạo ra, chạy móc thật lên nó, rồi soi lại.
 */
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const { default: onnxTia } = createRequire(import.meta.url)('./onnx-tia.cjs');

/** Năm cặp nền × kiến trúc mà `onnxruntime-node@1.29.0` thật sự có. */
const THAT = [
  ['darwin', 'arm64'], ['linux', 'x64'], ['linux', 'arm64'],
  ['win32', 'x64'], ['win32', 'arm64'],
];

let tam;

/** Dựng cây `appOutDir` giống hệt thứ electron-builder đẻ ra. */
function dungCay(nen, capCo = THAT) {
  const goc = nen === 'darwin'
    ? path.join(tam, 'CuongThai.app', 'Contents', 'Resources', 'app.asar.unpacked')
    : path.join(tam, 'resources', 'app.asar.unpacked');
  for (const [n, a] of capCo) {
    const d = path.join(goc, 'node_modules', 'onnxruntime-node', 'bin', 'napi-v6', n, a);
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, 'onnxruntime_binding.node'), Buffer.alloc(1024));
    fs.writeFileSync(path.join(d, 'libonnxruntime.so'), Buffer.alloc(4096));
  }
  return path.join(goc, 'node_modules', 'onnxruntime-node', 'bin', 'napi-v6');
}

/** electron-builder truyền SỐ cho arch, không truyền chữ. */
const ARCH = { ia32: 0, x64: 1, arm64: 3, universal: 4 };

const boiCanh = (nen, arch) => ({
  appOutDir: tam,
  electronPlatformName: nen,
  arch: ARCH[arch],
  packager: { appInfo: { productFilename: 'CuongThai' } },
});

/** Những nhánh nền/kiến trúc còn sót lại sau khi tỉa. */
function conLai(napi) {
  if (!fs.existsSync(napi)) return [];
  const ra = [];
  for (const n of fs.readdirSync(napi).sort()) {
    for (const a of fs.readdirSync(path.join(napi, n)).sort()) ra.push(`${n}/${a}`);
  }
  return ra;
}

beforeEach(() => { tam = fs.mkdtempSync(path.join(os.tmpdir(), 'onnx-tia-')); });
afterEach(() => { fs.rmSync(tam, { recursive: true, force: true }); });

describe('tỉa theo nền đang dựng', () => {
  it('⭐ Linux x64 chỉ còn linux/x64', async () => {
    const napi = dungCay('linux');
    await onnxTia(boiCanh('linux', 'x64'));
    expect(conLai(napi)).toEqual(['linux/x64']);
  });

  it('⭐ macOS đọc đúng đường trong .app, không phải resources/', async () => {
    /* Sai đường ở đây thì móc không thấy gì. Đó là lý do "không thấy gì" được
       coi là LỖI chứ không phải trường hợp bỏ qua — xem phép kiểm cuối tệp. */
    const napi = dungCay('darwin');
    await onnxTia(boiCanh('darwin', 'arm64'));
    expect(conLai(napi)).toEqual(['darwin/arm64']);
  });

  it('Windows x64 bỏ luôn win32/arm64 — 69 MB không ai dùng tới', async () => {
    const napi = dungCay('win32');
    await onnxTia(boiCanh('win32', 'x64'));
    expect(conLai(napi)).toEqual(['win32/x64']);
  });

  it('bản universal của macOS giữ CẢ HAI kiến trúc', async () => {
    const napi = dungCay('darwin', [...THAT, ['darwin', 'x64']]);
    await onnxTia(boiCanh('darwin', 'universal'));
    expect(conLai(napi)).toEqual(['darwin/arm64', 'darwin/x64']);
  });
});

describe('những chỗ móc phải lên tiếng', () => {
  it('⭐ macOS Intel: KHÔNG ném lỗi, nhưng cũng không giữ lại gì', async () => {
    /* `onnxruntime-node@1.29` không còn nhị phân `darwin/x64`. Đó là chuyện
       của thượng nguồn, và chặn cả bản dựng vì nó thì tệ hơn — app đã lùi êm.
       Nhưng nó phải đi qua nhánh cảnh báo, không phải nhánh "xong việc". */
    const napi = dungCay('darwin');
    await expect(onnxTia(boiCanh('darwin', 'x64'))).resolves.toBeUndefined();
    expect(conLai(napi)).toEqual([]);
  });

  it('⭐ thiếu hẳn thư mục bin thì NÉM — asarUnpack đã hết khớp', async () => {
    /* Đây là chế độ hỏng nguy hiểm nhất: không có nhị phân nào trong bản cài,
       mà mọi bước dựng đều xanh. Phải chết ngay tại đây. */
    fs.mkdirSync(path.join(tam, 'resources', 'app.asar.unpacked'), { recursive: true });
    await expect(onnxTia(boiCanh('linux', 'x64'))).rejects.toThrow(/asarUnpack|không thấy/i);
  });

  it('⭐ có thư mục mà rỗng tệp .node thì cũng NÉM', async () => {
    const napi = dungCay('linux');
    for (const t of fs.readdirSync(path.join(napi, 'linux', 'x64'))) {
      if (t.endsWith('.node')) fs.rmSync(path.join(napi, 'linux', 'x64', t));
    }
    await expect(onnxTia(boiCanh('linux', 'x64'))).rejects.toThrow(/\.node/);
  });
});
