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
  ok: boolean; loi?: string; md?: string; hoi?: 'ketNoi' | 'capLai' | 'ganDuAn' | null;
  doan?: { key: string; projectId: number | null; workspaceId: number | null; workspace: string | null } | null;
  gan?: { key: string; projectId: number | null; workspaceId: number | null; ref?: string; ten?: string | null; workspace?: string | null } | null;
  ds?: Array<{ key: string; ten: string; id: number | null; workspaceId: number | null; workspace: string | null; vaiTro: string | null; soMo: number | null }>;
  dsThe?: Array<{ key: string; title: string; status: string | null; dueDate: string | null }>;
  dong?: DongCtw | null;
  duong?: string; goiYGitignore?: string | null;
  key?: string; tieuDe?: string; trangThai?: string | null; chuyenDuoc?: string[];
  nhanh?: string; nhanhCo?: boolean; nhanhNay?: string | null; den?: string | null; daDangLam?: boolean; chiDoc?: boolean; noiDung?: string; bat?: boolean;
}
export interface DongCtw {
  key: string; projectId: number | null; ten: string | null; nhanh: string | null; daNoi: boolean; loi: string | null;
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

/** Lỗi xác thực CT Work (token hết hạn / bị thu hồi) trong chữ lỗi lõi trả về. */
export const laLoiXacThucCtw = (chu: string | null | undefined): boolean => /\b(401|403)\b|unauthori[sz]ed|invalid[_ ]token|token (?:revoked|expired|invalid)|hết hạn|thu hồi/i.test(chu ?? '');

export async function hoiCtworkMotLan(g: GiaoDienCtw): Promise<boolean> {
  const L = Lg(g);
  const r = await he(g, 'goiY');
  if (!r.ok || !r.hoi) return false;
  if (r.hoi === 'capLai' && boQuaCapLai) return false;
  if (r.hoi === 'ketNoi') {
    g.chon({
      tieuDe: L('Kết nối CT Work?', 'Connect CT Work?'),
      moTa: L('CuongMini dùng chính tài khoản cuongthai.com đang đăng nhập để đọc thẻ, sprint, việc của bạn — không phải cấu hình MCP. Token tự tạo, cất trên máy này (kho bí mật của app, ở CLI là file chỉ bạn đọc được); AI không bao giờ thấy nó.',
        'CuongMini uses your signed-in cuongthai.com account to read your issues, sprints and work — no MCP setup. The token is created for you and kept on this machine (the app\'s secret store; in the CLI a file only you can read); the AI never sees it.'),
      ds: [
        { nhan: L('Có — chỉ đọc', 'Yes — read only'), giaTri: 'doc', mo: L('khuyên dùng', 'recommended') },
        { nhan: L('Có — đọc + ghi', 'Yes — read + write'), giaTri: 'ghi', mo: L('ghi vẫn hỏi duyệt từng lần', 'every write still asks') },
        { nhan: L('Không, đừng hỏi lại', "No, don't ask again"), giaTri: 'khong', mo: L('vẫn gõ /ctwork được', 'you can still type /ctwork') },
      ],
      khiChon: async (v) => {
        await he(g, 'daHoi', { loai: 'ketNoi' });
        if (v === 'khong') return;
        await ketNoi(g, v === 'ghi' ? 'ghi' : 'doc');
        await hoiCtworkMotLan(g);
      },
      khiHuy: () => { void he(g, 'daHoi', { loai: 'ketNoi' }); },
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
  if (r.hoi === 'ganDuAn' && r.doan) {
    const d = r.doan;
    g.chon({
      tieuDe: L(`Gắn thư mục này với dự án CT Work ${d.key}${d.projectId ? ` (id ${d.projectId})` : ''}?`, `Bind this folder to CT Work project ${d.key}${d.projectId ? ` (id ${d.projectId})` : ''}?`),
      moTa: L(`Đoán từ AGENTS.md${d.workspace ? ` · không gian "${d.workspace}"` : ''}. Gắn rồi thì dòng trạng thái hiện sprint/thẻ, và gõ ${d.key}-123 là CuongMini tự đọc thẻ đó.`,
        `Guessed from AGENTS.md${d.workspace ? ` · workspace "${d.workspace}"` : ''}. Once bound, the status line shows the sprint/issue and typing ${d.key}-123 makes CuongMini read that issue.`),
      ds: [
        { nhan: L(`Đúng — gắn ${d.key}`, `Yes — bind ${d.key}`), giaTri: 'gan' },
        { nhan: L('Chọn dự án khác…', 'Pick another project…'), giaTri: 'chon' },
        { nhan: L('Không', 'No'), giaTri: 'khong', so: '0' },
      ],
      khiChon: async (v) => {
        await he(g, 'daHoi', { loai: 'ganDuAn' });
        if (v === 'chon') { await chonDuAn(g); return; }
        if (v !== 'gan') return;
        const ds = await he(g, 'dsDuAn');
        const p = ds.ds?.find((x) => (d.projectId && x.id === d.projectId) || x.key.split('/').pop() === d.key);
        await gan(g, p ?? { key: d.key, ten: '', id: d.projectId, workspaceId: d.workspaceId, workspace: d.workspace, vaiTro: null, soMo: null });
      },
      khiHuy: () => { void he(g, 'daHoi', { loai: 'ganDuAn' }); },
    });
    return true;
  }
  return false;
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

async function gan(g: GiaoDienCtw, p: NonNullable<RaCtw['ds']>[number]): Promise<void> {
  const L = Lg(g);
  const r = await he(g, 'gan', { duAn: { key: p.key, id: p.id, workspaceId: p.workspaceId, ...(p.ten ? { ten: p.ten } : {}), workspace: p.workspace } });
  if (!r.ok) { g.thongBao(`⚠ ${r.loi ?? '?'}`, 'loi'); return; }
  const key = r.gan?.key ?? p.key;
  g.traLoi(`${L(`✓ Đã gắn thư mục với dự án **${key}**${p.id ? ` (id ${p.id})` : ''}${p.ten ? ` — ${p.ten}` : ''}.`, `✓ Bound this folder to project **${key}**${p.id ? ` (id ${p.id})` : ''}${p.ten ? ` — ${p.ten}` : ''}.`)}\n\n${L('Lưu ở', 'Saved in')} \`${r.duong ?? '.cuongmini/ctwork.json'}\`.${r.goiYGitignore ? `\n\n_${r.goiYGitignore}_` : ''}`);
  g.lamMoiDong?.();
}

/** Chọn dự án (`list_projects`) ⇒ gắn thư mục. */
export async function chonDuAn(g: GiaoDienCtw): Promise<void> {
  const L = Lg(g);
  const r = await he(g, 'dsDuAn');
  if (!r.ok) { g.traLoi(`⚠ ${r.loi ?? '?'}`); return; }
  const ds = r.ds ?? [];
  if (!ds.length) { g.traLoi(L('Token này không thấy dự án CT Work nào.', 'This token sees no CT Work project.')); return; }
  const cu = await he(g, 'docGan');
  g.chon({
    tieuDe: L('Chọn dự án CT Work cho thư mục này', 'Pick the CT Work project for this folder'),
    ...(cu.gan ? { moTa: L(`Đang gắn: ${cu.gan.key}${cu.gan.projectId ? ` (id ${cu.gan.projectId})` : ''}`, `Currently bound: ${cu.gan.key}${cu.gan.projectId ? ` (id ${cu.gan.projectId})` : ''}`) } : {}),
    ds: [
      ...ds.slice(0, 30).map((p) => ({ nhan: `${p.key} — ${p.ten}`, giaTri: p.key, mo: [p.workspace, p.soMo != null ? L(`${p.soMo} thẻ mở`, `${p.soMo} open`) : ''].filter(Boolean).join(' · ') })),
      ...(cu.gan ? [{ nhan: L('Bỏ gắn thư mục này', 'Unbind this folder'), giaTri: '__bo' }] : []),
      { nhan: L('Thoát', 'Exit'), giaTri: '__thoat', so: '0', mo: 'Esc' },
    ],
    khiChon: async (v) => {
      if (v === '__bo') { await he(g, 'boGan'); g.thongBao(L('Đã bỏ gắn dự án CT Work.', 'Unbound the CT Work project.'), 'ok'); g.lamMoiDong?.(); return; }
      if (v === '__thoat') return;
      const p = ds.find((x) => x.key === v);
      if (p) await gan(g, p);
    },
  });
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
      { nhan: L('Bắt đầu làm thẻ này', 'Start working on it'), giaTri: 'bd', mo: L('nhánh + In Progress', 'branch + In Progress') },
      { nhan: L('Ghi giờ…', 'Log time…'), giaTri: 'gio' },
      { nhan: L('Bình luận bằng chứng', 'Post evidence comment'), giaTri: 'bl', mo: L('soạn từ git', 'drafted from git') },
      { nhan: L('Hỏi CuongMini về thẻ này', 'Ask CuongMini about it'), giaTri: 'hoi' },
      { nhan: L('Đóng', 'Close'), giaTri: 'thoat', so: '0' },
    ],
    khiChon: async (v) => {
      const k = r.key ?? key;
      if (v === 'bd') await batDau(g, k);
      else if (v === 'gio') g.datNhap(`/ctwork gio ${k} `);
      else if (v === 'bl') await binhLuan(g, k);
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

/** Menu `/ctwork` đánh số (1–9, 0 Thoát) — đã kết nối. */
export async function menuCtwork(g: GiaoDienCtw): Promise<void> {
  const L = Lg(g);
  const [d, t] = await Promise.all([he(g, 'dong'), g.goi<{ server?: { ok: boolean; soTool: number } | null; quyen?: string | null; bienTay?: boolean; coGhi?: boolean | null }>('agent:ctwork', { viec: 'trangThai' }).catch(() => null)]);
  const canGhi = t?.coGhi === false ? L('cần quyền ghi — /ctwork ghi', 'needs write access — /ctwork write') : null;
  const dong = veDongCtw(d.dong, g.ngonNgu, 200);
  const quyen = t?.bienTay ? L('token từ biến CTWORK_TOKEN', 'token from CTWORK_TOKEN') : t?.quyen === 'ghi' ? L('đọc + ghi', 'read + write') : L('chỉ đọc', 'read only');
  const coGan = Boolean(d.dong);
  g.chon({
    tieuDe: 'CT Work',
    moTa: `${dong || L('Thư mục này chưa gắn dự án — chọn mục 9.', 'This folder is not bound to a project — pick 9.')}\n${L('Kết nối', 'Connection')}: ${t?.server?.ok ? `✔ ${t.server.soTool} ${L('tool', t.server.soTool === 1 ? 'tool' : 'tools')} · ${quyen}` : L('chưa nối', 'not connected')} · ${L('đổi', 'change')}: /ctwork ${L('ket-noi', 'connect')}`,
    ds: [
      { nhan: L('Sprint hiện tại', 'Current sprint'), giaTri: 'sprint', mo: L('bảng thẻ theo cột trạng thái', 'board by status column'), ...(coGan ? {} : { tat: true }) },
      { nhan: L('Việc của tôi', 'My work'), giaTri: 'viec', mo: L('hạn gần lên đầu', 'nearest due first'), ...(coGan ? {} : { tat: true }) },
      { nhan: L('Mở thẻ…', 'Open an issue…'), giaTri: 'the', mo: `${d.dong?.key ?? 'LF'}-xx`, ...(coGan ? {} : { tat: true }) },
      { nhan: L('Bắt đầu làm thẻ…', 'Start an issue…'), giaTri: 'batDau', mo: L('nhánh + In Progress, có duyệt', 'branch + In Progress, approved first'), ...(coGan ? {} : { tat: true }) },
      { nhan: L('Ghi giờ…', 'Log work…'), giaTri: 'gio', mo: canGhi ?? 'log_work', ...(coGan ? {} : { tat: true }) },
      { nhan: L('Bình luận bằng chứng', 'Evidence comment'), giaTri: 'binhLuan', mo: canGhi ?? L('soạn từ git, xem trước rồi gửi', 'drafted from git, preview first'), ...(coGan ? {} : { tat: true }) },
      { nhan: L('Báo cáo tuần', 'Weekly report'), giaTri: 'baoCao', ...(canGhi ? { mo: canGhi } : {}), ...(coGan ? {} : { tat: true }) },
      { nhan: L('Họp', 'Meetings'), giaTri: 'hop', mo: 'meeting_list', ...(coGan ? {} : { tat: true }) },
      { nhan: L('Chọn dự án', 'Pick project'), giaTri: 'duAn', mo: d.dong ? L(`đang: ${d.dong.key}`, `now: ${d.dong.key}`) : L('gắn thư mục ⇄ dự án', 'bind folder ⇄ project') },
      { nhan: L('Thoát', 'Exit'), giaTri: 'thoat', so: '0', mo: 'Esc' },
    ],
    khiChon: async (v) => {
      switch (v) {
        case 'sprint': await xem(g, 'sprint'); return;
        case 'viec': await xem(g, 'viec'); return;
        case 'the': await chonThe(g, L('Mở thẻ nào?', 'Open which issue?'), (k) => moThe(g, k), '/issue '); return;
        case 'batDau': await chonThe(g, L('Bắt đầu làm thẻ nào?', 'Start which issue?'), (k) => batDau(g, k), '/ctwork bat-dau '); return;
        case 'gio': if (await chanChiDoc(g)) return; await chonThe(g, L('Ghi giờ vào thẻ nào?', 'Log work on which issue?'), (k) => { g.datNhap(`/ctwork gio ${k} `); g.thongBao(L(`Gõ thời gian rồi Enter, vd: 1.5h đọc tài liệu JWT`, `Type the time then Enter, e.g. 1.5h read JWT docs`)); }, '/ctwork gio '); return;
        case 'binhLuan': await binhLuan(g); return;
        case 'baoCao': await baoCao(g); return;
        case 'hop': await xem(g, 'hop'); return;
        case 'duAn': await chonDuAn(g); return;
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
      { nhan: L('Chỉ đọc', 'Read only'), giaTri: 'doc', mo: L('khuyên dùng', 'recommended'), ...(t?.server?.ok && t.quyen === 'doc' ? { tat: true } : {}) },
      { nhan: L('Đọc + ghi', 'Read + write'), giaTri: 'ghi', ...(t?.server?.ok && t.quyen === 'ghi' ? { tat: true } : {}) },
      ...(t?.canCapLai ? [{ nhan: L('Cấp lại token', 'Renew the token'), giaTri: 'capLai' }] : []),
      ...(t?.server?.ok ? [{ nhan: tu.bat ? L('Tắt "agent tự ghi"', 'Turn agent auto-write off') : L('Bật "agent tự ghi" (không hỏi khi ghi)', 'Turn agent auto-write on (no prompt on writes)'), giaTri: tu.bat ? 'tuGhiTat' : 'tuGhiBat' }] : []),
      ...(t?.server ? [{ nhan: L('Ngắt kết nối', 'Disconnect'), giaTri: 'off', mo: L('thu hồi token', 'revokes the token') }] : []),
      { nhan: L('Thoát', 'Exit'), giaTri: 'thoat', so: '0', mo: 'Esc' },
    ],
    khiChon: async (v) => {
      if (v === 'doc' || v === 'ghi') { await ketNoi(g, v); return; }
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
 * Con của `/ctwork`: doc|ghi|off · ket-noi · cap-lai · du-an [KEY] · sprint · viec · the <KEY> · bat-dau <KEY> ·
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
    case 'doc': case 'read': await ketNoi(g, 'doc'); return true;
    case 'ghi': case 'write': await ketNoi(g, 'ghi'); return true;
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
