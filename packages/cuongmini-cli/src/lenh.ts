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
import { moTaCheDo } from './cheDo';
import { L, ngonNgu, nhieu } from './i18n';
import { LENH_CLI, troGiup } from './lenhMoTa';
import { chanDoanEn, dsCauHoiEn, dsPhienEn, nguCanhEn, trangThaiEn, usageEn, type NguCanhEn } from './moTaHaiNgu';
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
}
export interface MucNoLuc { id: string; ten: string; mo: string }

export { LENH_CLI };

/** Lệnh hiện trong gợi ý `/` (bỏ `/offline` — AI ngoại tuyến chỉ có trong app). */
export const LENH_GOI_Y: LenhGach[] = [...LENH_AGENT.filter((l) => l.ten !== '/offline'), ...(LENH_CLI as LenhGach[])];

export const MODEL_DU_PHONG: ModelMuc[] = [
  { id: 'sonnet-5', ten: 'Cuong Sonnet 5', get mo() { return L('Mặc định — nhanh, rẻ', 'Default — fast, cheap'); }, dungDuoc: true },
  { id: 'opus-4-8', ten: 'CuongMini Max 4.8', get mo() { return L('Mạnh nhất cho việc khó', 'Strongest for hard tasks'); }, dungDuoc: true },
  { id: 'gpt-sol', ten: 'GPT 6 Sol', get mo() { return L('Ý kiến thứ hai', 'A second opinion'); }, dungDuoc: true },
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
      const coBan = troGiup(LENH_GOI_Y, S.lenhDuAn);
      traLoi(`${coBan}\n\n${L(
        '**Gõ đặc biệt**\n- `!lệnh` chạy shell ngay ở thư mục dự án (không qua AI) — kết quả đi kèm câu hỏi kế tiếp\n- `# ghi chú` lưu thành quy ước dự án (AGENTS.md) — CuongMini đọc ở mọi lượt\n- `@đường` / `@tênHàm` nhắc file, thư mục, hàm/lớp · kéo file ảnh vào hoặc `ctrl+v` (Windows: `alt+v`) dán ảnh\n\n**Phím tắt**\n- `shift+tab` đổi chế độ quyền · `esc` dừng (hoặc huỷ hàng chờ) · `esc esc` quay lui về câu cũ · `ctrl+c` ×2 thoát\n- Đang chạy vẫn gõ + Enter được — tin vào **hàng chờ**, tự gửi khi xong\n- `↓` (ô nhập trống) vào bảng agent phụ · `/tasks` xem cả việc đã xong và lệnh nền\n- `ctrl+r` xem lại bảng ghi · `ctrl+o` mở/thu đầu ra lệnh cũ · `ctrl+p`/`ctrl+t` bảng kế hoạch · `ctrl+l` vẽ lại\n- `Shift+Enter` (terminal hỗ trợ CSI u: iTerm2 ≥ 3.5, kitty, WezTerm, ghostty), `Alt+Enter`, `ctrl+j` hoặc `\\` cuối dòng để xuống dòng (`/terminal-setup`) \n- Toàn màn hình: con lăn / `↑` `↓` (ô nhập trống) / PgUp PgDn cuộn bản ghi — ô nhập luôn ở đáy · `ctrl+↑`/`ctrl+↓` lịch sử câu hỏi · kéo chuột bôi đen chép như thường (`/mouse on` để bắt chuột) · `/copy` chép câu trả lời\n\n_Lệnh chạy ngay tại đây không tốn lượt nào trừ /plan, /review, /init, /diff._',
        '**Special input**\n- `!command` runs a shell command in the project folder (no AI) — the output is attached to your next message\n- `# note` saves a project convention (AGENTS.md) — read on every turn\n- `@path` / `@functionName` mention files, folders, functions/classes · drag an image in or `ctrl+v` (Windows: `alt+v`) to paste one\n\n**Shortcuts**\n- `shift+tab` cycle permission mode · `esc` interrupt (or clear the queue) · `esc esc` rewind · `ctrl+c` ×2 quit\n- You can type while it works — messages are **queued** and sent when the turn ends\n- `↓` (empty input) opens the subagent panel · `/tasks` also shows finished tasks and shells\n- `ctrl+r` transcript · `ctrl+o` expand/collapse old outputs · `ctrl+p`/`ctrl+t` plan panel · `ctrl+l` redraw\n- `Shift+Enter` (CSI u terminals: iTerm2 ≥ 3.5, kitty, WezTerm, ghostty), `Alt+Enter`, `ctrl+j` or a trailing `\\` for a newline (`/terminal-setup`) \n- Fullscreen: wheel / `↑` `↓` (empty input) / PgUp PgDn scroll the transcript — the input stays pinned · `ctrl+↑`/`ctrl+↓` prompt history · drag to select & copy as usual (`/mouse on` to capture the mouse) · `/copy` copies an answer\n\n_Local commands cost nothing except /plan, /review, /init, /diff._',
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
      const hien = (k: string): string => (k.startsWith('tien-to:') ? `\`${k.slice(8)} …\` ${L('(mọi lệnh bắt đầu bằng)', '(any command starting with)')}` : `\`${k}\``);
      traLoi(r.khoa.length === 0
        ? L(`Dự án \`${r.goc}\` chưa có quyền nào được "Luôn cho phép". Thêm: \`/quyen them npm test\`.`, `Project \`${r.goc}\` has no "always allow" permissions. Add one: \`/quyen add npm test\`.`)
        : `${L(`**${r.khoa.length}** thứ đang được tự duyệt ở \`${r.goc}\`:`, `**${r.khoa.length}** item${r.khoa.length === 1 ? '' : 's'} auto-approved in \`${r.goc}\`:`)}\n\n${r.khoa.map((x, i) => `${i + 1}. ${hien(x)}`).join('\n')}\n\n${L('Thêm tiền tố: `/quyen them npm test` · thu hồi một mục: `/quyen xoa <số>` · tất cả: `/quyen xoa`', 'Add a prefix: `/quyen add npm test` · revoke one: `/quyen remove <n>` · all: `/quyen remove`')}`);
      return;
    }

    case '/ctwork': {
      const q = chuanHoaTen(thamSo);
      if (/^(off|tat|ngat|go|remove)$/.test(q)) {
        const r = await kn.goi<{ ok: boolean; loi?: string }>('agent:ctwork', { viec: 'ngat' });
        traLoi(r?.ok ? L('Đã ngắt CT Work: thu hồi token, xoá khỏi kho bí mật, gỡ server `ctwork`.', 'Disconnected CT Work: token revoked, removed from the secret store, `ctwork` server removed.') : `⚠ ${r?.loi ?? '?'}`);
        return;
      }
      if (/^(doc|read|ghi|write)$/.test(q)) {
        const quyen = /^(ghi|write)$/.test(q) ? 'ghi' : 'doc';
        kho.thongBao(L('Đang kết nối CT Work…', 'Connecting CT Work…'));
        const r = await kn.goi<{ ok: boolean; loi?: string; soTool?: number }>('agent:ctwork', { viec: 'noi', quyen });
        traLoi(r?.ok ? L(`✓ ctwork · ${r.soTool ?? 0} tool (${quyen === 'ghi' ? 'đọc + ghi' : 'chỉ đọc'}).`, `✓ ctwork · ${r.soTool ?? 0} tools (${quyen === 'ghi' ? 'read + write' : 'read only'}).`) : `⚠ ${r?.loi ?? '?'}`);
        return;
      }
      const t = await kn.goi<{ coToken?: boolean; quyen?: string | null; bienTay?: boolean; server?: { ok: boolean; soTool: number; loi?: string } | null }>('agent:ctwork', { viec: 'trangThai' }).catch(() => null);
      if (t?.server?.ok) {
        traLoi(L(`✓ ctwork · ${t.server.soTool} tool · ${t.bienTay ? 'token từ biến môi trường CTWORK_TOKEN' : t.quyen === 'ghi' ? 'đọc + ghi' : 'chỉ đọc'}. Đổi quyền: \`/ctwork doc\` · \`/ctwork ghi\` · ngắt: \`/ctwork off\`.`, `✓ ctwork · ${t.server.soTool} tools · ${t.bienTay ? 'token from the CTWORK_TOKEN env var' : t.quyen === 'ghi' ? 'read + write' : 'read only'}. Change: \`/ctwork read\` · \`/ctwork write\` · disconnect: \`/ctwork off\`.`));
        return;
      }
      b.moMenu('ctwork');
      return;
    }

    case '/sessions': {
      const r = await kn.goi<{ toi: { id: string; ten: string } | null; ds: Array<{ id: string; ten: string; noi: string; thuMuc: string | null; trangThai: string }> } | null>('agent:dsPhienMang').catch(() => null);
      if (!r) { traLoi(L('Lõi này chưa hỗ trợ nhắn giữa phiên.', 'This core does not support cross-session messaging yet.')); return; }
      const toi = r.toi ? `${L('Phiên này', 'This session')}: **${r.toi.ten}** (\`${r.toi.id}\`)` : L('Phiên này chưa đăng ký (đăng ký sau lượt đầu tiên).', 'This session is not registered yet (registers after the first turn).');
      traLoi(`${toi}\n\n${r.ds.length
        ? `${L('Phiên khác đang mở', 'Other open sessions')}:\n\n${r.ds.map((x) => `- \`${x.id}\` **${x.ten}** · ${x.noi} · ${x.trangThai === 'dangChay' ? L('đang chạy', 'running') : L('rảnh', 'idle')} · ${x.thuMuc ?? '—'}`).join('\n')}\n\n${L('Agent tự nhắn được cho các phiên này — bạn duyệt từng tin trước khi gửi. Đổi tên phiên này: `/rename <tên>`.', 'The agent can message them — you approve each message before it is sent. Rename this session: `/rename <name>`.')}`
        : L('Không có phiên CuongMini nào khác đang mở trên máy này.', 'No other CuongMini session is open on this machine.')}`);
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

    case '/hen': {
      const d = thamSo.split(/\s+/).filter(Boolean);
      if ((d[0] ?? '').toLowerCase() === 'huy' || (d[0] ?? '').toLowerCase() === 'cancel') {
        const n = await kn.goi<number>('agent:huyHen', d[1] ? { id: d[1].replace(/^#/, '') } : {}).catch(() => 0) ?? 0;
        traLoi(L(`Đã huỷ ${n} hẹn.`, `Cancelled ${n} schedule${n === 1 ? '' : 's'}.`));
        return;
      }
      const r = await kn.goi<{ cho: Array<{ id: string; moTa: string; hetLuc: number }>; hen: Array<{ id: string; lyDo: string; luc: number; lap: boolean; phut: number; conLai: number }> } | null>('agent:henCho').catch(() => null);
      if (!r || (!r.cho.length && !r.hen.length)) { traLoi(L('Không có việc chờ hay hẹn nào.', 'Nothing is waiting or scheduled.')); return; }
      const gioP = (t: number) => new Date(t).toLocaleTimeString(L('vi-VN', 'en-US'), { hour: '2-digit', minute: '2-digit' });
      traLoi([
        ...r.cho.map((c) => `- ⏳ ${L('Đang chờ', 'Waiting')}: ${dichMoTaCho(c.moTa)} · ${L('còn', 'left')} ${Math.max(0, Math.round((c.hetLuc - Date.now()) / 1000))}s`),
        ...r.hen.map((h) => `- ⏰ \`${h.id}\` ${gioP(h.luc)}${h.lap ? L(` · lặp mỗi ${h.phut}′ · còn ${h.conLai}×`, ` · every ${h.phut}′ · ${h.conLai}× left`) : ''} — ${h.lyDo}`),
        '', L('Huỷ: `/hen huy <id>` hoặc `/hen huy` (tất cả) · bỏ chờ: esc khi đang chờ. Hẹn chỉ chạy khi CuongMini còn mở.', 'Cancel: `/hen cancel <id>` or `/hen cancel` (all) · stop waiting: esc while waiting. Schedules only fire while CuongMini is open.'),
      ].join('\n'));
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
      if (!m) { traLoi(`${L(`Không rõ model "${q}". Có:`, `Unknown model "${q}". Available:`)}\n\n${b.dsModel().map((x) => `- \`${x.id}\` — ${x.ten}${x.dungDuoc ? '' : L(' (chưa mở)', ' (not enabled)')}`).join('\n')}`); return; }
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
      const nayModel = b.dsModel().find((x) => x.id === (S.ws?.model ?? 'sonnet-5'));
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
      if (napLai) await kn.goi('agent:mcpNapLai').catch(() => undefined);
      const tt = await kn.goi<{ duongDan: string; server: Array<{ ten: string; ok: boolean; soTool: number; loi?: string; canDuyet?: boolean }>; loiCauHinh?: string | null } | null>('agent:mcpTrangThai').catch(() => null);
      const sv = tt?.server ?? [];
      traLoi(`${napLai ? L('✓ Đã nạp lại cấu hình MCP.\n\n', '✓ MCP config reloaded.\n\n') : ''}${L('**Máy chủ MCP**', '**MCP servers**')}${sv.length ? `\n\n${sv.map((x) => `- ${x.ok ? '✓' : x.canDuyet ? '⏸' : '✗'} \`${x.ten}\`${x.soTool ? ` · ${x.soTool} ${L('tool', x.soTool === 1 ? 'tool' : 'tools')}` : ''}${x.loi ? ` · ${x.loi}` : ''}${x.canDuyet ? L(' · chờ duyệt', ' · awaiting approval') : ''}`).join('\n')}` : L(' — chưa cấu hình máy chủ nào.', ' — none configured.')}${tt?.loiCauHinh ? `\n\n⚠ ${L('File cấu hình hỏng', 'Config file is broken')}: ${tt.loiCauHinh}` : ''}\n\n${L(`File cấu hình: \`${tt?.duongDan ?? '?'}\` · mở bằng \`/mcp mo\` · sửa xong gõ \`/mcp nap\` để nạp lại.`, `Config file: \`${tt?.duongDan ?? '?'}\` · open with \`/mcp open\` · reload with \`/mcp reload\` after editing.`)}`);
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
