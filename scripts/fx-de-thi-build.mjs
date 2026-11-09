/**
 * fx-de-thi-build.mjs — đưa đề thi thật đã tải (ảnh trang đề + tệp đề cho) vào Phòng thi.
 *
 * Nguồn: thư mục do scripts/fx-tai-anh.mjs tải về (mặc định ~/Downloads/De-thi-fuexam-0911/<MÃ>/<đề>/_de.json + ảnh).
 * Mỗi đề ⇒ một exam PE/WRITE: mỗi TRANG ẢNH là một câu (ảnh đề gốc + ô viết bài làm, AI chấm như PE WRITE sẵn có).
 * Đề chưa chép thành câu trắc nghiệm có đáp án — đó là việc nâng cấp sau (build-fe-exam.mjs).
 * Nhãn đề CHỈ ghi kỳ + loại + mã đề (vd "SU26 · FE · B5"), KHÔNG ghi nguồn (user chốt 09/11/2026).
 *
 *   node --env-file=.env scripts/fx-de-thi-build.mjs [--nguon <dir>] [--ma ACC101,PRF192] [--khong-day] [--dry]
 *
 * Ra: content/exams/<MÃ>-DE-GOC.mjs (một tệp/môn, nhiều đề) + content/exams/_de-goc-bao-cao.json.
 * Ảnh ⇒ R2 images/exam-questions/<MÃ>/<code>/<tên tệp> (bỏ qua tệp đã có — HEAD trước khi PUT).
 */
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const val = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const NGUON = val('--nguon') || path.join(os.homedir(), 'Downloads/De-thi-fuexam-0911');
const NGUON_CU = val('--nguon-cu') || path.join(os.homedir(), 'Downloads/De-thi-fuexam');
const CHI = val('--ma') ? new Set(val('--ma').split(',')) : null;
const DRY = args.includes('--dry');
const KHONG_DAY = args.includes('--khong-day') || DRY;
const OUT = 'content/exams';

const ANH = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif' };
const TEP = { '.zip': 'application/zip', '.rar': 'application/vnd.rar', '.pdf': 'application/pdf', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.doc': 'application/msword', '.txt': 'text/plain', '.sql': 'text/plain' };

let s3 = null;
if (!KHONG_DAY) {
  const thieu = ['R2_BUCKET_NAME', 'R2_ENDPOINT_URL', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_URL'].filter((k) => !process.env[k]);
  if (thieu.length) { console.error(`✗ thiếu env: ${thieu.join(', ')} (chạy với --env-file=.env)`); process.exit(1); }
  s3 = new S3Client({ region: process.env.R2_REGION || 'auto', endpoint: process.env.R2_ENDPOINT_URL,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } });
}
const BASE = (process.env.R2_PUBLIC_URL || 'https://media.cuongthai.com').replace(/\/$/, '');

async function day(file, key, ct) {
  const url = `${BASE}/${key}`;
  if (KHONG_DAY) return url;
  try { await s3.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key })); return url; } catch {}
  for (let lan = 1; lan <= 3; lan++) {
    try {
      await s3.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: fs.readFileSync(file), ContentType: ct, CacheControl: 'public, max-age=31536000, immutable' }));
      return url;
    } catch (e) { if (lan === 3) throw e; await new Promise((r) => setTimeout(r, 2000 * lan)); }
  }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sach = (s) => String(s).replace(/fu\s*exam(\.me)?/gi, '').replace(/fuoverflow/gi, '').trim();
const LOAI_VI = { FE: 'Thi cuối kỳ', PE: 'Thi thực hành', PT: 'Kiểm tra tiến độ', ASS: 'Assignment', LAB: 'Lab', QUIZ: 'Quiz' };

const monCo = new Set(fs.readdirSync('content/academy').filter((f) => /^[A-Z].*\.mjs$/.test(f)).map((f) => f.replace('.mjs', '')));
const baoCao = { taoLuc: new Date().toISOString(), mon: {}, boQua: [] };

// tải song song có giới hạn
async function pool(items, n, fn) {
  let i = 0; const out = [];
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}

