/**
 * pg-15-hinh.mjs — hình dùng chung Chương 15 — Sao lưu, WAL/PITR, nhân bản, phân mảnh (deck pg-15-1…4). Không phải deck. (agent c15, 26/10/2026)
 * Chữ SVG: rộng ≈ 0,602 × cỡ chữ / ký tự (mono) — đặt nhãn bằng tw(). Phần tử video cần chú thích có data-k.
 * Mọi số trên hình = số đo thật (video-bai-giang/src/khung/pg/that/pg-15-*.out.txt, PostgreSQL 17.11 trong container tạm pgc15-*).
 */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = 'Menlo,Consolas,monospace';
export const PG = '#336791', CAM = '#e08a1e', NAU = '#b85a2b', XANH = '#2f7d4f', DO = '#c0392b', TIM = '#7a5a9a', XAM = '#8a8a8a';
export const tw = (s, fs) => String(s).length * fs * 0.602;
const head = (w, h, id) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">` +
  `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker>` +
  `<marker id="${id}x" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${XANH}"/></marker>` +
  `<marker id="${id}d" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${DO}"/></marker>` +
  `<marker id="${id}b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${PG}"/></marker></defs>`;
const T = (x, y, s, { fs = 20, fw = 400, fill = '#333', anchor = 'start', mono = false, k = '', it = false } = {}) =>
  `<text${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" font-size="${fs}" font-weight="${fw}" fill="${fill}" text-anchor="${anchor}"${mono ? ` font-family="${MONO}"` : ''}${it ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
const R = (x, y, w, h, { fill = '#fff', st = PG, sw = 2.5, rx = 10, k = '', dash = '' } = {}) =>
  `<rect${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${st}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const L = (x1, y1, x2, y2, { st = NAU, sw = 3, m = '', dash = '', k = '' } = {}) =>
  `<line${k ? ` data-k="${k}"` : ''} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st}" stroke-width="${sw}"${m ? ` marker-end="url(#${m})"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const E = (x, y, s, fs = 40, k = '') => `<text${k ? ` data-k="${k}"` : ''} x="${x}" y="${y}" font-size="${fs}" text-anchor="middle">${s}</text>`;
export { head, T, R, L, E, esc };

/* ═══════════ 15.1 ═══════════ */
/** Đời thường: ảnh chụp lúc 02:00 (dump logic) vs camera ghi liên tục (WAL/PITR, bài 15.2). */
export function photoPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'ph');
  // trái: ảnh chụp
  s += R(0, 0, 520, 290, { fill: '#fffaf5', st: CAM, k: 'ph-a' });
  s += E(70, 78, '📸', 54) + T(120, 52, 'A photo at 02:00', { fs: 24, fw: 800, fill: NAU }) + T(120, 82, '= pg_dump (logical backup)', { fs: 18, fill: '#555', mono: true });
  s += R(30, 112, 460, 70, { fill: '#fff', st: '#e3c9ae', sw: 1.5 }) + T(260, 146, 'exact state at ONE moment', { fs: 21, fw: 700, fill: '#333', anchor: 'middle' }) + T(260, 170, 'portable · readable · selective', { fs: 17, fill: '#666', anchor: 'middle' });
  s += T(30, 222, '✗ what happened at 09:15? not in the photo', { fs: 19, fw: 700, fill: DO, k: 'ph-no' });
  s += T(30, 254, '✓ restore = go back to 02:00 exactly', { fs: 19, fw: 700, fill: XANH });
  // phải: camera
  s += R(590, 0, 520, 290, { fill: '#eef4fa', st: PG, k: 'ph-b' });
  s += E(660, 78, '🎥', 54) + T(710, 52, 'A camera that never stops', { fs: 24, fw: 800, fill: PG }) + T(710, 82, '= base backup + WAL (15.2)', { fs: 18, fill: '#555', mono: true });
  s += R(620, 112, 460, 70, { fill: '#fff', st: '#c9dbec', sw: 1.5 }) + T(850, 146, 'every change, in order', { fs: 21, fw: 700, fill: '#333', anchor: 'middle' }) + T(850, 170, 'physical · exact · same major version', { fs: 17, fill: '#666', anchor: 'middle' });
  s += T(620, 222, '✓ rewind to ANY second: 09:14:59', { fs: 19, fw: 700, fill: XANH, k: 'ph-yes' });
  s += T(620, 254, '✗ cannot pick one table, cannot cross versions', { fs: 19, fw: 700, fill: DO });
  return s + '</svg>';
}

