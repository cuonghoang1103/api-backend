/**
 * LỆNH `/` của CuongMini CLI — cùng bộ lệnh với app desktop và extension VS
 * Code (`webview/lenh.ts`); phần thuần (danh sách, khớp bí danh, dựng câu trả
 * lời) lấy THẲNG từ `lenhGach.ts` của app qua alias `ct-lenh`.
 *
 * ⛔ Lệnh chạy CỤC BỘ không tốn lượt: chúng đọc trạng thái sẵn có hoặc hỏi một
 * route rẻ. Chỉ `/plan`, `/review`, `/init`, `/diff` (và lệnh của dự án) là
 * câu hỏi cho agent — chúng CẦN agent đọc mã.
 */
import { doTerminalPhim } from './banPhim';
import { existsSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  LENH_AGENT, PROMPT_DUYET_KE_HOACH, PROMPT_INIT, chonPhien, dsCauHoi, layUsage, locPhien, moTaChanDoan,
  moTaDsCauHoi, moTaDsPhien, moTaNguCanh, moTaTrangThai, moTaUsage, promptPlan, promptReview, tachLenh,
  tenFileXuat, timMuc, timTheoChu, xuatMarkdown, type LenhGach, type MucGhi, type PhienCu,
} from 'ct-lenh';
// Đợt 5: bộ lệnh CT Work chung ba nơi (file thuần của app, không React) — import thẳng đường dẫn để tsc kiểm kiểu.
import { lenhCtwork, type GiaoDienCtw } from '../../../desktop/src/renderer/features/chat/ctworkLenh';
import { moTaCheDo } from './cheDo';
import { mau, mo } from './mau';
import { L, ngonNgu, nhieu } from './i18n';
import { LENH_CLI, troGiup, troGiupGon } from './lenhMoTa';
import { chanDoanEn, dichLoiMcp, dsCauHoiEn, dsPhienEn, nguCanhEn, trangThaiEn, usageEn, type NguCanhEn } from './moTaHaiNgu';
import { dichMoTaCho } from './trangThai';
import { moModel } from './congModel';
import { API_ORIGIN } from '../../cuongmini-core/src/dangNhap';
import { LOI_KHONG_CO_TRINH_DUYET, timTrinhDuyet } from '../../cuongmini-core/src/timTrinhDuyet';
import { caiVsCode, doTerminal, HUONG_DAN } from './caiTerminal';
import { kiemMay } from './doctor';
import { chepChu, lenhMoTay } from './heThong';
import type { KetNoiLoi } from './ketNoi';
import type { KhoChat } from './kho';

export interface ModelMuc {
  id: string; ten: string; mo: string; dungDuoc: boolean; dat?: boolean;
  cong?: 'rambo' | 'modelapi' | 'anthropic'; canMoKhoa?: boolean; mienPhi?: boolean; hang?: 'free' | 'cao';
  /** 18/10/2026: mô tả tiếng Anh, tên cổng hiển thị (CuongMini …), loại khoá. */
  moEn?: string; nhom?: string; khoa?: 'free' | 'chung' | 'invisible'; loaiKhoa?: 'chung' | 'invisible';
}
export interface MucNoLuc { id: string; ten: string; mo: string }

export { LENH_CLI };

/** Lệnh hiện trong gợi ý `/` (bỏ `/offline` — AI ngoại tuyến chỉ có trong app). */
export const LENH_GOI_Y: LenhGach[] = [...LENH_AGENT.filter((l) => l.ten !== '/offline'), ...(LENH_CLI as LenhGach[])];

/** Chỉ khi máy chủ CŨ chưa khai `models` — máy chủ mới gửi bảng CuongMini (18/10/2026). */
export const MODEL_DU_PHONG: ModelMuc[] = [
  { id: 'cm-solid', ten: 'CuongMini Solid', get mo() { return L('Mặc định', 'Default'); }, dungDuoc: true },
];
export const MUC_DU_PHONG: MucNoLuc[] = [
  { id: 'thap', get ten() { return L('Thấp', 'Low'); }, get mo() { return L('hỏi nhanh', 'quick questions'); } },
  { id: 'vua', get ten() { return L('Vừa', 'Medium'); }, get mo() { return L('mặc định', 'default'); } },
  { id: 'cao', get ten() { return L('Cao', 'High'); }, get mo() { return L('đọc rộng, tự test', 'reads widely, self-tests'); } },
  { id: 'ratCao', get ten() { return L('Rất cao', 'Very high'); }, get mo() { return L('nhiều agent phụ', 'many subagents'); } },
  { id: 'toiDa', get ten() { return L('Tối đa', 'Max'); }, get mo() { return L('việc rất lớn', 'very large tasks'); } },
];

/** Tên mức nỗ lực do máy chủ khai (tiếng Việt) ⇒ tiếng Anh khi giao diện English. */
export function tenMuc(id: string, tenMayChu: string): string {
  const m = MUC_DU_PHONG.find((x) => x.id === id);
  if (ngonNgu() === 'vi') return tenMayChu;
  return m?.ten ?? (id === 'ultracode' ? 'Ultracode' : tenMayChu);
}

export { doiTenModel, moModel, NHOM_CONG, nhomCong, tenModel, tenNhomCong, type NhomCong } from './congModel';

export interface BoiCanhLenh {
  kho: KhoChat;
  kn: KetNoiLoi;
  thuMuc: string;
  phienBan: string;
  guiThat: (text: string, o: { chiDoc?: boolean; hienThi?: string }) => void;
  doiModel: (id: string) => Promise<void>;
  doiMuc: (id: string) => Promise<void>;
  doiCheDo: (id: string) => Promise<void>;
  dsModel: () => ModelMuc[];
  dsMuc: () => MucNoLuc[];
  moMenu: (loai: 'model' | 'muc' | 'resume' | 'cheDo' | 'config' | 'rewind' | 'banGhi' | 'tasks' | 'ngonNgu' | 'cong' | 'ctwork') => void;
  /**
   * Đợt 4 — THẺ LỰA CHỌN cho lệnh `/` có hành động (kiểu `/mcp` của Claude Code): khối nội dung + lựa chọn đánh số
   * (↑↓ + Enter hoặc gõ số, Esc thoát). Thay cho dòng "gõ `/x y` để…".
   */
  chon: (o: {
    tieuDe: string; moTa?: string; than?: string; ds: Array<{ nhan: string; giaTri: string; mo?: string; tat?: boolean; so?: string }>; khiChon: (giaTri: string) => void | Promise<void>;
    /** Đợt 5: khối MARKDOWN (thẻ CT Work, bảng sprint, xem trước) — giao diện tự vẽ theo bề ngang. */
    thanMd?: string;
    khiHuy?: () => void;
  }) => void;
  /** Đợt 5: đọc lại dòng trạng thái CT Work (sau khi gắn dự án / tạo nhánh / chuyển thẻ). */
  lamMoiCtwork?: () => void;
  /** Chọn một model 🔒 của cổng chính hãng: hỏi mật khẩu ⇒ mở khoá ⇒ đổi model. */
  moKhoaModel: (id: string) => void;
  /** /fullscreen on|off — không tham số thì đảo. */
  datToanManHinh: (bat?: boolean) => void;
  /** /mouse on|off — bắt chuột ở toàn màn hình (mặc định tắt để bôi đen chép tự nhiên). */
  datChuot: (bat?: boolean) => void;
  /** Đổi ngôn ngữ giao diện ngay (vẽ lại toàn bộ màn hình) và lưu cài đặt. */
  doiNgonNgu: (n: 'vi' | 'en') => void;
  /** Đổi theme ngay (vẽ lại màn hình) và lưu cài đặt. */
  doiTheme: (t: 'tuDong' | 'toi' | 'sang') => void;
  datNhap: (t: string) => void;
  xoaManHinh: () => void;
  dangXuat: () => Promise<void>;
  dangNhapLai: () => void;
  thoat: () => void;
}

/** Báo kết quả mở file cấu hình: mở được ⇒ đường dẫn; không ⇒ đường dẫn + lệnh mở tay. */
function baoMoFile(b: BoiCanhLenh, ten: string): void {
  const m = b.kn.moCuoi;
  if (m?.ok) { b.kho.thongBao(L(`Đã mở file ${ten}: ${m.duong}`, `Opened the ${ten}: ${m.duong}`), 'ok'); return; }
  if (m) { b.kho.traLoi(L(`Không tự mở được file ${ten}. Mở tay:\n\n\`\`\`\n${lenhMoTay(m.duong)}\n\`\`\`\n\nĐường dẫn: \`${m.duong}\``, `Could not open the ${ten} automatically. Open it yourself:\n\n\`\`\`\n${lenhMoTay(m.duong)}\n\`\`\`\n\nPath: \`${m.duong}\``)); return; }
  b.kho.thongBao(L(`Đã yêu cầu mở file ${ten}.`, `Asked to open the ${ten}.`));
}

/** Đợt 5: giao diện cho bộ lệnh CT Work CHUNG (`ctworkLenh.ts` của app) — thẻ lựa chọn, câu trả lời, ô nhập. */
export function giaoDienCtw(b: BoiCanhLenh): GiaoDienCtw {
  return {
    goi: <T,>(k: string, d?: Record<string, unknown>) => b.kn.goi<T>(k, d ?? {}),
    traLoi: (md) => b.kho.traLoi(md),
    chon: (o) => b.chon({
      tieuDe: o.tieuDe, ...(o.moTa ? { moTa: o.moTa } : {}), ...(o.than ? { thanMd: o.than } : {}),
      ds: o.ds, khiChon: o.khiChon, ...(o.khiHuy ? { khiHuy: o.khiHuy } : {}),
    }),
    // Thông báo 'ok' đã có dấu ✓ của bảng ghi — bỏ ✓ đầu câu để khỏi "✓ ✓".
    thongBao: (t, loai) => b.kho.thongBao(loai === 'ok' ? t.replace(/^✓\s*/, '') : t, loai === 'loi' ? 'loi' : loai === 'ok' ? 'ok' : 'info'),
    datNhap: b.datNhap,
    ngonNgu: ngonNgu(),
    ...(b.lamMoiCtwork ? { lamMoiDong: b.lamMoiCtwork } : {}),
  };
}

