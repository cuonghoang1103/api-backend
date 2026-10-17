/**
 * LỆNH `/` của CuongMini CLI — cùng bộ lệnh với app desktop và extension VS
 * Code (`webview/lenh.ts`); phần thuần (danh sách, khớp bí danh, dựng câu trả
 * lời) lấy THẲNG từ `lenhGach.ts` của app qua alias `ct-lenh`.
 *
 * ⛔ Lệnh chạy CỤC BỘ không tốn lượt: chúng đọc trạng thái sẵn có hoặc hỏi một
 * route rẻ. Chỉ `/plan`, `/review`, `/init`, `/diff` (và lệnh của dự án) là
 * câu hỏi cho agent — chúng CẦN agent đọc mã.
 */
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
import { API_ORIGIN } from '../../cuongmini-core/src/dangNhap';
import { LOI_KHONG_CO_TRINH_DUYET, timTrinhDuyet } from '../../cuongmini-core/src/timTrinhDuyet';
import { caiVsCode, doTerminal, HUONG_DAN } from './caiTerminal';
import { kiemMay } from './doctor';
import { chepChu } from './heThong';
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

export { doiTenModel, NHOM_CONG, nhomCong, tenModel, tenNhomCong, type NhomCong } from './congModel';

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
  moMenu: (loai: 'model' | 'muc' | 'resume' | 'cheDo' | 'config' | 'rewind' | 'banGhi' | 'tasks' | 'ngonNgu' | 'cong') => void;
  /** Chọn một model 🔒 của cổng chính hãng: hỏi mật khẩu ⇒ mở khoá ⇒ đổi model. */
  moKhoaModel: (id: string) => void;
  /** /fullscreen on|off — không tham số thì đảo. */
  datToanManHinh: (bat?: boolean) => void;
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

