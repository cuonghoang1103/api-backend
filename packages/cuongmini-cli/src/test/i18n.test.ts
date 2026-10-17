/**
 * KHÔNG CÒN CHUỖI GIAO DIỆN NÀO THIẾU BẢN DỊCH.
 *
 * Quét AST TypeScript của mọi file `src/**` (trừ test): chuỗi nào có chữ tiếng
 * Việt thì PHẢI là tham số đầu của `L('vi', 'en')` (và tham số thứ hai là tiếng
 * Anh, không rỗng) — hoặc dòng đó ghi rõ `i18n-bo-qua` (câu gửi model, mẫu khớp
 * chữ do lõi trả về… — những thứ CỐ Ý không dịch).
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import { datNgonNgu, doNgonNgu, L } from '../i18n';
import { LENH_CLI, moLenh, thamSoLenh } from '../lenhMoTa';
import { datCapMau, boMau } from '../mau';
import { veMuc } from '../veBang';

const TV = /[ăâđêôơưàáạảãầấậẩẫằắặẳẵèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹĂÂĐÊÔƠƯÀÁẠẢÃẦẤẬẨẪẰẮẶẲẴÈÉẸẺẼỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕỒỐỘỔỖỜỚỢỞỠÙÚỤỦŨỪỨỰỬỮỲÝỴỶỸ]/;
/** Tên riêng 'Tiếng Việt' (tên ngôn ngữ) được phép có trong bản tiếng Anh. */
const coTiengViet = (s: string): boolean => TV.test(s.replace(/Tiếng Việt/g, ''));
const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function tatCaFile(d: string): string[] {
  return readdirSync(d).flatMap((f) => {
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) return f === 'test' ? [] : tatCaFile(p);
    return /\.tsx?$/.test(f) && !f.endsWith('.d.ts') ? [p] : [];
  });
}

/** Bảng song ngữ `['tiếng Việt', 'English']` (hoặc `[mã, vi, en]`): phần tử kế tiếp là chuỗi tiếng Anh không rỗng. */
function laCapSongNgu(n: ts.Node): boolean {
  const cha = n.parent;
  if (!cha || !ts.isArrayLiteralExpression(cha)) return false;
  const ke = cha.elements[cha.elements.indexOf(n as ts.Expression) + 1];
  return !!ke && (ts.isStringLiteral(ke) || ts.isNoSubstitutionTemplateLiteral(ke)) && !!ke.text.trim() && !coTiengViet(ke.text);
}

function laThamSoDauCuaL(n: ts.Node): boolean {
  let con: ts.Node = n;
  let cha = n.parent;
  while (cha) {
    if (ts.isCallExpression(cha) && cha.expression.getText() === 'L') return cha.arguments[0] === con;
    // Chuỗi nằm TRONG một biểu thức con (template lồng) của tham số đầu vẫn tính.
    if (ts.isCallExpression(cha) || ts.isArrowFunction(cha) || ts.isFunctionDeclaration(cha)) return false;
    con = cha;
    cha = cha.parent;
  }
  return false;
}