export function tachLenhCli(text: string): { ten: string; thamSo: string } | null {
  return tachLenh(text, [...LENH_AGENT, ...(LENH_CLI as LenhGach[])]);
}

/** Lỗi worktree của lõi (`desktop/.../worktree.ts`, tiếng Việt) ⇒ tiếng Anh khi giao diện English. */
const LOI_WORKTREE_EN = new Map<string, string>([
  ['Thư mục này không phải kho git (hoặc máy chưa cài git).', 'This folder is not a git repository (or git is not installed).'],
  ['Tên không hợp lệ. Dùng chữ, số, dấu gạch ngang.', 'Invalid name. Use letters, digits and dashes.'],
  ['Repo chưa có commit nào — hãy commit lần đầu rồi mới tạo worktree.', 'The repo has no commits yet — make a first commit before creating a worktree.'],
  ['Không tạo được worktree.', 'Could not create the worktree.'],
  ['Không tìm thấy kho git.', 'No git repository found.'],
  ['Không có worktree nào ở đường dẫn đó.', 'There is no worktree at that path.'],
  ['Đây là cây làm việc chính, không xoá được.', 'That is the main working tree — it cannot be removed.'],
  ['Worktree này không do app tạo — hãy xoá bằng git để tránh nhầm.', 'This worktree was not created by CuongMini — remove it with git to avoid mistakes.'],
  ['Worktree còn thay đổi chưa commit. Hãy commit hoặc bỏ chúng trước — app cố ý KHÔNG xoá ép.', 'The worktree has uncommitted changes. Commit or discard them first — CuongMini never force-removes.'],
  ['Không xoá được worktree.', 'Could not remove the worktree.'],
]);
export function dichLoiWorktree(loi: string): string {
  const daCo = /^Đã có worktree hoặc nhánh tên "(.*)"\. Chọn tên khác\.$/.exec(loi);
  return L(loi, daCo ? `A worktree or branch named "${daCo[1]}" already exists. Pick another name.` : LOI_WORKTREE_EN.get(loi) ?? loi);
}

// ─── Đợt 4: trình bày kiểu Claude Code cho thẻ lựa chọn ────────────────
const XANH = '#4ade80';
const DO = '#f87171';
const VANG_NHAT = '#fbbf24';
/** Một dòng "tên ⟶ trạng thái" thụt 2, tên căn cột. */
function dongCot(ten: string, beTen: number, phai: string): string { return `  ${ten.padEnd(beTen)}  ${phai}`; }
/** Dòng phụ mờ dạng cây `⎿`. */
const cay = (s: string): string => mo(`  ⎿ ${s}`);

type McpTT = { duongDan: string; server: Array<{ ten: string; ok: boolean; soTool: number; loi?: string; canDuyet?: boolean; tat?: boolean; kieu?: string; tuDuAn?: boolean }>; loiCauHinh?: string | null } | null;

/** Khối danh sách server MCP (đã tô màu). */
export function veMcp(tt: McpTT): string {
  const sv = tt?.server ?? [];
  const be = Math.min(24, Math.max(6, ...sv.map((x) => x.ten.length)));
  const dong = sv.length
    ? sv.map((x) => dongCot(x.ten, be, x.ok
      ? `${mau(XANH)('✔')} ${L('đã nối', 'connected')} ${mo(`· ${x.soTool} ${L('tool', x.soTool === 1 ? 'tool' : 'tools')}${x.kieu ? ` · ${x.kieu}` : ''}${x.tuDuAn ? L(' · của dự án', ' · project') : ''}${(x as { dungSan?: boolean }).dungSan ? L(' · dựng sẵn', ' · built-in') : ''}`)}`
      : x.tat ? mo(`○ ${L('đã tắt', 'disabled')}`)
        : x.canDuyet ? `${mau(VANG_NHAT)('⏸')} ${L('chờ bạn duyệt (.mcp.json của dự án)', 'awaiting approval (project .mcp.json)')}`
          : `${mau(DO)('✘')} ${mo(dichLoiMcp(x.loi ?? L('lỗi', 'failed')).split('\n')[0]!.slice(0, 70))}`))
    : [mo(L('  (chưa cấu hình máy chủ nào)', '  (no servers configured)'))];
  return [...dong, ...(tt?.loiCauHinh ? ['', `  ${mau(DO)('⚠')} ${L('File cấu hình hỏng', 'Config file is broken')}: ${tt.loiCauHinh}`] : []), '', cay(tt?.duongDan ?? '?')].join('\n');
}

async function menuMcp(b: BoiCanhLenh, baoDau = ''): Promise<void> {
  const { kn, kho } = b;
  const tt = await kn.goi<McpTT>('agent:mcpTrangThai').catch(() => null);
  const ct = await kn.goi<{ server?: { ok: boolean } | null }>('agent:ctwork', { viec: 'trangThai' }).catch(() => null);
  b.chon({
    tieuDe: L('Máy chủ MCP', 'MCP servers'),
    ...(baoDau ? { moTa: baoDau } : {}),
    than: veMcp(tt),
    ds: [
      { nhan: L('Mở file cấu hình', 'Open config file'), giaTri: 'mo', mo: L('sửa rồi chọn Nạp lại', 'edit, then Reload') },
      { nhan: L('Nạp lại', 'Reload'), giaTri: 'nap', mo: L('khởi động lại mọi server', 'restart every server') },
      { nhan: ct?.server?.ok ? L('CT Work: đổi quyền / ngắt', 'CT Work: change access / disconnect') : L('Kết nối CT Work', 'Connect CT Work'), giaTri: 'ctwork', mo: L('một chạm, token cất trên máy', 'one tap, token kept on this machine') },
      { nhan: L('Xem tool / bật-tắt một server', 'View tools / enable-disable a server'), giaTri: 'server', ...((tt?.server ?? []).length ? {} : { tat: true }) },
      { nhan: L('Thoát', 'Exit'), giaTri: 'thoat', mo: 'Esc' },
    ],
    khiChon: async (g) => {
      if (g === 'mo') { kn.moCuoi = null; await kn.goi('agent:mcpMoCauHinh'); baoMoFile(b, L('cấu hình MCP', 'MCP config')); return; }
      // QA 5c: nạp lại / bật-tắt server ⇒ dòng trạng thái CT Work đọc lại ngay (trước đây đứng "chưa nối" tới 60 s).
      if (g === 'nap') { kho.thongBao(L('Đang nạp lại MCP…', 'Reloading MCP…')); await kn.goi('agent:mcpNapLai').catch(() => undefined); b.lamMoiCtwork?.(); await menuMcp(b, L('✓ Đã nạp lại cấu hình MCP.', '✓ MCP config reloaded.')); return; }
      if (g === 'ctwork') { await chayLenh('/ctwork', b); return; }
      if (g === 'server') { menuChonServer(b, tt); }
    },
  });
}

function menuChonServer(b: BoiCanhLenh, tt: McpTT): void {
  const sv = tt?.server ?? [];
  b.chon({
    tieuDe: L('Chọn máy chủ MCP', 'Pick an MCP server'),
    ds: [...sv.map((x) => ({ nhan: x.ten, giaTri: x.ten, mo: x.ok ? `${x.soTool} ${L('tool', 'tools')}` : x.tat ? L('đã tắt', 'disabled') : L('lỗi', 'failed') })), { nhan: L('← Quay lại', '← Back'), giaTri: '__lai' }],
    khiChon: async (ten) => {
      if (ten === '__lai') { await menuMcp(b); return; }
      const x = sv.find((y) => y.ten === ten);
      const tool = x?.ok ? await b.kn.goi<Array<{ ten: string; moTa: string }>>('agent:mcpTool', { ten }).catch(() => null) ?? [] : [];
      b.chon({
        tieuDe: `MCP · ${ten}`,
        than: tool.length
          ? [...tool.slice(0, 40).map((t) => `  ${t.ten}${t.moTa ? `  ${mo(t.moTa.slice(0, 90))}` : ''}`), ...(tool.length > 40 ? [mo(`  … +${tool.length - 40}`)] : [])].join('\n')
          : mo(x?.ok ? L('  (server không khai tool nào)', '  (the server exposes no tools)') : `  ${dichLoiMcp(x?.loi ?? '').split('\n')[0]!.slice(0, 120)}`),
        ds: [
          x?.tat ? { nhan: L('Bật server này', 'Enable this server'), giaTri: 'bat' } : { nhan: L('Tắt server này', 'Disable this server'), giaTri: 'tat', ...(x?.tuDuAn ? { tat: true, mo: L('server của dự án', 'project server') } : {}) },
          { nhan: L('← Quay lại', '← Back'), giaTri: 'lai' },
        ],
        khiChon: async (g) => {
          if (g === 'lai') { menuChonServer(b, tt); return; }
          const r = await b.kn.goi<{ ok: boolean; loi?: string }>('agent:mcpBatTat', { ten, bat: g === 'bat' }).catch((e: Error) => ({ ok: false, loi: e.message }));
          b.lamMoiCtwork?.();
          await menuMcp(b, r?.ok ? (g === 'bat' ? L(`✓ Đã bật ${ten}.`, `✓ Enabled ${ten}.`) : L(`✓ Đã tắt ${ten}.`, `✓ Disabled ${ten}.`)) : `⚠ ${r?.loi ?? L('lõi cũ chưa hỗ trợ', 'not supported by this core')}`);
        },
      });
    },
  });
}

