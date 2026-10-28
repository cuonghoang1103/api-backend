/**
 * ============================================================
 * ĐỒNG BỘ GIT — phần ĐIỀU PHỐI chung ba nơi (đợt 2 CuongMini ↔ CT Work code, 28/10/2026)
 * ============================================================
 *
 * Thuần (không React/DOM/Node) như `ctworkLenh.ts`: CLI, VS Code (webview) và app desktop cùng gọi, mỗi nơi chỉ cắm
 * cách vẽ thẻ (`chon`) + câu trả lời (`traLoi`). Việc thật ở lõi: `agent:ctworkHe` viec `dongBoGit` / `keoGit` /
 * `xemCommitGit` / `dongBoBat` (`desktop/src/main/agent/ctworkGit.ts` ⇒ `packages/cuongmini-core/src/gitDongBo.ts`).
 *
 *   • Lúc mở (`hoiDongBoGit(g, { tuDong: true })`): fetch lặng lẽ; khớp ⇒ im; có điều đáng biết ⇒ một dòng; nhánh đang
 *     SAU GitHub / phân kỳ / thiếu commit mới của main ⇒ thẻ hỏi. Mỗi tiến trình hỏi một lần.
 *   • `/dong-bo` (`/sync`): kiểm ngay, in đủ (kể cả "✓ đã khớp"), dò dự án CT Work theo remote nếu thư mục chưa gắn.
 *   • ⛔ Kéo về CHỈ chạy sau khi người dùng chọn trên thẻ. Mặc định fast-forward; rebase/merge do người dùng chọn.
 */
import { hoiGanDoan, type GiaoDienCtw, type MucChon, type RaCtw } from './ctworkLenh';

export interface HoiGit {
  loai: 'keo' | 'phanKy' | 'capNhatMacDinh'; cauHoi: string; moTa: string;
  luaChon: Array<{ giaTri: string; nhan: string; mo?: string }>;
}
export interface DongBoGit {
  laKho: boolean; muc: 'im' | 'info' | 'hoi'; dong: string[]; hoi: HoiGit | null;
  nhanh: string | null; upstream: string | null; macDinh: string | null;
  soVoiUpstream: { truoc: number; sau: number } | null; soVoiMacDinh: { truoc: number; sau: number } | null;
  banChuaCommit: number; fetchOk: boolean; key: string | null; khop: boolean | null;
}
/** Kết quả `agent:ctworkHe` cho các việc git (chép lỏng — CLI/VS Code khỏi kéo zod). */
export interface RaGit {
  ok: boolean; loi?: string; md?: string; bat?: boolean; tat?: boolean;
  dongBo?: DongBoGit; xungDot?: string[]; doan?: RaCtw['doan'];
}

const Lg = (g: GiaoDienCtw) => (vi: string, en: string): string => (g.ngonNgu === 'en' ? en : vi);

async function heGit(g: GiaoDienCtw, viec: string, them: Record<string, unknown> = {}): Promise<RaGit> {
  try {
    return (await g.goi<RaGit>('agent:ctworkHe', { viec, ngonNgu: g.ngonNgu, ...them })) ?? { ok: false, loi: '?' };
  } catch (e) {
    return { ok: false, loi: (e as Error).message };
  }
}

/** Lõi CŨ (app desktop chưa cập nhật mà VS Code chạy qua app) không biết việc này ⇒ im lặng, không báo lỗi khó hiểu. */
export const laLoiLoiCu = (loi: string | null | undefined): boolean => /Việc không hợp lệ|Invalid enum|invalid_enum_value|Expected '?goiY/i.test(loi ?? '');

let daHoiLucMo = false;

/** Lúc mở. Trả `true` khi đã hiện thẻ hỏi. */
export async function hoiDongBoGit(g: GiaoDienCtw, o: { tuDong: boolean } = { tuDong: true }): Promise<boolean> {
  if (o.tuDong && daHoiLucMo) return false;
  const r = await heGit(g, 'dongBoGit', { tuDong: o.tuDong });
  /* Một lần mỗi tiến trình giao diện — tính từ lần kiểm được một repo thật (tab app chưa mở thư mục thì lần sau vẫn kiểm). */
  if (o.tuDong && (r.tat || r.dongBo?.laKho)) daHoiLucMo = true;
  if (!r.ok || r.tat || !r.dongBo) {
    if (!o.tuDong && !r.ok && !laLoiLoiCu(r.loi)) g.thongBao(r.loi ?? '?', 'loi');
    return false;
  }
  return veKetQua(g, r.dongBo, { tuDong: o.tuDong, doan: r.doan ?? null });
}

