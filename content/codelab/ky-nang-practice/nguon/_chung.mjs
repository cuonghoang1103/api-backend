/**
 * ky-nang-practice — "Kỹ năng nghề": 🎤 Thuyết trình & bảo vệ Q&A · 📝 Báo cáo kỹ thuật (28/10/2026).
 * ════════════════════════════════════════════════════════════════════════════════════════════
 * PHẦN DÙNG CHUNG (tệp bắt đầu bằng "_" ⇒ bộ xuất bỏ qua). Định dạng đề: content/codelab/README.md.
 * Thiết kế: ~/Documents/video-bai-giang/LO-TRINH-BO-SUNG-28-10.md §4.
 *
 * Gắn khoá Academy SSG105 (Communication and In-Group Working Skills): module slug = slug bài học
 *   ssg105-3-1-writing (Ch3 Written communication) · ssg105-4-1-presentation (Ch4 Presentations)
 * ⇒ thẻ "🏋️ Luyện tập" tự hiện dưới hai bài đó. Các module khác `ssg105-<chương>-…` ⇒ trang track xếp đúng chương.
 *
 * Kiểu chấm (chỉ dùng loại đã chạy): choice / order / table (khoá đáp án) và 'js' kiểm THUỘC TÍNH của văn bản
 * (số từ, có số liệu, đủ mục, không từ mơ hồ…). Chất lượng lập luận KHÔNG chấm được bằng máy — đề nào chấm cấu
 * trúc thì ghi rõ (LUU_Y) và kèm rubric tự chấm; chưa có máy chấm AI ('text-ai' là đợt sau).
 *
 * Dùng lại bộ dựng của SWT301 (tinh, hai, giai, lc, gon, doiDau) — không nhân bản mã.
 */
import { doiDau, tinh, hai, giai, lc as lcGoc, gon } from '../../swt301-practice/nguon/_chung.mjs';

export { doiDau, hai, giai };

/** Slug khoá Academy SSG105 (videoRef / nút "📺 Bài giảng"). */
export const KHOA = 'ssg105-communication-and-in-group-working-skills';

/** Ghi chú trung thực cho mọi đề chấm theo CẤU TRÚC (đưa vào yeuCau). */
export const LUU_Y = {
  en: '⚠ Honest note: the grader checks <b>structure, length, numbers and banned words only</b> — it cannot judge whether your argument is clear or convincing. AI rubric grading is not available yet; use the self-rubric and record yourself.',
  vi: '⚠ Nói thật: máy chấm chỉ kiểm <b>cấu trúc, độ dài, số liệu và từ cấm</b> — không đánh giá được lập luận có rõ, có thuyết phục không. Chưa có chấm bằng AI theo rubric; hãy dùng rubric tự chấm và tự ghi âm.',
};

const LC = 'abcdefghij';
const THE = ['ky-nang', 'ssg105'];

/** Băm FNV-1a của một chuỗi ⇒ hạt giống cố định (xuất lại vẫn như nhau). */
function bam(s) {
  let h = 2166136261;
  for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h;
}
/** Hoán vị cố định theo hạt giống; bảo đảm KHÔNG trùng thứ tự gốc (đề sắp xếp không được "đúng sẵn"). */
function hoanVi(n, hat) {
  let h = hat;
  const idx = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    const j = h % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  if (n > 1 && idx.every((x, i) => x === i)) idx.push(idx.shift());
  return idx;
}

/** Mô tả ngắn ⇒ thêm một câu hướng dẫn (bộ xuất đòi đề ≥ 300 ký tự). */
function duMoTa(moTa, loai) {
  if (!moTa || typeof moTa !== 'object' || String(moTa.en || '').length >= 220) return moTa;
  const them = {
    table: ['Each row is graded on its own; the explanation of every answer appears after you submit.', 'Mỗi dòng được chấm riêng; giải thích từng đáp án hiện sau khi nộp.'],
    choice: ['Each question is graded on its own; the explanation appears after you submit.', 'Mỗi câu được chấm riêng; giải thích hiện sau khi nộp.'],
    order: ['Drag the items into the right order; the explanation appears after you submit.', 'Kéo các mục về đúng thứ tự; giải thích hiện sau khi nộp.'],
  }[loai];
  return { en: `${moTa.en}<p>${them[0]}</p>`, vi: `${moTa.vi || ''}<p>${them[1]}</p>` };
}

