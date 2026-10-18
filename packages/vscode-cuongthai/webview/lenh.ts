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
  moTaDsPhien, moTaNguCanh, moTaTrangThai, moTaTroGiup, moTaUsage, promptPlan, promptReview, tachLenh, tenFileXuat,
  timMuc, timTheoChu, xuatMarkdown, type MucGhi, type PhienCu,
} from 'ct-lenh';

export interface BoiCanhLenh {
  S: {
    ws: { name?: string; path?: string; branch?: string | null; cheDoQuyen?: string; mucNoLuc?: string; model?: string } | null;
    muc: MucGhi[]; tieuDe: string; tienPhien: number; soFileDaSua: number; buoc: { nay: number; tran: number } | null;
    lenhDuAn: Array<{ ten: string; mo: string; than: string }>; choDuyetKeHoach: boolean; daCompact: boolean;
    phienBan: string; cheDoKetNoi: 'app' | 'docLap'; dangChay: boolean;
  };
  goi: <T = unknown>(kenh: string, duLieu?: unknown) => Promise<T>;
  gui: (m: unknown) => void;
  guiThat: (text: string, o: { chiDoc?: boolean; hienThi?: string }) => void;
  traLoi: (chu: string | null) => void;
  thongBao: (chu: string, loi?: boolean) => void;
  xoaBang: () => void;
  moLichSu: () => Promise<void>;
  doiModel: (id: string) => Promise<void>;
  doiMuc: (id: string) => Promise<void>;
  doiCheDo: (id: string) => Promise<void>;
  dsModel: () => Array<{ id: string; ten: string; mo: string; dungDuoc: boolean; dat?: boolean }>;
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
      if (!r?.goc) { b.traLoi('Chưa mở dự án nào.'); return; }
      const hien = (k: string): string => (k.startsWith('tien-to:') ? `\`${k.slice(8)} …\` (mọi lệnh bắt đầu bằng)` : `\`${k}\``);
      b.traLoi(r.khoa.length === 0
        ? `Dự án \`${r.goc}\` chưa có quyền nào được "Luôn cho phép". Thêm: \`/quyen them npm test\`.`
        : `**${r.khoa.length}** thứ đang được tự duyệt ở \`${r.goc}\`:\n\n${r.khoa.map((x, i) => `${i + 1}. ${hien(x)}`).join('\n')}\n\nThêm tiền tố: \`/quyen them npm test\` · thu hồi một mục: \`/quyen xoa <số>\` · tất cả: \`/quyen xoa\``);
      return;
    }

    /* ── Đợt 3 (18/10/2026) ── */
    case '/sessions': {
      const r = await b.goi<{ toi: { id: string; ten: string } | null; ds: Array<{ id: string; ten: string; noi: string; thuMuc: string | null; trangThai: string }> } | null>('agent:dsPhienMang').catch(() => null);
      if (!r) { b.traLoi('Bản này chưa hỗ trợ nhắn giữa phiên (cập nhật app/extension).'); return; }
      b.traLoi(`${r.toi ? `Phiên này: **${r.toi.ten}** (\`${r.toi.id}\`)` : 'Phiên này chưa đăng ký (đăng ký sau lượt đầu tiên).'}\n\n${r.ds.length
        ? `Phiên khác đang mở:\n\n${r.ds.map((x) => `- \`${x.id}\` **${x.ten}** · ${x.noi} · ${x.trangThai === 'dangChay' ? 'đang chạy' : 'rảnh'} · ${x.thuMuc ?? '—'}`).join('\n')}\n\nAgent tự nhắn được bằng tool \`nhan_phien\` (bạn duyệt nội dung trước khi gửi). Đổi tên phiên này: \`/rename <tên>\`.`
        : 'Không có phiên CuongMini nào khác đang mở trên máy này.'}`);
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
        b.traLoi(ds.length ? `Worktree của repo:\n\n${ds.map((w) => `- ${w.dangDung ? '▶ ' : ''}\`${w.duongDan}\` · ${w.nhanh ?? '(tách rời)'}${w.laChinh ? ' · cây chính' : ''}`).join('\n')}\n\nTạo + mở ở cửa sổ mới: \`/worktree <tên>\` · xoá: \`/worktree xoa <đường>\`` : 'Thư mục này không phải kho git.');
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
    case '/hen': {
      const d = thamSo.split(/\s+/).filter(Boolean);
      if (d[0] === 'huy' || d[0] === 'cancel') { const n = await b.goi<number>('agent:huyHen', d[1] ? { id: d[1].replace(/^#/, '') } : {}).catch(() => 0); b.traLoi(`Đã huỷ ${n ?? 0} hẹn.`); return; }
      const r = await b.goi<{ cho: Array<{ moTa: string }>; hen: Array<{ id: string; lyDo: string; luc: number; lap: boolean; phut: number; conLai: number }> } | null>('agent:henCho').catch(() => null);
      b.traLoi(r && (r.cho.length || r.hen.length)
        ? [...r.cho.map((c) => `- ⏳ Đang chờ: ${c.moTa}`), ...r.hen.map((h) => `- ⏰ \`${h.id}\` ${new Date(h.luc).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}${h.lap ? ` · lặp mỗi ${h.phut}′ · còn ${h.conLai}×` : ''} — ${h.lyDo}`), '', 'Huỷ: `/hen huy <id>` · `/hen huy` (tất cả). Hẹn chỉ chạy khi VS Code còn mở.'].join('\n')
        : 'Không có việc chờ hay hẹn nào.');
      return;
    }
    case '/ctwork': {
      const q = thamSo.trim().toLowerCase();
      type Kq = { ok: boolean; loi?: string; soTool?: number; quyen?: string | null; bienTay?: boolean; server?: { ok: boolean; soTool: number } | null };
      if (/^(off|tat|tắt|ngat|ngắt)$/.test(q)) { const r = await b.goi<Kq>('agent:ctwork', { viec: 'ngat' }); b.traLoi(r?.ok ? 'Đã ngắt CT Work: thu hồi token, gỡ server `ctwork`.' : `⚠ ${r?.loi ?? '?'}`); return; }
      if (/^(doc|đọc|read|ghi|write)$/.test(q)) {
        b.thongBao('Đang kết nối CT Work…');
        const r = await b.goi<Kq>('agent:ctwork', { viec: 'noi', quyen: /^(ghi|write)$/.test(q) ? 'ghi' : 'doc' });
        b.traLoi(r?.ok ? `✓ ctwork · ${r.soTool ?? 0} tool. Hỏi thử: "việc của tôi trong CT Work hôm nay".` : `⚠ ${r?.loi ?? '?'}`);
        return;
      }
      const t = await b.goi<Kq>('agent:ctwork', { viec: 'trangThai' }).catch(() => null);
      b.traLoi(t?.server?.ok
        ? `✓ ctwork · ${t.server.soTool} tool · ${t.bienTay ? 'token từ biến CTWORK_TOKEN' : t.quyen === 'ghi' ? 'đọc + ghi' : 'chỉ đọc'}. Đổi: \`/ctwork doc\` · \`/ctwork ghi\` · ngắt: \`/ctwork off\`.`
        : 'Chưa kết nối CT Work. Gõ `/ctwork doc` (chỉ đọc, khuyên dùng) hoặc `/ctwork ghi` (đọc + ghi) — extension tạo token bằng tài khoản đang đăng nhập và cất riêng trên máy; AI không bao giờ thấy token.');
      return;
    }

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
      if (!m) { b.traLoi(`Không rõ model "${q}". Có:\n\n${b.dsModel().map((x) => `- \`${x.id}\` — ${x.ten}${x.dungDuoc ? '' : ' (chưa mở)'}`).join('\n')}`); return; }
      if (!m.dungDuoc) { b.traLoi(`**${m.ten}** chưa dùng được — máy chủ chưa mở nhà cung cấp này.`); return; }
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
      const nayModel = b.dsModel().find((x) => x.id === (S.ws?.model ?? 'sonnet-5'));
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
      const tt = await b.goi<{ duongDan: string; server: Array<{ ten: string; ok: boolean; soTool: number; loi?: string; canDuyet?: boolean }> } | null>('agent:mcpTrangThai').catch(() => null);
      await b.goi('agent:mcpMoCauHinh').catch(() => undefined);
      const sv = tt?.server ?? [];
      b.traLoi(`**Máy chủ MCP**${sv.length ? `\n\n${sv.map((x) => `- ${x.ok ? '✓' : x.canDuyet ? '⏸' : '✗'} \`${x.ten}\`${x.soTool ? ` · ${x.soTool} tool` : ''}${x.loi ? ` · ${x.loi}` : ''}${x.canDuyet ? ' · chờ duyệt' : ''}`).join('\n')}` : ' — chưa cấu hình máy chủ nào.'}\n\nĐã mở file cấu hình${tt?.duongDan ? ` \`${tt.duongDan}\`` : ''}; sửa xong gõ \`/mcp\` lần nữa để nạp lại.`);
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