/** Ba định dạng dump: plain (1 tệp chữ) · custom (1 tệp nén + mục lục) · directory (thư mục: toc.dat + mỗi bảng 1 tệp .dat.gz). Số đo thật. */
export function formatsPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'fm');
  const col = (x, ten, co, mau, k) => R(x, 0, 350, 290, { fill: mau + '0f', st: mau, k }) + T(x + 175, 34, ten, { fs: 23, fw: 800, fill: mau, anchor: 'middle', mono: true }) + T(x + 175, 60, co, { fs: 17, fill: '#555', anchor: 'middle', mono: true });
  // plain
  s += col(0, 'plain', 'pg_dump -f plain.sql', NAU, 'fm-plain');
  s += R(110, 78, 130, 150, { fill: '#fff', st: '#bfbfbf', sw: 2, rx: 4 });
  for (let i = 0; i < 7; i++) s += L(126, 100 + i * 17, 224 - (i % 3) * 22, 100 + i * 17, { st: '#c9c9c9', sw: 4 });
  s += T(175, 258, '16M · 0.26 s · SQL text', { fs: 18, fw: 700, fill: '#333', anchor: 'middle', k: 'fm-plain-so' });
  s += T(175, 282, 'restore: psql -f', { fs: 16, fill: '#666', anchor: 'middle', mono: true });
  // custom
  s += col(380, 'custom (-Fc)', 'pg_dump -Fc -f custom.dump', PG, 'fm-custom');
  s += R(500, 78, 110, 150, { fill: '#fff', st: PG, sw: 2, rx: 4 });
  s += R(512, 90, 86, 40, { fill: '#eef4fa', st: PG, sw: 1.5, rx: 3 }) + T(555, 116, 'TOC', { fs: 18, fw: 800, fill: PG, anchor: 'middle', mono: true });
  s += E(555, 196, '🗜️', 44);
  s += T(555, 258, '3.9M · 0.60 s · compressed', { fs: 18, fw: 700, fill: '#333', anchor: 'middle', k: 'fm-custom-so' });
  s += T(555, 282, 'restore: pg_restore', { fs: 16, fill: '#666', anchor: 'middle', mono: true });
  // directory
  s += col(760, 'directory (-Fd)', 'pg_dump -Fd -j 4 -f dir', XANH, 'fm-dir');
  s += E(830, 140, '📁', 62);
  const f = ['toc.dat', '3454.dat.gz', '3456.dat.gz', '3458.dat.gz', '3460.dat.gz'];
  f.forEach((t, i) => { s += T(872, 90 + i * 30, t, { fs: 16, fill: i ? '#333' : XANH, mono: true, fw: i ? 400 : 800 }); });
  s += T(935, 258, '3.9M · 0.66 s · parallel -j', { fs: 18, fw: 700, fill: '#333', anchor: 'middle', k: 'fm-dir-so' });
  s += T(935, 282, 'restore: pg_restore -j 4', { fs: 16, fill: '#666', anchor: 'middle', mono: true });
  return s + '</svg>';
}

/** RPO: dump mỗi đêm 02:00; sự cố 01:59 ⇒ mất 23 giờ 59 phút. */
export function rpoPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'rp');
  const x0 = 40, x1 = 1070, y = 92;
  s += L(x0, y, x1, y, { st: '#c9d5e2', sw: 10 });
  const xt = (hr) => x0 + (x1 - x0) * hr / 50; // 0..50 giờ
  [[2, 'dump 02:00 ✓', 'rp-d1'], [26, 'dump 02:00 ✓', 'rp-d2']].forEach(([hr, t, k]) => {
    s += `<circle data-k="${k}" cx="${xt(hr)}" cy="${y}" r="16" fill="${XANH}"/>` + T(xt(hr), y - 30, t, { fs: 18, fw: 800, fill: XANH, anchor: 'middle' });
  });
  s += R(xt(26), y + 28, xt(49.98) - xt(26), 44, { fill: '#fdf0ee', st: DO, sw: 2, rx: 6, k: 'rp-mat' }) + T((xt(26) + xt(49.98)) / 2, y + 57, 'everything written here is LOST', { fs: 19, fw: 800, fill: DO, anchor: 'middle' });
  s += E(xt(49.98) - 6, y + 14, '💥', 40, 'rp-cut') + T(xt(49.98) - 30, y - 30, 'next day 01:59: disk dies', { fs: 18, fw: 800, fill: DO, anchor: 'end' });
  [[0, 'Day 1 00:00'], [24, 'Day 2 00:00'], [48, 'Day 3 00:00']].forEach(([hr, t]) => { s += L(xt(hr), y - 12, xt(hr), y + 12, { st: '#888', sw: 2 }) + T(xt(hr) + (hr === 0 ? 50 : 0), y + 100, t, { fs: 16, fill: '#888', anchor: 'middle' }); });
  s += T(w / 2, y + 146, 'RPO = 23 h 59 min of data — chosen in advance by “dump nightly”', { fs: 21, fw: 800, fill: '#333', anchor: 'middle', k: 'rp-so' });
  return s + '</svg>';
}