export async function chayLenh(text: string, b: BoiCanhLenh): Promise<void> {
  const { kho } = b;
  if (text === '__duyetKeHoach') {
    if ((kho.S.ws?.cheDoQuyen ?? 'keHoach') === 'keHoach') await b.doiCheDo('hoi').catch(() => undefined);
    b.guiThat(PROMPT_DUYET_KE_HOACH, { hienThi: L('✅ Làm theo kế hoạch', '✅ Proceed with the plan') });
    return;
  }
  // Lệnh tự tạo của dự án (`.claude/commands/*.md`): thân lệnh là câu hỏi, `$ARGUMENTS` = phần sau tên.
  const dau = text.trim().split(/\s+/)[0] ?? '';
  const lenhDuAn = kho.S.lenhDuAn.find((l) => l.ten === dau);
  const l = tachLenhCli(text);
  if (!l && lenhDuAn) {
    const thamSo = text.trim().slice(dau.length).trim();
    b.guiThat(lenhDuAn.than.replace(/\$ARGUMENTS/g, thamSo), { hienThi: text.trim() });
    return;
  }
  if (!l) { kho.traLoi(L(`Không có lệnh \`${dau}\`. Gõ \`/help\` để xem danh sách.`, `Unknown command \`${dau}\`. Type \`/help\` for the list.`)); return; }
  try {
    await chay(l.ten, l.thamSo, text.trim(), b);
  } catch (e) {
    // "fetch failed" của undici không nói gì với người dùng ⇒ dịch thành câu về mạng.
    const m = /fetch failed|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|network/i.test((e as Error).message)
      ? L('không kết nối được máy chủ CuongThai (mạng?)', 'could not reach the CuongThai server (network?)') : (e as Error).message;
    kho.traLoi(L(`Lệnh \`${l.ten}\` lỗi: ${m}`, `Command \`${l.ten}\` failed: ${m}`));
  }
}

