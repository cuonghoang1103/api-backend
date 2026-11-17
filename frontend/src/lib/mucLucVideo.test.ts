/**
 * Mục lục video + mốc bấm được trong câu trả lời gia sư (17/11/2026).
 *
 * Chỗ hỏng đắt nhất: `khoaCacheDoan` ở web lệch bản máy chủ ⇒ máy chủ bỏ cache của MỌI chip theo chương mà không báo
 * gì (vẫn trả lời, chỉ tốn một lượt model mỗi lần bấm). Nên kiểm cùng một đầu vào ra cùng một chuỗi với bản máy chủ.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  chiSoDangXem, denCua, doanCuaPhan, doanQuanhGiay, HOI_NHANH_DOAN, khoaCacheDoan, mocDoan, nhanDoan, cauTrongDoan,
} from './mucLucVideo';
import { giayTuURL, themLienKet } from './mocThoiGian';
import { khoaCacheDoan as khoaMayChu, docDoanHoi } from '../../../src/services/video/phuDeRieng';

const PARTS = [
  { t: 0, den: 98.79, ten: 'Mở đầu · bài này học gì' },
  { t: 98.79, den: 179.84, ten: 'Bức thư HTTP' },
  { t: 179.84, ten: 'Chạy thật: tấm gương' },
];

describe('mục lục video', () => {
  it('chương đang phát theo giây; trước chương đầu ⇒ -1', () => {
    assert.equal(chiSoDangXem(PARTS, 0), 0);
    assert.equal(chiSoDangXem(PARTS, 98.6), 1, 'dung sai 0,25 s cho mốc vừa tua tới');
    assert.equal(chiSoDangXem(PARTS, 500), 2);
    assert.equal(chiSoDangXem([{ t: 5, ten: 'x' }], 1), -1);
    assert.equal(chiSoDangXem(PARTS, null), -1);
  });

  it('chương cuối không có `den` ⇒ hết video', () => {
    assert.equal(denCua(PARTS, 2, 718.48), 718.48);
    assert.equal(denCua(PARTS, 0, 718.48), 98.79);
  });

  it('khoá cache theo đoạn GIỐNG HỆT bản máy chủ (sau khi máy chủ đọc lại đoạn)', () => {
    for (let i = 0; i < PARTS.length; i++) {
      const d = doanCuaPhan(PARTS, i, 718.48);
      const quaMayChu = docDoanHoi(d)!;
      for (const k of HOI_NHANH_DOAN) {
        assert.equal(khoaCacheDoan(k.kieu, d), khoaMayChu(k.kieu, quaMayChu));
        assert.ok(`${khoaCacheDoan(k.kieu, d)}@vi`.length <= 30, 'máy chủ cắt khoá ở 30 ký tự trước vân tay');
      }
    }
  });

  it('đoạn đang xem: ±30 s, kẹp trong [0, thời lượng]', () => {
    assert.deepEqual(doanQuanhGiay(200.7, 718), { tu: 170, den: 230 });
    assert.deepEqual(doanQuanhGiay(10, 718), { tu: 0, den: 40 });
    assert.deepEqual(doanQuanhGiay(710, 718), { tu: 680, den: 718 });
  });

  it('nhãn + mốc đoạn; câu hỏi nhanh mang mốc bấm được', () => {
    const d = doanCuaPhan(PARTS, 1, 718.48);
    assert.equal(nhanDoan(d), '1:38 – 2:59');
    assert.equal(mocDoan(d), '[1:38 - 2:59]');
    const md = themLienKet(HOI_NHANH_DOAN[0].cau(d));
    assert.match(md, /\[1:38 - 2:59\]\(#tua-98\)/, "mốc làm tròn xuống giây — đúng giây hiện trên nhãn");
  });

  it('câu trong đoạn', () => {
    const cues = [{ t: 5, vi: 'a' }, { t: 99, vi: 'b' }, { t: 179, vi: 'c' }, { t: 180, vi: 'd' }];
    assert.deepEqual(cauTrongDoan(cues, doanCuaPhan(PARTS, 1, 718)).map((c) => c.vi), ['b', 'c']);
  });
});

describe('mốc bấm được trong câu trả lời', () => {
  it('[mm:ss] và khoảng ⇒ liên kết #tua-<giây>; trong khối mã thì KHÔNG', () => {
    const md = themLienKet('Ở [3:20] thầy nói; xem [1:02:03] và [2:19 - 4:05].\n```py\narr[1:23]\n```\n`x[0:10]`');
    assert.match(md, /\[3:20\]\(#tua-200\)/);
    assert.match(md, /\[1:02:03\]\(#tua-3723\)/);
    assert.match(md, /\[2:19 - 4:05\]\(#tua-139\)/);
    assert.match(md, /arr\[1:23\]\n/);
    assert.match(md, /`x\[0:10\]`/);
    assert.equal(giayTuURL('#tua-139'), 139);
    assert.equal(giayTuURL('https://x'), null);
  });
});
