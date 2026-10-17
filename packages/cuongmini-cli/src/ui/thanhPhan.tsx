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
import type { ChoDuyet, TrangThaiChat } from '../kho';
import { THUONG_HIEU, catVua, dam, dao, doRong, mau, mauInk, mo } from '../mau';
import { duoiMarkdown } from '../markdown';
import { cauTrangThai, giay, SAO, TOOL_LENH } from '../trangThai';
import { dongTieuDeTool, veDauRa, veKeHoach } from '../veBang';
import type { ONhap } from './soanThao';

const XAM = THUONG_HIEU.vien;

// ─── Chữ đang chảy + tool đang chạy ──────────────────────────────

export function VungSong({ S, rong, toiDaDong, nhip }: { S: TrangThaiChat; rong: number; toiDaDong: number; nhip: number }) {
  const phan: string[] = [];
  if (S.chuDangViet.trim()) {
    const { dong, anBot } = duoiMarkdown(S.chuDangViet, rong - 2, Math.max(3, toiDaDong));
    if (anBot) phan.push(mo(`  … ${anBot} dòng phía trên`));
    dong.forEach((d, i) => phan.push(i === 0 && !anBot ? `${mau(THUONG_HIEU.timNhat)('●')} ${d}` : `  ${d}`));
  }
  for (const t of S.toolChay) {
    const sang = nhip % 2 === 0;
    const cham = mau(sang ? THUONG_HIEU.timNhat : THUONG_HIEU.tim)(sang ? '●' : '○');
    if (phan.length) phan.push('');
    phan.push(dongTieuDeTool(t.ten, t.lenh, cham, rong));
    if (TOOL_LENH.has(t.ten)) {
      const ra = veDauRa(t.ra, rong, false);
      const dong = ra.length ? ra : [mo(`đang chạy… ${giay(Date.now() - t.batDau)}`)];
      dong.forEach((d, i) => phan.push(i === 0 ? `  ${mo('⎿')}  ${d}` : `     ${d}`));
    }
  }
  if (!phan.length) return null;
  return <Box flexDirection="column" marginTop={1}><Text>{phan.join('\n')}</Text></Box>;
}

// ─── Dòng trạng thái ✻ Đang … ────────────────────────────────────

export function DongTrangThai({ S, nhip }: { S: TrangThaiChat; nhip: number }) {
  if (!S.dangChay) return null;
  const cho = S.pha === 'duyet';
  const sao = cho ? '⏸' : SAO[nhip % SAO.length]!;
  const mauSao = [THUONG_HIEU.tim, '#9f7aea', '#7c83f7', THUONG_HIEU.xanh, '#7c83f7', '#9f7aea'][nhip % 6]!;
  const phan = [giay(Date.now() - (S.batDauLuot || Date.now()))];
  if (S.buoc?.nay) phan.push(S.buoc.tran && S.buoc.tran - S.buoc.nay <= 10 ? `bước ${S.buoc.nay}/${S.buoc.tran}` : `bước ${S.buoc.nay}`);
  phan.push(cho ? 'chọn bên dưới' : 'esc để dừng');
  return (
    <Box marginTop={1}>
      <Text>{`${mau(mauSao)(sao)} ${mau(cho ? '#fbbf24' : THUONG_HIEU.timNhat)(`${cauTrangThai(S)}${cho ? '' : '…'}`)} ${mo(`(${phan.join(' · ')})`)}`}</Text>
    </Box>
  );
}

// ─── Bảng kế hoạch ───────────────────────────────────────────────

export function coGiDeHien(S: TrangThaiChat): boolean {
  return S.dangChay || S.keHoach.length > 0 || Object.keys(S.fileDaSua).length > 0;
}

