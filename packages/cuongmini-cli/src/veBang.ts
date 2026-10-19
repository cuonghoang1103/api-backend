/**
 * VẼ các mục ĐÃ XONG của hội thoại thành chuỗi ANSI — dùng chung cho giao diện
 * Ink (in vào vùng cuộn) và chế độ in `-p` (in ra stderr). Thuần, kiểm được.
 *
 * Kiểu Claude Code:
 *   ● Đọc(src/app.ts)
 *     ⎿  120/120 dòng
 *   ● Lệnh(npm test)
 *     ⎿  ✓ 12 passed
 *        … +40 dòng (ctrl+o để xem hết)
 */
import { demDiff, veDiff } from './diff';
import type { MucBang, ViecKeHoach } from './kho';
import { THUONG_HIEU, capMau, catVua, chuyenSac, dam, dem, doRong, mau, mo, nen, nghieng } from './mau';
import { bocDong, bocVan, veMarkdown } from './markdown';
import { phimDanAnh } from './banPhim';
import { L } from './i18n';
import { dichTomTat, gio, giay, nhanNhom, nhanTool, TOOL_GHI, TOOL_LENH } from './trangThai';

const XANH_LA = '#4ade80';
const DO = '#f87171';
const VANG = '#fbbf24';

/** Số dòng đầu ra lệnh giữ lại khi thu gọn. */
export const DONG_THU_GON = 4;

const thut = (dong: string[], n = 2): string[] => dong.map((d) => (d ? ' '.repeat(n) + d : d));

/** `  ⎿  dòng 1` rồi các dòng sau thụt thẳng hàng. */
function nhanhCon(dong: string[]): string[] {
  return dong.map((d, i) => (i === 0 ? `  ${mo('⎿')}  ${d}` : `     ${d}`));
}

export function dongTieuDeTool(ten: string, thamSo: string | null | undefined, cham: string, rong: number): string {
  const nhan = nhanTool(ten);
  const ts = thamSo ? catVua(thamSo.replace(/\s+/g, ' '), Math.max(10, rong - doRong(nhan) - 6)) : '';
  return `${cham} ${dam(nhan)}${ts ? `${mo('(')}${ts}${mo(')')}` : ''}`;
}

