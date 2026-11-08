/**
 * RÀO CHẮN "MÀU VIẾT CỨNG" (08/11/2026).
 *
 * Người dùng báo: đổi sang chủ đề sáng thì chỉ khung trắng ra, ruột trang vẫn đen; chữ "mờ, xấu". Gốc rễ chung của
 * mọi chỗ hỏng là MỘT thói quen: viết thẳng `color: #c4b5fd` / `background: #0b0e14` (màu chỉ đúng ở MỘT chủ đề)
 * thay vì token `var(--ct-*)` khai hai bản sáng/tối ở đầu `styles.css`.
 *
 * Phép kiểm này đếm, trong mọi tệp CSS của renderer, số khai báo màu/nền/viền/fill/stroke mang MÀU THÔ (#hex,
 * rgb()/hsl() số) — trừ khai báo biến `--*` (đó chính là chỗ ĐỊNH NGHĨA token). Mỗi tệp có một trần ở
 * `mauCung.baseline.json`; vượt trần ⇒ đỏ. Trần chỉ được HẠ: sửa bớt màu thô thì hạ số trong tệp baseline xuống
 * cho khớp (thông báo bên dưới in sẵn con số mới).
 *
 * Cố ý đứng ngoài: trò chơi (`features/games`, `features/doiKhang` — sân khấu riêng, luôn tối) và bảng xem trước
 * chủ đề trong Cài đặt (nó VẼ hai chủ đề nên phải dùng màu thật — đã tính trong trần của settings.css).
 *
 * Màu thô vẫn hợp lệ khi nó thật sự không theo chủ đề: nền ĐẶC của nút (chữ trắng trên đỏ), ảnh/video, sân khấu luôn
 * tối (Creator, chế độ thư giãn của Nhạc, khối mã). Khi đó cứ thêm — và nâng trần — kèm một dòng chú thích vì sao.
 */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const GOC = path.resolve(__dirname);
const BO_QUA = [/^features[\\/]games[\\/]/, /^features[\\/]doiKhang[\\/]/];

const THUOC_TINH =
  /(?:^|[;{\s])(color|background(?:-color)?|border(?:-(?:top|right|bottom|left))?(?:-color)?|outline(?:-color)?|fill|stroke|caret-color|text-decoration-color)\s*:\s*([^;}]*)/g;
const MAU_THO = /#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d|\bhsla?\(\s*\d/;

function* tepCss(thuMuc: string): Generator<string> {
  for (const e of fs.readdirSync(thuMuc, { withFileTypes: true })) {
    const p = path.join(thuMuc, e.name);
    if (e.isDirectory()) yield* tepCss(p);
    else if (e.name.endsWith('.css')) yield p;
  }
}

export function demMauTho(css: string): number {
  // Bỏ chú thích (giữ xuống dòng để không dính hai dòng làm một).
  const sach = css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  let n = 0;
  for (const dong of sach.split('\n')) {
    THUOC_TINH.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = THUOC_TINH.exec(dong))) {
      // `--x: #fff` là ĐỊNH NGHĨA token — regex trên không khớp được vì thuộc tính phải đứng sau ; { hoặc khoảng
      // trắng VÀ là một tên trong danh sách; `--ct-border: …` không bao giờ là `border:`.
      if (MAU_THO.test(m[2] ?? '')) n++;
    }
  }
  return n;
}

function demTatCa(): Record<string, number> {
  const kq: Record<string, number> = {};
  for (const f of tepCss(GOC)) {
    const rel = path.relative(GOC, f).split(path.sep).join('/');
    if (BO_QUA.some((r) => r.test(rel))) continue;
    const n = demMauTho(fs.readFileSync(f, 'utf8'));
    if (n > 0) kq[rel] = n;
  }
  return kq;
}

/** Màu thô trong `style={{…}}` / thuộc tính SVG của TSX: `color: '#abc'`, `fill="#abc"`. */
const TSX_MAU = /(?:color|background|backgroundColor|borderColor|fill|stroke)\s*[:=]\s*\{?\s*['"]#[0-9a-fA-F]{3,8}['"]/g;
function* tepTsx(thuMuc: string): Generator<string> {
  for (const e of fs.readdirSync(thuMuc, { withFileTypes: true })) {
    const p = path.join(thuMuc, e.name);
    if (e.isDirectory()) yield* tepTsx(p);
    else if (e.name.endsWith('.tsx') && !e.name.endsWith('.test.tsx')) yield p;
  }
}
function demTsx(): number {
  let n = 0;
  for (const f of tepTsx(GOC)) {
    const rel = path.relative(GOC, f).split(path.sep).join('/');
    if (BO_QUA.some((r) => r.test(rel))) continue;
    n += (fs.readFileSync(f, 'utf8').match(TSX_MAU) ?? []).length;
  }
  return n;
}

const BASELINE = JSON.parse(fs.readFileSync(path.join(GOC, 'mauCung.baseline.json'), 'utf8')) as {
  css: Record<string, number>;
  tsxTong: number;
};

describe('màu viết cứng trong renderer chỉ được GIẢM', () => {
  it('bộ đếm: bỏ qua định nghĩa token và chú thích, đếm khai báo dùng màu thô', () => {
    expect(demMauTho(':root { --ct-text: #111; --ct-bg: rgba(0,0,0,.1); }')).toBe(0);
    expect(demMauTho('.a { color: var(--ct-text); background: color-mix(in srgb, var(--ct-ok) 10%, transparent); }')).toBe(0);
    expect(demMauTho('.a { color: #fff; border: 1px solid rgba(0, 0, 0, .2); }')).toBe(2);
    expect(demMauTho('/* color: #fff */ .a { background: linear-gradient(#000, #111); }')).toBe(1);
  });

  it('CSS: không tệp nào vượt trần', () => {
    const hienTai = demTatCa();
    const vuot: string[] = [];
    const ha: string[] = [];
    for (const [tep, n] of Object.entries(hienTai)) {
      const tran = BASELINE.css[tep] ?? 0;
      if (n > tran) vuot.push(`${tep}: ${n} > trần ${tran}`);
      else if (n < tran) ha.push(`"${tep}": ${n}`);
    }
    for (const [tep, tran] of Object.entries(BASELINE.css)) if (!(tep in hienTai) && tran > 0) ha.push(`"${tep}": 0`);
    if (ha.length) console.info(`[mauCung] đã giảm — hạ trần trong mauCung.baseline.json:\n  ${ha.join('\n  ')}`);
    expect(
      vuot,
      'Màu thô mới trong CSS — dùng token var(--ct-*) (khai sáng/tối ở đầu styles.css) thay vì #hex/rgba. ' +
        'Nếu màu đó thật sự không theo chủ đề (nền đặc của nút, sân khấu luôn tối), nâng trần kèm lý do.',
    ).toEqual([]);
  });

  it('TSX: màu thô trong style/thuộc tính SVG không tăng', () => {
    const n = demTsx();
    if (n < BASELINE.tsxTong) console.info(`[mauCung] TSX đã giảm: hạ "tsxTong" xuống ${n}`);
    expect(n, 'Màu #hex mới trong style={{…}}/fill/stroke của TSX — dùng var(--ct-*)').toBeLessThanOrEqual(BASELINE.tsxTong);
  });
});
