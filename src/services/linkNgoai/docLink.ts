/**
 * ĐỌC NỘI DUNG LINK NGOÀI (19/10/2026) — Google Docs/Sheets/Slides/Drive công khai, Figma, GitHub — máy chủ.
 *
 * Dùng bởi:
 *   - `doc_web` của CuongMini (`agent/webTool.ts`) — tự nhận diện loại link trước khi đọc như trang thường;
 *   - AI CT Work (`work/aiMentor.ts › readIssueFull`) — thẻ có link ngoài ⇒ đọc luôn nội dung (có trần, có đệm).
 *
 * Google: URL XUẤT chính thức (Docs ⇒ .md/.txt · Sheets ⇒ .xlsx = mọi trang tính, lùi về .csv · Slides ⇒ .txt, lùi
 * về .pdf · Drive ⇒ tải file, PDF/DOCX/PPTX/XLSX rút chữ). Link riêng tư ⇒ câu báo rõ "nhờ chủ tài liệu bật …".
 * (Sau này nối Google OAuth để đọc tài liệu riêng tư bằng quyền của người hỏi — CHƯA làm, xem docs mục 2h.)
 * Figma: không token ⇒ oEmbed (tiêu đề + ảnh xem trước). Có token CHỈ ĐỌC ⇒ REST: cây trang/frame + chữ trong layer +
 * bình luận + ảnh vài frame. Token KHÔNG BAO GIỜ vào log, vào câu lỗi, hay vào khoá đệm thô.
 * GitHub: repo ⇒ mô tả + README · issue/PR ⇒ thân + bình luận · blob ⇒ file thô. Không token (60 lượt/giờ/IP) + đệm.
 * Notion / Canva: không có đường rẻ ⇒ gợi ý mở bằng trình duyệt.
 *
 * Đệm theo URL 10 phút (khoá có ngăn: kết quả đọc bằng token của dự án A không bao giờ trả cho dự án B).
 */
import { createHash } from 'node:crypto';
import { docOffice } from '../agent/docOffice.js';
import { extractDocx, extractPdf } from '../cv/extract.service.js';
import {
  cauLinkRiengTu, frameCapCao, TEN_LOAI, tomTatBinhLuanFigma, tomTatCayFigma, urlXuat,
  type LinkNhanDien, type NodeFigma,
} from './nhanDien.js';
import { LoiTai, taiCoRao } from './taiAnToan.js';

export interface AnhLink { media_type: string; data: string }

export interface KetQuaLink {
  loai: LinkNhanDien['loai'];
  url: string;
  /** ok = có nội dung · rieng_tu = link chưa chia sẻ · goi_y = không đọc rẻ được (đọc như trang web / mở trình duyệt) · loi */
  trangThai: 'ok' | 'rieng_tu' | 'goi_y' | 'loi';
  tieuDe?: string;
  /** Mô tả nguồn: "xuất .md", "REST (token chỉ đọc)", "oEmbed"… */
  cach?: string;
  chu: string;
  anh?: AnhLink[];
}

export interface TuyChonDocLink {
  /** Trần chữ trả về. */
  tranChu?: number;
  /** Token Figma CHỈ ĐỌC (đã giải mã) — chỉ dùng trong lần gọi này. */
  figmaToken?: string | null;
  /** Ngăn đệm khi có token (vd. `p12` = dự án 12). Bắt buộc khi có token. */
  nganDem?: string;
  /** Model nhìn được ảnh ⇒ kèm ảnh thu nhỏ (Figma). */
  muonAnh?: boolean;
}

const TRAN_CHU_MAC_DINH = 20_000;
const TRAN_BYTE_CHU = 6 * 1024 * 1024;
const TRAN_BYTE_FILE = 25 * 1024 * 1024;
const TRAN_BYTE_FIGMA_JSON = 20 * 1024 * 1024;
const TRAN_BYTE_ANH = 8 * 1024 * 1024;
const CANH_ANH = 1024;
const HAN_DEM_MS = 10 * 60_000;
const DEM_TOI_DA = 200;

