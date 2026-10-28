/**
 * Các mảnh giao diện "đang sống" ở đáy màn hình: chữ đang chảy, tool đang
 * chạy, dòng trạng thái, thẻ duyệt, bảng kế hoạch, ô nhập, gợi ý, chân trang,
 * menu chọn. Tất cả là thành phần THUẦN HIỂN THỊ — phím do `ManChat` xử lý.
 */
import { Box } from 'ink';
import { Text } from './chu';
import { kieuVien } from '../kyTu';
import { moTaCheDo } from '../cheDo';
import { veDiff } from '../diff';
import { L } from '../i18n';
import { tenViecGit, type ChoDuyet, type TrangThaiChat } from '../kho';
import { THUONG_HIEU, catVua, dam, dao, doRong, mau, mauInk, mo } from '../mau';
import { bocDong, bocVan, duoiMarkdown } from '../markdown';
import { cauTrangThai, dichLyDo, dichMoTaCho, giay, SAO, TOOL_LENH } from '../trangThai';
import { dongTieuDeTool, veDauRa, veKeHoach, veTool } from '../veBang';
import type { ONhap } from './soanThao';

const XAM = THUONG_HIEU.vien;

// ─── Chữ đang chảy + tool đang chạy ──────────────────────────────

export function VungSong({ S, rong, toiDaDong, nhip }: { S: TrangThaiChat; rong: number; toiDaDong: number; nhip: number }) {
  const phan: string[] = [];
  // Nhóm tool chỉ-đọc đang gom (chưa in vào bảng ghi) — hiện ngay ở đây cho khỏi "im".
  if (S.toolCho) phan.push(...veTool(S.toolCho, rong));
  if (S.chuDangViet.trim()) {
    const { dong, anBot } = duoiMarkdown(S.chuDangViet, rong - 2, Math.max(3, toiDaDong));
    if (anBot) phan.push(mo(L(`  … ${anBot} dòng phía trên`, `  … ${anBot} lines above`)));
    dong.forEach((d, i) => phan.push(i === 0 && !anBot ? `${mau(THUONG_HIEU.timNhat)('●')} ${d}` : `  ${d}`));
  }
  for (const t of S.toolChay) {
    const sang = nhip % 2 === 0;
    const cham = mau(sang ? THUONG_HIEU.timNhat : THUONG_HIEU.tim)(sang ? '●' : '○');
    // Tool nối tool: không có dòng trống (kiểu Claude Code).
    phan.push(dongTieuDeTool(t.ten, t.lenh ?? t.thamSo, cham, rong));
    if (TOOL_LENH.has(t.ten)) {
      const ra = veDauRa(t.ra, rong, false);
      // Thẻ duyệt đang mở ⇒ lệnh CHƯA chạy (QA 18/10: "running… 10s" trong lúc chờ bạn bấm Yes).
      const dong = ra.length ? ra : [mo(S.pha === 'duyet' && S.choDuyet.length ? L('chờ bạn duyệt…', 'waiting for approval…') : L(`đang chạy… ${giay(Date.now() - t.batDau)}`, `running… ${giay(Date.now() - t.batDau)}`))];
      dong.forEach((d, i) => phan.push(i === 0 ? `  ${mo('⎿')}  ${d}` : `     ${d}`));
    }
  }
  if (!phan.length) return null;
  // Tool nối tiếp tool vừa in vào bảng ghi ⇒ không cách dòng (một chuỗi liền như Claude Code).
  const sat = !S.chuDangViet.trim() && S.bang[S.bang.length - 1]?.loai === 'tool';
  return <Box flexDirection="column" marginTop={sat ? 0 : 1}><Text>{phan.join('\n')}</Text></Box>;
}

// ─── Dòng trạng thái ✻ Đang … ────────────────────────────────────

export function DongTrangThai({ S, nhip }: { S: TrangThaiChat; nhip: number }) {
  if (!S.dangChay) return null;
  const cho = S.pha === 'duyet';
  const sao = cho ? '⏸' : SAO[nhip % SAO.length]!;
  /* 27/10/2026: tông cam ấm kiểu Claude Code (thay tím–xanh) — sao nhấp nháy giữa cam đất và cam nhạt. */
  const mauSao = [THUONG_HIEU.tim, '#e08a63', '#e39a76', THUONG_HIEU.timNhat, '#e39a76', '#e08a63'][nhip % 6]!;
  // Kiểu Claude Code: `✻ Thinking… (10m 42s · ↓ 12.3k tokens · esc to interrupt)`.
  const phan = [giay(Date.now() - (S.batDauLuot || Date.now()))];
  const token = Math.max(S.tokenRa, Math.round(S.kyTuRa / 4));
  if (token > 0) phan.push(`↓ ${soGon(token)} tokens`);
  if (S.buoc?.nay && S.buoc.tran && S.buoc.tran - S.buoc.nay <= 10) phan.push(L(`bước ${S.buoc.nay}/${S.buoc.tran}`, `step ${S.buoc.nay}/${S.buoc.tran}`));
  phan.push(cho ? L('chọn bên dưới', 'choose below') : L('esc để dừng', 'esc to interrupt'));
  return (
    <Box marginTop={1} flexDirection="column">
      <Text>{`${mau(mauSao)(sao)} ${mau(cho ? '#fbbf24' : THUONG_HIEU.tim)(`${cauTrangThai(S)}${cho ? '' : '…'}`)} ${mo(`(${phan.join(' · ')})`)}`}</Text>
      {!cho && <Text>{`  ${mo('⎿')}  ${mo(meoChoDoi(S.batDauLuot || 0))}`}</Text>}
    </Box>
  );
}