async function chay(ten: string, thamSo: string, goc: string, b: BoiCanhLenh): Promise<void> {
  const { kho, kn } = b;
  const S = kho.S;
  const traLoi = (t: string) => kho.traLoi(t);
  switch (ten) {
    case '/help': {
      /* Đợt 5: gọn kiểu Claude Code mặc định; `/help all` = bản đầy đủ (bí danh, tham số, mẹo). */
      if (!/^(all|tat-ca|tatca|day-du|full|-a)$/i.test(thamSo.trim())) { traLoi(troGiupGon(LENH_GOI_Y, S.lenhDuAn)); return; }
      const coBan = troGiup(LENH_GOI_Y, S.lenhDuAn);
      traLoi(`${coBan}\n\n${L(
        '**Gõ đặc biệt**\n- `!lệnh` chạy shell ngay ở thư mục dự án (không qua AI) — kết quả đi kèm câu hỏi kế tiếp\n- `# ghi chú` lưu thành quy ước dự án (AGENTS.md) — CuongMini đọc ở mọi lượt\n- `@đường` / `@tênHàm` nhắc file, thư mục, hàm/lớp · kéo file ảnh vào hoặc `ctrl+v` (Windows: `alt+v`) dán ảnh\n\n**Phím tắt**\n- `shift+tab` đổi chế độ quyền · `esc` dừng (hoặc huỷ hàng chờ) · `esc esc` quay lui về câu cũ · `ctrl+c` ×2 thoát\n- Đang chạy vẫn gõ + Enter được — tin được **chèn** vào lượt đang chạy (↳), agent đọc ngay ở bước kế; lệnh `/` vào hàng chờ\n- `↓` (ô nhập trống) vào bảng agent phụ · `/tasks` xem cả việc đã xong và lệnh nền\n- `ctrl+r` xem lại bảng ghi · `ctrl+o` mở/thu đầu ra lệnh cũ · `ctrl+p`/`ctrl+t` bảng kế hoạch · `ctrl+l` vẽ lại\n- `Shift+Enter` (terminal hỗ trợ CSI u: iTerm2 ≥ 3.5, kitty, WezTerm, ghostty), `Alt+Enter`, `ctrl+j` hoặc `\\` cuối dòng để xuống dòng (`/terminal-setup`) \n- Toàn màn hình: con lăn / `↑` `↓` (ô nhập trống) / PgUp PgDn cuộn bản ghi — ô nhập luôn ở đáy · `ctrl+↑`/`ctrl+↓` lịch sử câu hỏi · kéo chuột bôi đen chép như thường (`/mouse on` để bắt chuột) · `/copy` chép câu trả lời\n\n_Lệnh chạy ngay tại đây không tốn lượt nào trừ /plan, /review, /init, /diff._',
        '**Special input**\n- `!command` runs a shell command in the project folder (no AI) — the output is attached to your next message\n- `# note` saves a project convention (AGENTS.md) — read on every turn\n- `@path` / `@functionName` mention files, folders, functions/classes · drag an image in or `ctrl+v` (Windows: `alt+v`) to paste one\n\n**Shortcuts**\n- `shift+tab` cycle permission mode · `esc` interrupt (or clear the queue) · `esc esc` rewind · `ctrl+c` ×2 quit\n- You can type while it works — the message is **added to the running turn** (↳) and the agent reads it at its next step; `/` commands are queued\n- `↓` (empty input) opens the subagent panel · `/tasks` also shows finished tasks and shells\n- `ctrl+r` transcript · `ctrl+o` expand/collapse old outputs · `ctrl+p`/`ctrl+t` plan panel · `ctrl+l` redraw\n- `Shift+Enter` (CSI u terminals: iTerm2 ≥ 3.5, kitty, WezTerm, ghostty), `Alt+Enter`, `ctrl+j` or a trailing `\\` for a newline (`/terminal-setup`) \n- Fullscreen: wheel / `↑` `↓` (empty input) / PgUp PgDn scroll the transcript — the input stays pinned · `ctrl+↑`/`ctrl+↓` prompt history · drag to select & copy as usual (`/mouse on` to capture the mouse) · `/copy` copies an answer\n\n_Local commands cost nothing except /plan, /review, /init, /diff._',
      )}`);
      return;
    }

    case '/clear':
      if (S.dangChay) { traLoi(L('Việc này đang chạy — bấm `esc` để dừng trước.', 'A task is running — press `esc` to stop it first.')); return; }
      await kn.goi('agent:reset');
      // Lõi có thể dựng lại trạng thái cuộc khi xoá — gửi lại quyền trình duyệt cho chắc.
      S.ws = await kn.apTrinhDuyet().catch(() => S.ws) as typeof S.ws;
      b.xoaManHinh();
      kho.xoaBang();
      return;

    case '/exit': b.thoat(); return;
    case '/logout': await b.dangXuat(); return;
    case '/login': b.dangNhapLai(); return;

    case '/kynang': {
      const phan = thamSo.split(/\s+/).filter(Boolean);
      if (phan[0] === 'cai' || phan[0] === 'install') {
        const tenKn = phan[1];
        if (!tenKn) { traLoi(L('Thiếu tên. Ví dụ: `/kynang cai database-optimizer`', 'Missing name. Example: `/kynang cai database-optimizer`')); return; }
        kho.thongBao(L(`Đang tải ${tenKn}…`, `Downloading ${tenKn}…`));
        const kq = (await kn.goi<Array<{ ten: string; loai: string; danhMuc: string }>>('agent:khoTim', { tuKhoa: tenKn })) ?? [];
        const m = kq.find((x) => x.ten === tenKn) ?? kq[0];
        if (!m) { traLoi(L(`Không tìm thấy \`${tenKn}\` trong kho.`, `\`${tenKn}\` not found in the catalog.`)); return; }
        const r = await kn.goi<{ ok: boolean; duongDan?: string; xemTruoc?: string; loi?: string }>('agent:khoCai', { ten: m.ten, loai: m.loai, ghiDe: phan.includes('--de') });
        traLoi(r.ok
          ? `${L(`Đã cài **${m.ten}** (${m.loai}) vào \`${r.duongDan}\`.\n\nAgent thấy nó từ lượt sau. Xem lại bằng \`git diff\` trước khi commit — đây là nội dung từ repo của người khác.`, `Installed **${m.ten}** (${m.loai}) into \`${r.duongDan}\`.\n\nThe agent sees it from the next turn. Review with \`git diff\` before committing — this content comes from someone else's repo.`)}\n\n\`\`\`\n${(r.xemTruoc ?? '').slice(0, 600)}\n\`\`\``
          : L(`Không cài được: ${r.loi}`, `Install failed: ${r.loi}`));
        return;
      }
      const tuKhoa = thamSo.trim();
      if (!tuKhoa) {
        traLoi(L('**Kho AI Templates** — hàng nghìn kỹ năng, agent phụ, lệnh.\n\n- Tìm: `/kynang <từ khoá>` (bỏ dấu cũng ra)\n- Cài: `/kynang cai <tên>` · ghi đè: thêm `--de`\n\n_Hook và MCP không cài từ đây — chúng là lệnh sẽ chạy, và có cửa duyệt riêng._',
          '**AI Templates catalog** — thousands of skills, subagents and commands.\n\n- Search: `/kynang <keyword>`\n- Install: `/kynang cai <name>` · overwrite: add `--de`\n\n_Hooks and MCP servers are not installed from here — they run commands and have their own approval._'));
        return;
      }
      const ds = await kn.goi<Array<{ ten: string; loai: string; danhMuc: string }>>('agent:khoTim', { tuKhoa }).catch(() => []) ?? [];
      traLoi(ds.length === 0 ? L(`Không có gì khớp "${tuKhoa}".`, `Nothing matches "${tuKhoa}".`)
        : `${L(`**${ds.length}** kết quả cho "${tuKhoa}":`, `**${ds.length}** results for "${tuKhoa}":`)}\n\n${ds.map((x) => `- \`${x.ten}\` · ${x.loai} · ${x.danhMuc}`).join('\n')}\n\n${L('Cài', 'Install')}: \`/kynang cai <${L('tên', 'name')}>\``);
      return;
    }

    case '/quyen': {
      const d = thamSo.split(/\s+/).filter(Boolean);
      const dau = (d[0] ?? '').toLowerCase();
      if (dau === 'them' || dau === 'thêm' || dau === 'add') { // i18n-bo-qua: chữ người gõ
        const tt = d.slice(1).join(' ').replace(/^["'`]|["'`]$/g, '').replace(/\s*(\*|…|\.\.\.)$/, '').trim();
        if (!tt) { traLoi(L('Gõ tiền tố: `/quyen them npm test` ⇒ mọi lệnh ĐƠN bắt đầu bằng `npm test` tự chạy ở dự án này.', 'Give a prefix: `/quyen add npm test` ⇒ every SINGLE command starting with `npm test` runs without asking in this project.')); return; }
        const r = await kn.goi<{ ok: boolean; khoa?: string; loi?: string }>('agent:themTienTo', { tienTo: tt });
        traLoi(r?.ok
          ? L(`Đã cho phép lâu dài mọi lệnh bắt đầu bằng \`${tt}\` ở dự án này (lệnh nối \`;\` \`&&\` \`|\` \`$(…)\` vẫn hỏi).`, `Always allowing every command starting with \`${tt}\` in this project (chained \`;\` \`&&\` \`|\` \`$(…)\` still asks).`)
          : `⚠ ${r?.loi ?? L('Không thêm được.', 'Could not add it.')}`);
        return;
      }
      const r = await kn.goi<{ goc: string | null; khoa: string[] }>('agent:dsQuyenLau');
      if (dau === 'xoa' || dau === 'xoá' || dau === 'clear' || dau === 'remove') { // i18n-bo-qua: chữ người gõ
        let rieng = d.slice(1).join(' ').trim();
        // `/quyen xoa 2` ⇒ mục số 2 trong danh sách.
        if (/^\d+$/.test(rieng) && r?.khoa[Number(rieng) - 1]) rieng = r.khoa[Number(rieng) - 1]!;
        const n = await kn.goi<number>('agent:xoaQuyenLau', rieng ? { khoa: rieng } : {}) ?? 0;
        traLoi(n === 0 ? L('Không có quyền nào bị thu hồi.', 'Nothing was revoked.')
          // Không lộ khoá nội bộ `tien-to:…` (QA 18/10: "Revoked 1 permission for tien-to:npm test").
          : (() => { const ten = rieng.startsWith('tien-to:') ? `${rieng.slice(8)} …` : rieng; return L(`Đã thu hồi **${n}** quyền${ten ? ` cho \`${ten}\`` : ' của dự án này'}.`, `Revoked **${n}** permission${n > 1 ? 's' : ''}${ten ? ` for \`${ten}\`` : ' for this project'}.`); })());
        return;
      }
      if (!r?.goc) { traLoi(L('Chưa mở dự án nào.', 'No project is open.')); return; }
      // Đợt 4: thẻ lựa chọn (kiểu Claude Code) thay cho dòng gợi ý gõ lệnh.
      const hienTho = (k: string): string => (k.startsWith('tien-to:') ? `${k.slice(8)} …  ${mo(L('mọi lệnh bắt đầu bằng', 'any command starting with'))}` : k);
      b.chon({
        tieuDe: L('Quyền "Luôn cho phép"', '"Always allow" permissions'),
        than: [...(r.khoa.length ? r.khoa.map((x, i) => `  ${mo(`${i + 1}.`)} ${hienTho(x)}`) : [mo(L('  (chưa có quyền nào)', '  (none yet)'))]), '', cay(r.goc)].join('\n'),
        ds: [
          { nhan: L('Thêm tiền tố lệnh…', 'Add a command prefix…'), giaTri: 'them', mo: L('vd "npm test"', 'e.g. "npm test"') },
          { nhan: L('Thu hồi một mục…', 'Revoke one…'), giaTri: 'mot', ...(r.khoa.length ? {} : { tat: true }) },
          { nhan: L('Thu hồi tất cả', 'Revoke all'), giaTri: 'het', ...(r.khoa.length ? {} : { tat: true }) },
          { nhan: L('Thoát', 'Exit'), giaTri: 'thoat', mo: 'Esc' },
        ],
        khiChon: async (g) => {
          if (g === 'them') { b.datNhap(L('/quyen them ', '/quyen add ')); return; }
          if (g === 'het') { await chayLenh('/quyen xoa', b); return; }
          if (g === 'mot') {
            b.chon({
              tieuDe: L('Thu hồi quyền nào?', 'Revoke which permission?'),
              ds: [...r.khoa.map((x, i) => ({ nhan: hienTho(x), giaTri: String(i + 1) })), { nhan: L('← Quay lại', '← Back'), giaTri: 'lai' }],
              khiChon: async (so) => { if (so === 'lai') await chayLenh('/quyen', b); else await chayLenh(`/quyen xoa ${so}`, b); },
            });
          }
        },
      });
      return;
    }

    case '/ctwork': case '/issue': case '/sprint': case '/viec':
      /* Đợt 5: bộ lệnh CT Work CHUNG ba nơi (`desktop/.../ctworkLenh.ts`) — menu đánh số, thẻ xem trước khi ghi. */
      await lenhCtwork(ten, thamSo, giaoDienCtw(b));
      return;

    case '/sessions': {
      const r = await kn.goi<{ toi: { id: string; ten: string } | null; ds: Array<{ id: string; ten: string; noi: string; thuMuc: string | null; trangThai: string }> } | null>('agent:dsPhienMang').catch(() => null);
      if (!r) { traLoi(L('Lõi này chưa hỗ trợ nhắn giữa phiên.', 'This core does not support cross-session messaging yet.')); return; }
      // Đợt 4: thẻ lựa chọn.
      {
        const be = Math.min(24, Math.max(6, ...r.ds.map((x) => x.ten.length)));
        b.chon({
          tieuDe: L('Phiên CuongMini trên máy này', 'CuongMini sessions on this machine'),
          than: [
            `  ${L('Phiên này', 'This session')}: ${r.toi ? `${r.toi.ten} ${mo(`(${r.toi.id})`)}` : mo(L('chưa đăng ký (sau lượt đầu tiên)', 'not registered yet (after the first turn)'))}`,
            '',
            ...(r.ds.length
              ? r.ds.map((x) => `${dongCot(x.ten, be, `${x.trangThai === 'dangChay' ? mau(VANG_NHAT)(L('● đang chạy', '● running')) : mo(L('○ rảnh', '○ idle'))} ${mo(`· ${x.noi} · ${x.id}`)}`)}\n${cay(x.thuMuc ?? '—')}`)
              : [mo(L('  Không có phiên nào khác đang mở.', '  No other session is open.'))]),
          ].join('\n'),
          ds: [
            { nhan: L('Đổi tên phiên này…', 'Rename this session…'), giaTri: 'ten' },
            { nhan: L('Nhờ agent nhắn một phiên…', 'Ask the agent to message a session…'), giaTri: 'nhan', ...(r.ds.length ? {} : { tat: true }), mo: L('bạn duyệt tin trước khi gửi', 'you approve the text first') },
            { nhan: L('Thoát', 'Exit'), giaTri: 'thoat', mo: 'Esc' },
          ],
          khiChon: (g) => {
            if (g === 'ten') b.datNhap('/rename ');
            else if (g === 'nhan') b.datNhap(L(`Nhắn phiên ${r.ds[0]!.id}: `, `Message session ${r.ds[0]!.id}: `));
          },
        });
        return;
      }
      return;
    }

    case '/rename': {
      const ten = thamSo.trim();
      if (!ten) { traLoi(L('Gõ tên: `/rename backend-api`', 'Give a name: `/rename backend-api`')); return; }
      const m = await kn.goi<{ ten: string; id: string } | null>('agent:doiTenPhienMang', { ten: ten.slice(0, 60) }).catch(() => null);
      if (m) { kho.S.tieuDe = ten; kho.thongBao(L(`Đã đặt tên phiên: ${m.ten} (${m.id})`, `Session renamed: ${m.ten} (${m.id})`), 'ok'); } else traLoi(L('Không đổi được tên (lõi cũ?).', 'Could not rename (old core?).'));
      return;
    }

    case '/worktree': {
      const d = thamSo.split(/\s+/).filter(Boolean);
      const dau = (d[0] ?? '').toLowerCase();
      const ds = await kn.goi<Array<{ duongDan: string; nhanh: string | null; laChinh: boolean; cuaApp: boolean; dangDung?: boolean }>>('agent:dsWorktree').catch(() => []) ?? [];
      if ((!dau || dau === 'list' || dau === 'ds') && ds.length) {
        // Đợt 4: thẻ lựa chọn.
        const xoaDuoc = ds.filter((w) => !w.laChinh && w.cuaApp);
        b.chon({
          tieuDe: L('Git worktree', 'Git worktrees'),
          than: ds.map((w) => `  ${w.dangDung ? mau(XANH)('▶') : ' '} ${w.nhanh ?? L('(tách rời)', '(detached)')}${w.laChinh ? mo(L(' · cây chính', ' · main tree')) : ''}${w.cuaApp ? mo(' · CuongMini') : ''}\n${cay(w.duongDan)}`).join('\n'),
          ds: [
            { nhan: L('Tạo worktree mới…', 'Create a new worktree…'), giaTri: 'tao', mo: L('nhánh agent/<tên>', 'branch agent/<name>') },
            { nhan: L('Xoá một worktree…', 'Remove a worktree…'), giaTri: 'xoa', ...(xoaDuoc.length ? {} : { tat: true }) },
            { nhan: L('Thoát', 'Exit'), giaTri: 'thoat', mo: 'Esc' },
          ],
          khiChon: (g) => {
            if (g === 'tao') b.datNhap('/worktree ');
            else if (g === 'xoa') {
              b.chon({
                tieuDe: L('Xoá worktree nào?', 'Remove which worktree?'),
                moTa: L('Nhánh được giữ lại; worktree còn thay đổi chưa commit thì không xoá.', 'The branch is kept; a worktree with uncommitted changes is not removed.'),
                ds: [...xoaDuoc.map((w) => ({ nhan: w.duongDan, giaTri: w.duongDan, mo: w.nhanh ?? '' })), { nhan: L('← Quay lại', '← Back'), giaTri: '__lai' }],
                khiChon: async (d2) => { if (d2 === '__lai') await chayLenh('/worktree', b); else await chayLenh(`/worktree xoa ${d2}`, b); },
              });
            }
          },
        });
        return;
      }
      if (!dau || dau === 'list' || dau === 'ds') {
        traLoi(ds.length
          ? `${L('Worktree của repo', 'Repo worktrees')}:\n\n${ds.map((w) => `- ${w.dangDung ? '▶ ' : ''}\`${w.duongDan}\` · ${w.nhanh ?? L('(tách rời)', '(detached)')}${w.laChinh ? L(' · cây chính', ' · main tree') : ''}${w.cuaApp ? ' · CuongMini' : ''}`).join('\n')}\n\n${L('Tạo: `/worktree <tên>` (nhánh `agent/<tên>`, mở ở thư mục anh em) · xoá: `/worktree xoa <đường>`', 'Create: `/worktree <name>` (branch `agent/<name>`, sibling folder) · remove: `/worktree remove <path>`')}`
          : L('Thư mục này không phải kho git (hoặc máy chưa có git).', 'This folder is not a git repository (or git is missing).'));
        return;
      }
      if (dau === 'xoa' || dau === 'xoá' || dau === 'remove') { // i18n-bo-qua: chữ người gõ
        const duong = d.slice(1).join(' ');
        const r = await kn.goi<{ ok: boolean; loi?: string }>('agent:xoaWorktree', { duongDan: duong });
        traLoi(r?.ok ? L(`Đã xoá worktree \`${duong}\` (nhánh giữ lại).`, `Removed worktree \`${duong}\` (branch kept).`) : `⚠ ${dichLoiWorktree(r?.loi ?? '?')}`);
        return;
      }
      if (kho.S.dangChay) { traLoi(L('Việc này đang chạy — đợi xong rồi đổi worktree.', 'A turn is running — wait for it before switching worktrees.')); return; }
      const r = await kn.goi<{ ok: boolean; loi?: string }>('agent:taoWorktree', { ten: d.join('-') });
      if (!r?.ok) { traLoi(`⚠ ${r?.loi ? dichLoiWorktree(r.loi) : L('Không tạo được worktree.', 'Could not create the worktree.')}`); return; }
      const ws = await kn.goi<{ path?: string; branch?: string }>('agent:getWorkspace').catch(() => null);
      if (ws) kho.S.ws = { ...(kho.S.ws ?? {}), ...ws } as typeof kho.S.ws;
      kho.xoaBang();
      traLoi(L(`Đã chuyển sang worktree \`${ws?.path ?? ''}\` (nhánh \`${ws?.branch ?? ''}\`). Hội thoại mới bắt đầu ở đó — cây cũ không bị đụng tới.`, `Switched to worktree \`${ws?.path ?? ''}\` (branch \`${ws?.branch ?? ''}\`). A fresh conversation starts there — your original tree is untouched.`));
      return;
    }

    case '/may': {
      const q = thamSo.trim().toLowerCase();
      const bat = /^(on|bat|bật|1|yes)$/.test(q) ? true : /^(off|tat|tắt|0|no)$/.test(q) ? false : undefined;
      const r = await kn.goi<{ bat: boolean; hoTro: boolean; nenTang: string; quyen: { chup: boolean; dieuKhien: boolean } | null }>('agent:mayTinh', bat === undefined ? {} : { bat }).catch(() => null);
      if (!r) { traLoi(L('Lõi này chưa có điều khiển máy tính — cập nhật CuongMini.', 'This core has no computer control yet — update CuongMini.')); return; }
      if (!r.hoTro) { traLoi(L(`Nền tảng ${r.nenTang} chưa hỗ trợ điều khiển máy tính.`, `Computer control is not supported on ${r.nenTang}.`)); return; }
      const quyen = r.quyen && (!r.quyen.chup || !r.quyen.dieuKhien)
        ? `\n\n${L('⚠ macOS còn thiếu quyền cho **app terminal đang chạy CuongMini**', '⚠ macOS is missing permissions for **the terminal app running CuongMini**')}:${!r.quyen.chup ? `\n- ${L('Ghi màn hình', 'Screen Recording')}: \`open "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture"\`` : ''}${!r.quyen.dieuKhien ? `\n- ${L('Trợ năng', 'Accessibility')}: \`open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"\`` : ''}\n${L('Bật xong thì thoát hẳn terminal rồi mở lại.', 'Then quit and reopen the terminal.')}`
        : '';
      traLoi(r.bat
        ? `${L('🖥 Điều khiển máy tính: **BẬT** — agent chụp màn hình được; MỌI cú bấm/gõ/phím/cuộn đều hỏi bạn, kể cả chế độ Bỏ qua hết. Tắt: `/may off`.', '🖥 Computer control: **ON** — the agent can take screenshots; EVERY click/type/key/scroll asks you first, even in Bypass mode. Turn off: `/may off`.')}${quyen}`
        : L('🖥 Điều khiển máy tính: **TẮT** (mặc định). Bật: `/may on` — từ lượt sau agent có tool chụp màn hình + chuột/phím (mỗi thao tác đều hỏi).', '🖥 Computer control: **OFF** (default). Turn on: `/may on` — from the next turn the agent gets screenshot + mouse/keyboard tools (each action asks).'));
      return;
    }

    case '/hen': {
      const d = thamSo.split(/\s+/).filter(Boolean);
      const lenhHen = (d[0] ?? '').toLowerCase();
      if (['chay-bu', 'chaybu', 'run-missed', 'bo-lo', 'bolo', 'drop-missed'].includes(lenhHen)) {
        const chay = ['chay-bu', 'chaybu', 'run-missed'].includes(lenhHen);
        const r = await kn.goi<{ n: number }>('agent:xuLyHenLo', { cach: chay ? 'chay' : 'bo' }).catch(() => null);
        traLoi(chay ? L(`Đang chạy bù ${r?.n ?? 0} hẹn đã lỡ (mỗi hẹn chạy nền trong đúng việc của nó — xem kết quả bằng /resume).`, `Running ${r?.n ?? 0} missed schedule(s) in the background, each in its own task — see the result with /resume.`)
          : L(`Đã bỏ ${r?.n ?? 0} hẹn đã lỡ.`, `Dropped ${r?.n ?? 0} missed schedule(s).`));
        return;
      }
      if ((d[0] ?? '').toLowerCase() === 'huy' || (d[0] ?? '').toLowerCase() === 'cancel') {
        const n = await kn.goi<number>('agent:huyHen', d[1] ? { id: d[1].replace(/^#/, '') } : {}).catch(() => 0) ?? 0;
        traLoi(L(`Đã huỷ ${n} hẹn.`, `Cancelled ${n} schedule${n === 1 ? '' : 's'}.`));
        return;
      }
      const r = await kn.goi<{ cho: Array<{ id: string; moTa: string; hetLuc: number }>; hen: Array<{ id: string; lyDo: string; luc: number; lap: boolean; phut: number; conLai: number; cron?: string }> } | null>('agent:henCho').catch(() => null);
      const lo = (await kn.goi<{ ds: Array<{ id: string; lyDo: string; luc: number; cron?: string }> }>('agent:henLo').catch(() => null))?.ds ?? [];
      const dongLo = lo.length
        ? ['', L(`**Đã lỡ ${lo.length} hẹn** lúc CuongMini tắt:`, `**Missed ${lo.length} schedule(s)** while CuongMini was closed:`),
          ...lo.map((h) => `- ⏰ ${new Date(h.luc).toLocaleString(L('vi-VN', 'en-US'), { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })} — ${h.lyDo}`),
          L('Chạy bù: `/hen chay-bu` · bỏ: `/hen bo-lo`', 'Run now: `/hen run-missed` · drop: `/hen drop-missed`')]
        : [];
      if (!r || (!r.cho.length && !r.hen.length)) { if (!lo.length) { traLoi(L('Không có việc chờ hay hẹn nào.', 'Nothing is waiting or scheduled.')); return; } }
      // Đợt 4: thẻ lựa chọn kiểu Claude Code.
      {
        const gio = (t: number) => new Date(t).toLocaleTimeString(L('vi-VN', 'en-US'), { hour: '2-digit', minute: '2-digit' });
        const henDs = r?.hen ?? [];
        b.chon({
          tieuDe: L('Chờ & hẹn của agent', 'Agent waits & schedules'),
          than: [
            ...(r?.cho ?? []).map((c) => `  ⏳ ${dichMoTaCho(c.moTa)} ${mo(`· ${L('còn', 'left')} ${Math.max(0, Math.round((c.hetLuc - Date.now()) / 1000))}s`)}`),
            ...henDs.map((h) => `  ⏰ ${gio(h.luc)} ${mo(`· ${h.id}${h.cron ? ` · cron ${h.cron} · ${L(`còn ${h.conLai}×`, `${h.conLai}× left`)}` : h.lap ? L(` · mỗi ${h.phut}′ · còn ${h.conLai}×`, ` · every ${h.phut}′ · ${h.conLai}× left`) : ''}`)}\n${cay(h.lyDo.slice(0, 100))}`),
            ...(lo.length ? ['', `  ${mau(VANG_NHAT)(L(`Đã lỡ ${lo.length} hẹn lúc CuongMini tắt`, `Missed ${lo.length} schedule(s) while CuongMini was closed`))}`, ...lo.map((h) => cay(`${new Date(h.luc).toLocaleString(L('vi-VN', 'en-US'), { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })} — ${h.lyDo.slice(0, 80)}`))] : []),
            '', mo(L('  Hẹn được lưu xuống đĩa — tắt CuongMini lúc tới giờ thì lần mở sau được hỏi chạy bù.', '  Schedules are saved — if CuongMini is closed when one is due, you are asked to run it next time.')),
          ].join('\n'),
          ds: [
            ...(lo.length ? [{ nhan: L('Chạy bù hẹn đã lỡ', 'Run missed schedules'), giaTri: 'chay' }, { nhan: L('Bỏ hẹn đã lỡ', 'Drop missed schedules'), giaTri: 'bo' }] : []),
            { nhan: L('Huỷ một hẹn…', 'Cancel one…'), giaTri: 'mot', ...(henDs.length ? {} : { tat: true }) },
            { nhan: L('Huỷ tất cả hẹn', 'Cancel all'), giaTri: 'het', ...(henDs.length ? {} : { tat: true }) },
            { nhan: L('Thoát', 'Exit'), giaTri: 'thoat', mo: 'Esc' },
          ],
          khiChon: async (g) => {
            if (g === 'chay') await chayLenh('/hen chay-bu', b);
            else if (g === 'bo') await chayLenh('/hen bo-lo', b);
            else if (g === 'het') await chayLenh('/hen huy', b);
            else if (g === 'mot') {
              b.chon({
                tieuDe: L('Huỷ hẹn nào?', 'Cancel which schedule?'),
                ds: [...henDs.map((h) => ({ nhan: `${gio(h.luc)} — ${h.lyDo.slice(0, 60)}`, giaTri: h.id })), { nhan: L('← Quay lại', '← Back'), giaTri: '__lai' }],
                khiChon: async (id) => { if (id === '__lai') await chayLenh('/hen', b); else await chayLenh(`/hen huy ${id}`, b); },
              });
            }
          },
        });
        return;
      }
      return;
    }

    case '/cost':
      traLoi(L(
        `**Chi phí việc này**\n\n- Đã tiêu: **~$${S.tienPhien.toFixed(3)}**\n- Số bước đã đi: ${S.buoc?.nay ?? 0}\n- File đã sửa (hoàn tác được): ${Object.keys(S.fileDaSua).length || S.soFileDaSua}\n\n_Con số là ƯỚC LƯỢNG. Chi tiết hạn mức: \`/usage\`._`,
        `**Cost of this task**\n\n- Spent: **~$${S.tienPhien.toFixed(3)}**\n- Steps: ${S.buoc?.nay ?? 0}\n- Files changed (undoable): ${Object.keys(S.fileDaSua).length || S.soFileDaSua}\n\n_These are ESTIMATES. Usage details: \`/usage\`._`,
      ));
      return;

    case '/undo': {
      const r = (await kn.goi<{ soFile: number; loi: string[] }>('agent:hoanTac')) ?? { soFile: 0, loi: [] };
      if (r.soFile > 0) S.fileDaSua = {};
      traLoi(r.soFile === 0 && !r.loi.length ? L('Chưa có file nào để hoàn tác trong việc này.', 'Nothing to undo in this task.')
        : `${L(`Đã hoàn tác **${r.soFile}** file.`, `Reverted **${nhieu(r.soFile, 'file')}**.`)}${r.loi.length ? `\n\n${L('Không hoàn tác được', 'Could not revert')}: ${r.loi.join('; ')}` : ''}`);
      return;
    }

    case '/diff':
      b.guiThat('Chạy git_diff rồi tóm tắt ngắn gọn những gì đã thay đổi trong dự án.', { chiDoc: true, hienThi: goc }); // i18n-bo-qua: câu gửi model
      return;

    case '/model': {
      const q = thamSo.trim();
      if (!q) { b.moMenu('model'); return; }
      const m = timTheoChu(q, b.dsModel());
      /* 18/10/2026: chỉ in TÊN CuongMini (mã trung tính cũng không lộ model thật). */
      if (!m) { traLoi(`${L(`Không rõ model "${q}". Có:`, `Unknown model "${q}". Available:`)}\n\n${b.dsModel().map((x) => `- ${x.ten}${x.dungDuoc ? '' : L(' (chưa mở)', ' (not enabled)')}${x.canMoKhoa ? L(' · cần khoá', ' · needs a key') : ''}`).join('\n')}`); return; }
      if (!m.dungDuoc) { traLoi(L(`**${m.ten}** chưa dùng được — máy chủ chưa mở nhà cung cấp này.`, `**${m.ten}** is not available — the server has not enabled this provider.`)); return; }
      if (m.canMoKhoa) { b.moKhoaModel(m.id); return; }
      if (m.dat) { b.moMenu('model'); traLoi(L(`**${m.ten}** tốn nhiều hơn hẳn — chọn lại trong menu vừa mở để xác nhận.`, `**${m.ten}** costs much more — pick it again in the menu to confirm.`)); return; }
      await b.doiModel(m.id);
      traLoi(L(`Đã đổi model sang **${m.ten}** — ${m.mo}.`, `Model set to **${m.ten}** — ${moModel(m.mo)}.`));
      return;
    }

    case '/effort': {
      const q = thamSo.trim();
      if (!q) { b.moMenu('muc'); return; }
      const m = timMuc(q, b.dsMuc());
      if (!m) { traLoi(L(`Không rõ mức "${q}". Có: ${b.dsMuc().map((x) => x.ten).join(' · ')}.`, `Unknown effort "${q}". Available: ${b.dsMuc().map((x) => x.ten).join(' · ')}.`)); return; }
      await b.doiMuc(m.id);
      traLoi(L(`Đã đổi mức nỗ lực sang **${m.ten}** — ${m.mo}.`, `Effort set to **${m.ten}** — ${m.mo}.`));
      return;
    }

    case '/usage': {
      kho.thongBao(L('Đang hỏi hạn mức…', 'Checking usage…'));
      const u = await layUsage(async (duong) => {
        const r = await fetch(`${API_ORIGIN}${duong}`, { headers: { authorization: `Bearer ${kn.nguoi.token}` }, signal: AbortSignal.timeout(15_000) });
        const j = await r.json().catch(() => ({})) as { data?: unknown; message?: string };
        if (!r.ok) throw new Error(j.message ?? L(`Máy chủ trả HTTP ${r.status}.`, `Server returned HTTP ${r.status}.`));
        return j.data ?? j;
      });
      traLoi(ngonNgu() === 'en' ? usageEn(u) : moTaUsage(u).replace('nhập ở nút bên dưới khi hết hạn mức', 'nhập trong app/web khi hết hạn mức')); // i18n-bo-qua: sửa chữ của ct-lenh
      return;
    }

    case '/context': {
      const ct = await kn.goi('agent:nguCanhChiTiet');
      if (!ct) { traLoi(L('Lõi không trả dữ liệu cho lệnh này (lõi cũ hoặc lỗi kết nối) — thử lại sau.', 'The core returned no data for this command (old core or a connection error) — try again later.')); return; }
      traLoi(ngonNgu() === 'en' ? nguCanhEn(ct as NguCanhEn, 600_000, S.nguCanh?.soLuotDaBo ?? 0) : moTaNguCanh(ct, 600_000, S.nguCanh?.soLuotDaBo ?? 0));
      return;
    }

    case '/compact': {
      kho.thongBao(L(`Đang tóm tắt phần cũ${thamSo ? ` (giữ: ${thamSo})` : ''}…`, `Compacting older turns${thamSo ? ` (keeping: ${thamSo})` : ''}…`));
      const r = await kn.goi<{ ok: boolean; loi?: string; soTinDaGop?: number; soLuotDaGop?: number; xemTruoc?: string; kyTuTruoc?: number; kyTuSau?: number }>('agent:compact', thamSo ? { ghiChu: thamSo } : {});
      if (!r?.ok) { traLoi(L(`Không /compact được: ${r?.loi ?? '?'}`, `/compact failed: ${r?.loi ?? '?'}`)); return; }
      if (!r.soTinDaGop) { traLoi(L('Việc này còn ngắn — chưa có gì để gộp.', 'This task is still short — nothing to compact.')); return; }
      S.daCompact = true;
      const k = (n?: number): string => (n === undefined ? '?' : `${Math.round(n / 1000)}k`);
      traLoi(`${L(`Đã gộp **${r.soLuotDaGop ?? '?'} lượt đầu** vào một bản tóm tắt. Ngữ cảnh gửi lên: **${k(r.kyTuTruoc)} → ${k(r.kyTuSau)}** ký tự.`, `Compacted the **first ${r.soLuotDaGop ?? '?'} turns** into a summary. Context sent: **${k(r.kyTuTruoc)} → ${k(r.kyTuSau)}** chars.`)}\n\n> ${(r.xemTruoc ?? '').split('\n').slice(0, 8).join('\n> ')}`);
      return;
    }

    case '/status': {
      const nayModel = b.dsModel().find((x) => x.id === (S.ws?.model ?? 'cm-solid'));
      const nayMuc = b.dsMuc().find((x) => x.id === (S.ws?.mucNoLuc ?? 'vua'));
      const tt = {
        phienBan: `CuongMini CLI ${b.phienBan} · Node ${process.versions.node}`,
        cong: 'chinh' as const, online: true,
        duAn: S.ws?.name ?? null, duongDan: S.ws?.path ?? null, nhanh: S.ws?.branch ?? null,
        model: nayModel?.ten ?? S.ws?.model ?? '?', muc: nayMuc?.ten ?? '?',
        cheDo: moTaCheDo(S.ws?.cheDoQuyen).ten, tomTat: S.daCompact,
      };
      const coBan = ngonNgu() === 'en' ? trangThaiEn(tt) : moTaTrangThai(tt).replace('- App:', '- Phiên bản:'); // i18n-bo-qua: sửa chữ của ct-lenh
      const td = S.ws?.choTrinhDuyet
        ? L(`**bật** 🌐 (${timTrinhDuyet() ?? 'chưa thấy trình duyệt'})`, `**on** 🌐 (${timTrinhDuyet() ?? 'no browser found'})`)
        : L('tắt — bật bằng `/browser on`', 'off — turn on with `/browser on`');
      traLoi(`${coBan}\n- ${L('Trình duyệt cho AI', 'AI browser')}: ${td}\n- ${L('Ngôn ngữ', 'Language')}: ${L('Tiếng Việt', 'English')}\n- ${L('Tài khoản', 'Account')}: **${kn.nguoi.fullName || kn.nguoi.username}**`);
      return;
    }

    case '/plan':
      if (!thamSo) { traLoi(L('Gõ việc cần lập kế hoạch: `/plan thêm trang cài đặt`. Lượt đó CHỈ ĐỌC — không sửa file, không chạy lệnh — rồi bạn duyệt mới làm.', 'Describe the task: `/plan add a settings page`. That turn is READ-ONLY — no edits, no commands — and you approve before anything happens.')); return; }
      S.choDuyetKeHoach = true;
      b.guiThat(promptPlan(thamSo), { chiDoc: true, hienThi: goc });
      return;

    case '/review':
      b.guiThat(promptReview(thamSo), { chiDoc: true, hienThi: goc });
      return;

    case '/init':
      if ((S.ws?.cheDoQuyen ?? 'keHoach') === 'keHoach') {
        await b.doiCheDo('hoi');
        kho.thongBao(L('Đã chuyển sang "Hỏi trước mọi việc" để CuongMini ghi AGENTS.md — mỗi lần ghi vẫn hỏi bạn.', 'Switched to "Ask before edits" so CuongMini can write AGENTS.md — each write still asks you.'));
      }
      b.guiThat(PROMPT_INIT, { hienThi: goc });
      return;

    case '/resume': {
      if (!thamSo) { b.moMenu('resume'); return; }
      const phien = (await kn.goi<PhienCu[]>('agent:dsPhien')) ?? [];
      const p = chonPhien(phien, thamSo);
      if (!p) { traLoi(ngonNgu() === 'en' ? dsPhienEn(locPhien(phien, thamSo)) : moTaDsPhien(locPhien(phien, thamSo))); return; }
      await moPhien(p.id, p.tieuDe, b);
      return;
    }

    case '/rewind': {
      const ds = dsCauHoi(S.muc as MucGhi[]);
      const n = Number(thamSo);
      const dsChu = () => (ngonNgu() === 'en' ? dsCauHoiEn(ds) : moTaDsCauHoi(ds));
      if (!thamSo) { if (ds.length) b.moMenu('rewind'); else traLoi(dsChu()); return; }
      if (!Number.isInteger(n)) { traLoi(dsChu()); return; }
      if (n < 1 || n > ds.length) { traLoi(L(`Không có câu hỏi thứ ${n} (việc này có ${ds.length} câu).`, `There is no question #${n} (this task has ${ds.length}).`)); return; }
      const r = await kn.goi<{ ok: boolean; loi?: string; cauHoi?: string; coSuaFile?: boolean; soFileSeLui?: number }>('agent:quayLui', { k: n });
      if (!r?.ok) { traLoi(r?.loi ?? L('Không quay lui được.', 'Could not rewind.')); return; }
      let chu = L(`Đã quay về câu ${n}. Câu hỏi đó đã nằm lại trong ô nhập để bạn sửa và gửi lại.`, `Rewound to question ${n}. It is back in the input box to edit and resend.`);
      if ((r.soFileSeLui ?? 0) > 0) {
        const kq = await kn.goi<{ soFile: number; loi: string[] }>('agent:luiFile', { k: n }).catch(() => null);
        chu = kq === null ? L('Đã quay lui hội thoại, nhưng lùi file hỏng.', 'Rewound the conversation, but reverting files failed.')
          : L(`Đã quay về câu ${n}: cắt hội thoại và lùi ${kq.soFile} file về trước câu đó.`, `Rewound to question ${n}: conversation cut and ${nhieu(kq.soFile, 'file')} reverted.`)
            + (kq.loi.length ? L(` ${kq.loi.length} file không lùi được: ${kq.loi.join('; ')}`, ` ${kq.loi.length} could not be reverted: ${kq.loi.join('; ')}`) : '');
      } else if (r.coSuaFile) {
        chu = L(`Đã quay về câu ${n}. Đoạn vừa bỏ có chạy lệnh — thay đổi do lệnh gây ra không lùi được tự động.`, `Rewound to question ${n}. The removed part ran commands — their changes cannot be reverted automatically.`);
      }
      // Xoá màn hình rồi in lại bảng ghi ĐÃ CẮT — như Claude Code, phần sau mốc biến mất khỏi màn hình.
      b.xoaManHinh();
      if (!kho.catBangTuCau(n)) {
        let dem = 0;
        const cat = S.muc.findIndex((m) => m.kieu === 'nguoi' && ++dem === n);
        if (cat >= 0) S.muc.splice(cat);
        kho.veLai();
      }
      b.datNhap(r.cauHoi ?? '');
      kho.thongBao(`↺ ${chu}`, 'ok');
      return;
    }

    case '/memory': {
      const ds = await kn.goi<Array<{ id: string; tieuDe: string; apDung: string; phamVi: string; lanKhop: number }>>('agent:boNhoDs') ?? [];
      traLoi(ds.length === 0 ? L('**Bộ nhớ bài học** trống — CuongMini tự ghi nhớ khi bạn sửa nó hoặc khi gặp bẫy của dự án.', '**Memory** is empty — CuongMini saves lessons when you correct it or hits a project pitfall.')
        : `${L('**Bộ nhớ bài học**', '**Memory**')} (${ds.length}):\n\n${ds.slice(0, 40).map((x) => `- **${x.tieuDe}** _(${x.phamVi}, ${L(`khớp ${x.lanKhop} lần`, `matched ${x.lanKhop}×`)})_ — ${x.apDung}`).join('\n')}\n\n${L('_Muốn CuongMini quên một bài: nói "quên bài học …"._', '_To make CuongMini forget one, say "forget lesson …"._')}`);
      return;
    }

    case '/hooks':
      kn.moCuoi = null;
      await kn.goi('agent:hookMoCauHinh');
      baoMoFile(b, L('cấu hình hook', 'hooks config'));
      return;

    case '/mcp': {
      // `mở`/`mo`/`open`/`edit` — chấp nhận cả gõ có dấu (lỗi thật 18/10: "/mcp mở" rơi xuống in danh sách).
      const tsMcp = chuanHoaTen(thamSo);
      if (/^(mo|open|edit|sua)$/.test(tsMcp)) { kn.moCuoi = null; await kn.goi('agent:mcpMoCauHinh'); baoMoFile(b, L('cấu hình MCP', 'MCP config')); return; }
      const napLai = /^(nap|napLai|reload)$/i.test(tsMcp);
      if (napLai) { await kn.goi('agent:mcpNapLai').catch(() => undefined); b.lamMoiCtwork?.(); }
      // Đợt 4: THẺ LỰA CHỌN kiểu Claude Code (trước đây chỉ in một dòng "open with /mcp open · reload with /mcp reload").
      await menuMcp(b, napLai ? L('✓ Đã nạp lại cấu hình MCP.', '✓ MCP config reloaded.') : '');
      return;
    }

    case '/export': {
      if (S.muc.length === 0) { traLoi(L('Việc này chưa có gì để xuất.', 'Nothing to export yet.')); return; }
      const luc = new Date();
      const tieuDe = S.tieuDe || L('Việc CuongMini', 'CuongMini task');
      let noiDung = xuatMarkdown(S.muc as MucGhi[], { tieuDe, duAn: S.ws?.name ?? null, luc }).replace('Xuất từ AI Code', 'Xuất từ CuongMini CLI'); // i18n-bo-qua: chữ của ct-lenh
      if (ngonNgu() === 'en') {
        // `xuatMarkdown` của app chỉ viết tiếng Việt — đổi các nhãn cố định của nó.
        noiDung = noiDung.replace(/^> Xuất từ CuongMini CLI lúc /m, '> Exported from CuongMini CLI at ').replace(/ · dự án `/, ' · project `') // i18n-bo-qua
          .replace(/^## Bạn$/gm, '## You').replace(/^\*\*Công cụ:\*\*$/gm, '**Tools:**').replace(/_\(kèm (\d+) ảnh\)_/g, '_(with $1 images)_'); // i18n-bo-qua
      }
      const ten = thamSo.trim() || tenFileXuat(tieuDe, luc);
      let duong = path.resolve(b.thuMuc, ten);
      for (let i = 2; existsSync(duong) && !thamSo.trim(); i += 1) duong = path.resolve(b.thuMuc, ten.replace(/\.md$/, `-${i}.md`));
      try { writeFileSync(duong, noiDung); } catch {
        // Thư mục dự án không ghi được (chỉ đọc / đã xoá) ⇒ ghi vào thư mục nhà, nói rõ chỗ.
        duong = path.join(os.homedir(), path.basename(duong));
        writeFileSync(duong, noiDung);
      }
      traLoi(L(`Đã xuất ${S.muc.length} mục ra \`${path.relative(b.thuMuc, duong) || duong}\`.`, `Exported ${S.muc.length} items to \`${path.relative(b.thuMuc, duong) || duong}\`.`));
      return;
    }

    case '/doctor': {
      kho.thongBao(L('Đang chẩn đoán…', 'Running diagnostics…'));
      type MucCd = { ten: string; muc: 'ok' | 'canh' | 'loi'; chiTiet: string };
      const ds: MucCd[] = (await kn.goi<MucCd[]>('agent:chanDoan')
        .catch((e: Error): MucCd[] => [{ ten: L('Chẩn đoán', 'Diagnostics'), muc: 'loi', chiTiet: e.message }])) ?? [];
      const may = await kiemMay(b.phienBan).catch(() => []);
      const tat = [...may, ...ds];
      traLoi(`${ngonNgu() === 'en' ? chanDoanEn(tat) : moTaChanDoan(tat)}\n\n${L('_Phần máy (Node, PATH, trình duyệt…) giống `cuongmini doctor`; phần sau là chẩn đoán của lõi AI Code._', '_Machine checks (Node, PATH, browser…) match `cuongmini doctor`; the rest comes from the AI Code core._')}`);
      return;
    }

    case '/config': b.moMenu('config'); return;
    case '/tasks': b.moMenu('tasks'); return;
    case '/gateway': b.moMenu('cong'); return;
    case '/fullscreen': {
      const q = thamSo.trim().toLowerCase();
      b.datToanManHinh(/^(on|bat|bật|1|yes)$/.test(q) ? true : /^(off|tat|tắt|0|no)$/.test(q) ? false : undefined); // i18n-bo-qua: chữ người gõ
      return;
    }
    case '/language': {
      const q = chuanHoaTen(thamSo);
      if (q === 'vi' || q === 'tiengviet' || q === 'vietnamese') { b.doiNgonNgu('vi'); return; }
      if (q === 'en' || q === 'english' || q === 'tienganh') { b.doiNgonNgu('en'); return; }
      b.moMenu('ngonNgu');
      return;
    }

    case '/theme': {
      const q = chuanHoaTen(thamSo);
      const t = q === 'sang' || q === 'light' ? 'sang' : q === 'toi' || q === 'dark' ? 'toi' : q === 'tudong' || q === 'auto' ? 'tuDong' : null;
      if (!t) { b.moMenu('config'); return; }
      b.doiTheme(t);
      return;
    }

    case '/transcript': b.moMenu('banGhi'); return;

    case '/browser': {
      const q = thamSo.trim().toLowerCase();
      const bat = /^(on|bat|bật|1|yes)$/.test(q) ? true : /^(off|tat|tắt|0|no)$/.test(q) ? false : !kn.trinhDuyet; // i18n-bo-qua: chữ người gõ
      if (bat && !timTrinhDuyet()) {
        traLoi(L(`Không tìm thấy Chrome/Edge/Brave/Chromium trên máy. ${LOI_KHONG_CO_TRINH_DUYET.replace(/^Không tìm thấy trình duyệt nào trên máy\. /, '')}`, // i18n-bo-qua: chữ của lõi
          'No Chrome/Edge/Brave/Chromium found. Install Google Chrome or Microsoft Edge (or set CUONGMINI_TRINH_DUYET to the browser executable).'));
        return;
      }
      if (S.dangChay) { traLoi(L('Việc này đang chạy — đợi xong (hoặc esc) rồi đổi quyền trình duyệt.', 'A task is running — wait (or press esc) before changing browser access.')); return; }
      const ws = await kn.apTrinhDuyet(bat);
      if (ws) S.ws = ws as typeof S.ws;
      kho.thongBao(bat
        ? L('🌐 Trình duyệt cho AI: BẬT — AI mở được web, đọc trang, bấm, gõ trong cửa sổ Chrome/Edge riêng (hồ sơ riêng ~/.cuongmini/trinh-duyet). Tắt: /browser off',
          '🌐 AI browser: ON — the AI can open pages, read, click and type in a separate Chrome/Edge window (own profile ~/.cuongmini/trinh-duyet). Turn off: /browser off')
        : L('Trình duyệt cho AI: TẮT — AI không mở web ở phiên này. Bật lại: /browser on', 'AI browser: OFF — the AI won\'t open pages this session. Turn on: /browser on'), 'ok');
      return;
    }

    case '/copy': {
      // `/copy` câu trả lời cuối · `/copy 3` câu trả lời thứ 3 tính từ cuối · `/copy q [N]` câu hỏi · `/copy all` cả hội thoại.
      const ts = thamSo.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (ts[0] === 'all' || ts[0] === 'tat-ca') {
        const chu = S.muc.filter((m) => (m.kieu === 'nguoi' || m.kieu === 'may') && m.text).map((m) => `${m.kieu === 'nguoi' ? '> ' : ''}${m.text}`).join('\n\n');
        if (!chu) { traLoi(L('Chưa có gì để chép.', 'Nothing to copy yet.')); return; }
        await chepChu(chu);
        kho.thongBao(L(`Đã chép cả hội thoại (${chu.length} ký tự).`, `Copied the whole conversation (${chu.length} chars).`), 'ok');
        return;
      }
      const hoi = ts[0] === 'q' || ts[0] === 'hoi' || ts[0] === 'question';
      const n = Math.max(1, Number(ts[hoi ? 1 : 0]) || 1);
      const ds = S.muc.filter((m) => m.kieu === (hoi ? 'nguoi' : 'may') && m.text);
      const m = ds[ds.length - n];
      if (!m?.text) { traLoi(hoi ? L('Không có câu hỏi đó.', 'No such question.') : L('Không có câu trả lời đó.', 'No such answer.')); return; }
      await chepChu(m.text);
      kho.thongBao(hoi
        ? L(`Đã chép câu hỏi${n > 1 ? ` thứ ${n} từ cuối` : ' gần nhất'} (${m.text.length} ký tự).`, `Copied the ${n > 1 ? `#${n}-from-last` : 'last'} question (${m.text.length} chars).`)
        : L(`Đã chép câu trả lời${n > 1 ? ` thứ ${n} từ cuối` : ' gần nhất'} (${m.text.length} ký tự) vào clipboard.`, `Copied the ${n > 1 ? `#${n}-from-last` : 'last'} answer (${m.text.length} chars) to the clipboard.`), 'ok');
      return;
    }

    case '/mouse': {
      const q = thamSo.trim().toLowerCase();
      b.datChuot(/^(on|bat|bật|1|yes)$/.test(q) ? true : /^(off|tat|tắt|0|no)$/.test(q) ? false : undefined); // i18n-bo-qua: chữ người gõ
      return;
    }

    case '/add-dir': {
      const p = thamSo.trim().replace(/^['"]|['"]$/g, '');
      if (!p) { traLoi(L('Gõ đường thư mục: `/add-dir ../thu-vien-chung`', 'Give a directory: `/add-dir ../shared-lib`')); return; }
      const td = path.resolve(b.thuMuc, p.replace(/^~(?=$|[\\/])/, os.homedir()));
      try {
        if (!statSync(td).isDirectory()) throw new Error(L('không phải thư mục', 'not a directory'));
      } catch (e) { traLoi(L(`Không mở được \`${td}\`: ${(e as Error).message}`, `Cannot open \`${td}\`: ${(e as Error).message}`)); return; }
      await kn.goi('agent:themDuong', { duong: td });
      kho.thongBao(L(`Agent được làm việc thêm ở ${td}`, `The agent can now also work in ${td}`), 'ok');
      return;
    }

    case '/terminal-setup': {
      const tp = doTerminalPhim(process.env);
      if (tp === 'kitty' || tp === 'iterm') {
        traLoi(L('Terminal này hiểu **kitty keyboard protocol** — CuongMini bật nó lúc khởi động nên **Shift+Enter xuống dòng ngay**, không cần cấu hình gì. (Nếu vẫn bị gửi: iTerm2 → Settings → Profiles → Keys → General → bật *Report modifiers using CSI u*, hoặc dùng ctrl+j / `\\`+Enter.)',
          'This terminal speaks the **kitty keyboard protocol** — CuongMini enables it at startup, so **Shift+Enter inserts a newline** with no setup. (If it still sends: iTerm2 → Settings → Profiles → Keys → General → enable *Report modifiers using CSI u*, or use ctrl+j / `\\`+Enter.)'));
        return;
      }
      const loai = doTerminal();
      if (loai === 'vscode' || loai === 'cursor') {
        const r = caiVsCode(loai === 'cursor' ? 'Cursor' : 'Code');
        traLoi(r.daCo ? L(`Shift+Enter đã được cài sẵn trong \`${r.duong}\` — không đổi gì.`, `Shift+Enter is already set up in \`${r.duong}\` — nothing changed.`)
          : L(`Đã thêm Shift+Enter (gửi ESC+Enter ⇒ xuống dòng) vào \`${r.duong}\`${r.saoLuu ? ` — bản cũ sao lưu ở \`${r.saoLuu}\`` : ''}. Có tác dụng ngay trong terminal của ${loai === 'cursor' ? 'Cursor' : 'VS Code'}.`,
            `Added Shift+Enter (sends ESC+Enter ⇒ newline) to \`${r.duong}\`${r.saoLuu ? ` — backup at \`${r.saoLuu}\`` : ''}. Works right away in the ${loai === 'cursor' ? 'Cursor' : 'VS Code'} terminal.`));
        return;
      }
      traLoi(HUONG_DAN[loai]());
      return;
    }

    case '/offline':
      traLoi(L('AI ngoại tuyến (chạy trên máy) chỉ có trong app desktop CuongThai.', 'On-device (offline) AI is only available in the CuongThai desktop app.'));
      return;

    default:
      traLoi(L(`Lệnh \`${ten}\` chưa có trong CLI.`, `\`${ten}\` is not available in the CLI.`));
  }
}

/** Mở một việc cũ vào cuộc hiện tại và in lại hội thoại của nó. */
export async function moPhien(id: string, tieuDe: string, b: Pick<BoiCanhLenh, 'kho' | 'kn' | 'xoaManHinh'>): Promise<boolean> {
  const { kho, kn } = b;
  if (kho.S.dangChay) { kho.thongBao(L('Việc này đang chạy — dừng (esc) hoặc đợi xong rồi mới mở việc khác.', 'A task is running — stop it (esc) or wait before opening another.'), 'loi'); return false; }
  const r = await kn.goi<{ muc: Array<{ kieu: string; text?: string; ten?: string; tomTat?: string }> } | null>('agent:moPhien', { id });
  if (!r) { kho.thongBao(L('Không mở được việc này (file phiên đã mất).', 'Could not open this task (session file is gone).'), 'loi'); return false; }
  b.xoaManHinh();
  kho.xoaBang();
  kho.them({ loai: 'chao' });
  const S = kho.S;
  for (const m of r.muc) {
    if (m.kieu === 'nguoi') { kho.them({ loai: 'nguoi', text: m.text ?? '', luc: 0, soAnh: 0 }); S.muc.push({ kieu: 'nguoi', text: m.text ?? '' }); }
    else if (m.kieu === 'may') { kho.them({ loai: 'may', text: m.text ?? '' }); S.muc.push({ kieu: 'may', text: m.text ?? '' }); }
    else if (m.kieu === 'tool') { kho.them({ loai: 'tool', ten: m.ten ?? '', tomTat: m.tomTat ?? '', hong: false, moRong: false }); S.muc.push({ kieu: 'tool', ten: m.ten, tomTat: m.tomTat }); }
  }
  if (tieuDe) S.tieuDe = tieuDe;
  kho.thongBao(L(`↺ Đã mở lại việc cũ${tieuDe ? ` "${tieuDe}"` : ''} — hỏi tiếp là CuongMini nhớ toàn bộ ngữ cảnh.`, `↺ Resumed${tieuDe ? ` "${tieuDe}"` : ''} — CuongMini remembers the full context.`), 'ok');
  // Mở việc cũ = lõi nạp lại cuộc ⇒ gửi lại quyền trình duyệt, rồi đọc workspace mới.
  await kn.apTrinhDuyet().catch(() => undefined);
  try { S.ws = await kn.goi('agent:getWorkspace'); } catch { /* giữ ws cũ */ }
  kho.bao(true);
  return true;
}

const chuanHoaTen = (s: string): string => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[\s_-]+/g, ''); // i18n-bo-qua