const dem = new Map<string, { het: number; v: KetQuaLink }>();
const dangBay = new Map<string, Promise<KetQuaLink>>();
export function __xoaDemLinkNgoai(): void { dem.clear(); dangBay.clear(); }

const cat = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}\n[… đã cắt bớt, còn ${s.length - n} ký tự]` : s);
const utf8 = (b: Buffer) => b.toString('utf8').replace(/^﻿/, '').trim();

/** Đọc một link ngoài đã nhận diện. KHÔNG ném — lỗi thành `trangThai`. */
export async function docLinkNgoai(l: LinkNhanDien, o: TuyChonDocLink = {}): Promise<KetQuaLink> {
  const tran = o.tranChu ?? TRAN_CHU_MAC_DINH;
  const coToken = l.loai === 'figma' && !!o.figmaToken;
  // Khoá đệm: có token ⇒ ngăn riêng + băm token (đổi token là đệm cũ không dùng được nữa); không bao giờ chứa token thô.
  const ngan = coToken ? `${o.nganDem ?? 'x'}:${createHash('sha256').update(o.figmaToken ?? '').digest('hex').slice(0, 12)}` : 'pub';
  const khoa = `${ngan}|${l.loai}|${l.url}|${tran}|${o.muonAnh ? 1 : 0}`;
  const co = dem.get(khoa);
  if (co && co.het > Date.now()) return co.v;
  const bay = dangBay.get(khoa);
  if (bay) return bay;
  const p = (async () => {
    let kq: KetQuaLink;
    try {
      kq = await docThat(l, tran, o);
    } catch (e) {
      kq = loiThanhKetQua(l, e);
    }
    // Lỗi mạng thoáng qua không đệm; riêng tư / ok / gợi ý thì đệm (đỡ gọi lại Google mỗi câu hỏi).
    if (kq.trangThai !== 'loi') {
      if (dem.size >= DEM_TOI_DA) for (const k of [...dem.keys()].slice(0, 20)) dem.delete(k);
      dem.set(khoa, { het: Date.now() + HAN_DEM_MS, v: kq });
    }
    return kq;
  })();
  dangBay.set(khoa, p);
  try { return await p; } finally { dangBay.delete(khoa); }
}

function loiThanhKetQua(l: LinkNhanDien, e: unknown): KetQuaLink {
  if (e instanceof LoiTai && e.ma === 'RIENG_TU') return { loai: l.loai, url: l.url, trangThai: 'rieng_tu', chu: cauLinkRiengTu(l) };
  const m = e instanceof LoiTai ? e.message : 'không đọc được';
  return { loai: l.loai, url: l.url, trangThai: 'loi', chu: `${TEN_LOAI[l.loai]}: ${m}.` };
}

async function thuLanLuot<T>(ds: Array<() => Promise<T>>): Promise<T> {
  let loi: unknown = null;
  for (const f of ds) {
    try { return await f(); } catch (e) {
      // Riêng tư thì cách xuất khác cũng riêng tư — dừng ngay.
      if (e instanceof LoiTai && (e.ma === 'RIENG_TU' || e.ma === 'CAM')) throw e;
      loi = e;
    }
  }
  throw loi ?? new LoiTai('không đọc được', 'HTTP');
}

/** Trang HTML ở chỗ chờ một tệp ⇒ Google đưa trang đăng nhập/xác nhận thay cho nội dung. */
function laHtml(kieu: string, b: Buffer): boolean {
  return /text\/html/.test(kieu) || /^\s*<!doctype html|^\s*<html/i.test(b.subarray(0, 200).toString('latin1'));
}

async function docThat(l: LinkNhanDien, tran: number, o: TuyChonDocLink): Promise<KetQuaLink> {
  const goc = { loai: l.loai, url: l.url };
  const [u1, u2] = urlXuat(l);
  switch (l.loai) {
    case 'gdoc': {
      const r = await thuLanLuot([u1, u2].filter((x): x is string => !!x).map((u) => () => taiCoRao(l.loai, u, { tranByte: TRAN_BYTE_CHU })));
      if (laHtml(r.kieu, r.byte)) throw new LoiTai('trang đăng nhập', 'RIENG_TU');
      return { ...goc, trangThai: 'ok', cach: r.url.includes('format=md') ? 'xuất .md' : 'xuất .txt', chu: cat(utf8(r.byte), tran) };
    }
    case 'gsheet': {
      try {
        const r = await taiCoRao(l.loai, u1!, { tranByte: TRAN_BYTE_FILE });
        if (laHtml(r.kieu, r.byte)) throw new LoiTai('trang đăng nhập', 'RIENG_TU');
        const x = docOffice(r.byte, '.xlsx');
        return { ...goc, trangThai: 'ok', cach: `xuất .xlsx — ${x.soPhan} trang tính`, chu: cat(x.chu, tran) };
      } catch (e) {
        if (e instanceof LoiTai && (e.ma === 'RIENG_TU' || e.ma === 'CAM')) throw e;
        const r = await taiCoRao(l.loai, u2!, { tranByte: TRAN_BYTE_CHU });
        if (laHtml(r.kieu, r.byte)) throw new LoiTai('trang đăng nhập', 'RIENG_TU');
        return { ...goc, trangThai: 'ok', cach: `xuất .csv (trang gid=${l.gid ?? '0'})`, chu: cat(utf8(r.byte), tran) };
      }
    }
    case 'gslide': {
      try {
        const r = await taiCoRao(l.loai, u1!, { tranByte: TRAN_BYTE_CHU });
        if (laHtml(r.kieu, r.byte)) throw new LoiTai('trang đăng nhập', 'RIENG_TU');
        const chu = utf8(r.byte);
        if (chu) return { ...goc, trangThai: 'ok', cach: 'xuất .txt', chu: cat(chu, tran) };
      } catch (e) {
        if (e instanceof LoiTai && (e.ma === 'RIENG_TU' || e.ma === 'CAM')) throw e;
      }
      const r = await taiCoRao(l.loai, u2!, { tranByte: TRAN_BYTE_FILE });
      const p = await extractPdf(r.byte);
      return { ...goc, trangThai: 'ok', cach: `xuất .pdf — ${p.pages} trang`, chu: cat(p.text, tran) };
    }
    case 'gdrive': return await docFileDrive(l, u1!, tran);
    case 'gfolder':
      return { ...goc, trangThai: 'goi_y', chu: 'Google Drive (thư mục): không liệt kê được thư mục khi chưa nối Google — mở từng file trong thư mục và gửi link file. / A Drive folder cannot be listed without a Google connection — share the file links instead.' };
    case 'figma': return o.figmaToken ? await docFigmaRest(l, o.figmaToken, tran, !!o.muonAnh) : await docFigmaOembed(l, !!o.muonAnh);
    case 'github': return await docGithub(l, tran);
    case 'notion':
    case 'canva':
      return { ...goc, trangThai: 'goi_y', chu: `${TEN_LOAI[l.loai]}: trang dựng bằng JavaScript — không có URL xuất công khai rẻ. Nếu có trình duyệt thì mở bằng \`web_mo\` rồi \`web_doc\`/\`web_anh\`. / Rendered with JavaScript — open it with the browser tools if available.` };
  }
}

