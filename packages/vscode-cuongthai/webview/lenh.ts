/**
 * LỆNH `/` của CuongMini Code — cùng bộ lệnh với app desktop (`AgentMode.tsx`
 * › `chayLenhDungSan`), phần thuần lấy thẳng từ `lenhGach.ts` của app.
 *
 * ⛔ Lệnh chạy CỤC BỘ không tốn lượt nào: chúng đọc trạng thái sẵn có hoặc hỏi
 * một route rẻ. Chỉ `/plan`, `/review`, `/init`, `/diff` (và lệnh của dự án)
 * là câu hỏi cho agent — chúng CẦN agent đọc mã.
 */
import {
  LENH_AGENT, PROMPT_DUYET_KE_HOACH, PROMPT_INIT, TEN_CHE_DO, chonPhien, dsCauHoi, locPhien, moTaChanDoan, moTaDsCauHoi,
  moTaDsPhien, moTaNguCanh, moTaTrangThai, moTaTroGiup, moTaUsage, moTaUsage2, promptPlan, promptReview, tachLenh, tenFileXuat,
  timMuc, timTheoChu, xuatMarkdown, type MucGhi, type PhienCu,
} from 'ct-lenh';
// Đợt 5: bộ lệnh CT Work chung ba nơi (`/ctwork` menu đánh số, `/issue`, `/sprint`, `/viec`).
import { hanhDongMcp, lamHanhDongMcp, lenhCtwork, moCtworkTuMcp, trangThaiMcpChu, type GiaoDienCtw, type TheChonCtw } from '../../../desktop/src/renderer/features/chat/ctworkLenh';

/** Đợt 4 — chữ hai thứ tiếng theo ngôn ngữ giao diện VS Code. */
const Lv = (vi: string, en: string): string => (/^vi/i.test(navigator.language || 'vi') ? vi : en);
const nnV = (): 'vi' | 'en' => (/^vi/i.test(navigator.language || 'vi') ? 'vi' : 'en');

/**
 * Đợt 5 — THẺ LỰA CHỌN kiểu CLI cho VS Code: nội dung (markdown) + hàng NÚT đánh số. Bấm nút hoặc gõ số vào
 * ô nhập TRỐNG (khung chat bắt phím 0–9 khi thẻ đang mở) — `main.ts › theChonMo`.
 */
export function chonVsc(b: BoiCanhLenh, o: TheChonCtw): void {
  const moTa = o.moTa ? `\n\n${o.moTa.split('\n').map((d) => `_${d}_`).join('  \n')}` : '';
  b.traLoi(`**${o.tieuDe}**${moTa}${o.than ? `\n\n${o.than}` : ''}`);
  const ds = o.ds.filter((m) => !m.tat);
  b.nut?.(ds.map((m, i) => {
    const so = m.so ?? (i < 9 ? String(i + 1) : '');
    return { nhan: `${so ? `${so}. ` : ''}${m.nhan}`, ...(i === 0 ? { chinh: true } : {}), so, lam: () => o.khiChon(m.giaTri) };
  }));
}

export function giaoDienCtwVsc(b: BoiCanhLenh): GiaoDienCtw {
  return {
    goi: <T,>(k: string, d?: Record<string, unknown>) => b.goi<T>(k, d ?? {}),
    traLoi: (md) => b.traLoi(md),
    chon: (o) => chonVsc(b, o),
    thongBao: (t, loai) => b.thongBao(t, loai === 'loi'),
    datNhap: b.datNhap,
    ngonNgu: /^vi/i.test(navigator.language || 'vi') ? 'vi' : 'en',
    ...(b.lamMoiCtwork ? { lamMoiDong: b.lamMoiCtwork } : {}),
  };
}

export interface BoiCanhLenh {
  S: {
    ws: { name?: string; path?: string; branch?: string | null; cheDoQuyen?: string; mucNoLuc?: string; model?: string } | null;
    muc: MucGhi[]; tieuDe: string; tienPhien: number; soFileDaSua: number; buoc: { nay: number; tran: number } | null;
    /** Đợt 8A: ngữ cảnh % của phiên (máy chủ gửi trong `tienTrinh`/`xong`) — cho `/usage`. */
    nguCanhPhanTram?: number | null;
    lenhDuAn: Array<{ ten: string; mo: string; than: string }>; choDuyetKeHoach: boolean; daCompact: boolean;
    phienBan: string; cheDoKetNoi: 'app' | 'docLap'; dangChay: boolean;
  };
  goi: <T = unknown>(kenh: string, duLieu?: unknown) => Promise<T>;
  gui: (m: unknown) => void;
  guiThat: (text: string, o: { chiDoc?: boolean; hienThi?: string }) => void;
  traLoi: (chu: string | null) => void;
  /** Đợt 4 — hàng NÚT hành động dưới câu trả lời vừa in (kiểu thẻ `/mcp` của Claude Code). Đợt 5: `so` = phím số chọn nhanh. */
  nut?: (ds: Array<{ nhan: string; chinh?: boolean; so?: string; lam: () => void | Promise<void> }>) => void;
  /** Đợt 5: đọc lại dòng CT Work dưới ô nhập. */
  lamMoiCtwork?: () => void;
  thongBao: (chu: string, loi?: boolean) => void;
  xoaBang: () => void;
  moLichSu: () => Promise<void>;
  doiModel: (id: string) => Promise<void>;
  doiMuc: (id: string) => Promise<void>;
  doiCheDo: (id: string) => Promise<void>;
  dsModel: () => Array<{ id: string; ten: string; mo: string; dungDuoc: boolean; dat?: boolean; canMoKhoa?: boolean }>;
  dsMuc: () => Array<{ id: string; ten: string; mo: string }>;
  datNhap: (t: string) => void;
  moMenuModel: () => void;
  moMenuCheDo: () => void;
}