export function BangKeHoach({ S, rong, nhip, toiDaViec = 14 }: { S: TrangThaiChat; rong: number; nhip: number; toiDaViec?: number }) {
  const trong = rong - 4;
  const dong: string[] = [];
  const tieuDe = (t: string) => dam(mau(THUONG_HIEU.timNhat)(t));
  dong.push(tieuDe('📋 Kế hoạch'));
  if (S.keHoach.length) {
    const xong = S.keHoach.filter((v) => v.trangThai === 'xong').length;
    dong.push(mo(`${xong}/${S.keHoach.length} việc xong`));
    // Kế hoạch dài: giữ cửa sổ quanh việc đang làm, không phải 14 việc đầu (việc đầu thường đã xong).
    const n = Math.max(3, toiDaViec);
    const dang = Math.max(0, S.keHoach.findIndex((v) => v.trangThai !== 'xong'));
    const dau = Math.max(0, Math.min(dang - 1, S.keHoach.length - n));
    if (dau > 0) dong.push(mo(`… ${dau} việc đã qua`));
    dong.push(...veKeHoach(S.keHoach.slice(dau, dau + n), trong));
    if (S.keHoach.length > dau + n) dong.push(mo(`… +${S.keHoach.length - dau - n} việc`));
  } else {
    dong.push(mo(catVua('Chưa có — việc lớn CuongMini sẽ tự lập.', trong)));
  }
  if (S.dangChay) {
    dong.push('', tieuDe('Đang làm'));
    const sao = S.pha === 'duyet' ? '⏸' : SAO[nhip % SAO.length]!;
    dong.push(`${mau(THUONG_HIEU.tim)(sao)} ${catVua(cauTrangThai(S), trong - 2)}`);
    const t = S.toolChay[S.toolChay.length - 1];
    if (t?.lenh) dong.push(mo(`  $ ${catVua(t.lenh, trong - 4)}`));
    const p = [giay(Date.now() - (S.batDauLuot || Date.now()))];
    if (S.buoc?.nay) p.push(`bước ${S.buoc.nay}${S.buoc.tran ? `/${S.buoc.tran}` : ''}`);
    dong.push(mo(`  ${p.join(' · ')}`));
  }
  const file = Object.entries(S.fileDaSua);
  if (file.length) {
    dong.push('', tieuDe(`File đã sửa (${file.length})`));
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

export function ONhapView({ o, rong, cheDo, dangChay, goiYMo, soHangCho }: { o: ONhap; rong: number; cheDo: string; dangChay: boolean; goiYMo: boolean; soHangCho: number }) {
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
    ? `CuongMini đang làm… gõ tiếp và Enter để xếp hàng${soHangCho ? ` (${soHangCho} tin đang chờ)` : ''}`
    : 'Hỏi hoặc giao việc…  / lệnh · @ file · ! shell · # ghi nhớ';
  const hien = o.text ? ra.join('\n') : `${mau(THUONG_HIEU.timNhat)('❯')} ${dao(' ')}${mo(catVua(goi, trong - 2))}`;
  const nhanKieu = kieu === 'shell' ? mau('#fbbf24')(' chế độ shell — Enter chạy ngay ở thư mục dự án, không qua AI')
    : kieu === 'ghiNho' ? mau('#22d3ee')(' ghi nhớ — Enter lưu thành quy ước dự án (AGENTS.md)') : '';
  const vienMau = kieu === 'shell' ? '#fbbf24' : kieu === 'ghiNho' ? '#22d3ee' : goiYMo ? THUONG_HIEU.tim : cd.id === 'boQuaHet' ? '#f87171' : XAM;
  return (
    <Box flexDirection="column" width={rong}>
      <Box borderStyle={kieuVien()} borderColor={mauInk(vienMau)} paddingX={1} width={rong}>
        <Text wrap="wrap">{hien}</Text>
      </Box>
      {nhanKieu ? <Text>{mo(nhanKieu)}</Text> : null}
    </Box>
  );
}

/** Tin đang chờ gửi (gõ lúc agent đang làm) — Esc huỷ, tự gửi khi lượt xong. */
export function HangCho({ ds, rong }: { ds: string[]; rong: number }) {
  if (!ds.length) return null;
  const dong = ds.slice(0, 3).map((t) => `${mau('#fbbf24')('⏳')} ${mo('sẽ gửi sau:')} ${catVua(t.replace(/\s+/g, ' '), rong - 18)}`);
  if (ds.length > 3) dong.push(mo(`   … +${ds.length - 3} tin nữa`));
  dong.push(mo('   esc: huỷ hàng chờ (đưa chữ về ô nhập)'));
  return <Box marginTop={1}><Text>{dong.join('\n')}</Text></Box>;
}

/** Lệnh `!` đang chạy: dòng lệnh + vài dòng đầu ra cuối. */
export function ShellDangChay({ lenh, ra, batDau, rong, nhip }: { lenh: string; ra: string; batDau: number; rong: number; nhip: number }) {
  const sao = mau('#fbbf24')(SAO[nhip % SAO.length]!);
  const dong = [`${sao} ${mau('#fbbf24')(dam('!'))} ${dam(catVua(lenh, rong - 6))}`];
  const r = veDauRa(ra, rong, false);
  r.forEach((d, i) => dong.push(i === 0 ? `  ${mo('⎿')}  ${d}` : `     ${d}`));
  dong.push(mo(`  ${giay(Date.now() - batDau)} · esc để dừng`));
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
      <Text>{`${dam(mau(THUONG_HIEU.timNhat)(tieuDe))} ${mo(`· ${dong.length} dòng · ${Math.min(100, phanTram)}%`)}`}</Text>
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
  if (!ds.length) return <Text>{mo(`  ${kieu === '@' ? 'Không có file nào khớp' : 'Không có lệnh nào khớp'}`)}</Text>;
  const cua = 8;
  const dau = Math.max(0, Math.min(chon - Math.floor(cua / 2), ds.length - cua));
  const hien = ds.slice(dau, dau + cua);
  const beNhan = Math.min(34, Math.max(...hien.map((m) => doRong(m.nhan))) + 2);
  const dong = hien.map((m, i) => {
    const dang = dau + i === chon;
    const nhan = catVua(m.nhan, beNhan);
    const trai = dang ? mau(THUONG_HIEU.timNhat)(dam(`› ${nhan}`)) : `  ${kieu === '@' && m.thuMuc ? mau('#93c5fd')(nhan) : nhan}`;
    const moTa = m.mo ? mo(catVua(m.mo, Math.max(0, rong - beNhan - 6))) : '';
    return `${trai}${' '.repeat(Math.max(1, beNhan + 2 - doRong(nhan)))}${moTa}`;
  });
  if (ds.length > cua) dong.push(mo(`  ${chon + 1}/${ds.length} · ↑↓ chọn · Tab chèn · Enter ${kieu === '/' ? 'chạy' : 'chọn'}`));
  else dong.push(mo(`  ↑↓ chọn · Tab chèn · Enter ${kieu === '/' ? 'chạy' : 'chọn'} · Esc đóng`));
  return <Box paddingLeft={1}><Text>{dong.join('\n')}</Text></Box>;
}

// ─── Chân trang ──────────────────────────────────────────────────

export function ChanTrang({ S, rong, model, muc, nhac }: { S: TrangThaiChat; rong: number; model: string; muc: string; nhac: string }) {
  const cd = moTaCheDo(S.ws?.cheDoQuyen);
  const trai = `${mau(cd.mau)(`${cd.icon} ${cd.ten}`)} ${mo('(shift+tab)')}${S.ws?.choTrinhDuyet ? ` ${mau('#60a5fa')('🌐')}` : ''}`;
  const giua = `${mau(THUONG_HIEU.xanhNhat)(model)}${mo(` · ${muc}`)}`;
  const phaiPhan: string[] = [];
  if (S.ws?.name) phaiPhan.push(`${S.ws.name}${S.ws.branch ? ` ⎇ ${S.ws.branch}` : ''}`);
  if (S.nguCanh) phaiPhan.push(`ngữ cảnh ${S.nguCanh.phanTram}%`);
  if (S.tienPhien > 0) phaiPhan.push(`~$${S.tienPhien < 0.1 ? S.tienPhien.toFixed(3) : S.tienPhien.toFixed(2)}`);
  if (S.hanMucPhanTram !== null && S.hanMucPhanTram >= 50) phaiPhan.push(`hạn mức ${S.hanMucPhanTram}%`);
  const phai = mo(phaiPhan.join(' · '));
  if (nhac) return <Box paddingLeft={2}><Text>{mau('#fbbf24')(nhac)}</Text></Box>;
  const tong = doRong(trai) + doRong(giua) + doRong(phai) + 8;
  const coPhai = tong <= rong;
  const khoang = coPhai ? Math.max(2, rong - 7 - doRong(trai) - doRong(giua) - doRong(phai)) : 3;
  return (
    <Box paddingLeft={2}>
      <Text wrap="truncate">{`${trai}   ${giua}${coPhai ? ' '.repeat(khoang) + phai : ''}`}</Text>
    </Box>
  );
}

// ─── Thẻ duyệt ───────────────────────────────────────────────────

export interface LuaChonDuyet { q: 'choPhep' | 'choPhepCaFile' | 'tuChoi'; nhan: string }

export function luaChonDuyet(d: ChoDuyet): LuaChonDuyet[] {
  switch (d.loai) {
    case 'xinPhep': return [{ q: 'choPhep', nhan: 'Cho phép' }, { q: 'choPhepCaFile', nhan: 'Cho phép cả việc này (không hỏi lại file này)' }, { q: 'tuChoi', nhan: 'Từ chối' }];
    case 'xinPhepLenh': {
      const ds: LuaChonDuyet[] = [{ q: 'choPhep', nhan: 'Chạy' }];
      if (d.phanLoai?.choNho !== false) ds.push({ q: 'choPhepCaFile', nhan: 'Luôn cho lệnh này ở dự án này' });
      ds.push({ q: 'tuChoi', nhan: 'Từ chối' });
      return ds;
    }
    case 'xinPhepGit': return [{ q: 'choPhep', nhan: ({ commit: 'Commit', pr: 'Đẩy và mở PR', day: 'Đẩy lên GitHub', cai: 'Cài' } as Record<string, string>)[d.viec ?? ''] ?? 'Đồng ý' }, { q: 'tuChoi', nhan: 'Từ chối' }];
    case 'xinPhepNote': return [{ q: 'choPhep', nhan: 'Ghi' }, { q: 'tuChoi', nhan: 'Từ chối' }];
    default: return [{ q: 'choPhep', nhan: 'Cho phép' }, { q: 'tuChoi', nhan: 'Từ chối' }];
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
      tieuDe = `${d.taoMoi ? 'Tạo file' : 'Sửa file'} ${mau('#7dd3fc')(d.duongDan ?? '')}`;
      dong.push(...veDiff(d.diff, { rong: trong, duong: d.duongDan, toiDa: Math.max(4, toiDaDong) }));
      break;
    case 'xinPhepLenh':
      tieuDe = 'Chạy lệnh';
      dong.push(...(d.lenh ?? '').split('\n').slice(0, 12).map((l, i) => `${i === 0 ? mau('#fbbf24')('$') : ' '} ${dam(catVua(l, trong - 2))}`));
      if (d.phanLoai?.lyDo?.length) {
        dong.push('');
        for (const l of d.phanLoai.lyDo.slice(0, 5)) dong.push(`${mau(MAU_MUC[muc])('▲')} ${catVua(l, trong - 2)}`);
      }
      break;
    case 'xinPhepMcp':
      tieuDe = `Gọi công cụ ${mau('#7dd3fc')(`${d.server} · ${d.tool}`)}`;
      dong.push(...String(d.args ?? '').slice(0, 2000).split('\n').slice(0, Math.max(3, toiDaDong)).map((l) => mo(catVua(l, trong))));
      break;
    case 'xinPhepGit':
      tieuDe = ({ commit: 'Commit', pr: 'Đẩy nhánh + mở Pull Request', day: 'Đẩy lên GitHub', cai: 'Cài công cụ' } as Record<string, string>)[d.viec ?? ''] ?? 'Git';
      dong.push(...String(d.chiTiet ?? '').split('\n').slice(0, Math.max(3, toiDaDong)).map((l) => catVua(l, trong)));
      break;
    case 'xinPhepNote':
      tieuDe = d.viec === 'tao' ? 'Tạo ghi chú' : 'Ghi vào ghi chú';
      dong.push(...String(d.chiTiet ?? '').slice(0, 4000).split('\n').slice(0, Math.max(3, toiDaDong)).map((l) => catVua(l, trong)));
      break;
  }
  const lc = luaChonDuyet(d);
  const chonDong = lc.map((l, i) => (i === chon
    ? mau(MAU_MUC[muc])(dam(`❯ ${i + 1}. ${l.nhan}`))
    : `  ${mo(`${i + 1}.`)} ${l.nhan}`));
  const nhanMuc = muc === 'nguyhiem' ? mau('#f87171')(' · NGUY HIỂM') : muc === 'cankiem' ? mau('#fbbf24')(' · cần xem kỹ') : '';
  return (
    <Box borderStyle={kieuVien()} borderColor={mauInk(MAU_MUC[muc])} flexDirection="column" paddingX={1} width={rong} marginTop={1}>
      <Text>{`${dam(tieuDe)}${nhanMuc}${conLai > 1 ? mo(`  (còn ${conLai - 1} yêu cầu nữa)`) : ''}`}</Text>
      {dong.length ? <Box marginTop={1}><Text>{dong.join('\n')}</Text></Box> : null}
      <Box marginTop={1} flexDirection="column">
        <Text>{dam('Cho phép?')}</Text>
        <Text>{chonDong.join('\n')}</Text>
      </Box>
      <Text>{mo('↑↓ chọn · Enter xác nhận · phím số chọn nhanh · Esc từ chối')}</Text>
    </Box>
  );
}

// ─── Menu chọn (model, mức, việc cũ, duyệt kế hoạch, xác nhận) ───

export interface MucMenu { nhan: string; mo?: string; nhom?: string; tat?: boolean; dangChon?: boolean; giaTri: string }

export function MenuView({ tieuDe, moTa, ds, chon, loc, coLoc, rong, mauVien }: {
  tieuDe: string; moTa?: string; ds: MucMenu[]; chon: number; loc: string; coLoc: boolean; rong: number; mauVien?: string;
}) {
  const cua = 10;
  const dau = Math.max(0, Math.min(chon - Math.floor(cua / 2), ds.length - cua));
  const hien = ds.slice(dau, dau + cua);
  const dong: string[] = [];
  let nhomCu = dau > 0 ? ds[dau - 1]?.nhom : undefined;
  // Cột mô tả thẳng hàng — dễ đọc hơn khi so các model/mức với nhau.
  const beTen = Math.min(32, Math.max(0, ...hien.map((m) => doRong(`${m.dangChon ? '✓ ' : ''}${m.nhan}`))));
  hien.forEach((m, i) => {
    if (m.nhom && m.nhom !== nhomCu) { if (dong.length) dong.push(''); dong.push(mo(m.nhom)); nhomCu = m.nhom; }
    const k = dau + i;
    const dang = k === chon;
    const so = k < 9 ? `${k + 1}.` : '  ';
    const nhan = `${m.dangChon ? '✓ ' : ''}${m.nhan}`;
    const trai = m.tat ? mo(`  ${so} ${nhan}`) : dang ? mau(THUONG_HIEU.timNhat)(dam(`❯ ${so} ${nhan}`)) : `  ${mo(so)} ${nhan}`;
    const dem2 = ' '.repeat(Math.max(0, beTen - doRong(nhan)));
    dong.push(`${trai}${m.mo ? `${dem2}  ${mo(catVua(m.mo, Math.max(0, rong - Math.max(beTen, doRong(nhan)) - 12)))}` : ''}`);
  });
  if (!ds.length) dong.push(mo('  Không có gì khớp.'));
  return (
    <Box borderStyle={kieuVien()} borderColor={mauInk(mauVien ?? THUONG_HIEU.tim)} flexDirection="column" paddingX={1} width={rong} marginTop={1}>
      <Text>{dam(tieuDe)}</Text>
      {moTa ? <Text>{mo(moTa)}</Text> : null}
      {coLoc ? <Text>{`${mau(THUONG_HIEU.timNhat)('⌕')} ${loc}${dao(' ')}${loc ? '' : mo(' gõ để lọc…')}`}</Text> : null}
      <Box marginTop={1}><Text>{dong.join('\n')}</Text></Box>
      <Text>{mo(`${ds.length > cua ? `${chon + 1}/${ds.length} · ` : ''}↑↓ chọn · Enter xác nhận · Esc huỷ`)}</Text>
    </Box>
  );
}

/** Ô nhập ẩn ký tự (mật khẩu) hoặc hiện (tên đăng nhập). */
export function ONhapNho({ nhan, giaTri, an, dangNhap }: { nhan: string; giaTri: string; an?: boolean; dangNhap?: boolean }) {
  const hien = an ? '•'.repeat([...giaTri].length) : giaTri;
  return <Text>{`${mo(nhan.padEnd(14))}${dangNhap ? mau(THUONG_HIEU.timNhat)('❯ ') : '  '}${hien}${dangNhap ? dao(' ') : ''}`}</Text>;
}
