/**
 * _api-kiem-slide.mjs — phép kiểm TỰ ĐỘNG cho deck khuôn .pg (_api-chung / _pg-chung): TRÀN dọc, TRÀN ngang (pre/table/code/.term),
 * TRỐNG (vùng nội dung < 70% khung), lấn phải. Chạy từ gốc repo:  node scripts/_api-kiem-slide.mjs scripts/slides-src/api-02-1.mjs
 * In "<deck>: N slide, K slide cần xem" — K phải bằng 0 trước khi upload (yêu cầu điều phối 31/10/2026).
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { slides, deck } = await import(pathToFileURL(path.resolve(process.argv[2])).href);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
let bad = 0;
for (const [i, s] of slides.entries()) {
  await p.setContent(`<html><head><style>*{box-sizing:border-box;margin:0;padding:0}body{width:1280px;height:720px;overflow:hidden}</style></head><body>${s.body}</body></html>`);
  const r = await p.evaluate(() => {
    const nd = document.querySelector('.pg .nd'); if (!nd) return { cover: true };
    const box = nd.getBoundingClientRect();
    let maxB = 0, maxR = 0, cut = [];
    for (const e of nd.querySelectorAll('*')) {
      const q = e.getBoundingClientRect(); if (!q.width && !q.height) continue;
      maxB = Math.max(maxB, q.bottom); maxR = Math.max(maxR, q.right);
      if (['PRE','TABLE','TD','TH','CODE'].includes(e.tagName) || e.classList.contains('vs') || e.classList.contains('term') || e.classList.contains('apireq')) { if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).display !== 'inline') cut.push(e.tagName.toLowerCase() + ' ngang ' + (e.scrollWidth - e.clientWidth)); }
    }
    return { over: nd.scrollHeight - nd.clientHeight, used: Math.round((maxB - box.top) / box.height * 100), right: Math.round(maxR), cut };
  });
  if (r.cover) continue;
  const issues = [];
  if (r.over > 2) issues.push(`TRÀN ${r.over}px`);
  if (r.right > 1250) issues.push(`lấn phải ${r.right}`);
  if (r.used < 70) issues.push(`trống (dùng ${r.used}%)`);
  if (r.cut.length) issues.push(r.cut.join(','));
  if (issues.length) { bad++; console.log(`${deck.key} #${i + 1}: ${issues.join(' · ')}`); }
}
console.log(`${deck.key}: ${slides.length} slide, ${bad} slide cần xem`);
await b.close();
