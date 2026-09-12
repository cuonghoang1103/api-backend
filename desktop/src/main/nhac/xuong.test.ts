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
  banGiao, chinhVaXuat, donDep, donDepTatCa, dsBaiTrongKho, dungMashup,
  masterTheoMau, napBai, napBanMau, phanTich, soPhienDangMo, tenAnToan, xuatTep,
} from './xuong';
import { ghiWav } from './wav';

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

describe('master theo bản mẫu', () => {
  /** PCM stereo của một "bài" có phổ định trước. */
  function pcmPho(giay: number, phan: Array<[number, number]>): Uint8Array {
    const n = Math.round(giay * FS);
    const f = new Float32Array(n * 2);
    for (const [hz, a] of phan) {
      for (let i = 0; i < n; i++) {
        const v = a * Math.sin((2 * Math.PI * hz * i) / FS);
        f[i * 2] = f[i * 2]! + v;
        f[i * 2 + 1] = f[i * 2 + 1]! + v * 0.9;
      }
    }
    return new Uint8Array(f.buffer);
  }

  const duc: Array<[number, number]> = [[80, 0.30], [1000, 0.05], [6000, 0.01]];
  const sang: Array<[number, number]> = [[80, 0.10], [1000, 0.18], [6000, 0.16]];

  it('nạp bản mẫu rồi trả tóm tắt đo được', async () => {
    const b = await napBai(goc, 'cua-toi.wav', pcmPho(3, duc), 2, FS);
    const tt = napBanMau(b.id, 'tilo.mp3', pcmPho(3, sang), 2, FS);
    expect(tt.ten).toBe('tilo.mp3');
    expect(Number.isFinite(tt.lufs)).toBe(true);
    expect(tt.rongStereo).toBeGreaterThan(0);
  });

  it('⛔ chưa nạp bản mẫu thì nói rõ phải làm gì', async () => {
    const b = await napBai(goc, 'cua-toi.wav', pcmPho(2, duc), 2, FS);
    await expect(masterTheoMau(goc, b.id)).rejects.toThrow(/Chưa nạp bản mẫu/);
  });

  it('⭐ master xong thì chênh lệch với bản mẫu GIẢM đi', async () => {
    const b = await napBai(goc, 'cua-toi.wav', pcmPho(3, duc), 2, FS);
    napBanMau(b.id, 'tilo.mp3', pcmPho(3, sang), 2, FS);
    const kq = await masterTheoMau(goc, b.id);

    // Đây là câu hỏi thật của tính năng, và cũng chính là phần "chấm bài":
    // danh sách nhận xét phải NGẮN đi sau khi master.
    expect(kq.chamTruoc.length).toBeGreaterThan(0);
    expect(kq.chamSau.length).toBeLessThan(kq.chamTruoc.length);
  });

  it('ghi ra tệp và giữ đỉnh dưới trần', async () => {
    const b = await napBai(goc, 'Bài Của Tôi.wav', pcmPho(3, duc), 2, FS);
    napBanMau(b.id, 'tilo.mp3', pcmPho(3, sang), 2, FS);
    const kq = await masterTheoMau(goc, b.id, { tranDbtp: -1 });

    expect(path.basename(kq.duong)).toContain('master');
    expect((await fs.stat(kq.duong)).size).toBeGreaterThan(0);
    expect(kq.dinhThatSau).toBeLessThanOrEqual(-1 + 0.25);
  });

  it('báo cả mức to trước và sau', async () => {
    const b = await napBai(goc, 'cua-toi.wav', pcmPho(3, duc), 2, FS);
    napBanMau(b.id, 'tilo.mp3', pcmPho(3, sang), 2, FS);
    const kq = await masterTheoMau(goc, b.id);
    expect(Number.isFinite(kq.lufsTruoc)).toBe(true);
    expect(Number.isFinite(kq.lufsSau)).toBe(true);
    expect(kq.tenBanMau).toBe('tilo.mp3');
  });

  it('⛔ bản mẫu sai tần số mẫu thì từ chối', async () => {
    const b = await napBai(goc, 'cua-toi.wav', pcmPho(2, duc), 2, FS);
    expect(() => napBanMau(b.id, 'x.mp3', pcmPho(2, sang), 2, 48000))
      .toThrow(/44100 Hz/);
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

describe('xuất tệp theo định dạng đã chọn', () => {
  /** Một WAV float thật trên đĩa — đúng thứ mọi bước của xưởng đẻ ra. */
  async function nguon(ten = 'ban tron.wav'): Promise<string> {
    const n = FS;
    const l = new Float32Array(n);
    const r = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      l[i] = 0.4 * Math.sin((2 * Math.PI * 220 * i) / FS);
      r[i] = 0.4 * Math.sin((2 * Math.PI * 330 * i) / FS);
    }
    const d = path.join(goc, ten);
    await fs.writeFile(d, Buffer.from(ghiWav({ kenh: [l, r], tanSoMau: FS })));
    return d;
  }

  it('⭐ ghi ra tệp MP3 THẬT cạnh bản gốc, và bản gốc còn nguyên', async () => {
    const g = await nguon();
    const truoc = (await fs.stat(g)).size;
    const kq = await xuatTep(g, { dinhDang: 'mp3', kbps: 320 });

    expect(kq.ten).toBe('ban tron.mp3');
    expect(kq.moTa).toBe('MP3 320 kbps');
    const b = await fs.readFile(kq.duong);
    expect(b[0]).toBe(0xff);
    expect(kq.byte).toBe(b.length);
    /* Bản WAV float là thứ master/xuất-stem/trộn-lại đọc vào. Đè nó là cắt cụt
       đường làm việc, và người dùng chỉ biết ở bước sau. */
    expect((await fs.stat(g)).size).toBe(truoc);
  });

  it('⭐ xuất WAV từ nguồn WAV thì KHÔNG đè lên chính nó', async () => {
    /* Đuôi trùng nhau ⇒ đường đích trùng đường nguồn. Không chặn thì ta ghi
       bản 16-bit đè lên bản float, tức là làm hỏng đúng cái tệp gốc — im lặng,
       và không lấy lại được. */
    const g = await nguon();
    const kq = await xuatTep(g, { dinhDang: 'wav16' });
    expect(kq.duong).not.toBe(g);
    expect(kq.ten).toContain('WAV 16-bit');
    await expect(fs.stat(g)).resolves.toBeTruthy();
    await expect(fs.stat(kq.duong)).resolves.toBeTruthy();
  });

  it('FLAC ra tệp có chữ ký đúng và nhỏ hơn nguồn float', async () => {
    const g = await nguon();
    const kq = await xuatTep(g, { dinhDang: 'flac', bit: 16 });
    const b = await fs.readFile(kq.duong);
    expect(b.subarray(0, 4).toString('latin1')).toBe('fLaC');
    expect(kq.byte).toBeLessThan((await fs.stat(g)).size);
  });

  it('⭐ bản giao mang ĐÚNG đuôi và MIME của định dạng đã chọn', async () => {
    /* Giao một khối MP3 mang tên `.wav` thì máy chủ lưu sai đuôi và bàn DJ tải
       về một tệp không mở nổi — mà mọi bước trước đó đều xanh. */
    const g = await nguon();
    const bg = await banGiao(g, { dinhDang: 'mp3', kbps: 192 });
    expect(bg.ten).toBe('ban tron.mp3');
    expect(bg.mime).toBe('audio/mpeg');
    expect(bg.byte[0]).toBe(0xff);
    expect(bg.giay).toBeCloseTo(1, 2);
  });

  it('bản giao mặc định vẫn là WAV 16-bit như trước', async () => {
    const bg = await banGiao(await nguon());
    expect(bg.ten).toBe('ban tron.wav');
    expect(bg.mime).toBe('audio/wav');
  });
});

describe('dựng mashup từ nhiều bài', () => {
  it('⭐ hai bài KHÁC NHỊP ghép được, và tệp ra dài đúng như đã xếp', async () => {
    /* Đây là phép kiểm end-to-end duy nhất của cả đường mashup: nạp thật, đo
       thật, kéo thật, ghi thật. `dung.test.ts` chốt phần tính; chỗ này chốt
       phần đọc tệp, gom nguồn, và ghi ra đĩa — ba thứ mà phần tính không chạm
       tới và cũng là ba thứ dễ sai đường dẫn nhất. */
    const a = await napBai(goc, 'bai-a.wav', pcmThu(4), 2, FS);
    const b = await napBai(goc, 'bai-b.wav', pcmThu(4), 2, FS);

    const kq = await dungMashup(goc, {
      bpm: 140,
      chuAm: null,
      manh: [
        { id: 'm1', baiId: a.id, nguon: 'goc', tuGiay: 0, denGiay: 2, datGiay: 0,
          gainDb: 0, vaoGiay: 0, raGiay: 0.5 },
        { id: 'm2', baiId: b.id, nguon: 'goc', tuGiay: 1, denGiay: 3, datGiay: 1.5,
          gainDb: -3, vaoGiay: 0.5, raGiay: 0 },
      ],
    }, { ten: 'thu mashup' });

    expect(kq.daDung).toEqual(['m1', 'm2']);
    expect(kq.boQua).toEqual([]);
    expect(kq.ten).toContain('140BPM');
    /* Mảnh 2 đặt ở 1,5s, dài 2s ở nhịp gốc rồi kéo về 140 — nên tổng phải
       dài hơn 1,5s và ngắn hơn 4s. Kiểm khoảng chứ không kiểm con số chính
       xác: nhịp gốc do máy dò ra, và chốt cứng nó là chốt vào phép dò chứ
       không vào bộ dựng. */
    expect(kq.daiGiay).toBeGreaterThan(1.5);
    expect(kq.daiGiay).toBeLessThan(4.5);
    await expect(fs.stat(kq.duong)).resolves.toBeTruthy();

    await donDep(goc, a.id);
    await donDep(goc, b.id);
  });

  it('⭐ tệp ra là WAV ĐỌC LẠI ĐƯỢC, không phải một đống byte', async () => {
    const a = await napBai(goc, 'x.wav', pcmThu(3), 2, FS);
    const kq = await dungMashup(goc, {
      bpm: 128, chuAm: null,
      manh: [{ id: 'm', baiId: a.id, nguon: 'goc', tuGiay: 0, denGiay: 2, datGiay: 0,
               gainDb: 0, vaoGiay: 0.2, raGiay: 0.2 }],
    });
    const bg = await banGiao(kq.duong);
    expect(bg.giay).toBeGreaterThan(1);
    expect(kq.dinhThat).toBeLessThanOrEqual(0);
    await donDep(goc, a.id);
  });

  it('mảnh trỏ vào stem chưa tách thì bị bỏ kèm lý do, không ném', async () => {
    const a = await napBai(goc, 'y.wav', pcmThu(3), 2, FS);
    const bd = {
      bpm: 128, chuAm: null,
      manh: [
        { id: 'ok', baiId: a.id, nguon: 'goc', tuGiay: 0, denGiay: 1, datGiay: 0,
          gainDb: 0, vaoGiay: 0, raGiay: 0 },
        { id: 'hong', baiId: a.id, nguon: 'drums', tuGiay: 0, denGiay: 1, datGiay: 1,
          gainDb: 0, vaoGiay: 0, raGiay: 0 },
      ],
    };
    const kq = await dungMashup(goc, bd);
    expect(kq.daDung).toEqual(['ok']);
    expect(kq.boQua.map((x) => x.id)).toEqual(['hong']);
    await donDep(goc, a.id);
  });

  it('bản dựng rỗng thì NÉM với câu nói rõ, không ghi tệp rỗng', async () => {
    await expect(dungMashup(goc, { bpm: 128, chuAm: null, manh: [] }))
      .rejects.toThrow(/chưa có mảnh nào/);
  });

  it('không mảnh nào dựng được thì NÉM kèm lý do của từng mảnh', async () => {
    await expect(dungMashup(goc, {
      bpm: 128, chuAm: null,
      manh: [{ id: 'z', baiId: 'khong-ton-tai', nguon: 'goc', tuGiay: 0, denGiay: 1,
               datGiay: 0, gainDb: 0, vaoGiay: 0, raGiay: 0 }],
    })).rejects.toThrow(/Không mảnh nào dựng được/);
  });

  it('⭐ kho bài liệt kê ĐỦ nhịp và tông — thiếu là mảnh dài sai', async () => {
    const a = await napBai(goc, 'kho-a.wav', pcmThu(3), 2, FS);
    const ds = await dsBaiTrongKho();
    /* Bảng phiên sống trong bộ nhớ và các phép kiểm trước để lại phiên trỏ
       vào thư mục tạm đã xoá. Danh sách vẫn phải trả về bài LÀNH — hỏng một
       mà mất tất là chế độ hỏng tệ nhất của một cái kho. */
    const m = ds.find((x) => x.id === a.id);
    expect(m).toBeTruthy();
    expect(m!.bpm).toBeGreaterThan(0);
    expect(m!.tong).toBeTruthy();
    /* Chưa tách thì chỉ có `goc`; bày thêm đường không tồn tại là mời người
       dùng dựng một mảnh chắc chắn bị bỏ. */
    expect(m!.duong).toEqual(['goc']);
    await donDep(goc, a.id);
  });

  it('⭐ phiên MẤT TỆP GỐC bị gỡ khỏi kho chứ không làm hỏng cả danh sách', async () => {
    const a = await napBai(goc, 'sap-mat.wav', pcmThu(3), 2, FS);
    const b = await napBai(goc, 'con-song.wav', pcmThu(3), 2, FS);
    /* Xoá tệp gốc của một bài — đúng thứ xảy ra khi người dùng dọn thư mục
       tạm, hoặc một cửa sổ khác đóng bài. */
    await fs.rm(path.join(goc, 'nhac', 'phien', a.id, 'goc.wav'), { force: true });

    const ds = await dsBaiTrongKho();
    expect(ds.some((x) => x.id === b.id)).toBe(true);
    expect(ds.some((x) => x.id === a.id)).toBe(false);
    /* Và lần gọi sau nó không còn phải thử lại nữa. */
    expect((await dsBaiTrongKho()).some((x) => x.id === a.id)).toBe(false);
    await donDep(goc, b.id);
  });
});