/** Mẹo dưới dòng trạng thái (kiểu Claude Code "⎿ Tip: …") — đổi theo lượt, không nhảy giữa lượt. */
const MEO = [
  ['Mẹo: gõ ? để xem phím tắt', 'Tip: press ? for shortcuts'],
  ['Mẹo: @tên-file để đính kèm file vào câu hỏi', 'Tip: @file-name attaches a file to your message'],
  ['Mẹo: !lệnh để tự chạy lệnh shell', 'Tip: !command runs a shell command yourself'],
  ['Mẹo: # ghi chú để CuongMini nhớ quy ước của dự án', 'Tip: # note makes CuongMini remember a project rule'],
  ['Mẹo: shift+tab đổi chế độ hỏi / tự sửa', 'Tip: shift+tab switches ask / auto-edit mode'],
  ['Mẹo: esc esc để quay lui một lượt', 'Tip: esc esc rewinds one turn'],
  ['Mẹo: /model để đổi giữa Pro, Pro 2, Max, Fable Max', 'Tip: /model switches between Pro, Pro 2, Max, Fable Max'],
  ['Mẹo: gõ thêm + Enter để chèn chỉ dẫn vào lượt đang chạy', 'Tip: type + Enter to add guidance to the running turn'],
] as const;
export function meoChoDoi(hat: number): string {
  const m = MEO[Math.abs(Math.floor(hat / 1000)) % MEO.length]!;
  return L(m[0], m[1]);
}

/** 12345 ⇒ "12.3k". */
export function soGon(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, '')}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

/**
 * KẾ HOẠCH kiểu Claude Code — danh sách ☐/☒/◐ gọn ngay DƯỚI dòng trạng thái (không còn hộp
 * nổi bên phải đè lên nội dung). Dài ⇒ giữ cửa sổ quanh việc đang làm. ctrl+t thu/mở.
 */
export function KeHoachGon({ S, rong, toiDa = 8 }: { S: TrangThaiChat; rong: number; toiDa?: number }) {
  return <Box paddingLeft={2}><Text>{dongKeHoachGon(S, rong, toiDa).join('\n')}</Text></Box>;
}

/** Các dòng của kế hoạch gọn — mỗi việc XUỐNG DÒNG hiện ĐỦ chữ (không cắt "…"). */
export function dongKeHoachGon(S: Pick<TrangThaiChat, 'keHoach'>, rong: number, toiDa = 8): string[] {
  if (!S.keHoach.length) return [];
  const n = Math.max(3, toiDa);
  const dang = Math.max(0, S.keHoach.findIndex((v) => v.trangThai !== 'xong'));
  const dau = Math.max(0, Math.min(dang - 1, S.keHoach.length - n));
  const trong = Math.max(10, rong - 9);
  const dong: string[] = [];
  if (dau > 0) dong.push(mo(L(`… ${dau} việc đã xong`, `… ${dau} completed`)));
  for (const v of S.keHoach.slice(dau, dau + n)) {
    const xong = v.trangThai === 'xong';
    const dangLam = v.trangThai === 'dang';
    const ky = xong ? mau('#4ade80')('☒') : dangLam ? mau('#fbbf24')('◐') : mo('☐');
    const manh = bocDong(v.ten, trong);
    manh.forEach((m, i) => {
      const chu = xong ? mo(m) : dangLam ? dam(m) : m;
      dong.push(i === 0 ? `${ky} ${chu}` : `  ${chu}`);
    });
  }
  if (S.keHoach.length > dau + n) dong.push(mo(L(`… +${S.keHoach.length - dau - n} việc`, `… +${S.keHoach.length - dau - n} more`)));
  return dong.map((d, i) => (i === 0 ? `${mo('⎿')}  ${d}` : `   ${d}`));
}

// ─── Bảng kế hoạch ───────────────────────────────────────────────

export function coGiDeHien(S: TrangThaiChat): boolean {
  return S.dangChay || S.keHoach.length > 0 || Object.keys(S.fileDaSua).length > 0;
}

export function BangKeHoach({ S, rong, nhip, toiDaViec = 14 }: { S: TrangThaiChat; rong: number; nhip: number; toiDaViec?: number }) {
  const trong = rong - 4;
  const dong: string[] = [];
  const tieuDe = (t: string) => dam(mau(THUONG_HIEU.timNhat)(t));
  dong.push(tieuDe(L('📋 Kế hoạch', '📋 Plan')));
  if (S.keHoach.length) {
    const xong = S.keHoach.filter((v) => v.trangThai === 'xong').length;
    dong.push(mo(L(`${xong}/${S.keHoach.length} việc xong`, `${xong}/${S.keHoach.length} done`)));
    // Kế hoạch dài: giữ cửa sổ quanh việc đang làm, không phải 14 việc đầu (việc đầu thường đã xong).
    const n = Math.max(3, toiDaViec);
    const dang = Math.max(0, S.keHoach.findIndex((v) => v.trangThai !== 'xong'));
    const dau = Math.max(0, Math.min(dang - 1, S.keHoach.length - n));
    if (dau > 0) dong.push(mo(L(`… ${dau} việc đã qua`, `… ${dau} done above`)));
    dong.push(...veKeHoach(S.keHoach.slice(dau, dau + n), trong));
    if (S.keHoach.length > dau + n) dong.push(mo(L(`… +${S.keHoach.length - dau - n} việc`, `… +${S.keHoach.length - dau - n} more`)));
  } else {
    dong.push(mo(catVua(L('Chưa có — việc lớn CuongMini sẽ tự lập.', 'None yet — CuongMini plans big tasks itself.'), trong)));
  }
  if (S.dangChay) {
    dong.push('', tieuDe(L('Đang làm', 'Now')));
    const sao = S.pha === 'duyet' ? '⏸' : SAO[nhip % SAO.length]!;
    dong.push(`${mau(THUONG_HIEU.tim)(sao)} ${catVua(cauTrangThai(S), trong - 2)}`);
    const t = S.toolChay[S.toolChay.length - 1];
    if (t?.lenh) dong.push(mo(`  $ ${catVua(t.lenh, trong - 4)}`));
    const p = [giay(Date.now() - (S.batDauLuot || Date.now()))];
    if (S.buoc?.nay) p.push(L(`bước ${S.buoc.nay}${S.buoc.tran ? `/${S.buoc.tran}` : ''}`, `step ${S.buoc.nay}${S.buoc.tran ? `/${S.buoc.tran}` : ''}`));
    dong.push(mo(`  ${p.join(' · ')}`));
  }
  const file = Object.entries(S.fileDaSua);
  if (file.length) {
    dong.push('', tieuDe(L(`File đã sửa (${file.length})`, `Files changed (${file.length})`)));
    for (const [f, d] of file.slice(-8)) {
      const dem2 = `${mau('#4ade80')(`+${d.them}`)} ${mau('#f87171')(`−${d.bo}`)}`;
      const ten = catVua(f.split('/').slice(-2).join('/'), Math.max(6, trong - doRong(dem2) - 1));
      dong.push(`${ten} ${dem2}`);
    }
    if (file.length > 8) dong.push(mo(`… +${file.length - 8} file`));
  }
  return (
    <Box borderStyle={kieuVien()} borderColor={mauInk(XAM)} flexDirection="column" paddingX={1} width={rong} flexShrink={0}>
      <Text>{dong.join('\n')}</Text>
    </Box>
  );
}

