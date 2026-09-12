#!/usr/bin/env node
/**
 * ============================================================
 * DÒ CHỮ TIẾNG VIỆT CHƯA BỌC DỊCH
 * ============================================================
 *
 * `tuDien.test.ts` canh chiều NGƯỢC LẠI: mọi chuỗi ĐÃ bọc `dich()` đều phải có
 * bản dịch. Nó không thể thấy chuỗi CHƯA BỌC — mà đó mới là cách hỏng người
 * dùng gặp: 11/09/2026 họ gửi ảnh ô Hook, một nửa tiếng Anh một nửa tiếng Việt,
 * vì 6 chỗ trong đúng tệp ấy chưa ai bọc. Không có bộ kiểm nào đỏ, vì không có
 * bộ kiểm nào nhìn hướng đó.
 *
 * Nó dò cái gì:
 *  • Văn bản JSX giữa hai thẻ:  `<p>Nạp lại</p>`
 *  • Thuộc tính hiện ra chữ:    placeholder / title / aria-label / alt / label
 * và chỉ báo khi mẩu đó CÓ dấu tiếng Việt — chữ không dấu (`Hook`, `edit_file`)
 * thì hai ngôn ngữ như nhau, bọc lại chỉ tổ rác.
 *
 * ⚠️ Đây là THƯỚC ĐO, không phải cổng chặn. Còn ~vài trăm chỗ tồn từ trước;
 * dựng nó thành phép kiểm đỏ ngay hôm nay thì chỉ tổ bị tắt đi.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const GOC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'renderer');
const DAU = 'àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ';
const CO_DAU = new RegExp(`[${DAU}${DAU.toUpperCase()}]`);

function moiTep(thuMuc, ra = []) {
  for (const ten of readdirSync(thuMuc)) {
    const duong = join(thuMuc, ten);
    if (statSync(duong).isDirectory()) { moiTep(duong, ra); continue; }
    if (/\.tsx$/.test(ten) && !/\.test\./.test(ten)) ra.push(duong);
  }
  return ra;
}

/**
 * Bỏ chú thích. Chú thích đầy tiếng Việt — không bỏ thì mọi tệp đều "hỏng".
 *
 * ⚠️ Phải bỏ CẢ chú thích cuối dòng, không chỉ chú thích đứng đầu dòng. Bản đầu
 * chỉ bỏ chú thích ĐỨNG ĐẦU DÒNG và lập tức báo nhầm `LamBai.tsx`: một dòng
 * `luan: Record<…>;   // CODE trong đề FE` cho ra đoạn giữa `>` và `<` chứa
 * đúng chữ có dấu, và bộ dò tưởng đó là văn bản hiện ra màn hình.
 * Không đụng `https://` — nên đòi phía trước KHÔNG phải dấu hai chấm.
 */
function boChuThich(ma) {
  return ma
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

export function dinhChuaBoc(ma) {
  const sach = boChuThich(ma);
  const ra = [];
  // Văn bản JSX: nằm giữa `>` và `<`, không chứa `{` `}` (có `{` là biểu thức,
  // và chuỗi bên trong đã do nhánh dưới hoặc `tuDien.test.ts` canh).
  for (const m of sach.matchAll(/>([^<>{}]+)</g)) {
    const chu = m[1].trim();
    // Chữ hiện ra màn hình gần như không bao giờ mang `;` hay `=`. Có chúng thì
    // đó là MÃ lọt vào giữa hai dấu ngoặc nhọn của generic, không phải văn bản.
    if (chu && CO_DAU.test(chu) && !/[;=]/.test(chu)) ra.push({ loai: 'văn bản', chu });
  }
  // Thuộc tính hiện chữ, dạng chuỗi thẳng (dạng {dich(…)} không khớp regex này).
  for (const m of sach.matchAll(/\b(placeholder|title|aria-label|alt|label)="([^"]+)"/g)) {
    if (CO_DAU.test(m[2])) ra.push({ loai: m[1], chu: m[2] });
  }
  return ra;
}

/* ── TỰ KIỂM: bộ dò phải bắt được ca đã biết, và phải bỏ qua ca đã bọc ── */
const THU_BAT = `<button><RotateCw /> Nạp lại</button>`;
const THU_BO = `<button>{dich('Nạp lại')}</button>`;
const THU_CT = `{/* Nạp lại cho đúng */}<b>{x}</b>`;
// Ca báo nhầm thật, gặp ở LamBai.tsx: generic + chú thích cuối dòng.
const THU_MA = `const m: Record<string, X> = y;   // CODE trong đề FE\n  luan: Record<A, B>;`;
if (dinhChuaBoc(THU_BAT).length !== 1) { console.error('⛔ bộ dò KHÔNG bắt được ca hiển nhiên'); process.exit(2); }
if (dinhChuaBoc(THU_BO).length !== 0) { console.error('⛔ bộ dò báo NHẦM chuỗi đã bọc'); process.exit(2); }
if (dinhChuaBoc(THU_CT).length !== 0) { console.error('⛔ bộ dò đọc cả chú thích'); process.exit(2); }
if (dinhChuaBoc(THU_MA).length !== 0) { console.error('⛔ bộ dò tưởng MÃ là văn bản'); process.exit(2); }

// Chỉ in báo cáo khi CHẠY THẲNG. Không có chốt này thì mỗi lần phép kiểm
// `import` hàm `dinhChuaBoc` là cả bảng lại đổ ra giữa đầu ra của vitest.
const chayThang = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (!chayThang) { /* dùng như thư viện */ } else {
const tep = moiTep(GOC).filter((t) => !t.includes(`${'i18n'}/`));
let tong = 0;
const bang = [];
for (const t of tep) {
  const d = dinhChuaBoc(readFileSync(t, 'utf8'));
  if (d.length) { tong += d.length; bang.push({ tep: t.slice(GOC.length + 1), so: d.length, vd: d[0].chu.slice(0, 58) }); }
}
bang.sort((a, b) => b.so - a.so);
const N = Number(process.argv[2] ?? 15);
console.log(`\n${tong} chuỗi chưa bọc, trong ${bang.length}/${tep.length} tệp .tsx\n`);
for (const b of bang.slice(0, N)) console.log(`  ${String(b.so).padStart(3)}  ${b.tep.padEnd(52)} ${b.vd}`);
if (bang.length > N) console.log(`  … còn ${bang.length - N} tệp nữa`);
}
