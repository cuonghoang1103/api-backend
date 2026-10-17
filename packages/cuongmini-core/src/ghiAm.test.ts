/**
 * Test module ghi âm — KHÔNG BAO GIỜ thu micro thật (sẽ bật hộp hỏi quyền micro lên màn hình).
 * Phần dựng lệnh/script test thuần; vòng đời phiên ghi test bằng "máy ghi giả" (node -e);
 * JXA chỉ biên dịch bằng osacompile + chạy chế độ `chiThu` (bỏ qua hẳn AVFoundation).
 *
 * Chạy: npx tsx --test packages/cuongmini-core/src/ghiAm.test.ts   (từ gốc repo)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as http from 'node:http';
import * as os from 'node:os';
import * as path from 'node:path';
import type { AddressInfo } from 'node:net';
import {
  chayLenhGhi,
  chuoiJs,
  dungDanhSachLenhGhi,
  dungLenhGhi,
  loiKhuyenCaiDat,
  LoiQuyenMicro,
  LOI_MIC_MACOS,
  nhanDang,
  scriptJxa,
  scriptPowerShell,
  timLenhCoSan,
  type LenhGhi,
} from './ghiAm';

const DUONG_KHO = '/Users/Nguyễn Văn Cường/Thư mục có dấu cách/cuongmini-ghi-abc';
const laMac = process.platform === 'darwin';

async function thuMucTam(): Promise<string> {
  return fsp.mkdtemp(path.join(os.tmpdir(), 'cuongmini-ghi-'));
}

// ─── Chọn công cụ ───────────────────────────────────────────────────────────

test('macOS: ffmpeg > rec (sox) > JXA; không có gì vẫn còn JXA', () => {
  const du = dungDanhSachLenhGhi('darwin', new Set(['ffmpeg', 'rec']), DUONG_KHO, 90);
  assert.deepEqual(du.map((l) => l.cach), ['ffmpeg', 'sox', 'jxa']);
  assert.deepEqual(dungDanhSachLenhGhi('darwin', new Set(['rec']), DUONG_KHO).map((l) => l.cach), ['sox', 'jxa']);
  const chiJxa = dungLenhGhi('darwin', new Set(), DUONG_KHO);
  assert.equal(chiJxa?.cach, 'jxa');
  assert.equal(chiJxa?.lenh, 'osascript');
  assert.equal(chiJxa?.cachDung, 'fileCo');

  const ff = du[0];
  const i = ff.doiSo.indexOf('-f');
  assert.deepEqual(ff.doiSo.slice(i, i + 4), ['-f', 'avfoundation', '-i', ':default']);
  assert.ok(ff.doiSo.join(' ').includes('-ac 1 -ar 16000'));
  assert.equal(ff.doiSo[ff.doiSo.indexOf('-t') + 1], '90');
  assert.equal(ff.cachDung, 'q');
  assert.equal(du[1].cachDung, 'sigint');
  assert.deepEqual(du[1].doiSo.slice(-3), ['trim', '0', '90']);
});

test('Map từ timLenhCoSan ⇒ dùng đường dẫn tuyệt đối', () => {
  const l = dungLenhGhi('darwin', new Map([['ffmpeg', '/opt/homebrew/bin/ffmpeg']]), DUONG_KHO);
  assert.equal(l?.lenh, '/opt/homebrew/bin/ffmpeg');
});

test('Linux: arecord > parecord > ffmpeg (pulse khi có pactl, không thì alsa); rỗng ⇒ null + lời khuyên apt', () => {
  const du = dungDanhSachLenhGhi('linux', new Set(['arecord', 'parecord', 'ffmpeg', 'pactl']), DUONG_KHO, 30);
  assert.deepEqual(du.map((l) => l.cach), ['arecord', 'parecord', 'ffmpeg']);
  assert.deepEqual(du[0].doiSo.slice(0, 9), ['-q', '-f', 'S16_LE', '-r', '16000', '-c', '1', '-t', 'wav']);
  assert.ok(du.slice(0, 2).every((l) => l.cachDung === 'sigint'));
  assert.ok(du[1].doiSo.includes('--channels=1') && du[1].doiSo.includes('--rate=16000'));
  assert.ok(du[2].doiSo.join(' ').includes('-f pulse -i default'));

  const alsa = dungLenhGhi('linux', new Set(['ffmpeg']), DUONG_KHO);
  assert.ok(alsa?.doiSo.join(' ').includes('-f alsa -i default'));

  assert.equal(dungLenhGhi('linux', new Set(), DUONG_KHO), null);
  assert.match(loiKhuyenCaiDat('linux'), /sudo apt install alsa-utils/);
  assert.match(loiKhuyenCaiDat('darwin'), /Privacy & Security › Microphone/);
});

test('Đường có dấu cách + dấu tiếng Việt đi NGUYÊN VẸN thành một đối số (không qua shell)', () => {
  for (const nt of ['darwin', 'linux'] as const) {
    for (const l of dungDanhSachLenhGhi(nt, new Set(['ffmpeg', 'rec', 'arecord', 'parecord']), DUONG_KHO)) {
      assert.equal(path.dirname(l.file.duong), DUONG_KHO);
      if (l.cach === 'jxa') assert.equal(l.doiSo.at(-1), path.join(DUONG_KHO, 'ghi.js'));
      else assert.ok(l.doiSo.includes(l.file.duong), `${l.cach} thiếu đường file`);
    }
  }
});

// ─── Windows / PowerShell ───────────────────────────────────────────────────

test('Windows: PowerShell + winmm qua stdin, đường file đi qua biến môi trường', () => {
  const kho = 'C:\\Users\\Cường Hoàng\\AppData\\Local\\Temp\\cuongmini-ghi-x1';
  const l = dungLenhGhi('win32', new Set(['powershell']), kho, 45) as LenhGhi;
  assert.equal(l.cach, 'powershell');
  assert.deepEqual(l.doiSo, ['-NoProfile', '-NonInteractive', '-Command', '-']);
  assert.equal(l.env?.CUONGMINI_GHI_DUONG, kho + '\\ghi-am.wav');
  assert.equal(l.env?.CUONGMINI_GHI_CO, kho + '\\dung.co');
  assert.equal(l.fileCo, kho + '\\dung.co');
  assert.equal(l.env?.CUONGMINI_GHI_TRAN, '45');
  assert.equal(l.file.mime, 'audio/wav');

  const s = l.stdin as string;
  // Thuần ASCII: stdin của powershell.exe đọc theo bảng mã OEM ⇒ ký tự có dấu sẽ hỏng.
  assert.ok(/^[\x00-\x7f]*$/.test(s), 'script phải thuần ASCII');
  assert.ok(s.includes('$fileCo = $env:CUONGMINI_GHI_CO'));
  assert.ok(s.includes('Test-Path -LiteralPath $fileCo'));
  assert.ok(s.includes('$duong = $env:CUONGMINI_GHI_DUONG'));
  assert.ok(s.includes('winmm.dll'));
  for (const c of ['open new Type waveaudio Alias cmrec', 'bitspersample 16 channels 1 samplespersec 16000', 'record cmrec', 'save cmrec', 'close cmrec']) {
    assert.ok(s.includes(c), `thiếu lệnh MCI: ${c}`);
  }
  // Mỗi câu lệnh một dòng: dòng trống giữa chừng làm `-Command -` hiểu sai khối.
  const dong = s.split('\r\n');
  assert.ok(dong.slice(0, -1).every((d) => d.trim().length > 0), 'không được có dòng trống giữa script');
  // Ngoặc nhọn cân trên từng dòng ⇒ không dòng nào mở khối kéo sang dòng sau.
  for (const d of dong) {
    const mo = (d.match(/\{/g) ?? []).length;
    const dongNgoac = (d.match(/\}/g) ?? []).length;
    assert.equal(mo, dongNgoac, `dòng mở khối dở: ${d.slice(0, 60)}`);
  }
  assert.equal(scriptPowerShell(), s);

  const pwsh = dungLenhGhi('win32', new Map([['pwsh', 'C:\\Program Files\\PowerShell\\7\\pwsh.exe']]), kho);
  assert.equal(pwsh?.lenh, 'C:\\Program Files\\PowerShell\\7\\pwsh.exe');
  assert.equal(dungLenhGhi('win32', new Set(), kho)?.lenh, 'powershell.exe');
});

// ─── JXA ────────────────────────────────────────────────────────────────────

test('JXA: chuỗi đường dẫn thuần ASCII, giải ra đúng đường gốc', () => {
  const l = dungLenhGhi('darwin', new Set(), DUONG_KHO) as LenhGhi;
  const s = l.fileScript!.noiDung;
  assert.ok(/^[\x00-\x7f]*$/.test(s), 'script JXA phải thuần ASCII');
  const lay = (ten: string) => JSON.parse(new RegExp(`var ${ten} = (".*?");\\n`).exec(s)![1]);
  assert.equal(lay('FILE_CO'), path.join(DUONG_KHO, 'dung.co'));
  assert.equal(lay('DUONG'), l.file.duong);
  assert.equal(l.fileCo, path.join(DUONG_KHO, 'dung.co'));
  assert.match(s, /var TRAN_GIAY = 120;/);
  assert.match(s, /var CHI_THU = false;/);
  assert.ok(s.includes('rec.stop'));
  assert.ok(s.includes("if (!rec.record) thoat(3"));
  assert.equal(chuoiJs('a"b\\c'), '"a\\"b\\\\c"');
});

test('JXA biên dịch được bằng osacompile (chỉ biên dịch, không chạy)', { skip: !laMac }, async () => {
  const kho = await thuMucTam();
  try {
    const nguon = path.join(kho, 'ghi thử có dấu.js');
    await fsp.writeFile(nguon, scriptJxa(path.join(kho, 'Âm thanh "lạ".wav'), path.join(kho, "cờ 'x'.co"), 120));
    const r = spawnSync('osacompile', ['-l', 'JavaScript', '-o', path.join(kho, 'ra.scpt'), nguon], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    // Script hỏng cú pháp phải bị bắt — chứng minh phép kiểm này có răng.
    await fsp.writeFile(nguon, scriptJxa('/x', '/y', 1) + '\nvar = ;');
    const hong = spawnSync('osacompile', ['-l', 'JavaScript', '-o', path.join(kho, 'ra2.scpt'), nguon], { encoding: 'utf8' });
    assert.notEqual(hong.status, 0);
  } finally {
    await fsp.rm(kho, { recursive: true, force: true });
  }
});

test('JXA chế độ chiThu chạy thật osascript: dừng khi có file cờ, và tự dừng khi quá trần', { skip: !laMac }, async () => {
  const kho = await thuMucTam();
  try {
    const co = path.join(kho, 'cờ dừng.co');
    const nguon = path.join(kho, 'thu.js');
    await fsp.writeFile(nguon, scriptJxa(path.join(kho, 'x.wav'), co, 30, true));
    const t0 = Date.now();
    const con = spawn('osascript', ['-l', 'JavaScript', nguon]);
    setTimeout(() => fs.writeFileSync(co, ''), 600);
    const ma = await new Promise<number | null>((r) => con.on('close', r));
    assert.equal(ma, 0);
    assert.ok(Date.now() - t0 < 8000, 'phải thoát ngay sau khi có cờ, không chờ đủ 30 s');

    await fsp.writeFile(nguon, scriptJxa(path.join(kho, 'x.wav'), path.join(kho, 'khong-co.co'), 1, true));
    const t1 = Date.now();
    const ma2 = spawnSync('osascript', ['-l', 'JavaScript', nguon]).status;
    assert.equal(ma2, 0);
    assert.ok(Date.now() - t1 >= 900, 'phải chờ đủ trần 1 s');
  } finally {
    await fsp.rm(kho, { recursive: true, force: true });
  }
});

// ─── Dò PATH ────────────────────────────────────────────────────────────────

test('timLenhCoSan: tìm file chạy được trong PATH, bỏ file không có quyền chạy', async () => {
  const a = await thuMucTam();
  const b = await thuMucTam();
  try {
    await fsp.writeFile(path.join(a, 'ffmpeg'), '');           // không +x ⇒ bỏ
    await fsp.writeFile(path.join(b, 'ffmpeg'), '', { mode: 0o755 });
    await fsp.writeFile(path.join(b, 'arecord'), '', { mode: 0o755 });
    const thay = timLenhCoSan('linux', { PATH: [a, b].join(':') });
    assert.equal(thay.get('ffmpeg'), path.join(b, 'ffmpeg'));
    assert.equal(thay.get('arecord'), path.join(b, 'arecord'));
    assert.equal(thay.has('parecord'), false);

    await fsp.writeFile(path.join(a, 'powershell.exe'), '');
    const win = timLenhCoSan('win32', { PATH: a, PATHEXT: '.COM;.EXE' });
    assert.ok(win.get('powershell')?.endsWith('powershell.exe'));
  } finally {
    await fsp.rm(a, { recursive: true, force: true });
    await fsp.rm(b, { recursive: true, force: true });
  }
});

// ─── Vòng đời phiên ghi bằng máy ghi giả (không đụng micro) ────────────────

function mayGhiGia(kho: string, cachDung: LenhGhi['cachDung'], hanhVi: string, soByte = 4096): LenhGhi {
  const duong = path.join(kho, 'ghi-am.wav');
  const fileCo = path.join(kho, 'dung.co');
  const ghi = `require('fs').writeFileSync(process.argv[1], Buffer.alloc(${soByte}, 1))`;
  const ma: Record<string, string> = {
    q: `process.stdin.on('data', d => { if (String(d).includes('q')) { ${ghi}; process.exit(0); } }); setInterval(() => {}, 1000);`,
    sigint: `process.on('SIGINT', () => { ${ghi}; process.exit(130); }); setInterval(() => {}, 1000);`,
    fileCo: `const fs = require('fs'); const t = setInterval(() => { if (fs.existsSync(process.argv[2])) { clearInterval(t); ${ghi}; process.exit(0); } }, 50);`,
    chetNgay: `process.stderr.write('Unknown input format: avfoundation\\n'); process.exit(1);`,
    tuChet: `setTimeout(() => { ${ghi}; process.exit(0); }, 900);`,
    ma3: `setTimeout(() => process.exit(3), 900);`,
  };
  return {
    cach: cachDung === 'fileCo' ? 'jxa' : 'ffmpeg',
    lenh: process.execPath,
    doiSo: ['-e', ma[hanhVi], duong, fileCo],
    cachDung,
    fileCo: cachDung === 'fileCo' ? fileCo : undefined,
    file: { duong, mime: 'audio/wav', ten: 'ghi-am.wav' },
  };
}

for (const cach of ['q', 'sigint', 'fileCo'] as const) {
  test(`phiên ghi giả dừng gọn bằng '${cach}' và trả file`, async () => {
    const kho = await thuMucTam();
    const phien = await chayLenhGhi(mayGhiGia(kho, cach, cach), kho, 60);
    const f = await phien.dung();
    assert.equal(f.duong, path.join(kho, 'ghi-am.wav'));
    assert.equal(f.mime, 'audio/wav');
    assert.equal((await fsp.stat(f.duong)).size, 4096);
    await fsp.rm(kho, { recursive: true, force: true });
  });
}

test('file < 1 KB ⇒ "Không thu được tiếng" và thư mục tạm bị xoá', async () => {
  const kho = await thuMucTam();
  const phien = await chayLenhGhi(mayGhiGia(kho, 'q', 'q', 200), kho, 60);
  await assert.rejects(phien.dung(), /Không thu được tiếng — kiểm tra micro/);
  assert.equal(fs.existsSync(kho), false);
});

test('lệnh không tồn tại (spawn phát ENOENT, không ném) ⇒ chayLenhGhi ném', async () => {
  const kho = await thuMucTam();
  const l = { ...mayGhiGia(kho, 'q', 'q'), lenh: 'khong-co-lenh-nay-cuongmini' };
  await assert.rejects(chayLenhGhi(l, kho), /không có lệnh khong-co-lenh-nay-cuongmini/);
  await fsp.rm(kho, { recursive: true, force: true });
});

test('công cụ chết ngay khi bật ⇒ ném kèm stderr (để thử cách kế)', async () => {
  const kho = await thuMucTam();
  await assert.rejects(chayLenhGhi(mayGhiGia(kho, 'q', 'chetNgay'), kho), /Unknown input format/);
  await fsp.rm(kho, { recursive: true, force: true });
});

test('JXA thoát mã 3 ⇒ LoiQuyenMicro với hướng dẫn mở Privacy & Security', async () => {
  const kho = await thuMucTam();
  const phien = await chayLenhGhi(mayGhiGia(kho, 'fileCo', 'ma3'), kho);
  await assert.rejects(phien.dung(), (e: unknown) => e instanceof LoiQuyenMicro && e.message === LOI_MIC_MACOS);
  assert.match(LOI_MIC_MACOS, /System Settings › Privacy & Security › Microphone/);
});

test('công cụ tự dừng (hết trần) rồi dung() vẫn trả file', async () => {
  const kho = await thuMucTam();
  const phien = await chayLenhGhi(mayGhiGia(kho, 'sigint', 'tuChet'), kho, 60);
  await new Promise((r) => setTimeout(r, 1200));
  const f = await phien.dung();
  assert.equal((await fsp.stat(f.duong)).size, 4096);
  await fsp.rm(kho, { recursive: true, force: true });
});

test('trần tranGiay phía Node tự gửi lệnh dừng', async () => {
  const kho = await thuMucTam();
  const phien = await chayLenhGhi(mayGhiGia(kho, 'fileCo', 'fileCo'), kho, 1);
  await new Promise((r) => setTimeout(r, 1500));
  assert.ok(fs.existsSync(path.join(kho, 'dung.co')), 'quá trần phải tạo file cờ');
  const f = await phien.dung();
  assert.ok(fs.existsSync(f.duong));
  await fsp.rm(kho, { recursive: true, force: true });
});

test('huy() dừng tiến trình và xoá thư mục tạm', async () => {
  const kho = await thuMucTam();
  const phien = await chayLenhGhi(mayGhiGia(kho, 'sigint', 'sigint'), kho, 60);
  phien.huy();
  for (let i = 0; i < 40 && fs.existsSync(kho); i++) await new Promise((r) => setTimeout(r, 50));
  assert.equal(fs.existsSync(kho), false);
});

// ─── nhanDang với máy chủ giả ───────────────────────────────────────────────

interface YeuCauNhan {
  url?: string;
  auth?: string;
  audio?: { ten: string; kieu: string; byte: number };
  language?: string;
}

async function mayChuGia(traLoi: (y: YeuCauNhan) => { ma: number; than: unknown }) {
  const nhan: YeuCauNhan[] = [];
  const sv = http.createServer(async (req, res) => {
    const manh: Buffer[] = [];
    for await (const m of req) manh.push(m as Buffer);
    const fd = await new Response(Buffer.concat(manh), { headers: { 'content-type': String(req.headers['content-type']) } }).formData();
    const a = fd.get('audio') as File | null;
    const y: YeuCauNhan = {
      url: req.url,
      auth: req.headers.authorization,
      audio: a ? { ten: a.name, kieu: a.type, byte: a.size } : undefined,
      language: fd.get('language') as string,
    };
    nhan.push(y);
    const { ma, than } = traLoi(y);
    res.writeHead(ma, { 'content-type': 'application/json' }).end(JSON.stringify(than));
  });
  await new Promise<void>((r) => sv.listen(0, '127.0.0.1', r));
  const origin = `http://127.0.0.1:${(sv.address() as AddressInfo).port}`;
  return { origin, nhan, dong: () => new Promise<void>((r) => sv.close(() => r())) };
}

async function fileGia() {
  const kho = await thuMucTam();
  const duong = path.join(kho, 'ghi-am.wav');
  await fsp.writeFile(duong, Buffer.alloc(3000, 7));
  return { kho, file: { duong, mime: 'audio/wav', ten: 'ghi-am.wav' } };
}

test('nhanDang gửi multipart audio + language + Bearer, trả text, xoá thư mục tạm', async () => {
  const sv = await mayChuGia(() => ({ ma: 200, than: { success: true, data: { text: '  xin chào CuongMini ', heard: true } } }));
  try {
    const { kho, file } = await fileGia();
    const chu = await nhanDang(file, { apiOrigin: sv.origin + '/', token: 'tk-123', ngonNgu: 'en' });
    assert.equal(chu, 'xin chào CuongMini');
    const y = sv.nhan[0];
    assert.equal(y.url, '/api/v1/ai/stt');
    assert.equal(y.auth, 'Bearer tk-123');
    assert.deepEqual(y.audio, { ten: 'ghi-am.wav', kieu: 'audio/wav', byte: 3000 });
    assert.equal(y.language, 'en');
    assert.equal(fs.existsSync(kho), false);
  } finally {
    await sv.dong();
  }
});

test('nhanDang: không token ⇒ không header; mặc định language=vi; heard=false ⇒ chuỗi rỗng', async () => {
  const sv = await mayChuGia(() => ({ ma: 200, than: { success: true, message: 'no-speech', data: { text: '', heard: false, reason: 'quá ngắn' } } }));
  try {
    const { kho, file } = await fileGia();
    assert.equal(await nhanDang(file, { apiOrigin: sv.origin, token: null }), '');
    assert.equal(sv.nhan[0].auth, undefined);
    assert.equal(sv.nhan[0].language, 'vi');
    assert.equal(fs.existsSync(kho), false);
  } finally {
    await sv.dong();
  }
});

test('nhanDang: HTTP 502 ⇒ ném lỗi tiếng Việt kèm message máy chủ, vẫn xoá thư mục tạm', async () => {
  const sv = await mayChuGia(() => ({ ma: 502, than: { success: false, message: 'Không nghe được đoạn ghi âm', code: 'STT_FAILED' } }));
  try {
    const { kho, file } = await fileGia();
    await assert.rejects(nhanDang(file, { apiOrigin: sv.origin }), /HTTP 502\): Không nghe được đoạn ghi âm/);
    assert.equal(fs.existsSync(kho), false);
  } finally {
    await sv.dong();
  }
});

test('nhanDang: máy chủ không với tới ⇒ lỗi tiếng Việt', async () => {
  const { kho, file } = await fileGia();
  await assert.rejects(nhanDang(file, { apiOrigin: 'http://127.0.0.1:9' }), /Không gửi được ghi âm lên máy chủ/);
  assert.equal(fs.existsSync(kho), false);
});
