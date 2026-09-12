/**
 * Kiểm lớp quản phiên: nạp bài, đo, chỉnh nhịp/tông, xuất bộ tệp.
 *
 * Phần đáng canh nhất ở đây là `tenAnToan`. Mọi tên tệp khác trong Xưởng Remix
 * đều do main sinh bằng `randomUUID`, nên renderer không với tới được. Tên thư
 * mục xuất là NGOẠI LỆ DUY NHẤT: nó dựng từ tên tệp người dùng thả vào. Thủng
 * ở đây là ghi được ra bất cứ đâu trên đĩa.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  chinhVaXuat, donDep, donDepTatCa, napBai, phanTich, soPhienDangMo, tenAnToan,
} from './xuong';

const FS = 44100;
let goc = '';

beforeEach(async () => {
  goc = await fs.mkdtemp(path.join(os.tmpdir(), 'xuong-'));
});
afterEach(async () => {
  await fs.rm(goc, { recursive: true, force: true });
});

/** PCM stereo xen kẽ: một nốt La cộng tiếng gõ đều 140 BPM. */
function pcmThu(giay = 3): Uint8Array {
  const n = Math.round(giay * FS);
  const f = new Float32Array(n * 2);
  const buocGo = (60 / 140) * FS;
  for (let i = 0; i < n; i++) {
    let v = 0.3 * Math.sin((2 * Math.PI * 220 * i) / FS);
    const tuGo = i % buocGo;
    if (tuGo < 400) v += 0.5 * Math.exp(-tuGo / 90) * (Math.sin(i * 12.9898) % 1);
    f[i * 2] = v;
    f[i * 2 + 1] = v * 0.95;
  }
  return new Uint8Array(f.buffer);
}

describe('tên an toàn', () => {
  it('giữ nguyên chữ có dấu tiếng Việt', () => {
    // Tên bài là thứ người dùng đọc để tìm lại thư mục — bỏ dấu làm họ khó tìm.
    expect(tenAnToan('Nắng Ấm Xa Dần.mp3')).toBe('Nắng Ấm Xa Dần');
  });

  it('bỏ đuôi tệp', () => {
    expect(tenAnToan('bai.flac')).toBe('bai');
    expect(tenAnToan('bai.m4a')).toBe('bai');
  });

  it('⛔ chặn mọi đường đi ngược thư mục', () => {
    for (const xau of ['../../../etc/passwd', '..\\..\\Windows\\System32', '....//....//x']) {
      const ra = tenAnToan(xau);
      expect(ra).not.toContain('..');
      expect(ra).not.toContain('/');
      expect(ra).not.toContain('\\');
    }
  });

  it('⛔ bỏ ký tự cấm trên Windows', () => {
    const ra = tenAnToan('a:b*c?d"e<f>g|h');
    for (const c of [':', '*', '?', '"', '<', '>', '|']) expect(ra).not.toContain(c);
  });

  it('chuỗi rỗng hay toàn ký tự cấm vẫn ra tên dùng được', () => {
    expect(tenAnToan('')).toBe('bai-khong-ten');
    expect(tenAnToan('///')).toBe('bai-khong-ten');
    expect(tenAnToan('...')).toBe('bai-khong-ten');
  });

  it('cắt tên quá dài — hệ tệp có trần độ dài', () => {
    expect(tenAnToan('x'.repeat(500)).length).toBeLessThanOrEqual(80);
  });
});