test('mọi chuỗi giao diện tiếng Việt đều có bản tiếng Anh (L(vi, en)) hoặc ghi rõ i18n-bo-qua', () => {
  const loi: string[] = [];
  for (const f of tatCaFile(goc)) {
    const ma = readFileSync(f, 'utf8');
    const dong = ma.split('\n');
    const sf = ts.createSourceFile(f, ma, ts.ScriptTarget.Latest, true, f.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const xem = (n: ts.Node): void => {
      const laChuoi = ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateExpression(n) || ts.isJsxText(n);
      // Template: chỉ xét PHẦN CHỮ của chính nó — biểu thức lồng bên trong (vd `${L('…', '…')}`) được xét riêng.
      const chuRieng = ts.isTemplateExpression(n) ? [n.head.text, ...n.templateSpans.map((x) => x.literal.text)].join(' ') : n.getText();
      if (laChuoi && coTiengViet(chuRieng)) {
        const d0 = sf.getLineAndCharacterOfPosition(n.getStart()).line;
        const d1 = sf.getLineAndCharacterOfPosition(n.getEnd()).line;
        const boQua = dong.slice(Math.max(0, d0 - 1), d1 + 1).some((x) => x.includes('i18n-bo-qua'));
        if (!boQua && !laThamSoDauCuaL(n) && !laCapSongNgu(n)) loi.push(`${path.relative(goc, f)}:${d0 + 1}  ${n.getText().slice(0, 70)}`);
        if (!boQua && laThamSoDauCuaL(n)) {
          const call = (function tim(x: ts.Node): ts.CallExpression { return ts.isCallExpression(x.parent) && x.parent.expression.getText() === 'L' ? x.parent : tim(x.parent); })(n);
          const en = call.arguments[1];
          if (!en) loi.push(`${path.relative(goc, f)}:${d0 + 1}  L() thiếu bản tiếng Anh`);
          else if ((ts.isStringLiteral(en) || ts.isNoSubstitutionTemplateLiteral(en)) && (!en.text.trim() || coTiengViet(en.text))) {
            loi.push(`${path.relative(goc, f)}:${d0 + 1}  bản tiếng Anh rỗng hoặc vẫn là tiếng Việt: ${en.getText().slice(0, 60)}`);
          }
        }
        if (!ts.isTemplateExpression(n)) return;
      }
      ts.forEachChild(n, xem);
    };
    xem(sf);
  }
  assert.deepEqual(loi, [], `Chuỗi chưa dịch:\n${loi.join('\n')}`);
});

test('mọi lệnh / (của lõi + của CLI) có mô tả tiếng Anh', async () => {
  // Nạp ĐỘNG bằng đường trong biến: tsc không đi theo vào cây React của app desktop.
  const duong = path.resolve(goc, '../../../desktop/src/renderer/features/chat/lenhGach.ts');
  const { LENH_AGENT } = await import(pathToFileURL(duong).href) as { LENH_AGENT: Array<{ ten: string; mo: string; thamSo?: string; khac?: string[] }> };
  datNgonNgu('en');
  for (const l of [...LENH_AGENT, ...LENH_CLI]) {
    const mo = moLenh(l);
    assert.ok(mo && !TV.test(mo), `${l.ten}: "${mo}"`);
    const ts2 = thamSoLenh(l);
    if (ts2) assert.ok(!TV.test(ts2), `${l.ten} tham số: "${ts2}"`);
  }
  datNgonNgu('vi');
  assert.equal(moLenh(LENH_AGENT.find((l) => l.ten === '/clear')!), LENH_AGENT.find((l) => l.ten === '/clear')!.mo);
});

test('đổi ngôn ngữ ⇒ cùng một mục vẽ ra chữ khác ngay', () => {
  datCapMau(0);
  const m = { id: 1, loai: 'ketLuot' as const, luc: new Date(2026, 9, 17, 18, 27).getTime(), thoiLuong: 72_000, ghiChu: '' };
  datNgonNgu('vi');
  const vi = boMau(veMuc({ ...m, loai: 'tool', ten: 'read_file', tomTat: 'x', hong: false, moRong: false }, 80).join('\n'));
  datNgonNgu('en');
  const en = boMau(veMuc({ ...m, loai: 'tool', ten: 'read_file', tomTat: 'x', hong: false, moRong: false }, 80).join('\n'));
  assert.match(vi, /Đọc/);
  assert.match(en, /Read/);
  assert.equal(L('a', 'b'), 'b');
  datNgonNgu('vi');
  assert.equal(doNgonNgu({ LANG: 'vi_VN.UTF-8' }), 'vi');
  assert.equal(doNgonNgu({ LANG: 'en_US.UTF-8' }), 'en');
  assert.equal(doNgonNgu({ LC_ALL: 'vi', LANG: 'en_US' }), 'vi');
  assert.equal(doNgonNgu({}), 'en');
});
