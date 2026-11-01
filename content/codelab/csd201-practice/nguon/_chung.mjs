/**
 * CSD201 practice (Data Structures & Algorithms, Java) · bộ dựng đề CHẠY TRÊN MÁY người học (01/11/2026).
 * Chép từ pro192-practice/nguon/_chung.mjs (cùng khuôn: manual + chayTaiMay + cham.mjs), bỏ phần LAB211/PE PRO192.
 *
 * Quyết định của chủ web 01/11: "Không cần chấm trên web — có đề, output, đáp án… đầy đủ để tôi tự làm trên máy cá nhân và
 * tự chạy tự chấm." ⇒ mọi đề `tests: { loai: 'manual', chayTaiMay }` (như 23 đề manual của testing-practice): trang hiện nút
 * "Tự đánh dấu đã giải"; code khởi đầu (⬇ "Tải .zip") mang theo:
 *   src/…            code của người học (starter: thân hàm thay bằng TODO; lời giải: bản đầy đủ)
 *   cham/…           lớp kiểm của đề (harness gọi lớp người học, soi cấu trúc bằng reflection) — chỉ đề OOP
 *   tests/N.in|.out  ca mẫu (ca ẩn KHÔNG có tệp, chỉ nằm mã hoá trong cham.mjs)
 *   cham.mjs         máy chấm Node (khuôn _cham-mau.mjs): javac → chạy từng ca (so output đã chuẩn hoá xuống dòng/khoảng
 *                    trắng cuối dòng, diff từng dòng) → luật mã nguồn (đề LAB211: luật thầy) → điểm. Cùng một tệp cho mọi đề,
 *                    khác mỗi khối `DE`.
 *
 * OUTPUT MONG ĐỢI không viết tay: `_dung.mjs` chạy LỜI GIẢI bằng chính cham.mjs (`--record`) rồi ghi `_ket-qua.json`
 * (khoá = id đề, kèm băm lời giải + ca) — nguồn đề đọc lại tệp đó. Đổi lời giải/ca mà chưa chạy _dung.mjs ⇒ bộ xuất báo lỗi.
 *
 * Khởi đầu suy ra từ lời giải bằng dấu:      //>> <mã giữ chỗ> ⏎ <dòng 2…>
 *                                              …thân lời giải…
 *                                            //<<
 * ⇒ khởi đầu thay cả khối bằng mã giữ chỗ (cùng thụt lề), lời giải bỏ hai dòng dấu. `khoiDau: { 'Tệp.java': '…' }` để
 * cho hẳn một tệp khởi đầu khác.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const DAY = path.dirname(fileURLToPath(import.meta.url));
export const KHOA = 'data-structures-and-algorithms';
const CACHE = path.join(DAY, '_ket-qua.json');
const MAU = fs.readFileSync(path.join(DAY, '_cham-mau.mjs'), 'utf8');
export const KIEM_JAVA = fs.readFileSync(path.join(DAY, '_Kiem.java'), 'utf8');

let cache = null;
const docCache = () => (cache ??= fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {});
/** _dung.mjs gom các đề cần chạy lời giải để ghi output mong đợi. */
export const CAN_GHI = [];

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** <code>…</code> có escape — dùng cho mọi tên kiểu generic trong đề (List<String> …). */
export const c = (s) => `<code>${esc(s)}</code>`;
/** khối <pre> có escape. */
export const pre = (s) => `<pre>${esc(String(s).replace(/^\n/, '').replace(/\s+$/, ''))}</pre>`;
export const j = String.raw;

/** Bỏ dấu //>> … //<< ⇒ { giai, khoi }. */
export function tachDau(src) {
  const lines = String(src).replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const giai = [], khoi = [];
  let trong = false;
  for (const l of lines) {
    const m = /^(\s*)\/\/>>\s?(.*)$/.exec(l);
    if (m) {
      if (trong) throw new Error('//>> lồng nhau');
      trong = true;
      for (const x of m[2].split('⏎')) khoi.push((m[1] + x.replace(/^ /, '').replace(/ $/, '')).replace(/\s+$/, ''));
      continue;
    }
    if (/^\s*\/\/<<\s*$/.test(l)) {
      if (!trong) throw new Error('//<< thừa');
      trong = false;
      continue;
    }
    giai.push(l);
    if (!trong) khoi.push(l);
  }
  if (trong) throw new Error('thiếu //<<');
  return { giai: giai.join('\n') + '\n', khoi: khoi.join('\n') + '\n' };
}

const bam = (x) => crypto.createHash('sha1').update(JSON.stringify(x)).digest('hex').slice(0, 16);
const hai = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : { en: v, vi: v });