function tinhDe(q, theThem = []) {
  const d = tinh(q);
  return { ...d, the: [...THE, ...theThem], dangBai: 'practice', thuatNgu: q.thuatNgu || [] };
}

/**
 * Bảng phân loại một cột: hang = [[câu EN, đáp án | [đáp án chấp nhận…], câu VI?]].
 * { tieuDe, doKho, phut, moTa:{en,vi}, cotCau?, cot, luaChon[], hang, deBang?:{en,vi}, giaiBang:[en,vi], goiY, loiHayGap, giaiThich, thuatNgu, khaiNiem, the? }
 */
export function phanLoai(q) {
  const { cot = 'Answer', luaChon, hang, deBang, cotCau, giaiBang, the = [], ...rest } = q;
  const dapAn = {};
  hang.forEach(([, d], i) => { dapAn[`r${i}.k`] = d; });
  return tinhDe({
    ...rest,
    moTa: duMoTa(rest.moTa, 'table'),
    loai: 'table',
    bang: [{
      ma: 'b1',
      de: deBang ? hai(deBang.en, deBang.vi) : hai('Choose the right value for every row.', 'Chọn giá trị đúng cho mỗi dòng.'),
      cot: [{ ma: 's', ten: cotCau || 'Statement' }, { ma: 'k', ten: cot, luaChon }],
      hang: hang.map(([en, , vi], i) => ({ ma: `r${i}`, o: { s: vi ? `${en} — <i>${vi}</i>` : en } })),
      dapAn,
      giaiThich: giai(giaiBang?.[0] || '', giaiBang?.[1] || ''),
    }],
  }, the);
}

/** Bảng tuỳ ý (nhiều bảng / nhiều cột) — truyền thẳng `bang` theo lược đồ table. */
export function bangDe(q) {
  const { the = [], ...rest } = q;
  return tinhDe({ ...rest, moTa: duMoTa(rest.moTa, 'table'), loai: 'table' }, the);
}

/** Xáo phương án theo băm câu hỏi ⇒ đáp án không dồn về "a". */
function xao(c) {
  if (c.giuThuTu) return { lc: c.lc, dap: c.dap };
  const idx = hoanVi(c.lc.length, bam(c.en));
  const doi = {};
  const lc = idx.map((cu, moi) => { doi[c.lc[cu][0]] = LC[moi]; return [LC[moi], c.lc[cu][1]]; });
  const dap = Array.isArray(c.dap) ? c.dap.map((d) => doi[d]).sort() : doi[c.dap];
  return { lc, dap };
}

/**
 * Trắc nghiệm: cau = [{ en, vi, lc:[[ma, nội dung]…], dap:'b' | ['a','c'] (nhieu), giai:[en, vi], nhieu?, giuThuTu? }]
 * giaiThich nên bắt đầu '<p>Answers: …' — bộ dựng tự thay bằng đáp án SAU khi xáo.
 */
export function tracNghiem(q) {
  const { cau, the = [], ...rest } = q;
  const da = cau.map(xao);
  const dapAnChu = da.map((x) => (Array.isArray(x.dap) ? x.dap.join('+') : x.dap)).join(' · ');
  return tinhDe({
    ...rest,
    giaiThich: { en: `<p>Answers: ${dapAnChu}.</p>${rest.giaiThich?.en ?? rest.giaiThich ?? ''}`, vi: `<p>Đáp án: ${dapAnChu}.</p>${rest.giaiThich?.vi ?? ''}` },
    moTa: duMoTa(rest.moTa, 'choice'),
    loai: 'choice',
    cauHoi: cau.map((c, i) => ({
      ma: `q${i + 1}`,
      de: hai(c.en, c.vi),
      luaChon: lcGoc(...da[i].lc),
      dapAn: Array.isArray(da[i].dap) ? [da[i].dap] : [da[i].dap],
      ...(c.nhieu ? { nhieu: true } : {}),
      giaiThich: giai(c.giai[0], c.giai[1]),
    })),
  }, the);
}

