/**
 * ============================================================
 * CUONGMINI DẪN ĐƯỜNG CT WORK — phần I/O (đợt 6, 18/10/2026)
 * ============================================================
 *
 * Người dùng nhóm (sinh viên) thường không biết dùng CT Work. Ở đây là những việc APP tự làm (không qua model) để dẫn:
 *   • `homNay` — đầu buổi: việc của tôi + hạn + nên làm cái nào trước (tự hiện MỘT lần mỗi ngày mỗi thư mục);
 *   • `huongDan` — một thẻ: đọc gì (link), các bước, xong khi, hỏi ai + PHỤ THUỘC (ai phải làm xong gì trước, nhánh nào);
 *   • `goiYSau` / `xemTruocGoiY` / `lamGoiY` — làm xong ⇒ gợi ý thao tác đúng luật workflow; GHI chỉ chạy sau thẻ xem
 *     trước của giao diện;
 *   • `huongDanNhom` — trang Docs "AGENTS.md — …" của dự án (khối ```markdown đầu tiên), đệm theo `updatedAt`; không có
 *     trang ⇒ tự đọc trang tổng quan + sprint;
 *   • `kiemTin` — theo dõi nhẹ (`my_updates`, ≥ 60 s/lần, chỉ khi có dự án gắn, tắt được);
 *   • `tongQuan` (trưởng nhóm / giảng viên) và `mauFpt` (mẫu FPT theo giai đoạn).
 * Mọi lời gọi CT Work đi qua đường MCP chính thức của `ctworkHe.ts` (`goiCtw`) — module này không cầm token.
 */
import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { app } from 'electron';
import { WEB_ORIGIN } from '../config';
import {
  canGan, chuLoiCtw, chuanKhoa, ctworkSan, docTheCo, dongTrangThai, duAnCuaThe, ganCo, gitCtw, goiCtw, guiBinhLuan, laLoi, laTheLoi,
  loiChiDoc, nhanhGoc, nhanhHienTai, refCua, soanBinhLuan, thieuQuyenGhi, type GanDuAn, type KetQuaXem,
} from './ctworkHe';
import { T, docDsDuAn, docViecToi, rutJson, theTuNhanh } from './ctworkVe';
import {
  cauPhuThuoc, docCapNhat, docDsTrang, docPhuThuoc, goiYMauFpt, goiYSauViec, gopGhiChu, nhanhCuaThe, rutNoiDungAgents, soanTinNhacTre,
  soanTinXong, timTrangAgents, timTrangTongQuan, tinTheoDoi, veHomNay, veHuongDanThe, veTongQuanNhom, xepViecHomNay,
  type GoiYViec, type MauFpt, type TheNhom, type TinhTrangGit,
} from './ctworkDanDuongVe';
import { toolCuaServer } from './mcp';
import { TEN_SERVER } from './ctworkKetNoi';

const chayFile = promisify(execFile);

// ─── Phụ thuộc tiêm được ─────────────────────────────────────────

type Gh = (args: string[], cwd: string) => Promise<{ ok: boolean; ra: string }>;
let ghThat: Gh = async (args, cwd) => {
  try {
    const { stdout } = await chayFile('gh', args, { cwd, timeout: 8000, maxBuffer: 1024 * 1024, windowsHide: true });
    return { ok: true, ra: String(stdout) };
  } catch { return { ok: false, ra: '' }; }
};
let thuMucTrangThai: () => string = () => app.getPath('userData');
/** CHỈ cho test. */
export function _datDanDuong(o: { gh?: Gh; thuMuc?: () => string }): void {
  if (o.gh) ghThat = o.gh;
  if (o.thuMuc) thuMucTrangThai = o.thuMuc;
}
/** CHỈ cho test: xoá mọi đệm của module. */
export function _xoaDemDanDuong(): void { demNhom.clear(); demTrang.clear(); daGoiY.clear(); mocTruocLuot.clear(); tinLuc.clear(); lastIdTin = null; demVai.clear(); }

/** Server CT Work có tool này không (đọc `tools/list` — token chỉ đọc không có tool ghi). Chưa biết ⇒ coi như có. */
function coTool(ten: string): boolean {
  const ds = toolCuaServer(TEN_SERVER);
  return !ds.length || ds.some((t) => t.tenGoc === ten);
}

// ─── Trạng thái nhỏ trên đĩa (theo dõi bật/tắt, đầu buổi đã hiện) ─

