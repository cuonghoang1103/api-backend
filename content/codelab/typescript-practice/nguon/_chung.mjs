/**
 * TypeScript · bộ luyện loại `ts` — phần dùng chung (01/11/2026).
 *
 * NGUỒN SỰ THẬT của đề là của khoá: content/courses/typescript/_de-codelab-ts.json (mỗi đề: khoiDau, coDinh, kiem
 * { sach, phaiLoi, loiTsc, chay, ra, cam }, loiGiai, saiMau — đã kiểm bằng tsc 7.0.2 + Node 22: scripts/ts/kiem-de-ts.mjs).
 * `moduleTuBai(slugBai)` dựng một module (= một bài học) gồm mọi đề có `bai` đó; mỗi phép chấm của khoá thành KIỂM riêng
 * của máy chấm trình duyệt (frontend/src/components/code-lab/cham/chamTs.ts):
 *   sach: [tệp]   ⇒ { kiem: 'sach', tep }                         tsc: tệp người học + tệp này ⇒ 0 lỗi
 *   phaiLoi: [f]  ⇒ mỗi dòng "// expect TSxxxx" một kiểm 'phai-loi' + một kiểm 'khong-loi-la' (các dòng còn lại)
 *   loiTsc: [mã]  ⇒ mỗi mã một kiểm 'co-ma' + một kiểm 'chi-ma'
 *   chay: [lệnh]  ⇒ mỗi lệnh một kiểm 'chay' (lệnh đầu mang `ra`)
 *   cam           ⇒ một kiểm 'cam' (mặc định any / @ts-ignore / @ts-nocheck / @ts-expect-error)
 * `saiMau` đi theo đề (KHÔNG ghi vào JSON): bộ xuất chạy từng bài sai mẫu qua máy chấm Node — phải trượt ≥ 1 — rồi viết
 * mục "Lỗi hay gặp" từ chính nhãn + các kiểm đã bắt nó.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
const KHOA_DIR = path.resolve(DAY, '../../../courses/typescript');
export const KHOA = 'typescript';
export const DE_KHOA = JSON.parse(fs.readFileSync(path.join(KHOA_DIR, '_de-codelab-ts.json'), 'utf8'));

/** tsconfig chuẩn của khoá (LabFlow TS, bài 0.3) — JSON có chú thích ⇒ bỏ dòng // trước khi parse. */
const TSCONFIG_GOC = JSON.parse(fs.readFileSync(path.join(KHOA_DIR, '_labflow-ts/tsconfig.json'), 'utf8').replace(/^\s*\/\/.*$/gm, ''));
// như scripts/ts/kiem-de-ts.mjs: extends tsconfig gốc + types: ['node'] (include do máy chấm đặt = tệp của từng phép chấm)
export const TSCONFIG = { ...TSCONFIG_GOC.compilerOptions, types: ['node'] };

/**
 * Chỗ TypeScript 6.0.3 (bản chạy được trong trình duyệt) lệch mã lỗi với tsc 7.0.2 của khoá — đo bằng
 * `KIEM_TSC=<tsc 6.0.3> node scripts/ts/kiem-de-ts.mjs …` (01/11/2026): 47/48 đề khớp; riêng dòng dưới, 7.0.2 báo
 * TS2739 (thiếu thuộc tính) còn 6.0.3 báo TS2345 bọc ngoài cùng một lỗi ⇒ kiểm đó nhận CẢ HAI mã.
 * Bộ xuất kiểm lại: mã thêm vào phải đúng là mã 6.0.3 báo trên lời giải (không thì báo lỗi).
 */
export const MA_THEM_TS6 = {
  'ts-cl-1-2-d': { 'kiem/sai.ts:6': ['TS2345'] },
};