/** Khối "chạy máy chấm" cuối đề (EN/VI) — lệnh chính xác cho Windows và macOS. */
function khoiChay(de, lang) {
  const nd = de.src === 'src' ? 'src/' : `${de.src}/`;
  if (lang === 'vi') {
    return `<h4>Chạy máy chấm trên máy bạn</h4>
<p>Website KHÔNG chấm bài này. Bấm <b>Tải .zip</b> ở khung code, giải nén, sửa code trong <code>${nd}</code>, rồi trong thư mục bài (thư mục chứa <code>cham.mjs</code>) chạy:</p>
<pre>node cham.mjs</pre>
<p>Giải nén ra một thư mục mang tên bài (gọi là <code>&lt;thư-mục&gt;</code>). <b>Windows</b> (PowerShell): <code>cd "$env:USERPROFILE\\Downloads\\&lt;thư-mục&gt;"</code> — cmd: <code>cd /d %USERPROFILE%\\Downloads\\&lt;thư-mục&gt;</code> — rồi <code>node cham.mjs</code>. <b>macOS</b> (Terminal): <code>cd ~/Downloads/&lt;thư-mục&gt;</code> rồi <code>node cham.mjs</code>. Mẹo: gõ <code>cd </code> rồi kéo thư mục vào cửa sổ terminal. Cần Node.js 18+ và JDK ${de.javaMin === 8 ? '8 trở lên (khuyên 17 hoặc 21)' : `${de.javaMin} trở lên`} — <code>javac -version</code> phải chạy được.</p>
<p>Máy chấm biên dịch <code>${nd}</code> bằng <code>javac</code>, chạy ${de.cases.length} ca (${de.cases.filter((x) => x.h).length} ca ẩn — không in trong đề), so output từng dòng (bỏ qua khoảng trắng cuối dòng và kiểu xuống dòng Windows/macOS), in diff dòng sai${de.rules.length || de.lab211 ? ', soát luật mã nguồn' : ''} rồi cho điểm. In <b>ALL CHECKS PASSED</b> ⇒ quay lại đây bấm <b>Tự đánh dấu đã giải</b>. <code>node cham.mjs --case 2 --show</code> in input và toàn bộ output của bạn cho ca 2.</p>`;
  }
  return `<h4>Run the grader on your machine</h4>
<p>The website does NOT grade this exercise. Press <b>Tải .zip</b> (download) above the code, unzip it, edit the code in <code>${nd}</code>, then inside the exercise folder (the one with <code>cham.mjs</code>) run:</p>
<pre>node cham.mjs</pre>
<p>The zip unpacks into a folder named after the exercise (<code>&lt;folder&gt;</code> below). <b>Windows</b> (PowerShell): <code>cd "$env:USERPROFILE\\Downloads\\&lt;folder&gt;"</code> — cmd: <code>cd /d %USERPROFILE%\\Downloads\\&lt;folder&gt;</code> — then <code>node cham.mjs</code>. <b>macOS</b> (Terminal): <code>cd ~/Downloads/&lt;folder&gt;</code> then <code>node cham.mjs</code>. Tip: type <code>cd </code> and drag the folder into the terminal window. You need Node.js 18+ and JDK ${de.javaMin === 8 ? '8 or newer (17 or 21 recommended)' : `${de.javaMin}+`} — <code>javac -version</code> must work.</p>
<p>The grader compiles <code>${nd}</code> with <code>javac</code>, runs ${de.cases.length} case(s) (${de.cases.filter((x) => x.h).length} hidden — not printed in this text), compares your output line by line (trailing spaces and Windows/macOS line endings ignored), prints a diff of the wrong lines${de.rules.length || de.lab211 ? ', checks the source rules' : ''} and gives a score. When it prints <b>ALL CHECKS PASSED</b>, come back and press <b>Tự đánh dấu đã giải</b> (self-mark as solved). <code>node cham.mjs --case 2 --show</code> prints the input and your whole output for case 2.</p>`;
}

/**
 * Một đề Java chạy trên máy.
 * spec: { id, tieuDe, doKho, phut, khaiNiem, the, moTa{en,vi}, yeuCau{en[],vi[]}, dauVao, dauRa, rangBuoc?,
 *         main ('Main' | 'main.Main' | lớp harness), tep { 'Main.java': lời giải có dấu //>> //<< } (dưới src/),
 *         khoiDau? { tệp: starter riêng }, harness? { 'KiemTra.java': … } (dưới cham/, kèm Kiem.java khi kiem: true),
 *         ca: [{ ten, vao | phien:[…], tepCa?:{}, an? }], quyTac?: [{ id, en, vi, re, flags?, file?, need? }], lab211?,
 *         java: 8 | 17 (bản javac --release để KIỂM — _dung.mjs), loose?, timeoutMs?, goiY, loiHayGap, giaiThich, thuatNgu?, dangBai? }
 */