interface TrangThaiDd { theoDoi?: boolean; dauBuoi?: Record<string, string> }
const fileDd = () => path.join(thuMucTrangThai(), 'ctwork-dan-duong.json');
async function docDd(): Promise<TrangThaiDd> {
  try { return JSON.parse(await readFile(fileDd(), 'utf8')) as TrangThaiDd; } catch { return {}; }
}
async function ghiDd(f: (s: TrangThaiDd) => void): Promise<void> {
  const s = await docDd();
  f(s);
  await mkdir(path.dirname(fileDd()), { recursive: true }).catch(() => {});
  await writeFile(fileDd(), JSON.stringify(s), 'utf8').catch(() => {});
}
const ngayHomNay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Theo dõi (báo nhẹ) đang bật không — mặc định BẬT. `bat` ⇒ đổi. */
export async function theoDoiBat(bat?: boolean): Promise<boolean> {
  if (typeof bat === 'boolean') await ghiDd((s) => { s.theoDoi = bat; });
  return (await docDd()).theoDoi !== false;
}

// ─── Vai của tôi trong dự án ──────────────────────────────────────

const demVai = new Map<string, { luc: number; vai: string | null }>();
export async function vaiCua(g: GanDuAn): Promise<string | null> {
  if (g.vai) return g.vai;
  const k = refCua(g);
  const d = demVai.get(k);
  if (d && Date.now() - d.luc < 30 * 60_000) return d.vai;
  const r = await goiCtw('list_projects', {});
  const vai = r.loi ? null : docDsDuAn(r.noiDung).find((p) => p.key === k || p.key.split('/').pop() === g.key)?.vaiTro ?? null;
  demVai.set(k, { luc: Date.now(), vai });
  return vai;
}

// ─── Đầu buổi: hôm nay làm gì ─────────────────────────────────────

export async function homNay(goc: string | null, o: { tuDong?: boolean } = {}): Promise<KetQuaXem & { boQua?: boolean; truoc?: string | null; dsThe?: Array<{ key: string; title: string; status: string | null; dueDate: string | null; blocked: boolean }> }> {
  if (o.tuDong && (!goc || !ctworkSan())) return { ok: true, boQua: true };
  const g = await canGan(goc);
  if (laLoi(g)) return o.tuDong ? { ok: true, boQua: true } : g;
  const hn = ngayHomNay();
  if (o.tuDong && (await docDd()).dauBuoi?.[goc!] === hn) return { ok: true, boQua: true };
  const r = await goiCtw('my_work', { project: refCua(g) });
  if (r.loi) return o.tuDong ? { ok: true, boQua: true } : { ok: false, loi: chuLoiCtw(r.noiDung) };
  if (o.tuDong) await ghiDd((s) => { s.dauBuoi = { ...(s.dauBuoi ?? {}), [goc!]: hn }; });
  const h = xepViecHomNay(docViecToi(r.noiDung));
  const d = await dongTrangThai(goc).catch(() => null);
  return {
    ok: true, md: veHomNay(h, g.key, d?.sprint ? { ten: d.sprint.ten, conNgay: d.sprint.conNgay } : null),
    truoc: h.truoc?.key ?? null,
    dsThe: h.ds.slice(0, 8).map((v) => ({ key: v.key, title: v.title, status: v.status, dueDate: v.dueDate, blocked: v.blocked })),
  };
}

// ─── Hướng dẫn một thẻ (+ phụ thuộc) ─────────────────────────────

async function docTheDayDu(g: GanDuAn, key: string): Promise<{ ok: true; text: string } | { ok: false; loi: string }> {
  const tool = coTool('issue_guide') ? 'issue_guide' : 'get_issue';
  const r = await goiCtw(tool, { project: duAnCuaThe(g, key), issue: key });
  if (r.loi && tool === 'issue_guide') {
    const r2 = await goiCtw('get_issue', { project: duAnCuaThe(g, key), issue: key });
    return r2.loi ? { ok: false, loi: chuLoiCtw(r2.noiDung) } : { ok: true, text: r2.noiDung };
  }
  return r.loi ? { ok: false, loi: chuLoiCtw(r.noiDung) } : { ok: true, text: r.noiDung };
}

/** Nhánh remote của các thẻ đang chặn (`git branch -r`). */
async function nhanhRemote(goc: string, keys: string[]): Promise<Record<string, string | null>> {
  if (!keys.length) return {};
  const r = await gitCtw(['branch', '-r', '--list', ...keys.map((k) => `*${k}*`)], goc);
  const ds = r.ok ? r.ra.split('\n') : [];
  return Object.fromEntries(keys.map((k) => [k, nhanhCuaThe(ds, k)]));
}