/** Sắp xếp: cau = [{ en, vi, dung:[nội dung theo ĐÚNG thứ tự], giai:[en, vi] }] — thứ tự hiện xáo cố định, không bao giờ đúng sẵn. */
export function sapXep(q) {
  const { cau, the = [], ...rest } = q;
  return tinhDe({
    ...rest,
    giaiThich: rest.giaiThich || {
      en: cau.map((c) => `<p><b>${c.en}</b>: ${c.dung.join(' → ')}.</p>`).join(''),
      vi: cau.map((c) => `<p><b>${c.vi || c.en}</b>: ${c.giai[1]}</p>`).join(''),
    },
    moTa: duMoTa(rest.moTa, 'order'),
    loai: 'order',
    cauHoi: cau.map((c, i) => {
      const muc = c.dung.map((noiDung, j) => ({ ma: LC[j], noiDung }));
      const hien = hoanVi(muc.length, bam(c.en) ^ 0x9e3779b9);
      return { ma: `q${i + 1}`, de: hai(c.en, c.vi), muc: hien.map((j) => muc[j]), dapAn: muc.map((m) => m.ma), giaiThich: giai(c.giai[0], c.giai[1]) };
    }),
  }, the);
}

/* ═══════════════════════════════ BÀI 'js' KIỂM VĂN BẢN ═══════════════════════════════ */

/**
 * Bộ công cụ đọc văn bản, NHÚNG vào mỗi kiểm (kiểm chạy trong realm mới). Dùng trong hàm kiểm qua `__V.*`.
 *   w(s) số từ (token có chữ/số) · nums(s) các con số · coTu(s, ds) từ/cụm có mặt (ranh giới Unicode — \b ASCII hỏng
 *   tiếng Việt) · cau(s) các câu · vague(s) từ mơ hồ · blame(s) cụm đổ lỗi · chao(s) mở bằng lời chào/giới thiệu tên.
 */
const VAN_BAN = gon(function () {
  const s = (v) => (typeof v === 'string' ? v : '');
  const low = (v) => s(v).toLowerCase();
  const tok = (v) => s(v).split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t));
  const esc = (d) => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const coTu = (v, ds) => {
    const t = low(v);
    return ds.filter((d) => new RegExp(`(?<![\\p{L}\\p{N}])${esc(d.toLowerCase())}(?![\\p{L}\\p{N}])`, 'u').test(t));
  };
  const VAGUE = ['fast', 'slow', 'quickly', 'many', 'some', 'a lot', 'lots of', 'good', 'bad', 'better', 'quite', 'fairly', 'several', 'soon', 'etc', 'stable', 'pretty much',
    'khá', 'ổn', 'nhanh', 'chậm', 'nhiều', 'một số', 'tốt', 'hơi', 'tương đối', 'vân vân'];
  const BLAME = ['careless', 'lazy', 'stupid', 'fault of', 'his fault', 'her fault', 'their fault', 'should have known', 'someone forgot', 'blame',
    'bất cẩn', 'lười', 'lỗi của bạn', 'lỗi của anh', 'lỗi của em', 'tại bạn', 'tại anh', 'đổ lỗi'];
  const FILLER = ['basically', 'actually', 'you know', 'kind of', 'sort of', 'um', 'uh', 'so yeah', 'like i said', 'kiểu như', 'thì là', 'ờ', 'à thì'];
  return {
    s, low, tok, coTu, VAGUE, BLAME, FILLER,
    w: (v) => tok(v).length,
    nums: (v) => s(v).match(/\d+(?:[.,]\d+)?%?/g) || [],
    cau: (v) => s(v).split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => /[\p{L}\p{N}]/u.test(x)),
    vague: (v) => coTu(v, VAGUE),
    blame: (v) => coTu(v, BLAME),
    filler: (v) => coTu(v, FILLER),
    chao: (v) => /^\s*(hello|hi|good (morning|afternoon|evening)|my name is|xin chào|chào (cô|thầy|các bạn)|em (tên là|xin tự giới thiệu)|em là)(?![\p{L}\p{N}])/iu.test(s(v)),
  };
});

/**
 * Một kiểm văn bản: fn = function () { … return 'OK' | 'giải thích' } — tự chứa, đọc biến của người học, dùng `__V`.
 * ex: { an?, nhom? }
 */
export function kiemVB(moTa, fn, ex = {}) {
  return {
    moTa,
    chuanBi: `const __KQ = (function () { var __V = (${VAN_BAN})(); try { return (${gon(fn)})(); } catch (e) { return (e && e.name === 'ReferenceError' ? 'missing: ' : 'error: ') + (e && e.message ? e.message : String(e)); } })();`,
    goi: '__KQ', mongDoi: 'OK', ...ex,
  };
}