async function docFileDrive(l: LinkNhanDien, url: string, tran: number): Promise<KetQuaLink> {
  const goc = { loai: l.loai, url: l.url };
  const r = await taiCoRao(l.loai, url, { tranByte: TRAN_BYTE_FILE, hetGioMs: 40_000 });
  const b = r.byte;
  if (laHtml(r.kieu, b)) {
    // File lớn ⇒ Google đưa trang "không quét virus được" (cần bấm xác nhận) — không bấm hộ.
    return { ...goc, trangThai: 'goi_y', chu: 'Google Drive: file quá lớn để tải thẳng (Google yêu cầu xác nhận) hoặc là tài liệu Google gốc — mở bằng link docs.google.com của nó. / The Drive file needs a manual confirmation (too large) or is a native Google file.' };
  }
  if (b.subarray(0, 5).toString('latin1') === '%PDF-') {
    const p = await extractPdf(b);
    return { ...goc, trangThai: 'ok', cach: `PDF ${p.pages} trang${p.imageOnly ? ' — nghi bản scan' : ''}`, chu: cat(p.text, tran) };
  }
  const zip = b[0] === 0x50 && b[1] === 0x4b;
  if (zip) {
    const ten = (/filename\*?=(?:UTF-8'')?"?([^";]+)/i.exec(r.dispo)?.[1] ?? '').toLowerCase();
    const duoi = (/\.(docx|pptx|xlsx)$/.exec(ten)?.[1]) as 'docx' | 'pptx' | 'xlsx' | undefined;
    if (!duoi || duoi === 'docx') {
      try {
        const d = await extractDocx(b);
        if (d.text.trim()) return { ...goc, trangThai: 'ok', cach: 'DOCX', chu: cat(d.text, tran) };
      } catch { /* không phải docx */ }
    }
    for (const thu of (duoi ? [duoi] : ['pptx', 'xlsx']) as Array<'docx' | 'pptx' | 'xlsx'>) {
      try {
        const x = docOffice(b, `.${thu}`);
        if (x.chu.trim()) return { ...goc, trangThai: 'ok', cach: `${thu.toUpperCase()} — ${x.soPhan} phần`, chu: cat(x.chu, tran) };
      } catch { /* thử loại khác */ }
    }
  }
  if (/^text\/|json|csv|xml/.test(r.kieu) && !b.subarray(0, 4000).includes(0)) {
    return { ...goc, trangThai: 'ok', cach: r.kieu.split(';')[0] ?? 'chữ', chu: cat(utf8(b), tran) };
  }
  return { ...goc, trangThai: 'goi_y', chu: `Google Drive: file loại "${r.kieu || 'không rõ'}" — không rút được chữ (đọc được PDF, DOCX, PPTX, XLSX, chữ thường).` };
}