// ─── Ô nhập ──────────────────────────────────────────────────────

export type CheDoNhap = 'thuong' | 'shell' | 'ghiNho';

/** Dòng đầu bắt đầu bằng `!` ⇒ chạy shell; `# ` ⇒ ghi nhớ quy ước (đổi màu ô nhập như Claude Code). */
export const cheDoNhapCua = (text: string): CheDoNhap => (text.startsWith('!') ? 'shell' : /^#\s/.test(text) ? 'ghiNho' : 'thuong');

export function ONhapView({ o, rong, cheDo, dangChay, goiYMo, soHangCho, xuongDong, choChiDan, goiYTiep }: { o: ONhap; rong: number; cheDo: string; dangChay: boolean; goiYMo: boolean; soHangCho: number; xuongDong?: string; /** Đợt 6: lượt vừa dừng chờ chỉ dẫn ("Không, và bảo CuongMini làm khác đi"). */ choChiDan?: boolean; /** Đợt 8A: gợi ý bước tiếp — chữ mờ khi ô trống, Tab nhận. */ goiYTiep?: string | null }) {
  const cd = moTaCheDo(cheDo);
  const trong = rong - 6;
  const kieu = cheDoNhapCua(o.text);
  const mauDau = kieu === 'shell' ? '#fbbf24' : kieu === 'ghiNho' ? '#22d3ee' : THUONG_HIEU.timNhat;
  const kyDau = kieu === 'shell' ? '!' : kieu === 'ghiNho' ? '#' : '❯';
  const dongs = o.text.split('\n');
  let viTri = o.contro;
  const ra = dongs.map((d, i) => {
    const dau = i === 0 ? mau(mauDau)(dam(kyDau)) : ' ';
    let chu = d;
    if (viTri >= 0 && viTri <= d.length) {
      const ky = [...d.slice(viTri)][0] ?? ' ';
      chu = `${d.slice(0, viTri)}${dao(ky)}${d.slice(viTri + ky.length)}`;
      viTri = -1;
    } else if (viTri >= 0) viTri -= d.length + 1;
    // Bỏ ký tự `!`/`#` đầu dòng khỏi phần hiện (đã thành ký hiệu đầu ô).
    if (i === 0 && kieu !== 'thuong' && chu.startsWith(o.text[0]!)) chu = chu.slice(1).replace(/^ /, '');
    return `${dau} ${chu}`;
  });
  const goi = dangChay
    /* QA 5c: từ đợt 4 Enter khi đang chạy CHÈN tin vào lượt (↳) — chữ cũ "để xếp hàng" nói sai việc sẽ xảy ra. */
    ? L(`CuongMini đang làm… gõ thêm + Enter để chèn vào lượt${soHangCho ? ` (${soHangCho} tin đang chờ)` : ''}`, `CuongMini is working… type + Enter to add to this turn${soHangCho ? ` (${soHangCho} queued)` : ''}`)
    : choChiDan
      ? L('CuongMini nên làm gì khác? Gõ chỉ dẫn rồi Enter…', 'What should CuongMini do instead? Type and press Enter…')
      /* 27/10/2026 chủ app: bỏ dòng chú thích lệnh (/ · @ · ! · #) — ô nhập gọn như Claude Code; xem phím tắt bằng `?`. */
      : L('Hỏi hoặc giao việc…', 'Ask or give a task…');
  /* Đợt 8A: có gợi ý bước tiếp ⇒ chữ MỜ thay chỗ câu nhắc thường, kèm "⇥ tab" (Tab điền vào ô, Enter gửi). */
  const coGoiY = !o.text && !dangChay && !choChiDan && Boolean(goiYTiep);
  const duoiTab = L('  ⇥ tab', '  ⇥ tab');
  const hien = o.text ? ra.join('\n')
    : coGoiY ? `${mau(THUONG_HIEU.timNhat)('❯')} ${dao(' ')}${mo(catVua(goiYTiep!, trong - 2 - duoiTab.length))}${mo(duoiTab)}`
      : `${mau(THUONG_HIEU.timNhat)('❯')} ${dao(' ')}${mo(catVua(goi, trong - 2))}`;
  const nhanKieu = kieu === 'shell' ? mau('#fbbf24')(L(' chế độ shell — Enter chạy ngay ở thư mục dự án, không qua AI', ' shell mode — Enter runs it in the project folder, no AI'))
    : kieu === 'ghiNho' ? mau('#22d3ee')(L(' ghi nhớ — Enter lưu thành quy ước dự án (AGENTS.md)', ' memory — Enter saves a project rule (AGENTS.md)')) : '';
  const vienMau = kieu === 'shell' ? '#fbbf24' : kieu === 'ghiNho' ? '#22d3ee' : goiYMo ? THUONG_HIEU.tim : cd.id === 'boQuaHet' ? '#f87171' : XAM;
  return (
    <Box flexDirection="column" width={rong}>
      <Box borderStyle={kieuVien()} borderColor={mauInk(vienMau)} paddingX={1} width={rong}>
        <Text wrap="wrap">{hien}</Text>
      </Box>
      {nhanKieu ? <Text>{mo(nhanKieu)}</Text> : xuongDong && o.text && !dangChay ? <Text>{mo(`  ${catVua(xuongDong, trong)}`)}</Text> : null}
    </Box>
  );
}

/** Tin đang chờ gửi (gõ lúc agent đang làm) — Esc huỷ, tự gửi khi lượt xong. */
export function HangCho({ ds, rong }: { ds: string[]; rong: number }) {
  if (!ds.length) return null;
  const dong = ds.slice(0, 3).map((t) => `${mau('#fbbf24')('⏳')} ${mo(L('sẽ gửi sau:', 'queued:'))} ${catVua(t.replace(/\s+/g, ' '), rong - 18)}`);
  if (ds.length > 3) dong.push(mo(L(`   … +${ds.length - 3} tin nữa`, `   … +${ds.length - 3} more`)));
  dong.push(mo(L('   esc: huỷ hàng chờ (đưa chữ về ô nhập)', '   esc: clear the queue (text goes back to the input)')));
  return <Box marginTop={1}><Text>{dong.join('\n')}</Text></Box>;
}

/** Lệnh `!` đang chạy: dòng lệnh + vài dòng đầu ra cuối. */
export function ShellDangChay({ lenh, ra, batDau, rong, nhip }: { lenh: string; ra: string; batDau: number; rong: number; nhip: number }) {
  const sao = mau('#fbbf24')(SAO[nhip % SAO.length]!);
  const dong = [`${sao} ${mau('#fbbf24')(dam('!'))} ${dam(catVua(lenh, rong - 6))}`];
  const r = veDauRa(ra, rong, false);
  r.forEach((d, i) => dong.push(i === 0 ? `  ${mo('⎿')}  ${d}` : `     ${d}`));
  dong.push(mo(`  ${giay(Date.now() - batDau)} · ${L('esc để dừng', 'esc to interrupt')}`));
  return <Box marginTop={1}><Text>{dong.join('\n')}</Text></Box>;
}

/**
 * Màn XEM LẠI BẢNG GHI (ctrl+r) / chọn đầu ra để mở-thu (ctrl+o): cuộn được,
 * khối đang chọn có vạch tím bên trái.
 */
export function XemBanGhi({ dong, dau, cao, rong, tieuDe, khoiChon, goiY }: {
  dong: string[]; dau: number; cao: number; rong: number; tieuDe: string; khoiChon: { dau: number; cuoi: number } | null; goiY: string;
}) {
  const hien = dong.slice(dau, dau + cao).map((d, i) => {
    const k = dau + i;
    const trongKhoi = khoiChon && k >= khoiChon.dau && k <= khoiChon.cuoi;
    return `${trongKhoi ? mau(THUONG_HIEU.tim)('▎') : ' '}${catAnsiDong(d, rong - 2)}`;
  });
  while (hien.length < cao) hien.push('');
  const phanTram = dong.length <= cao ? 100 : Math.round(((dau + cao) / dong.length) * 100);
  return (
    <Box flexDirection="column" width={rong}>
      <Text>{`${dam(mau(THUONG_HIEU.timNhat)(tieuDe))} ${mo(L(`· ${dong.length} dòng · ${Math.min(100, phanTram)}%`, `· ${dong.length} lines · ${Math.min(100, phanTram)}%`))}`}</Text>
      <Text>{hien.join('\n')}</Text>
      <Text>{mo(goiY)}</Text>
    </Box>
  );
}

/** Cắt một dòng ĐÃ TÔ MÀU cho vừa bề ngang (màn xem lại không được tự xuống dòng — lệch cuộn). */
function catAnsiDong(d: string, n: number): string {
  if (doRong(d) <= n) return d;
  let ra = '';
  let w = 0;
  const re = /(\x1b\[[0-9;:]*m)|([\s\S])/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(d))) {
    if (m[1]) { ra += m[1]; continue; }
    const cw = doRong(m[2]!);
    if (w + cw > n - 1) break;
    ra += m[2];
    w += cw;
  }
  return `${ra}\x1b[0m…`;
}

