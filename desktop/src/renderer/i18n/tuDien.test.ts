/**
 * Kiểm TỪ ĐIỂN và cơ chế đổi ngôn ngữ.
 *
 * ─── Phép kiểm quan trọng nhất ở đây ───
 * "Mọi chuỗi đã bọc `t()` trong mã đều có bản dịch". Thiếu nó thì cách hỏng
 * điển hình của đa ngôn ngữ diễn ra êm ru: người ta bọc `t()` quanh một câu,
 * quên thêm vào từ điển, và câu ấy hiện ra bằng TIẾNG VIỆT giữa giao diện tiếng
 * Anh. Không lỗi, không cảnh báo — `t()` cố ý trả lại câu gốc để không bao giờ
 * có ô trống. Cái giá của lựa chọn ấy là nó cũng nuốt luôn phần thiếu sót, nên
 * phần thiếu sót phải được canh ở đây.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { TU_DIEN } from './tuDien';
import { dich, dichP, datNgonNgu, ngonNguHienTai } from './index';

const GOC = join(__dirname, '..');

function moiTep(thuMuc: string, ra: string[] = []): string[] {
  for (const ten of readdirSync(thuMuc)) {
    const duong = join(thuMuc, ten);
    if (statSync(duong).isDirectory()) { moiTep(duong, ra); continue; }
    if (/\.tsx?$/.test(ten) && !/\.test\./.test(ten)) ra.push(duong);
  }
  return ra;
}

/**
 * Gỡ lớp thoát của chuỗi trong MÃ NGUỒN về đúng chuỗi lúc CHẠY.
 *
 * ⚠️ Thiếu bước này là phép kiểm báo nhầm: trong mã, `'a\\nb'` là bốn ký tự
 * (có dấu gạch chéo ngược), còn khoá từ điển `'a\\nb'` sau khi JS phân tích là
 * ba ký tự (xuống dòng thật). So thẳng hai thứ ấy thì mọi câu nhiều dòng —
 * tức là mọi đầu ra lệnh gạch chéo — đều bị báo là "thiếu bản dịch" trong khi
 * chúng có đủ.
 */
