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
  LENH_AGENT, PROMPT_DUYET_KE_HOACH, PROMPT_INIT, TEN_CHE_DO, chonPhien, dsCauHoi, layUsage, locPhien, moTaChanDoan,
  moTaDsCauHoi, moTaDsPhien, moTaNguCanh, moTaTrangThai, moTaTroGiup, moTaUsage, promptPlan, promptReview, tachLenh,
  tenFileXuat, timMuc, timTheoChu, xuatMarkdown, type LenhGach, type MucGhi, type PhienCu,
} from 'ct-lenh';
import { API_ORIGIN } from '../../cuongmini-core/src/dangNhap';
import { caiVsCode, doTerminal, HUONG_DAN } from './caiTerminal';
import { kiemMay } from './doctor';
import { chepChu } from './heThong';
import type { KetNoiLoi } from './ketNoi';
import type { KhoChat } from './kho';

export interface ModelMuc { id: string; ten: string; mo: string; dungDuoc: boolean; dat?: boolean }
export interface MucNoLuc { id: string; ten: string; mo: string }

/** Lệnh chỉ có ở CLI. */
export const LENH_CLI: LenhGach[] = [
  { ten: '/login', mo: 'Đăng nhập lại / đổi tài khoản', khac: ['/dangnhap'], nhom: 'co-ban' },
  { ten: '/logout', mo: 'Đăng xuất (xoá phiên trên máy) rồi thoát', khac: ['/dangxuat'], nhom: 'co-ban' },
  { ten: '/exit', mo: 'Thoát CuongMini', khac: ['/quit', '/thoat', '/q'], nhom: 'co-ban' },
  { ten: '/config', mo: 'Cài đặt: giao diện sáng/tối, thông báo, chế độ & model mặc định', khac: ['/caidat', '/settings'], nhom: 'co-ban' },
  { ten: '/theme', mo: 'Đổi giao diện sáng / tối / tự động', khac: ['/giaodien'], thamSo: '[sang|toi|tu-dong]', nhom: 'co-ban' },
  { ten: '/terminal-setup', mo: 'Cài Shift+Enter xuống dòng cho terminal (VS Code, Cursor) hoặc xem hướng dẫn', khac: ['/caiterminal'], nhom: 'cong-cu' },
  { ten: '/add-dir', mo: 'Cho agent đọc/sửa thêm một thư mục ngoài dự án', khac: ['/themthumuc'], thamSo: '<đường dẫn>', nhom: 'lam-viec' },
  { ten: '/copy', mo: 'Chép câu trả lời gần nhất vào clipboard', khac: ['/chep'], nhom: 'lam-viec' },
  { ten: '/transcript', mo: 'Xem lại toàn bộ bảng ghi (ctrl+r)', khac: ['/banghi'], nhom: 'phien' },
];

/** Lệnh hiện trong gợi ý `/` (bỏ `/offline` — AI ngoại tuyến chỉ có trong app). */
export const LENH_GOI_Y: LenhGach[] = [...LENH_AGENT.filter((l) => l.ten !== '/offline'), ...LENH_CLI];

export const MODEL_DU_PHONG: ModelMuc[] = [
  { id: 'sonnet-5', ten: 'Cuong Sonnet 5', mo: 'Mặc định — nhanh, rẻ', dungDuoc: true },
  { id: 'opus-4-8', ten: 'CuongMini Max 4.8', mo: 'Mạnh nhất cho việc khó', dungDuoc: true },
  { id: 'gpt-sol', ten: 'GPT 6 Sol', mo: 'Ý kiến thứ hai', dungDuoc: true },
];
export const MUC_DU_PHONG: MucNoLuc[] = [
  { id: 'thap', ten: 'Thấp', mo: 'hỏi nhanh' }, { id: 'vua', ten: 'Vừa', mo: 'mặc định' }, { id: 'cao', ten: 'Cao', mo: 'đọc rộng, tự test' },
  { id: 'ratCao', ten: 'Rất cao', mo: 'nhiều agent phụ' }, { id: 'toiDa', ten: 'Tối đa', mo: 'việc rất lớn' },
];