/** CuongThai thật: cron 02:00 → pg_dump | gzip → /opt/cuonghoangdev/backups (30 ngày) → R2 riêng tư; restore-test.sh dựng container vứt đi. */
export function ctBackupPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'ct');
  const box = (x, y, bw, t1, t2, mau, k) => R(x, y, bw, 92, { fill: mau + '12', st: mau, k }) + T(x + bw / 2, y + 38, t1, { fs: 19, fw: 800, fill: mau, anchor: 'middle' }) + T(x + bw / 2, y + 68, t2, { fs: 15, fill: '#555', anchor: 'middle', mono: true });
  s += box(0, 10, 190, '⏰ cron', '0 2 * * *', TIM, 'ct-cron');
  s += L(192, 56, 226, 56, { m: 'ct' });
  s += box(230, 10, 280, 'docker exec … pg_dump', '| gzip > *.sql.gz', PG, 'ct-dump');
  s += L(512, 56, 546, 56, { m: 'ct' });
  s += box(550, 10, 260, '💾 VPS disk', '/opt/…/backups · 30 days', NAU, 'ct-disk');
  s += L(812, 56, 846, 56, { m: 'ct' });
  s += box(850, 10, 260, '☁️ R2 PRIVATE bucket', 'off-site copy', XANH, 'ct-r2');
  s += box(230, 170, 580, '🧪 restore-test.sh — throwaway container', 'restore latest dump · count users / social_posts / messages', CAM, 'ct-test');
  s += `<path d="M680,104 L680,166" stroke="${CAM}" stroke-width="3" fill="none" marker-end="url(#ct)"/>`;
  s += T(0, 290, 'Good: off-site, private bucket, a restore rehearsal exists.  To add: pipefail · -Fc · globals · an alarm when the size drops.', { fs: 16, fw: 700, fill: '#444', k: 'ct-note' });
  return s + '</svg>';
}

/* ═══════════ 15.2 ═══════════ */
/** Đời thường: thu ngân ghi SỔ trước rồi mới mở két. */
export function ledgerPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'lg');
  const step = (x, n, em, t1, t2, mau, k) => R(x, 10, 330, 200, { fill: mau + '10', st: mau, k }) + `<circle cx="${x + 34}" cy="44" r="20" fill="${mau}"/>` + T(x + 34, 51, String(n), { fs: 20, fw: 800, fill: '#fff', anchor: 'middle' }) +
    E(x + 165, 110, em, 58) + T(x + 165, 160, t1, { fs: 21, fw: 800, fill: mau, anchor: 'middle' }) + T(x + 165, 188, t2, { fs: 16, fill: '#555', anchor: 'middle' });
  s += step(0, 1, '📒', 'write it in the ledger', 'append one line — fast', PG, 'lg-1');
  s += L(332, 110, 386, 110, { m: 'lg' });
  s += step(390, 2, '✅', 'then say “done”', 'the line is safe on paper', XANH, 'lg-2');
  s += L(722, 110, 776, 110, { m: 'lg' });
  s += step(780, 3, '🗄️', 'tidy the drawer later', 'when there is time', CAM, 'lg-3');
  s += T(w / 2, 242, 'Power cut after step 2? Re-read the ledger and redo every line — nothing that was “done” is lost.', { fs: 18, fw: 700, fill: '#333', anchor: 'middle', k: 'lg-note' });
  return s + '</svg>';
}