function boThoat(s: string): string {
  return s.replace(/\\([nrt'"\\`])/g, (_, c: string) =>
    ({ n: '\n', r: '\r', t: '\t' }[c] ?? c));
}

/** Mọi chuỗi hằng nằm trong `dich('…')` / `dichP('…')` khắp renderer. */
function chuoiDaBoc(): { cau: string; tep: string }[] {
  const ra: { cau: string; tep: string }[] = [];
  for (const tep of moiTep(GOC)) {
    if (tep.includes(`${'i18n'}/`)) continue;      // chính mô-đun dịch
    const ma = readFileSync(tep, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    for (const m of ma.matchAll(/(?<![A-Za-z0-9_$.])dichP?\(\s*'((?:[^'\\]|\\.)*)'/g)) {
      ra.push({ cau: boThoat(m[1]!), tep: tep.slice(GOC.length + 1) });
    }
    /* `<Chu cau="…" />` — văn xuôi có định dạng. Bỏ sót nhánh này thì mọi câu
       dài nhất trong app (cảnh báo, hướng dẫn) không ai canh, mà chúng lại là
       chỗ dễ quên dịch nhất vì trông không giống một "nhãn". */
    for (const m of ma.matchAll(/<Chu\s+cau="([^"]+)"/g)) {
      ra.push({ cau: m[1]!, tep: tep.slice(GOC.length + 1) });
    }
  }
  return ra;
}

describe('mọi chuỗi đã bọc t() đều dịch được', () => {
  it('không câu nào thiếu trong từ điển', () => {
    const thieu = chuoiDaBoc()
      .filter(({ cau }) => !(cau in TU_DIEN))
      .map(({ cau, tep }) => `${tep}: ${cau}`);
    expect(
      thieu,
      'Thiếu bản dịch ⇒ câu đó hiện TIẾNG VIỆT giữa giao diện tiếng Anh, im lặng.\n'
      + [...new Set(thieu)].join('\n'),
    ).toEqual([]);
  });

  it('BỘ DÒ CÓ HOẠT ĐỘNG — nó thật sự tìm thấy chuỗi', () => {
    // Một phép dò trả rỗng thì phép kiểm trên chứng nhận mọi thứ, kể cả lúc
    // chưa ai bọc `t()` ở đâu cả.
    const ds = chuoiDaBoc();
    expect(ds.length).toBeGreaterThan(30);
    expect(ds.map((x) => x.cau)).toContain('Cài đặt');
  });
});

describe('chất lượng từ điển', () => {
  it('⭐ KHÔNG có khoá nào lặp lại', () => {
    /* Khoá trùng trong một object literal KHÔNG phải lỗi cú pháp: JavaScript
       lặng lẽ giữ mục SAU và vứt mục trước. Nên phép kiểm này phải đọc MÃ
       NGUỒN — nhìn vào `TU_DIEN` thì hai mục đã gộp làm một từ đời nào rồi,
       và không còn gì để mà thấy.

       Nó bắt được một lỗi thật ngay lần chạy đầu: `Bài đang mở` có sẵn nghĩa
       "Open track" (nhãn khối MỘT bài), rồi một mục mới trùng khoá dịch thành
       "Open tracks" và đè lên nó — nhãn cũ đổi nghĩa ở một trang không liên
       quan gì, im lặng. `tsc` không thấy, vite chỉ cảnh báo giữa một rừng chữ. */
    const ma = readFileSync(
      new URL('./tuDien.ts', import.meta.url).pathname, 'utf8',
    );
    const khoa = [...ma.matchAll(/^ {2}'((?:[^'\\]|\\.)*)':/gm)].map((m) => m[1]!);
    const dem = new Map<string, number>();
    for (const k of khoa) dem.set(k, (dem.get(k) ?? 0) + 1);
    const trung = [...dem].filter(([, n]) => n > 1).map(([k, n]) => `${k} (×${n})`);
    expect(trung, 'Khoá trùng ⇒ mục sau ĐÈ mục trước, im lặng').toEqual([]);
    /* Và chốt rằng bộ dò thật sự đọc được cái gì đó — một regex hỏng cũng cho
       ra mảng rỗng và phép kiểm trên vẫn xanh. */
    expect(khoa.length).toBeGreaterThan(400);
  });

  it('không mục nào để rỗng hay chép y nguyên tiếng Việt', () => {
    const xau = Object.entries(TU_DIEN).filter(([vi, en]) => !en.trim() || en === vi);
    expect(xau).toEqual([]);
  });

  it('⛔ không dịch những tên đã là tiếng Anh sẵn', () => {
    // `AI Chat`, `Code Lab`… là TÊN RIÊNG. Có mục cho chúng nghĩa là ai đó
    // đang "dịch" một cái tên, và bản Anh sẽ khác bản Việt ở đúng chỗ không
    // nên khác.
    for (const ten of ['AI Chat', 'Code Lab', 'Maker Lab', 'Exp Hub', 'CV Builder', 'Tech Trends', 'Pro']) {
      expect(TU_DIEN[ten], `${ten} là tên riêng, đừng dịch`).toBeUndefined();
    }
  });
});

describe('cơ chế đổi', () => {
  it('mặc định tiếng Việt ⇒ trả nguyên câu', () => {
    datNgonNgu('vi');
    expect(ngonNguHienTai()).toBe('vi');
    expect(dich('Cài đặt')).toBe('Cài đặt');
  });

  it('đổi sang tiếng Anh ⇒ dịch, và câu LẠ vẫn trả tiếng Việt chứ không rỗng', () => {
    datNgonNgu('en');
    expect(dich('Cài đặt')).toBe('Settings');
    // Đây là lựa chọn có chủ đích: thà lạ mắt còn hơn một ô trống.
    expect(dich('Một câu chưa ai dịch')).toBe('Một câu chưa ai dịch');
    datNgonNgu('vi');
  });

  it('chỗ thay giữ nguyên tên, và bản dịch được phép ĐẢO thứ tự', () => {
    // Trật tự từ tiếng Anh và tiếng Việt khác nhau ở đúng những câu hay ghép
    // chuỗi nhất, nên nối chuỗi bằng `+` là không dịch được.
    expect(dichP('Còn {n} việc', { n: 3 })).toBe('Còn 3 việc');
    expect(dichP('Còn {n} việc', {})).toBe('Còn {n} việc');   // thiếu ⇒ giữ chỗ thay
  });
});
