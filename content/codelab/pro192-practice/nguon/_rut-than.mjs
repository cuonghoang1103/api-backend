/**
 * "Rút thân hàm" — dựng code KHỞI ĐẦU cho bài LAB211 từ đáp án (nguồn khoá chỉ có solution/).
 *
 *   rutThan(src, chon) ⇒ src mới: mọi phương thức/constructor mà `chon({ ten, laConstructor, laStatic, laPrivate })`
 *   trả true bị thay thân bằng `// TODO: <dòng chú thích ngay trên hàm>` + `return <mặc định>;` (cùng thụt lề).
 *
 * Quét Java bằng "mặt nạ" (chú thích, chuỗi, ký tự ⇒ dấu cách, giữ nguyên độ dài + xuống dòng) nên ngoặc nhọn trong chuỗi
 * không làm lệch. Chỉ xét thành viên CẤP 1 của lớp ngoài cùng (lớp lồng / lambda / lớp vô danh trong thân hàm đi theo thân).
 * Giá trị mặc định chọn để khởi đầu BIÊN DỊCH được và không treo: số ⇒ 0, boolean ⇒ false, String ⇒ "", List/Map ⇒ rỗng,
 * kiểu khác ⇒ null.
 */

/** Chú thích / chuỗi / ký tự ⇒ dấu cách (giữ \n). */
export function matNa(src) {
  let o = '';
  let i = 0;
  const n = src.length;
  const trang = (s) => s.replace(/[^\n]/g, ' ');
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { const k = src.indexOf('\n', i); const e = k < 0 ? n : k; o += trang(src.slice(i, e)); i = e; continue; }
    if (c === '/' && d === '*') { const k = src.indexOf('*/', i + 2); const e = k < 0 ? n : k + 2; o += trang(src.slice(i, e)); i = e; continue; }
    if (c === '"' && src.startsWith('"""', i)) { const k = src.indexOf('"""', i + 3); const e = k < 0 ? n : k + 3; o += '"' + trang(src.slice(i + 1, e - 1)) + '"'; i = e; continue; }
    if (c === '"' || c === "'") {
      let k = i + 1;
      while (k < n && src[k] !== c && src[k] !== '\n') { if (src[k] === '\\') k++; k++; }
      o += c + trang(src.slice(i + 1, k)) + (k < n ? c : '');
      i = k + 1;
      continue;
    }
    o += c; i++;
  }
  return o;
}

const MAC_DINH = [
  [/^(int|long|short|byte|double|float)$/, '0'],
  [/^boolean$/, 'false'],
  [/^char$/, "' '"],
  [/^String$/, '""'],
  [/^(List|ArrayList)\s*</, 'new ArrayList<>()', 'java.util.ArrayList'],
  [/^(Map|HashMap)\s*</, 'new HashMap<>()', 'java.util.HashMap'],
];

