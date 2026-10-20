/**
 * ============================================================
 * LỆNH CT WORK CHUNG CHO BA NƠI (đợt 5, 18/10/2026) — `/ctwork` menu đánh số, `/issue`, `/sprint`, `/viec`
 * ============================================================
 *
 * Phần ĐIỀU PHỐI thuần (không React, không DOM, không Node): app desktop (`AgentMode.tsx`), CLI
 * (`packages/cuongmini-cli/src/lenh.ts`) và VS Code (`webview/lenh.ts`) cùng gọi đúng hàm này, mỗi nơi chỉ
 * cắm cách VẼ thẻ lựa chọn (`chon`) và câu trả lời (`traLoi`). Việc thật nằm ở lõi (`agent:ctworkHe`,
 * `desktop/src/main/agent/ctworkHe.ts`).
 *
 * ⛔ Mọi thao tác GHI lên CT Work đi qua một thẻ XEM TRƯỚC (ghi vào thẻ nào, nội dung gì) rồi mới gọi lõi.
 */

export interface MucChon { nhan: string; giaTri: string; mo?: string; tat?: boolean; /** Số hiện bên trái (mặc định thứ tự 1–9). "0" = Thoát. */ so?: string }
export interface TheChonCtw {
  tieuDe: string; moTa?: string;
  /** Đợt 6: danh sách dài (mọi dự án) ⇒ cho gõ để lọc (CLI: ô lọc; desktop/VS Code: lọc khi gõ). */
  loc?: boolean;
  /** Khối nội dung markdown (thẻ, bảng sprint, xem trước) hiện TRÊN các lựa chọn. */
  than?: string;
  ds: MucChon[];
  khiChon: (giaTri: string) => void | Promise<void>;
  /** Esc / đóng. */
  khiHuy?: () => void;
}

export interface GiaoDienCtw {
  /** Gọi kênh lõi (giao diện tự gắn `cuocId`). */
  goi: <T = unknown>(kenh: string, duLieu?: Record<string, unknown>) => Promise<T>;
  traLoi: (md: string) => void;
  chon: (o: TheChonCtw) => void;
  thongBao: (chu: string, loai?: 'ok' | 'loi' | 'info') => void;
  datNhap: (t: string) => void;
  ngonNgu: 'vi' | 'en';
  /** Dòng trạng thái đọc lại (sau khi gắn dự án / tạo nhánh / chuyển thẻ). */
  lamMoiDong?: () => void;
}

/** Kết quả `agent:ctworkHe` (cùng hình `AgentCtworkHeRa` của shared/ipc — chép lỏng để CLI/VS Code khỏi kéo zod). */
export interface RaCtw {
  ok: boolean; loi?: string; md?: string; hoi?: 'ketNoi' | 'capLai' | 'ganDuAn' | 'chonDuAn' | null;
  /** Đợt 8A: chưa nối + thư mục chưa gắn ⇒ một dòng gợi ý nhẹ, không thẻ chặn. */
  goiYNhe?: boolean;
  doan?: { key: string; projectId: number | null; workspaceId: number | null; workspace: string | null } | null;
  gan?: { key: string; projectId: number | null; workspaceId: number | null; ref?: string; ten?: string | null; workspace?: string | null } | null;
  ds?: Array<{ key: string; ten: string; id: number | null; workspaceId: number | null; workspace: string | null; vaiTro: string | null; soMo: number | null }>;
  dsThe?: Array<{ key: string; title: string; status: string | null; dueDate: string | null; blocked?: boolean }>;
  dong?: DongCtw | null;
  duong?: string; goiYGitignore?: string | null;
  key?: string; tieuDe?: string; trangThai?: string | null; chuyenDuoc?: string[];
  nhanh?: string; nhanhCo?: boolean; nhanhNay?: string | null; den?: string | null; daDangLam?: boolean; chiDoc?: boolean; noiDung?: string; bat?: boolean;
  /* ── Đợt 6 — dẫn đường ── */
  boQua?: boolean; truoc?: string | null;
  goiY?: GoiYCtw[];
  viec?: string; nhapGoiY?: string; phuThuoc?: string[]; chan?: string[];
  tin?: string[]; vai?: string | null; tinNhac?: string | null;
  mau?: Array<{ ten: string; tool: string; cauHoi: string }>;
  laKho?: boolean; theoPhien?: boolean; nguon?: string; laAgents?: boolean;
  /** 20/10/2026: phạm vi mặc định của máy (tất cả · một workspace · một dự án) — `docGan` / `macDinh` / `gan` ở thư mục nhà. */
  macDinh?: { tatCa?: boolean; workspaceId?: number | null; workspace?: string | null; key?: string; projectId?: number | null; ten?: string | null } | null;
}
export interface GoiYCtw { id: string; loai: string; nhan: string; mo: string; den?: string; ghi: boolean; tool?: string }
export interface DongCtw {
  /** '' = đã nối mà chưa có dự án cụ thể — `phamVi` nói tất cả / một workspace / chưa chọn. */
  key: string; projectId: number | null;
  phamVi?: 'tatCa' | 'workspace' | 'chuaChon'; workspace?: string | null; ten: string | null; nhanh: string | null; daNoi: boolean; loi: string | null;
  sprint: { ten: string; conNgay: number | null; laFocus: boolean; tong: number } | null;
  the: string | null; theTen: string | null; theTrangThai: string | null;
}

type KqKetNoi = { ok: boolean; loi?: string; soTool?: number };
const Lg = (g: GiaoDienCtw) => (vi: string, en: string): string => (g.ngonNgu === 'en' ? en : vi);

async function he(g: GiaoDienCtw, viec: string, them: Record<string, unknown> = {}): Promise<RaCtw> {
  try {
    return (await g.goi<RaCtw>('agent:ctworkHe', { viec, ngonNgu: g.ngonNgu, ...them })) ?? { ok: false, loi: '?' };
  } catch (e) {
    return { ok: false, loi: (e as Error).message };
  }
}

/** Bỏ dấu, thường hoá — so tham số người gõ. */
const ch = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().trim();

// ─── Dòng trạng thái kiểu Claude Code ─────────────────────────────

/** "LF · Sprint 2 · còn 5 ngày · ▶ LF-18 Thiết kế ERD" — chữ trơn, giao diện tự tô. */
export function veDongCtw(d: DongCtw | null | undefined, ngonNgu: 'vi' | 'en', rong = 80): string {
  if (!d) return '';
  const L = (vi: string, en: string) => (ngonNgu === 'en' ? en : vi);
  /* 20/10/2026: đã có token mà chưa có dự án cụ thể ⇒ vẫn hiện (trước đây trống ⇒ trông như mất kết nối). */
  if (!d.key) {
    const pv = d.phamVi === 'tatCa' ? L('tất cả dự án', 'all projects')
      : d.phamVi === 'workspace' ? `${L('workspace', 'workspace')} ${d.workspace ?? ''}`.trim() : L('chưa chọn dự án', 'no project picked');
    const s0 = `⬡ CT Work · ${d.daNoi ? L('đã nối', 'connected') : L('chưa nối', 'not connected')} · ${pv}`;
    return s0.length > rong ? `${s0.slice(0, Math.max(10, rong - 1))}…` : s0;
  }
  const phan: string[] = [`⬡ ${d.key}`];
  if (!d.daNoi) phan.push(L('chưa nối CT Work', 'CT Work not connected'));
  else if (d.sprint) {
    const n = d.sprint.conNgay;
    const con = n === null ? '' : n > 0 ? L(` · còn ${n} ngày`, ` · ${n}d left`) : n === 0 ? L(' · hết hạn hôm nay', ' · ends today') : L(` · quá ${-n} ngày`, ` · ${-n}d over`);
    phan.push(`${d.sprint.ten}${d.sprint.laFocus ? L(' (chưa chạy)', ' (not started)') : ''}${con}`);
  }
  if (d.the) phan.push(`▶ ${d.the}${d.theTen ? ` ${d.theTen}` : ''}${d.theTrangThai ? ` [${d.theTrangThai}]` : ''}`);
  const s = phan.join(' · ');
  return s.length > rong ? `${s.slice(0, Math.max(10, rong - 1))}…` : s;
}

// ─── Hỏi MỘT lần lúc mở ──────────────────────────────────────────

/**
 * Lúc mở (đã đăng nhập): chưa kết nối ⇒ "Kết nối CT Work?"; token hết hạn ⇒ cấp lại một chạm; đã nối mà
 * thư mục chưa gắn và AGENTS.md nói rõ dự án ⇒ hỏi xác nhận. Mỗi câu hỏi tối đa một lần (lõi nhớ).
 */
/** Người dùng chọn "Để sau" ở thẻ cấp lại token ⇒ không hỏi lại trong phiên này. */
let boQuaCapLai = false;
/** 20/10/2026: "Không" ở thẻ "Kết nối CT Work?" ⇒ không hỏi lại trong phiên này (lần mở sau vẫn hỏi; "Không hỏi lại" mới nhớ hẳn). */
let boQuaKetNoi = false;

/** Lỗi xác thực CT Work (token hết hạn / bị thu hồi) trong chữ lỗi lõi trả về. */
export const laLoiXacThucCtw = (chu: string | null | undefined): boolean => /\b(401|403)\b|unauthori[sz]ed|invalid[_ ]token|token (?:revoked|expired|invalid)|hết hạn|thu hồi/i.test(chu ?? '');

/** Đợt 8A: dòng gợi ý nhẹ ở màn chào (một lần mỗi phiên giao diện). */
let daGoiYNhe = false;
export const CAU_GOI_Y_NHE = { vi: 'Làm dự án trên CT Work? gõ /ctwork', en: 'Working on a CT Work project? type /ctwork' };

/**
 * 20/10/2026 (thay luật đợt 8A): mở CuongMini đã đăng nhập mà chưa có CT Work ⇒ "Bạn muốn kết nối CT Work không?"
 * (đọc + ghi khuyên dùng · chỉ đọc · không · không hỏi lại) ⇒ chọn PHẠM VI (tất cả dự án · cả workspace · một dự án).
 * Token hỏng ⇒ cấp lại một chạm. Đã nối mà thư mục chưa có phạm vi ⇒ AGENTS.md ghi rõ dự án thì hỏi xác nhận, không
 * thì thẻ chọn phạm vi. Mỗi câu hỏi tối đa một lần (lõi nhớ).
 */