/** Thứ tự ghi: COMMIT ⇒ bản ghi WAL được fsync vào pg_wal ⇒ trả "COMMIT" ⇒ trang dữ liệu ghi xuống SAU (checkpoint). */
export function walFlowPic({ w = 1110, h = 290 } = {}) {
  let s = head(w, h, 'wf');
  const box = (x, y, bw, bh, t1, t2, mau, k) => R(x, y, bw, bh, { fill: mau + '12', st: mau, k }) + T(x + bw / 2, y + bh / 2 - 6, t1, { fs: 20, fw: 800, fill: mau, anchor: 'middle' }) + T(x + bw / 2, y + bh / 2 + 22, t2, { fs: 15, fill: '#555', anchor: 'middle', mono: true });
  s += box(0, 100, 190, 90, 'client', 'COMMIT;', XAM, 'wf-cl');
  s += box(270, 10, 300, 90, 'WAL buffer → pg_wal', 'record + fsync', PG, 'wf-wal');
  s += box(270, 190, 300, 90, 'shared_buffers', 'page changed (dirty)', CAM, 'wf-buf');
  s += box(680, 10, 210, 90, '“COMMIT” ✓', 'only after fsync', XANH, 'wf-ok');
  s += box(680, 190, 420, 90, 'data files (base/…)', 'written LATER — checkpoint', NAU, 'wf-data');
  s += `<path d="M192,135 C230,110 240,70 266,58" fill="none" stroke="${PG}" stroke-width="3" marker-end="url(#wfb)"/>` + T(200, 80, '① first', { fs: 16, fw: 800, fill: PG });
  s += L(572, 55, 676, 55, { m: 'wfx', st: XANH }) + T(624, 44, '②', { fs: 16, fw: 800, fill: XANH, anchor: 'middle' });
  s += `<path d="M192,160 C230,190 240,230 266,234" fill="none" stroke="${CAM}" stroke-width="3" marker-end="url(#wf)"/>`;
  s += L(572, 235, 676, 235, { m: 'wf', dash: '7 6' }) + T(624, 224, '③ later', { fs: 16, fw: 800, fill: NAU, anchor: 'middle' });
  s += T(910, 62, 'durable', { fs: 17, fw: 700, fill: XANH });
  return s + '</svg>';
}

/** Tên tệp WAL 24 ký tự hex = timeline · log · segment. */
export function walNamePic({ w = 1110, h = 150 } = {}) {
  let s = head(w, h, 'wn');
  const fs = 44, cw = fs * 0.602, gap = 26, x0 = (w - cw * 24 - gap * 2) / 2;
  const part = (i, t, mau, nhan, k) => { const x = x0 + (cw * 8 + gap) * i; return R(x - 4, 14, cw * 8 + 8, 64, { fill: mau + '14', st: mau, rx: 8, k }) + T(x, 62, t, { fs, fw: 800, fill: mau, mono: true }) + T(x + cw * 4, 112, nhan, { fs: 19, fw: 800, fill: mau, anchor: 'middle' }); };
  s += part(0, '00000001', TIM, 'timeline 1', 'wn-tl') + part(1, '00000000', PG, 'log (high 32 bits)', 'wn-log') + part(2, '00000002', CAM, 'segment no. 2', 'wn-seg');
  s += T(w / 2, 144, 'each file = exactly 16 MB of the WAL stream', { fs: 17, fill: '#555', anchor: 'middle' });
  return s + '</svg>';
}

/** Dòng thời gian PITR thật: base backup → WAL 03·04·05 → 2000 đơn (02:15:14) → DROP (02:15:17.659) → mốc 02:15:16. */
export function pitrPic({ w = 1110, h = 370 } = {}) {
  let s = head(w, h, 'pt');
  const y = 150;
  s += L(20, y, 1090, y, { st: '#c9d5e2', sw: 10 });
  // base backup
  s += R(30, y - 120, 220, 84, { fill: '#eef4fa', st: PG, k: 'pt-base' }) + T(140, y - 86, '📦 base backup', { fs: 19, fw: 800, fill: PG, anchor: 'middle' }) + T(140, y - 58, '02:14:35 · LSN 0/3000028', { fs: 14, fill: '#333', anchor: 'middle', mono: true });
  s += L(140, y - 36, 140, y - 8, { m: 'ptb', st: PG });
  // segments
  ['…03', '…04', '…05'].forEach((t, i) => { const x = 270 + i * 150; s += R(x, y + 20, 140, 40, { fill: '#fff', st: XAM, sw: 2, rx: 6, k: `pt-seg${i}` }) + T(x + 70, y + 46, `WAL ${t}`, { fs: 16, fill: '#444', anchor: 'middle', mono: true }); });
  s += T(495, y + 86, 'archived segments replayed in order', { fs: 15, fill: '#666', anchor: 'middle' });
  // events
  const ev = (x, t1, t2, mau, k, up = true) => `<circle data-k="${k}" cx="${x}" cy="${y}" r="13" fill="${mau}"/>` + T(x, up ? y - 64 : y + 120, t1, { fs: 17, fw: 800, fill: mau, anchor: 'middle' }) + T(x, up ? y - 40 : y + 144, t2, { fs: 14, fill: '#333', anchor: 'middle', mono: true });
  s += ev(560, '✍️ +2,000 orders', 'COMMIT 02:15:14.539', XANH, 'pt-ins');
  s += ev(760, '🎯 target', '02:15:16', TIM, 'pt-tgt');
  s += ev(950, '💥 DROP TABLE', 'COMMIT 02:15:17.659', DO, 'pt-drop');
  s += `<path data-k="pt-arrow" d="M150,${y + 206} L755,${y + 206}" stroke="${TIM}" stroke-width="4" fill="none" marker-end="url(#pt)"/>`;
  s += T(450, y + 194, 'replay from the base backup … stop before the DROP commits', { fs: 16, fw: 700, fill: TIM, anchor: 'middle' });
  return s + '</svg>';
}