/** regex cấm ⇒ chữ người đọc được (bỏ \\b, \\s, ký tự thoát) — chỉ để hiện, máy chấm dùng regex gốc. */
const TEN_MAU = {
  '\\bany\\b': 'any', '@ts-': '@ts-… comments', '@ts-ignore': '@ts-ignore', '@ts-nocheck': '@ts-nocheck', '@ts-expect-error': '@ts-expect-error',
  '\\bas\\s+(unknown|number|string|any)\\b': 'as unknown / number / string / any', 'seats:\\s*string': 'seats: string', 'start:\\s*string': 'start: string',
  'type ContentType\\s*=': 'a second hand-written type ContentType =', 'as BookingInput': 'as BookingInput', '\\]!': 'the non-null assertion labs[0]!',
  '\\bas\\b': 'every "as" cast', '\\bas\\s+(BookingInput|Role)\\b': 'as BookingInput / as Role', 'createBooking\\(\\s*\\{': 'an object literal written inside createBooking({ … })',
  ':\\s*number\\s*=\\s*0': 'a redundant ": number = 0"', '\\(\\w+:\\s*\\w+\\)\\s*:': 'a redundant return type on a callback', ':\\s*Booking\\[\\]\\s*=': 'a redundant ": Booking[] ="',
  ':\\s*string\\[\\]\\s*=': 'a redundant ": string[] ="', '\\bas\\s+(?!const\\b)': 'as casts (as const is fine)', '[\\w)\\]]!(?!=)': 'the non-null assertion !',
  "LabCode =\\s*'": "a hand-written LabCode = '…' union", '\\bas (?!(const|a|an|the)\\b)\\w': 'as casts (as const is fine)', '\\bas\\s+(?!const\\b)\\w+': 'as casts (as const is fine)',
  '[\\w$]+!(?=[.\\[;,)\\s])': 'the non-null assertion !',
};
const docMau = (m) => TEN_MAU[m] ?? `/${m}/`;
const CAM_MAC_DINH = ['\\bany\\b', '@ts-ignore', '@ts-nocheck', '@ts-expect-error'];

const hai = (s) => { const [en, vi] = String(s).split('|||'); return vi ? { en, vi } : en; };
const en = (s) => String(s).split('|||')[0];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s) => `<code>${esc(s)}</code>`;

/** Tên bài học (EN|||VI) theo slug — đọc từ chính các tệp chương của khoá. */
let TEN_BAI = null;
async function tenBai(slug) {
  if (!TEN_BAI) {
    TEN_BAI = {};
    const khoa = (await import(path.join(KHOA_DIR, '..', 'typescript.mjs'))).default;
    for (const s of khoa.sections) for (const l of s.lessons || []) TEN_BAI[l.slug] = l.title;
  }
  return TEN_BAI[slug] ?? null;
}

function dongExpect(s) {
  const out = [];
  String(s || '').split('\n').forEach((t, i) => {
    const m = /\/\/ expect (TS\d+)\s*$/.exec(t);
    if (m) out.push({ dong: i + 1, ma: m[1], ma_nguon: t.replace(/\/\/ expect TS\d+\s*$/, '').trim() });
  });
  return out;
}

/** Bộ kiểm của máy chấm trình duyệt từ `kiem` của khoá. */
export function dungKiem(d) {
  const k = d.kiem;
  const tepHoc = Object.keys(d.khoiDau);
  const ten = tepHoc.join(', ');
  const out = [];
  if (k.sach) {
    const them = k.sach.length ? ` + ${k.sach.join(', ')}` : '';
    out.push({ kiem: 'sach', tep: k.sach, moTa: `tsc (strict): ${ten}${them} compile with 0 errors · biên dịch sạch` });
  }
  for (const f of k.phaiLoi || []) {
    for (const x of dongExpect(d.coDinh[f])) {
      const them = MA_THEM_TS6[d.id]?.[`${f}:${x.dong}`] ?? [];
      out.push({ kiem: 'phai-loi', tep: f, dong: x.dong, ma: [x.ma, ...them], moTa: `${f}:${x.dong} is refused with ${x.ma} — ${x.ma_nguon} · dòng này phải bị tsc từ chối` });
    }
    out.push({ kiem: 'khong-loi-la', tep: f, moTa: `every other line of ${f} still compiles · các dòng còn lại vẫn biên dịch` });
  }
  if (k.loiTsc) {
    for (const m of k.loiTsc) out.push({ kiem: 'co-ma', ma: m, moTa: `tsc reports ${m} on ${ten} · tsc báo đúng ${m}` });
    out.push({ kiem: 'chi-ma', ma: k.loiTsc, moTa: k.loiTsc.length ? `no error code other than ${k.loiTsc.join(' and ')} · không có mã lỗi nào khác` : `tsc: 0 errors · không lỗi` });
  }
  (k.chay || []).forEach((lenh, i) => {
    const ra = i === 0 && k.ra != null ? k.ra : undefined;
    out.push({ kiem: 'chay', lenh, ...(ra != null ? { ra } : {}), moTa: `${lenh} exits 0${ra != null ? ` and prints "${ra.split('\n')[0]}${ra.includes('\n') ? '…' : ''}"` : ''} · chạy như Node 22` });
  });
  const cam = k.cam || CAM_MAC_DINH;
  out.push({ kiem: 'cam', mau: cam, moTa: `no forbidden shortcut (${cam.map(docMau).slice(0, 4).join(', ')}${cam.length > 4 ? ', …' : ''}) · không dùng lối tắt bị cấm` });
  return out;
}