export async function hoiCtworkMotLan(g: GiaoDienCtw): Promise<boolean> {
  const L = Lg(g);
  const r = await he(g, 'goiY');
  if (r.ok && r.goiYNhe && !daGoiYNhe) { daGoiYNhe = true; g.thongBao(L(CAU_GOI_Y_NHE.vi, CAU_GOI_Y_NHE.en), 'info'); }
  if (!r.ok || !r.hoi) return false;
  if (r.hoi === 'capLai' && boQuaCapLai) return false;
  if (r.hoi === 'ketNoi' && boQuaKetNoi) return false;
  if (r.hoi === 'ketNoi') {
    g.chon({
      tieuDe: L('Bạn muốn kết nối CT Work không?', 'Do you want to connect CT Work?'),
      moTa: L('CuongMini dùng chính tài khoản cuongthai.com đang đăng nhập để làm việc trên CT Work NGẦM trong CuongMini (đọc thẻ, nộp việc, đính kèm file, chuyển trạng thái…) — không mở trình duyệt. Máy chủ vẫn xét đúng vai của bạn; mỗi lần ghi vẫn có thẻ duyệt. Token tự tạo, cất trên máy này; AI không bao giờ thấy nó.',
        'CuongMini uses your signed-in cuongthai.com account to work on CT Work SILENTLY inside CuongMini (read issues, submit work, attach files, move statuses…) — no browser. The server still enforces your role; every write still asks. The token is created for you and kept on this machine; the AI never sees it.'),
      ds: [
        { nhan: L('Có — đọc + ghi', 'Yes — read + write'), giaTri: 'ghi', mo: L('khuyên dùng · ghi vẫn hỏi duyệt từng lần', 'recommended · every write still asks') },
        { nhan: L('Có — chỉ đọc', 'Yes — read only'), giaTri: 'doc', mo: L('CuongMini không ghi gì lên CT Work', 'CuongMini never writes to CT Work') },
        { nhan: L('Không', 'No'), giaTri: 'khong', mo: L('lần mở sau hỏi lại', 'ask again next time') },
        { nhan: L('Không, đừng hỏi lại', "No, don't ask again"), giaTri: 'khongHoiLai', so: '0', mo: L('vẫn gõ /ctwork được', 'you can still type /ctwork') },
      ],
      khiChon: async (v) => {
        if (v === 'khong') { boQuaKetNoi = true; return; }
        // QA 20/10: chỉ ghi "đã hỏi" khi người dùng bảo đừng hỏi lại hoặc NỐI ĐƯỢC — nối hỏng (mạng/máy chủ) thì lần mở sau hỏi lại.
        if (v === 'khongHoiLai') { await he(g, 'daHoi', { loai: 'ketNoi' }); return; }
        if (!(await ketNoi(g, v === 'doc' ? 'doc' : 'ghi'))) { boQuaKetNoi = true; return; }
        await he(g, 'daHoi', { loai: 'ketNoi' });
        await sauKhiNoi(g);
      },
      khiHuy: () => { boQuaKetNoi = true; },
    });
    return true;
  }
  if (r.hoi === 'capLai') {
    g.chon({
      tieuDe: L('Token CT Work đã hết hạn hoặc bị thu hồi', 'Your CT Work token expired or was revoked'),
      moTa: L('Cấp lại bằng tài khoản đang đăng nhập — cùng quyền như trước.', 'Issue a new one with your signed-in account — same access as before.'),
      ds: [{ nhan: L('Cấp lại (một chạm)', 'Renew (one tap)'), giaTri: 'cap' }, { nhan: L('Để sau', 'Later'), giaTri: 'sau', so: '0' }],
      khiHuy: () => { boQuaCapLai = true; },
      khiChon: async (v) => {
        if (v !== 'cap') { boQuaCapLai = true; return; }
        const x = await g.goi<{ ok: boolean; loi?: string; soTool?: number }>('agent:ctwork', { viec: 'capLai' }).catch((e: Error): KqKetNoi => ({ ok: false, loi: e.message }));
        if (x?.ok) { g.thongBao(L(`✓ Đã cấp lại token CT Work · ${x.soTool ?? 0} tool.`, `✓ CT Work token renewed · ${x.soTool ?? 0} tools.`), 'ok'); g.lamMoiDong?.(); } else g.thongBao(`ctwork: ${x?.loi ?? '?'}`, 'loi');
      },
    });
    return true;
  }
  if (r.hoi === 'chonDuAn') {
    /* Đợt 6: đã nối, thư mục chưa gắn, AGENTS.md không nói dự án nào ⇒ liệt kê MỌI dự án (không gian · tên · vai). */
    await he(g, 'daHoi', { loai: 'ganDuAn' });
    await chonDuAn(g, { lanDau: true });
    return true;
  }
  if (r.hoi === 'ganDuAn' && r.doan) {
    hoiGanDoan(g, r.doan, 'agents');
    return true;
  }
  return false;
}

/**
 * Hỏi MỘT lần "Gắn thư mục này với dự án KEY?" — đoán từ AGENTS.md (`agents`) hoặc vì người dùng nhắc `KEY-123`
 * (`key`, đợt 8A). "Không" ⇒ lõi nhớ cho thư mục đó, không hỏi lại. Không bao giờ tự gắn im lặng.
 */
export function hoiGanDoan(g: GiaoDienCtw, d: NonNullable<RaCtw['doan']>, nguon: 'agents' | 'key' = 'agents'): void {
  const L = Lg(g);
  g.chon({
    tieuDe: L(`Gắn thư mục này với dự án CT Work ${d.key}${d.projectId ? ` (id ${d.projectId})` : ''}?`, `Bind this folder to CT Work project ${d.key}${d.projectId ? ` (id ${d.projectId})` : ''}?`),
    moTa: nguon === 'key'
      ? L(`Bạn vừa nhắc ${d.key}-… và ${d.key} là một dự án của bạn. Gắn rồi thì dòng trạng thái hiện sprint/thẻ, gõ ${d.key}-123 là CuongMini tự đọc thẻ đó. Gỡ: /ctwork bo-gan.`,
        `You mentioned ${d.key}-… and ${d.key} is one of your projects. Once bound, the status line shows the sprint/issue and typing ${d.key}-123 makes CuongMini read it. Unbind: /ctwork unbind.`)
      : L(`Đoán từ AGENTS.md${d.workspace ? ` · không gian "${d.workspace}"` : ''}. Gắn rồi thì dòng trạng thái hiện sprint/thẻ, và gõ ${d.key}-123 là CuongMini tự đọc thẻ đó.`,
        `Guessed from AGENTS.md${d.workspace ? ` · workspace "${d.workspace}"` : ''}. Once bound, the status line shows the sprint/issue and typing ${d.key}-123 makes CuongMini read that issue.`),
    ds: [
      { nhan: L(`Đúng — gắn ${d.key}`, `Yes — bind ${d.key}`), giaTri: 'gan' },
      { nhan: L('Chọn dự án khác…', 'Pick another project…'), giaTri: 'chon' },
      { nhan: L('Không (đừng hỏi lại ở thư mục này)', "No (don't ask again for this folder)"), giaTri: 'khong', so: '0' },
    ],
    khiChon: async (v) => {
      await he(g, 'daHoi', { loai: 'ganDuAn' });
      if (v === 'chon') { await chonDuAn(g); return; }
      if (v !== 'gan') return;
      /* Đợt 8A: chưa nối CT Work ⇒ nối bằng phiên đăng nhập trước — người dùng vừa chủ động chọn gắn. 20/10: đọc + ghi. */
      const t0 = await g.goi<{ server?: { ok: boolean } | null }>('agent:ctwork', { viec: 'trangThai' }).catch(() => null);
      if (!t0?.server?.ok && !(await ketNoi(g, 'ghi'))) return;
      const ds = await he(g, 'dsDuAn');
      const p = ds.ds?.find((x) => (d.projectId && x.id === d.projectId) || x.key.split('/').pop() === d.key);
      /* Người dùng xác nhận ⇒ gắn ngay (quyền theo token; đổi ở `/ctwork du-an`). */
      await gan(g, p ?? { key: d.key, ten: '', id: d.projectId, workspaceId: d.workspaceId, workspace: d.workspace, vaiTro: null, soMo: null });
    },
    khiHuy: () => { void he(g, 'daHoi', { loai: 'ganDuAn' }); },
  });
}

/** Nối xong ⇒ thư mục chưa có phạm vi (gắn riêng / mặc định của máy) ⇒ hỏi gắn (AGENTS.md) hoặc thẻ chọn phạm vi. */
async function sauKhiNoi(g: GiaoDienCtw): Promise<void> {
  if (await hoiCtworkMotLan(g)) return;
  const d = await he(g, 'docGan');
  if (!d.gan && !d.macDinh) await chonDuAn(g, { lanDau: true });
}

async function ketNoi(g: GiaoDienCtw, quyen: 'doc' | 'ghi'): Promise<boolean> {
  const L = Lg(g);
  g.thongBao(L('Đang kết nối CT Work…', 'Connecting CT Work…'));
  const r = await g.goi<{ ok: boolean; loi?: string; soTool?: number }>('agent:ctwork', { viec: 'noi', quyen }).catch((e: Error): KqKetNoi => ({ ok: false, loi: e.message }));
  if (r?.ok) {
    g.thongBao(L(`✓ CT Work đã nối · ${r.soTool ?? 0} tool (${quyen === 'ghi' ? 'đọc + ghi' : 'chỉ đọc'}). Gõ /ctwork để mở menu.`, `✓ CT Work connected · ${r.soTool ?? 0} tools (${quyen === 'ghi' ? 'read + write' : 'read only'}). Type /ctwork for the menu.`), 'ok');
    g.lamMoiDong?.();
    return true;
  }
  g.thongBao(`ctwork: ${r?.loi ?? '?'}`, 'loi');
  return false;
}

type DuAnDs = NonNullable<RaCtw['ds']>[number];

/** Vai trong dự án ⇒ chữ người đọc. */
export function tenVai(vai: string | null | undefined, ngonNgu: 'vi' | 'en'): string {
  const v: Record<string, [string, string]> = { ADMIN: ['trưởng nhóm', 'lead'], MEMBER: ['thành viên', 'member'], TEACHER: ['giảng viên', 'lecturer'], VIEWER: ['chỉ xem', 'viewer'], CLIENT: ['khách', 'client'] };
  const x = vai ? v[vai] : undefined;
  return x ? (ngonNgu === 'en' ? x[1] : x[0]) : vai ?? '';
}

async function gan(g: GiaoDienCtw, p: DuAnDs, quyen: 'doc' | 'ghi' = 'ghi', theoPhien = false): Promise<void> {
  const L = Lg(g);
  const r = await he(g, 'gan', { duAn: { key: p.key, id: p.id, workspaceId: p.workspaceId, ...(p.ten ? { ten: p.ten } : {}), workspace: p.workspace, vaiTro: p.vaiTro }, quyen, ...(theoPhien ? { theoPhien: true } : {}) });
  if (!r.ok) { g.thongBao(`⚠ ${r.loi ?? '?'}`, 'loi'); return; }
  const key = r.gan?.key ?? p.key;
  const noi = r.macDinh
    ? L('Lưu làm dự án **mặc định của máy** (dùng ở mọi nơi chưa gắn dự án riêng — kể cả mở ở thư mục nhà). Đổi: `/ctwork du-an`.', 'Saved as this machine\'s **default project** (used anywhere without its own binding — including your home folder). Change: `/ctwork project`.')
    : r.theoPhien
    ? L('Gắn **theo phiên** (thư mục này không phải repo git — không ghi file; mở lại CuongMini thì chọn lại).', 'Bound **for this session** (this folder is not a git repo — nothing is written; pick again next time).')
    : `${L('Lưu ở', 'Saved in')} \`${r.duong ?? '.cuongmini/ctwork.json'}\`.${r.goiYGitignore ? `\n\n_${r.goiYGitignore}_` : ''}`;
  g.traLoi(`${L(`✓ Đã gắn thư mục với dự án **${key}**${p.id ? ` (id ${p.id})` : ''}${p.ten ? ` — ${p.ten}` : ''} · ${quyen === 'doc' ? 'chỉ đọc' : 'đọc + ghi'}${p.vaiTro ? ` · vai: ${tenVai(p.vaiTro, g.ngonNgu)}` : ''}.`, `✓ Bound this folder to project **${key}**${p.id ? ` (id ${p.id})` : ''}${p.ten ? ` — ${p.ten}` : ''} · ${quyen === 'doc' ? 'read only' : 'read + write'}${p.vaiTro ? ` · role: ${tenVai(p.vaiTro, g.ngonNgu)}` : ''}.`)}\n\n${noi}`);
  g.lamMoiDong?.();
  /* Đợt 6 (việc 5): tự đọc hướng dẫn của NHÓM (trang Docs "AGENTS.md — …") ngay — báo nguồn để người dùng biết. */
  const n = await he(g, 'huongDanNhom');
  if (n.ok && n.nguon) {
    g.thongBao(n.laAgents
      ? L(`📎 Đã đọc hướng dẫn của nhóm: ${n.nguon} — CuongMini làm theo nó (AGENTS.md cục bộ thắng khi trùng).`, `📎 Read the team instructions: ${n.nguon} — CuongMini follows them (a local AGENTS.md wins on overlaps).`)
      : L(`📎 Nhóm chưa có trang "AGENTS.md" trong Docs — CuongMini tự đọc bối cảnh (${n.nguon}).`, `📎 The team has no "AGENTS.md" Docs page — CuongMini read the project context instead (${n.nguon}).`), 'info');
  }
  await homNay(g, { tuDong: true });
}