// ─── Gợi ý `/` và `@` ────────────────────────────────────────────

export interface MucGoiY { nhan: string; mo?: string; chen: string; chayLuon?: boolean; thuMuc?: boolean }

export function GoiYView({ ds, chon, rong, kieu }: { ds: MucGoiY[]; chon: number; rong: number; kieu: '/' | '@' }) {
  if (!ds.length) return <Text>{mo(`  ${kieu === '@' ? L('Không có file nào khớp', 'No matching files') : L('Không có lệnh nào khớp', 'No matching commands')}`)}</Text>;
  const cua = 8;
  const dau = Math.max(0, Math.min(chon - Math.floor(cua / 2), ds.length - cua));
  const hien = ds.slice(dau, dau + cua);
  const beNhan = Math.min(34, Math.max(...hien.map((m) => doRong(m.nhan))) + 2);
  const dong = hien.map((m, i) => {
    const dang = dau + i === chon;
    const nhan = catVua(m.nhan, beNhan);
    const trai = dang ? mau(THUONG_HIEU.timNhat)(dam(`› ${nhan}`)) : `  ${kieu === '@' && m.thuMuc ? mau('#f0c9a8')(nhan) : nhan}`;
    const moTa = m.mo ? mo(catVua(m.mo, Math.max(0, rong - beNhan - 6))) : '';
    return `${trai}${' '.repeat(Math.max(1, beNhan + 2 - doRong(nhan)))}${moTa}`;
  });
  const goiPhim = kieu === '/' ? L('↑↓ chọn · Tab chèn · Enter chạy', '↑↓ select · Tab insert · Enter run') : L('↑↓ chọn · Tab chèn · Enter chọn', '↑↓ select · Tab insert · Enter pick');
  if (ds.length > cua) dong.push(mo(`  ${chon + 1}/${ds.length} · ${goiPhim}`));
  else dong.push(mo(`  ${goiPhim} · ${L('Esc đóng', 'Esc close')}`));
  return <Box paddingLeft={1}><Text>{dong.join('\n')}</Text></Box>;
}

// ─── Chân trang ──────────────────────────────────────────────────

