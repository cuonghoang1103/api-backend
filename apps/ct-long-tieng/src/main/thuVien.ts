/**
 * Thư viện = các thư mục con của `<thuMucTai>/CT Lồng Tiếng/` có `thong-tin.json` (trạm ghi) hoặc `.ctlt.json`
 * (app ghi lúc tải về). Mục được gọi bằng TÊN THƯ MỤC (đã kiểm), không bao giờ bằng đường dẫn renderer đưa.
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import type { MucThuVien } from '../shared/ipc';
import { banDoTep, type BanDoTep } from '../shared/thuVien';

export const TEP_GHI_CHU = '.ctlt.json';

export interface GhiChuApp {
  jobId: string;
  tieuDe: string;
  tep: BanDoTep;
  taiLuc: string;
}

/** Đường dẫn TUYỆT ĐỐI của mục — null nếu tên mục cố thoát ra ngoài gốc. */
export function duongDanMuc(goc: string, mucId: string): string | null {
  const p = path.resolve(goc, mucId);
  if (path.dirname(p) !== path.resolve(goc)) return null;
  return p;
}

/** Đường dẫn TUYỆT ĐỐI của một tệp trong mục, đã kiểm nằm trong gốc. */
export function duongDanTep(goc: string, mucId: string, ten: string): string | null {
  const thuMuc = duongDanMuc(goc, mucId);
  if (!thuMuc) return null;
  const p = path.resolve(thuMuc, ten);
  if (path.dirname(p) !== thuMuc) return null;
  return p;
}

const urlMedia = (mucId: string, ten: string) => `ctlt-media://thu-vien/${encodeURIComponent(mucId)}/${encodeURIComponent(ten)}`;

async function docMuc(goc: string, mucId: string): Promise<MucThuVien | null> {
  const thuMuc = path.join(goc, mucId);
  let ds: string[];
  try { ds = (await fsp.readdir(thuMuc)).filter((t) => !t.endsWith('.part')); } catch { return null; }
  let ghiChu: GhiChuApp | null = null;
  try { ghiChu = JSON.parse(await fsp.readFile(path.join(thuMuc, TEP_GHI_CHU), 'utf8')) as GhiChuApp; } catch { /* không có */ }
  const bd = banDoTep(ds, ghiChu?.tep ?? null);
  if (!bd['thong-tin'] && !ghiChu) return null;
  if (!bd.vi && !bd['vi-goc']) return null;

  let tt: Record<string, unknown> = {};
  if (bd['thong-tin']) {
    try { tt = JSON.parse(await fsp.readFile(path.join(thuMuc, bd['thong-tin']), 'utf8')) as Record<string, unknown>; } catch { /* hỏng */ }
  }
  const s = (v: unknown) => (typeof v === 'string' && v.trim() ? v : null);
  const n = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
  let tong = 0;
  for (const t of ds) { try { tong += (await fsp.stat(path.join(thuMuc, t))).size; } catch { /* bỏ */ } }
  const ngay = /^(\d{4}-\d{2}-\d{2}) /.exec(mucId)?.[1] ?? s(tt.ngay)?.slice(0, 10) ?? '';
  return {
    id: mucId,
    tieuDe: ghiChu?.tieuDe ?? s(tt.tenVideo) ?? s(tt.tieuDe) ?? mucId.replace(/^\d{4}-\d{2}-\d{2} /, ''),
    ngay,
    nguon: s(tt.nguon),
    link: s(tt.link) ?? s(tt.url),
    ngonNgu: s(tt.ngonNgu) ?? s(tt.lang),
    thoiLuong: n(tt.thoiLuong),
    vi: bd.vi ? urlMedia(mucId, bd.vi) : null,
    viGoc: bd['vi-goc'] ? urlMedia(mucId, bd['vi-goc']) : null,
    coPhuDeVi: !!bd['srt-vi'],
    coPhuDeGoc: !!bd['srt-goc'],
    tongDungLuong: tong,
  };
}

export async function quetThuVien(goc: string): Promise<MucThuVien[]> {
  if (!fs.existsSync(goc)) return [];
  const con = await fsp.readdir(goc, { withFileTypes: true });
  const ds = await Promise.all(con.filter((d) => d.isDirectory() && !d.name.startsWith('.')).map((d) => docMuc(goc, d.name)));
  return ds.filter((m): m is MucThuVien => !!m).sort((a, b) => (a.id < b.id ? 1 : -1));
}

export async function docPhuDe(goc: string, mucId: string, loai: 'vi' | 'goc'): Promise<string | null> {
  const thuMuc = duongDanMuc(goc, mucId);
  if (!thuMuc) return null;
  let ds: string[];
  try { ds = await fsp.readdir(thuMuc); } catch { return null; }
  let ghiChu: GhiChuApp | null = null;
  try { ghiChu = JSON.parse(await fsp.readFile(path.join(thuMuc, TEP_GHI_CHU), 'utf8')) as GhiChuApp; } catch { /* không có */ }
  const ten = banDoTep(ds, ghiChu?.tep ?? null)[loai === 'vi' ? 'srt-vi' : 'srt-goc'];
  if (!ten) return null;
  const p = duongDanTep(goc, mucId, ten);
  if (!p) return null;
  const st = await fsp.stat(p);
  if (st.size > 20 * 1024 * 1024) return null;
  return fsp.readFile(p, 'utf8');
}