export function deJava(s) {
  const javaMin = s.java ?? 8;
  const src = s.src ?? 'src';
  const giai = {}, khoi = {};
  for (const [f, text] of Object.entries(s.tep)) {
    const t = tachDau(text);
    giai[`${src}/${f}`] = t.giai;
    khoi[`${src}/${f}`] = t.khoi;
  }
  for (const [f, text] of Object.entries(s.khoiDau || {})) {
    if (text == null) delete khoi[`${src}/${f}`];
    else khoi[`${src}/${f}`] = String(text).replace(/^\n/, '').replace(/\s+$/, '') + '\n';
  }
  const harness = {};
  for (const [f, text] of Object.entries(s.harness || {})) harness[`cham/${f}`] = String(text).replace(/^\n/, '').replace(/\s+$/, '') + '\n';
  if (s.kiem !== false && Object.keys(harness).length) harness['cham/Kiem.java'] = KIEM_JAVA; // CSD201: mọi đề có lớp kiểm đều kèm Kiem (soi liên kết, hạn giờ)
  const caGoc = s.ca.map((x) => ({ name: hai(x.ten).en, ...(x.phien ? { sessions: x.phien.map(chuanVao) } : { input: chuanVao(x.vao ?? '') }), ...(x.tepCa ? { files: x.tepCa } : {}), ...(x.args ? { args: x.args } : {}) }));
  // tuỳ chọn chạy ảnh hưởng tới output ghi lại ⇒ vào khoá băm (chỉ khi có, để băm các đề cũ không đổi)
  const tuyChon = { ...(s.homNay ? { homNay: s.homNay } : {}), ...(s.captcha ? { captcha: s.captcha } : {}) };
  const khoaBam = bam({ giai, harness, caGoc, main: s.main, v: 1, ...(Object.keys(tuyChon).length ? { tuyChon } : {}) });
  const daGhi = docCache()[s.id];
  const coKq = daGhi && daGhi.bam === khoaBam;
  if (!coKq && !process.env.CSD201_DUNG) throw new Error(`${s.id}: output mong đợi chưa có / đã cũ — chạy: node content/codelab/csd201-practice/nguon/_dung.mjs`);
  const ra = coKq ? daGhi.ra : caGoc.map(() => null);
  // tệp của ca (data/*.csv của lab) giống nhau giữa các ca ⇒ lưu MỘT lần trong DE.shared, ca chỉ giữ khoá (cham.mjs gọn)
  const shared = {};
  const gonTep = (x) => {
    if (!x.files) return x;
    const k = 'f' + bam(x.files).slice(0, 8);
    shared[k] = x.files;
    const { files, ...rest } = x;
    return { ...rest, filesRef: k };
  };
  const cases = caGoc.map((x, i) => (s.ca[i].an ? { h: Buffer.from(JSON.stringify({ ...gonTep(x), expected: ra[i] }), 'utf8').toString('base64') } : { ...gonTep(x), expected: ra[i] }));
  const DE = {
    id: s.id, title: hai(s.tieuDe).en, src, extra: Object.keys(harness).length ? ['cham'] : [], main: s.main || 'Main', javaMin,
    timeoutMs: s.timeoutMs ?? (s.hen ? 20000 : 10000), loose: !!s.loose, lab211: !!s.lab211, release: s.release ?? 8, ...(s.jvm ? { jvm: s.jvm } : {}), ...tuyChon,
    rules: (s.quyTac || []).map((r) => ({ id: r.id, en: r.en, vi: r.vi, ...(r.same ? { same: r.same } : { re: r.re }), ...(r.flags ? { flags: r.flags } : {}), ...(r.file ? { file: r.file } : {}), ...(r.need ? { need: true } : {}), ...(r.raw ? { raw: true } : {}) })),
    cases,
    ...(Object.keys(shared).length ? { shared } : {}),
  };
  const cham = MAU.replace('/*@@DE@@*/null', JSON.stringify(DE, null, 1)).replace('@@TEN@@', `${s.id} — ${DE.title}`);
  const mau = {};
  s.ca.forEach((x, i) => {
    if (x.an || s.khongMau) return;
    if (x.phien) x.phien.forEach((p, k) => { mau[`tests/${i + 1}${k ? `-session${k + 1}` : ''}.in`] = chuanVao(p); });
    else mau[`tests/${i + 1}.in`] = caGoc[i].input || '\n';
    // tệp mà ca cần trong thư mục chạy (vd data/books.csv) — để tự chạy tay được: java -cp … Main < tests/1.in (trong tests/1/)
    for (const [f, t] of Object.entries(x.tepCa || {})) mau[`tests/${i + 1}/${f}`] = t;
    if (ra[i] != null) mau[`tests/${i + 1}.out`] = ra[i];
  });
  if (process.env.CSD201_DUNG) CAN_GHI.push({ id: s.id, bam: khoaBam, coKq, java: javaMin, src, giai, khoi, harness, cham, cases: caGoc });

  const moTa = hai(s.moTa), yc = s.yeuCau || { en: [], vi: [] };
  // ⏱ kiểm độ phức tạp: một ca chạy input LỚN trong luồng riêng có hạn giờ (Kiem.hen) — nói rõ trong đề
  const hen = s.hen ? khoiHen(s.hen) : { en: '', vi: '' };
  const viDu = s.ca.map((x, i) => [x, i]).filter(([x]) => !x.an).slice(0, s.soViDu ?? 2).map(([x, i]) => ({
    input: { en: x.phien ? x.phien.map((p, k) => `— session ${k + 1} —\n${p}`).join('\n') : (x.vao || '(no input)'), vi: x.phien ? x.phien.map((p, k) => `— lần chạy ${k + 1} —\n${p}`).join('\n') : (x.vao || '(không nhập gì)') },
    output: catDong(ra[i] ?? '(run _dung.mjs)', i),
    explanation: { en: `Case ${i + 1} — ${hai(x.ten).en}.`, vi: `Ca ${i + 1} — ${hai(x.ten).vi}.` },
  }));
  return {
    tieuDe: s.tieuDe,
    ngonNgu: 'java',
    doKho: s.doKho,
    phut: s.phut,
    ...(s.dangBai ? { dangBai: s.dangBai } : {}),
    khaiNiem: s.khaiNiem || [],
    tienQuyet: s.tienQuyet || [],
    the: ['java', 'csd201', 'dsa', 'run-locally', ...(s.the || [])],
    moTa: { en: `${moTa.en}\n${hen.en}${khoiChay(DE, 'en')}`, vi: `${moTa.vi}\n${hen.vi}${khoiChay(DE, 'vi')}` },
    yeuCau: yc,
    dauVao: s.dauVao,
    dauRa: s.dauRa,
    rangBuoc: [
      ...(s.rangBuoc || []),
      ...(s.hen ? [{ en: `Complexity: ${s.hen.can} — checked on n = ${s.hen.n} with a ${s.hen.ms / 1000} s limit.`, vi: `Độ phức tạp: ${s.hen.can} — kiểm với n = ${s.hen.n}, hạn ${s.hen.ms / 1000} giây.` }] : []),
      { en: `Java ${javaMin === 8 ? '8+ syntax only (it must also compile on the JDK 8 of the exam room)' : `${javaMin}+`}; no build tool — plain javac. Main class: ${DE.main}.`, vi: `Cú pháp Java ${javaMin === 8 ? '8 (phải biên dịch được cả trên JDK 8 của phòng thi)' : `${javaMin}+`}; không cần công cụ build — javac thuần. Lớp chạy: ${DE.main}.` },
    ],
    viDu,
    goiY: s.goiY,
    loiHayGap: s.loiHayGap,
    giaiThich: s.giaiThich,
    ...(s.thuatNgu ? { thuatNgu: s.thuatNgu } : {}),
    khoiDau: { ...khoi, ...harness, ...mau, ...(s.tepThem || {}), 'cham.mjs': cham },
    loiGiai: { ...giai, ...harness, ...mau, ...(s.tepThem || {}), 'cham.mjs': cham },
    tests: {
      loai: 'manual',
      chayTaiMay: {
        lenh: 'node cham.mjs', lyDo: 'java', runner: 'javac+java', java: javaMin, main: DE.main,
        tep: Object.keys(khoi).filter((f) => f.endsWith('.java')),
        ...(s.khoiDauLoi ? { khoiDauKhongBienDich: true } : {}),
        ca: DE.cases.length, caAn: DE.cases.filter((x) => x.h).length, luat: DE.rules.map((r) => r.id).concat(DE.lab211 ? ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'] : []),
      },
    },
    loaiKiem: 'manual',
  };
}
/**
 * Đoạn "⏱ Complexity check" của đề: { n: '200 000', ms: 3000, can: 'O(n log n)', cham: 'O(n²)', en?, vi? } — en/vi = câu
 * riêng của đề (vì sao bản chậm chậm). Hạn rộng: lời giải đúng chạy < 1/10 hạn trên máy thường; bản sai cần hàng chục giây.
 */
function khoiHen(h) {
  const s = h.ms / 1000;
  return {
    en: `<p><b>⏱ Complexity check.</b> One case runs your code on a large input (n = ${h.n}) inside a ${s}-second limit. An ${esc(h.can)} solution finishes in a fraction of a second on any ordinary laptop; ${h.cham ? `an ${esc(h.cham)} one` : 'a slower one'} needs far longer and the case prints <code>TOO SLOW</code>. ${h.en || ''} The limit is generous on purpose — if it fails, the algorithm is the problem, not your machine.</p>\n`,
    vi: `<p><b>⏱ Kiểm độ phức tạp.</b> Một ca chạy code của bạn với input LỚN (n = ${h.n}) trong hạn ${s} giây. Lời giải ${esc(h.can)} xong trong chưa tới một giây trên laptop bình thường; ${h.cham ? `bản ${esc(h.cham)}` : 'bản chậm hơn'} cần lâu hơn rất nhiều và ca in <code>TOO SLOW</code>. ${h.vi || ''} Hạn đặt rộng có chủ ý — trượt ca này thì do thuật toán, không phải do máy bạn.</p>\n`,
  };
}
/** Dấu vân tay tệp CHO SẴN (bỏ mọi khoảng trắng) — khớp sameRule trong _cham-mau.mjs. */
export const vanTay = (t) => crypto.createHash('sha1').update(String(t).replace(/\s+/g, '')).digest('hex').slice(0, 12);
/** Luật "không sửa tệp cho sẵn": giuNguyen({ 'Main.java': nội dung, … }). */
export function giuNguyen(tep, id = 'G1') {
  return {
    id, en: `the given files are unchanged (${Object.keys(tep).join(', ')})`, vi: `không sửa các tệp cho sẵn (${Object.keys(tep).join(', ')})`,
    same: Object.fromEntries(Object.entries(tep).map(([f, t]) => [f, vanTay(tachDau(t).giai)])),
  };
}

/** Ví dụ trong đề: output dài (lab) cắt còn 40 dòng, phần còn lại xem tests/N.out. */
function catDong(t, i) {
  const d = String(t).split('\n');
  return d.length <= 41 ? t : `${d.slice(0, 40).join('\n')}\n… (+${d.length - 40} lines — full expected output: tests/${i + 1}.out)`;
}
/** stdin của một ca: giữ NGUYÊN (dòng trống đầu là cố ý — kiểm "bắt buộc nhập"), luôn kết thúc bằng \n. */
function chuanVao(v) {
  const t = String(v);
  return t.endsWith('\n') ? t : t + '\n';
}

/** Một module (một bài học) — `slug` = slug bài học Academy. */
export function moDun({ slug, ten, de, baiHoc }) {
  return { slug, ten, khoa: KHOA, baiHoc: baiHoc || slug, ngonNgu: 'java', de };
}

/** Lỗi hay gặp dùng chung cho đề chạy chương trình (đề vẫn cần ≥ 1 lỗi riêng). */
export const LOI_CHUNG = {
  tenLop: { en: 'The public class name differs from the file name (public class Main must be in Main.java) — javac refuses to compile, the grader scores 0.', vi: 'Tên lớp public khác tên tệp (public class Main phải nằm trong Main.java) — javac từ chối biên dịch, máy chấm cho 0 điểm.' },
  inThem: { en: 'Printing extra text (a debug line, a different prompt, a missing space after ":") — the output is compared line by line, so one extra character fails the case.', vi: 'In thêm chữ (dòng gỡ lỗi, lời nhắc khác, thiếu dấu cách sau ":") — output so từng dòng, thừa một ký tự là trượt ca.' },
  nextInt: { en: 'Mixing nextInt() with nextLine(): the newline left by nextInt() is read as an empty line. Read every line with nextLine() and parse it.', vi: 'Trộn nextInt() với nextLine(): ký tự xuống dòng nextInt() để lại bị đọc thành dòng rỗng. Đọc mọi dòng bằng nextLine() rồi parse.' },
  soSanhChuoi: { en: 'Comparing strings with == instead of equals() — it compares references, so two equal texts read from the keyboard are "different".', vi: 'So chuỗi bằng == thay vì equals() — nó so tham chiếu, nên hai chuỗi giống nhau đọc từ bàn phím vẫn "khác nhau".' },
};