/**
 * Bài 'js'. q = { …trường đề…, tep: { 'tên.js': [đầu, giải] }, tepNap?: [thứ tự nạp], kiem: [...], boYeu? }
 */
export function baiJs(q) {
  const { tep, kiem, tepNap, the = [], ...rest } = q;
  const khoiDau = {}, loiGiai = {};
  for (const [ten, [dau, giai_]] of Object.entries(tep)) { khoiDau[ten] = dau; loiGiai[ten] = giai_; }
  return {
    the: [...THE, ...the],
    ngonNgu: 'javascript',
    dangBai: 'practice',
    ...rest,
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: tepNap || Object.keys(tep), kiem },
    khoiDau, loiGiai,
  };
}

export function moDun({ slug, ten, moTaModule, baiHoc, de }) {
  return doiDau({ slug, ten, moTaModule, khoa: KHOA, baiHoc: baiHoc || slug, de });
}

/* ═══════════════════════════════ THUẬT NGỮ dùng chung ═══════════════════════════════ */
export const TN = {
  hook: { en: 'hook', vi: 'câu mở gây chú ý — một vấn đề, một con số, một câu hỏi (không phải "em xin chào")' },
  signpost: { en: 'signposting', vi: 'câu chuyển ý báo cho người nghe đang ở đâu ("Phần tiếp: kết quả…")' },
  takeaway: { en: 'takeaway', vi: 'điều người nghe mang về — một câu chốt' },
  headline: { en: 'assertion headline (action title)', vi: 'tiêu đề slide nói KẾT LUẬN, không chỉ nói chủ đề' },
  timebox: { en: 'time-box', vi: 'khung giờ cố định cho từng phần, hết giờ là chuyển' },
  wpm: { en: 'words per minute (wpm)', vi: 'số từ mỗi phút — thuyết trình rõ ràng ≈ 130' },
  prep: { en: 'PREP (Point–Reason–Example–Point)', vi: 'khung trả lời: Ý chính – Lý do – Ví dụ/bằng chứng – Chốt lại ý' },
  evidence: { en: 'evidence', vi: 'bằng chứng: log, ảnh chụp, dòng trong báo cáo, dòng mã' },
  qa: { en: 'Q&A / defence', vi: 'phần hỏi đáp / bảo vệ trước hội đồng' },
  bluf: { en: 'BLUF (bottom line up front)', vi: 'nói kết luận ngay câu đầu' },
  measurable: { en: 'measurable statement', vi: 'câu đo được — có số, đơn vị, mốc so sánh' },
  vague: { en: 'vague word (weasel word)', vi: 'từ mơ hồ: "khá", "nhanh", "nhiều", "ổn"…' },
  readme: { en: 'README', vi: 'tệp hướng dẫn đầu tiên của một kho mã: là gì, cài, chạy, test' },
  conventional: { en: 'Conventional Commits', vi: 'quy ước commit "type(scope): mô tả" — feat, fix, docs, test, refactor, chore…' },
  pr: { en: 'pull request (PR)', vi: 'yêu cầu gộp mã — kèm mô tả: làm gì, vì sao, đã kiểm thế nào' },
  postmortem: { en: 'post-mortem (incident review)', vi: 'báo cáo sau sự cố: chuyện gì xảy ra, vì sao, sẽ làm gì để không lặp lại' },
  blameless: { en: 'blameless', vi: 'không đổ lỗi cá nhân — tìm lỗ hổng của quy trình/hệ thống' },
  fiveWhys: { en: '5 Whys', vi: 'hỏi "vì sao" liên tiếp tới nguyên nhân gốc' },
  rootCause: { en: 'root cause', vi: 'nguyên nhân gốc — sửa nó thì sự cố không lặp lại' },
  actionItem: { en: 'action item', vi: 'việc cần làm sau sự cố — có người làm và hạn' },
  impact: { en: 'impact', vi: 'ảnh hưởng: ai bị, bao lâu, bao nhiêu' },
  linter: { en: 'linter', vi: 'công cụ soi văn bản/mã theo luật và báo chỗ vi phạm' },
  successfulCoverage: { en: 'successful coverage', vi: 'Pass ÷ Tổng ca — tỉ lệ ca đạt (Report 5.x)' },
  residualRisk: { en: 'residual risk', vi: 'rủi ro còn lại khi phát hành với lỗi chưa sửa' },
};