/** `/dong-bo [on|off|trang-thai]` — không tham số: kiểm ngay. */
export async function lenhDongBo(thamSo: string, g: GiaoDienCtw): Promise<void> {
  const L = Lg(g);
  const t = thamSo.trim().toLowerCase();
  if (/^(on|bat|bật|off|tat|tắt)$/.test(t)) {
    const bat = /^(on|bat|bật)$/.test(t);
    const r = await heGit(g, 'dongBoBat', { bat });
    if (!r.ok) { g.thongBao(laLoiLoiCu(r.loi) ? L('Lõi này chưa hỗ trợ đồng bộ git — cập nhật app/CLI.', 'This core does not support git sync yet — update the app/CLI.') : (r.loi ?? '?'), 'loi'); return; }
    g.thongBao(r.bat
      ? L('Đã BẬT tự kiểm git lúc mở: fetch lặng lẽ, nhánh đang sau GitHub thì hỏi có pull không.', 'Git check on start is ON: quiet fetch, asks to pull when your branch is behind GitHub.')
      : L('Đã TẮT tự kiểm git lúc mở. Vẫn kiểm tay được bằng /dong-bo.', 'Git check on start is OFF. You can still run /sync any time.'), 'ok');
    return;
  }
  g.thongBao(L('Đang kiểm git với GitHub…', 'Checking git against GitHub…'));
  const r = await heGit(g, 'dongBoGit', { timDuAn: true });
  if (!r.ok || !r.dongBo) {
    g.traLoi(laLoiLoiCu(r.loi) ? L('Lõi này chưa hỗ trợ đồng bộ git — cập nhật app/CLI.', 'This core does not support git sync yet — update the app/CLI.') : (r.loi ?? '?'));
    return;
  }
  await veKetQua(g, r.dongBo, { tuDong: false, doan: r.doan ?? null });
}

async function veKetQua(g: GiaoDienCtw, d: DongBoGit, o: { tuDong: boolean; doan: RaCtw['doan'] | null }): Promise<boolean> {
  const L = Lg(g);
  if (o.tuDong) {
    if (d.muc === 'im' || !d.laKho) return false;
    for (const dong of d.dong) g.thongBao(dong, dong.startsWith('⚠') ? 'loi' : 'info');
  } else {
    const dau = d.laKho && d.nhanh ? `**git · ${d.nhanh}**${d.upstream ? ` ⇄ ${d.upstream}` : ''}${d.macDinh && d.macDinh !== d.upstream ? ` · ${L('nhánh chính', 'main branch')} ${d.macDinh}` : ''}` : '';
    g.traLoi([dau, ...d.dong.map((x) => `${x}`)].filter(Boolean).join('\n\n') || L('Không có gì cần làm.', 'Nothing to do.'));
  }
  if (!o.tuDong && o.doan && !d.key) hoiGanDoan(g, o.doan, 'remote');
  if (!d.hoi) return false;
  hienThe(g, d, d.hoi);
  return true;
}

function hienThe(g: GiaoDienCtw, d: DongBoGit, h: HoiGit): void {
  const L = Lg(g);
  const ds: MucChon[] = h.luaChon.map((x) => ({
    nhan: x.nhan, giaTri: x.giaTri, ...(x.mo ? { mo: x.mo } : {}), ...(x.giaTri === 'khong' ? { so: '0' } : {}),
  }));
  g.chon({
    tieuDe: h.cauHoi,
    moTa: h.moTa,
    ds,
    khiChon: async (v) => {
      if (v === 'khong') { g.thongBao(L('Để sau — gõ /dong-bo khi muốn kiểm lại.', 'Later — type /sync to check again.'), 'info'); return; }
      const [viec, mucTieu] = v.split(':') as [string, 'upstream' | 'macDinh' | undefined];
      if (viec === 'xem') {
        const r = await heGit(g, 'xemCommitGit', { mucTieu: mucTieu ?? 'upstream' });
        g.traLoi(r.ok ? r.md ?? '' : r.loi ?? '?');
        hienThe(g, d, { ...h, luaChon: h.luaChon.filter((x) => !x.giaTri.startsWith('xem:')) });
        return;
      }
      if (viec !== 'ff' && viec !== 'rebase' && viec !== 'merge') return;
      if (!d.nhanh) return;
      g.thongBao(viec === 'ff' ? L('Đang pull (fast-forward)…', 'Pulling (fast-forward)…') : L(`Đang ${viec}…`, `Running ${viec}…`));
      const r = await heGit(g, 'keoGit', { cach: viec, mucTieu: mucTieu ?? 'upstream', tenNhanh: d.nhanh });
      if (r.ok) { g.thongBao(r.md ?? '✓', 'ok'); g.lamMoiDong?.(); return; }
      g.traLoi(r.loi ?? '?');
      if (r.xungDot?.length) {
        const dich = mucTieu === 'macDinh' ? d.macDinh : d.upstream;
        g.datNhap(L(`Giúp mình ${viec} nhánh ${d.nhanh} lên ${dich ?? 'origin'} và giải xung đột từng bước (file: ${r.xungDot.slice(0, 6).join(', ')})`,
          `Help me ${viec} branch ${d.nhanh} onto ${dich ?? 'origin'} and resolve the conflicts step by step (files: ${r.xungDot.slice(0, 6).join(', ')})`));
      }
    },
  });
}

/** CHỈ cho test: cho hỏi lúc mở lại. */
export function _datLaiDongBo(): void { daHoiLucMo = false; }