for (const ma of fs.readdirSync(NGUON).sort()) {
  if (CHI && !CHI.has(ma)) continue;
  const dirMa = path.join(NGUON, ma);
  if (!fs.statSync(dirMa).isDirectory()) continue;
  if (!monCo.has(ma)) { baoCao.boQua.push({ ma, lyDo: 'chưa có môn trong content/academy' }); continue; }
  const exams = [];
  const codeDaDung = new Set();
  const deList = fs.readdirSync(dirMa).filter((d) => fs.existsSync(path.join(dirMa, d, '_de.json')));
  for (const d of deList) {
    const dir = path.join(dirMa, d);
    const de = JSON.parse(fs.readFileSync(path.join(dir, '_de.json'), 'utf8'));
    // Đề đã tải từ đợt 30/10 (daCo3010) chỉ có _de.json ở đây — ảnh nằm ở thư mục cũ <NGUON_CU>/<MÃ>/<slug>/.
    const coAnh = (p) => fs.existsSync(p) && fs.readdirSync(p).some((f) => ANH[path.extname(f).toLowerCase()]);
    let dirAnh = dir;
    if (!coAnh(dir)) {
      const slug = (String(de.href || '').match(/\/threads\/([^/.]+)/) || [])[1];
      const cu = slug && path.join(NGUON_CU, ma, slug);
      if (cu && coAnh(cu)) dirAnh = cu;
    }
    const tepTrongThuMuc = fs.readdirSync(dirAnh).sort();
    const anh = tepTrongThuMuc.filter((f) => ANH[path.extname(f).toLowerCase()]);
    const kem = tepTrongThuMuc.filter((f) => TEP[path.extname(f).toLowerCase()]);
    if (!anh.length) { baoCao.boQua.push({ ma, de: de.title, lyDo: 'không có ảnh trang đề' }); continue; }
    // "ACC101 - SU26 - B5 - FE - RE" ⇒ phần sau mã môn, bỏ kỳ + loại ⇒ ["B5","RE"]
    const phan = String(de.title).split(/\s+-\s+/).map((x) => x.trim()).filter(Boolean);
    const con = phan.filter((x, i) => !(i === 0 && x.toUpperCase().startsWith(ma.toUpperCase())) && x !== de.ky && x.toUpperCase() !== String(de.loai).toUpperCase());
    const loai = String(de.loai || 'FE').toUpperCase();
    let code = [de.ky, loai, ...con].join('-').replace(/[^A-Za-z0-9-]+/g, '').slice(0, 50) || `DE-${de.id}`;
    if (codeDaDung.has(code)) code = `${code}-${de.id}`.slice(0, 60);
    codeDaDung.add(code);
    const nhanEn = [de.ky, loai, ...con].join(' · ');
    const nhanVi = [de.ky, loai, ...con.map((x) => (x === 'RE' ? 'Thi lại' : x))].join(' · ');
    const prefix = `images/exam-questions/${ma}/${code}`;
    const urlAnh = await pool(anh, 6, (f) => day(path.join(dirAnh, f), `${prefix}/${f}`, ANH[path.extname(f).toLowerCase()]));
    const urlKem = await pool(kem, 2, (f) => day(path.join(dirAnh, f), `files/exam-given/${ma}/${code}/${f}`, TEP[path.extname(f).toLowerCase()]));
    const ghiChu = (Array.isArray(de.baiViet) ? de.baiViet : []).map((b) => sach(b.chu || '')).filter((t) => t.length > 60);
    const linkNgoai = (Array.isArray(de.linkNgoai) ? de.linkNgoai : []).filter((u) => /^https?:\/\//.test(u) && !/fuexam|fuoverflow/i.test(u));
    const khoiKem = (urlKem.length || linkNgoai.length)
      ? `<p><b>Given files / Tệp đề cho:</b></p><ul>${urlKem.map((u, i) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(kem[i])}</a></li>`).join('')}${linkNgoai.map((u) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(u)}</a></li>`).join('')}</ul>` : '';
    const khoiGhiChu = ghiChu.length ? `<p><b>Notes on the paper / Ghi chú kèm đề:</b></p>${ghiChu.map((t) => `<pre>${esc(t).slice(0, 4000)}</pre>`).join('')}` : '';
    const n = anh.length;
    const diem = Math.round((10 / n) * 100) / 100;
    exams.push({
      kind: 'PE', peType: 'WRITE', code,
      title: `${ma} — ${nhanEn} (original paper)|||${ma} — ${nhanVi} (đề gốc)`,
      description: `Real ${LOAI_VI[loai] ? loai : 'exam'} paper ${nhanEn}: ${n} page image(s) of the original paper.|||Đề ${LOAI_VI[loai] || 'thi'} thật ${nhanVi}: ${n} ảnh trang đề gốc.`,
      durationMinutes: loai === 'PE' ? 90 : 60, totalPoints: 10, passMark: 5, source: 'REAL',
      shuffleQuestions: false, shuffleOptions: false, isPublished: true,
      instructions: `<div class="ml-en"><p>This is a real FPTU <b>${esc(nhanEn)}</b> paper for <b>${ma}</b>, shown as the original page images (one page per question).</p><ul><li>Multiple-choice page: write the letter(s) you choose and one line of reasoning.</li><li>Practical / essay page: write your answer or solution; you may attach a photo of your work.</li><li>AI grading compares your answer with the page image; treat the score as practice feedback, not an official mark.</li></ul>${khoiKem}${khoiGhiChu}</div><div class="ml-vi"><p>Đây là đề <b>${esc(nhanVi)}</b> thật của FPTU môn <b>${ma}</b>, hiển thị nguyên ảnh trang đề gốc (mỗi trang là một câu).</p><ul><li>Trang trắc nghiệm: ghi chữ cái đáp án bạn chọn và một dòng lý do.</li><li>Trang thực hành / tự luận: viết bài làm hoặc lời giải; có thể đính kèm ảnh bài làm.</li><li>AI chấm bằng cách so bài làm với ảnh đề — điểm chỉ để luyện tập, không phải điểm chính thức.</li></ul>${khoiKem}${khoiGhiChu}</div>`,
      questions: anh.map((f, i) => ({
        kind: 'WRITE', points: diem, imageUrl: urlAnh[i],
        prompt: `<div class="ml-en"><p><b>Page ${i + 1}/${n}</b> of the original paper — read the image and write your answer.</p></div><div class="ml-vi"><p><b>Trang ${i + 1}/${n}</b> của đề gốc — đọc ảnh rồi viết bài làm.</p></div>`,
        rubric: [{ id: 'dung', maxScore: 10, weight: 1, criterion: 'Answer is correct for the question(s) shown in the page image; for multiple choice the chosen letter(s) must match the correct option.|||Bài làm đúng với câu hỏi trong ảnh trang đề; với trắc nghiệm, chữ cái chọn phải khớp đáp án đúng.' }],
      })),
      _ky: de.kySo || 0,
    });
  }
  if (!exams.length) continue;
  exams.sort((a, b) => Number(b._ky) - Number(a._ky) || a.code.localeCompare(b.code));
  exams.forEach((e) => delete e._ky);
  baoCao.mon[ma] = exams.map((e) => e.code);
  const body = `// SINH TỰ ĐỘNG bởi scripts/fx-de-thi-build.mjs — đề thi thật dạng ảnh trang đề gốc. Chạy lại script, đừng sửa tay.\nexport default ${JSON.stringify({ course: { courseCode: ma }, exams }, null, 1)};\n`;
  if (!DRY) fs.writeFileSync(path.join(OUT, `${ma}-DE-GOC.mjs`), body);
  console.log(`✓ ${ma}: ${exams.length} đề (${exams.reduce((s, e) => s + e.questions.length, 0)} trang)`);
}
if (!DRY) fs.writeFileSync(path.join(OUT, '_de-goc-bao-cao.json'), JSON.stringify(baoCao, null, 1));
console.log(`\n${Object.keys(baoCao.mon).length} môn · ${Object.values(baoCao.mon).flat().length} đề · bỏ qua ${baoCao.boQua.length}`);
