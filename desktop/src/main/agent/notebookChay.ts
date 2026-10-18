/**
 * CHẠY NOTEBOOK `.ipynb` (đợt 4, 18/10/2026) — `chay_notebook`.
 *
 * Dùng `jupyter nbconvert --to notebook --execute` có sẵn trên máy (không tự
 * dựng kernel): chạy trên BẢN SAO trong thư mục tạm, cwd là thư mục chứa
 * notebook (đường dẫn tương đối trong mã vẫn đúng), rồi rút đầu ra từng ô.
 * `den_o` = chạy ô 0…N (ô sau không chạy). Ghi đầu ra NGƯỢC vào file gốc chỉ
 * khi được phép sửa — qua sổ hoàn tác (`ghiSoTruoc`) nên /undo lùi được.
 *
 * Khai capability `notebook_chay` chỉ khi tìm thấy `jupyter` (cache 60s) —
 * máy không có thì model không được mời.
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chuCuaDauRa } from './notebook';

export interface KetQuaChayLenh { ma: number | null; ra: string; loi: string }
type HamChay = (lenh: string, args: string[], tuyChon: { cwd: string; timeout: number; signal?: AbortSignal }) => Promise<KetQuaChayLenh>;

const chayThat: HamChay = (lenh, args, t) => new Promise((ok) => {
  execFile(lenh, args, { cwd: t.cwd, timeout: t.timeout, windowsHide: true, maxBuffer: 32 * 1024 * 1024, ...(t.signal ? { signal: t.signal } : {}) }, (err, stdout, stderr) => {
    const ma = err ? (typeof (err as { code?: unknown }).code === 'number' ? (err as { code: number }).code : null) : 0;
    ok({ ma, ra: String(stdout ?? ''), loi: String(stderr ?? '') || (err && ma === null ? (err as Error).message : '') });
  });
});
let chay: HamChay = chayThat;
/** Chỉ cho test. */
export function _datChayNotebook(f: HamChay | null): void { chay = f ?? chayThat; dem = null; }

let dem: { luc: number; co: boolean } | null = null;
export async function coJupyter(): Promise<boolean> {
  if (dem && Date.now() - dem.luc < 60_000) return dem.co;
  const r = await chay('jupyter', ['nbconvert', '--version'], { cwd: os.homedir(), timeout: 15_000 }).catch(() => ({ ma: 1, ra: '', loi: '' }));
  dem = { luc: Date.now(), co: r.ma === 0 };
  return dem.co;
}

export const TRAN_GIAY_NB = 600;

/** Lệnh hiện trên thẻ duyệt (nguyên văn thứ sẽ chạy). */
export function lenhHienThi(rel: string, denO: number | null, giay: number): string {
  return `jupyter nbconvert --to notebook --execute --ExecutePreprocessor.timeout=${giay} ${JSON.stringify(rel)}${denO !== null ? `  # chạy ô 0…${denO}` : ''}`;
}

interface ONb { cell_type?: string; outputs?: unknown[]; execution_count?: number | null; [k: string]: unknown }

export async function chayNotebook(
  file: string, opts: { denO: number | null; giay: number; signal?: AbortSignal },
): Promise<{ ok: true; tomTat: string; noiDung: string; ketQua: string } | { ok: false; loi: string }> {
  let goc: { cells?: ONb[]; [k: string]: unknown };
  try { goc = JSON.parse(await fs.readFile(file, 'utf8')); } catch (e) { return { ok: false, loi: `không đọc được notebook: ${(e as Error).message.slice(0, 120)}` }; }
  if (!Array.isArray(goc.cells)) return { ok: false, loi: 'không phải notebook (thiếu "cells").' };
  if (opts.denO !== null && (opts.denO < 0 || opts.denO >= goc.cells.length)) return { ok: false, loi: `"den_o" phải trong 0…${goc.cells.length - 1}.` };
  const tam = await fs.mkdtemp(path.join(os.tmpdir(), 'cuongmini-nb-'));
  try {
    const ban = { ...goc, cells: opts.denO === null ? goc.cells : goc.cells.slice(0, opts.denO + 1) };
    const vao = path.join(tam, 'vao.ipynb');
    await fs.writeFile(vao, JSON.stringify(ban), 'utf8');
    const r = await chay('jupyter', ['nbconvert', '--to', 'notebook', '--execute', `--ExecutePreprocessor.timeout=${opts.giay}`,
      '--allow-errors', '--output', 'ra.ipynb', '--output-dir', tam, vao], { cwd: path.dirname(file), timeout: (opts.giay + 60) * 1000, ...(opts.signal ? { signal: opts.signal } : {}) });
    let ra: { cells?: ONb[] };
    try { ra = JSON.parse(await fs.readFile(path.join(tam, 'ra.ipynb'), 'utf8')); } catch {
      return { ok: false, loi: `jupyter không chạy được notebook (mã ${r.ma ?? 'bị giết'}): ${(r.loi || r.ra).trim().split('\n').slice(-8).join('\n').slice(0, 1500)}` };
    }
    const cells = Array.isArray(ra.cells) ? ra.cells : [];
    const dong: string[] = [];
    let soLoi = 0;
    cells.forEach((o, i) => {
      if (o.cell_type !== 'code') return;
      const outs = Array.isArray(o.outputs) ? o.outputs : [];
      const loi = outs.some((x) => (x as { output_type?: string }).output_type === 'error');
      if (loi) soLoi++;
      const chu = outs.map(chuCuaDauRa).filter(Boolean).join('\n').trim();
      if (!chu && opts.denO !== null && i !== opts.denO) return;
      const catChu = chu.length > 1500 ? `${chu.slice(0, 1500)}\n… (đã cắt, còn ${chu.length - 1500} ký tự)` : chu;
      dong.push(`── ô ${i}${loi ? ' · LỖI' : ''} ──\n${catChu || '(không in gì)'}`);
    });
    // Ghép đầu ra mới vào bản gốc (giữ nguyên ô sau `den_o`).
    const moi = { ...goc, cells: goc.cells.map((o, i) => (i < cells.length && o.cell_type === 'code' ? { ...o, outputs: cells[i]!.outputs ?? [], execution_count: cells[i]!.execution_count ?? null } : o)) };
    return {
      ok: true,
      tomTat: `${cells.length} ô${soLoi ? ` · ${soLoi} ô lỗi` : ' · xong'}`,
      noiDung: `${soLoi ? `⚠️ ${soLoi} ô báo lỗi.\n` : ''}${dong.join('\n\n') || '(không ô mã nào in gì)'}`,
      ketQua: `${JSON.stringify(moi, null, 1)}\n`,
    };
  } finally {
    await fs.rm(tam, { recursive: true, force: true }).catch(() => {});
  }
}