/** Đầu ra lệnh: thu gọn còn vài dòng cuối, hoặc đầy đủ (ctrl+o). */
export function veDauRa(ra: string, rong: number, moRong: boolean): string[] {
  const dong = ra.replace(/\r\n?/g, '\n').replace(/\n+$/, '').split('\n').map((d) => d.replace(/\t/g, '  ').replace(/\x1b\[[0-9;?]*[A-Za-z]/g, ''));
  if (!dong.length || (dong.length === 1 && !dong[0])) return [];
  const tran = moRong ? 400 : DONG_THU_GON;
  const lay = dong.length > tran ? (moRong ? dong.slice(0, tran) : dong.slice(-tran)) : dong;
  const ra2 = lay.map((d) => mo(catVua(d, Math.max(10, rong - 7))));
  const con = dong.length - lay.length;
  if (con > 0) ra2[moRong ? 'push' : 'unshift'](mo(moRong ? L(`… +${con} dòng nữa`, `… +${con} more lines`) : L(`… ${con} dòng phía trên (ctrl+o để xem hết)`, `… +${con} line${con === 1 ? '' : 's'} above (ctrl+o to expand)`)));
  return ra2;
}

/** Tóm tắt kết quả cho người đọc: dịch theo ngôn ngữ; "Navigate(x) ⎿ https://x" ⇒ bỏ lặp. */
function tomTatHien(ten: string, tomTat: string, thamSo: string | null | undefined): string {
  const t = dichTomTat(tomTat);
  if (ten === 'web_mo' && thamSo && t.replace(/^https?:\/\//, '').replace(/\/$/, '') === thamSo) return L('đã mở', 'opened');
  return t;
}

/** Kết quả tool là lời dặn model khi người dùng từ chối/hook chặn (chữ của lõi) — ẩn khỏi bảng ghi. */
const laLoiDanModel = (t: string | undefined): boolean => /^(NGƯỜI DÙNG TỪ CHỐI|BỊ CHẶN bởi hook)/.test(t ?? ''); // i18n-bo-qua: chữ của lõi

export function veTool(m: Extract<MucBang, { loai: 'tool' }>, rong: number): string[] {
  const cham = m.hong ? mau(DO)('●') : mau(XANH_LA)('●');
  // Nhóm (`● Read 3 pages`): một dòng tiêu đề + các tham số; mở rộng (ctrl+o) thì từng lần một.
  if (m.nhom && m.nhom.length > 1) {
    const dau = `${cham} ${dam(nhanNhom(m.ten, m.nhom.length))}`;
    const cac = m.nhom.map((x) => x.thamSo).filter(Boolean) as string[];
    const than: string[] = [];
    if (m.moRong) {
      for (const x of m.nhom) than.push(`${x.thamSo ? `${x.thamSo} ${mo('—')} ` : ''}${mo(tomTatHien(m.ten, x.tomTat, x.thamSo))}`);
    } else {
      if (cac.length) than.push(mo(catVua(cac.join(' · '), Math.max(10, rong - 7))));
      than.push(mo(`${tomTatHien(m.ten, m.tomTat, m.nhom[m.nhom.length - 1]!.thamSo)}${L(' (ctrl+o để xem từng lần)', ' (ctrl+o to expand)')}`));
    }
    return [dau, ...nhanhCon(than)];
  }
  // Tham số chính của lõi TRƯỚC (`Search("TODO" in src)`) — `duongDan` chỉ là đường dẫn, mất mẫu tìm (QA 18/10: `Search(src)`).
  const thamSo = (TOOL_LENH.has(m.ten) ? m.lenh : null) ?? m.thamSo ?? m.duongDan ?? null;
  /* Đợt 5: tool CT Work = MỘT dòng kiểu Claude Code — `● CT Work · sprint_current — Sprint 2 · 14 thẻ`;
     ctrl+o mở bảng gọn (`xemGon`), không bao giờ đổ JSON thô. */
  if (m.ten.startsWith('mcp__ctwork__')) {
    const dauCt = `${dongTieuDeTool(m.ten, thamSo, cham, Math.max(20, rong - 30))} ${mo('—')} ${m.hong ? mau(DO)(dichTomTat(m.tomTat)) : mo(catVua(dichTomTat(m.tomTat), Math.max(10, rong - 30)))}`;
    if (!m.moRong) return [`${dauCt}${m.xemGon ? mo(L('  (ctrl+o)', '  (ctrl+o)')) : ''}`];
    const bang = m.xemGon ? veMarkdown(m.xemGon, { rong: rong - 5 }).split('\n') : m.chiTiet && !laLoiDanModel(m.chiTiet) ? veDauRa(m.chiTiet, rong, true) : [];
    return [dauCt, ...nhanhCon(bang)];
  }
  const dau = dongTieuDeTool(m.ten, thamSo, cham, rong);
  const than: string[] = [];
  if (m.diff?.dong?.length && TOOL_GHI.has(m.ten)) {
    than.push(`${m.diff.soThem || m.diff.soBo ? demDiff(m.diff) : ''}${m.tomTat && !/^\+\d+ −\d+/.test(m.tomTat) ? mo(` ${m.tomTat}`) : ''}`.trim() || mo(m.tomTat));
    than.push(...veDiff(m.diff, { rong: rong - 5, duong: m.duongDan, toiDa: m.moRong ? 400 : 24 }));
  } else if (TOOL_LENH.has(m.ten)) {
    // Từ chối: "đầu ra" là lời DẶN MODEL của lõi ("NGƯỜI DÙNG TỪ CHỐI… ĐỪNG gọi lại…") — không phải thứ người dùng cần đọc.
    const ra = laLoiDanModel(m.ra) ? [] : veDauRa(m.ra ?? '', rong, m.moRong);
    than.push(...ra);
    than.push(m.hong ? mau(DO)(dichTomTat(m.tomTat)) : mo(dichTomTat(m.tomTat)));
  } else {
    const tt = tomTatHien(m.ten, m.tomTat, thamSo);
    than.push(m.hong ? mau(DO)(tt || L('lỗi', 'error')) : mo(tt || L('xong', 'done')));
    // Đợt 5: tool CT Work có BẢNG GỌN — mở rộng (ctrl+o) hiện bảng đó, không đổ JSON thô.
    if (m.moRong && m.xemGon) than.push(...veMarkdown(m.xemGon, { rong: rong - 5 }).split('\n'));
    else if (m.moRong && m.chiTiet && !laLoiDanModel(m.chiTiet)) than.push(...veDauRa(m.chiTiet, rong, true));
  }
  return [dau, ...nhanhCon(than.filter((d) => d !== ''))];
}

export function veKeHoach(viec: readonly ViecKeHoach[], rong: number): string[] {
  return viec.map((v) => {
    const xong = v.trangThai === 'xong';
    const dang = v.trangThai === 'dang';
    const dau = xong ? mau(XANH_LA)('☑') : dang ? mau(VANG)('◐') : mo('☐');
    const chu = catVua(v.ten, Math.max(8, rong - 2));
    return `${dau} ${xong ? mo(chu) : dang ? dam(chu) : chu}`;
  });
}

export function veNguoi(m: Extract<MucBang, { loai: 'nguoi' }>, rong: number): string[] {
  // Kiểu Claude Code: `> câu hỏi` trên nền nhạt — nhìn là biết đâu là câu của mình.
  const dau = mo('>');
  const gioChu = m.luc ? mo(gio(new Date(m.luc))) : '';
  const nenTin = capMau() >= 2 ? nen('#221d33') : (s: string) => s;
  const rongChu = Math.max(10, rong - 4 - (gioChu ? doRong(gioChu) + 1 : 0));
  const dong = m.text.split('\n').flatMap((d) => bocDong(d.replace(/(^|\s)(@[^\s]+)/g, (_, a: string, b: string) => `${a}${mau('#7dd3fc')(b)}`), rongChu));
  const ra = dong.map((d, i) => {
    const trai = `${i === 0 ? dau : ' '} ${d}`;
    if (i === 0 && gioChu) return nenTin(`${dem(trai, rong - doRong(gioChu) - 1)}${gioChu} `);
    return nenTin(dem(trai, rong));
  });
  if (m.soAnh) ra.push(`  ${mo(L(`🖼  kèm ${m.soAnh} ảnh`, `🖼  ${m.soAnh} image${m.soAnh > 1 ? 's' : ''} attached`))}`);
  return ra;
}

/**
 * `truoc` = mục ngay trước (để quyết khoảng trống): tool nối tool KHÔNG có dòng trống
 * (kiểu Claude Code — một chuỗi đọc/tìm liền mạch), còn lại cách một dòng.
 */
export function veMuc(m: MucBang, rong: number, truoc?: MucBang): string[] {
  switch (m.loai) {
    case 'chao': return [];
    case 'nguoi': return ['', ...veNguoi(m, rong)];
    case 'may': {
      const md = veMarkdown(m.text, { rong: rong - 2 }).split('\n');
      return ['', ...md.map((d, i) => (i === 0 ? `${mau(THUONG_HIEU.timNhat)('●')} ${d}` : `  ${d}`))];
    }
    case 'tool': return [...(truoc?.loai === 'tool' || truoc?.loai === 'duyet' ? [] : ['']), ...veTool(m, rong)];
    case 'duyet':
      if (m.traLoi) return [`  ${m.dongY ? mau(XANH_LA)('✓') : mo('–')} ${catVua(m.tieuDe, rong - 6)}`];
      return [`  ${m.dongY ? mau(XANH_LA)(L('✓ Đã cho phép', '✓ Allowed')) : mau(DO)(L('✕ Đã từ chối', '✕ Denied'))} ${mo('·')} ${catVua(m.tieuDe, rong - 20)}`];
    case 'keHoach': return ['', `${mau(THUONG_HIEU.timNhat)('●')} ${dam(L('Kế hoạch', 'Plan'))}`, ...nhanhCon(veKeHoach(m.viec, rong - 5))];
    case 'heThong': {
      const v = mau(THUONG_HIEU.vien)('│');
      return ['', ...veMarkdown(m.text, { rong: rong - 3 }).split('\n').map((d) => `${v} ${d}`)];
    }
    case 'thongBao': {
      const dau = m.muc === 'loi' ? mau(DO)('⚠') : m.muc === 'canh' ? mau(VANG)('⚠') : m.muc === 'ok' ? mau(XANH_LA)('✓') : mau(THUONG_HIEU.xanhNhat)('ℹ');
      // Dòng nối thụt 2 cột cho thẳng chữ (không chạy về cột 0 dưới dấu ✓). Đợt 5: một dòng trống trước khối
      // (như Claude Code), trừ khi nối tiếp thông báo khác.
      const cach = truoc && truoc.loai !== 'thongBao' && truoc.loai !== 'chao' ? [''] : [];
      return [...cach, ...bocDong(m.muc === 'loi' ? mau(DO)(m.text) : mo(m.text), rong - 2).map((d, i) => (i === 0 ? `${dau} ${d}` : `  ${d}`))];
    }
    case 'dinhKem':
      // Đợt 5: chip kiểu `@file` ngay dưới tin người dùng.
      return [`  ${m.khoa.map((k) => mau('#7dd3fc')(`📎 ${k}`)).join(mo('  '))} ${mo(L('· đã đính kèm tóm tắt thẻ CT Work', '· CT Work issue summary attached'))}`];
    case 'ketLuot': {
      const phan = [`CuongMini · ${gio(new Date(m.luc))}`];
      if (m.thoiLuong) phan.push(giay(m.thoiLuong));
      if (m.ghiChu) phan.push(m.ghiChu);
      return [`${mau(XANH_LA)('✓')} ${mo(phan.join(' · '))}`];
    }
    case 'loi': {
      const ra = ['', ...bocDong(`${mau(DO)('✗')} ${mau(DO)(m.text)}`, rong)];
      if (m.ma === 'PRO_REQUIRED') {
        ra.push(`  ${mo(L('Model này cần gói Pro —', 'This model needs Pro —'))} ${mau('#60a5fa')('https://cuongthai.com/pro')}`);
        /* 19/10/2026: tài khoản miễn phí dùng được CuongMini Default. */
        ra.push(`  ${mo(L('Tài khoản miễn phí: chọn CuongMini Default bằng /model.', 'Free account: pick CuongMini Default with /model.'))}`);
      }
      return ra;
    }
    case 'shell': {
      const dau = `${mau(VANG)(dam('!'))} ${dam(catVua(m.lenh.replace(/\s+/g, ' '), rong - 4))}`;
      const ra = veDauRa(m.ra, rong, m.moRong);
      const ket = m.biHuy ? mau(VANG)(L('đã dừng', 'interrupted')) : m.ma === 0 ? mo(L(`xong ${m.giay.toFixed(1)}s`, `done in ${m.giay.toFixed(1)}s`)) : mau(DO)(L(`mã thoát ${m.ma ?? '—'} · ${m.giay.toFixed(1)}s`, `exit code ${m.ma ?? '—'} · ${m.giay.toFixed(1)}s`));
      return ['', dau, ...nhanhCon([...ra, ket])];
    }
    default: return [];
  }
}

/**
 * Bảng ghi đầy đủ cho màn xem lại (ctrl+r / ctrl+o): mọi mục đã xong, tool nằm
 * trong `moRong` thì in trọn đầu ra. Trả kèm vị trí từng khối có đầu ra để nhảy
 * giữa chúng.
 */
export function dungBanGhi(bang: readonly MucBang[], rong: number, moRong: ReadonlySet<number>): { dong: string[]; khoi: Array<{ id: number; dau: number; cuoi: number; nhan: string }> } {
  const dong: string[] = [];
  const khoi: Array<{ id: number; dau: number; cuoi: number; nhan: string }> = [];
  let truoc: MucBang | undefined;
  for (const m of bang) {
    if (m.loai === 'chao') continue;
    const coRa = (m.loai === 'tool' && Boolean(m.ra || m.chiTiet || m.xemGon || m.diff || (m.nhom && m.nhom.length > 1))) || m.loai === 'shell';
    const ban = coRa ? { ...m, moRong: moRong.has(m.id) } as MucBang : m;
    const v = veMuc(ban, rong, truoc);
    truoc = m;
    const dau = dong.length + (v[0] === '' ? 1 : 0);
    dong.push(...v);
    if (coRa) khoi.push({ id: m.id, dau, cuoi: dong.length - 1, nhan: m.loai === 'shell' ? `! ${m.lenh}` : `${nhanTool(m.ten)}${m.duongDan ? ` ${m.duongDan}` : m.lenh ? ` ${m.lenh}` : ''}` });
  }
  return { dong, khoi };
}

// ─── Màn mở đầu ──────────────────────────────────────────────────

export interface ThongTinMoDau {
  phienBan: string;
  ten: string;
  thuMuc: string;
  nhanh: string | null;
  /**
   * Model/mức/chế độ HIỆN TẠI. Bỏ trống (in nối tiếp: banner in một lần rồi nằm im trong
   * scrollback) ⇒ không in các dòng này — chân trang đã hiện bản đang đúng, lặp lại chỉ để sai.
   */
  model?: string;
  muc?: string;
  cheDo?: { ten: string; icon: string; mau: string };
  banMoi: string | null;
  lenhCai: string;
  ngoaiTuyen: boolean;
  /** AI đang được dùng trình duyệt (🌐). */
  trinhDuyet?: boolean;
}

/** `/rất/dài/…/du-an` — rút GIỮA theo số cột, giữ đầu và đuôi (tên thư mục dự án). */
export function rutGiua(s: string, n: number): string {
  if (n <= 0 || doRong(s) <= n) return s;
  if (n < 8) return catVua(s, n);
  /* Đợt 4: '...' (3 cột ASCII) thay cho '…' — U+2026 có độ rộng MẬP MỜ (East Asian Ambiguous): terminal bật
     "ambiguous = double width" vẽ nó 2 cột ⇒ viền phải banner lệch 1 cột. */
  const duoi = Math.ceil((n - 3) * 0.6);
  const dau = n - 3 - duoi;
  return `${[...s].slice(0, dau).join('')}...${[...s].slice(-duoi).join('')}`;
}

/** Khung bo tròn, viền chuyển sắc tím → xanh, logo chữ, thông tin phiên, mẹo. */
export function veManMoDau(t: ThongTinMoDau, logo: string[], rongMan: number): string[] {
  const W = Math.max(30, Math.min(rongMan - 1, 96));
  const trong = W - 4;
  const vienTrai = mau(THUONG_HIEU.tim)('│');
  const vienPhai = mau(THUONG_HIEU.xanh)('│');
  /* Đợt 4 — viền phải lệch 1 cột: '·' (U+00B7) là ký tự độ rộng MẬP MỜ (terminal tuỳ chỉnh vẽ 1 hoặc 2 cột) và
     '⎇' vẽ tràn ô ở nhiều font. Trong khung có viền phải thì chỉ dùng ký tự chắc chắn 1 cột. */
  const anToan = (s: string): string => s.replace(/·/g, '|').replace(/⎇ /g, 'git:');
  const dong = (s0 = ''): string => { const s = anToan(s0); return `${vienTrai} ${dem(doRong(s) > trong ? catVua(s.replace(/\x1b\[[0-9;]*m/g, ''), trong) : s, trong)} ${vienPhai}`; };
  const tieuDe = ` ✻ CuongMini CLI ${t.phienBan} `;
  const ngang = (trai: string, phai: string, giua: string): string => {
    const du = Math.max(0, W - 2 - doRong(giua) - 3);
    return capMau() ? chuyenSac(`${trai}───${giua}${'─'.repeat(du)}${phai}`, THUONG_HIEU.tim, THUONG_HIEU.xanh)
      : `${trai}───${giua}${'─'.repeat(du)}${phai}`;
  };
  const ra = [ngang('╭', '╮', tieuDe), dong()];
  for (const d of logo) ra.push(dong(` ${d}`));
  ra.push(dong());
  /* Câu dài trong khung: BỌC xuống dòng (thụt `thut`), không cắt "…" — ảnh người dùng 18/10: "reads, edits and runs code r…"
     ngay cả ở terminal rộng 200 cột (khung chỉ 96). */
  const dongBoc = (s: string, thut: number): string[] => bocVan(s, trong - thut).map((m) => dong(`${' '.repeat(thut)}${m}`));
  ra.push(...dongBoc(`${dam(L(`Xin chào, ${t.ten}!`, `Welcome, ${t.ten}!`))} ${mo(L('Trợ lý lập trình của CuongThai — đọc, sửa code, chạy lệnh ngay tại đây.', 'Your CuongThai coding assistant — reads, edits and runs code right here.'))}`, 1));
  ra.push(dong());
  const nhan = (k: string) => mo(k.padEnd(9));
  // Đường dẫn dài: rút GIỮA (giữ tên dự án ở cuối) — cắt đuôi là mất đúng phần người dùng cần nhìn.
  const nhanhChu = t.nhanh ? `  ${mau('#a78bfa')(`git:${t.nhanh}`)}` : '';
  ra.push(dong(` ${nhan(L('Thư mục', 'cwd'))}${rutGiua(t.thuMuc, trong - 10 - (t.nhanh ? doRong(t.nhanh) + 6 : 0))}${nhanhChu}`));
  if (t.model) ra.push(dong(` ${nhan('Model')}${mau(THUONG_HIEU.xanhNhat)(t.model)}${t.muc ? mo(L(` · mức ${t.muc}`, ` · effort ${t.muc}`)) : ''}`));
  if (t.cheDo) {
    ra.push(dong(` ${nhan(L('Chế độ', 'Mode'))}${mau(t.cheDo.mau)(`${t.cheDo.icon} ${t.cheDo.ten}`)}${t.trinhDuyet ? `  ${mau('#60a5fa')(L('🌐 trình duyệt', '🌐 browser'))}` : ''}${mo(L('  (shift+tab để đổi)', '  (shift+tab to cycle)'))}`));
    ra.push(...dongBoc(mo(L('Đủ công cụ: sửa file, chạy lệnh, git, trình duyệt — mỗi lần sửa/chạy lệnh vẫn hỏi.', 'All tools on: edit files, run commands, git, browser — every edit/command still asks.')), 10));
    ra.push(...dongBoc(mo(L('shift+tab sang "Tự động" hoặc "Bỏ qua hết" nếu muốn khỏi hỏi.', 'shift+tab to "Auto mode" or "Bypass" to skip the prompts.')), 10));
  } else {
    ra.push(dong(` ${nhan(L('Chế độ', 'Mode'))}${mo(L('model, mức và chế độ đang dùng hiện ở dòng dưới cùng · shift+tab đổi chế độ', 'current model, effort and mode are shown in the bottom line · shift+tab to cycle'))}`));
  }
  ra.push(dong());
  const k = (s: string) => mau(THUONG_HIEU.timNhat)(s);
  ra.push(dong(` ${mo(L('Mẹo:', 'Tips:'))} ${k('/help')} ${mo(L('xem lệnh ·', 'commands ·'))} ${k('@file')} ${mo(L('nhắc file ·', 'mention files ·'))} ${k('/model')} ${mo(L('đổi model ·', 'switch model ·'))} ${k('/language')}`));
  ra.push(dong(`      ${k(L('!lệnh', '!cmd'))} ${mo(L('chạy shell ·', 'run shell ·'))} ${k(L('# ghi chú', '# note'))} ${mo(L('lưu quy ước ·', 'save a rule ·'))} ${k(phimDanAnh())} ${mo(L('dán ảnh', 'paste image'))}`));
  ra.push(dong(`      ${k('shift+tab')} ${mo(L('đổi chế độ ·', 'mode ·'))} ${k('esc esc')} ${mo(L('quay lui ·', 'rewind ·'))} ${k('ctrl+r')} ${mo(L('xem lại ·', 'transcript ·'))} ${k('↓')} ${mo(L('agent phụ', 'subagents'))}`));
  if (t.ngoaiTuyen) { ra.push(dong()); ra.push(dong(` ${mau(VANG)(L('⚠ Chưa kết nối được máy chủ — đang dùng phiên đã lưu.', '⚠ Server unreachable — using the saved session.'))}`)); }
  if (t.banMoi) {
    ra.push(dong());
    ra.push(dong(` ${mau(VANG)(L(`⬆ Có bản mới ${t.banMoi}`, `⬆ Update available: ${t.banMoi}`))} ${mo(L('— cập nhật:', '— run:'))} ${t.lenhCai}`));
  }
  ra.push(ngang('╰', '╯', ''));
  return ra;
}

export const nghiengMo = (s: string): string => nghieng(mo(s));
