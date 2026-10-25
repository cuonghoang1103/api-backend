/**
 * pg-17-hinh.mjs — hình dùng chung cho deck pg-00-5 (bài 0.5 "Từ SQL Server/MySQL sang PostgreSQL") và pg-17-1…4
 * (Chương 17 "SQL Server · MySQL · PostgreSQL · MongoDB"). Agent c17, 25/10/2026.
 *
 *   import { T, HE, nhanHe, bang3 } from './pg-17-hinh.mjs';
 *   T('ss', `1> SELECT …\n2> GO\n…`)       // cửa sổ terminal đúng hệ: ss (sqlcmd) · my (mysql) · pg (psql) · mg (mongosh) · sh (shell)
 *
 * Output trong các khối T(...) là CHÉP NGUYÊN từ lượt chạy thật (video-bai-giang/src/khung/pg/that/pg-00-5.*, pg-17-N.*),
 * chỉ bỏ khoảng trắng thừa cuối dòng. Dấu nhắc (1> / mysql> / ctmini=# / ctshop>) là dấu nhắc thật của từng client.
 * Dùng lại class .term/.pl/.pr/.er/.nt/.dim của khuôn _pg-chung.mjs ⇒ bộ đo toạ độ bắt được term#i, pl#i.
 */
import { esc } from './_pg-chung.mjs';

/** Màu nhận diện từng hệ (dùng nhất quán trong mọi slide + video). */
export const HE = {
  ss: { ten: 'SQL Server', mau: '#a91d22', nen: '#fdecec', ver: 'SQL Server 2022 (16.0)', cli: 'sqlcmd', icon: '🟥' },
  my: { ten: 'MySQL', mau: '#00758f', nen: '#e6f4f7', ver: 'MySQL 8.4 LTS', cli: 'mysql', icon: '🐬' },
  pg: { ten: 'PostgreSQL', mau: '#336791', nen: '#e8f0f8', ver: 'PostgreSQL 17', cli: 'psql', icon: '🐘' },
  mg: { ten: 'MongoDB', mau: '#2f8d46', nen: '#e9f6ec', ver: 'MongoDB 7.0', cli: 'mongosh', icon: '🍃' },
};

const TITLE = {
  ss: 'sqlcmd — SQL Server 2022 (16.0.4305) · ctmini',
  my: 'mysql — MySQL 8.4.13 · ctmini',
  pg: 'psql (17.11) — ctmini',
  mg: 'mongosh — MongoDB 7.0.37 · ctshop',
  sh: 'terminal',
};

/**
 * Terminal của một hệ. text: transcript thật. opts: { title, sm (mặc định true), hl: [dòng 1-based tô nền], k: data-k }
 * Tô: dấu nhắc xanh · ERROR/Msg đỏ (cả dòng thông báo ngay sau "Msg …") · HINT/DETAIL/LINE/Warning vàng · dòng đếm/OK mờ.
 */
export function T(he, text, opts = {}) {
  const { title = TITLE[he] || he, sm = true, hl = [], k = he } = opts;
  let sauMsg = false;
  const lines = String(text).replace(/\n$/, '').split('\n').map((l, i) => {
    let h = esc(l);
    const pr = l.match(/^(\d+> |mysql> |\s+-> |\S+[=\-]# |\S+> |\$ )/);
    if (sauMsg) { h = `<span class="er">${h}</span>`; sauMsg = false; }
    else if (/^Msg \d+/.test(l)) { h = `<span class="er">${h}</span>`; sauMsg = true; }
    else if (/^(ERROR|FATAL|MongoServerError|Uncaught)/.test(l)) h = `<span class="er">${h}</span>`;
    else if (pr) h = `<span class="pr">${esc(pr[1])}</span>${esc(l.slice(pr[1].length))}`;
    else if (/^(NOTICE|WARNING|HINT|DETAIL|INFO|LINE \d|Warning)/.test(l)) h = `<span class="nt">${h}</span>`;
    else if (/^\(\d+ rows?( affected)?\)$|rows? in set|^Query OK|^Empty set|^(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|BEGIN|COMMIT|ROLLBACK|SET|START)\b|^Rows matched|^Records:/.test(l)) h = `<span class="dim">${h}</span>`;
    return `<span class="pl${hl.includes(i + 1) ? ' hl' : ''}">${h || ' '}</span>`;
  });
  const m = HE[he]?.mau || '#24303d';
  return `<div class="term${sm ? ' sm' : ''}" data-k="${k}"><div class="tb" style="border-bottom:3px solid ${m}"><i style="background:#ff5f56"></i><i style="background:#ffbd2e"></i><i style="background:#27c93f"></i>&nbsp;${esc(title)}</div><pre>${lines.join('\n')}</pre></div>`;
}

/** Nhãn hệ nhỏ (chip màu). */
export const nhanHe = (he, chu) => `<span style="display:inline-block;background:${HE[he].mau};color:#fff;font-weight:800;border-radius:6px;padding:1px 9px;font-size:.82em">${HE[he].icon} ${chu ?? HE[he].ten}</span>`;

/**
 * Bảng đối chiếu nhiều hệ. hang: [[ý, ss, my, pg, (mg)]] — ô HTML. opts: { he: ['ss','my','pg'], fs=18, hl: [chỉ số dòng tô], w1 }
 */
export function bang3(hang, opts = {}) {
  const { he = ['ss', 'my', 'pg'], fs = 18, hl = [], w1 = 190, dau = '' } = opts;
  const th = `<tr><th style="width:${w1}px;background:#7a7a7a">${dau}</th>${he.map((h) => `<th style="background:${HE[h].mau}">${HE[h].icon} ${HE[h].ten}</th>`).join('')}</tr>`;
  const tr = hang.map((r, i) => `<tr${hl.includes(i) ? ' style="outline:3px solid #e08a1e;outline-offset:-2px"' : ''}><td style="font-weight:700;color:#333">${r[0]}</td>${r.slice(1).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');
  return `<table class="t" style="font-size:${fs}px">${th}${tr}</table>`;
}

/** Mã nội dòng màu theo hệ. */
export const m = (t) => `<code class="i">${esc(t)}</code>`;
