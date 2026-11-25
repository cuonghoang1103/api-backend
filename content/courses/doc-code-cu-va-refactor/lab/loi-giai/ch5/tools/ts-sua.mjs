// ts-sua.mjs — gọi THẲNG TypeScript Language Service (bộ máy sau F2 / Ctrl+. của VS Code) trên tệp .js, không cần giao diện.
//   node ts-sua.mjs <tệp.js> liet-ke <dòng đầu> <dòng cuối>             — các refactor VS Code sẽ gợi ý cho vùng chọn
//   node ts-sua.mjs <tệp.js> tach <dòng đầu> <dòng cuối> <tên> [hành động] — Extract Symbol (mặc định function_scope_1) rồi đổi tên
//   node ts-sua.mjs <tệp.js> doi-ten <dòng> <chữ> <tên mới>              — Rename Symbol (F2) cho lần xuất hiện đầu của <chữ> trên dòng
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const ts = createRequire(import.meta.url)(process.env.TS_PATH || (process.env.HOME + '/vbg-dp/node_modules/typescript'));
const [tep, lenh, ...thamSo] = process.argv.slice(2);
const goc = path.resolve(tep);
let noiDung = fs.readFileSync(goc, 'utf8');
const host = {
  getScriptFileNames: () => [goc], getScriptVersion: () => String(noiDung.length), getCurrentDirectory: () => path.dirname(goc),
  getScriptSnapshot: (f) => ts.ScriptSnapshot.fromString(f === goc ? noiDung : (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '')),
  getCompilationSettings: () => ({ allowJs: true, checkJs: false, noEmit: true, target: ts.ScriptTarget.ES2019 }),
  getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o), fileExists: fs.existsSync, readFile: (f) => fs.readFileSync(f, 'utf8'),
};
const ls = ts.createLanguageService(host);
// Định dạng như VS Code mặc định cho dự án thụt 2 dấu cách (không có thì mã sinh ra dính liền, mất dấu cách)
const DINH_DANG = { ...ts.getDefaultFormatCodeSettings('\n'), indentSize: 2, tabSize: 2, baseIndentSize: 0 };
const viTri = (dong, cot = 0) => noiDung.split('\n').slice(0, dong - 1).reduce((n, l) => n + l.length + 1, 0) + cot;
const vung = (a, b) => { const s = viTri(+a); const dongB = noiDung.split('\n')[+b - 1]; return { pos: s + noiDung.split('\n')[+a - 1].search(/\S/), end: viTri(+b) + dongB.length }; };
const apDung = (edits) => { for (const e of edits) for (const t of [...e.textChanges].sort((x, y) => y.span.start - x.span.start))
  noiDung = noiDung.slice(0, t.span.start) + t.newText + noiDung.slice(t.span.start + t.span.length); };
const doiTen = (pos, moi) => {
  const locs = ls.findRenameLocations(goc, pos, false, false, { providePrefixAndSuffixTextForRename: true });
  if (!locs) throw new Error('khong doi ten duoc o vi tri nay');
  for (const l of [...locs].sort((x, y) => y.textSpan.start - x.textSpan.start))
    noiDung = noiDung.slice(0, l.textSpan.start) + (l.prefixText || '') + moi + (l.suffixText || '') + noiDung.slice(l.textSpan.start + l.textSpan.length);
  return locs.length;
};
if (lenh === 'liet-ke') {
  const { pos, end } = vung(thamSo[0], thamSo[1]);
  for (const r of ls.getApplicableRefactors(goc, { pos, end }, { provideRefactorNotApplicableReason: true }, 'invoked'))
    for (const a of r.actions) console.log(`${r.name} › ${a.name}: ${a.description}${a.notApplicableReason ? '  (không dùng được: ' + a.notApplicableReason + ')' : ''}`);
} else if (lenh === 'tach') {
  const [a, b, ten, hanhDong = 'function_scope_1'] = thamSo;
  const { pos, end } = vung(a, b);
  const r = ls.getEditsForRefactor(goc, DINH_DANG, { pos, end }, 'Extract Symbol', hanhDong, {});
  apDung(r.edits);
  const tenTam = noiDung.slice(r.renameLocation).match(/^[A-Za-z_$][\w$]*/)[0];
  const n = doiTen(r.renameLocation, ten);
  fs.writeFileSync(goc, noiDung);
  console.log(`Extract Symbol (${hanhDong}) → "${tenTam}" → đổi tên "${ten}" ở ${n} chỗ`);
} else if (lenh === 'doi-ten') {
  const [dong, chu, moi] = thamSo;
  const cot = noiDung.split('\n')[+dong - 1].search(new RegExp('\\b' + chu + '\\b'));
  const n = doiTen(viTri(+dong, cot), moi);
  fs.writeFileSync(goc, noiDung);
  console.log(`Rename Symbol "${chu}" → "${moi}": ${n} chỗ`);
}
if (lenh === 'bo-tham-so') {
  // Quick fix "Remove unused declaration" (Ctrl+. trên tham số mờ) — cần bật noUnusedParameters để có chẩn đoán 6133
  const [dong, chu] = thamSo;
  host.getCompilationSettings = () => ({ allowJs: true, checkJs: true, noUnusedParameters: true, noEmit: true, target: ts.ScriptTarget.ES2019 });
  const ls2 = ts.createLanguageService(host);
  const cot = noiDung.split('\n')[+dong - 1].search(new RegExp('\\b' + chu + '\\b'));
  const pos = viTri(+dong, cot);
  const fixes = ls2.getCodeFixesAtPosition(goc, pos, pos + chu.length, [6133], DINH_DANG, {});
  for (const f of fixes) console.log('quick fix:', f.fixName, '—', f.description);
  const f = fixes.find((x) => x.fixName === 'unusedIdentifier' && /Remove unused/.test(x.description));
  if (!f) { console.log('không có quick fix nào BỎ tham số — phải sửa tay (migration mechanics)'); process.exit(0); }
  apDung(f.changes); fs.writeFileSync(goc, noiDung); console.log('đã áp dụng:', f.description);
}