/** Timeline phân nhánh sau khi khôi phục: timeline 1 (có DROP) vs timeline 2 (mới). */
export function timelinePic({ w = 1110, h = 230 } = {}) {
  let s = head(w, h, 'tl');
  const y1 = 70, y2 = 170, xb = 520;
  s += L(20, y1, 1090, y1, { st: PG, sw: 8 }) + T(30, y1 - 18, 'timeline 1', { fs: 19, fw: 800, fill: PG, k: 'tl-1' });
  s += `<circle cx="960" cy="${y1}" r="12" fill="${DO}"/>` + T(960, y1 - 20, '💥 DROP (never happened on 2)', { fs: 16, fw: 800, fill: DO, anchor: 'middle' });
  s += `<path data-k="tl-br" d="M${xb},${y1} C${xb + 60},${y1} ${xb + 60},${y2} ${xb + 130},${y2} L1090,${y2}" stroke="${XANH}" stroke-width="8" fill="none"/>`;
  s += `<circle cx="${xb}" cy="${y1}" r="12" fill="${TIM}"/>` + T(xb - 20, y1 + 36, 'branch at 0/405E4B0', { fs: 15, fw: 700, fill: TIM, anchor: 'end', mono: true });
  s += T(xb + 160, y2 + 40, 'timeline 2 — new writes after recovery', { fs: 18, fw: 800, fill: XANH, k: 'tl-2' });
  s += T(20, y2 + 10, '00000002.history:', { fs: 16, fill: '#555', mono: true }) + T(20, y2 + 34, '1  0/405E4B0  before … 02:15:17.659619', { fs: 14, fill: '#333', mono: true });
  return s + '</svg>';
}

/* ═══════════ 15.3 ═══════════ */
/** Đời thường: thầy đọc chính tả (primary), trò chép (standby) — trò đọc lại được, không được tự thêm câu. */
export function dictationPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'dc');
  s += R(0, 20, 330, 200, { fill: '#eef4fa', st: PG, k: 'dc-thay' }) + E(70, 110, '👩‍🏫', 64) + T(200, 90, 'teacher', { fs: 24, fw: 800, fill: PG, anchor: 'middle' }) + T(200, 122, '= primary', { fs: 19, fill: '#333', anchor: 'middle', mono: true }) + T(165, 190, 'decides every sentence', { fs: 17, fill: '#555', anchor: 'middle' });
  s += L(340, 120, 760, 120, { m: 'dcb', st: PG, sw: 5, k: 'dc-wal' }) + T(550, 104, 'reads the WAL aloud, line by line', { fs: 19, fw: 700, fill: PG, anchor: 'middle' }) + T(550, 150, '(streaming, milliseconds behind)', { fs: 16, fill: '#666', anchor: 'middle' });
  s += R(770, 20, 340, 200, { fill: '#fffaf5', st: CAM, k: 'dc-tro' }) + E(840, 110, '🧑‍🎓', 64) + T(980, 90, 'student', { fs: 24, fw: 800, fill: CAM, anchor: 'middle' }) + T(980, 122, '= standby', { fs: 19, fill: '#333', anchor: 'middle', mono: true });
  s += T(940, 170, '✓ can read the copy aloud', { fs: 16, fill: XANH, anchor: 'middle', fw: 700 }) + T(940, 196, '✗ may not add a sentence', { fs: 16, fill: DO, anchor: 'middle', fw: 700 });
  s += T(w / 2, 246, 'If the teacher loses her voice, the student can take over the class — that is failover.', { fs: 17, fw: 700, fill: '#333', anchor: 'middle', k: 'dc-note' });
  return s + '</svg>';
}