function yeuCauTu(d) {
  const k = d.kiem;
  const ten = Object.keys(d.khoiDau).map(code).join(', ');
  const E = [], V = [];
  E.push(`Edit ${ten}. The other files (tests, ${code('kiem/…')}, helpers) belong to the grader: it always uses the original copy.`);
  V.push(`Sửa ${ten}. Các tệp còn lại (test, ${code('kiem/…')}, tệp phụ) là của máy chấm: nó luôn dùng bản gốc.`);
  if (k.sach) {
    E.push(`${code('tsc')} with the course tsconfig (strict, noUncheckedIndexedAccess, nodenext) reports <b>0 errors</b> on your files${k.sach.length ? ` + ${k.sach.map(code).join(', ')}` : ''}.`);
    V.push(`${code('tsc')} với tsconfig của khoá (strict, noUncheckedIndexedAccess, nodenext) báo <b>0 lỗi</b> trên tệp của bạn${k.sach.length ? ` + ${k.sach.map(code).join(', ')}` : ''}.`);
  }
  for (const f of k.phaiLoi || []) {
    const ds = dongExpect(d.coDinh[f]);
    E.push(`Each line of ${code(f)} that ends in ${code('// expect TSxxxx')} is refused with exactly that code (${ds.map((x) => x.ma).join(', ')}); its other lines still compile.`);
    V.push(`Mỗi dòng của ${code(f)} kết thúc bằng ${code('// expect TSxxxx')} bị từ chối với đúng mã đó (${ds.map((x) => x.ma).join(', ')}); các dòng khác vẫn biên dịch.`);
  }
  if (k.loiTsc) {
    E.push(k.loiTsc.length ? `${code('tsc')} on your file reports exactly the codes ${k.loiTsc.map(code).join(' and ')} — no other code.` : `${code('tsc')} on your file reports no error.`);
    V.push(k.loiTsc.length ? `${code('tsc')} trên tệp của bạn báo đúng các mã ${k.loiTsc.map(code).join(' và ')} — không mã nào khác.` : `${code('tsc')} trên tệp của bạn không báo lỗi.`);
  }
  for (const [i, l] of (k.chay || []).entries()) {
    const ra = i === 0 && k.ra != null ? k.ra : null;
    E.push(`${code(l)} exits with code 0${ra ? ` and prints ${code(ra.split('\n')[0])}${ra.includes('\n') ? ' (and the following lines)' : ''}` : ''} — Node 22 runs the .ts files by stripping the types.`);
    V.push(`${code(l)} thoát với mã 0${ra ? ` và in ${code(ra.split('\n')[0])}${ra.includes('\n') ? ' (cùng các dòng sau)' : ''}` : ''} — Node 22 chạy tệp .ts bằng cách bỏ kiểu.`);
  }
  const cam = k.cam || CAM_MAC_DINH;
  E.push(`No forbidden shortcut in your files: ${cam.map((m) => code(m)).join(', ')}.`);
  V.push(`Không dùng lối tắt bị cấm trong tệp của bạn: ${cam.map((m) => code(m)).join(', ')}.`);
  return { en: E, vi: V };
}