export async function chayLenh(text: string, b: BoiCanhLenh): Promise<void> {
  if (text === '__duyetKeHoach') {
    if ((b.S.ws?.cheDoQuyen ?? 'keHoach') === 'keHoach') await b.doiCheDo('hoi').catch(() => undefined);
    b.guiThat(PROMPT_DUYET_KE_HOACH, { hienThi: '✅ Làm theo kế hoạch' });
    return;
  }
  // Lệnh tự tạo của dự án (`.claude/commands/*.md`): thân lệnh là câu hỏi, `$ARGUMENTS` = phần sau tên.
  const dau = text.trim().split(/\s+/)[0] ?? '';
  const lenhDuAn = b.S.lenhDuAn.find((l) => l.ten === dau);
  const l = tachLenh(text);
  if (!l && lenhDuAn) {
    const thamSo = text.trim().slice(dau.length).trim();
    b.guiThat(lenhDuAn.than.replace(/\$ARGUMENTS/g, thamSo), { hienThi: text.trim() });
    return;
  }
  if (!l) { b.traLoi(`Không có lệnh \`${dau}\`. Gõ \`/help\` để xem danh sách.`); return; }
  try {
    await chay(l.ten, l.thamSo, text.trim(), b);
  } catch (e) {
    b.traLoi(`Lệnh \`${l.ten}\` lỗi: ${(e as Error).message}`);
  }
}