/** Kiến trúc streaming: primary (walsender) → mạng → standby (walreceiver → pg_wal → startup replay). */
export function streamPic({ w = 1110, h = 300 } = {}) {
  let s = head(w, h, 'sr');
  const box = (x, y, bw, bh, t1, t2, mau, k) => R(x, y, bw, bh, { fill: mau + '12', st: mau, k }) + T(x + bw / 2, y + bh / 2 - 4, t1, { fs: 19, fw: 800, fill: mau, anchor: 'middle' }) + T(x + bw / 2, y + bh / 2 + 22, t2, { fs: 14, fill: '#555', anchor: 'middle', mono: true });
  s += R(0, 0, 420, 290, { fill: '#f6f9fc', st: PG, sw: 2, dash: '8 6', k: 'sr-pri' }) + T(16, 28, 'PRIMARY  pgc15-pri', { fs: 18, fw: 800, fill: PG });
  s += box(20, 50, 180, 90, 'backends', 'INSERT / COMMIT', XAM, 'sr-be') + box(220, 50, 180, 90, 'pg_wal', '…0003 …0004', PG, 'sr-wal');
  s += box(120, 175, 260, 90, 'walsender', 'reads WAL, sends it', PG, 'sr-send');
  s += L(200, 95, 216, 95, { m: 'sr' }) + L(310, 142, 270, 172, { m: 'sr' });
  s += R(690, 0, 420, 290, { fill: '#fffaf5', st: CAM, sw: 2, dash: '8 6', k: 'sr-std' }) + T(706, 28, 'STANDBY  pgc15-std', { fs: 18, fw: 800, fill: CAM });
  s += box(710, 175, 180, 90, 'walreceiver', 'write + flush', CAM, 'sr-recv') + box(910, 175, 180, 90, 'pg_wal', 'same bytes', CAM, 'sr-wal2');
  s += box(820, 50, 270, 90, 'startup process', 'REPLAYS into data files', NAU, 'sr-replay');
  s += L(890, 220, 906, 220, { m: 'sr' }) + L(1000, 172, 960, 142, { m: 'sr' });
  s += `<path data-k="sr-net" d="M382,220 C520,250 580,250 706,220" fill="none" stroke="${NAU}" stroke-width="5" marker-end="url(#sr)"/>`;
  s += T(545, 232, 'TCP · replication protocol', { fs: 15, fw: 700, fill: NAU, anchor: 'middle' }) + T(545, 266, 'slot ban_sao_1 keeps WAL', { fs: 14, fill: '#555', anchor: 'middle', mono: true }) + T(545, 286, 'until the standby confirms', { fs: 14, fill: '#555', anchor: 'middle', mono: true });
  return s + '</svg>';
}

/** Bốn LSN của một bản sao: sent → write → flush → replay (thanh tiến độ). */
export function lsnBarPic({ w = 1110, h = 170, vals = [['sent', 1], ['write', 1], ['flush', 1], ['replay', 0.25]], cap = '' } = {}) {
  let s = head(w, h, 'lb');
  const x0 = 170, W = 880;
  vals.forEach(([t, v], i) => {
    const y = 14 + i * 36, mau = [PG, CAM, XANH, NAU][i];
    s += T(x0 - 14, y + 22, `${t}_lsn`, { fs: 18, fw: 800, fill: mau, anchor: 'end', mono: true }) + R(x0, y + 4, W, 24, { fill: '#f1f4f8', st: '#d5dde6', sw: 1.5, rx: 6 }) + R(x0, y + 4, W * v, 24, { fill: mau, st: mau, sw: 1, rx: 6, k: `lb-${t}` });
  });
  if (cap) s += T(x0 + W + 10, 92, cap, { fs: 16, fw: 700, fill: '#333' });
  return s + '</svg>';
}