export function ChanTrang({ S, rong, model, muc, nhac, ctw, goiYPhim }: {
  S: TrangThaiChat; rong: number; model: string; muc: string; nhac: string;
  /** Đợt 5: dòng CT Work (dự án · sprint · còn N ngày · ▶ thẻ) — chữ trơn từ `veDongCtw`. */
  ctw?: string;
  /** Ô nhập trống, không chạy ⇒ hiện "? phím tắt" như Claude Code. */
  goiYPhim?: boolean;
}) {
  const cd = moTaCheDo(S.ws?.cheDoQuyen);
  const trai = `${mau(cd.mau)(`${cd.icon} ${cd.ten}`)} ${mo('(shift+tab)')}${S.ws?.choTrinhDuyet ? ` ${mau('#e08a63')('🌐')}` : ''}${goiYPhim ? mo(L(' · ? phím tắt', ' · ? for shortcuts')) : ''}`;
  const giua = `${mau(THUONG_HIEU.xanhNhat)(model)}${mo(` · ${muc}`)}`;
  /* QA 5c: phần phải KHÔNG còn bỏ cả cụm khi chật — trước đây thêm "context 83%" là cả "thư mục ⎇ nhánh · context · ~$"
     biến mất ở 120 cột, đúng lúc ngữ cảnh/tiền đáng xem nhất. Nay bỏ dần theo độ ưu tiên: thư mục ⎇ nhánh → hạn mức →
     tiền → ngữ cảnh (giữ đúng thứ tự hiển thị cũ). */
  const phaiMuc: Array<{ chu: string; uuTien: number }> = [];
  if (S.ws?.name) phaiMuc.push({ chu: `${S.ws.name}${S.ws.branch ? ` ⎇ ${S.ws.branch}` : ''}`, uuTien: 1 });
  if (S.nguCanh) phaiMuc.push({ chu: L(`ngữ cảnh ${S.nguCanh.phanTram}%`, `context ${S.nguCanh.phanTram}%`), uuTien: 4 });
  // Tiền = tổng máy chủ báo cho mọi lượt + phần ĐANG chạy của lượt hiện tại (cộng theo vòng).
  const tien = S.tienPhien + (S.dangChay ? S.tienLuot : 0);
  if (tien > 0) phaiMuc.push({ chu: `~$${tien < 0.1 ? tien.toFixed(3) : tien.toFixed(2)}`, uuTien: 3 });
  /* Hạn mức 5 GIỜ của AI Code (token, cổng CuongMini). Cổng Claude chính hãng (`cl-*`) tính trần riêng
     theo tiền ⇒ con số này không áp dụng, đừng hiện "100%" gây hoảng. */
  const chinhHang = /^cl-/.test(String((S.ws as { model?: string } | null)?.model ?? ''));
  if (!chinhHang && S.hanMucPhanTram !== null && S.hanMucPhanTram >= 50) phaiMuc.push({ chu: L(`hạn mức 5 giờ ${S.hanMucPhanTram}%`, `5h quota ${S.hanMucPhanTram}%`), uuTien: 2 });
  const vua = (ds: typeof phaiMuc) => doRong(trai) + doRong(giua) + doRong(ds.map((x) => x.chu).join(' · ')) + 8 <= rong;
  let giu = phaiMuc;
  while (giu.length && !vua(giu)) { const bo = Math.min(...giu.map((x) => x.uuTien)); giu = giu.filter((x) => x.uuTien !== bo); }
  const phai = mo(giu.map((x) => x.chu).join(' · '));
  const dongCtw = ctw ? <Text wrap="truncate">{veDongCtwMau(ctw, rong - 2)}</Text> : null;
  if (nhac) return <Box paddingLeft={2} flexDirection="column">{dongCtw}<Text>{mau('#fbbf24')(nhac)}</Text></Box>;
  const coPhai = giu.length > 0;
  const khoang = coPhai ? Math.max(2, rong - 7 - doRong(trai) - doRong(giua) - doRong(phai)) : 3;
  return (
    <Box paddingLeft={2} flexDirection="column">
      {dongCtw}
      <Text wrap="truncate">{`${trai}   ${giua}${coPhai ? ' '.repeat(khoang) + phai : ''}`}</Text>
    </Box>
  );
}

/** Tô dòng CT Work: `⬡ LF` tím, sprint xanh, `▶ LF-18` vàng, phần còn lại mờ. */
export function veDongCtwMau(chu: string, rong: number): string {
  const c = catVua(chu, Math.max(10, rong));
  return c.split(' · ').map((p, i) => (i === 0 ? mau(THUONG_HIEU.timNhat)(p)
    : p.startsWith('▶') ? mau('#fbbf24')(p)
      : /^(Sprint|Đợt|Iteration)|Sprint/i.test(p) ? mau(THUONG_HIEU.xanhNhat)(p) : mo(p))).join(mo(' · '));
}

// ─── Thẻ duyệt ───────────────────────────────────────────────────

export interface LuaChonDuyet { q: 'choPhep' | 'choPhepCaFile' | 'choPhepTienTo' | 'tuChoi'; nhan: string }

