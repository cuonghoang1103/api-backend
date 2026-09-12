/**
 * ============================================================
 * KHÔNG có hai tệp chỉ khác nhau HOA/THƯỜNG trong cùng thư mục
 * ============================================================
 *
 * ─── Vì sao cần phép kiểm này ───
 * Linux phân biệt hoa thường trong tên tệp; **macOS và Windows thì không**.
 * Nên `DongThoiGian.tsx` và `dongThoiGian.ts` nằm cạnh nhau là hai tệp KHÁC
 * NHAU trên máy dựng chạy Linux, mà là MỘT tệp trên máy của người dùng — và
 * `import { X } from './DongThoiGian'` ở đó rơi vào nhầm tệp.
 *
 * Chuyện này đã xảy ra thật, 12/09/2026, bản 0.5.103:
 *
 *     "DongThoiGian" is not exported by
 *     "src/renderer/features/xuong-remix/dongThoiGian.ts"
 *
 * `tsc` xanh, 1210 phép kiểm xanh, `vite build` xanh, bộ đo bố cục xanh —
 * TẤT CẢ đều chạy trên Linux. Lượt dựng macOS và Windows chết ngay bước đầu,
 * sau khi số phiên bản đã bump và đã push. Không có cách nào thấy nó từ máy
 * Linux, TRỪ cách này: đừng hỏi trình biên dịch, hỏi thẳng tên tệp.
 *
 * ─── Vì sao quét cả cây chứ không chỉ chỗ vừa sửa ───
 * Lỗi này không đến từ một dòng mã nào; nó đến từ việc ĐẶT TÊN hai tệp. Nó
 * sinh ra mỗi lần có người thêm một tệp mới, ở bất cứ đâu.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const GOC = path.resolve(__dirname);
const BO_QUA = new Set(['node_modules', 'dist', 'release', '.git']);

/** Mọi thư mục dưới `src/`, kể cả gốc. */
function moiThuMuc(goc: string): string[] {
  const ra = [goc];
  for (const m of readdirSync(goc)) {
    if (BO_QUA.has(m)) continue;
    const d = path.join(goc, m);
    if (statSync(d).isDirectory()) ra.push(...moiThuMuc(d));
  }
  return ra;
}

/**
 * Những nhóm tên đụng nhau khi bỏ qua hoa/thường.
 *
 * So theo tên ĐẦY ĐỦ kể cả đuôi: `a.ts` và `A.tsx` KHÔNG đụng nhau ở tầng hệ
 * tệp (hai tên khác nhau), nhưng CÓ đụng nhau ở tầng phân giải module — đường
 * `./a` không đuôi khớp cả hai. Nên phải kiểm cả hai kiểu.
 */
function dungNhau(thuMuc: string): string[][] {
  const theoTen = new Map<string, string[]>();
  const theoGoc = new Map<string, string[]>();
  for (const m of readdirSync(thuMuc)) {
    if (BO_QUA.has(m)) continue;
    if (statSync(path.join(thuMuc, m)).isDirectory()) continue;

    const day = m.toLowerCase();
    theoTen.set(day, [...(theoTen.get(day) ?? []), m]);

    /* Tên KHÔNG đuôi, cho mọi đuôi mà bundler tự thử. */
    const duoi = path.extname(m).toLowerCase();
    if (['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(duoi)) {
      const goc = path.basename(m, path.extname(m)).toLowerCase();
      theoGoc.set(goc, [...(theoGoc.get(goc) ?? []), m]);
    }
  }
  const ra: string[][] = [];
  for (const ds of theoTen.values()) if (ds.length > 1) ra.push(ds);
  for (const ds of theoGoc.values()) {
    /* Chỉ báo khi tên gốc CHỈ khác hoa/thường. Hai tệp cùng tên gốc khác đuôi
       nhưng giống hệt hoa/thường (`a.ts` + `a.test.ts`) là chuyện bình thường
       — `path.basename('a.test.ts', '.ts')` ra `a.test`, không đụng `a`. */
    if (ds.length > 1 && new Set(ds.map((x) => path.basename(x, path.extname(x)))).size > 1) {
      ra.push(ds);
    }
  }
  return ra;
}

describe('tên tệp phân biệt được trên hệ tệp KHÔNG phân biệt hoa thường', () => {
  it('⭐ không có hai tệp nào chỉ khác nhau hoa/thường', () => {
    const xau: string[] = [];
    for (const d of moiThuMuc(GOC)) {
      for (const nhom of dungNhau(d)) {
        xau.push(`${path.relative(GOC, d) || '.'}/ → ${nhom.join('  ⟷  ')}`);
      }
    }
    expect(
      xau,
      'Hai tệp chỉ khác hoa/thường là MỘT tệp trên macOS và Windows.\n'
      + 'Linux dựng xanh, máy người dùng dựng đỏ — và chỉ biết sau khi đã bump\n'
      + 'số phiên bản. Đổi tên một trong hai cho khác hẳn.\n',
    ).toEqual([]);
  });

  it('BỘ QUÉT CÓ HOẠT ĐỘNG — nó thật sự đọc được tệp', () => {
    /* Một `readdirSync` sai đường cũng cho ra mảng rỗng, và phép kiểm trên vẫn
       xanh vĩnh viễn. Chốt lại rằng nó có nhìn thấy cây mã thật. */
    const ds = moiThuMuc(GOC);
    expect(ds.length).toBeGreaterThan(20);
    expect(ds.some((d) => d.endsWith(path.join('renderer', 'features')))).toBe(true);
  });
});