/** Async vs sync COMMIT: primary chờ hay không chờ standby. */
export function syncPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'sy');
  const lane = (y, ten, mau, k, sync) => {
    let r = T(0, y + 6, ten, { fs: 20, fw: 800, fill: mau, k });
    r += R(150, y - 20, 180, 44, { fill: PG + '14', st: PG, rx: 8 }) + T(240, y + 8, 'WAL flush', { fs: 16, fw: 700, fill: PG, anchor: 'middle' });
    if (sync) {
      r += L(334, y, 404, y, { m: 'sy' }) + R(410, y - 20, 250, 44, { fill: CAM + '14', st: CAM, rx: 8 }) + T(535, y + 8, 'wait: standby flushed', { fs: 16, fw: 700, fill: CAM, anchor: 'middle' });
      r += L(664, y, 734, y, { m: 'syx', st: XANH }) + R(740, y - 20, 170, 44, { fill: XANH + '14', st: XANH, rx: 8 }) + T(825, y + 8, '“COMMIT” ✓', { fs: 16, fw: 800, fill: XANH, anchor: 'middle' });
      r += T(930, y + 6, '0.955 s / 1000', { fs: 17, fw: 800, fill: '#333', mono: true });
    } else {
      r += L(334, y, 404, y, { m: 'syx', st: XANH }) + R(410, y - 20, 170, 44, { fill: XANH + '14', st: XANH, rx: 8 }) + T(495, y + 8, '“COMMIT” ✓', { fs: 16, fw: 800, fill: XANH, anchor: 'middle' });
      r += L(240, y + 24, 520, y + 70, { st: XAM, dash: '6 6', sw: 2 }) + T(530, y + 74, 'standby gets it a moment later', { fs: 15, fill: '#666' });
      r += T(930, y + 6, '0.520 s / 1000', { fs: 17, fw: 800, fill: '#333', mono: true });
    }
    return r;
  };
  s += lane(40, 'async', XANH, 'sy-async', false) + lane(170, 'sync', CAM, 'sy-sync', true);
  return s + '</svg>';
}

/** Split brain: hai primary cùng nhận ghi, hai lịch sử. */
export function splitPic({ w = 1110, h = 220 } = {}) {
  let s = head(w, h, 'sb');
  const may = (x, ten, phu, cuoi, tep, mau, k) => R(x, 10, 420, 170, { fill: mau + '10', st: mau, k }) + T(x + 210, 44, ten, { fs: 22, fw: 800, fill: mau, anchor: 'middle' }) + T(x + 210, 74, phu, { fs: 16, fill: '#555', anchor: 'middle' }) +
    T(x + 210, 116, cuoi, { fs: 18, fw: 700, fill: '#222', anchor: 'middle' }) + T(x + 210, 150, tep, { fs: 16, fill: '#333', anchor: 'middle', mono: true });
  s += may(0, 'old primary (restarted)', 'pg_is_in_recovery = f  ⇒ accepts writes', 'last row: “ghi vào máy CŨ”', 'WAL 000000010000000000000008', DO, 'sb-cu');
  s += may(690, 'promoted standby', 'pg_is_in_recovery = f  ⇒ accepts writes', 'last row: “sau failover”', 'WAL 000000020000000000000008', XANH, 'sb-moi');
  s += E(555, 110, '🧠⚡🧠', 46, 'sb-icon') + T(555, 160, 'both say 3003 rows', { fs: 15, fill: '#666', anchor: 'middle' }) + T(555, 180, '— different rows', { fs: 15, fill: DO, anchor: 'middle', fw: 700 });
  s += T(w / 2, 212, 'Two machines, two histories. Nothing merges them back automatically.', { fs: 17, fw: 700, fill: '#333', anchor: 'middle', k: 'sb-note' });
  return s + '</svg>';
}

