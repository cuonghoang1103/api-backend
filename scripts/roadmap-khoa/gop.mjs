#!/usr/bin/env node
/**
 * Roadmap sơ đồ đầu khoá — BƯỚC 3: gộp kq.json từng chương (agy viết) thành `content/roadmap-khoa/<slugKhoa>.json`.
 *
 *   node scripts/roadmap-khoa/gop.mjs <thư mục khoá do chuan-bi.mjs tạo> [<thư mục khoá> …]
 *
 * Soát cứng (máy soạn có thể lỡ tay):
 *   · chỉ giữ slug bài có thật trong khoá; `canBietBai` phải đứng TRƯỚC bài đang xét (không thì bỏ);
 *   · `ketHopBai` không trỏ về chính nó; `ketHopKhoa` chỉ giữ slug có trong danh mục khoá trên web, không trỏ về chính khoá;
 *   · mỗi ý cắt ở 320 ký tự, bỏ xuống dòng / markdown;
 *   · chương thiếu kq.json hợp lệ ⇒ bỏ qua (web tự lùi về mô tả bài) và in cảnh báo.
 * Web đọc qua `GET /api/v1/courses/:slug/roadmap` (src/services/roadmapKhoa.ts).
 */
import fs from 'node:fs';
import path from 'node:path';
import { docKq, loiKq, Y } from './kiem-kq.mjs';

const GOC = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const RA = path.join(GOC, 'content', 'roadmap-khoa');
fs.mkdirSync(RA, { recursive: true });

const sach = (s) => String(s ?? '').replace(/\*\*|`/g, '').replace(/\s+/g, ' ').trim().slice(0, 320);

for (const thuMuc of process.argv.slice(2)) {
  const khoa = JSON.parse(fs.readFileSync(path.join(thuMuc, 'khoa.json'), 'utf8'));
  const thuTu = khoa.chuong.flatMap((c) => c.bai);
  const viTri = new Map(thuTu.map((s, i) => [s, i]));
  // Danh mục khoá (slug → tên) lấy từ chuong.md đầu tiên.
  const danhMuc = {};
  const c0 = fs.readdirSync(thuMuc).find((d) => /^c\d+$/.test(d));
  if (c0) {
    const md = fs.readFileSync(path.join(thuMuc, c0, 'chuong.md'), 'utf8');
    const phan = md.split('# DANH MỤC KHOÁ TRÊN WEB')[1] || '';
    for (const dong of phan.split('\n')) {
      const m = /^([a-z0-9-]+) — (.+)$/.exec(dong.trim());
      if (m) danhMuc[m[1]] = m[2].replace(/\s*\(Academy\)$/, '').trim();
    }
  }
  const ra = { khoa: khoa.slug, ten: khoa.ten, phienBan: 1, capNhat: new Date().toISOString().slice(0, 10),
    nguon: 'Antigravity (Gemini) soạn từ bài web gốc; Claude soát mẫu', chuong: {}, bai: {}, khoaTen: {} };
  let thieu = 0; let soBai = 0;
  for (const c of khoa.chuong) {
    const d = path.join(thuMuc, `c${String(c.i).padStart(2, '0')}`);
    const kq = fs.existsSync(d) ? docKq(d) : null;
    const loi = kq ? loiKq(kq, c.bai) : ['không có kq.json'];
    if (!kq) { thieu++; console.warn(`  ! ${khoa.slug} chương ${c.i} (${c.ten}): ${loi[0]} — bỏ qua`); continue; }
    if (loi.length) console.warn(`  ~ ${khoa.slug} chương ${c.i}: ${loi.slice(0, 3).join('; ')} — giữ phần hợp lệ`);
    if (kq._chuong?.hoc && c.bai[0]) ra.chuong[c.bai[0]] = { hoc: sach(kq._chuong.hoc), lamDuoc: sach(kq._chuong.lamDuoc) };
    for (const s of c.bai) {
      const b = kq[s];
      if (!b || Y.some((k) => typeof b[k] !== 'string' || !b[k].trim())) continue;
      const i = viTri.get(s);
      const ds = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
      const canBietBai = [...new Set(ds(b.canBietBai))].filter((x) => viTri.has(x) && viTri.get(x) < i).slice(0, 3);
      const ketHopBai = [...new Set(ds(b.ketHopBai))].filter((x) => viTri.has(x) && x !== s).slice(0, 3);
      const ketHopKhoa = [...new Set(ds(b.ketHopKhoa))].filter((x) => danhMuc[x] && x !== khoa.slug).slice(0, 2);
      ketHopKhoa.forEach((x) => { ra.khoaTen[x] = danhMuc[x]; });
      ra.bai[s] = {
        hoc: sach(b.hoc), canBiet: sach(b.canBiet), lamDuoc: sach(b.lamDuoc), ketHop: sach(b.ketHop),
        ...(canBietBai.length ? { canBietBai } : {}),
        ...(ketHopBai.length ? { ketHopBai } : {}),
        ...(ketHopKhoa.length ? { ketHopKhoa } : {}),
      };
      soBai++;
    }
  }
  const tep = path.join(RA, `${khoa.slug}.json`);
  fs.writeFileSync(tep, JSON.stringify(ra, null, 1) + '\n');
  console.log(`${khoa.slug}: ${soBai}/${thuTu.length} bài có mô tả · ${Object.keys(ra.chuong).length} chương${thieu ? ` · THIẾU ${thieu} chương` : ''} → ${path.relative(GOC, tep)}`);
}