function viDuTu(d) {
  const k = d.kiem;
  for (const f of k.phaiLoi || []) {
    const x = dongExpect(d.coDinh[f])[0];
    if (x) return [{
      input: { en: `${f}, line ${x.dong}: ${x.ma_nguon}`, vi: `${f}, dòng ${x.dong}: ${x.ma_nguon}` },
      output: `error ${x.ma}`,
      explanation: { en: 'With the right types, tsc refuses this call/assignment with exactly this error code. With missing or too loose types (any, string, number[]…) the line compiles and the check fails.', vi: 'Có kiểu đúng thì tsc từ chối lời gọi/phép gán này với đúng mã lỗi đó. Thiếu kiểu hoặc kiểu quá lỏng (any, string, number[]…) thì dòng biên dịch được và kiểm trượt.' },
    }];
  }
  if (k.ra != null && k.chay?.length) return [{
    input: k.chay[0], output: k.ra,
    explanation: { en: 'The program must still print exactly this once the types are fixed — types are erased when Node runs the file, so they cannot change the output, only refuse wrong code.', vi: 'Chương trình vẫn phải in đúng như vậy sau khi sửa kiểu — kiểu bị xoá khi Node chạy tệp nên không đổi được output, chỉ từ chối code sai.' },
  }];
  if (k.loiTsc) return [{
    input: { en: `tsc on ${Object.keys(d.khoiDau).join(', ')}`, vi: `tsc trên ${Object.keys(d.khoiDau).join(', ')}` },
    output: k.loiTsc.map((m) => `error ${m}`).join('\n') || '(no error)',
    explanation: { en: 'Exactly these codes — one more or one fewer and the check fails.', vi: 'Đúng các mã này — thừa hay thiếu một mã là kiểm trượt.' },
  }];
  const lenh = k.chay?.[0];
  return [{
    input: lenh || 'tsc', output: lenh ? 'exit code 0 (all tests pass)' : '0 errors',
    explanation: { en: 'The tests are fixed: make the types honest without changing what the code does.', vi: 'Bộ test cố định: làm kiểu trung thực mà không đổi việc code làm.' },
  }];
}

function goiYTu(d) {
  const k = d.kiem;
  const out = [{
    en: 'Press Run first: every check is listed with what tsc or Node reported. Start from the first red one — fixing one type often fixes several lines.',
    vi: 'Bấm Chạy trước: mỗi kiểm ghi rõ tsc hoặc Node đã báo gì. Bắt đầu từ kiểm đỏ đầu tiên — sửa một kiểu thường sửa được nhiều dòng.',
  }];
  if (k.phaiLoi?.length) out.push({
    en: `Read ${k.phaiLoi.join(', ')}: each "// expect TSxxxx" line is a WRONG call that your types must refuse. If a line compiles, your type is too loose there (any, string instead of a literal union, an optional parameter…).`,
    vi: `Đọc ${k.phaiLoi.join(', ')}: mỗi dòng "// expect TSxxxx" là một lời gọi SAI mà kiểu của bạn phải từ chối. Dòng nào còn biên dịch được là kiểu ở đó quá lỏng (any, string thay cho union literal, tham số tuỳ chọn…).`,
  });
  if (k.loiTsc) out.push({
    en: 'This one is the other way round: write code that makes tsc report exactly the listed codes. Look each code up in lesson 0.2 (reading tsc errors).',
    vi: 'Bài này ngược lại: viết code để tsc báo ĐÚNG các mã đã cho. Tra từng mã ở bài 0.2 (đọc lỗi tsc).',
  });
  if (k.chay?.length) out.push({
    en: 'Types are erased at run time: the tests (and any printed output) only pass if the code still DOES the right thing — a cast (as) or a ! that lies to tsc still crashes or prints the wrong value.',
    vi: 'Kiểu bị xoá lúc chạy: test (và output) chỉ xanh khi code vẫn LÀM đúng — một phép ép kiểu (as) hay dấu ! nói dối tsc vẫn sập hoặc in sai.',
  });
  const cam = k.cam || CAM_MAC_DINH;
  if (cam.length > CAM_MAC_DINH.length || cam.some((m) => !CAM_MAC_DINH.includes(m))) out.push({
    en: `Shortcuts are refused here: ${cam.map(docMau).join(' · ')} — this check reads your files as text, so these spellings are refused even where tsc would accept them.`,
    vi: `Lối tắt bị cấm ở bài này: ${cam.map(docMau).join(' · ')} — kiểm này đọc tệp của bạn như văn bản, nên các cách viết này bị từ chối kể cả khi tsc chấp nhận.`,
  });
  return out;
}