export function luaChonDuyet(d: ChoDuyet): LuaChonDuyet[] {
  // Kiểu Claude Code (đợt 5): "1. Yes · 2. Yes, and don't ask again for … · 3. No, and tell CuongMini what to do differently (esc)".
  const tuChoi: LuaChonDuyet = { q: 'tuChoi', nhan: L('Không, và bảo CuongMini làm khác đi (esc)', 'No, and tell CuongMini what to do differently (esc)') };
  switch (d.loai) {
    case 'xinPhep': return [{ q: 'choPhep', nhan: L('Có', 'Yes') }, { q: 'choPhepCaFile', nhan: L('Có, và không hỏi lại khi sửa file này trong việc này', "Yes, and don't ask again for edits to this file during this task") }, tuChoi];
    case 'xinPhepLenh': {
      const ds: LuaChonDuyet[] = [{ q: 'choPhep', nhan: (d.lenh ?? '').startsWith('📨') ? L('Có, gửi', 'Yes, send it') : L('Có', 'Yes') }];
      const laTin = (d.lenh ?? '').startsWith('📨');
      if (d.phanLoai?.choNho !== false) ds.push({ q: 'choPhepCaFile', nhan: laTin ? L('Có, và không hỏi lại khi nhắn phiên này', "Yes, and don't ask again for messages to this session") : L('Có, và không hỏi lại lệnh này ở dự án này', "Yes, and don't ask again for this command in this project") });
      // Đợt 3: theo TIỀN TỐ — lõi chặn lệnh nối (`;` `&&` `|` `$(…)`) khỏi khớp.
      if (d.phanLoai?.choNho !== false && d.tienTo && d.tienTo !== (d.lenh ?? '').trim()) ds.push({ q: 'choPhepTienTo', nhan: L(`Có, và không hỏi lại các lệnh \`${d.tienTo} …\` ở dự án này`, `Yes, and don't ask again for \`${d.tienTo} …\` commands in this project`) });
      ds.push(tuChoi);
      return ds;
    }
    case 'xinPhepGit': {
      /* 28/10/2026: xin quyền thư mục ngoài dự án — mặc định CHỈ ĐỌC; "đọc + sửa" là nút riêng (không có phím tắt "luôn"). */
      if (d.viec === 'thuMuc' || d.viec === 'thuMucDoc') {
        return [
          { q: 'choPhep', nhan: L('Cho phép đọc', 'Allow read') },
          ...(d.viec === 'thuMuc' ? [{ q: 'choPhepCaFile' as const, nhan: L('Cho phép đọc + sửa (mỗi lần sửa vẫn hỏi)', 'Allow read + edit (each edit still asks)') }] : []),
          { q: 'tuChoi', nhan: L('Không (esc)', 'No (esc)') },
        ];
      }
      const nhan = d.viec === 'commit' ? 'Commit' : d.viec === 'pr' ? L('Đẩy và mở PR', 'Push and open PR') : d.viec === 'day' ? L('Đẩy lên GitHub', 'Push to GitHub') : d.viec === 'cai' ? L('Cài', 'Install') : d.viec === 'gop' ? L('Gộp vào dự án', 'Merge into the project') : L('Đồng ý', 'Yes');
      return [{ q: 'choPhep', nhan }, tuChoi];
    }
    case 'xinPhepNote': return [{ q: 'choPhep', nhan: L('Có, ghi', 'Yes, write it') }, tuChoi];
    case 'xinPhepMcp': return [{ q: 'choPhep', nhan: d.xemTruoc ? L('Có, ghi lên CT Work', 'Yes, write to CT Work') : L('Có', 'Yes') }, tuChoi];
    default: return [{ q: 'choPhep', nhan: L('Có', 'Yes') }, tuChoi];
  }
}

const MAU_MUC = { thuong: THUONG_HIEU.xanh, cankiem: '#fbbf24', nguyhiem: '#f87171' };

export function TheDuyet({ d, chon, rong, toiDaDong, conLai }: { d: ChoDuyet; chon: number; rong: number; toiDaDong: number; conLai: number }) {
  const muc = d.loai === 'xinPhepLenh' ? d.phanLoai?.muc ?? 'thuong' : d.loai === 'xinPhepGit' && (d.viec === 'pr' || d.viec === 'day') ? 'nguyhiem' : d.loai === 'xinPhep' ? 'thuong' : 'cankiem';
  const trong = rong - 4;
  const dong: string[] = [];
  let tieuDe = '';
  switch (d.loai) {
    case 'xinPhep':
      tieuDe = `${d.taoMoi ? L('Tạo file', 'Create file') : L('Sửa file', 'Edit file')} ${mau('#e9c08a')(d.duongDan ?? '')}`;
      dong.push(...veDiff(d.diff, { rong: trong, duong: d.duongDan, toiDa: Math.max(4, toiDaDong) }));
      break;
    case 'xinPhepLenh': {
      // Nhắn phiên khác (`nhan_phien`) đi chung cơ chế thẻ lệnh — lõi gửi `📨 → "tên" (mã, nơi): nội dung`. Đó KHÔNG phải
      // lệnh shell: đừng vẽ "Bash command $ 📨 …" (QA 18/10).
      const tin = /^📨 → (.*?): ([\s\S]*)$/u.exec(d.lenh ?? '');
      if (tin) {
        tieuDe = `${L('Nhắn phiên khác', 'Message another session')} ${mau('#e9c08a')(tin[1]!)}`;
        dong.push(...tin[2]!.split('\n').slice(0, 12).flatMap((l) => bocVan(l, trong - 2)).map((l) => `${mo('│')} ${l}`));
      } else {
        tieuDe = L('Chạy lệnh', 'Bash command');
        /* BỌC, không cắt: người dùng phải thấy TRỌN lệnh trước khi bấm Yes (đuôi `&& rm -rf …` mà bị "…" là duyệt mù). */
        const dongLenh = (d.lenh ?? '').split('\n').flatMap((l) => bocDong(l, trong - 2));
        dong.push(...dongLenh.slice(0, 16).map((l, i) => `${i === 0 ? mau('#fbbf24')('$') : ' '} ${dam(l)}`));
        if (dongLenh.length > 16) dong.push(mo(L(`  … +${dongLenh.length - 16} dòng nữa`, `  … +${dongLenh.length - 16} more lines`)));
      }
      if (d.phanLoai?.lyDo?.length) {
        dong.push('');
        for (const l of d.phanLoai.lyDo.slice(0, 5)) dong.push(...bocVan(dichLyDo(l), trong - 2).map((m, i) => `${i ? ' ' : mau(MAU_MUC[muc])('▲')} ${m}`));
      }
      break;
    }
    case 'xinPhepMcp':
      if (d.xemTruoc) {
        // Đợt 5: GHI lên CT Work — nói rõ ghi vào THẺ NÀO, VIỆC GÌ, NỘI DUNG GÌ (không đổ JSON tham số).
        tieuDe = `${mau('#e39a76')('CT Work')} ${mo('·')} ${d.xemTruoc.viec}${d.xemTruoc.the ? ` ${mo('→')} ${mau('#e9c08a')(d.xemTruoc.the)}` : ''}`;
        const than = d.xemTruoc.noiDung.trim();
        if (than) dong.push(...than.split('\n').flatMap((l) => bocVan(l, trong - 2)).slice(0, Math.max(4, toiDaDong)).map((l) => `${mo('│')} ${l}`));
        dong.push(mo(L(`  tool: ${d.tool} · ghi CT Work luôn hỏi (kể cả "Bỏ qua hết") — tắt hỏi: /ctwork tu-ghi on`, `  tool: ${d.tool} · CT Work writes always ask (even in Bypass) — stop asking: /ctwork auto-write on`)));
      } else {
        tieuDe = `${L('Gọi công cụ', 'Call tool')} ${mau('#e9c08a')(`${d.server} · ${d.tool}`)}`;
        dong.push(...String(d.args ?? '').slice(0, 2000).split('\n').slice(0, Math.max(3, toiDaDong)).map((l) => mo(catVua(l, trong))));
      }
      break;
    case 'xinPhepGit':
      tieuDe = tenViecGit(d.viec);
      dong.push(...String(d.chiTiet ?? '').split('\n').slice(0, Math.max(3, toiDaDong)).map((l) => catVua(l, trong)));
      break;
    case 'xinPhepNote':
      tieuDe = d.viec === 'tao' ? L('Tạo ghi chú', 'Create note') : L('Ghi vào ghi chú', 'Write to note');
      dong.push(...String(d.chiTiet ?? '').slice(0, 4000).split('\n').slice(0, Math.max(3, toiDaDong)).map((l) => catVua(l, trong)));
      break;
  }
  if (d.phuId) tieuDe = `${mau('#e39a76')(`🤖 ${L('Agent phụ', 'Subagent')}`)} ${mo('·')} ${tieuDe}`;
  const lc = luaChonDuyet(d);
  const chonDong = lc.map((l, i) => (i === chon
    ? mau(MAU_MUC[muc])(dam(`❯ ${i + 1}. ${l.nhan}`))
    : `  ${mo(`${i + 1}.`)} ${l.nhan}`));
  const nhanMuc = muc === 'nguyhiem' ? mau('#f87171')(L(' · NGUY HIỂM', ' · DANGEROUS')) : muc === 'cankiem' ? mau('#fbbf24')(L(' · cần xem kỹ', ' · review carefully')) : '';
  return (
    <Box borderStyle={kieuVien()} borderColor={mauInk(MAU_MUC[muc])} flexDirection="column" paddingX={1} width={rong} marginTop={1}>
      <Text>{`${dam(tieuDe)}${nhanMuc}${conLai > 1 ? mo(L(`  (còn ${conLai - 1} yêu cầu nữa)`, `  (${conLai - 1} more pending)`)) : ''}`}</Text>
      {dong.length ? <Box marginTop={1}><Text>{dong.join('\n')}</Text></Box> : null}
      <Box marginTop={1} flexDirection="column">
        <Text>{dam(L('Bạn muốn tiếp tục?', 'Do you want to proceed?'))}</Text>
        <Text>{chonDong.join('\n')}</Text>
      </Box>
      <Text>{mo(L('↑↓ chọn · Enter xác nhận · phím số chọn nhanh · Esc từ chối', '↑↓ select · Enter confirm · number keys · Esc to deny'))}</Text>
    </Box>
  );
}

