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
import { bocDong, veMarkdown } from './markdown';
import { L } from './i18n';
import { gio, giay, nhanTool, TOOL_GHI, TOOL_LENH } from './trangThai';

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
  if (con > 0) ra2[moRong ? 'push' : 'unshift'](mo(moRong ? L(`… +${con} dòng nữa`, `… +${con} more lines`) : L(`… ${con} dòng phía trên (ctrl+o để xem hết)`, `… +${con} lines above (ctrl+o to expand)`)));
  return ra2;
}

export function veTool(m: Extract<MucBang, { loai: 'tool' }>, rong: number): string[] {
  const cham = m.hong ? mau(DO)('●') : mau(XANH_LA)('●');
  const thamSo = m.duongDan ?? (TOOL_LENH.has(m.ten) ? m.lenh : null);
  const dau = dongTieuDeTool(m.ten, thamSo, cham, rong);
  const than: string[] = [];
  if (m.diff?.dong?.length && TOOL_GHI.has(m.ten)) {
    than.push(`${m.diff.soThem || m.diff.soBo ? demDiff(m.diff) : ''}${m.tomTat && !/^\+\d+ −\d+/.test(m.tomTat) ? mo(` ${m.tomTat}`) : ''}`.trim() || mo(m.tomTat));
    than.push(...veDiff(m.diff, { rong: rong - 5, duong: m.duongDan, toiDa: m.moRong ? 400 : 24 }));
  } else if (TOOL_LENH.has(m.ten)) {
    const ra = veDauRa(m.ra ?? '', rong, m.moRong);
    than.push(...ra);
    than.push(m.hong ? mau(DO)(m.tomTat) : mo(m.tomTat));
  } else {
    than.push(m.hong ? mau(DO)(m.tomTat || L('lỗi', 'error')) : mo(m.tomTat || L('xong', 'done')));
    if (m.moRong && m.chiTiet) than.push(...veDauRa(m.chiTiet, rong, true));
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
  const dau = mau(THUONG_HIEU.tim)(dam('❯'));
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

export function veMuc(m: MucBang, rong: number): string[] {
  switch (m.loai) {
    case 'chao': return [];
    case 'nguoi': return ['', ...veNguoi(m, rong)];
    case 'may': {
      const md = veMarkdown(m.text, { rong: rong - 2 }).split('\n');
      return ['', ...md.map((d, i) => (i === 0 ? `${mau(THUONG_HIEU.timNhat)('●')} ${d}` : `  ${d}`))];
    }
    case 'tool': return ['', ...veTool(m, rong)];
    case 'duyet':
      return [`  ${m.dongY ? mau(XANH_LA)(L('✓ Đã cho phép', '✓ Allowed')) : mau(DO)(L('✕ Đã từ chối', '✕ Denied'))} ${mo('·')} ${catVua(m.tieuDe, rong - 20)}`];
    case 'keHoach': return ['', `${mau(THUONG_HIEU.timNhat)('●')} ${dam(L('Kế hoạch', 'Plan'))}`, ...nhanhCon(veKeHoach(m.viec, rong - 5))];
    case 'heThong': {
      const v = mau(THUONG_HIEU.vien)('│');
      return ['', ...veMarkdown(m.text, { rong: rong - 3 }).split('\n').map((d) => `${v} ${d}`)];
    }
    case 'thongBao': {
      const dau = m.muc === 'loi' ? mau(DO)('⚠') : m.muc === 'canh' ? mau(VANG)('⚠') : m.muc === 'ok' ? mau(XANH_LA)('✓') : mau(THUONG_HIEU.xanhNhat)('ℹ');
      return bocDong(`${dau} ${m.muc === 'loi' ? mau(DO)(m.text) : mo(m.text)}`, rong);
    }
    case 'ketLuot': {
      const phan = [`CuongMini · ${gio(new Date(m.luc))}`];
      if (m.thoiLuong) phan.push(giay(m.thoiLuong));
      if (m.ghiChu) phan.push(m.ghiChu);
      return [`${mau(XANH_LA)('✓')} ${mo(phan.join(' · '))}`];
    }
    case 'loi': {
      const ra = ['', ...bocDong(`${mau(DO)('✗')} ${mau(DO)(m.text)}`, rong)];
      if (m.ma === 'PRO_REQUIRED') ra.push(`  ${mo(L('Cần gói Pro —', 'Requires Pro —'))} ${mau('#60a5fa')('https://cuongthai.com/pro')}`);
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
  for (const m of bang) {
    if (m.loai === 'chao') continue;
    const coRa = (m.loai === 'tool' && Boolean(m.ra || m.chiTiet || m.diff)) || m.loai === 'shell';
    const ban = coRa ? { ...m, moRong: moRong.has(m.id) } as MucBang : m;
    const v = veMuc(ban, rong);
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
  model: string;
  muc: string;
  cheDo: { ten: string; icon: string; mau: string };
  banMoi: string | null;
  lenhCai: string;
  ngoaiTuyen: boolean;
  /** AI đang được dùng trình duyệt (🌐). */
  trinhDuyet?: boolean;
}

/** Khung bo tròn, viền chuyển sắc tím → xanh, logo chữ, thông tin phiên, mẹo. */
export function veManMoDau(t: ThongTinMoDau, logo: string[], rongMan: number): string[] {
  const W = Math.max(30, Math.min(rongMan - 1, 96));
  const trong = W - 4;
  const vienTrai = mau(THUONG_HIEU.tim)('│');
  const vienPhai = mau(THUONG_HIEU.xanh)('│');
  const dong = (s = ''): string => `${vienTrai} ${dem(doRong(s) > trong ? catVua(s.replace(/\x1b\[[0-9;]*m/g, ''), trong) : s, trong)} ${vienPhai}`;
  const tieuDe = ` ✻ CuongMini CLI ${t.phienBan} `;
  const ngang = (trai: string, phai: string, giua: string): string => {
    const du = Math.max(0, W - 2 - doRong(giua) - 3);
    return capMau() ? chuyenSac(`${trai}───${giua}${'─'.repeat(du)}${phai}`, THUONG_HIEU.tim, THUONG_HIEU.xanh)
      : `${trai}───${giua}${'─'.repeat(du)}${phai}`;
  };
  const ra = [ngang('╭', '╮', tieuDe), dong()];
  for (const d of logo) ra.push(dong(` ${d}`));
  ra.push(dong());
  ra.push(dong(` ${dam(L(`Xin chào, ${t.ten}!`, `Welcome, ${t.ten}!`))} ${mo(L('Trợ lý lập trình của CuongThai — đọc, sửa code, chạy lệnh ngay tại đây.', 'Your CuongThai coding assistant — reads, edits and runs code right here.'))}`));
  ra.push(dong());
  const nhan = (k: string) => mo(k.padEnd(9));
  ra.push(dong(` ${nhan(L('Thư mục', 'cwd'))}${t.thuMuc}${t.nhanh ? `  ${mau('#a78bfa')(`⎇ ${t.nhanh}`)}` : ''}`));
  ra.push(dong(` ${nhan('Model')}${mau(THUONG_HIEU.xanhNhat)(t.model)}${mo(L(` · mức ${t.muc}`, ` · effort ${t.muc}`))}`));
  ra.push(dong(` ${nhan(L('Chế độ', 'Mode'))}${mau(t.cheDo.mau)(`${t.cheDo.icon} ${t.cheDo.ten}`)}${t.trinhDuyet ? `  ${mau('#60a5fa')(L('🌐 trình duyệt', '🌐 browser'))}` : ''}${mo(L('  (shift+tab để đổi)', '  (shift+tab to cycle)'))}`));
  ra.push(dong(` ${mo(L('         Đủ công cụ: sửa file, chạy lệnh, git, trình duyệt — mỗi lần sửa/chạy lệnh vẫn hỏi.', '         All tools on: edit files, run commands, git, browser — every edit/command still asks.'))}`));
  ra.push(dong(` ${mo(L('         shift+tab sang "Tự động" hoặc "Bỏ qua hết" nếu muốn khỏi hỏi.', '         shift+tab to "Auto mode" or "Bypass" to skip the prompts.'))}`));
  ra.push(dong());
  const k = (s: string) => mau(THUONG_HIEU.timNhat)(s);
  ra.push(dong(` ${mo(L('Mẹo:', 'Tips:'))} ${k('/help')} ${mo(L('xem lệnh ·', 'commands ·'))} ${k('@file')} ${mo(L('nhắc file ·', 'mention files ·'))} ${k('/model')} ${mo(L('đổi model ·', 'switch model ·'))} ${k('/language')}`));
  ra.push(dong(`      ${k(L('!lệnh', '!cmd'))} ${mo(L('chạy shell ·', 'run shell ·'))} ${k(L('# ghi chú', '# note'))} ${mo(L('lưu quy ước ·', 'save a rule ·'))} ${k('ctrl+v')} ${mo(L('dán ảnh', 'paste image'))}`));
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
