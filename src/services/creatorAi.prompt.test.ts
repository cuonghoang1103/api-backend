import test from 'node:test';
import assert from 'node:assert/strict';
import {
  bocJson,
  canhTuGoi,
  chuanHoaGoi,
  chuongYoutube,
  heThongGoiBaiGiang,
  khoiYeuCau,
  kichBanTuGoi,
  moTaYoutube,
  phutGoiY,
  tongGiay,
} from './creatorAi.prompt.js';

const THO = {
  tieuDe: ['Big-O trong 12 phút'],
  chuThumbnail: ['O(n) là gì?'],
  tomTat: 'Giải thích Big-O.',
  mucTieu: ['Đọc được Big-O của một vòng lặp'],
  chuanBi: ['Mở slide 0.3'],
  thietLap: { boCuc: 'Trung cảnh', anhSang: 'Đèn chính 45°', amThanh: 'Mic cài áo', manHinh: '1080p' },
  canh: [
    { ten: 'Câu hỏi mở', loai: 'HOOK', loi: 'Tại sao hai đoạn code cùng làm một việc mà một cái chạy mất cả phút?', khungHinh: 'CLOSEUP', giay: 12 },
    { ten: 'Bài này học gì', loai: 'INTRO', loi: 'Hôm nay mình sẽ đọc Big-O.', khungHinh: 'MEDIUM', giay: 20 },
    { ten: 'Vòng lặp lồng', loai: 'DEMO', loi: 'Nhìn vòng lặp này.', ma: 'for (i) { for (j) { x++; } } // --> n^2', khungHinh: 'màn hình', giay: 90, manHinh: 'IDE' },
    { ten: '', loai: 'lạ', loi: '', manHinh: '' }, // rỗng ⇒ bị bỏ
    { ten: 'Kết', loai: 'OUTRO', loi: 'Hẹn gặp bài sau.', khungHinh: 'MEDIUM' },
  ],
  cauHoi: [{ hoi: 'Hai vòng lặp lồng là O(?)', dapAn: 'O(n²)' }],
  youtube: { moTa: 'Big-O cho người mới.', the: ['#bigo', 'csd201'] },
  canBoSung: [],
};

test('bocJson đọc được JSON bọc rào ``` và có dấu phẩy thừa', () => {
  const o = bocJson<{ a: number[] }>('Đây:\n```json\n{"a":[1,2,],}\n```');
  assert.deepEqual(o, { a: [1, 2] });
  assert.throws(() => bocJson('không có gì'));
});

test('chuanHoaGoi bỏ cảnh rỗng, chuẩn hoá loại/khung, tính giây thiếu', () => {
  const g = chuanHoaGoi(THO);
  assert.equal(g.canh.length, 4);
  assert.equal(g.canh[2].khungHinh, 'SCREEN');
  assert.equal(g.canh[3].loai, 'OUTRO');
  assert.ok(g.canh[3].giay >= 5, 'cảnh thiếu giây phải được tính từ số từ');
  assert.deepEqual(g.youtube.the, ['bigo', 'csd201']);
  assert.equal(g.doDay, 'du');
  assert.throws(() => chuanHoaGoi({ canh: [] }));
});

test('kịch bản: mỗi cảnh một mục ##, chỉ dẫn nằm trong chú thích, code không phá chú thích', () => {
  const g = chuanHoaGoi(THO);
  const md = kichBanTuGoi(g, { lang: 'VI', nguon: 'CSD201 · Bài 0.3' });
  const muc = md.split('\n').filter((l) => /^##\s/.test(l));
  assert.equal(muc.length, 4);
  assert.match(muc[0], /^## 1 · Hook — Câu hỏi mở \(0:00–0:12\)$/);
  // Bỏ hết chú thích (như Teleprompter) ⇒ chỉ còn lời thoại + tiêu đề mục.
  const conLai = md.replace(/<!--[\s\S]*?-->/g, '').split('\n').map((l) => l.trim()).filter(Boolean);
  assert.ok(conLai.every((l) => l.startsWith('## ') || g.canh.some((c) => c.loi === l)), `lọt chỉ dẫn ra máy nhắc: ${conLai.join(' | ')}`);
  assert.ok(!md.includes('// --> n^2'), '`-->` trong code phải được vô hiệu');
});

test('cảnh DB: quay màn hình ⇒ lời đi voiceover, không có shotType', () => {
  const s = canhTuGoi(chuanHoaGoi(THO), 'VI');
  assert.equal(s[2].voiceover, 'Nhìn vòng lặp này.');
  assert.equal(s[2].dialogue, null);
  assert.equal(s[2].shotType, null);
  assert.equal(s[0].sceneType, 'HOOK');
  assert.equal(s[0].shotType, 'CLOSEUP');
  assert.ok(s.every((x) => (x.cameraAngle ?? '').length <= 200));
});

test('chương YouTube: bắt đầu 0:00, hook gộp vào giới thiệu, chương < 10s bị gộp', () => {
  const g = chuanHoaGoi(THO);
  const ch = chuongYoutube(g, 'VI');
  assert.equal(ch[0].moc, '0:00');
  assert.equal(ch[0].ten, 'Giới thiệu');
  assert.equal(ch[1].moc, '0:32');
  assert.equal(tongGiay(g), g.canh.reduce((s, c) => s + c.giay, 0));
  assert.match(moTaYoutube(g, 'VI'), /#bigo/);
});

test('lời dặn + yêu cầu nói đúng ngôn ngữ và ngân sách từ', () => {
  assert.match(heThongGoiBaiGiang('EN'), /TIẾNG ANH/);
  assert.match(khoiYeuCau({ lang: 'VI', phut: 10, phongCach: 'ket_hop' }), /1500 từ/);
  assert.equal(phutGoiY(500), 5);
  assert.equal(phutGoiY(20_000), 20);
});