// ─── Menu chọn (model, mức, việc cũ, duyệt kế hoạch, xác nhận) ───

export interface MucMenu { nhan: string; mo?: string; nhom?: string; tat?: boolean; dangChon?: boolean; giaTri: string;
  /** 18/10/2026: hiện TỐI HƠN nhưng vẫn chọn được (model cần khoá chưa có vé). */
  toi?: boolean; /** Đợt 5: số hiện bên trái ("0" = Thoát). Gõ số đó là chọn. */ so?: string }

/** Số hiện của mục thứ `k` (đợt 5: mục tự khai `so` thắng; mặc định 1–9). */
export const soCuaMuc = (m: MucMenu, k: number): string => m.so ?? (k < 9 ? String(k + 1) : '');

export function MenuView({ tieuDe, moTa, than, ds, chon, loc, coLoc, rong, mauVien, caoToiDa }: {
  tieuDe: string; moTa?: string; ds: MucMenu[]; chon: number; loc: string; coLoc: boolean; rong: number; mauVien?: string;
  /** Đợt 4: khối nội dung ĐÃ TÔ MÀU (danh sách server, quyền…) hiện trên các lựa chọn — kiểu `/mcp` của Claude Code. */
  than?: string;
  /**
   * Đợt 6 (lỗi đợt 5): số dòng TỐI ĐA thẻ được chiếm (cả viền). Thẻ `/ctwork` ở 60×20 cao hơn màn hình 1 dòng ⇒ mất viền
   * dưới + chân trang. Nay: mô tả co về ít dòng hơn, rồi cửa sổ danh sách co lại (vẫn ↑↓ cuộn được hết).
   */
  caoToiDa?: number;
}) {
  const moTaDong = moTa ? bocVan(moTa, rong - 4) : [];
  const thanDong = than ? than.split('\n').length : 0;
  /* viền 2 + lề trên 1 + tiêu đề 1 + lề danh sách 1 + chân 1 (+ ô lọc 1) (+ lề thân 1 + thân). */
  const coDinh = 6 + (coLoc ? 1 : 0) + (than ? 1 + thanDong : 0);
  let moTaHien = moTaDong;
  let cua = 10;
  if (caoToiDa) {
    if (coDinh + moTaHien.length + Math.min(cua, ds.length) > caoToiDa && moTaHien.length > 1) moTaHien = [catVua(moTaHien.join(' '), rong - 4)];
    cua = Math.max(3, Math.min(10, caoToiDa - coDinh - moTaHien.length));
  }
  const dau = Math.max(0, Math.min(chon - Math.floor(cua / 2), ds.length - cua));
  const hien = ds.slice(dau, dau + cua);
  const dong: string[] = [];
  let nhomCu = dau > 0 ? ds[dau - 1]?.nhom : undefined;
  // Cột mô tả thẳng hàng — dễ đọc hơn khi so các model/mức với nhau.
  const beTen = Math.min(36, Math.max(0, ...hien.map((m) => doRong(`${m.dangChon ? '✓ ' : ''}${m.nhan}`))));
  hien.forEach((m, i) => {
    if (m.nhom && m.nhom !== nhomCu) { if (dong.length) dong.push(''); dong.push(mo(m.nhom)); nhomCu = m.nhom; }
    const k = dau + i;
    const dang = k === chon;
    const so = m.so !== undefined ? `${m.so}.` : k < 9 ? `${k + 1}.` : '  ';
    const nhan = `${m.dangChon ? '✓ ' : ''}${m.nhan}`;
    const trai = m.tat ? mo(`  ${so} ${nhan}`) : dang ? mau(THUONG_HIEU.timNhat)(dam(`❯ ${so} ${nhan}`)) : m.toi ? mo(`  ${so} ${nhan}`) : `  ${mo(so)} ${nhan}`;
    const dem2 = ' '.repeat(Math.max(0, beTen - doRong(nhan)));
    dong.push(`${trai}${m.mo ? `${dem2}  ${mo(catVua(m.mo, Math.max(0, rong - Math.max(beTen, doRong(nhan)) - 12)))}` : ''}`);
  });
  if (!ds.length) dong.push(mo(L('  Không có gì khớp.', '  Nothing matches.')));
  return (
    <Box borderStyle={kieuVien()} borderColor={mauInk(mauVien ?? THUONG_HIEU.tim)} flexDirection="column" paddingX={1} width={rong} marginTop={1}>
      <Text>{dam(caoToiDa ? catVua(tieuDe, rong - 4) : tieuDe)}</Text>
      {moTaHien.length ? <Text>{mo(moTaHien.join('\n'))}</Text> : null}
      {than ? <Box marginTop={1}><Text>{than}</Text></Box> : null}
      {coLoc ? <Text>{`${mau(THUONG_HIEU.timNhat)('⌕')} ${loc}${dao(' ')}${loc ? '' : mo(L(' gõ để lọc…', ' type to filter…'))}`}</Text> : null}
      <Box marginTop={1}><Text>{dong.join('\n')}</Text></Box>
      {/* Đợt 6: chân thẻ một dòng (bản cũ gãy thành 2 dòng ở 60 cột ⇒ thẻ cao hơn màn hình). */}
      <Text>{mo(catVua(`${ds.length > cua ? `${chon + 1}/${ds.length} · ` : ''}${L('↑↓ chọn · Enter xác nhận · gõ số chọn nhanh · Esc huỷ', '↑↓ select · Enter confirm · number to pick · Esc cancel')}`, rong - 4))}</Text>
    </Box>
  );
}