export async function huongDan(goc: string | null, the: string | undefined): Promise<KetQuaXem & { key?: string; phuThuoc?: string[]; chan?: string[] }> {
  const g = await canGan(goc);
  if (laLoi(g)) return g;
  const key = chuanKhoa(g, the) ?? theTuNhanh(await nhanhHienTai(goc!), g.key);
  if (!key) return { ok: false, loi: T('Thẻ nào? Gõ `/ctwork huong-dan LF-18`.', 'Which issue? Type `/ctwork guide LF-18`.') };
  const r = await docTheDayDu(g, key);
  if (!r.ok) return { ok: false, loi: r.loi };
  const p = docPhuThuoc(r.text);
  const nh = await nhanhRemote(goc!, p.chan.map((c) => c.key));
  const md = veHuongDanThe(r.text, { webGoc: WEB_ORIGIN, nhanh: nh });
  if (!md) return { ok: false, loi: T(`Không đọc được thẻ ${key}.`, `Could not read issue ${key}.`) };
  return { ok: true, md, key, phuThuoc: cauPhuThuoc(key, p, nh), chan: p.chan.map((c) => c.key) };
}

// ─── Làm xong ⇒ gợi ý bước tiếp ──────────────────────────────────

async function tinhTrangGit(goc: string): Promise<TinhTrangGit & { head: string | null }> {
  const nhanh = await nhanhHienTai(goc);
  const goc0 = await nhanhGoc(goc);
  const dem = async (args: string[]) => { const r = await gitCtw(args, goc); return r.ok ? Number(r.ra.trim()) || 0 : null; };
  const soCommit = goc0 && nhanh && goc0.replace(/^origin\//, '') !== nhanh ? (await dem(['rev-list', '--count', `${goc0}..HEAD`])) ?? 0 : 0;
  const chuaPush = await dem(['rev-list', '--count', '@{u}..HEAD']);
  const st = await gitCtw(['status', '--porcelain'], goc);
  const head = await gitCtw(['rev-parse', 'HEAD'], goc);
  const pr = soCommit > 0 ? await ghThat(['pr', 'view', '--json', 'url', '-q', '.url'], goc) : { ok: false, ra: '' };
  const prUrl = pr.ok && /^https?:\/\/\S+$/.test(pr.ra.trim()) ? pr.ra.trim() : null;
  /* `.cuongmini/` (file gắn dự án của chính CuongMini) không tính là "việc còn dở" của người dùng. */
  const dsDo = st.ok ? st.ra.split('\n').filter((d) => d.trim() && !/^.{2,3}\.cuongmini\//.test(d)) : [];
  return { nhanh, soCommit, chuaPush, soFileChuaCommit: dsDo.length, prUrl, head: head.ok ? head.ra.trim() : null };
}

/** Gợi ý đã hiện (tự động) theo thẻ + HEAD + số file — không nhắc lại đúng tình trạng đó. */
const daGoiY = new Set<string>();

/**
 * QA đợt 6: dấu git (HEAD + danh sách file đổi) ghi lúc BẮT ĐẦU mỗi lượt (`ipc/agent.ts › chayCho`). Gợi ý tự động sau
 * lượt chỉ hiện khi LƯỢT ĐÓ đổi git. Trước đây: mở CuongMini trên nhánh `LF-18-…` đã có commit rồi hỏi "hôm nay tôi làm
 * gì" ⇒ bật ngay thẻ "Xong việc ở LF-18?" 9 mục — dù lượt chỉ trả lời một câu hỏi.
 */
const mocTruocLuot = new Map<string, string>();

async function dauGitNhanh(goc: string): Promise<string> {
  const [h, st] = await Promise.all([gitCtw(['rev-parse', 'HEAD'], goc), gitCtw(['status', '--porcelain'], goc)]);
  const ds = st.ok ? st.ra.split('\n').filter((d) => d.trim() && !/^.{2,3}\.cuongmini\//.test(d)).sort() : [];
  return `${h.ok ? h.ra.trim() : '?'}|${ds.join('\n')}`;
}

/** Ghi mốc git trước lượt (chỉ khi thư mục đã gắn CT Work — không gắn thì gợi ý tự động không bao giờ chạy). */
export async function ghiMocTruocLuot(goc: string | null): Promise<void> {
  if (!goc || !ctworkSan()) return;
  if (!(await ganCo(goc).catch(() => null))) return;
  mocTruocLuot.set(goc, await dauGitNhanh(goc));
}

export async function goiYSau(goc: string | null, the?: string, o: { tuDong?: boolean } = {}): Promise<KetQuaXem & { key?: string; goiY?: GoiYViec[]; boQua?: boolean }> {
  if (o.tuDong && (!goc || !ctworkSan())) return { ok: true, boQua: true };
  const g = await canGan(goc);
  if (laLoi(g)) return o.tuDong ? { ok: true, boQua: true } : g;
  const key = chuanKhoa(g, the) ?? theTuNhanh(await nhanhHienTai(goc!), g.key);
  if (!key) return o.tuDong ? { ok: true, boQua: true } : { ok: false, loi: T('Chưa biết thẻ nào — làm trên nhánh `LF-18-…` hoặc gõ `/ctwork xong LF-18`.', 'Which issue? Work on a `LF-18-…` branch or type `/ctwork done LF-18`.') };
  const git = await tinhTrangGit(goc!);
  if (o.tuDong) {
    if (git.soCommit === 0 && git.soFileChuaCommit === 0 && !git.prUrl) return { ok: true, boQua: true };
    const moc = mocTruocLuot.get(goc!);
    if (moc !== undefined && moc === (await dauGitNhanh(goc!))) return { ok: true, boQua: true };
    const dau = `${goc}|${key}|${git.head}|${git.soFileChuaCommit}|${git.prUrl ?? ''}`;
    if (daGoiY.has(dau)) return { ok: true, boQua: true };
    daGoiY.add(dau);
  }
  const r = await docTheDayDu(g, key);
  if (!r.ok) return o.tuDong ? { ok: true, boQua: true } : { ok: false, loi: r.loi };
  const t = await docTheCo(g, key, true);
  if (laTheLoi(t)) return o.tuDong ? { ok: true, boQua: true } : t;
  const p = docPhuThuoc(r.text);
  const chiDocGan = g.quyen === 'doc';
  const goiY = goiYSauViec(t, p, git, (ten) => coTool(ten) && !(chiDocGan && /^(comment|transition|log_work|request_review|chat_post|raid_create|qna_ask)$/.test(ten)));
  if (!goiY.length) return o.tuDong ? { ok: true, boQua: true } : { ok: true, key, goiY, md: T(`${key}: chưa có gì để làm tiếp.`, `${key}: nothing to do next.`) };
  const tom = [
    `**${T('Xong việc', 'Done')} · ${key}** — ${t.tieuDe}`,
    [git.nhanh ? `${T('nhánh', 'branch')} \`${git.nhanh}\`` : '', git.soCommit ? `${git.soCommit} commit` : '', git.soFileChuaCommit ? T(`${git.soFileChuaCommit} file chưa commit`, `${git.soFileChuaCommit} uncommitted file(s)`) : '', git.chuaPush ? T(`${git.chuaPush} commit chưa push`, `${git.chuaPush} unpushed`) : '', git.prUrl ? `PR ${git.prUrl}` : ''].filter(Boolean).join(' · '),
    ...cauPhuThuoc(key, p).map((x) => `- ${x}`),
  ].filter(Boolean).join('\n');
  return { ok: true, key, goiY, md: tom };
}

/** Xem trước MỘT gợi ý (không ghi gì): ghi vào thẻ nào, việc gì, nội dung gì. */
export async function xemTruocGoiY(goc: string | null, the: string | undefined, id: string): Promise<KetQuaXem & { key?: string; viec?: string; noiDung?: string; nhapGoiY?: string }> {
  const g = await canGan(goc);
  if (laLoi(g)) return g;
  const key = chuanKhoa(g, the);
  if (!key) return { ok: false, loi: T('Thiếu mã thẻ.', 'Missing issue key.') };
  const t = await docTheCo(g, key);
  if (laTheLoi(t)) return t;
  const git = await tinhTrangGit(goc!);
  if (id === 'commit') return { ok: true, key, viec: 'commit', nhapGoiY: T(`Commit các thay đổi cho ${key} với message dạng "${key}: …" (cho mình xem trước).`, `Commit the changes for ${key} with a "${key}: …" message (show me first).`) };
  if (id === 'push') return { ok: true, key, viec: 'push', nhapGoiY: T(`Push nhánh ${git.nhanh ?? 'hiện tại'} lên origin (cho mình duyệt lệnh).`, `Push branch ${git.nhanh ?? 'current'} to origin (let me approve the command).`) };
  if (id === 'qna') return { ok: true, key, viec: 'qna', nhapGoiY: `/ctwork hoi ${key}: ` };
  if (id === 'gio') return { ok: true, key, viec: 'gio', nhapGoiY: `/ctwork gio ${key} ` };
  if (id === 'binhLuan' || id === 'review') {
    const bl = await soanBinhLuan(goc, key);
    if (!bl.ok || !bl.noiDung) return bl;
    const noiDung = `${bl.noiDung}${git.prUrl ? `\n\nPR: ${git.prUrl}` : ''}`;
    return { ok: true, key, viec: id === 'review' ? T('Xin review (request_review: bình luận + chuyển sang Review)', 'Request review (request_review: comment + move to Review)') : T('Bình luận bằng chứng', 'Evidence comment'), noiDung };
  }
  if (id.startsWith('chuyen:')) {
    const den = id.slice(7);
    if (!t.chuyenDuoc.includes(den)) return { ok: false, loi: T(`Workflow không cho chuyển ${key} sang "${den}".`, `The workflow does not allow moving ${key} to "${den}".`) };
    return { ok: true, key, viec: T(`Chuyển trạng thái: ${t.trangThai ?? '?'} → ${den}`, `Move: ${t.trangThai ?? '?'} → ${den}`), noiDung: '' };
  }
  if (id === 'chat') {
    const r = await docTheDayDu(g, key);
    const p = r.ok ? docPhuThuoc(r.text) : docPhuThuoc('');
    return { ok: true, key, viec: T('Tin nhắn kênh chat nhóm (general)', 'Message to the team chat (general)'), noiDung: soanTinXong(t, p, git) };
  }
  if (id === 'raid') {
    const r = await docTheDayDu(g, key);
    const p = r.ok ? docPhuThuoc(r.text) : docPhuThuoc('');
    const chan = p.chan.map((c) => `${c.key} (${c.nguoi ?? '?'})`).join(', ');
    return { ok: true, key, viec: T('Ghi vào RAID (DEPENDENCY)', 'Log in RAID (DEPENDENCY)'), noiDung: T(`${key} phụ thuộc ${chan || 'thẻ khác'} chưa xong`, `${key} depends on unfinished ${chan || 'issues'}`) };
  }
  return { ok: false, loi: T('Gợi ý không hợp lệ.', 'Unknown suggestion.') };
}

/** GHI một gợi ý — CHỈ gọi sau khi giao diện đã cho xem trước và người dùng đồng ý. */
export async function lamGoiY(goc: string | null, the: string | undefined, id: string, noiDung: string): Promise<KetQuaXem> {
  const g = await canGan(goc);
  if (laLoi(g)) return g;
  const key = chuanKhoa(g, the);
  if (!key) return { ok: false, loi: T('Thiếu mã thẻ.', 'Missing issue key.') };
  if (g.quyen === 'doc') return { ok: false, loi: T('Thư mục này gắn dự án ở chế độ CHỈ ĐỌC — đổi bằng `/ctwork du-an`.', 'This folder is bound READ ONLY — change it with `/ctwork project`.') };
  const project = duAnCuaThe(g, key);
  const goi = async (tool: string, args: Record<string, unknown>, xong: string): Promise<KetQuaXem> => {
    if (thieuQuyenGhi(tool)) return loiChiDoc();
    const r = await goiCtw(tool, args);
    return r.loi ? { ok: false, loi: chuLoiCtw(r.noiDung) } : { ok: true, md: xong };
  };
  if (id === 'binhLuan') return guiBinhLuan(goc, key, noiDung);
  if (id === 'review') return goi('request_review', { project, issue: key, summary: noiDung.slice(0, 5000) }, T(`✓ Đã xin review ${key}.`, `✓ Review requested for ${key}.`));
  if (id.startsWith('chuyen:')) return goi('transition', { project, issue: key, to: id.slice(7) }, T(`✓ ${key} → ${id.slice(7)}.`, `✓ ${key} → ${id.slice(7)}.`));
  if (id === 'chat') return goi('chat_post', { project: refCua(g), channel: 'general', text: noiDung.slice(0, 4000) }, T('✓ Đã gửi tin vào kênh general.', '✓ Posted to #general.'));
  if (id === 'raid') return goi('raid_create', { project: refCua(g), type: 'DEPENDENCY', title: noiDung.slice(0, 255) }, T('✓ Đã ghi vào RAID.', '✓ Logged in RAID.'));
  if (id === 'qna') return goi('qna_ask', { project: refCua(g), question: noiDung.slice(0, 255) }, T('✓ Đã gửi câu hỏi vào Q&A.', '✓ Question posted to the Q&A log.'));
  return { ok: false, loi: T('Gợi ý không hợp lệ.', 'Unknown suggestion.') };
}

// ─── AGENTS.md của nhóm (trang Docs) ─────────────────────────────

/** Đệm nội dung trang theo (dự án, trang, updatedAt) + đệm danh sách trang 10 phút. */
const demNhom = new Map<string, { luc: number; page: number | null; updatedAt: string | null; noiDung: string | null; nguon: string | null }>();
const demTrang = new Map<string, { luc: number; ds: ReturnType<typeof docDsTrang> | null }>();
const HAN_DS_TRANG = 10 * 60_000;
const TRAN_NHOM = 20_000;

export interface HuongDanNhom { noiDung: string; nguon: string; laAgents: boolean }

/**
 * Hướng dẫn của NHÓM cho CuongMini: trang Docs có tiêu đề bắt đầu "AGENTS.md" (khối ```markdown đầu tiên, không có thì cả
 * trang), đệm theo `updatedAt`. Không có trang ⇒ trang tổng quan + sprint hiện tại (bối cảnh, ngắn). Docs tắt / lỗi ⇒ null
 * (bỏ qua êm, đệm 10 phút).
 */
export async function huongDanNhom(goc: string | null): Promise<HuongDanNhom | null> {
  if (!goc || !ctworkSan()) return null;
  const g = await ganCo(goc).catch(() => null);
  if (!g) return null;
  const k = refCua(g);
  let ds = demTrang.get(k);
  if (!ds || Date.now() - ds.luc > HAN_DS_TRANG) {
    const r = await goiCtw('list_pages', { project: k });
    ds = { luc: Date.now(), ds: r.loi ? null : docDsTrang(r.noiDung) };
    demTrang.set(k, ds);
  }
  if (!ds.ds) return null;
  const trang = timTrangAgents(ds.ds);
  const laAgents = Boolean(trang);
  const chon = trang ?? timTrangTongQuan(ds.ds);
  const cu = demNhom.get(k);
  if (cu && cu.page === (chon?.page ?? null) && cu.updatedAt && cu.updatedAt === (chon?.updatedAt ?? null)) {
    return cu.noiDung ? { noiDung: cu.noiDung, nguon: cu.nguon ?? '', laAgents } : null;
  }
  if (cu && !cu.updatedAt && cu.page === (chon?.page ?? null) && Date.now() - cu.luc < HAN_DS_TRANG) {
    return cu.noiDung ? { noiDung: cu.noiDung, nguon: cu.nguon ?? '', laAgents } : null;
  }
  let noiDung: string | null = null;
  let nguon: string | null = null;
  if (chon) {
    const r = await goiCtw('get_page', { project: k, page: chon.page });
    if (!r.loi) {
      const body = laAgents ? rutNoiDungAgents(r.noiDung) : rutNoiDungAgents(r.noiDung).slice(0, 6000);
      noiDung = body.slice(0, TRAN_NHOM);
      nguon = `${g.key}-DOC-${chon.page} "${chon.title.slice(0, 80)}"${chon.updatedAt ? ` · ${chon.updatedAt.slice(0, 10)}` : ''}`;
    }
  }
  if (!laAgents) {
    /* Không có AGENTS.md của nhóm ⇒ bối cảnh tự đọc: trang tổng quan (nếu có) + sprint hiện tại. */
    const d = await dongTrangThai(goc).catch(() => null);
    const sp = d?.sprint ? T(`Sprint hiện tại: ${d.sprint.ten}${d.sprint.laFocus ? ' (chưa chạy)' : ''} · ${d.sprint.tong} thẻ${d.sprint.conNgay !== null ? ` · còn ${d.sprint.conNgay} ngày` : ''}.`, `Current sprint: ${d.sprint.ten}${d.sprint.laFocus ? ' (not started)' : ''} · ${d.sprint.tong} issues${d.sprint.conNgay !== null ? ` · ${d.sprint.conNgay} days left` : ''}.`) : '';
    const phan = [sp, noiDung ? `${T('Trang tổng quan của dự án', 'Project overview page')} (${nguon}):\n${noiDung}` : ''].filter(Boolean);
    noiDung = phan.length ? `## ${T('Bối cảnh dự án (CuongMini tự đọc từ CT Work — nhóm chưa có trang "AGENTS.md")', 'Project context (read by CuongMini from CT Work — the team has no "AGENTS.md" page)')}\n${phan.join('\n\n')}` : null;
    nguon = nguon ?? `${g.key} · sprint`;
  }
  demNhom.set(k, { luc: Date.now(), page: chon?.page ?? null, updatedAt: chon?.updatedAt ?? null, noiDung, nguon });
  return noiDung ? { noiDung, nguon: nguon ?? '', laAgents } : null;
}

/** AGENTS.md cục bộ + hướng dẫn của nhóm (cục bộ thắng khi trùng mục). `null` khi cả hai đều không có. */
export async function ghiChuGop(goc: string | null, cucBo: { ten: string; noiDung: string } | null): Promise<{ ten: string; noiDung: string; nhom: HuongDanNhom | null } | null> {
  const nhom = await Promise.race([
    huongDanNhom(goc).catch(() => null),
    new Promise<null>((ok) => { const t = setTimeout(() => ok(null), 8000); t.unref?.(); }),
  ]);
  if (!nhom) return cucBo ? { ...cucBo, nhom: null } : null;
  return {
    ten: cucBo ? `${cucBo.ten} + CT Work` : 'AGENTS.md (CT Work)',
    noiDung: gopGhiChu(cucBo?.noiDung ?? null, nhom.noiDung, nhom.nguon),
    nhom,
  };
}

// ─── Theo dõi ────────────────────────────────────────────────────

const HAN_TIN_MS = Math.max(60_000, Number(process.env.CUONGMINI_CTW_THEO_DOI_MS) || 60_000);
const tinLuc = new Map<string, number>();
let lastIdTin: number | null = null;
let banDauViec: Set<string> | null = null;
let lucTinCuoi = new Date().toISOString();

/**
 * Hỏi CT Work có gì mới cho NGƯỜI DÙNG (≥ 60 s/lần mỗi thư mục, chỉ khi có dự án gắn + đang bật). Lần đầu chỉ lấy mốc
 * (không báo dồn những gì đã cũ). Máy chủ chưa có `my_updates` ⇒ so việc của tôi (chỉ báo "vừa được giao").
 */
export async function kiemTin(goc: string | null, o: { epNgay?: boolean } = {}): Promise<{ ok: boolean; tin: string[] }> {
  if (!goc || !ctworkSan() || !(await theoDoiBat())) return { ok: true, tin: [] };
  const g = await ganCo(goc).catch(() => null);
  if (!g) return { ok: true, tin: [] };
  const luc = tinLuc.get(goc) ?? 0;
  if (!o.epNgay && Date.now() - luc < HAN_TIN_MS) return { ok: true, tin: [] };
  tinLuc.set(goc, Date.now());
  if (coTool('my_updates') && toolCuaServer(TEN_SERVER).length) {
    const since = lucTinCuoi;
    const r = await goiCtw('my_updates', { project: refCua(g), ...(lastIdTin !== null ? { afterId: lastIdTin } : {}), since });
    if (r.loi) return { ok: false, tin: [] };
    const c = docCapNhat(r.noiDung);
    if (!c) return { ok: false, tin: [] };
    const dau = lastIdTin === null;
    lastIdTin = c.lastId;
    lucTinCuoi = new Date().toISOString();
    return { ok: true, tin: dau ? tinTheoDoi({ ...c, events: [] }) : tinTheoDoi(c) };
  }
  const r = await goiCtw('my_work', { project: refCua(g) });
  if (r.loi) return { ok: false, tin: [] };
  const ds = docViecToi(r.noiDung);
  const moi = banDauViec ? ds.filter((v) => !banDauViec!.has(v.key)) : [];
  banDauViec = new Set(ds.map((v) => v.key));
  return { ok: true, tin: moi.slice(0, 5).map((v) => T(`📌 Bạn vừa được giao ${v.key} — ${v.title.slice(0, 60)}`, `📌 You were just assigned ${v.key} — ${v.title.slice(0, 60)}`)) };
}

// ─── Trưởng nhóm / giảng viên ────────────────────────────────────

export async function tongQuan(goc: string | null): Promise<KetQuaXem & { vai?: string | null; tinNhac?: string | null }> {
  const g = await canGan(goc);
  if (laLoi(g)) return g;
  const vai = await vaiCua(g).catch(() => null);
  if (vai === 'TEACHER' && coTool('teaching_group')) {
    const r = await goiCtw('teaching_group', { project: refCua(g) });
    if (!r.loi) return { ok: true, vai, md: `**${T('Tổng quan nhóm (giảng viên)', 'Group overview (lecturer)')}** · ${g.key}\n\n${r.noiDung.replace(/<\/?ctwork-content[^>]*>/g, '').slice(0, 6000)}` };
  }
  const [mo, qua] = await Promise.all([
    goiCtw('search_issues', { project: refCua(g), jql: 'statusCategory != Done ORDER BY due ASC', limit: 50 }),
    goiCtw('search_issues', { project: refCua(g), jql: 'statusCategory != Done AND due < startOfDay()', limit: 50 }),
  ]);
  if (mo.loi) return { ok: false, loi: chuLoiCtw(mo.noiDung) };
  const dsQua = new Set(((rutJson(qua.noiDung) as Array<{ key?: string }> | null) ?? []).map((x) => String(x?.key ?? '')));
  const ds: TheNhom[] = ((rutJson(mo.noiDung) as Array<Record<string, unknown>> | null) ?? []).map((x) => ({
    key: String(x.key ?? ''), title: String(x.title ?? ''), status: typeof x.status === 'string' ? x.status : null,
    assignee: typeof x.assignee === 'string' ? x.assignee : null, blocked: x.blocked === true, quaHan: dsQua.has(String(x.key ?? '')),
  })).filter((x) => x.key);
  return { ok: true, vai, md: veTongQuanNhom(ds, g.key), tinNhac: soanTinNhacTre(ds, g.key) };
}

/** Gửi tin nhắc người trễ vào kênh chat (CHỈ sau khi trưởng nhóm duyệt bản xem trước). */
export async function guiTinNhom(goc: string | null, noiDung: string): Promise<KetQuaXem> {
  const g = await canGan(goc);
  if (laLoi(g)) return g;
  if (g.quyen === 'doc') return { ok: false, loi: T('Thư mục này gắn dự án ở chế độ CHỈ ĐỌC.', 'This folder is bound READ ONLY.') };
  if (thieuQuyenGhi('chat_post')) return loiChiDoc();
  const r = await goiCtw('chat_post', { project: refCua(g), channel: 'general', text: noiDung.slice(0, 4000) });
  return r.loi ? { ok: false, loi: chuLoiCtw(r.noiDung) } : { ok: true, md: T('✓ Đã gửi vào kênh general.', '✓ Posted to #general.') };
}

/** Hỏi Q&A (CHỈ sau khi xem trước). */
export async function hoiQna(goc: string | null, cauHoi: string): Promise<KetQuaXem> {
  const g = await canGan(goc);
  if (laLoi(g)) return g;
  if (g.quyen === 'doc') return { ok: false, loi: T('Thư mục này gắn dự án ở chế độ CHỈ ĐỌC.', 'This folder is bound READ ONLY.') };
  if (thieuQuyenGhi('qna_ask')) return loiChiDoc();
  const r = await goiCtw('qna_ask', { project: refCua(g), question: cauHoi.slice(0, 255), ...(cauHoi.length > 255 ? { details: cauHoi.slice(0, 10_000) } : {}) });
  return r.loi ? { ok: false, loi: chuLoiCtw(r.noiDung) } : { ok: true, md: T('✓ Đã gửi câu hỏi vào sổ Q&A.', '✓ Question posted to the Q&A log.') };
}

export async function mauFpt(goc: string | null): Promise<KetQuaXem & { ds?: MauFpt[] }> {
  const g = await canGan(goc);
  if (laLoi(g)) return g;
  const r = await goiCtw('list_projects', {});
  const p = r.loi ? null : (rutJson(r.noiDung) as Array<Record<string, unknown>> | null)?.find((x) => x.key === refCua(g) || String(x.key).split('/').pop() === g.key);
  /* Tiến độ kỳ học chưa đo được từ CT Work ⇒ null (gợi ý cả nhóm mẫu đầu kỳ lẫn cuối kỳ). */
  const ds = goiYMauFpt({ kind: typeof p?.kind === 'string' ? p.kind : null, template: typeof p?.template === 'string' ? p.template : null, tienDo: null, tool: coTool });
  if (!ds.length) return { ok: true, ds, md: T('Token này chưa có tool mẫu FPT nào.', 'This token has no FPT template tools.') };
  return { ok: true, ds, md: `**${T('Mẫu FPT nên làm lúc này', 'FPT templates to do now')}** · ${g.key}\n${ds.map((m, i) => `${i + 1}. ${m.ten} — \`${m.tool}\``).join('\n')}` };
}