export function rutThan(src, chon) {
  const m = matNa(src);
  const lop = /\b(?:class|enum|interface)\s+(\w+)/.exec(m);
  if (!lop) return src;
  const tenLop = lop[1];
  const viec = []; // { tu, den, thay }
  const canImport = new Set();
  let depth = 0;
  let dauThanhVien = 0; // vị trí bắt đầu phần đầu (header) của thành viên cấp 1 hiện tại
  for (let i = 0; i < m.length; i++) {
    const ch = m[i];
    if (ch === '{') {
      if (depth === 1) {
        const header = m.slice(dauThanhVien, i);
        const thongTin = docHeader(header, tenLop);
        // khớp ngoặc của thân
        let d = 0, j = i;
        for (; j < m.length; j++) { if (m[j] === '{') d++; else if (m[j] === '}' && --d === 0) break; }
        if (thongTin && chon(thongTin)) {
          const dongDau = src.lastIndexOf('\n', dauThanhVien + header.search(/\S/)) + 1;
          const thutLe = /^[ \t]*/.exec(src.slice(dongDau))[0];
          const moTa = chuThichTren(src, dongDau);
          let tra = '';
          if (!thongTin.laConstructor && thongTin.kieu !== 'void') {
            const md = MAC_DINH.find(([re]) => re.test(thongTin.kieu));
            tra = md ? md[1] : 'null';
            if (md && md[2]) canImport.add(md[2]);
          }
          const trong = thutLe + '    ';
          const than = `\n${trong}// TODO: ${moTa || `write ${thongTin.ten}()`}\n${tra ? `${trong}return ${tra};\n` : ''}${thutLe}`;
          viec.push({ tu: i + 1, den: j, thay: than });
        }
        i = j; // bỏ qua thân
        dauThanhVien = j + 1;
        continue;
      }
      depth++;
      if (depth === 1) dauThanhVien = i + 1;
      continue;
    }
    if (ch === '}') { depth--; if (depth === 1) dauThanhVien = i + 1; continue; }
    if (ch === ';' && depth === 1) dauThanhVien = i + 1;
  }
  let out = src;
  for (const v of viec.sort((a, b) => b.tu - a.tu)) out = out.slice(0, v.tu) + v.thay + out.slice(v.den);
  for (const imp of canImport) {
    if (new RegExp(`import ${imp.replace(/\./g, '\\.')};`).test(out) || /import java\.util\.\*;/.test(out)) continue;
    const ims = [...out.matchAll(/^import [\w.]+;$/gm)];
    if (ims.length) { const last = ims[ims.length - 1]; out = out.slice(0, last.index + last[0].length) + `\nimport ${imp};` + out.slice(last.index + last[0].length); }
    else out = out.replace(/^(package [\w.]+;\n)/m, `$1\nimport ${imp};\n`);
    out = out.replace(/((?:^import [\w.]+;\n)+)/m, (blk) => blk.split('\n').filter(Boolean).sort().join('\n') + '\n');
  }
  return out;
}

/** Phần đầu một thành viên ⇒ { ten, kieu, laConstructor, laStatic, laPrivate } hoặc null (khối static, lớp lồng, trường có khởi tạo…). */
function docHeader(h, tenLop) {
  let s = h.replace(/@\w+(\s*\([^)]*\))?/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s.includes('(')) return null;
  if (/\b(class|interface|enum|record)\b/.test(s)) return null;
  const truocNgoac = s.slice(0, s.indexOf('('));
  if (truocNgoac.includes('=')) return null;
  const mods = [];
  let rest = truocNgoac.trim();
  for (;;) {
    const mm = /^(public|private|protected|static|final|abstract|synchronized|native|default|strictfp)\s+/.exec(rest);
    if (!mm) break;
    mods.push(mm[1]);
    rest = rest.slice(mm[0].length);
  }
  rest = rest.replace(/^<[^>]*>\s*/, ''); // tham số kiểu của hàm generic
  const mt = /^(.*?)\s*\b(\w+)\s*$/.exec(rest);
  if (!mt) return null;
  const kieu = mt[1].trim();
  const ten = mt[2];
  const laConstructor = !kieu && ten === tenLop;
  if (!kieu && !laConstructor) return null;
  return { ten, kieu, laConstructor, laStatic: mods.includes('static'), laPrivate: mods.includes('private') };
}

/** Dòng chú thích // (hoặc câu đầu của Javadoc) ngay trên dòng `dongDau`, bỏ qua annotation. */
function chuThichTren(src, dongDau) {
  const dong = src.slice(0, dongDau).replace(/\n$/, '').split('\n');
  const gom = [];
  for (let k = dong.length - 1; k >= 0; k--) {
    const t = dong[k].trim();
    if (/^@\w+/.test(t)) continue;
    if (t.startsWith('//')) { gom.unshift(t.replace(/^\/\/\s?/, '')); continue; }
    if (t.endsWith('*/')) {
      const jd = [];
      for (; k >= 0; k--) { jd.unshift(dong[k].trim()); if (dong[k].trim().startsWith('/*')) break; }
      const chu = jd.join(' ').replace(/^\/\*\*?|\*\/$/g, '').replace(/\s\*\s?/g, ' ').replace(/@\w+.*$/, '').trim();
      gom.unshift(chu.split(/(?<=\.)\s/)[0]);
    }
    break;
  }
  return gom.join(' ').replace(/\s+/g, ' ').trim();
}