/** Ô nhập ẩn ký tự (mật khẩu) hoặc hiện (tên đăng nhập). */
export function ONhapNho({ nhan, giaTri, an, dangNhap }: { nhan: string; giaTri: string; an?: boolean; dangNhap?: boolean }) {
  const hien = an ? '•'.repeat([...giaTri].length) : giaTri;
  return <Text>{`${mo(nhan.padEnd(14))}${dangNhap ? mau(THUONG_HIEU.timNhat)('❯ ') : '  '}${hien}${dangNhap ? dao(' ') : ''}`}</Text>;
}

// ─── Đợt 3: hỏi lựa chọn · chờ/hẹn ─────────────────────────────

/** Thẻ HỎI của agent (`hoi_nguoi_dung`): một câu tại một lúc, ↑↓/số chọn, space đánh dấu (chọn nhiều), Enter xác nhận. */
export function TheHoi({ cau, so, tong, chon, daDanh, rong, nhapKhac }: {
  cau: { cauHoi: string; tieuDe?: string; luaChon: Array<{ nhan: string; moTa?: string }>; nhieu?: boolean };
  so: number; tong: number; chon: number; daDanh: string[]; rong: number; nhapKhac: boolean;
}) {
  const ds = [...cau.luaChon, { nhan: L('Khác — tự gõ câu trả lời', 'Other — type your own answer'), moTa: undefined as string | undefined }];
  const dong = ds.map((l, i) => {
    const dau = cau.nhieu && i < cau.luaChon.length ? (daDanh.includes(l.nhan) ? '☒ ' : '☐ ') : '';
    const chu = `${i + 1}. ${dau}${l.nhan}`;
    const moTa = l.moTa ? mo(`  — ${catVua(l.moTa, Math.max(10, rong - doRong(chu) - 12))}`) : '';
    return i === chon ? `${mau(THUONG_HIEU.timNhat)(dam(`❯ ${chu}`))}${moTa}` : `  ${chu}${moTa}`;
  });
  return (
    <Box borderStyle={kieuVien()} borderColor={mauInk(THUONG_HIEU.tim)} flexDirection="column" paddingX={1} width={rong} marginTop={1}>
      <Text>{`${mau(THUONG_HIEU.timNhat)('?')} ${dam(cau.cauHoi)}${tong > 1 ? mo(` (${so}/${tong})`) : ''}${cau.tieuDe ? mo(`  [${cau.tieuDe}]`) : ''}`}</Text>
      <Box marginTop={1}><Text>{dong.join('\n')}</Text></Box>
      <Text>{mo(nhapKhac
        ? L('Gõ câu trả lời vào ô nhập rồi Enter · Esc quay lại', 'Type your answer in the input and press Enter · Esc back')
        : cau.nhieu
          ? L('↑↓ chọn · space đánh dấu · Enter xác nhận · Esc bỏ qua', '↑↓ move · space toggle · Enter confirm · Esc skip')
          : L('↑↓ chọn · Enter xác nhận · phím số chọn nhanh · Esc bỏ qua', '↑↓ select · Enter confirm · number keys · Esc skip'))}</Text>
    </Box>
  );
}

/** Dòng CHỜ / HẸN dưới dòng trạng thái. */
export function DongHenCho({ S }: { S: TrangThaiChat }) {
  const { cho, hen } = S.henCho;
  if (!cho.length && !hen.length) return null;
  const gioP = (t: number) => { const d = new Date(t); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const dong = [
    ...cho.map((c) => `${mau('#fbbf24')('⏳')} ${L('Đang chờ', 'Waiting for')} ${dichMoTaCho(c.moTa)} ${mo(`· ${L('còn', 'left')} ${Math.max(0, Math.round((c.hetLuc - Date.now()) / 1000))}s · ${L('esc bỏ chờ', 'esc to stop waiting')}`)}`),
    ...hen.map((h) => `${mau(THUONG_HIEU.xanhNhat)('⏰')} ${L('Hẹn quay lại lúc', 'Wakes up at')} ${gioP(h.luc)}${h.lap ? mo(L(` · lặp mỗi ${h.phut}′ (${h.conLai}×)`, ` · every ${h.phut}′ (${h.conLai}×)`)) : ''} ${mo('—')} ${h.lyDo.slice(0, 120)} ${mo(`· /hen ${L('huy', 'cancel')} ${h.id}`)}`),
  ];
  return <Box paddingLeft={2}><Text>{dong.join('\n')}</Text></Box>;
}