/** Đợt 6 (việc 4): chọn QUYỀN cho lần gắn (đọc + ghi / chỉ đọc); ghi mà token đang chỉ đọc ⇒ nối lại đọc + ghi trước. */
async function chonQuyen(g: GiaoDienCtw, p: DuAnDs): Promise<void> {
  const L = Lg(g);
  const t = await g.goi<{ coGhi?: boolean | null; bienTay?: boolean }>('agent:ctwork', { viec: 'trangThai' }).catch(() => null);
  const docVai = p.vaiTro === 'VIEWER' || p.vaiTro === 'CLIENT';
  g.chon({
    tieuDe: L(`Quyền của CuongMini với ${p.key}${p.ten ? ` — ${p.ten}` : ''}`, `CuongMini's access to ${p.key}${p.ten ? ` — ${p.ten}` : ''}`),
    moTa: [p.workspace ? `${L('Không gian', 'Workspace')}: ${p.workspace}` : '', p.vaiTro ? `${L('Vai của bạn', 'Your role')}: ${tenVai(p.vaiTro, g.ngonNgu)}` : ''].filter(Boolean).join(' · ') || L('Mỗi lần ghi vẫn hỏi duyệt.', 'Every write still asks.'),
    ds: [
      { nhan: L('Đọc + ghi', 'Read + write'), giaTri: 'ghi', mo: docVai ? L('vai của bạn chỉ xem', 'your role is view-only') : t?.coGhi === false && !t.bienTay ? L('sẽ nối lại token đọc + ghi · mỗi lần ghi vẫn hỏi', 'reconnects with a read + write token · every write still asks') : L('mỗi lần ghi vẫn hỏi duyệt', 'every write still asks'), ...(docVai ? { tat: true } : {}) },
      { nhan: L('Chỉ đọc', 'Read only'), giaTri: 'doc', mo: L('CuongMini không ghi gì vào dự án này', 'CuongMini never writes to this project') },
      { nhan: L('Chỉ phiên này (không lưu)', 'This session only (not saved)'), giaTri: 'phien', mo: L('đọc + ghi, quên khi đóng', 'read + write, forgotten on exit') },
      { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' },
    ],
    khiChon: async (v) => {
      if (v === 'huy') return;
      const quyen: 'doc' | 'ghi' = v === 'doc' ? 'doc' : 'ghi';
      if (quyen === 'ghi' && t?.coGhi === false && !t.bienTay && !(await ketNoi(g, 'ghi'))) return;
      await gan(g, p, quyen, v === 'phien');
    },
  });
}

/**
 * Chọn dự án (`list_projects`) ⇒ chọn quyền ⇒ gắn thư mục. Đợt 6 (việc 4): MỌI dự án của người dùng (không gian · tên ·
 * vai · số thẻ mở), gõ để lọc khi nhiều; chưa nối CT Work ⇒ nối trước (phiên đăng nhập).
 * 20/10/2026: trên cùng là PHẠM VI rộng — "Tất cả dự án của tôi" · "Cả workspace X" — lưu làm mặc định của máy (bền qua
 * lần mở sau, dùng cả khi không có thư mục). Chọn một dự án ⇒ gắn thư mục như cũ (thư mục nhà ⇒ dự án mặc định của máy).
 */
export async function chonDuAn(g: GiaoDienCtw, o: { lanDau?: boolean } = {}): Promise<void> {
  const L = Lg(g);
  const t0 = await g.goi<{ server?: { ok: boolean } | null }>('agent:ctwork', { viec: 'trangThai' }).catch(() => null);
  if (!t0?.server?.ok && !(await ketNoi(g, 'ghi'))) return;
  const r = await he(g, 'dsDuAn');
  if (!r.ok) { g.traLoi(`⚠ ${r.loi ?? '?'}`); return; }
  const ds = r.ds ?? [];
  if (!ds.length) { g.traLoi(L('Token này không thấy dự án CT Work nào — tạo hoặc nhận lời mời ở cuongthai.com/work.', 'This token sees no CT Work project — create one or accept an invite at cuongthai.com/work.')); return; }
  const cu = await he(g, 'docGan');
  const md = cu.macDinh ?? null;
  const wsMap = new Map<number, string>();
  for (const p of ds) if (p.workspaceId != null && !wsMap.has(p.workspaceId)) wsMap.set(p.workspaceId, p.workspace ?? `#${p.workspaceId}`);
  const ws = [...wsMap.entries()];
  const dangMd = md?.tatCa ? L('tất cả dự án', 'all projects') : md?.key ? md.key : md?.workspaceId ? `workspace ${md.workspace ?? md.workspaceId}` : null;
  const moTaCu = cu.gan
    ? L(`Đang gắn: ${cu.gan.key}${cu.gan.projectId ? ` (id ${cu.gan.projectId})` : ''} · ${ds.length} dự án`, `Currently bound: ${cu.gan.key}${cu.gan.projectId ? ` (id ${cu.gan.projectId})` : ''} · ${ds.length} projects`)
    : dangMd ? L(`Mặc định của máy: ${dangMd} · ${ds.length} dự án`, `Machine default: ${dangMd} · ${ds.length} projects`)
      : L(`${ds.length} dự án của bạn (không gian · vai · thẻ mở). Chọn phạm vi CuongMini được làm việc.`, `${ds.length} of your projects (workspace · role · open issues). Pick what CuongMini may work on.`);
  g.chon({
    tieuDe: o.lanDau ? L('CT Work đã nối — CuongMini làm việc với dự án nào?', 'CT Work is connected — which projects should CuongMini work on?') : L('Chọn phạm vi / dự án CT Work', 'Pick the CT Work scope / project'),
    moTa: moTaCu,
    ...(ds.length + ws.length > 8 ? { loc: true } : {}),
    ds: [
      { nhan: L('Tất cả dự án của tôi', 'All my projects'), giaTri: '__tatCa', mo: L('lưu cho máy này · dùng ở mọi thư mục chưa gắn', 'saved for this machine · used in every unbound folder'), ...(md?.tatCa ? { tat: true } : {}) },
      ...ws.map(([id, ten]) => ({ nhan: L(`Cả workspace ${ten}`, `Whole workspace ${ten}`), giaTri: `__ws:${id}`, mo: L(`${ds.filter((p) => p.workspaceId === id).length} dự án · lưu cho máy này`, `${ds.filter((p) => p.workspaceId === id).length} projects · saved for this machine`), ...(md?.workspaceId === id && !md.key ? { tat: true } : {}) })),
      ...ds.map((p) => ({ nhan: `${p.key} — ${p.ten}`, giaTri: p.key, mo: [p.workspace, p.vaiTro ? tenVai(p.vaiTro, g.ngonNgu) : '', p.soMo != null ? L(`${p.soMo} thẻ mở`, `${p.soMo} open`) : ''].filter(Boolean).join(' · ') })),
      ...(cu.gan ? [{ nhan: L('Bỏ gắn thư mục này', 'Unbind this folder'), giaTri: '__bo' }] : []),
      ...(md ? [{ nhan: L(`Bỏ mặc định của máy (${dangMd})`, `Clear the machine default (${dangMd})`), giaTri: '__boMacDinh' }] : []),
      { nhan: o.lanDau ? L('Để sau', 'Later') : L('Thoát', 'Exit'), giaTri: '__thoat', so: '0', mo: 'Esc' },
    ],
    khiChon: async (v) => {
      if (v === '__bo') { await he(g, 'boGan'); g.thongBao(L('Đã bỏ gắn dự án CT Work.', 'Unbound the CT Work project.'), 'ok'); g.lamMoiDong?.(); return; }
      if (v === '__boMacDinh') { await he(g, 'macDinh', { macDinh: null }); g.thongBao(L('Đã bỏ phạm vi CT Work mặc định của máy.', 'Cleared the machine\'s default CT Work scope.'), 'ok'); g.lamMoiDong?.(); return; }
      if (v === '__thoat') return;
      if (v === '__tatCa' || v.startsWith('__ws:')) {
        const id = v === '__tatCa' ? null : Number(v.slice(5));
        const tenWs = id ? ws.find(([x]) => x === id)?.[1] ?? null : null;
        const x = await he(g, 'macDinh', { macDinh: id ? { workspaceId: id, workspace: tenWs } : { tatCa: true } });
        if (!x.ok) { g.thongBao(`⚠ ${x.loi ?? '?'}`, 'loi'); return; }
        g.traLoi(id
          ? L(`✓ CuongMini làm việc với **mọi dự án trong workspace ${tenWs}** (lưu cho máy này). Nhắc thẻ \`KEY-123\` là CuongMini tự đọc; mọi thao tác đi ngầm qua CT Work — không mở trình duyệt. Đổi: \`/ctwork du-an\`.`,
            `✓ CuongMini works with **every project in workspace ${tenWs}** (saved for this machine). Mention \`KEY-123\` and CuongMini reads it; everything runs silently through CT Work — no browser. Change: \`/ctwork project\`.`)
          : L('✓ CuongMini làm việc với **tất cả dự án CT Work của bạn** (lưu cho máy này). Nhắc thẻ `KEY-123` là CuongMini tự đọc; mọi thao tác đi ngầm qua CT Work — không mở trình duyệt. Đổi: `/ctwork du-an`.',
            '✓ CuongMini works with **all your CT Work projects** (saved for this machine). Mention `KEY-123` and CuongMini reads it; everything runs silently through CT Work — no browser. Change: `/ctwork project`.'));
        g.lamMoiDong?.();
        return;
      }
      const p = ds.find((x) => x.key === v);
      if (p) await chonQuyen(g, p);
    },
  });
}

/** Đợt 6: `/mcp` ⇒ "CT Work — kết nối & chọn dự án": chưa nối ⇒ nối bằng phiên đăng nhập ⇒ liệt kê mọi dự án. */
export async function moCtworkTuMcp(g: GiaoDienCtw): Promise<void> {
  await chonDuAn(g);
}

// ─── Chọn thẻ (việc của tôi) ─────────────────────────────────────

async function chonThe(g: GiaoDienCtw, tieuDe: string, khiCo: (key: string) => void | Promise<void>, goiYNhap: string): Promise<void> {
  const L = Lg(g);
  const [dong, viec] = await Promise.all([he(g, 'dong'), he(g, 'viec')]);
  if (!viec.ok) { g.traLoi(`⚠ ${viec.loi ?? '?'}`); return; }
  const ds = (viec.dsThe ?? []).slice(0, 8);
  const theNhanh = dong.dong?.the;
  g.chon({
    tieuDe,
    ds: [
      ...(theNhanh && !ds.some((x) => x.key === theNhanh) ? [{ nhan: theNhanh, giaTri: theNhanh, mo: L('thẻ của nhánh hiện tại', 'issue of the current branch') }] : []),
      ...ds.map((x) => ({ nhan: `${x.key} — ${x.title.slice(0, 60)}`, giaTri: x.key, mo: `${x.status ?? ''}${x.key === theNhanh ? L(' · nhánh hiện tại', ' · current branch') : ''}` })),
      { nhan: L('Gõ mã thẻ khác…', 'Type another key…'), giaTri: '__go' },
    ],
    khiChon: async (v) => { if (v === '__go') g.datNhap(goiYNhap); else await khiCo(v); },
  });
}

// ─── Các việc của menu ───────────────────────────────────────────

async function moThe(g: GiaoDienCtw, key: string): Promise<void> {
  const L = Lg(g);
  const r = await he(g, 'the', { key });
  if (!r.ok) { g.traLoi(`⚠ ${r.loi ?? '?'}`); return; }
  g.chon({
    tieuDe: L('Thẻ CT Work', 'CT Work issue'),
    than: r.md ?? '',
    ds: [
      { nhan: L('Hướng dẫn làm thẻ này', 'Guide me through it'), giaTri: 'hd', mo: L('đọc gì · các bước · xong khi · phụ thuộc', 'read · steps · done when · dependencies') },
      { nhan: L('Bắt đầu làm thẻ này', 'Start working on it'), giaTri: 'bd', mo: L('nhánh + In Progress', 'branch + In Progress') },
      { nhan: L('Ghi giờ…', 'Log time…'), giaTri: 'gio' },
      { nhan: L('Bình luận bằng chứng', 'Post evidence comment'), giaTri: 'bl', mo: L('soạn từ git', 'drafted from git') },
      { nhan: L('Xong việc — bước tiếp', 'Done — next steps'), giaTri: 'xong', mo: L('chuyển trạng thái đúng luật · review', 'status move by the rules · review') },
      { nhan: L('Hỏi CuongMini về thẻ này', 'Ask CuongMini about it'), giaTri: 'hoi' },
      { nhan: L('Đóng', 'Close'), giaTri: 'thoat', so: '0' },
    ],
    khiChon: async (v) => {
      const k = r.key ?? key;
      if (v === 'hd') await huongDanThe(g, k);
      else if (v === 'bd') await batDau(g, k);
      else if (v === 'gio') g.datNhap(`/ctwork gio ${k} `);
      else if (v === 'bl') await binhLuan(g, k);
      else if (v === 'xong') await xongViec(g, k);
      else if (v === 'hoi') g.datNhap(`${k} `);
    },
  });
}

async function batDau(g: GiaoDienCtw, key: string): Promise<void> {
  const L = Lg(g);
  const r = await he(g, 'chuanBiBatDau', { key });
  if (!r.ok || !r.key) { g.traLoi(`⚠ ${r.loi ?? '?'}`); return; }
  const viecNhanh = r.nhanhNay === r.nhanh ? L(`đã ở nhánh \`${r.nhanh}\``, `already on \`${r.nhanh}\``)
    : r.nhanhCo ? L(`chuyển sang nhánh có sẵn \`${r.nhanh}\``, `switch to existing branch \`${r.nhanh}\``)
      : L(`tạo nhánh \`${r.nhanh}\` từ \`${r.nhanhNay ?? 'HEAD'}\``, `create branch \`${r.nhanh}\` from \`${r.nhanhNay ?? 'HEAD'}\``);
  /* QA 5c: thẻ ĐÃ đang làm ⇒ không chuyển ("In Progress → In Progress" trước đây); token chỉ đọc ⇒ nói thẳng là
     không chuyển được thay vì xem trước rồi hỏng. */
  const khongChuyen = r.daDangLam || r.chiDoc;
  const viecTT = r.daDangLam
    ? L(`${r.key} đã ở **${r.trangThai ?? 'In Progress'}** — không cần chuyển`, `${r.key} is already **${r.trangThai ?? 'In Progress'}** — no status change`)
    : r.chiDoc
      ? L(`KHÔNG chuyển được ${r.key} → In Progress: token CT Work chỉ đọc (\`/ctwork ghi\` để nâng quyền)`, `CANNOT move ${r.key} → In Progress: the CT Work token is read only (\`/ctwork write\` to upgrade)`)
      : L(`chuyển ${r.key}: ${r.trangThai ?? '?'} → **${r.den ?? 'In Progress'}** (ghi lên CT Work)`, `move ${r.key}: ${r.trangThai ?? '?'} → **${r.den ?? 'In Progress'}** (writes to CT Work)`);
  const daONhanh = r.nhanhNay === r.nhanh;
  if (khongChuyen && daONhanh) { g.traLoi(`${viecNhanh.charAt(0).toUpperCase()}${viecNhanh.slice(1)}.\n\n${viecTT}.`); return; }
  g.chon({
    tieuDe: L(`Bắt đầu làm ${r.key}?`, `Start working on ${r.key}?`),
    than: `${L('Sẽ', 'Will')}:\n- ${viecNhanh}\n- ${viecTT}`,
    ds: khongChuyen
      ? [{ nhan: daONhanh ? L('OK', 'OK') : L('Chuyển nhánh', 'Switch branch'), giaTri: 'nhanh' }, { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' }]
      : daONhanh
        ? [{ nhan: L('Chuyển trạng thái', 'Move the status'), giaTri: 'tt' }, { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' }]
        : [
          { nhan: L('Cả hai', 'Both'), giaTri: 'ca', mo: L('khuyên dùng', 'recommended') },
          { nhan: L('Chỉ nhánh git', 'Branch only'), giaTri: 'nhanh' },
          { nhan: L('Chỉ chuyển trạng thái', 'Status only'), giaTri: 'tt' },
          { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' },
        ],
    khiChon: async (v) => {
      if (v === 'huy') return;
      const x = await he(g, 'batDau', { key: r.key, nhanh: v !== 'tt', chuyen: v !== 'nhanh' });
      g.traLoi(x.ok ? (x.md ?? '✓') : `⚠ ${x.loi ?? '?'}`);
      g.lamMoiDong?.();
    },
  });
}

/**
 * QA 5c: token CHỈ ĐỌC (mặc định khuyên dùng) ⇒ máy chủ không có tool ghi. Báo TRƯỚC khi người dùng soạn/duyệt,
 * kèm một chạm nâng quyền. Trả `true` = đã chặn (giao diện đã hiện thẻ).
 */
async function chanChiDoc(g: GiaoDienCtw): Promise<boolean> {
  const L = Lg(g);
  const t = await g.goi<{ coGhi?: boolean | null; bienTay?: boolean }>('agent:ctwork', { viec: 'trangThai' }).catch(() => null);
  if (t?.coGhi !== false) return false;
  g.chon({
    tieuDe: L('Token CT Work đang chỉ đọc', 'Your CT Work token is read only'),
    moTa: t.bienTay
      ? L('Token lấy từ biến CTWORK_TOKEN — tạo token có quyền ghi trong CT Work → Developer, hoặc bỏ biến đó rồi nối bằng /ctwork.', 'The token comes from CTWORK_TOKEN — create one with write scope in CT Work → Developer, or unset it and connect with /ctwork.')
      : L('Việc này GHI lên CT Work. Nối lại với quyền "Đọc + ghi" — mỗi lần ghi vẫn hỏi duyệt.', 'This WRITES to CT Work. Reconnect with "read + write" — every write still asks.'),
    ds: [
      ...(t.bienTay ? [] : [{ nhan: L('Nối lại: đọc + ghi', 'Reconnect: read + write'), giaTri: 'ghi' }]),
      { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' },
    ],
    khiChon: async (v) => { if (v === 'ghi') await ketNoi(g, 'ghi'); },
  });
  return true;
}

async function ghiGio(g: GiaoDienCtw, key: string, phut: number, ghiChu: string): Promise<void> {
  const L = Lg(g);
  if (await chanChiDoc(g)) return;
  const gio = phut >= 60 ? `${Math.floor(phut / 60)}h${phut % 60 ? ` ${phut % 60}m` : ''}` : `${phut}m`;
  g.chon({
    tieuDe: L(`Ghi giờ vào ${key}?`, `Log time on ${key}?`),
    than: `${L('Ghi lên CT Work', 'Writes to CT Work')}: **${gio}** (${phut} ${L('phút', 'min')})${ghiChu ? ` — ${ghiChu}` : ''}`,
    ds: [{ nhan: L('Ghi', 'Log it'), giaTri: 'ok' }, { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' }],
    khiChon: async (v) => {
      if (v !== 'ok') return;
      const x = await he(g, 'gio', { key, phut, ...(ghiChu ? { noiDung: ghiChu } : {}) });
      g.traLoi(x.ok ? (x.md ?? '✓') : `⚠ ${x.loi ?? '?'}`);
    },
  });
}

async function binhLuan(g: GiaoDienCtw, key?: string): Promise<void> {
  const L = Lg(g);
  if (await chanChiDoc(g)) return;
  const r = await he(g, 'soanBinhLuan', key ? { key } : {});
  if (!r.ok || !r.key || !r.noiDung) { g.traLoi(`⚠ ${r.loi ?? '?'}`); return; }
  xacNhanGui(g, r.key, r.noiDung, L('Bình luận này được soạn từ git của nhánh.', 'This comment was drafted from the branch\'s git history.'));
}

function xacNhanGui(g: GiaoDienCtw, key: string, noiDung: string, moTa?: string): void {
  const L = Lg(g);
  g.chon({
    tieuDe: L(`Gửi bình luận vào ${key}?`, `Post this comment on ${key}?`),
    ...(moTa ? { moTa } : {}),
    than: noiDung,
    ds: [
      { nhan: L('Gửi', 'Post it'), giaTri: 'gui' },
      { nhan: L('Sửa trước khi gửi', 'Edit before posting'), giaTri: 'sua', mo: L('đưa vào ô nhập', 'puts it in the input') },
      { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' },
    ],
    khiChon: async (v) => {
      if (v === 'sua') { g.datNhap(`/ctwork gui ${key} ${noiDung}`); return; }
      if (v !== 'gui') return;
      const x = await he(g, 'binhLuan', { key, noiDung });
      g.traLoi(x.ok ? (x.md ?? '✓') : `⚠ ${x.loi ?? '?'}`);
    },
  });
}

async function baoCao(g: GiaoDienCtw): Promise<void> {
  const L = Lg(g);
  if (await chanChiDoc(g)) return;
  const d = await he(g, 'docGan');
  g.chon({
    tieuDe: L('Tạo Báo cáo tuần?', 'Generate the weekly report?'),
    than: L(`Ghi lên CT Work: tạo (hoặc làm mới) **Báo cáo tuần** của ${d.gan?.key ?? 'dự án'} cho tuần này — CT Work tự tính việc xong/kế hoạch/rủi ro/giờ.`,
      `Writes to CT Work: create (or refresh) the **weekly report** of ${d.gan?.key ?? 'the project'} for this week — CT Work computes done/planned work, risks and hours.`),
    ds: [{ nhan: L('Tạo', 'Generate'), giaTri: 'ok' }, { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' }],
    khiChon: async (v) => {
      if (v !== 'ok') return;
      g.thongBao(L('Đang tạo báo cáo tuần…', 'Generating the weekly report…'));
      const x = await he(g, 'baoCao');
      g.traLoi(x.ok ? (x.md ?? '✓') : `⚠ ${x.loi ?? '?'}`);
    },
  });
}

async function xem(g: GiaoDienCtw, viec: 'sprint' | 'viec' | 'hop'): Promise<void> {
  const r = await he(g, viec);
  g.traLoi(r.ok ? (r.md ?? '') : `⚠ ${r.loi ?? '?'}`);
}

// ─── Đợt 6: DẪN ĐƯỜNG — hôm nay · hướng dẫn thẻ · xong việc · nhóm · mẫu FPT ─

/** "Hôm nay làm gì": việc của tôi + nên làm cái nào trước. `tuDong` ⇒ lõi chỉ hiện MỘT lần mỗi ngày mỗi thư mục. */
export async function homNay(g: GiaoDienCtw, o: { tuDong?: boolean } = {}): Promise<boolean> {
  const L = Lg(g);
  const r = await he(g, 'homNay', o.tuDong ? { tuDong: true } : {});
  if (r.boQua || (r.ok && !r.md)) return false;
  if (!r.ok) { if (!o.tuDong) g.traLoi(`⚠ ${r.loi ?? '?'}`); return false; }
  const dau = r.truoc;
  /* Tự hiện lúc mở (đầu buổi): KHỐI CHỮ, không phải thẻ chặn phím — người dùng vừa mở CuongMini để gõ. Nút ở `/ctwork`. */
  if (o.tuDong) {
    g.traLoi(`${r.md ?? ''}${dau ? `\n\n${L(`→ \`/ctwork huong-dan ${dau}\` (đọc gì · các bước · phụ thuộc) · \`/ctwork bat-dau ${dau}\` · \`/ctwork\` mục 2`, `→ \`/ctwork guide ${dau}\` (read · steps · dependencies) · \`/ctwork start ${dau}\` · \`/ctwork\` item 2`)}` : ''}`);
    return true;
  }
  g.chon({
    tieuDe: L('CT Work · hôm nay', 'CT Work · today'),
    than: r.md ?? '',
    ds: [
      ...(dau ? [
        { nhan: L(`Hướng dẫn làm ${dau}`, `Guide me through ${dau}`), giaTri: `hd:${dau}`, mo: L('đọc gì · các bước · xong khi · hỏi ai', 'what to read · steps · done when · who to ask') },
        { nhan: L(`Bắt đầu ${dau}`, `Start ${dau}`), giaTri: `bd:${dau}`, mo: L('nhánh + In Progress, có duyệt', 'branch + In Progress, approved first') },
      ] : []),
      { nhan: L('Mở thẻ khác…', 'Open another issue…'), giaTri: 'the' },
      { nhan: L('Để sau', 'Later'), giaTri: 'sau', so: '0', mo: L('/ctwork để mở lại', '/ctwork to reopen') },
    ],
    khiChon: async (v) => {
      if (v.startsWith('hd:')) await huongDanThe(g, v.slice(3));
      else if (v.startsWith('bd:')) await batDau(g, v.slice(3));
      else if (v === 'the') await chonThe(g, L('Mở thẻ nào?', 'Open which issue?'), (k) => moThe(g, k), '/issue ');
    },
  });
  return true;
}

/** Hướng dẫn MỘT thẻ: đọc gì (link), các bước, xong khi, hỏi ai + phụ thuộc (ai phải xong gì trước, nhánh nào). */
export async function huongDanThe(g: GiaoDienCtw, key?: string): Promise<void> {
  const L = Lg(g);
  g.thongBao(L(`Đang đọc ${key ?? 'thẻ của nhánh'}…`, `Reading ${key ?? 'the branch issue'}…`));
  const r = await he(g, 'huongDan', key ? { key } : {});
  if (!r.ok || !r.key) { g.traLoi(`⚠ ${r.loi ?? '?'}`); return; }
  const k = r.key;
  const biChan = (r.chan ?? []).length > 0;
  g.chon({
    tieuDe: L(`Hướng dẫn · ${k}`, `Guide · ${k}`),
    than: r.md ?? '',
    ds: [
      { nhan: biChan ? L('Vẫn bắt đầu (đang bị chặn)', 'Start anyway (blocked)') : L('Bắt đầu làm thẻ này', 'Start working on it'), giaTri: 'bd', mo: L('nhánh + In Progress', 'branch + In Progress') },
      { nhan: L('Làm cùng CuongMini', 'Work on it with CuongMini'), giaTri: 'cung', mo: L('đưa thẻ vào ô nhập', 'puts the issue in the input') },
      ...(biChan ? [{ nhan: L('Nhắn người làm thẻ chặn…', 'Message the blocker\'s owner…'), giaTri: 'nhan', mo: L('soạn tin, xem trước rồi gửi', 'draft, preview, then send') }] : []),
      { nhan: L('Hỏi giảng viên/trưởng nhóm (Q&A)…', 'Ask the lecturer/lead (Q&A)…'), giaTri: 'qna' },
      { nhan: L('Đóng', 'Close'), giaTri: 'thoat', so: '0' },
    ],
    khiChon: async (v) => {
      if (v === 'bd') await batDau(g, k);
      else if (v === 'cung') g.datNhap(L(`${k} — hướng dẫn mình làm thẻ này từng bước (đọc đủ trước, không viết hộ nếu AGENTS.md bảo mentor).`, `${k} — walk me through this issue step by step (read everything first; don't write it for me if AGENTS.md says mentor).`));
      else if (v === 'nhan') g.datNhap(L(`Soạn tin nhắn ngắn hỏi người làm ${(r.chan ?? []).join(', ')} khi nào xong (để mình xem trước rồi gửi vào chat nhóm).`, `Draft a short message asking the owner of ${(r.chan ?? []).join(', ')} when it will be done (I'll preview before sending to team chat).`));
      else if (v === 'qna') g.datNhap(`/ctwork hoi ${k}: `);
    },
  });
}

/**
 * Làm xong ⇒ gợi ý thao tác ĐÚNG LUẬT dự án (chuyển trạng thái được phép + Done rules, bình luận bằng chứng, ghi giờ, xin
 * review, báo nhóm…). `tuDong` (sau mỗi lượt): lõi chỉ trả khi có thay đổi git mới trên nhánh của thẻ, không nhắc lại.
 * Mọi thao tác GHI đi qua thẻ XEM TRƯỚC rồi mới gọi lõi.
 */
export async function xongViec(g: GiaoDienCtw, key?: string, o: { tuDong?: boolean } = {}): Promise<boolean> {
  const L = Lg(g);
  const r = await he(g, 'goiYSau', { ...(key ? { key } : {}), ...(o.tuDong ? { tuDong: true } : {}) });
  if (r.boQua) return false;
  if (!r.ok || !r.key) { if (!o.tuDong) g.traLoi(`⚠ ${r.loi ?? '?'}`); return false; }
  const k = r.key;
  const ds = r.goiY ?? [];
  if (!ds.length) { if (!o.tuDong) g.traLoi(r.md ?? ''); return false; }
  g.chon({
    tieuDe: o.tuDong ? L(`Xong việc ở ${k}? Bước tiếp theo đúng luật dự án:`, `Done with ${k}? Next steps by the project rules:`) : L(`Xong việc · ${k}`, `Done · ${k}`),
    than: r.md ?? '',
    ds: [
      ...ds.slice(0, 8).map((x) => ({ nhan: x.nhan, giaTri: x.id, mo: `${x.mo}${x.ghi ? L(' · xem trước', ' · preview') : ''}` })),
      { nhan: L('Để sau', 'Later'), giaTri: '__sau', so: '0', mo: L('/ctwork xong để mở lại', '/ctwork done to reopen') },
    ],
    khiChon: async (v) => { if (v !== '__sau') await lamMotGoiY(g, k, v); },
  });
  return true;
}

async function lamMotGoiY(g: GiaoDienCtw, key: string, id: string): Promise<void> {
  const L = Lg(g);
  const x = await he(g, 'xemTruocGoiY', { key, id });
  if (!x.ok) { g.traLoi(`⚠ ${x.loi ?? '?'}`); return; }
  if (x.nhapGoiY) { g.datNhap(x.nhapGoiY); g.thongBao(L('Đã đưa vào ô nhập — sửa rồi Enter.', 'Put in the input — edit, then press Enter.')); return; }
  if (id === 'binhLuan') { xacNhanGui(g, key, x.noiDung ?? '', L('Bình luận này được soạn từ git của nhánh.', 'This comment was drafted from the branch\'s git history.')); return; }
  if (await chanChiDoc(g)) return;
  const noiDung = x.noiDung ?? '';
  g.chon({
    tieuDe: L(`Ghi lên CT Work · ${key}?`, `Write to CT Work · ${key}?`),
    ...(x.viec ? { moTa: x.viec } : {}),
    ...(noiDung ? { than: noiDung } : {}),
    ds: [
      { nhan: L('Đồng ý', 'Do it'), giaTri: 'ok' },
      ...(noiDung ? [{ nhan: L('Sửa trước khi gửi', 'Edit first'), giaTri: 'sua', mo: L('đưa vào ô nhập', 'puts it in the input') }] : []),
      { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' },
    ],
    khiChon: async (v) => {
      if (v === 'sua') { g.datNhap(id === 'chat' ? `/ctwork nhan ${noiDung}` : `/ctwork gui ${key} ${noiDung}`); return; }
      if (v !== 'ok') return;
      const kq = await he(g, 'lamGoiY', { key, id, noiDung });
      g.traLoi(kq.ok ? (kq.md ?? '✓') : `⚠ ${kq.loi ?? '?'}`);
      g.lamMoiDong?.();
    },
  });
}

/** Thẻ "Nhóm": tổng quan tiến độ (trưởng nhóm) / nhóm của giảng viên · nhắc người trễ · Q&A · chat · họp. */
async function nhom(g: GiaoDienCtw): Promise<void> {
  const L = Lg(g);
  g.thongBao(L('Đang đọc tiến độ nhóm…', 'Reading team progress…'));
  const r = await he(g, 'tongQuan');
  if (!r.ok) { g.traLoi(`⚠ ${r.loi ?? '?'}`); return; }
  g.chon({
    tieuDe: r.vai === 'TEACHER' ? L('Nhóm · góc giảng viên', 'Group · lecturer view') : r.vai === 'ADMIN' ? L('Nhóm · góc trưởng nhóm', 'Team · lead view') : L('Nhóm', 'Team'),
    than: r.md ?? '',
    ds: [
      ...(r.tinNhac && r.vai === 'ADMIN' ? [{ nhan: L('Nhắc người trễ hạn…', 'Nudge overdue members…'), giaTri: 'nhac', mo: L('soạn tin, xem trước rồi gửi #general', 'draft, preview, then post to #general') }] : []),
      ...(r.vai === 'ADMIN' ? [{ nhan: L('Gợi ý chia việc / lập sprint', 'Suggest assignments / sprint plan'), giaTri: 'chia', mo: L('CuongMini đề xuất, bạn quyết', 'CuongMini proposes, you decide') }] : []),
      { nhan: L('Hỏi Q&A…', 'Ask in Q&A…'), giaTri: 'qna' },
      { nhan: L('Nhắn kênh nhóm…', 'Message the team…'), giaTri: 'chat' },
      { nhan: L('Họp', 'Meetings'), giaTri: 'hop', mo: 'meeting_list' },
      { nhan: L('Đóng', 'Close'), giaTri: 'thoat', so: '0' },
    ],
    khiChon: async (v) => {
      if (v === 'nhac' && r.tinNhac) xacNhanNhom(g, r.tinNhac);
      else if (v === 'chia') g.datNhap(L('Xem sprint + việc từng người, gợi ý chia lại việc và thẻ nên đưa vào sprint tới (chỉ đề xuất — mình quyết, đừng ghi gì).', 'Look at the sprint and everyone\'s work, suggest how to rebalance and what to pull into the next sprint (proposal only — I decide, write nothing).'));
      else if (v === 'qna') g.datNhap('/ctwork hoi ');
      else if (v === 'chat') g.datNhap('/ctwork nhan ');
      else if (v === 'hop') await xem(g, 'hop');
    },
  });
}

function xacNhanNhom(g: GiaoDienCtw, noiDung: string): void {
  const L = Lg(g);
  g.chon({
    tieuDe: L('Gửi vào kênh #general?', 'Post to #general?'),
    than: noiDung,
    ds: [{ nhan: L('Gửi', 'Post it'), giaTri: 'gui' }, { nhan: L('Sửa trước khi gửi', 'Edit first'), giaTri: 'sua' }, { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' }],
    khiChon: async (v) => {
      if (v === 'sua') { g.datNhap(`/ctwork nhan ${noiDung}`); return; }
      if (v !== 'gui') return;
      if (await chanChiDoc(g)) return;
      const x = await he(g, 'guiTinNhom', { noiDung });
      g.traLoi(x.ok ? (x.md ?? '✓') : `⚠ ${x.loi ?? '?'}`);
    },
  });
}

function xacNhanQna(g: GiaoDienCtw, cauHoi: string): void {
  const L = Lg(g);
  g.chon({
    tieuDe: L('Gửi câu hỏi vào sổ Q&A của dự án?', 'Post this question to the project Q&A log?'),
    than: cauHoi,
    ds: [{ nhan: L('Gửi', 'Post it'), giaTri: 'gui' }, { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' }],
    khiChon: async (v) => {
      if (v !== 'gui') return;
      if (await chanChiDoc(g)) return;
      const x = await he(g, 'hoiQna', { noiDung: cauHoi });
      g.traLoi(x.ok ? (x.md ?? '✓') : `⚠ ${x.loi ?? '?'}`);
    },
  });
}

/** Thẻ "Báo cáo & mẫu FPT": báo cáo tuần + mẫu nên làm lúc này (CuongMini điền, bạn duyệt) + họp. */
async function baoCaoMau(g: GiaoDienCtw): Promise<void> {
  const L = Lg(g);
  const r = await he(g, 'mauFpt');
  const mau = r.ok ? (r.mau ?? []) : [];
  g.chon({
    tieuDe: L('Báo cáo & mẫu FPT', 'Reports & FPT templates'),
    ...(r.md ? { than: r.md } : {}),
    ds: [
      { nhan: L('Báo cáo tuần', 'Weekly report'), giaTri: '__bc', mo: 'weekly_report_generate' },
      ...mau.filter((m) => m.tool !== 'weekly_report_generate').slice(0, 6).map((m) => ({ nhan: L(`Nhờ CuongMini: ${m.ten}`, `Ask CuongMini: ${m.ten}`), giaTri: m.tool, mo: m.tool })),
      { nhan: L('Họp', 'Meetings'), giaTri: '__hop', mo: 'meeting_list' },
      { nhan: L('Đóng', 'Close'), giaTri: '__thoat', so: '0' },
    ],
    khiChon: async (v) => {
      if (v === '__bc') { await baoCao(g); return; }
      if (v === '__hop') { await xem(g, 'hop'); return; }
      const m = mau.find((x) => x.tool === v);
      if (m) g.datNhap(m.cauHoi);
    },
  });
}

/** Một lần gọi lõi sau mỗi lượt: tin theo dõi (≥ 60 s/lần ở lõi) — trả các dòng để giao diện in mờ. */
export async function kiemTinCtw(g: GiaoDienCtw): Promise<string[]> {
  const r = await he(g, 'kiemTin');
  return r.ok ? (r.tin ?? []) : [];
}

/**
 * Menu `/ctwork` đánh số (1–9, 0 Thoát) — đã kết nối. Đợt 6: 2 = HÔM NAY (việc của tôi + nên làm gì trước), 6 = XONG VIỆC
 * (bình luận bằng chứng + chuyển trạng thái đúng luật + ghi giờ + xin review…), 7 = báo cáo & mẫu FPT, 8 = nhóm (tổng quan
 * trưởng nhóm / giảng viên, Q&A, chat, họp); không số: theo dõi bật/tắt, hỏi cách dùng CT Work, tài nguyên.
 */
export async function menuCtwork(g: GiaoDienCtw): Promise<void> {
  const L = Lg(g);
  const [d, t, td] = await Promise.all([
    he(g, 'dong'),
    g.goi<{ server?: { ok: boolean; soTool: number } | null; quyen?: string | null; bienTay?: boolean; coGhi?: boolean | null }>('agent:ctwork', { viec: 'trangThai' }).catch(() => null),
    he(g, 'theoDoi'),
  ]);
  const canGhi = t?.coGhi === false ? L('cần quyền ghi — /ctwork ghi', 'needs write access — /ctwork write') : null;
  const dong = veDongCtw(d.dong, g.ngonNgu, 200);
  const quyen = t?.bienTay ? L('token từ biến CTWORK_TOKEN', 'token from CTWORK_TOKEN') : t?.quyen === 'ghi' ? L('đọc + ghi', 'read + write') : L('chỉ đọc', 'read only');
  const coGan = Boolean(d.dong?.key);
  const tat = coGan ? {} : { tat: true };
  g.chon({
    tieuDe: 'CT Work',
    moTa: `${coGan ? dong : `${dong ? `${dong}\n` : ''}${(d.dong as { phamVi?: string } | null)?.phamVi === 'tatCa' || (d.dong as { phamVi?: string } | null)?.phamVi === 'workspace' ? L('Phạm vi đã chọn ở trên — các mục theo một dự án cần chọn dự án ở mục 9. Hỏi CuongMini về thẻ bất kỳ vẫn được.', 'Scope chosen above — per-project items need a project from item 9. You can still ask CuongMini about any issue.') : L('Chưa có dự án cụ thể — chọn mục 9 (một dự án, cả workspace, hoặc tất cả). Hỏi CuongMini về thẻ bất kỳ vẫn được.', 'No specific project — pick 9 (one project, a workspace, or all). You can still ask CuongMini about any issue.')}`}\n${L('Kết nối', 'Connection')}: ${t?.server?.ok ? `✔ ${t.server.soTool} ${L('tool', t.server.soTool === 1 ? 'tool' : 'tools')} · ${quyen}` : L('chưa nối', 'not connected')} · ${L('đổi', 'change')}: /ctwork ${L('ket-noi', 'connect')}`,
    ds: [
      { nhan: L('Sprint hiện tại', 'Current sprint'), giaTri: 'sprint', mo: L('bảng thẻ theo cột trạng thái', 'board by status column'), ...tat },
      { nhan: L('Hôm nay — việc của tôi', 'Today — my work'), giaTri: 'homNay', mo: L('hạn gần lên đầu · nên làm gì trước', 'nearest due first · what to do first'), ...tat },
      { nhan: L('Mở thẻ / hướng dẫn…', 'Open / guide an issue…'), giaTri: 'the', mo: `${d.dong?.key ?? 'LF'}-xx · ${L('đọc gì, các bước, phụ thuộc', 'what to read, steps, dependencies')}`, ...tat },
      { nhan: L('Bắt đầu làm thẻ…', 'Start an issue…'), giaTri: 'batDau', mo: L('nhánh + In Progress, có duyệt', 'branch + In Progress, approved first'), ...tat },
      { nhan: L('Ghi giờ…', 'Log work…'), giaTri: 'gio', mo: canGhi ?? 'log_work', ...tat },
      { nhan: L('Xong việc — bước tiếp', 'Done — next steps'), giaTri: 'xong', mo: canGhi ?? L('bằng chứng · chuyển trạng thái · review', 'evidence · status move · review'), ...tat },
      { nhan: L('Báo cáo & mẫu FPT', 'Reports & FPT templates'), giaTri: 'baoCao', mo: L('báo cáo tuần · 5.1/5.2 · SRS · họp', 'weekly · 5.1/5.2 · SRS · meetings'), ...tat },
      { nhan: L('Nhóm', 'Team'), giaTri: 'nhom', mo: L('tổng quan · Q&A · chat · họp', 'overview · Q&A · chat · meetings'), ...tat },
      { nhan: L('Chọn dự án', 'Pick project'), giaTri: 'duAn', mo: coGan ? L(`đang: ${d.dong!.key}`, `now: ${d.dong!.key}`) : L('dự án · workspace · tất cả', 'project · workspace · all') },
      /* "0. Thoát" đứng ngay sau 9 (cửa sổ 10 dòng luôn thấy 1–9 + 0); hai mục không số ở dưới, ↑↓ tới. */
      { nhan: L('Thoát', 'Exit'), giaTri: 'thoat', so: '0', mo: 'Esc' },
      { nhan: L(`Theo dõi: ${td.bat ? 'BẬT' : 'TẮT'}`, `Watch: ${td.bat ? 'ON' : 'OFF'}`), giaTri: 'theoDoi', mo: L('báo nhẹ khi được giao/nhắc/thẻ chặn xong', 'gentle notices: assigned / mentioned / blocker done') },
      { nhan: L('Hỏi cách dùng CT Work…', 'How do I … in CT Work?'), giaTri: 'cachDung', mo: L('kèm link đúng trang', 'with links to the right page') },
    ],
    khiChon: async (v) => {
      switch (v) {
        case 'sprint': await xem(g, 'sprint'); return;
        case 'homNay': await homNay(g); return;
        case 'the': await chonThe(g, L('Mở thẻ nào?', 'Open which issue?'), (k) => moThe(g, k), '/issue '); return;
        case 'batDau': await chonThe(g, L('Bắt đầu làm thẻ nào?', 'Start which issue?'), (k) => batDau(g, k), '/ctwork bat-dau '); return;
        case 'gio': if (await chanChiDoc(g)) return; await chonThe(g, L('Ghi giờ vào thẻ nào?', 'Log work on which issue?'), (k) => { g.datNhap(`/ctwork gio ${k} `); g.thongBao(L(`Gõ thời gian rồi Enter, vd: 1.5h đọc tài liệu JWT`, `Type the time then Enter, e.g. 1.5h read JWT docs`)); }, '/ctwork gio '); return;
        case 'xong': await xongViec(g); return;
        case 'baoCao': await baoCaoMau(g); return;
        case 'nhom': await nhom(g); return;
        case 'duAn': await chonDuAn(g); return;
        case 'theoDoi': { const x = await he(g, 'theoDoi', { bat: !td.bat }); g.thongBao(x.bat ? L('Theo dõi CT Work: BẬT — báo nhẹ mỗi ≥ 60 giây khi có gì mới.', 'CT Work watch: ON — gentle notices at most once a minute.') : L('Theo dõi CT Work: TẮT.', 'CT Work watch: OFF.'), 'ok'); return; }
        case 'cachDung': g.datNhap(L('Trong CT Work làm thế nào để ', 'In CT Work, how do I ')); return;
        default:
      }
    },
  });
}

/** Thẻ "Kết nối / đổi quyền / ngắt" (chưa nối ⇒ kết nối; đã nối ⇒ đổi quyền, ngắt, tự ghi). */
async function theKetNoi(g: GiaoDienCtw): Promise<void> {
  const L = Lg(g);
  const t = await g.goi<{ server?: { ok: boolean; soTool: number; loi?: string; tat?: boolean } | null; quyen?: string | null; bienTay?: boolean; canCapLai?: boolean }>('agent:ctwork', { viec: 'trangThai' }).catch(() => null);
  const tu = await he(g, 'tuGhi');
  g.chon({
    tieuDe: L('CT Work — kết nối', 'CT Work — connection'),
    moTa: t?.server?.ok
      ? `✔ ${L('đã nối', 'connected')} · ${t.server.soTool} ${L('tool', t.server.soTool === 1 ? 'tool' : 'tools')} · ${t.bienTay ? L('token từ biến CTWORK_TOKEN', 'token from CTWORK_TOKEN') : t.quyen === 'ghi' ? L('đọc + ghi', 'read + write') : L('chỉ đọc', 'read only')} · ${L('agent tự ghi', 'agent auto-write')}: ${tu.bat ? L('BẬT', 'ON') : L('tắt (mỗi lần ghi đều hỏi)', 'off (every write asks)')}`
      : t?.server?.tat ? L('Server CT Work đang TẮT (/mcp để bật lại).', 'The CT Work server is DISABLED (/mcp to re-enable).')
        : t?.canCapLai ? L('Token hết hạn hoặc bị thu hồi.', 'The token expired or was revoked.') : L('Chưa nối.', 'Not connected.'),
    ds: [
      { nhan: L('Đọc + ghi', 'Read + write'), giaTri: 'ghi', mo: L('khuyên dùng · ghi vẫn hỏi duyệt', 'recommended · writes still ask'), ...(t?.server?.ok && t.quyen === 'ghi' ? { tat: true } : {}) },
      { nhan: L('Chỉ đọc', 'Read only'), giaTri: 'doc', ...(t?.server?.ok && t.quyen === 'doc' ? { tat: true } : {}) },
      ...(t?.canCapLai ? [{ nhan: L('Cấp lại token', 'Renew the token'), giaTri: 'capLai' }] : []),
      ...(t?.server?.ok ? [{ nhan: tu.bat ? L('Tắt "agent tự ghi"', 'Turn agent auto-write off') : L('Bật "agent tự ghi" (không hỏi khi ghi)', 'Turn agent auto-write on (no prompt on writes)'), giaTri: tu.bat ? 'tuGhiTat' : 'tuGhiBat' }] : []),
      ...(t?.server ? [{ nhan: L('Ngắt kết nối', 'Disconnect'), giaTri: 'off', mo: L('thu hồi token', 'revokes the token') }] : []),
      { nhan: L('Thoát', 'Exit'), giaTri: 'thoat', so: '0', mo: 'Esc' },
    ],
    khiChon: async (v) => {
      if (v === 'doc' || v === 'ghi') { if (await ketNoi(g, v)) await sauKhiNoi(g); return; }
      if (v === 'capLai') { const x = await g.goi<{ ok: boolean; loi?: string }>('agent:ctwork', { viec: 'capLai' }).catch((e: Error): KqKetNoi => ({ ok: false, loi: e.message })); g.thongBao(x?.ok ? L('✓ Đã cấp lại token.', '✓ Token renewed.') : `⚠ ${x?.loi ?? '?'}`, x?.ok ? 'ok' : 'loi'); return; }
      if (v === 'tuGhiBat' || v === 'tuGhiTat') { await lenhCtwork('/ctwork', `tu-ghi ${v === 'tuGhiBat' ? 'on' : 'off'}`, g); return; }
      if (v === 'off') {
        const x = await g.goi<{ ok: boolean; loi?: string }>('agent:ctwork', { viec: 'ngat' }).catch((e: Error): KqKetNoi => ({ ok: false, loi: e.message }));
        g.traLoi(x?.ok ? L('Đã ngắt CT Work: thu hồi token, xoá khỏi kho bí mật, gỡ server `ctwork`.', 'Disconnected CT Work: token revoked, removed from the secret store, `ctwork` server removed.') : `⚠ ${x?.loi ?? '?'}`);
        g.lamMoiDong?.();
      }
    },
  });
}

/**
 * `/ctwork [con]`, `/issue <KEY>` (`/the`), `/sprint`, `/viec`. Trả `true` khi đã xử lý.
 * Con của `/ctwork`: doc|ghi|off · ket-noi · cap-lai · du-an [KEY] · bo-gan · sprint · viec · the <KEY> · bat-dau <KEY> ·
 * gio <KEY> <thời gian> [ghi chú] · binh-luan [KEY] · gui <KEY> <nội dung> · bao-cao · hop · tu-ghi on|off.
 */
export async function lenhCtwork(ten: string, thamSo: string, g: GiaoDienCtw): Promise<boolean> {
  const L = Lg(g);
  const tach = thamSo.trim().split(/\s+/).filter(Boolean);
  if (ten === '/issue') {
    if (!tach[0]) { await chonThe(g, L('Mở thẻ nào?', 'Open which issue?'), (k) => moThe(g, k), '/issue '); return true; }
    await moThe(g, tach[0]);
    return true;
  }
  if (ten === '/sprint') { await xem(g, 'sprint'); return true; }
  if (ten === '/viec') { await xem(g, 'viec'); return true; }
  if (ten !== '/ctwork') return false;

  const con = ch(tach[0] ?? '');
  const sau = tach.slice(1);
  switch (con) {
    case '': {
      const t = await g.goi<{ server?: { ok: boolean } | null; canCapLai?: boolean }>('agent:ctwork', { viec: 'trangThai' }).catch(() => null);
      if (t?.server?.ok) await menuCtwork(g); else await theKetNoi(g);
      return true;
    }
    case 'doc': case 'read': if (await ketNoi(g, 'doc')) await sauKhiNoi(g); return true;
    case 'ghi': case 'write': if (await ketNoi(g, 'ghi')) await sauKhiNoi(g); return true;
    case 'off': case 'tat': case 'ngat': case 'disconnect': {
      const x = await g.goi<{ ok: boolean; loi?: string }>('agent:ctwork', { viec: 'ngat' }).catch((e: Error): KqKetNoi => ({ ok: false, loi: e.message }));
      g.traLoi(x?.ok ? L('Đã ngắt CT Work: thu hồi token, xoá khỏi kho bí mật, gỡ server `ctwork`.', 'Disconnected CT Work: token revoked, removed from the secret store, `ctwork` server removed.') : `⚠ ${x?.loi ?? '?'}`);
      g.lamMoiDong?.();
      return true;
    }
    case 'ket-noi': case 'ketnoi': case 'connect': case 'connection': await theKetNoi(g); return true;
    case 'cap-lai': case 'caplai': case 'renew': {
      const x = await g.goi<{ ok: boolean; loi?: string; soTool?: number }>('agent:ctwork', { viec: 'capLai' }).catch((e: Error): KqKetNoi => ({ ok: false, loi: e.message }));
      g.traLoi(x?.ok ? L(`✓ Đã cấp lại token CT Work · ${x.soTool ?? 0} tool.`, `✓ CT Work token renewed · ${x.soTool ?? 0} tools.`) : `⚠ ${x?.loi ?? '?'}`);
      return true;
    }
    case 'du-an': case 'duan': case 'project': case 'projects': {
      const k = sau[0];
      if (k) {
        const r = await he(g, 'dsDuAn');
        const p = r.ds?.find((x) => ch(x.key) === ch(k) || ch(x.key.split('/').pop() ?? '') === ch(k));
        if (p) await gan(g, p); else g.traLoi(L(`Không thấy dự án \`${k}\` trong các dự án token này thấy.`, `Project \`${k}\` is not among the projects this token can see.`));
        return true;
      }
      await chonDuAn(g);
      return true;
    }
    /* Đợt 8A: gỡ gắn thư mục ⇄ dự án (token vẫn trong kho). */
    case 'bo-gan': case 'bogan': case 'unbind': case 'unlink': {
      const r = await he(g, 'boGan');
      g.traLoi(r.ok ? L('Đã bỏ gắn thư mục này khỏi dự án CT Work — CuongMini không còn gửi tool CT Work ở đây. Token vẫn giữ trong kho; gắn lại: `/ctwork du-an`.', 'Unbound this folder from its CT Work project — CuongMini no longer sends CT Work tools here. The token stays in the store; bind again: `/ctwork project`.') : `⚠ ${r.loi ?? '?'}`);
      g.lamMoiDong?.();
      return true;
    }
    case 'sprint': await xem(g, 'sprint'); return true;
    case 'viec': case 'my-work': case 'mywork': case 'work': await xem(g, 'viec'); return true;
    case 'hop': case 'meetings': case 'meeting': await xem(g, 'hop'); return true;
    case 'the': case 'issue': case 'mo': case 'open':
      if (sau[0]) await moThe(g, sau[0]); else await chonThe(g, L('Mở thẻ nào?', 'Open which issue?'), (k) => moThe(g, k), '/issue ');
      return true;
    case 'bat-dau': case 'batdau': case 'start':
      if (sau[0]) await batDau(g, sau[0]); else await chonThe(g, L('Bắt đầu làm thẻ nào?', 'Start which issue?'), (k) => batDau(g, k), '/ctwork bat-dau ');
      return true;
    case 'gio': case 'log': case 'log-work': {
      const key = sau[0];
      if (!key) { if (await chanChiDoc(g)) return true; await chonThe(g, L('Ghi giờ vào thẻ nào?', 'Log work on which issue?'), (k) => g.datNhap(`/ctwork gio ${k} `), '/ctwork gio '); return true; }
      const phut = docGioChu(sau[1] ?? '');
      if (!phut) { g.datNhap(`/ctwork gio ${key} `); g.thongBao(L('Gõ thời gian: 90m · 1.5h · 1h30 (rồi ghi chú nếu muốn).', 'Type the time: 90m · 1.5h · 1h30 (then an optional note).')); return true; }
      await ghiGio(g, key.toUpperCase(), phut, sau.slice(2).join(' '));
      return true;
    }
    case 'binh-luan': case 'binhluan': case 'comment': case 'evidence': await binhLuan(g, sau[0]); return true;
    case 'gui': case 'post': {
      const key = sau[0];
      const noiDung = thamSo.trim().replace(/^\S+\s+\S+\s*/, '');
      if (!key || !noiDung) { g.traLoi(L('Dùng: `/ctwork gui LF-18 nội dung bình luận`', 'Usage: `/ctwork post LF-18 comment text`')); return true; }
      if (await chanChiDoc(g)) return true;
      xacNhanGui(g, key.toUpperCase(), noiDung);
      return true;
    }
    case 'bao-cao': case 'baocao': case 'report': case 'weekly': await baoCao(g); return true;
    /* ── Đợt 6: dẫn đường ── */
    case 'hom-nay': case 'homnay': case 'today': await homNay(g); return true;
    case 'huong-dan': case 'huongdan': case 'guide': await huongDanThe(g, sau[0]); return true;
    case 'xong': case 'done': case 'next': await xongViec(g, sau[0]); return true;
    case 'nhom': case 'team': await nhom(g); return true;
    case 'mau': case 'mau-fpt': case 'templates': case 'fpt': await baoCaoMau(g); return true;
    case 'tai-nguyen': case 'tainguyen': case 'resources': g.datNhap(L('Liệt kê Resources của dự án (project_resources) và chỉ cái nào liên quan việc mình đang làm.', 'List the project Resources (project_resources) and point out the ones relevant to what I am doing.')); return true;
    case 'theo-doi': case 'theodoi': case 'watch': {
      const q = ch(sau[0] ?? '');
      const bat = /^(on|bat|1|yes)$/.test(q) ? true : /^(off|tat|0|no)$/.test(q) ? false : undefined;
      const r = await he(g, 'theoDoi', bat === undefined ? {} : { bat });
      g.traLoi(r.bat
        ? L('👀 **Theo dõi CT Work: BẬT** — báo nhẹ (tối đa mỗi phút một lần, chỉ khi thư mục gắn dự án): được giao thẻ, được nhắc, bình luận mới, thẻ chặn việc của bạn đã xong. Tắt: `/ctwork theo-doi off`.', '👀 **CT Work watch: ON** — gentle notices (at most once a minute, only when a project is bound): assigned, mentioned, new comments, your blocker is done. Turn off: `/ctwork watch off`.')
        : L('👀 Theo dõi CT Work: **TẮT**. Bật: `/ctwork theo-doi on`.', '👀 CT Work watch: **OFF**. Turn on: `/ctwork watch on`.'));
      return true;
    }
    case 'hoi': case 'ask': case 'qna': {
      const cau = thamSo.trim().replace(/^\S+\s*/, '');
      if (!cau) { g.datNhap('/ctwork hoi '); g.thongBao(L('Gõ câu hỏi cho giảng viên/trưởng nhóm rồi Enter (xem trước rồi mới gửi).', 'Type your question for the lecturer/lead, then Enter (preview before posting).')); return true; }
      if (await chanChiDoc(g)) return true;
      xacNhanQna(g, cau);
      return true;
    }
    case 'nhan': case 'chat': case 'say': {
      const cau = thamSo.trim().replace(/^\S+\s*/, '');
      if (!cau) { g.datNhap('/ctwork nhan '); g.thongBao(L('Gõ tin cho kênh #general rồi Enter (xem trước rồi mới gửi).', 'Type a message for #general, then Enter (preview before posting).')); return true; }
      if (await chanChiDoc(g)) return true;
      xacNhanNhom(g, cau);
      return true;
    }
    case 'tu-ghi': case 'tughi': case 'auto-write': case 'autowrite': {
      const q = ch(sau[0] ?? '');
      const bat = /^(on|bat|1|yes)$/.test(q) ? true : /^(off|tat|0|no)$/.test(q) ? false : undefined;
      const r = await he(g, 'tuGhi', bat === undefined ? {} : { bat });
      g.traLoi(r.bat
        ? L('✍ **Agent tự ghi CT Work: BẬT** — comment/log_work/transition… của agent chạy KHÔNG hỏi (kể cả chế độ thường). Tắt: `/ctwork tu-ghi off`.', '✍ **Agent auto-write to CT Work: ON** — the agent\'s comment/log_work/transition… run WITHOUT asking. Turn off: `/ctwork auto-write off`.')
        : L('✍ Agent tự ghi CT Work: **TẮT** (mặc định) — mọi thao tác GHI lên CT Work đều qua thẻ duyệt có xem trước, kể cả chế độ "Bỏ qua hết". Bật: `/ctwork tu-ghi on`.', '✍ Agent auto-write to CT Work: **OFF** (default) — every CT Work WRITE goes through a preview approval, even in "Bypass" mode. Turn on: `/ctwork auto-write on`.'));
      return true;
    }
    default:
      g.traLoi(L(`Không rõ \`/ctwork ${tach[0]}\`. Gõ \`/ctwork\` để mở menu.`, `Unknown \`/ctwork ${tach[0]}\`. Type \`/ctwork\` for the menu.`));
      return true;
  }
}

/** "1.5h" · "1h30" · "90m" · "90" ⇒ phút (bản renderer của `ctworkVe.docGio`). */
export function docGioChu(s: string): number | null {
  const t = s.trim().toLowerCase().replace(',', '.');
  let m = /^(\d+(?:\.\d+)?)(h|g)(\d+)?(m|p)?$/.exec(t);
  if (m) return Math.round(Number(m[1]) * 60 + (m[3] ? Number(m[3]) : 0)) || null;
  m = /^(\d+)(m|p|min)$/.exec(t);
  if (m) return Number(m[1]) || null;
  m = /^(\d+(?:\.\d+)?)$/.exec(t);
  if (m) { const n = Number(m[1]); return n <= 12 ? Math.round(n * 60) : Math.round(n); }
  return null;
}

// ─── Đợt 8A: quản lý MỘT máy chủ MCP (CLI thẻ lựa chọn · desktop/VS Code nút) ───────────────

/** Dòng trạng thái một server (cùng hình `AgentMcpTrangThai.server[number]`, chép lỏng). */
export interface ServerMcpUi { ten: string; ok: boolean; soTool: number; loi?: string; tat?: boolean; ngat?: boolean; dangNoi?: boolean; canDuyet?: boolean; tuDuAn?: boolean; dungSan?: boolean; soMucLuc?: number }

/** Trạng thái rõ: đã nối · N tool / đang nối / lỗi + lý do / đã ngắt / đã tắt. */
export function trangThaiMcpChu(x: ServerMcpUi, ngonNgu: 'vi' | 'en'): string {
  const L = (vi: string, en: string) => (ngonNgu === 'en' ? en : vi);
  if (x.ok) return L(`đã nối · ${x.soTool} tool${x.soMucLuc ? ` + ${x.soMucLuc} nạp khi cần` : ''}`, `connected · ${x.soTool} tool${x.soTool === 1 ? '' : 's'}${x.soMucLuc ? ` + ${x.soMucLuc} on demand` : ''}`);
  if (x.dangNoi) return L('đang nối…', 'connecting…');
  if (x.ngat) return L('đã ngắt (phiên này)', 'disconnected (this session)');
  if (x.tat) return L('đã tắt hẳn (mcp.json)', 'disabled (mcp.json)');
  if (x.canDuyet) return L('chờ bạn duyệt (.mcp.json của dự án)', 'awaiting approval (project .mcp.json)');
  return L(`lỗi: ${(x.loi ?? '?').split('\n')[0]!.slice(0, 120)}`, `error: ${(x.loi ?? '?').split('\n')[0]!.slice(0, 120)}`);
}

/** Các nút/lựa chọn cho MỘT server theo trạng thái. CT Work có thêm: đổi dự án · đổi quyền · bỏ gắn · đăng xuất. */
export function hanhDongMcp(x: ServerMcpUi, ngonNgu: 'vi' | 'en'): MucChon[] {
  const L = (vi: string, en: string) => (ngonNgu === 'en' ? en : vi);
  const ds: MucChon[] = [];
  const ctw = x.ten === 'ctwork';
  if (x.ok) {
    ds.push(ctw
      ? { nhan: L('Ngắt (phiên này)', 'Disconnect (this session)'), giaTri: 'ngat', mo: L('mở lại CuongMini là nối lại — muốn bỏ hẳn: Đăng xuất CT Work', 'reconnects next launch — to remove it: Sign out of CT Work') }
      : { nhan: L('Ngắt kết nối', 'Disconnect'), giaTri: 'ngat', mo: L('trong phiên này — mcp.json không đổi', 'this session only — mcp.json unchanged') });
    ds.push({ nhan: L('Kết nối lại', 'Reconnect'), giaTri: 'noiLai', mo: L('chỉ server này', 'this server only') });
  } else if (x.ngat || x.tat) {
    ds.push({ nhan: L('Kết nối', 'Connect'), giaTri: 'noi', ...(x.tat ? { mo: L('bật lại trong mcp.json', 're-enable in mcp.json') } : {}) });
  } else if (!x.canDuyet) {
    ds.push({ nhan: L('Kết nối lại', 'Reconnect'), giaTri: 'noiLai', mo: L('chỉ server này', 'this server only') });
  }
  /* 20/10/2026: CT Work KHÔNG có "Tắt hẳn" — cờ disabled trong mcp.json sống mãi và trông như "mở lại là mất kết nối".
     Bỏ hẳn = Đăng xuất CT Work (thu hồi token). */
  if (!x.tat && !x.tuDuAn && !ctw) ds.push({ nhan: L('Tắt hẳn', 'Disable'), giaTri: 'tatHan', mo: L('ghi "disabled" vào mcp.json', 'writes "disabled" to mcp.json') });
  if (ctw) {
    ds.push({ nhan: L('Đổi dự án đang gắn', 'Change bound project'), giaTri: 'ctwDuAn' });
    ds.push({ nhan: L('Đổi quyền (đọc ↔ đọc + ghi)', 'Change access (read ↔ read + write)'), giaTri: 'ctwQuyen', mo: L('cấp lại token một chạm', 'one-tap token reissue') });
    ds.push({ nhan: L('Bỏ gắn thư mục', 'Unbind this folder'), giaTri: 'ctwBoGan' });
    ds.push({ nhan: L('Đăng xuất CT Work', 'Sign out of CT Work'), giaTri: 'ctwDangXuat', mo: L('thu hồi token trên máy này', 'revokes the token on this machine') });
  }
  return ds;
}

/**
 * Làm một hành động của `hanhDongMcp`. Trả câu báo (song ngữ) — giao diện vẽ lại danh sách sau đó. Hành động CT Work
 * mở thẻ riêng (chọn dự án, chọn quyền, xác nhận đăng xuất) qua `g.chon`.
 */
export async function lamHanhDongMcp(g: GiaoDienCtw, ten: string, giaTri: string): Promise<string | null> {
  const L = Lg(g);
  if (giaTri === 'ngat' || giaTri === 'noiLai' || giaTri === 'noi' || giaTri === 'tatHan') {
    if (giaTri !== 'ngat' && giaTri !== 'tatHan') g.thongBao(L(`Đang nối ${ten}…`, `Connecting ${ten}…`));
    const r = await g.goi<{ ok: boolean; loi?: string }>('agent:mcpServer', { ten, viec: giaTri }).catch((e: Error) => ({ ok: false, loi: e.message }));
    g.lamMoiDong?.();
    if (!r?.ok) return `⚠ ${ten}: ${r?.loi ?? L('lõi cũ chưa hỗ trợ', 'not supported by this core')}`;
    return giaTri === 'ngat' ? L(`✓ Đã ngắt ${ten} trong phiên này (mcp.json không đổi).`, `✓ Disconnected ${ten} for this session (mcp.json unchanged).`)
      : giaTri === 'tatHan' ? L(`✓ Đã tắt hẳn ${ten} (mcp.json).`, `✓ Disabled ${ten} (mcp.json).`)
        : L(`✓ Đã nối ${ten}.`, `✓ Connected ${ten}.`);
  }
  if (giaTri === 'ctwDuAn') { await chonDuAn(g); return null; }
  if (giaTri === 'ctwBoGan') { await lenhCtwork('/ctwork', 'bo-gan', g); return null; }
  if (giaTri === 'ctwQuyen') {
    g.chon({
      tieuDe: L('Quyền của CuongMini trên CT Work', 'CuongMini access to CT Work'),
      moTa: L('Cấp lại token bằng tài khoản đang đăng nhập — mỗi lần ghi vẫn hỏi duyệt.', 'Reissues the token with your signed-in account — every write still asks.'),
      ds: [{ nhan: L('Đọc + ghi', 'Read + write'), giaTri: 'ghi', mo: L('khuyên dùng', 'recommended') }, { nhan: L('Chỉ đọc', 'Read only'), giaTri: 'doc' }, { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' }],
      khiChon: async (v) => { if (v === 'doc' || v === 'ghi') await ketNoi(g, v); },
    });
    return null;
  }
  if (giaTri === 'ctwDangXuat') {
    g.chon({
      tieuDe: L('Đăng xuất CT Work trên máy này?', 'Sign out of CT Work on this machine?'),
      moTa: L('Thu hồi token, xoá khỏi kho bí mật, gỡ server `ctwork`. Gắn thư mục giữ nguyên; nối lại bằng /ctwork.', 'Revokes the token, removes it from the secret store and drops the `ctwork` server. Folder bindings stay; reconnect with /ctwork.'),
      ds: [{ nhan: L('Đăng xuất', 'Sign out'), giaTri: 'co' }, { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy', so: '0' }],
      khiChon: async (v) => { if (v === 'co') await lenhCtwork('/ctwork', 'off', g); },
    });
    return null;
  }
  return null;
}