// ─── Figma ───────────────────────────────────────────────────────

async function anhThuNho(loai: LinkNhanDien['loai'], url: string): Promise<AnhLink | null> {
  try {
    const r = await taiCoRao(loai, url, { tranByte: TRAN_BYTE_ANH });
    const { default: sharp } = await import('sharp');
    const jpg = await sharp(r.byte, { animated: false, limitInputPixels: 80_000_000 })
      .resize({ width: CANH_ANH, height: CANH_ANH, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' }).jpeg({ quality: 80 }).toBuffer();
    return { media_type: 'image/jpeg', data: jpg.toString('base64') };
  } catch {
    return null;
  }
}

async function docFigmaOembed(l: LinkNhanDien, muonAnh: boolean): Promise<KetQuaLink> {
  const r = await taiCoRao('figma', urlXuat(l)[0]!, { tranByte: 256 * 1024 });
  let j: { title?: string; thumbnail_url?: string; author_name?: string; error?: boolean } = {};
  try { j = JSON.parse(utf8(r.byte)) as typeof j; } catch { /* hỏng */ }
  if (j.error || !j.title) throw new LoiTai('oEmbed không trả tiêu đề', 'RIENG_TU');
  const anh = muonAnh && j.thumbnail_url ? await anhThuNho('figma', j.thumbnail_url) : null;
  return {
    loai: 'figma', url: l.url, trangThai: 'ok', cach: 'oEmbed (không token)', tieuDe: j.title,
    chu: `File Figma "${j.title}"${j.author_name ? ` — tác giả ${j.author_name}` : ''}.${anh ? ' Ảnh xem trước kèm theo.' : ''}\n`
      + 'Chỉ có tiêu đề + ảnh xem trước. Muốn đọc CẤU TRÚC MÀN HÌNH + CHỮ trong từng frame + bình luận: thêm Figma personal access token '
      + 'CHỈ ĐỌC (scope file_content:read) ở cài đặt (CuongMini: /ket-noi figma · CT Work: Cài đặt dự án → Figma).',
    ...(anh ? { anh: [anh] } : {}),
  };
}

type FigmaFile = { name?: string; lastModified?: string; document?: NodeFigma };

async function figmaJson<T>(url: string, token: string, tran = TRAN_BYTE_FIGMA_JSON): Promise<T> {
  try {
    const r = await taiCoRao('figma', url, { tranByte: tran, headers: { 'X-Figma-Token': token }, hetGioMs: 30_000 });
    return JSON.parse(utf8(r.byte)) as T;
  } catch (e) {
    if (e instanceof LoiTai && e.ma === 'RIENG_TU') {
      throw new LoiTai(e.status === 404 ? 'không thấy file (sai link?)' : 'token Figma không đọc được file này (token hết hạn, sai scope, hoặc file của nhóm khác)', e.status === 404 ? 'RIENG_TU' : 'HTTP', e.status);
    }
    throw e;
  }
}

async function docFigmaRest(l: LinkNhanDien, token: string, tran: number, muonAnh: boolean): Promise<KetQuaLink> {
  const key = encodeURIComponent(l.id);
  const api = 'https://api.figma.com/v1';
  const tep = await figmaJson<FigmaFile>(`${api}/files/${key}?depth=2`, token);
  const frames = l.nodeId ? [{ id: l.nodeId, ten: '(node trong link)', trang: '' }] : frameCapCao(tep.document, 6);
  const phan: string[] = [];
  phan.push(`File Figma "${tep.name ?? '?'}" — sửa lần cuối ${(tep.lastModified ?? '').slice(0, 10)}.`);
  const trang = (tep.document?.children ?? []).map((p) => `"${p.name ?? ''}" (${(p.children ?? []).length} khung)`);
  if (trang.length) phan.push(`Trang: ${trang.join(' · ')}`);
  if (frames.length) {
    const nodes = await figmaJson<{ nodes?: Record<string, { document?: NodeFigma } | null> }>(
      `${api}/files/${key}/nodes?ids=${encodeURIComponent(frames.map((f) => f.id).join(','))}`, token);
    const moiFrame = Math.max(1500, Math.floor((tran * 0.75) / frames.length));
    for (const f of frames) {
      const n = nodes.nodes?.[f.id]?.document;
      if (!n) continue;
      phan.push(`## Frame "${n.name ?? f.ten}"${f.trang ? ` (trang ${f.trang})` : ''} — id ${f.id}\n${tomTatCayFigma(n, moiFrame)}`);
    }
  }
  try {
    const bl = await figmaJson<{ comments?: Array<{ message?: string; user?: { handle?: string }; created_at?: string; resolved_at?: string | null }> }>(`${api}/files/${key}/comments`, token, 2 * 1024 * 1024);
    if (bl.comments?.length) phan.push(`## Bình luận (${bl.comments.length})\n${tomTatBinhLuanFigma(bl.comments)}`);
  } catch { /* bình luận là phụ */ }
  const anh: AnhLink[] = [];
  if (muonAnh && frames.length) {
    try {
      const ids = frames.slice(0, 3).map((f) => f.id);
      const im = await figmaJson<{ images?: Record<string, string | null> }>(`${api}/images/${key}?ids=${encodeURIComponent(ids.join(','))}&format=png&scale=0.5`, token, 256 * 1024);
      for (const id of ids) {
        const u = im.images?.[id];
        if (!u) continue;
        const a = await anhThuNho('figma', u);
        if (a) anh.push(a);
      }
      if (anh.length) phan.push(`(Kèm ảnh ${anh.length} frame đầu, thu nhỏ.)`);
    } catch { /* ảnh là phụ */ }
  }
  return { loai: 'figma', url: l.url, trangThai: 'ok', cach: 'Figma REST (token chỉ đọc)', ...(tep.name ? { tieuDe: tep.name } : {}), chu: cat(phan.join('\n\n'), tran), ...(anh.length ? { anh } : {}) };
}

// ─── GitHub ──────────────────────────────────────────────────────

async function ghJson<T>(url: string): Promise<T> {
  const r = await taiCoRao('github', url, { tranByte: 2 * 1024 * 1024, headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } });
  return JSON.parse(utf8(r.byte)) as T;
}

async function docGithub(l: LinkNhanDien, tran: number): Promise<KetQuaLink> {
  const goc = { loai: l.loai, url: l.url };
  const g = l.github ?? { kieu: 'repo' as const };
  const repo = l.id.split('/').map(encodeURIComponent).join('/');
  const api = `https://api.github.com/repos/${repo}`;
  if (g.kieu === 'blob' && g.duong) {
    const r = await taiCoRao('github', `https://raw.githubusercontent.com/${repo}/${g.duong.split('/').map(encodeURIComponent).join('/')}`, { tranByte: TRAN_BYTE_CHU });
    if (r.byte.subarray(0, 4000).includes(0)) return { ...goc, trangThai: 'goi_y', chu: 'GitHub: file nhị phân — không đọc thành chữ.' };
    return { ...goc, trangThai: 'ok', cach: 'file thô', tieuDe: g.duong, chu: cat(utf8(r.byte), tran) };
  }
  if ((g.kieu === 'issue' || g.kieu === 'pull') && g.so) {
    const it = await ghJson<{ title?: string; state?: string; body?: string | null; user?: { login?: string }; pull_request?: unknown; created_at?: string }>(`${api}/issues/${g.so}`);
    let bl: Array<{ user?: { login?: string }; body?: string; created_at?: string }> = [];
    try { bl = await ghJson(`${api}/issues/${g.so}/comments?per_page=30`); } catch { /* phụ */ }
    const chu = [`${it.pull_request ? 'Pull request' : 'Issue'} #${g.so} "${it.title ?? ''}" [${it.state ?? '?'}] — @${it.user?.login ?? '?'} (${(it.created_at ?? '').slice(0, 10)})`,
      (it.body ?? '').trim() || '(không có mô tả)',
      ...(bl.length ? [`## Bình luận (${bl.length})`, ...bl.map((c) => `- @${c.user?.login ?? '?'} (${(c.created_at ?? '').slice(0, 10)}): ${(c.body ?? '').replace(/\s+/g, ' ').slice(0, 800)}`)] : [])].join('\n\n');
    return { ...goc, trangThai: 'ok', cach: 'GitHub API', ...(it.title ? { tieuDe: it.title } : {}), chu: cat(chu, tran) };
  }
  const r = await ghJson<{ full_name?: string; description?: string | null; default_branch?: string; language?: string | null; stargazers_count?: number; topics?: string[] }>(api);
  let readme = '';
  try {
    const rm = await taiCoRao('github', `${api}/readme`, { tranByte: TRAN_BYTE_CHU, headers: { Accept: 'application/vnd.github.raw' } });
    readme = utf8(rm.byte);
  } catch { /* repo không có README */ }
  const chu = [`Repo ${r.full_name ?? l.id}${r.description ? ` — ${r.description}` : ''} · nhánh mặc định ${r.default_branch ?? '?'}${r.language ? ` · ${r.language}` : ''}${r.topics?.length ? ` · [${r.topics.join(', ')}]` : ''}`,
    readme ? `## README\n${readme}` : '(không có README)'].join('\n\n');
  return { ...goc, trangThai: 'ok', cach: 'GitHub API', tieuDe: r.full_name ?? l.id, chu: cat(chu, tran) };
}

/** Kết quả ⇒ khối chữ cho model (dòng nguồn + nội dung). Người gọi tự bọc untrusted theo kiểu của nơi đó. */
export function dongDauKetQua(kq: KetQuaLink): string {
  return `${TEN_LOAI[kq.loai]}${kq.tieuDe ? ` "${kq.tieuDe}"` : ''} <${kq.url}>${kq.cach ? ` — ${kq.cach}` : ''}`;
}