export function tachLenhCli(text: string): { ten: string; thamSo: string } | null {
  return tachLenh(text, [...LENH_AGENT, ...(LENH_CLI as LenhGach[])]);
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
    kho.traLoi(L(`Lệnh \`${l.ten}\` lỗi: ${(e as Error).message}`, `Command \`${l.ten}\` failed: ${(e as Error).message}`));
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
        '**Gõ đặc biệt**\n- `!lệnh` chạy shell ngay ở thư mục dự án (không qua AI) — kết quả đi kèm câu hỏi kế tiếp\n- `# ghi chú` lưu thành quy ước dự án (AGENTS.md) — CuongMini đọc ở mọi lượt\n- `@đường` / `@tênHàm` nhắc file, thư mục, hàm/lớp · kéo file ảnh vào hoặc `ctrl+v` (Windows: `alt+v`) dán ảnh\n\n**Phím tắt**\n- `shift+tab` đổi chế độ quyền · `esc` dừng (hoặc huỷ hàng chờ) · `esc esc` quay lui về câu cũ · `ctrl+c` ×2 thoát\n- Đang chạy vẫn gõ + Enter được — tin vào **hàng chờ**, tự gửi khi xong\n- `↓` (ô nhập trống) vào bảng agent phụ · `/tasks` xem cả việc đã xong và lệnh nền\n- `ctrl+r` xem lại bảng ghi · `ctrl+o` mở/thu đầu ra lệnh cũ · `ctrl+p`/`ctrl+t` bảng kế hoạch · `ctrl+l` vẽ lại\n- `Alt+Enter`, `ctrl+j` hoặc `\\` cuối dòng để xuống dòng (`/terminal-setup` cho Shift+Enter) · `↑`/`↓` lịch sử\n\n_Lệnh chạy ngay tại đây không tốn lượt nào trừ /plan, /review, /init, /diff._',
        '**Special input**\n- `!command` runs a shell command in the project folder (no AI) — the output is attached to your next message\n- `# note` saves a project convention (AGENTS.md) — read on every turn\n- `@path` / `@functionName` mention files, folders, functions/classes · drag an image in or `ctrl+v` (Windows: `alt+v`) to paste one\n\n**Shortcuts**\n- `shift+tab` cycle permission mode · `esc` interrupt (or clear the queue) · `esc esc` rewind · `ctrl+c` ×2 quit\n- You can type while it works — messages are **queued** and sent when the turn ends\n- `↓` (empty input) opens the subagent panel · `/tasks` also shows finished tasks and shells\n- `ctrl+r` transcript · `ctrl+o` expand/collapse old outputs · `ctrl+p`/`ctrl+t` plan panel · `ctrl+l` redraw\n- `Alt+Enter`, `ctrl+j` or a trailing `\\` for a newline (`/terminal-setup` for Shift+Enter) · `↑`/`↓` history\n\n_Local commands cost nothing except /plan, /review, /init, /diff._',
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
        const kq = await kn.goi<Array<{ ten: string; loai: string; danhMuc: string }>>('agent:khoTim', { tuKhoa: tenKn });
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
      const ds = await kn.goi<Array<{ ten: string; loai: string; danhMuc: string }>>('agent:khoTim', { tuKhoa }).catch(() => []);
      traLoi(ds.length === 0 ? L(`Không có gì khớp "${tuKhoa}".`, `Nothing matches "${tuKhoa}".`)
        : `${L(`**${ds.length}** kết quả cho "${tuKhoa}":`, `**${ds.length}** results for "${tuKhoa}":`)}\n\n${ds.map((x) => `- \`${x.ten}\` · ${x.loai} · ${x.danhMuc}`).join('\n')}\n\n${L('Cài', 'Install')}: \`/kynang cai <${L('tên', 'name')}>\``);
      return;
    }

    case '/quyen': {
      const d = thamSo.split(/\s+/).filter(Boolean);
      if (d[0] === 'xoa' || d[0] === 'clear') {
        const rieng = d.slice(1).join(' ').trim();
        const n = await kn.goi<number>('agent:xoaQuyenLau', rieng ? { khoa: rieng } : {}) ?? 0;
        traLoi(n === 0 ? L('Không có quyền nào bị thu hồi.', 'Nothing was revoked.')
          : L(`Đã thu hồi **${n}** quyền${rieng ? ` cho \`${rieng}\`` : ' của dự án này'}.`, `Revoked **${n}** permission${n > 1 ? 's' : ''}${rieng ? ` for \`${rieng}\`` : ' for this project'}.`));
        return;
      }
      const r = await kn.goi<{ goc: string | null; khoa: string[] }>('agent:dsQuyenLau');
      if (!r?.goc) { traLoi(L('Chưa mở dự án nào.', 'No project is open.')); return; }
      traLoi(r.khoa.length === 0
        ? L(`Dự án \`${r.goc}\` chưa có quyền nào được "Luôn cho phép".`, `Project \`${r.goc}\` has no "always allow" permissions.`)
        : `${L(`**${r.khoa.length}** thứ đang được tự duyệt ở \`${r.goc}\`:`, `**${r.khoa.length}** items auto-approved in \`${r.goc}\`:`)}\n\n${r.khoa.map((x) => `- \`${x}\``).join('\n')}\n\n${L('Thu hồi tất cả: `/quyen xoa` · thu hồi một cái: `/quyen xoa <nguyên văn>`', 'Revoke all: `/quyen xoa` · revoke one: `/quyen xoa <exact text>`')}`);
      return;
    }

    case '/cost':
      traLoi(L(
        `**Chi phí việc này**\n\n- Đã tiêu: **~$${S.tienPhien.toFixed(3)}**\n- Số bước đã đi: ${S.buoc?.nay ?? 0}\n- File đã sửa (hoàn tác được): ${Object.keys(S.fileDaSua).length || S.soFileDaSua}\n\n_Con số là ƯỚC LƯỢNG. Chi tiết hạn mức: \`/usage\`._`,
        `**Cost of this task**\n\n- Spent: **~$${S.tienPhien.toFixed(3)}**\n- Steps: ${S.buoc?.nay ?? 0}\n- Files changed (undoable): ${Object.keys(S.fileDaSua).length || S.soFileDaSua}\n\n_These are ESTIMATES. Usage details: \`/usage\`._`,
      ));
      return;

    case '/undo': {
      const r = await kn.goi<{ soFile: number; loi: string[] }>('agent:hoanTac');
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
      traLoi(L(`Đã đổi model sang **${m.ten}** — ${m.mo}.`, `Model set to **${m.ten}** — ${m.mo}.`));
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
      traLoi(ngonNgu() === 'en' ? nguCanhEn(ct as NguCanhEn, 600_000, S.nguCanh?.soLuotDaBo ?? 0) : moTaNguCanh(ct, 600_000, S.nguCanh?.soLuotDaBo ?? 0));
      return;
    }

    case '/compact': {
      kho.thongBao(L(`Đang tóm tắt phần cũ${thamSo ? ` (giữ: ${thamSo})` : ''}…`, `Compacting older turns${thamSo ? ` (keeping: ${thamSo})` : ''}…`));
      const r = await kn.goi<{ ok: boolean; loi?: string; soTinDaGop?: number; soLuotDaGop?: number; xemTruoc?: string; kyTuTruoc?: number; kyTuSau?: number }>('agent:compact', thamSo ? { ghiChu: thamSo } : {});
      if (!r.ok) { traLoi(L(`Không /compact được: ${r.loi}`, `/compact failed: ${r.loi}`)); return; }
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
      const phien = await kn.goi<PhienCu[]>('agent:dsPhien');
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
      if (!r.ok) { traLoi(r.loi ?? L('Không quay lui được.', 'Could not rewind.')); return; }
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
      const ds = await kn.goi<Array<{ id: string; tieuDe: string; apDung: string; phamVi: string; lanKhop: number }>>('agent:boNhoDs');
      traLoi(ds.length === 0 ? L('**Bộ nhớ bài học** trống — CuongMini tự ghi nhớ khi bạn sửa nó hoặc khi gặp bẫy của dự án.', '**Memory** is empty — CuongMini saves lessons when you correct it or hits a project pitfall.')
        : `${L('**Bộ nhớ bài học**', '**Memory**')} (${ds.length}):\n\n${ds.slice(0, 40).map((x) => `- **${x.tieuDe}** _(${x.phamVi}, ${L(`khớp ${x.lanKhop} lần`, `matched ${x.lanKhop}×`)})_ — ${x.apDung}`).join('\n')}\n\n${L('_Muốn CuongMini quên một bài: nói "quên bài học …"._', '_To make CuongMini forget one, say "forget lesson …"._')}`);
      return;
    }

    case '/hooks':
      await kn.goi('agent:hookMoCauHinh');
      kho.thongBao(L('Đã mở file cấu hình hook bằng chương trình mặc định.', 'Opened the hooks config in your default app.'));
      return;

    case '/mcp': {
      if (/^(mo|open)$/i.test(thamSo)) { await kn.goi('agent:mcpMoCauHinh'); kho.thongBao(L('Đã mở file cấu hình MCP bằng chương trình mặc định.', 'Opened the MCP config in your default app.')); return; }
      if (/^(nap|reload)$/i.test(thamSo)) await kn.goi('agent:mcpNapLai').catch(() => undefined);
      const tt = await kn.goi<{ duongDan: string; server: Array<{ ten: string; ok: boolean; soTool: number; loi?: string; canDuyet?: boolean }>; loiCauHinh?: string | null } | null>('agent:mcpTrangThai').catch(() => null);
      const sv = tt?.server ?? [];
      traLoi(`${L('**Máy chủ MCP**', '**MCP servers**')}${sv.length ? `\n\n${sv.map((x) => `- ${x.ok ? '✓' : x.canDuyet ? '⏸' : '✗'} \`${x.ten}\`${x.soTool ? ` · ${x.soTool} tool` : ''}${x.loi ? ` · ${x.loi}` : ''}${x.canDuyet ? L(' · chờ duyệt', ' · awaiting approval') : ''}`).join('\n')}` : L(' — chưa cấu hình máy chủ nào.', ' — none configured.')}${tt?.loiCauHinh ? `\n\n⚠ ${L('File cấu hình hỏng', 'Config file is broken')}: ${tt.loiCauHinh}` : ''}\n\n${L(`File cấu hình: \`${tt?.duongDan ?? '?'}\` · mở bằng \`/mcp mo\` · sửa xong gõ \`/mcp nap\` để nạp lại.`, `Config file: \`${tt?.duongDan ?? '?'}\` · open with \`/mcp mo\` · reload with \`/mcp nap\` after editing.`)}`);
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
      writeFileSync(duong, noiDung);
      traLoi(L(`Đã xuất ${S.muc.length} mục ra \`${path.relative(b.thuMuc, duong) || duong}\`.`, `Exported ${S.muc.length} items to \`${path.relative(b.thuMuc, duong) || duong}\`.`));
      return;
    }

    case '/doctor': {
      kho.thongBao(L('Đang chẩn đoán…', 'Running diagnostics…'));
      type MucCd = { ten: string; muc: 'ok' | 'canh' | 'loi'; chiTiet: string };
      const ds: MucCd[] = await kn.goi<MucCd[]>('agent:chanDoan')
        .catch((e: Error): MucCd[] => [{ ten: L('Chẩn đoán', 'Diagnostics'), muc: 'loi', chiTiet: e.message }]);
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
      const cuoi = [...S.muc].reverse().find((m) => m.kieu === 'may' && m.text);
      if (!cuoi?.text) { traLoi(L('Chưa có câu trả lời nào để chép.', 'No answer to copy yet.')); return; }
      await chepChu(cuoi.text);
      kho.thongBao(L(`Đã chép câu trả lời gần nhất (${cuoi.text.length} ký tự) vào clipboard.`, `Copied the last answer (${cuoi.text.length} chars) to the clipboard.`), 'ok');
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