/** Tên model do máy chủ khai ⇒ tên thương hiệu CuongThai (như extension). */
export const doiTenModel = (ten: string): string => ten.replace(/^Claude Sonnet\b/, 'Cuong Sonnet').replace(/^Claude Opus\b/, 'CuongMini Max')
  .replace(/^Claude Haiku\b/, 'Cuong Haiku').replace(/^Claude Fable\b/, 'Cuong Fable');

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
  moMenu: (loai: 'model' | 'muc' | 'resume' | 'cheDo' | 'config' | 'rewind' | 'banGhi') => void;
  /** Đổi theme ngay (vẽ lại màn hình) và lưu cài đặt. */
  doiTheme: (t: 'tuDong' | 'toi' | 'sang') => void;
  datNhap: (t: string) => void;
  xoaManHinh: () => void;
  dangXuat: () => Promise<void>;
  dangNhapLai: () => void;
  thoat: () => void;
}

export function tachLenhCli(text: string): { ten: string; thamSo: string } | null {
  return tachLenh(text, [...LENH_AGENT, ...LENH_CLI]);
}

export async function chayLenh(text: string, b: BoiCanhLenh): Promise<void> {
  const { kho } = b;
  if (text === '__duyetKeHoach') {
    if ((kho.S.ws?.cheDoQuyen ?? 'keHoach') === 'keHoach') await b.doiCheDo('hoi').catch(() => undefined);
    b.guiThat(PROMPT_DUYET_KE_HOACH, { hienThi: '✅ Làm theo kế hoạch' });
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
  if (!l) { kho.traLoi(`Không có lệnh \`${dau}\`. Gõ \`/help\` để xem danh sách.`); return; }
  try {
    await chay(l.ten, l.thamSo, text.trim(), b);
  } catch (e) {
    kho.traLoi(`Lệnh \`${l.ten}\` lỗi: ${(e as Error).message}`);
  }
}

async function chay(ten: string, thamSo: string, goc: string, b: BoiCanhLenh): Promise<void> {
  const { kho, kn } = b;
  const S = kho.S;
  const traLoi = (t: string) => kho.traLoi(t);
  switch (ten) {
    case '/help': {
      const coBan = moTaTroGiup(LENH_GOI_Y, S.lenhDuAn).replace(/ngay trong app/g, 'ngay tại đây').replace(/trong app/g, 'tại đây');
      traLoi(`${coBan}\n\n**Gõ đặc biệt**\n- \`!lệnh\` chạy shell ngay ở thư mục dự án (không qua AI) — kết quả đi kèm câu hỏi kế tiếp\n- \`# ghi chú\` lưu thành quy ước dự án (AGENTS.md) — CuongMini đọc ở mọi lượt\n- \`@đường\` / \`@tênHàm\` nhắc file, thư mục, hàm/lớp · kéo file ảnh vào hoặc \`ctrl+v\` (Windows: \`alt+v\`) dán ảnh\n\n**Phím tắt**\n- \`shift+tab\` đổi chế độ quyền · \`esc\` dừng (hoặc huỷ hàng chờ) · \`esc esc\` quay lui về câu cũ · \`ctrl+c\` ×2 thoát\n- Đang chạy vẫn gõ + Enter được — tin vào **hàng chờ**, tự gửi khi xong\n- \`ctrl+r\` xem lại bảng ghi · \`ctrl+o\` mở/thu đầu ra lệnh cũ · \`ctrl+p\`/\`ctrl+t\` bảng kế hoạch · \`ctrl+l\` vẽ lại\n- \`Alt+Enter\`, \`ctrl+j\` hoặc \`\\\` cuối dòng để xuống dòng (\`/terminal-setup\` cho Shift+Enter) · \`↑\`/\`↓\` lịch sử`);
      return;
    }

    case '/clear':
      if (S.dangChay) { traLoi('Việc này đang chạy — bấm `esc` để dừng trước.'); return; }
      await kn.goi('agent:reset');
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
        if (!tenKn) { traLoi('Thiếu tên. Ví dụ: `/kynang cai database-optimizer`'); return; }
        kho.thongBao(`Đang tải ${tenKn}…`);
        const kq = await kn.goi<Array<{ ten: string; loai: string; danhMuc: string }>>('agent:khoTim', { tuKhoa: tenKn });
        const m = kq.find((x) => x.ten === tenKn) ?? kq[0];
        if (!m) { traLoi(`Không tìm thấy \`${tenKn}\` trong kho.`); return; }
        const r = await kn.goi<{ ok: boolean; duongDan?: string; xemTruoc?: string; loi?: string }>('agent:khoCai', { ten: m.ten, loai: m.loai, ghiDe: phan.includes('--de') });
        traLoi(r.ok
          ? `Đã cài **${m.ten}** (${m.loai}) vào \`${r.duongDan}\`.\n\nAgent thấy nó từ lượt sau. Xem lại bằng \`git diff\` trước khi commit — đây là nội dung từ repo của người khác.\n\n\`\`\`\n${(r.xemTruoc ?? '').slice(0, 600)}\n\`\`\``
          : `Không cài được: ${r.loi}`);
        return;
      }
      const tuKhoa = thamSo.trim();
      if (!tuKhoa) {
        traLoi('**Kho AI Templates** — hàng nghìn kỹ năng, agent phụ, lệnh.\n\n- Tìm: `/kynang <từ khoá>` (bỏ dấu cũng ra)\n- Cài: `/kynang cai <tên>` · ghi đè: thêm `--de`\n\n_Hook và MCP không cài từ đây — chúng là lệnh sẽ chạy, và có cửa duyệt riêng._');
        return;
      }
      const ds = await kn.goi<Array<{ ten: string; loai: string; danhMuc: string }>>('agent:khoTim', { tuKhoa }).catch(() => []);
      traLoi(ds.length === 0 ? `Không có gì khớp "${tuKhoa}".`
        : `**${ds.length}** kết quả cho "${tuKhoa}":\n\n${ds.map((x) => `- \`${x.ten}\` · ${x.loai} · ${x.danhMuc}`).join('\n')}\n\nCài: \`/kynang cai <tên>\``);
      return;
    }

    case '/quyen': {
      const d = thamSo.split(/\s+/).filter(Boolean);
      if (d[0] === 'xoa' || d[0] === 'clear') {
        const rieng = d.slice(1).join(' ').trim();
        const n = await kn.goi<number>('agent:xoaQuyenLau', rieng ? { khoa: rieng } : {}) ?? 0;
        traLoi(n === 0 ? 'Không có quyền nào bị thu hồi.' : `Đã thu hồi **${n}** quyền${rieng ? ` cho \`${rieng}\`` : ' của dự án này'}.`);
        return;
      }
      const r = await kn.goi<{ goc: string | null; khoa: string[] }>('agent:dsQuyenLau');
      if (!r?.goc) { traLoi('Chưa mở dự án nào.'); return; }
      traLoi(r.khoa.length === 0
        ? `Dự án \`${r.goc}\` chưa có quyền nào được "Luôn cho phép".`
        : `**${r.khoa.length}** thứ đang được tự duyệt ở \`${r.goc}\`:\n\n${r.khoa.map((x) => `- \`${x}\``).join('\n')}\n\nThu hồi tất cả: \`/quyen xoa\` · thu hồi một cái: \`/quyen xoa <nguyên văn>\``);
      return;
    }

    case '/cost':
      traLoi(`**Chi phí việc này**\n\n- Đã tiêu: **~$${S.tienPhien.toFixed(3)}**\n- Số bước đã đi: ${S.buoc?.nay ?? 0}\n- File đã sửa (hoàn tác được): ${Object.keys(S.fileDaSua).length || S.soFileDaSua}\n\n_Con số là ƯỚC LƯỢNG. Chi tiết hạn mức: \`/usage\`._`);
      return;

    case '/undo': {
      const r = await kn.goi<{ soFile: number; loi: string[] }>('agent:hoanTac');
      if (r.soFile > 0) S.fileDaSua = {};
      traLoi(r.soFile === 0 && !r.loi.length ? 'Chưa có file nào để hoàn tác trong việc này.'
        : `Đã hoàn tác **${r.soFile}** file.${r.loi.length ? `\n\nKhông hoàn tác được: ${r.loi.join('; ')}` : ''}`);
      return;
    }

    case '/diff':
      b.guiThat('Chạy git_diff rồi tóm tắt ngắn gọn những gì đã thay đổi trong dự án.', { chiDoc: true, hienThi: goc });
      return;

    case '/model': {
      const q = thamSo.trim();
      if (!q) { b.moMenu('model'); return; }
      const m = timTheoChu(q, b.dsModel());
      if (!m) { traLoi(`Không rõ model "${q}". Có:\n\n${b.dsModel().map((x) => `- \`${x.id}\` — ${x.ten}${x.dungDuoc ? '' : ' (chưa mở)'}`).join('\n')}`); return; }
      if (!m.dungDuoc) { traLoi(`**${m.ten}** chưa dùng được — máy chủ chưa mở nhà cung cấp này.`); return; }
      if (m.dat) { b.moMenu('model'); traLoi(`**${m.ten}** tốn nhiều hơn hẳn — chọn lại trong menu vừa mở để xác nhận.`); return; }
      await b.doiModel(m.id);
      traLoi(`Đã đổi model sang **${m.ten}** — ${m.mo}.`);
      return;
    }

    case '/effort': {
      const q = thamSo.trim();
      if (!q) { b.moMenu('muc'); return; }
      const m = timMuc(q, b.dsMuc());
      if (!m) { traLoi(`Không rõ mức "${q}". Có: ${b.dsMuc().map((x) => x.ten).join(' · ')}.`); return; }
      await b.doiMuc(m.id);
      traLoi(`Đã đổi mức nỗ lực sang **${m.ten}** — ${m.mo}.`);
      return;
    }

    case '/usage': {
      kho.thongBao('Đang hỏi hạn mức…');
      const u = await layUsage(async (duong) => {
        const r = await fetch(`${API_ORIGIN}${duong}`, { headers: { authorization: `Bearer ${kn.nguoi.token}` }, signal: AbortSignal.timeout(15_000) });
        const j = await r.json().catch(() => ({})) as { data?: unknown; message?: string };
        if (!r.ok) throw new Error(j.message ?? `Máy chủ trả HTTP ${r.status}.`);
        return j.data ?? j;
      });
      traLoi(moTaUsage(u).replace('nhập ở nút bên dưới khi hết hạn mức', 'nhập trong app/web khi hết hạn mức'));
      return;
    }

    case '/context': {
      const ct = await kn.goi('agent:nguCanhChiTiet');
      traLoi(moTaNguCanh(ct, 600_000, S.nguCanh?.soLuotDaBo ?? 0));
      return;
    }

    case '/compact': {
      kho.thongBao(`Đang tóm tắt phần cũ${thamSo ? ` (giữ: ${thamSo})` : ''}…`);
      const r = await kn.goi<{ ok: boolean; loi?: string; soTinDaGop?: number; soLuotDaGop?: number; xemTruoc?: string; kyTuTruoc?: number; kyTuSau?: number }>('agent:compact', thamSo ? { ghiChu: thamSo } : {});
      if (!r.ok) { traLoi(`Không /compact được: ${r.loi}`); return; }
      if (!r.soTinDaGop) { traLoi('Việc này còn ngắn — chưa có gì để gộp.'); return; }
      S.daCompact = true;
      const k = (n?: number): string => (n === undefined ? '?' : `${Math.round(n / 1000)}k`);
      traLoi(`Đã gộp **${r.soLuotDaGop ?? '?'} lượt đầu** vào một bản tóm tắt. Ngữ cảnh gửi lên: **${k(r.kyTuTruoc)} → ${k(r.kyTuSau)}** ký tự.\n\n> ${(r.xemTruoc ?? '').split('\n').slice(0, 8).join('\n> ')}`);
      return;
    }

    case '/status': {
      const nayModel = b.dsModel().find((x) => x.id === (S.ws?.model ?? 'sonnet-5'));
      const nayMuc = b.dsMuc().find((x) => x.id === (S.ws?.mucNoLuc ?? 'vua'));
      traLoi(`${moTaTrangThai({
        phienBan: `CuongMini CLI ${b.phienBan} · Node ${process.versions.node}`,
        cong: 'chinh', online: true,
        duAn: S.ws?.name ?? null, duongDan: S.ws?.path ?? null, nhanh: S.ws?.branch ?? null,
        model: nayModel?.ten ?? S.ws?.model ?? '?', muc: nayMuc?.ten ?? '?',
        cheDo: TEN_CHE_DO[S.ws?.cheDoQuyen ?? 'keHoach'] ?? '?', tomTat: S.daCompact,
      }).replace('- App:', '- Phiên bản:')}\n- Tài khoản: **${kn.nguoi.fullName || kn.nguoi.username}**`);
      return;
    }

    case '/plan':
      if (!thamSo) { traLoi('Gõ việc cần lập kế hoạch: `/plan thêm trang cài đặt`. Lượt đó CHỈ ĐỌC — không sửa file, không chạy lệnh — rồi bạn duyệt mới làm.'); return; }
      S.choDuyetKeHoach = true;
      b.guiThat(promptPlan(thamSo), { chiDoc: true, hienThi: goc });
      return;

    case '/review':
      b.guiThat(promptReview(thamSo), { chiDoc: true, hienThi: goc });
      return;

    case '/init':
      if ((S.ws?.cheDoQuyen ?? 'keHoach') === 'keHoach') {
        await b.doiCheDo('hoi');
        kho.thongBao('Đã chuyển sang "Hỏi trước mọi việc" để CuongMini ghi AGENTS.md — mỗi lần ghi vẫn hỏi bạn.');
      }
      b.guiThat(PROMPT_INIT, { hienThi: goc });
      return;

    case '/resume': {
      if (!thamSo) { b.moMenu('resume'); return; }
      const phien = await kn.goi<PhienCu[]>('agent:dsPhien');
      const p = chonPhien(phien, thamSo);
      if (!p) { traLoi(moTaDsPhien(locPhien(phien, thamSo))); return; }
      await moPhien(p.id, p.tieuDe, b);
      return;
    }

    case '/rewind': {
      const ds = dsCauHoi(S.muc as MucGhi[]);
      const n = Number(thamSo);
      if (!thamSo) { if (ds.length) b.moMenu('rewind'); else traLoi(moTaDsCauHoi(ds)); return; }
      if (!Number.isInteger(n)) { traLoi(moTaDsCauHoi(ds)); return; }
      if (n < 1 || n > ds.length) { traLoi(`Không có câu hỏi thứ ${n} (việc này có ${ds.length} câu).`); return; }
      const r = await kn.goi<{ ok: boolean; loi?: string; cauHoi?: string; coSuaFile?: boolean; soFileSeLui?: number }>('agent:quayLui', { k: n });
      if (!r.ok) { traLoi(r.loi ?? 'Không quay lui được.'); return; }
      let chu = `Đã quay về câu ${n}. Câu hỏi đó đã nằm lại trong ô nhập để bạn sửa và gửi lại.`;
      if ((r.soFileSeLui ?? 0) > 0) {
        const kq = await kn.goi<{ soFile: number; loi: string[] }>('agent:luiFile', { k: n }).catch(() => null);
        chu = kq === null ? 'Đã quay lui hội thoại, nhưng lùi file hỏng.'
          : `Đã quay về câu ${n}: cắt hội thoại và lùi ${kq.soFile} file về trước câu đó.${kq.loi.length ? ` ${kq.loi.length} file không lùi được: ${kq.loi.join('; ')}` : ''}`;
      } else if (r.coSuaFile) {
        chu = `Đã quay về câu ${n}. Đoạn vừa bỏ có chạy lệnh — thay đổi do lệnh gây ra không lùi được tự động.`;
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
      traLoi(ds.length === 0 ? '**Bộ nhớ bài học** trống — CuongMini tự ghi nhớ khi bạn sửa nó hoặc khi gặp bẫy của dự án.'
        : `**Bộ nhớ bài học** (${ds.length}):\n\n${ds.slice(0, 40).map((x) => `- **${x.tieuDe}** _(${x.phamVi}, khớp ${x.lanKhop} lần)_ — ${x.apDung}`).join('\n')}\n\n_Muốn CuongMini quên một bài: nói "quên bài học …"._`);
      return;
    }

    case '/hooks':
      await kn.goi('agent:hookMoCauHinh');
      kho.thongBao('Đã mở file cấu hình hook bằng chương trình mặc định.');
      return;

    case '/mcp': {
      if (/^(mo|open)$/i.test(thamSo)) { await kn.goi('agent:mcpMoCauHinh'); kho.thongBao('Đã mở file cấu hình MCP bằng chương trình mặc định.'); return; }
      if (/^(nap|reload)$/i.test(thamSo)) await kn.goi('agent:mcpNapLai').catch(() => undefined);
      const tt = await kn.goi<{ duongDan: string; server: Array<{ ten: string; ok: boolean; soTool: number; loi?: string; canDuyet?: boolean }>; loiCauHinh?: string | null } | null>('agent:mcpTrangThai').catch(() => null);
      const sv = tt?.server ?? [];
      traLoi(`**Máy chủ MCP**${sv.length ? `\n\n${sv.map((x) => `- ${x.ok ? '✓' : x.canDuyet ? '⏸' : '✗'} \`${x.ten}\`${x.soTool ? ` · ${x.soTool} tool` : ''}${x.loi ? ` · ${x.loi}` : ''}${x.canDuyet ? ' · chờ duyệt' : ''}`).join('\n')}` : ' — chưa cấu hình máy chủ nào.'}${tt?.loiCauHinh ? `\n\n⚠ File cấu hình hỏng: ${tt.loiCauHinh}` : ''}\n\nFile cấu hình: \`${tt?.duongDan ?? '?'}\` · mở bằng \`/mcp mo\` · sửa xong gõ \`/mcp nap\` để nạp lại.`);
      return;
    }

    case '/export': {
      if (S.muc.length === 0) { traLoi('Việc này chưa có gì để xuất.'); return; }
      const luc = new Date();
      const tieuDe = S.tieuDe || 'Việc CuongMini';
      const noiDung = xuatMarkdown(S.muc as MucGhi[], { tieuDe, duAn: S.ws?.name ?? null, luc }).replace('Xuất từ AI Code', 'Xuất từ CuongMini CLI');
      const ten = thamSo.trim() || tenFileXuat(tieuDe, luc);
      let duong = path.resolve(b.thuMuc, ten);
      for (let i = 2; existsSync(duong) && !thamSo.trim(); i += 1) duong = path.resolve(b.thuMuc, ten.replace(/\.md$/, `-${i}.md`));
      writeFileSync(duong, noiDung);
      traLoi(`Đã xuất ${S.muc.length} mục ra \`${path.relative(b.thuMuc, duong) || duong}\`.`);
      return;
    }

    case '/doctor': {
      kho.thongBao('Đang chẩn đoán…');
      type MucCd = { ten: string; muc: 'ok' | 'canh' | 'loi'; chiTiet: string };
      const ds: MucCd[] = await kn.goi<MucCd[]>('agent:chanDoan')
        .catch((e: Error): MucCd[] => [{ ten: 'Chẩn đoán', muc: 'loi', chiTiet: e.message }]);
      const may = await kiemMay(b.phienBan).catch(() => []);
      traLoi(`${moTaChanDoan([...may, ...ds])}\n\n_Phần máy (Node, PATH, trình duyệt…) giống \`cuongmini doctor\`; phần sau là chẩn đoán của lõi AI Code._`);
      return;
    }

    case '/config': b.moMenu('config'); return;

    case '/theme': {
      const q = chuanHoaTen(thamSo);
      const t = q === 'sang' || q === 'light' ? 'sang' : q === 'toi' || q === 'dark' ? 'toi' : q === 'tudong' || q === 'auto' ? 'tuDong' : null;
      if (!t) { b.moMenu('config'); return; }
      b.doiTheme(t);
      return;
    }

    case '/transcript': b.moMenu('banGhi'); return;

    case '/copy': {
      const cuoi = [...S.muc].reverse().find((m) => m.kieu === 'may' && m.text);
      if (!cuoi?.text) { traLoi('Chưa có câu trả lời nào để chép.'); return; }
      await chepChu(cuoi.text);
      kho.thongBao(`Đã chép câu trả lời gần nhất (${cuoi.text.length} ký tự) vào clipboard.`, 'ok');
      return;
    }

    case '/add-dir': {
      const p = thamSo.trim().replace(/^['"]|['"]$/g, '');
      if (!p) { traLoi('Gõ đường thư mục: `/add-dir ../thu-vien-chung`'); return; }
      const td = path.resolve(b.thuMuc, p.replace(/^~(?=$|[\\/])/, os.homedir()));
      try {
        if (!statSync(td).isDirectory()) throw new Error('không phải thư mục');
      } catch (e) { traLoi(`Không mở được \`${td}\`: ${(e as Error).message}`); return; }
      await kn.goi('agent:themDuong', { duong: td });
      kho.thongBao(`Agent được làm việc thêm ở ${td}`, 'ok');
      return;
    }

    case '/terminal-setup': {
      const loai = doTerminal();
      if (loai === 'vscode' || loai === 'cursor') {
        const r = caiVsCode(loai === 'cursor' ? 'Cursor' : 'Code');
        traLoi(r.daCo ? `Shift+Enter đã được cài sẵn trong \`${r.duong}\` — không đổi gì.`
          : `Đã thêm Shift+Enter (gửi ESC+Enter ⇒ xuống dòng) vào \`${r.duong}\`${r.saoLuu ? ` — bản cũ sao lưu ở \`${r.saoLuu}\`` : ''}. Có tác dụng ngay trong terminal của ${loai === 'cursor' ? 'Cursor' : 'VS Code'}.`);
        return;
      }
      traLoi(HUONG_DAN[loai]);
      return;
    }

    case '/offline':
      traLoi('AI ngoại tuyến (chạy trên máy) chỉ có trong app desktop CuongThai.');
      return;

    default:
      traLoi(`Lệnh \`${ten}\` chưa có trong CLI.`);
  }
}

/** Mở một việc cũ vào cuộc hiện tại và in lại hội thoại của nó. */
export async function moPhien(id: string, tieuDe: string, b: Pick<BoiCanhLenh, 'kho' | 'kn' | 'xoaManHinh'>): Promise<boolean> {
  const { kho, kn } = b;
  if (kho.S.dangChay) { kho.thongBao('Việc này đang chạy — dừng (esc) hoặc đợi xong rồi mới mở việc khác.', 'loi'); return false; }
  const r = await kn.goi<{ muc: Array<{ kieu: string; text?: string; ten?: string; tomTat?: string }> } | null>('agent:moPhien', { id });
  if (!r) { kho.thongBao('Không mở được việc này (file phiên đã mất).', 'loi'); return false; }
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
  kho.thongBao(`↺ Đã mở lại việc cũ${tieuDe ? ` "${tieuDe}"` : ''} — hỏi tiếp là CuongMini nhớ toàn bộ ngữ cảnh.`, 'ok');
  try { S.ws = await kn.goi('agent:getWorkspace'); } catch { /* giữ ws cũ */ }
  kho.bao(true);
  return true;
}

const chuanHoaTen = (s: string): string => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[\s_-]+/g, '');
