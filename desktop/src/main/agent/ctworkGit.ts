/**
 * ============================================================
 * ĐỒNG BỘ GIT ↔ CT WORK (đợt 2 CuongMini ↔ CT Work code, 28/10/2026) — kênh `agent:ctworkHe`
 * ============================================================
 *
 * Phần git THUẦN nằm ở `packages/cuongmini-core/src/gitDongBo.ts` (CLI, VS Code và app cùng một mã). Ở đây chỉ thêm
 * phần CT Work: thư mục gắn dự án nào ⇒ `project_repos` ⇒ remote của thư mục có khớp repo của dự án không, nhánh mặc
 * định dự án khai. Chưa gắn mà người dùng chủ động gõ `/dong-bo` ⇒ dò ngược trong các dự án của họ (≤ 25) để đề nghị gắn.
 *
 * ⛔ `keoGit` GHI vào repo — giao diện chỉ gọi SAU KHI người dùng bấm đồng ý trên thẻ (luật như mọi thao tác ghi
 * của `ctworkHe`). Không bao giờ ép, không bao giờ vứt thay đổi (xem `keoVe`).
 */
import {
  dsCommitMoi, docProjectRepos, keoVe, khoaRepo, khopRepoCtw, kiemDongBo, veDongBo,
  type BoiCanhCtw, type CachKeo, type HoiDongBo, type MucTieuKeo, type RepoCtw, type TrcSau,
} from '../../../../packages/cuongmini-core/src/gitDongBo';
import { getSettings } from '../store';
import { ctworkSan, dsDuAn, ganCo, goiCtw, refCua } from './ctworkHe';
import { theTuNhanh } from './ctworkVe';

/** Kết quả gửi về giao diện (cùng hình `AgentCtworkHeRa.dongBo`). */
export interface DongBoRa {
  laKho: boolean;
  muc: 'im' | 'info' | 'hoi';
  dong: string[];
  hoi: HoiDongBo | null;
  nhanh: string | null;
  upstream: string | null;
  macDinh: string | null;
  soVoiUpstream: TrcSau | null;
  soVoiMacDinh: TrcSau | null;
  banChuaCommit: number;
  fetchOk: boolean;
  /** Key dự án CT Work của thư mục (đã gắn), và remote có khớp repo dự án không. */
  key: string | null;
  khop: boolean | null;
}

/** `project_repos` đọc tối đa một lần / 10 phút mỗi dự án. */
const demRepo = new Map<string, { luc: number; ds: RepoCtw[] }>();
async function repoCua(ref: string): Promise<RepoCtw[] | null> {
  const d = demRepo.get(ref);
  if (d && Date.now() - d.luc < 10 * 60_000) return d.ds;
  const r = await goiCtw('project_repos', { project: ref }).catch(() => null);
  if (!r || r.loi) return null;
  const ds = docProjectRepos(r.noiDung);
  demRepo.set(ref, { luc: Date.now(), ds });
  return ds;
}

/** Dò ngược: remote của thư mục là repo của dự án nào (chỉ khi người dùng gõ lệnh — tốn ≤ 25 lời gọi, đệm 10 phút). */
async function timDuAnTheoRemote(khoa: string[]): Promise<{ key: string; projectId: number | null; workspaceId: number | null; workspace: string | null } | null> {
  if (!khoa.length || !ctworkSan()) return null;
  const ds = await dsDuAn().catch(() => null);
  if (!ds?.ok) return null;
  const hang = ds.ds.slice(0, 25);
  for (let i = 0; i < hang.length; i += 5) {
    const lo = hang.slice(i, i + 5);
    const kq = await Promise.all(lo.map(async (p) => ({ p, ds: await repoCua(p.key) })));
    const thay = kq.find((x) => x.ds?.some((r) => khoa.includes(khoaRepo(r))));
    if (thay) return { key: thay.p.key.split('/').pop()!, projectId: thay.p.id, workspaceId: thay.p.workspaceId, workspace: thay.p.workspace };
  }
  return null;
}

export function tuDongBat(): boolean {
  return getSettings().gitDongBoTuDong !== false;
}

