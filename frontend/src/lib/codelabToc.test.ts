/**
 * Mục lục Code Lab — nhóm chương / cấp độ, bài chưa làm đầu tiên, tìm nhanh:
 *   npx tsx --test frontend/src/lib/codelabToc.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  baiChuaLamDauTien, chuanHoaTim, dungMucLuc, duongBaiHoc, duongMucLuc, locMucLuc, moduleLanCan,
  soChuongCuaModule, soChuongTuSlug, tenBoSo, tenChuong, thongKeModule, type ModuleToc,
} from './codelabToc';

let nextId = 1;
const de = (difficulty: 'EASY' | 'MEDIUM' | 'HARD', estimatedMinutes: number | null = 8) => ({ id: nextId++, difficulty, estimatedMinutes });
const mod = (sortOrder: number, slug: string, name: string, level: ModuleToc['level'] = 'BEGINNER', n = 3): ModuleToc => ({
  id: 1000 + sortOrder, sortOrder, slug, name, level,
  exercises: Array.from({ length: n }, (_, i) => de(i === 0 ? 'EASY' : i === n - 1 ? 'HARD' : 'MEDIUM')),
});

// Đúng hình dạng track web-foundations-practice trên prod (tên "N.M …", slug wf-N-M-…).
const WF: ModuleToc[] = [
  mod(5, 'wf-3-1-css-basics', '3.1 CSS căn bản: bộ chọn, thuộc tính, xếp tầng'),
  mod(0, 'wf-2-1-html-basics', '2.1 HTML là gì: phần tử, thẻ, thuộc tính'),
  mod(1, 'wf-2-2-text-links-images', '2.2 Chữ, liên kết và ảnh'),
  mod(7, 'wf-3-3-flexbox', '3.3 Flexbox: xếp mọi thứ theo hàng hoặc cột'),
  mod(6, 'wf-3-2-box-model', '3.2 Box model: mọi phần tử là một cái hộp'),
];

describe('soChuongCuaModule', () => {
  it('đọc từ tên "N.M …"', () => {
    assert.equal(soChuongCuaModule({ name: '2.1 HTML là gì', slug: 'x' }), 2);
    assert.equal(soChuongCuaModule({ name: '12.3 Grid nâng cao', slug: 'x' }), 12);
  });
  it('track *-practice: lùi về slug khi tên không đánh số', () => {
    assert.equal(soChuongCuaModule({ name: 'Bài 16: Event handling', slug: 'fer202-6-ex16-event-handling' }, 'fer202-practice'), 6);
  });
  it('track thường: KHÔNG đọc slug (es6-modern-javascript không phải chương 6)', () => {
    assert.equal(soChuongCuaModule({ name: 'ES6+ Modern JavaScript', slug: 'es6-modern-javascript' }, 'javascript'), null);
    assert.equal(soChuongCuaModule({ name: 'Arrays', slug: 'web-3-arrays' }, 'javascript'), null);
  });
  it('soChuongTuSlug: bài slide N.0 ⇒ chương N', () => {
    assert.equal(soChuongTuSlug('wf-3-0-slides'), 3);
    assert.equal(soChuongTuSlug('javascript-fundamentals'), null);
  });
});

describe('dungMucLuc — track luyện tập ⇒ nhóm theo chương', () => {
  const ml = dungMucLuc('web-foundations-practice', WF);
  it('kiểu chương, chương tăng dần, tên chương lấy từ khoá', () => {
    assert.equal(ml.kieu, 'chuong');
    assert.deepEqual(ml.nhom.map((g) => g.so), [2, 3]);
    assert.equal(ml.nhom[0].ten, 'Chương 2 — HTML: cấu trúc của mọi trang web');
    assert.equal(ml.nhom[1].ten, 'Chương 3 — CSS & thiết kế responsive');
  });
  it('bài trong chương theo sortOrder; stt liên tục cả track', () => {
    assert.deepEqual(ml.nhom[1].dong.map((d) => d.module.slug), ['wf-3-1-css-basics', 'wf-3-2-box-model', 'wf-3-3-flexbox']);
    assert.deepEqual(ml.nhom.flatMap((g) => g.dong.map((d) => d.stt)), [1, 2, 3, 4, 5]);
    assert.equal(ml.nhom[1].dong[2].soBai, '3.3');
  });
  it('tổng số đề mỗi chương', () => {
    assert.equal(ml.nhom[0].soDe, 6);
    assert.equal(ml.nhom[1].soDe, 9);
  });
  it('chương không có tên trong bảng ⇒ "Chương N"', () => {
    assert.equal(tenChuong('khong-co-track', 7), 'Chương 7');
  });
});

describe('dungMucLuc — track thường', () => {
  it('cấp độ tăng dần ⇒ nhóm theo cấp độ, giữ thứ tự lộ trình', () => {
    const ml = dungMucLuc('react', [
      mod(0, 'react-basics', 'React Basics', 'BEGINNER'),
      mod(1, 'hooks', 'Hooks', 'INTERMEDIATE'),
      mod(2, 'state', 'State', 'INTERMEDIATE'),
      mod(3, 'perf', 'Performance', 'ADVANCED'),
    ]);
    assert.equal(ml.kieu, 'capdo');
    assert.deepEqual(ml.nhom.map((g) => g.ten), ['Cơ bản', 'Trung cấp', 'Nâng cao']);
    assert.deepEqual(ml.nhom[1].dong.map((d) => d.stt), [2, 3]);
  });
  it('cấp độ lên xuống (track javascript thật) ⇒ MỘT nhóm "Các bài học"', () => {
    const ml = dungMucLuc('javascript', [
      mod(0, 'javascript-fundamentals', 'JavaScript Fundamentals', 'BEGINNER'),
      mod(1, 'arrays-and-objects', 'Arrays and Objects', 'INTERMEDIATE'),
      mod(2, 'patterns', 'JavaScript Patterns and Testing', 'ADVANCED'),
      mod(3, 'security', 'Security, Error Handling', 'INTERMEDIATE'),
    ]);
    assert.equal(ml.kieu, 'phang');
    assert.equal(ml.nhom.length, 1);
    assert.equal(ml.nhom[0].ten, 'Các bài học');
    assert.equal(ml.nhom[0].dong.length, 4);
  });
});

describe('tiến độ + "Bắt đầu từ"', () => {
  it('bài chưa làm xong đầu tiên theo thứ tự lộ trình', () => {
    const ids21 = WF[1].exercises!.map((e) => e.id);
    const ids22 = WF[2].exercises!.map((e) => e.id);
    const xong = new Set([...ids21, ids22[0]]);
    const ml = dungMucLuc('web-foundations-practice', WF, (id) => xong.has(id));
    const b = baiChuaLamDauTien(ml);
    assert.equal(b?.dong.module.slug, 'wf-2-2-text-links-images');
    assert.equal(b?.dong.tk.daLam, 1);
    assert.equal(b?.nhom.so, 2);
  });
  it('khách (chưa giải gì) ⇒ bài đầu tiên', () => {
    assert.equal(baiChuaLamDauTien(dungMucLuc('web-foundations-practice', WF))?.dong.module.slug, 'wf-2-1-html-basics');
  });
  it('làm hết ⇒ null', () => {
    assert.equal(baiChuaLamDauTien(dungMucLuc('web-foundations-practice', WF, () => true)), null);
  });
  it('thongKeModule: đếm độ khó, phút (thiếu phút tính 10), đã làm', () => {
    const tk = thongKeModule({ exercises: [de('EASY', 8), de('EASY', null), de('HARD', 20)] }, (id) => id % 2 === 0);
    assert.deepEqual(tk.doKho, { EASY: 2, MEDIUM: 0, HARD: 1, EXPERT: 0 });
    assert.equal(tk.phut, 38);
    assert.equal(tk.soDe, 3);
  });
});

describe('tìm nhanh', () => {
  it('bỏ dấu + không phân biệt hoa thường', () => {
    assert.equal(chuanHoaTim('Biểu mẫu Đơn'), 'bieu mau don');
    const ml = locMucLuc(dungMucLuc('web-foundations-practice', WF), 'flex');
    assert.deepEqual(ml.nhom.map((g) => g.so), [3]);
    assert.deepEqual(ml.nhom[0].dong.map((d) => d.module.slug), ['wf-3-3-flexbox']);
  });
  it('chuỗi trống giữ nguyên; không khớp ⇒ không nhóm nào', () => {
    const goc = dungMucLuc('web-foundations-practice', WF);
    assert.equal(locMucLuc(goc, '  '), goc);
    assert.equal(locMucLuc(goc, 'zzz').nhom.length, 0);
  });
});

describe('điều hướng', () => {
  it('moduleLanCan theo thứ tự lộ trình, bỏ module không có đề', () => {
    const ds = [...WF, { ...mod(2, 'wf-2-3-rong', '2.3 Rỗng', 'BEGINNER', 0) }];
    const r = moduleLanCan(ds, 'wf-2-2-text-links-images');
    assert.equal(r.truoc?.slug, 'wf-2-1-html-basics');
    assert.equal(r.sau?.slug, 'wf-3-1-css-basics');
    assert.equal(moduleLanCan(ds, 'wf-3-3-flexbox').sau, null);
    assert.deepEqual(moduleLanCan(ds, 'khong-co'), { truoc: null, sau: null });
  });
  it('duongBaiHoc thêm khoa khi track gắn khoá', () => {
    assert.equal(duongBaiHoc('web-foundations-practice', 'wf-3-3-flexbox'), '/code-lab/web-foundations-practice?bai=wf-3-3-flexbox&khoa=web-foundations');
    assert.equal(duongBaiHoc('javascript', 'arrays-and-objects'), '/code-lab/javascript?bai=arrays-and-objects');
    assert.equal(duongBaiHoc('javascript', 'x', { ref: '/courses/a', reflabel: '' }), '/code-lab/javascript?bai=x&ref=%2Fcourses%2Fa');
    assert.equal(duongMucLuc('javascript', 3), '/code-lab/javascript?chuong=3');
  });
  it('tenBoSo bỏ số "3.3 " đầu tên', () => {
    assert.equal(tenBoSo('3.3 Flexbox: xếp mọi thứ'), 'Flexbox: xếp mọi thứ');
    assert.equal(tenBoSo('JavaScript Fundamentals'), 'JavaScript Fundamentals');
  });
});