describe('nạp bài', () => {
  it('ghi ra WAV tạm và trả về phiên', async () => {
    const b = await napBai(goc, 'thu.mp3', pcmThu(1), 2, FS);
    expect(b.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(b.soKenh).toBe(2);
    expect(b.giay).toBeCloseTo(1, 1);
    await expect(fs.stat(path.join(goc, 'nhac', 'phien', b.id, 'goc.wav'))).resolves.toBeTruthy();
  });

  it('⛔ sai tần số mẫu thì báo lỗi CHỈ RA cách sửa', async () => {
    await expect(napBai(goc, 'x.mp3', pcmThu(1), 2, 48000))
      .rejects.toThrow(/OfflineAudioContext/);
  });

  it('số kênh lạ thì từ chối', async () => {
    await expect(napBai(goc, 'x.mp3', pcmThu(1), 99, FS)).rejects.toThrow(/Số kênh lạ/);
  });

  it('bài rỗng thì từ chối', async () => {
    await expect(napBai(goc, 'x.mp3', new Uint8Array(0), 2, FS)).rejects.toThrow(/rỗng/);
  });
});

describe('phân tích', () => {
  it('dò ra nhịp quanh 140 và trả đủ số đo', async () => {
    const b = await napBai(goc, 'thu.mp3', pcmThu(6), 2, FS);
    const pt = await phanTich(b.id);
    expect(pt.bpm).toBeGreaterThan(130);
    expect(pt.bpm).toBeLessThan(150);
    expect(pt.tongCamelot).toMatch(/^(?:[1-9]|1[0-2])[AB]$/);
    expect(pt.ghep.length).toBeGreaterThan(0);
    expect(Number.isFinite(pt.do.lufs)).toBe(true);
  });

  it('gọi lần hai trả về CÙNG một đối tượng — không đo lại', async () => {
    const b = await napBai(goc, 'thu.mp3', pcmThu(3), 2, FS);
    expect(await phanTich(b.id)).toBe(await phanTich(b.id));
  });

  it('phiên không tồn tại thì báo lỗi đọc được', async () => {
    await expect(phanTich('00000000-0000-4000-8000-000000000000'))
      .rejects.toThrow(/không còn/);
  });
});

describe('chỉnh và xuất', () => {
  it('xuất đủ wav + midi + ghi chú', async () => {
    const b = await napBai(goc, 'Bài Thử.mp3', pcmThu(4), 2, FS);
    const kq = await chinhVaXuat(goc, b.id, { bpmDich: 140 });

    expect(kq.tep).toContain('goc.wav');
    expect(kq.tep).toContain('mau-vinahouse.mid');
    expect(kq.tep).toContain('doc-truoc-khi-keo.txt');
    for (const t of kq.tep) {
      expect((await fs.stat(path.join(kq.thuMuc, t))).size).toBeGreaterThan(0);
    }
  });

  it('tên thư mục nói rõ nhịp và tông', async () => {
    const b = await napBai(goc, 'Bài Thử.mp3', pcmThu(4), 2, FS);
    const kq = await chinhVaXuat(goc, b.id, { bpmDich: 140 });
    expect(path.basename(kq.thuMuc)).toContain('Bài Thử');
    expect(path.basename(kq.thuMuc)).toContain('140BPM');
  });

  it('ghi chú có cả nhịp, tông và cảnh báo tin cậy', async () => {
    const b = await napBai(goc, 'thu.mp3', pcmThu(4), 2, FS);
    const kq = await chinhVaXuat(goc, b.id, { bpmDich: 140 });
    const doc = await fs.readFile(path.join(kq.thuMuc, 'doc-truoc-khi-keo.txt'), 'utf8');
    expect(doc).toContain('Nhịp gốc');
    expect(doc).toContain('Camelot');
    expect(doc).toContain('140 BPM');
  });

  it('tệp MIDI xuất ra là SMF hợp lệ', async () => {
    const b = await napBai(goc, 'thu.mp3', pcmThu(4), 2, FS);
    const kq = await chinhVaXuat(goc, b.id, { bpmDich: 140 });
    const mid = await fs.readFile(path.join(kq.thuMuc, 'mau-vinahouse.mid'));
    expect(mid.subarray(0, 4).toString('ascii')).toBe('MThd');
    expect(mid.readUInt16BE(10)).toBe(1); // đúng một rãnh
  });

  it('kéo nhịp làm ĐỔI độ dài tệp xuất ra', async () => {
    const b = await napBai(goc, 'thu.mp3', pcmThu(4), 2, FS);
    const pt = await phanTich(b.id);
    // Kéo về một nhịp khác hẳn nhịp gốc rồi so kích thước tệp.
    const kq = await chinhVaXuat(goc, b.id, { bpmDich: Math.round(pt.bpm * 1.25) });
    const raKt = (await fs.stat(path.join(kq.thuMuc, 'goc.wav'))).size;
    const gocKt = (await fs.stat(path.join(goc, 'nhac', 'phien', b.id, 'goc.wav'))).size;
    expect(raKt).toBeLessThan(gocKt * 0.9);
  });

  it('⛔ tỉ lệ kéo quá xa thì từ chối và NÓI nhịp gốc là bao nhiêu', async () => {
    const b = await napBai(goc, 'thu.mp3', pcmThu(4), 2, FS);
    const pt = await phanTich(b.id);
    await expect(chinhVaXuat(goc, b.id, { bpmDich: Math.round(pt.bpm * 4) }))
      .rejects.toThrow(/Nhịp gốc dò ra/);
  });

  it('⛔ đổi tông quá 12 nửa cung thì từ chối', async () => {
    const b = await napBai(goc, 'thu.mp3', pcmThu(2), 2, FS);
    await expect(chinhVaXuat(goc, b.id, { nuaCung: 24 })).rejects.toThrow(/12 nửa cung/);
  });
});

describe('dọn dẹp', () => {
  it('đóng bài thì xoá sạch thư mục phiên', async () => {
    /* Đo mức GIẢM, không đo số tuyệt đối: bảng phiên là hằng tầm mô-đun, dùng
       chung cho cả tệp kiểm — và đó là đúng, vì phiên sống theo app chứ không
       theo từng phép kiểm. Kỳ vọng "bằng 0" là giả định sai về sự cô lập. */
    const truoc = soPhienDangMo();
    const b = await napBai(goc, 'thu.mp3', pcmThu(1), 2, FS);
    expect(soPhienDangMo()).toBe(truoc + 1);
    await donDep(goc, b.id);
    expect(soPhienDangMo()).toBe(truoc);
    await expect(fs.stat(path.join(goc, 'nhac', 'phien', b.id))).rejects.toThrow();
  });

  it('⛔ dọn lúc khởi động bỏ qua phiên ĐANG mở', async () => {
    const b = await napBai(goc, 'thu.mp3', pcmThu(1), 2, FS);
    await donDepTatCa(goc);
    // Phiên còn trong bộ nhớ thì tệp của nó phải còn — xoá là mất bài đang làm.
    await expect(fs.stat(path.join(goc, 'nhac', 'phien', b.id, 'goc.wav'))).resolves.toBeTruthy();
    await donDep(goc, b.id);
  });

  it('dọn khi chưa có gì thì trả 0, không nổ', async () => {
    await expect(donDepTatCa(goc)).resolves.toBe(0);
  });
});