export async function dongBoGit(goc: string | null, o: { ngonNgu: 'vi' | 'en'; tuDong: boolean; timDuAn: boolean }): Promise<{
  ok: boolean; loi?: string; dongBo?: DongBoRa; tat?: boolean;
  doan?: { key: string; projectId: number | null; workspaceId: number | null; workspace: string | null } | null;
}> {
  if (!goc) return { ok: false, loi: o.ngonNgu === 'en' ? 'No project folder open.' : 'Chưa mở thư mục dự án.' };
  if (o.tuDong && !tuDongBat()) return { ok: true, tat: true };
  const gan = await ganCo(goc).catch(() => null);
  const dsRepo = gan && ctworkSan() ? await repoCua(refCua(gan)) : null;
  let tt = await kiemDongBo(goc, { fetch: true, hanFetchMs: o.tuDong ? 8000 : 15_000, goiYMacDinh: dsRepo?.[0]?.defaultBranch ?? null });
  if (!tt.laKho) {
    return { ok: true, dongBo: { laKho: false, muc: o.tuDong ? 'im' : 'info', dong: veDongBo(tt, o.ngonNgu).dong, hoi: null, nhanh: null, upstream: null, macDinh: null, soVoiUpstream: null, soVoiMacDinh: null, banChuaCommit: 0, fetchOk: false, key: gan?.key ?? null, khop: null } };
  }
  const khop = dsRepo?.length ? khopRepoCtw(tt.remote, dsRepo) : null;
  // Remote chưa có HEAD (clone cũ) mà dự án khai nhánh mặc định khác ⇒ kiểm lại với gợi ý đúng (không fetch lần nữa).
  if (!tt.macDinh && khop?.repo.defaultBranch) tt = await kiemDongBo(goc, { fetch: false, goiYMacDinh: khop.repo.defaultBranch });
  const ctx: BoiCanhCtw = {
    key: gan?.key ?? null,
    khop: !gan || !dsRepo?.length || !tt.remote.length ? null : Boolean(khop),
    repo: khop ? khoaRepo(khop.repo) : null,
    dsRepo: (dsRepo ?? []).map(khoaRepo),
    the: gan ? theTuNhanh(tt.nhanh, gan.key) : null,
  };
  const tb = veDongBo(tt, o.ngonNgu, ctx);
  const doan = !gan && o.timDuAn ? await timDuAnTheoRemote(tt.remote.map((r) => r.khoa).filter((k): k is string => !!k)) : null;
  return {
    ok: true,
    dongBo: {
      laKho: true, muc: tb.muc, dong: tb.dong, hoi: tb.hoi, nhanh: tt.nhanh, upstream: tt.upstream, macDinh: tt.macDinh,
      soVoiUpstream: tt.soVoiUpstream, soVoiMacDinh: tt.soVoiMacDinh, banChuaCommit: tt.thayDoi.daTheoDoi + tt.thayDoi.chuaTheoDoi,
      fetchOk: tt.fetch.ok, key: gan?.key ?? null, khop: ctx.khop ?? null,
    },
    ...(doan ? { doan } : {}),
  };
}

export async function keoGit(goc: string | null, o: { cach: CachKeo; mucTieu: MucTieuKeo; nhanh: string; ngonNgu: 'vi' | 'en' }): Promise<{ ok: boolean; loi?: string; md?: string; xungDot?: string[] }> {
  if (!goc) return { ok: false, loi: o.ngonNgu === 'en' ? 'No project folder open.' : 'Chưa mở thư mục dự án.' };
  const r = await keoVe(goc, { cach: o.cach, mucTieu: o.mucTieu, nhanh: o.nhanh, ngonNgu: o.ngonNgu });
  return r.ok ? { ok: true, md: r.noi } : { ok: false, loi: r.noi, ...(r.xungDot ? { xungDot: r.xungDot } : {}) };
}

export async function xemCommitGit(goc: string | null, mucTieu: MucTieuKeo, ngonNgu: 'vi' | 'en'): Promise<{ ok: boolean; md?: string; loi?: string }> {
  if (!goc) return { ok: false, loi: ngonNgu === 'en' ? 'No project folder open.' : 'Chưa mở thư mục dự án.' };
  const r = await dsCommitMoi(goc, mucTieu, { n: 15 });
  if (!r.dich) return { ok: false, loi: ngonNgu === 'en' ? 'No branch to compare with.' : 'Không có nhánh để so.' };
  const L = (vi: string, en: string) => (ngonNgu === 'en' ? en : vi);
  const khoi = (ds: string[]) => (ds.length ? `\`\`\`\n${ds.join('\n')}\n\`\`\`` : L('_(không có)_', '_(none)_'));
  return {
    ok: true,
    md: [`**${L(`Mới trên ${r.dich}`, `New on ${r.dich}`)}** (${r.moi.length})`, khoi(r.moi), '', `**${L('Của bạn, chưa có trên đó', 'Yours, not there yet')}** (${r.cuaToi.length})`, khoi(r.cuaToi)].join('\n'),
  };
}
