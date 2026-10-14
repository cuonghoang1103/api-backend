import { test } from 'node:test';
import assert from 'node:assert/strict';
import { docDanhSachTu, kiemTuAnh } from './kiemTuAnh.js';

const dung = (nghe: string, tu: string, nhan?: string[]) => kiemTuAnh(nghe, [{ tu, nhan }])[0].dung;

test('nhận đúng thuật ngữ khi Whisper viết chính tả tiếng Anh, kể cả bị tách từ', () => {
  assert.equal(dung('Muốn có biến nhớ giá trị, ta gọi useState.', 'useState'), true);
  assert.equal(dung('ta gọi use state', 'useState'), true);
  assert.equal(dung('Cài NodeJS xong', 'Node.js'), true);
  assert.equal(dung('Cài Node JS xong', 'Node.js'), true);
  assert.equal(dung('chỉ cần một lệnh N.P.M.', 'npm'), true);
  assert.equal(dung('get element by ID tìm phần tử', 'getElementById'), true);
  assert.equal(dung('đổi object sang Jason', 'JSON', ['jason']), true);
  assert.equal(dung('dữ liệu từ cha gọi là prop', 'props'), true);
  assert.equal(dung('mỗi component', 'component'), true);
  assert.equal(dung('các components con', 'component'), true);
});

test('đọc kiểu phiên âm Việt thì KHÔNG được tính đúng', () => {
  assert.equal(dung('ta gọi diu xtết', 'useState'), false);
  assert.equal(dung('cài nốt chấm di ét xong', 'Node.js'), false);
  assert.equal(dung('công cụ vít rất nhanh', 'Vite', ['veet', 'vit']), false);
  assert.equal(dung('một cái com pô nừn', 'component'), false);
});

test('không khớp nhầm thuật ngữ nằm lọt trong từ khác', () => {
  // "state" chỉ có trong "usestate" khi đã ghép — từ đơn "state" thì không
  // có trong câu nghe được này.
  assert.equal(dung('ta gọi useState', 'state'), false);
  assert.equal(dung('JavaScript chạy trong trình duyệt', 'script'), false);
});

test('docDanhSachTu chặn dữ liệu rác và giới hạn kích thước', () => {
  assert.deepEqual(docDanhSachTu('không phải json'), []);
  assert.deepEqual(docDanhSachTu('{"tu":"x"}'), []);
  assert.deepEqual(docDanhSachTu(JSON.stringify([{ tu: 'JSON', nhan: ['jason', 5] }, 'React', { tu: '' }])), [
    { tu: 'JSON', nhan: ['jason'] },
    { tu: 'React' },
  ]);
  assert.equal(docDanhSachTu(Array.from({ length: 50 }, (_, i) => `t${i}`)).length, 12);
});