async function chay(ten: string, thamSo: string, goc: string, b: BoiCanhLenh): Promise<void> {
  const { S } = b;
  const coThuMuc = Boolean(S.ws?.path);
  switch (ten) {
    case '/help':
      b.traLoi(moTaTroGiup(LENH_AGENT.filter((x) => x.ten !== '/offline'), S.lenhDuAn).replace(/trong app/g, 'ngay tại đây'));
      return;

    case '/clear':
      if (S.dangChay) { b.traLoi('Việc này đang chạy — bấm Dừng trước.'); return; }
      await b.goi('agent:reset');
      b.xoaBang();
      return;

    case '/kynang': {
      const phan = thamSo.split(/\s+/).filter(Boolean);
      if (phan[0] === 'cai' || phan[0] === 'install') {
        const tenKn = phan[1];
        if (!tenKn) { b.traLoi('Thiếu tên. Ví dụ: `/kynang cai database-optimizer`'); return; }
        b.thongBao(`Đang tải ${tenKn}…`);
        const kq = await b.goi<Array<{ ten: string; loai: string; danhMuc: string }>>('agent:khoTim', { tuKhoa: tenKn });
        const m = kq.find((x) => x.ten === tenKn) ?? kq[0];
        if (!m) { b.traLoi(`Không tìm thấy \`${tenKn}\` trong kho.`); return; }
        const r = await b.goi<{ ok: boolean; duongDan?: string; xemTruoc?: string; loi?: string }>('agent:khoCai', { ten: m.ten, loai: m.loai, ghiDe: phan.includes('--de') });
        b.traLoi(r.ok
          ? `Đã cài **${m.ten}** (${m.loai}) vào \`${r.duongDan}\`.\n\nAgent thấy nó từ lượt sau. Xem lại bằng \`git diff\` trước khi commit — đây là nội dung từ repo của người khác.\n\n\`\`\`\n${(r.xemTruoc ?? '').slice(0, 600)}\n\`\`\``
          : `Không cài được: ${r.loi}`);
        return;
      }
      const tuKhoa = thamSo.trim();
      if (!tuKhoa) {
        b.traLoi('**Kho AI Templates** — hàng nghìn kỹ năng, agent phụ, lệnh.\n\n- Tìm: `/kynang <từ khoá>` (bỏ dấu cũng ra)\n- Cài: `/kynang cai <tên>` · ghi đè: thêm `--de`\n\n_Hook và MCP không cài từ đây — chúng là lệnh sẽ chạy, và có cửa duyệt riêng._');
        return;
      }
      const ds = await b.goi<Array<{ ten: string; loai: string; danhMuc: string }>>('agent:khoTim', { tuKhoa }).catch(() => []);
      b.traLoi(ds.length === 0 ? `Không có gì khớp "${tuKhoa}".`
        : `**${ds.length}** kết quả cho "${tuKhoa}":\n\n${ds.map((x) => `- \`${x.ten}\` · ${x.loai} · ${x.danhMuc}`).join('\n')}\n\nCài: \`/kynang cai <tên>\``);
      return;
    }

    case '/quyen': {
      const d = thamSo.split(/\s+/).filter(Boolean);
      // Đợt 3: thêm TIỀN TỐ — `/quyen them npm test` ⇒ mọi lệnh ĐƠN bắt đầu bằng `npm test`.
      if (d[0] === 'them' || d[0] === 'thêm' || d[0] === 'add') {
        const tt = d.slice(1).join(' ').replace(/\s*(\*|…)$/, '').trim();
        if (!tt) { b.traLoi('Gõ tiền tố: `/quyen them npm test` ⇒ mọi lệnh ĐƠN bắt đầu bằng `npm test` tự chạy ở dự án này.'); return; }
        const r = await b.goi<{ ok: boolean; loi?: string }>('agent:themTienTo', { tienTo: tt });
        b.traLoi(r?.ok ? `Đã cho phép lâu dài mọi lệnh bắt đầu bằng \`${tt}\` (lệnh nối \`;\` \`&&\` \`|\` \`$(…)\` vẫn hỏi).` : `⚠ ${r?.loi ?? '?'}`);
        return;
      }
      const r = await b.goi<{ goc: string | null; khoa: string[] }>('agent:dsQuyenLau');
      if (d[0] === 'xoa' || d[0] === 'clear') {
        let rieng = d.slice(1).join(' ').trim();
        if (/^\d+$/.test(rieng) && r?.khoa[Number(rieng) - 1]) rieng = r.khoa[Number(rieng) - 1]!;
        const n = await b.goi<number>('agent:xoaQuyenLau', rieng ? { khoa: rieng } : {}) ?? 0;
        b.traLoi(n === 0 ? 'Không có quyền nào bị thu hồi.' : `Đã thu hồi **${n}** quyền${rieng ? ` cho \`${rieng}\`` : ' của dự án này'}.`);
        return;
      }
      if (!r?.goc) { b.traLoi(Lv('Chưa mở dự án nào.', 'No project is open.')); return; }
      const hien = (k: string): string => (k.startsWith('tien-to:') ? `\`${k.slice(8)} …\` ${Lv('(mọi lệnh bắt đầu bằng)', '(any command starting with)')}` : `\`${k}\``);
      // Đợt 5: thẻ lựa chọn (nút) như CLI — không còn dòng "gõ `/quyen xoa <số>`".
      chonVsc(b, {
        tieuDe: Lv('Quyền "Luôn cho phép"', '"Always allow" permissions'),
        than: `${r.khoa.length ? r.khoa.map((x, i) => `${i + 1}. ${hien(x)}`).join('\n') : Lv('_(chưa có quyền nào)_', '_(none yet)_')}\n\n⎿ \`${r.goc}\``,
        ds: [
          { nhan: Lv('Thêm tiền tố lệnh…', 'Add a command prefix…'), giaTri: 'them' },
          ...r.khoa.map((x, i) => ({ nhan: `${Lv('Thu hồi', 'Revoke')} ${x.startsWith('tien-to:') ? `${x.slice(8)} …` : x}`, giaTri: `xoa ${i + 1}` })).slice(0, 8),
          ...(r.khoa.length ? [{ nhan: Lv('Thu hồi tất cả', 'Revoke all'), giaTri: 'xoa' }] : []),
        ],
        khiChon: async (g) => { if (g === 'them') b.datNhap('/quyen them '); else await chayLenh(`/quyen ${g}`, b); },
      });
      return;
    }

    /* ── Đợt 3 (18/10/2026) ── */
    case '/sessions': {
      const r = await b.goi<{ toi: { id: string; ten: string } | null; ds: Array<{ id: string; ten: string; noi: string; thuMuc: string | null; trangThai: string }> } | null>('agent:dsPhienMang').catch(() => null);
      if (!r) { b.traLoi('Bản này chưa hỗ trợ nhắn giữa phiên (cập nhật app/extension).'); return; }
      chonVsc(b, {
        tieuDe: Lv('Phiên CuongMini trên máy này', 'CuongMini sessions on this machine'),
        than: `${r.toi ? `${Lv('Phiên này', 'This session')}: **${r.toi.ten}** (\`${r.toi.id}\`)` : Lv('Phiên này chưa đăng ký (sau lượt đầu tiên).', 'This session is not registered yet (after the first turn).')}\n\n${r.ds.length
          ? r.ds.map((x) => `- \`${x.id}\` **${x.ten}** · ${x.noi} · ${x.trangThai === 'dangChay' ? Lv('đang chạy', 'running') : Lv('rảnh', 'idle')} · ${x.thuMuc ?? '—'}`).join('\n')
          : Lv('Không có phiên CuongMini nào khác đang mở.', 'No other CuongMini session is open.')}`,
        ds: [
          { nhan: Lv('Đổi tên phiên này…', 'Rename this session…'), giaTri: 'ten' },
          ...(r.ds.length ? [{ nhan: Lv('Nhờ agent nhắn một phiên…', 'Ask the agent to message a session…'), giaTri: 'nhan' }] : []),
        ],
        khiChon: (g) => { if (g === 'ten') b.datNhap('/rename '); else if (g === 'nhan') b.datNhap(Lv(`Nhắn phiên ${r.ds[0]!.id}: `, `Message session ${r.ds[0]!.id}: `)); },
      });
      return;
    }
    case '/rename': {
      if (!thamSo.trim()) { b.traLoi('Gõ tên: `/rename backend-api`'); return; }
      const m = await b.goi<{ id: string; ten: string } | null>('agent:doiTenPhienMang', { ten: thamSo.trim().slice(0, 60) }).catch(() => null);
      b.traLoi(m ? `Đã đặt tên phiên: **${m.ten}** (\`${m.id}\`).` : 'Không đổi được tên.');
      return;
    }
    case '/worktree': {
      const d = thamSo.split(/\s+/).filter(Boolean);
      const ds = await b.goi<Array<{ duongDan: string; nhanh: string | null; laChinh: boolean; dangDung?: boolean }>>('agent:dsWorktree').catch(() => []) ?? [];
      if (!d.length || d[0] === 'list' || d[0] === 'ds') {
        if (!ds.length) { b.traLoi(Lv('Thư mục này không phải kho git.', 'This folder is not a git repository.')); return; }
        chonVsc(b, {
          tieuDe: 'Git worktree',
          than: ds.map((w) => `- ${w.dangDung ? '▶ ' : ''}\`${w.duongDan}\` · ${w.nhanh ?? Lv('(tách rời)', '(detached)')}${w.laChinh ? Lv(' · cây chính', ' · main tree') : ''}`).join('\n'),
          ds: [
            { nhan: Lv('Tạo worktree mới (mở ở cửa sổ mới)…', 'Create a new worktree (opens a new window)…'), giaTri: 'tao' },
            ...ds.filter((w) => !w.laChinh).slice(0, 6).map((w) => ({ nhan: `${Lv('Xoá', 'Remove')} ${w.nhanh ?? w.duongDan}`, giaTri: `xoa ${w.duongDan}` })),
          ],
          khiChon: async (g) => { if (g === 'tao') b.datNhap('/worktree '); else await chayLenh(`/worktree ${g}`, b); },
        });
        return;
      }
      if (d[0] === 'xoa' || d[0] === 'remove') {
        const r = await b.goi<{ ok: boolean; loi?: string }>('agent:xoaWorktree', { duongDan: d.slice(1).join(' ') });
        b.traLoi(r?.ok ? 'Đã xoá worktree (nhánh giữ lại).' : `⚠ ${r?.loi ?? '?'}`);
        return;
      }
      const r = await b.goi<{ ok: boolean; loi?: string }>('agent:taoWorktree', { ten: d.join('-') });
      if (!r?.ok) { b.traLoi(`⚠ ${r?.loi ?? 'Không tạo được worktree.'}`); return; }
      const ws = await b.goi<{ path?: string; branch?: string }>('agent:getWorkspace').catch(() => null);
      // VS Code: worktree là một THƯ MỤC khác ⇒ mở ở cửa sổ mới (cửa sổ này vẫn ở cây cũ).
      if (ws?.path) b.gui({ loai: 'moThuMuc', duong: ws.path });
      b.traLoi(`Đã tạo worktree \`${ws?.path ?? ''}\` (nhánh \`${ws?.branch ?? ''}\`) và mở ở cửa sổ VS Code mới.`);
      return;
    }
    case '/may': {
      /* Đợt 4 — điều khiển máy tính. Bật/tắt đi qua CÀI ĐẶT VS Code (`cuongthai.dieuKhienMayTinh`, có hộp xác nhận). */
      const q = thamSo.trim().toLowerCase();
      if (/^(on|bat|bật|off|tat|tắt)$/.test(q)) { b.gui({ loai: 'datMayTinh', bat: /^(on|bat|bật)$/.test(q) }); return; }
      const r = await b.goi<{ bat: boolean; hoTro: boolean; nenTang: string; quyen: { chup: boolean; dieuKhien: boolean } | null }>('agent:mayTinh', {}).catch(() => null);
      if (!r) { b.traLoi(Lv('Lõi/app này chưa có điều khiển máy tính — cập nhật.', 'This core/app has no computer control yet — please update.')); return; }
      const thieu = r.quyen && (!r.quyen.chup || !r.quyen.dieuKhien)
        ? `\n\n${Lv('⚠ macOS thiếu quyền cho VS Code', '⚠ macOS is missing permissions for VS Code')}: ${[!r.quyen.chup ? Lv('Ghi màn hình', 'Screen Recording') : '', !r.quyen.dieuKhien ? Lv('Trợ năng', 'Accessibility') : ''].filter(Boolean).join(' + ')} (System Settings → Privacy & Security).`
        : '';
      b.traLoi(`${r.bat
        ? Lv('🖥 Điều khiển máy tính: **BẬT** — mọi cú bấm/gõ/phím đều hỏi bạn, kể cả "Bỏ qua hết". Tắt: `/may off`.', '🖥 Computer control: **ON** — every click/type/key asks you, even in Bypass mode. Turn off: `/may off`.')
        : Lv('🖥 Điều khiển máy tính: **TẮT** (mặc định). Bật: `/may on` hoặc cài đặt `cuongthai.dieuKhienMayTinh`.', '🖥 Computer control: **OFF** (default). Turn on: `/may on` or the `cuongthai.dieuKhienMayTinh` setting.')}${r.hoTro ? '' : Lv(` (nền tảng ${r.nenTang} chưa hỗ trợ)`, ` (not supported on ${r.nenTang})`)}${thieu}`);
      return;
    }
    case '/hen': {
      const d = thamSo.split(/\s+/).filter(Boolean);
      if (d[0] === 'huy' || d[0] === 'cancel') { const n = await b.goi<number>('agent:huyHen', d[1] ? { id: d[1].replace(/^#/, '') } : {}).catch(() => 0); b.traLoi(`${Lv('Đã huỷ', 'Cancelled')} ${n ?? 0} ${Lv('hẹn', 'schedule(s)')}.`); return; }
      if (['chay-bu', 'run-missed', 'bo-lo', 'drop-missed'].includes(d[0] ?? '')) {
        const chay = d[0] === 'chay-bu' || d[0] === 'run-missed';
        const x = await b.goi<{ n: number }>('agent:xuLyHenLo', { cach: chay ? 'chay' : 'bo' }).catch(() => null);
        b.traLoi(chay ? Lv(`Đang chạy bù ${x?.n ?? 0} hẹn đã lỡ.`, `Running ${x?.n ?? 0} missed schedule(s).`) : Lv(`Đã bỏ ${x?.n ?? 0} hẹn đã lỡ.`, `Dropped ${x?.n ?? 0} missed schedule(s).`));
        return;
      }
      const r = await b.goi<{ cho: Array<{ moTa: string }>; hen: Array<{ id: string; lyDo: string; luc: number; lap: boolean; phut: number; conLai: number; cron?: string }> } | null>('agent:henCho').catch(() => null);
      const lo = (await b.goi<{ ds: Array<{ lyDo: string; luc: number }> }>('agent:henLo').catch(() => null))?.ds ?? [];
      const dongLo = lo.length ? ['', Lv(`**Đã lỡ ${lo.length} hẹn** lúc tắt — \`/hen chay-bu\` · \`/hen bo-lo\`:`, `**Missed ${lo.length} schedule(s)** while closed — \`/hen run-missed\` · \`/hen drop-missed\`:`), ...lo.map((h) => `- ${new Date(h.luc).toLocaleString()} — ${h.lyDo}`)] : [];
      const nutHen = [
        ...(r?.hen ?? []).slice(0, 6).map((h) => ({ nhan: `${Lv('Huỷ hẹn', 'Cancel')} ${h.id}`, lam: () => chayLenh(`/hen huy ${h.id}`, b) })),
        ...((r?.hen.length ?? 0) > 1 ? [{ nhan: Lv('Huỷ tất cả', 'Cancel all'), lam: () => chayLenh('/hen huy', b) }] : []),
        ...(lo.length ? [{ nhan: Lv('Chạy bù hẹn đã lỡ', 'Run missed'), chinh: true, lam: () => chayLenh('/hen chay-bu', b) }, { nhan: Lv('Bỏ hẹn đã lỡ', 'Drop missed'), lam: () => chayLenh('/hen bo-lo', b) }] : []),
      ].map((x, i) => ({ ...x, so: i < 9 ? String(i + 1) : '', nhan: `${i < 9 ? `${i + 1}. ` : ''}${x.nhan}` }));
      b.traLoi(r && (r.cho.length || r.hen.length)
        ? [...r.cho.map((c) => `- ⏳ ${Lv('Đang chờ', 'Waiting')}: ${c.moTa}`), ...r.hen.map((h) => `- ⏰ \`${h.id}\` ${new Date(h.luc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${h.cron ? ` · cron \`${h.cron}\` · ${Lv('còn', 'left')} ${h.conLai}×` : h.lap ? Lv(` · lặp mỗi ${h.phut}′ · còn ${h.conLai}×`, ` · every ${h.phut}′ · ${h.conLai}× left`) : ''} — ${h.lyDo}`), ...dongLo, '', Lv('Huỷ: `/hen huy <id>` · `/hen huy` (tất cả). Hẹn được lưu: VS Code tắt lúc tới giờ thì lần mở sau được hỏi chạy bù.', 'Cancel: `/hen cancel <id>` · `/hen cancel` (all). Schedules are saved: if VS Code is closed when one is due, you are asked to run it next time.')].join('\n')
        : lo.length ? dongLo.slice(1).join('\n') : Lv('Không có việc chờ hay hẹn nào.', 'Nothing is waiting or scheduled.'));
      // Đợt 5: nút (như thẻ lựa chọn của CLI) thay cho dòng "gõ `/hen huy <id>`".
      if (nutHen.length) b.nut?.(nutHen);
      return;
    }
    case '/ctwork': case '/issue': case '/sprint': case '/viec':
      /* Đợt 5: bộ lệnh CT Work CHUNG ba nơi — menu đánh số (nút), thẻ xem trước khi ghi. */
      await lenhCtwork(ten, thamSo, giaoDienCtwVsc(b));
      return;

    case '/cost':
      b.traLoi(`**Chi phí việc này**\n\n- Đã tiêu: **~$${S.tienPhien.toFixed(3)}**\n- Số bước đã đi: ${S.buoc?.nay ?? 0}\n- File đã sửa (hoàn tác được): ${S.soFileDaSua}\n\n_Con số là ƯỚC LƯỢNG. Chi tiết hạn mức: \`/usage\`._`);
      return;

    case '/undo': {
      const r = await b.goi<{ soFile: number; loi: string[] }>('agent:hoanTac');
      b.traLoi(r.soFile === 0 && !r.loi.length ? 'Chưa có file nào để hoàn tác trong việc này.'
        : `Đã hoàn tác **${r.soFile}** file.${r.loi.length ? `\n\nKhông hoàn tác được: ${r.loi.join('; ')}` : ''}`);
      return;
    }

    case '/diff':
      b.guiThat('Chạy git_diff rồi tóm tắt ngắn gọn những gì đã thay đổi trong dự án.', { chiDoc: true, hienThi: goc });
      return;

    case '/model': {
      const q = thamSo.trim();
      if (!q) { b.moMenuModel(); return; }
      const m = timTheoChu(q, b.dsModel());
      /* 18/10/2026: chỉ in TÊN CuongMini. */
      if (!m) { b.traLoi(`${Lv(`Không rõ model "${q}". Có:`, `Unknown model "${q}". Available:`)}\n\n${b.dsModel().map((x) => `- ${x.ten}${x.dungDuoc ? '' : Lv(' (chưa mở)', ' (not enabled)')}`).join('\n')}`); return; }
      if (!m.dungDuoc) { b.traLoi(Lv(`**${m.ten}** tạm thời chưa dùng được.`, `**${m.ten}** is temporarily unavailable.`)); return; }
      if (m.canMoKhoa) { b.moMenuModel(); b.traLoi(Lv(`**${m.ten}** cần khoá — bấm vào nó trong menu vừa mở để nhập.`, `**${m.ten}** needs a key — click it in the menu to enter one.`)); return; }
      if (m.dat) { b.moMenuModel(); b.traLoi(`**${m.ten}** tốn nhiều hơn hẳn — xác nhận trong menu vừa mở.`); return; }
      await b.doiModel(m.id);
      b.traLoi(`Đã đổi model sang **${m.ten}** — ${m.mo}.`);
      return;
    }

    case '/effort': {
      const q = thamSo.trim();
      const nay = S.ws?.mucNoLuc ?? 'vua';
      if (!q) { b.traLoi(`**Mức nỗ lực** — gõ \`/effort <mức>\`:\n\n${b.dsMuc().map((x) => `- ${x.id === nay ? '**▸ ' : ''}${x.ten}${x.id === nay ? '**' : ''} — ${x.mo}`).join('\n')}`); return; }
      const m = timMuc(q, b.dsMuc());
      if (!m) { b.traLoi(`Không rõ mức "${q}". Có: ${b.dsMuc().map((x) => x.ten).join(' · ')}.`); return; }
      await b.doiMuc(m.id);
      b.traLoi(`Đã đổi mức nỗ lực sang **${m.ten}** — ${m.mo}.`);
      return;
    }

    case '/usage': {
      b.thongBao('Đang hỏi hạn mức…');
      /* Đợt 8A: lõi hỏi máy chủ kèm model + dự án CT Work của phiên — hạn mức THẬT; máy chủ/lõi cũ ⇒ cách cũ. */
      const d2 = await b.goi<unknown>('agent:usage', {}).catch(() => null);
      const md2 = d2 ? moTaUsage2(d2, { tienPhien: b.S.tienPhien, nguCanhPhanTram: b.S.nguCanhPhanTram ?? null }, nnV()) : null;
      if (md2) { b.traLoi(md2); return; }
      const u = await b.goi<Parameters<typeof moTaUsage>[0]>('vsc:usage');
      b.traLoi(moTaUsage(u));
      return;
    }

    case '/context': {
      const ct = await b.goi('agent:nguCanhChiTiet');
      b.traLoi(moTaNguCanh(ct, 600_000, 0));
      return;
    }

    case '/compact': {
      b.thongBao(`Đang tóm tắt phần cũ${thamSo ? ` (giữ: ${thamSo})` : ''}…`);
      const r = await b.goi<{ ok: boolean; loi?: string; soTinDaGop?: number; soLuotDaGop?: number; xemTruoc?: string; kyTuTruoc?: number; kyTuSau?: number }>('agent:compact', thamSo ? { ghiChu: thamSo } : {});
      if (!r.ok) { b.traLoi(`Không /compact được: ${r.loi}`); return; }
      if (!r.soTinDaGop) { b.traLoi('Việc này còn ngắn — chưa có gì để gộp.'); return; }
      S.daCompact = true;
      const k = (n?: number): string => (n === undefined ? '?' : `${Math.round(n / 1000)}k`);
      b.traLoi(`Đã gộp **${r.soLuotDaGop ?? '?'} lượt đầu** vào một bản tóm tắt. Ngữ cảnh gửi lên: **${k(r.kyTuTruoc)} → ${k(r.kyTuSau)}** ký tự.\n\n> ${(r.xemTruoc ?? '').split('\n').slice(0, 8).join('\n> ')}`);
      return;
    }

    case '/status': {
      const nayModel = b.dsModel().find((x) => x.id === (S.ws?.model ?? 'cm-solid'));
      const nayMuc = b.dsMuc().find((x) => x.id === (S.ws?.mucNoLuc ?? 'vua'));
      b.traLoi(moTaTrangThai({
        phienBan: `${S.phienBan} · ${S.cheDoKetNoi === 'docLap' ? 'chạy ngay trong VS Code' : 'chạy qua app CuongThai'}`,
        cong: 'chinh', online: navigator.onLine,
        duAn: S.ws?.name ?? null, duongDan: S.ws?.path ?? null, nhanh: S.ws?.branch ?? null,
        model: nayModel?.ten ?? S.ws?.model ?? '?', muc: nayMuc?.ten ?? '?',
        cheDo: TEN_CHE_DO[S.ws?.cheDoQuyen ?? 'keHoach'] ?? '?', tomTat: S.daCompact,
      }).replace('- App:', '- Phiên bản:'));
      return;
    }

    case '/plan':
      if (!thamSo) { b.traLoi('Gõ việc cần lập kế hoạch: `/plan thêm trang cài đặt`. Lượt đó CHỈ ĐỌC — không sửa file, không chạy lệnh — rồi bạn duyệt mới làm.'); return; }
      S.choDuyetKeHoach = true;
      b.guiThat(promptPlan(thamSo), { chiDoc: true, hienThi: goc });
      return;

    case '/review':
      if (!coThuMuc) { b.traLoi('Chưa mở thư mục dự án nào.'); return; }
      b.guiThat(promptReview(thamSo), { chiDoc: true, hienThi: goc });
      return;

    case '/init':
      if (!coThuMuc) { b.traLoi('Mở thư mục dự án trước — `/init` ghi `AGENTS.md` vào gốc dự án.'); return; }
      if ((S.ws?.cheDoQuyen ?? 'keHoach') === 'keHoach') {
        await b.doiCheDo('hoi');
        b.thongBao('Đã chuyển sang "Hỏi trước mọi việc" để CuongMini ghi AGENTS.md — mỗi lần ghi vẫn hỏi bạn.');
      }
      b.guiThat(PROMPT_INIT, { hienThi: goc });
      return;

    case '/resume': {
      const phien = await b.goi<PhienCu[]>('agent:dsPhien');
      if (!thamSo) { await b.moLichSu(); return; }
      const p = chonPhien(phien, thamSo);
      if (!p) { b.traLoi(moTaDsPhien(locPhien(phien, thamSo))); return; }
      await b.moLichSu();
      return;
    }

    case '/rewind': {
      const ds = dsCauHoi(S.muc);
      const n = Number(thamSo);
      if (!thamSo || !Number.isInteger(n)) { b.traLoi(moTaDsCauHoi(ds)); return; }
      if (n < 1 || n > ds.length) { b.traLoi(`Không có câu hỏi thứ ${n} (việc này có ${ds.length} câu).`); return; }
      const r = await b.goi<{ ok: boolean; loi?: string; cauHoi?: string; coSuaFile?: boolean; soFileSeLui?: number }>('agent:quayLui', { k: n });
      if (!r.ok) { b.traLoi(r.loi ?? 'Không quay lui được.'); return; }
      let chu = `Đã quay về câu ${n}. Câu hỏi đó đã nằm lại trong ô soạn để bạn sửa và gửi lại.`;
      if ((r.soFileSeLui ?? 0) > 0) {
        const kq = await b.goi<{ soFile: number; loi: string[] }>('agent:luiFile', { k: n }).catch(() => null);
        chu = kq === null ? 'Đã quay lui hội thoại, nhưng lùi file hỏng.'
          : `Đã quay về câu ${n}: cắt hội thoại và lùi ${kq.soFile} file về trước câu đó.${kq.loi.length ? ` ${kq.loi.length} file không lùi được: ${kq.loi.join('; ')}` : ''}`;
      } else if (r.coSuaFile) {
        chu = `Đã quay về câu ${n}. Đoạn vừa bỏ có chạy lệnh — thay đổi do lệnh gây ra không lùi được tự động.`;
      }
      catBangTuCau(n, S);
      b.datNhap(r.cauHoi ?? '');
      b.thongBao(chu);
      return;
    }

    case '/memory': {
      const ds = await b.goi<Array<{ id: string; tieuDe: string; apDung: string; phamVi: string; lanKhop: number }>>('agent:boNhoDs');
      b.traLoi(ds.length === 0 ? '**Bộ nhớ bài học** trống — CuongMini tự ghi nhớ khi bạn sửa nó hoặc khi gặp bẫy của dự án.'
        : `**Bộ nhớ bài học** (${ds.length}):\n\n${ds.slice(0, 40).map((x) => `- **${x.tieuDe}** _(${x.phamVi}, khớp ${x.lanKhop} lần)_ — ${x.apDung}`).join('\n')}\n\n_Muốn CuongMini quên một bài: nói "quên bài học …"._`);
      return;
    }
    case '/hooks':
      await b.goi('agent:hookMoCauHinh');
      b.thongBao('Đã mở file cấu hình hook.');
      return;
    case '/mcp': {
      /* Đợt 4 — kiểu `/mcp` của Claude Code: danh sách server + NÚT hành động (mở · nạp lại · CT Work · bật/tắt · xem tool). */
      const q = thamSo.trim().toLowerCase();
      if (/^(mo|mở|open|edit)$/.test(q)) { await b.goi('agent:mcpMoCauHinh').catch(() => undefined); b.thongBao(Lv('Đã mở file cấu hình MCP.', 'Opened the MCP config file.')); return; }
      if (/^(nap|nạp|reload)$/.test(q)) await b.goi('agent:mcpNapLai').catch(() => undefined);
      type TT = { duongDan: string; server: Array<{ ten: string; ok: boolean; soTool: number; loi?: string; canDuyet?: boolean; tat?: boolean; tuDuAn?: boolean; kieu?: string; soMucLuc?: number; ngat?: boolean; dangNoi?: boolean }>; loiCauHinh?: string | null } | null;
      const tt = await b.goi<TT>('agent:mcpTrangThai').catch(() => null);
      const sv = tt?.server ?? [];
      const dong = sv.length
        ? sv.map((x) => `- \`${x.ten}\` — ${x.ok ? '✔' : x.dangNoi ? '◌' : x.ngat || x.tat ? '○' : x.canDuyet ? '⏸' : '✘'} ${trangThaiMcpChu(x, nnV())}${x.ok && x.kieu ? ` · ${x.kieu}` : ''}`).join('\n')
        : Lv('_(chưa cấu hình máy chủ nào)_', '_(no servers configured)_');
      b.traLoi(`${/^(nap|nạp|reload)$/.test(q) ? `${Lv('✓ Đã nạp lại cấu hình MCP.', '✓ MCP config reloaded.')}\n\n` : ''}**${Lv('Máy chủ MCP', 'MCP servers')}**\n\n${dong}${tt?.loiCauHinh ? `\n\n⚠ ${tt.loiCauHinh}` : ''}\n\n⎿ \`${tt?.duongDan ?? '?'}\``);
      b.nut?.([
        { nhan: Lv('Mở file cấu hình', 'Open config file'), chinh: true, lam: async () => { await b.goi('agent:mcpMoCauHinh').catch(() => undefined); } },
        { nhan: Lv('Nạp lại', 'Reload'), lam: () => chayLenh('/mcp nap', b) },
        /* Đợt 6 (việc 4): nối bằng phiên đăng nhập ⇒ MỌI dự án (không gian · vai) ⇒ quyền ⇒ gắn. */
        { nhan: Lv('CT Work — chọn dự án & quyền', 'CT Work — pick project & access'), lam: () => moCtworkTuMcp(giaoDienCtwVsc(b)) },
        { nhan: Lv('Kết nối CT Work', 'Connect CT Work'), lam: () => chayLenh('/ctwork', b) },
        /* Đợt 8A — quản lý từng server (chung ba nơi): Ngắt (phiên) · Kết nối lại · Kết nối · Tắt hẳn; CT Work thêm đổi
           dự án · đổi quyền · bỏ gắn · đăng xuất. */
        ...sv.flatMap((x) => hanhDongMcp(x, nnV()).map((h) => ({
          nhan: `${h.nhan} · ${x.ten}`,
          lam: async () => { const bao = await lamHanhDongMcp(giaoDienCtwVsc(b), x.ten, h.giaTri); if (bao) { b.thongBao(bao, bao.startsWith('⚠')); await chayLenh('/mcp', b); } },
        }))),
        ...sv.filter((x) => x.ok).map((x) => ({
          nhan: `${Lv('Tool của', 'Tools of')} ${x.ten}`,
          lam: async () => {
            const ds = await b.goi<Array<{ ten: string; moTa: string }>>('agent:mcpTool', { ten: x.ten }).catch(() => []);
            b.traLoi(`**MCP · ${x.ten}** — ${ds.length} tool\n\n${ds.slice(0, 60).map((t) => `- \`${t.ten}\`${t.moTa ? ` — ${t.moTa}` : ''}`).join('\n')}`);
          },
        })),
      ]);
      return;
    }

    case '/export': {
      if (S.muc.length === 0) { b.traLoi('Việc này chưa có gì để xuất.'); return; }
      const luc = new Date();
      const tieuDe = S.tieuDe || 'Việc CuongMini Code';
      const noiDung = xuatMarkdown(S.muc, { tieuDe, duAn: S.ws?.name ?? null, luc }).replace('Xuất từ AI Code', 'Xuất từ CuongMini Code');
      const r = await b.goi<{ ok: boolean; huy?: boolean; duong?: string }>('vsc:luuMarkdown', { ten: tenFileXuat(tieuDe, luc), noiDung });
      b.traLoi(r.ok ? `Đã xuất ${S.muc.length} mục ra \`${r.duong}\`.` : 'Đã huỷ xuất.');
      return;
    }

    case '/doctor': {
      b.thongBao('Đang chẩn đoán…');
      const ds = await b.goi<Array<{ ten: string; muc: 'ok' | 'canh' | 'loi'; chiTiet: string }>>('agent:chanDoan')
        .catch((e: Error) => [{ ten: 'Chẩn đoán', muc: 'loi' as const, chiTiet: e.message }]);
      b.traLoi(moTaChanDoan(ds));
      return;
    }

    case '/offline':
      b.traLoi('AI ngoại tuyến (chạy trên máy) chỉ có trong app desktop CuongThai.');
      return;

    default:
      b.traLoi(`Lệnh \`${ten}\` chưa có trong VS Code.`);
  }
}

/** `/rewind n`: bỏ khỏi bảng mọi thứ từ câu hỏi thứ n trở đi (máy đã cắt hội thoại tương ứng). */
function catBangTuCau(n: number, S: BoiCanhLenh['S']): void {
  const bang = document.getElementById('bang')!;
  const nguoi = [...bang.querySelectorAll('.tin.nguoi')];
  const moc = nguoi[n - 1];
  if (moc) {
    let x: Element | null = moc;
    while (x) { const sau: Element | null = x.nextElementSibling; x.remove(); x = sau; }
  }
  let dem = 0;
  const cat = S.muc.findIndex((m) => m.kieu === 'nguoi' && ++dem === n);
  if (cat >= 0) S.muc.splice(cat);
}