/** Một đề của bộ luyện từ đề của khoá. */
export function deTs(id) {
  const d = DE_KHOA.find((x) => x.id === id);
  if (!d) throw new Error(`không có đề ${id} trong _de-codelab-ts.json`);
  const kiem = dungKiem(d);
  const tenHoc = Object.keys(d.khoiDau);
  const [moEn, moVi] = String(d.moTa).split('|||');
  return {
    tieuDe: hai(d.tieuDe),
    ngonNgu: 'typescript',
    doKho: d.doKho,
    phut: d.phut,
    ...(id.startsWith('ts-cl-lab-') ? { dangBai: 'lab' } : {}),
    khaiNiem: ['tsc --noEmit (strict)', ...(d.kiem.phaiLoi ? ['type-level mutation: wrong calls must be refused'] : []), ...(d.kiem.chay ? ['node --test (types stripped)'] : [])],
    tienQuyet: [],
    the: ['typescript', 'tsc', 'labflow-ts', d.bai],
    moTa: { en: moEn, vi: moVi ?? moEn },
    yeuCau: yeuCauTu(d),
    dauVao: { en: `Your file(s): ${tenHoc.join(', ')} (TypeScript, the course tsconfig).`, vi: `Tệp của bạn: ${tenHoc.join(', ')} (TypeScript, tsconfig của khoá).` },
    dauRa: { en: 'tsc clean where it must be clean, refused where it must be refused, and the program/tests still run.', vi: 'tsc sạch ở chỗ phải sạch, từ chối ở chỗ phải từ chối, và chương trình/test vẫn chạy đúng.' },
    rangBuoc: [
      { en: 'Graded in your browser with TypeScript 6.0.3 (the JavaScript build of the compiler; the course uses tsc 7.0.2 — same language, same checks).', vi: 'Chấm ngay trong trình duyệt bằng TypeScript 6.0.3 (bản JavaScript của trình biên dịch; khoá dùng tsc 7.0.2 — cùng ngôn ngữ, cùng phép kiểm).' },
      { en: 'Run-time checks: node:test + node:assert/strict only, no file system or network.', vi: 'Kiểm lúc chạy: chỉ node:test + node:assert/strict, không có hệ thống tệp hay mạng.' },
    ],
    viDu: viDuTu(d),
    goiY: goiYTu(d),
    loiHayGap: [], // bộ xuất viết từ saiMau + các kiểm đã bắt nó
    giaiThich: {
      en: `<p>The reference solution is in the Solution tab, with comments on every type it adds. It passes because the grader checks the same three things as the course's own checker (scripts/ts/kiem-de-ts.mjs): the files compile under the strict course tsconfig, every wrong call in the grader's files is refused with the expected error code, and the program still behaves the same when Node strips the types and runs it.</p><p>The usual wrong answers — ${d.saiMau.map((s) => esc(en(s.nhan))).join('; ')} — each fail at least one of those checks: see "Common mistakes".</p>`,
      vi: `<p>Lời giải tham khảo ở tab Lời giải, có chú thích cho từng kiểu thêm vào. Nó đạt vì máy chấm kiểm đúng ba điều như máy chấm của khoá (scripts/ts/kiem-de-ts.mjs): các tệp biên dịch sạch với tsconfig strict của khoá, mọi lời gọi sai trong tệp của máy chấm bị từ chối với đúng mã lỗi, và chương trình vẫn chạy y như cũ khi Node bỏ kiểu rồi chạy.</p><p>Các bài làm sai hay gặp — ${d.saiMau.map((s) => esc(String(s.nhan).split('|||')[1] ?? en(s.nhan))).join('; ')} — đều trượt ít nhất một kiểm: xem "Lỗi hay gặp".</p>`,
    },
    // tệp người học trước (mở đầu tiên), rồi tệp của đề để đọc — máy chấm luôn dùng bản coDinh gốc
    khoiDau: { ...d.khoiDau, ...d.coDinh },
    loiGiai: { ...d.loiGiai, ...d.coDinh },
    tests: { loai: 'ts', phienBan: 1, tsconfig: TSCONFIG, coDinh: d.coDinh, tepHoc: tenHoc, timeoutMs: 5000, kiem },
    saiMau: d.saiMau,
  };
}

const MUC = (slug) => { const m = /^typescript-(\d+)-(\d+)-/.exec(slug); return m ? `${m[1]}.${m[2]}` : ''; };

/** Một module = một bài học (slug bài) — mọi đề có `bai` = slug, theo thứ tự trong tệp của khoá. */
export async function moduleTuBai(slug) {
  const ds = DE_KHOA.filter((d) => d.bai === slug);
  if (!ds.length) throw new Error(`không có đề nào gắn bài ${slug}`);
  const t = await tenBai(slug);
  if (!t) throw new Error(`không tìm thấy bài ${slug} trong content/courses/typescript.mjs`);
  return {
    slug,
    // tên bài đã mở đầu bằng số ("1.1 — …") thì giữ; không (Start here, Lab) thì thêm số mục lấy từ slug
    ten: /^\d+\.\d+\s/.test(en(t)) ? en(t) : `${MUC(slug)} ${en(t)}`,
    khoa: KHOA,
    baiHoc: slug,
    ngonNgu: 'typescript',
    de: ds.map((d) => deTs(d.id)),
  };
}