/* ═══════════ 15.4 ═══════════ */
/** Đời thường: tủ hồ sơ chia ngăn theo tháng — tìm tháng 8 chỉ mở 1 ngăn; bỏ hồ sơ tháng 6 = rút cả ngăn ra. */
export function cabinetPic({ w = 1110, h = 270 } = {}) {
  let s = head(w, h, 'cb');
  const ngan = (x, ten, so, mau, k, mo = false) => R(x, 20, 230, 200, { fill: mo ? mau + '22' : '#fff', st: mau, sw: mo ? 4 : 2.5, k }) + T(x + 115, 70, ten, { fs: 24, fw: 800, fill: mau, anchor: 'middle' }) +
    T(x + 115, 110, so, { fs: 18, fill: '#333', anchor: 'middle', mono: true }) + R(x + 85, 150, 60, 14, { fill: '#c9c9c9', st: '#9a9a9a', sw: 1.5, rx: 7 });
  s += ngan(0, 'June', '99,692 rows', NAU, 'cb-6') + ngan(260, 'July', '103,015 rows', PG, 'cb-7') + ngan(520, 'August', '97,293 rows', XANH, 'cb-8', true);
  s += T(780, 250, '🔍 “August?” ⇒ open ONE drawer', { fs: 18, fw: 800, fill: XANH, anchor: 'end', k: 'cb-tim' });
  s += T(0, 250, '🗑️ retire June ⇒ pull the drawer out', { fs: 18, fw: 800, fill: NAU, k: 'cb-bo' });
  s += R(800, 20, 310, 200, { fill: '#f6f6f6', st: XAM, dash: '8 6', k: 'cb-flat' }) + T(955, 70, 'one big drawer', { fs: 22, fw: 800, fill: XAM, anchor: 'middle' }) +
    T(955, 108, '= a flat table', { fs: 18, fill: '#555', anchor: 'middle', mono: true }) + T(955, 150, 'search: go through all', { fs: 17, fill: DO, anchor: 'middle' }) + T(955, 178, 'retire: pick out page by page', { fs: 17, fill: DO, anchor: 'middle' });
  return s + '</svg>';
}

/** Định tuyến khi INSERT + pruning khi SELECT. */
export function routePic({ w = 1110, h = 280 } = {}) {
  let s = head(w, h, 'rt');
  s += R(0, 95, 260, 90, { fill: '#eef4fa', st: PG, k: 'rt-parent' }) + T(130, 132, 'event_p', { fs: 24, fw: 800, fill: PG, anchor: 'middle', mono: true }) + T(130, 162, 'PARTITION BY RANGE (luc)', { fs: 14, fill: '#555', anchor: 'middle', mono: true });
  const con = (y, ten, rng, mau, k) => R(560, y, 330, 70, { fill: mau + '12', st: mau, k }) + T(725, y + 32, ten, { fs: 19, fw: 800, fill: mau, anchor: 'middle', mono: true }) + T(725, y + 56, rng, { fs: 14, fill: '#555', anchor: 'middle', mono: true });
  s += con(10, 'event_p_2026_06', "['06-01', '07-01')", NAU, 'rt-6') + con(105, 'event_p_2026_07', "['07-01', '08-01')", PG, 'rt-7') + con(200, 'event_p_2026_08', "['08-01', '09-01')", XANH, 'rt-8');
  s += L(262, 140, 556, 45, { m: 'rt', st: XAM, dash: '6 5' }) + L(262, 140, 556, 140, { m: 'rt', st: XAM, dash: '6 5' }) + L(262, 140, 556, 235, { m: 'rtx', st: XANH, sw: 5 });
  s += T(330, 270, 'INSERT … luc = 2026-08-14 ⇒ routed by the key', { fs: 15, fw: 700, fill: XANH });
  s += T(910, 245, '✓ read', { fs: 18, fw: 800, fill: XANH }) + T(910, 50, '✗ pruned', { fs: 18, fw: 800, fill: XAM }) + T(910, 145, '✗ pruned', { fs: 18, fw: 800, fill: XAM });
  return s + '</svg>';
}

/** Sharding: nhiều máy, mỗi máy giữ một phần dữ liệu theo khoá (Citus: coordinator + workers). */
export function shardPic({ w = 1110, h = 250 } = {}) {
  let s = head(w, h, 'sh');
  s += R(400, 0, 310, 80, { fill: '#eef4fa', st: PG, k: 'sh-coord' }) + T(555, 34, 'coordinator', { fs: 21, fw: 800, fill: PG, anchor: 'middle' }) + T(555, 62, 'routes by hash(tenant_id)', { fs: 15, fill: '#555', anchor: 'middle', mono: true });
  [0, 1, 2].forEach((i) => {
    const x = 60 + i * 360;
    s += L(555, 82, x + 135, 148, { m: 'sh' }) + R(x, 150, 270, 90, { fill: CAM + '12', st: CAM, k: `sh-w${i}` }) + T(x + 135, 186, `worker ${i + 1} — own machine`, { fs: 17, fw: 800, fill: CAM, anchor: 'middle' }) + T(x + 135, 214, `shards: hash(tenant_id) → ${i + 1}/3`, { fs: 15, fill: '#555', anchor: 'middle', mono: true });
  });
  return s + '</svg>';
}
