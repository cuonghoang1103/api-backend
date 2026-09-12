/**
 * Kiểm lớp chống BỊA SỐ của AI kèm cặp Xưởng Remix.
 *
 * Vì sao đây là phép kiểm đáng viết nhất của tệp dịch vụ đó: một câu như "hạ
 * 3 dB ở 200 Hz" nghe cực kỳ chuyên nghiệp, và người dùng sẽ làm theo — kể cả
 * khi bảng đo chưa từng có con số nào ở 200 Hz. Kho này đã có tiền lệ đúng
 * kiểu ấy (`eval:cv-fabrication` sinh ra vì AI bịa chỉ số trong bản mổ CV).
 *
 * `kiemBia` KHÔNG chặn câu trả lời — nó đánh dấu, và giao diện nhắc người dùng
 * đối chiếu. Nên phép kiểm ở đây quan tâm hai thứ: nó có bắt được số bịa
 * không, và nó có im lặng với những con số vô hại không (dương tính giả nhiều
 * quá thì người dùng học cách bỏ qua cảnh báo, và lúc đó nó vô dụng).
 */
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { dsSoDo, kiemBia, type YeuCauKem } from './xuongRemix.service.js';

const BAI = {
  ten: 'Bài thử',
  giay: 254,
  bpm: 139.8,
  bpmTinCay: 0.72,
  tong: 'Am',
  tongCamelot: '8A',
  tongTinCay: 0.18,
  lufs: -9.4,
  dinhThat: 0.8,
  daiDong: 9.2,
  rongStereo: 0.31,
  dai: { '63': -14.2, '1000': -20.3, '8000': -31.5 },
};

const YC: YeuCauKem = { bai: BAI };

describe('danh sách số đo hợp lệ', () => {
  it('gom đủ nhịp, độ to, tần số dải và mức từng dải', () => {
    const ds = dsSoDo(YC);
    assert.ok(ds.has('139.8'), 'thiếu nhịp');
    assert.ok(ds.has('9.4') || ds.has('-9.4'), 'thiếu LUFS');
    assert.ok(ds.has('1000'), 'thiếu tần số dải');
    assert.ok(ds.has('20.3') || ds.has('-20.3'), 'thiếu mức dải');
  });

  it('gom cả số của bản mẫu khi có', () => {
    const ds = dsSoDo({ bai: BAI, banMau: { ...BAI, bpm: 128, lufs: -6.8 } });
    assert.ok(ds.has('128'));
    assert.ok(ds.has('6.8') || ds.has('-6.8'));
  });

  it('bỏ qua giá trị không hữu hạn thay vì nhét NaN vào tập', () => {
    const ds = dsSoDo({ bai: { ...BAI, lufs: -Infinity, daiDong: NaN } });
    assert.ok(!ds.has('NaN'));
    assert.ok(!ds.has('Infinity'));
  });
});

describe('bắt số bịa', () => {
  it('⭐ bắt được con số KHÔNG có trong bảng đo', () => {
    // 200 Hz và 3 dB đều không có ở đâu trong `BAI`.
    const la = kiemBia('Hạ 3 dB ở 200 Hz để bớt đục.', dsSoDo(YC));
    assert.ok(la.includes('200'), `phải bắt được 200, nhận ${JSON.stringify(la)}`);
  });

  it('im lặng với con số CÓ trong bảng đo', () => {
    const la = kiemBia(
      'Bài đang ở 139.8 BPM, độ to -9.4 LUFS. Dải 8000 Hz đang -31.5 dB.',
      dsSoDo(YC),
    );
    assert.deepEqual(la, []);
  });

  it('⛔ bỏ qua số nhỏ — chúng là số thứ tự, nửa cung, ô nhịp chứ không phải số đo', () => {
    /* Không có luật này thì mọi câu trả lời đều đầy cảnh báo giả ("bước 1",
       "4 ô nhịp", "3 stem"), và người dùng học cách bỏ qua cảnh báo — lúc đó
       lớp chặn này vô dụng đúng vào lần nó cần lên tiếng. */
    const la = kiemBia('Bước 1: dựng 4 ô nhịp. Bước 2: tách 4 stem, dịch lên 2 nửa cung.', dsSoDo(YC));
    assert.deepEqual(la, []);
  });

  it('đọc được cả dấu phẩy thập phân kiểu Việt', () => {
    // "139,8" và "139.8" là cùng một con số; bắt nhầm nó là dương tính giả.
    assert.deepEqual(kiemBia('Bài ở 139,8 BPM.', dsSoDo(YC)), []);
  });

  it('không báo trùng một con số nhiều lần', () => {
    const la = kiemBia('Ở 200 Hz và cả 200 Hz nữa.', dsSoDo(YC));
    assert.equal(la.filter((x) => x === '200').length, 1);
  });

  it('câu trả lời không có số nào thì sạch', () => {
    assert.deepEqual(kiemBia('Nghe lại phần trầm bằng tai trước đã.', dsSoDo(YC)), []);
  });

  it('bắt được nhiều số bịa cùng lúc', () => {
    const la = kiemBia('Cắt 120 Hz, nâng 3500 Hz, nén tỉ lệ 400.', dsSoDo(YC));
    assert.ok(la.includes('120'));
    assert.ok(la.includes('3500'));
    assert.ok(la.includes('400'));
  });
});
