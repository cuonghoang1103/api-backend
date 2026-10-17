/**
 * VẼ bảng agent phụ / lệnh nền kiểu Claude Code — phần THUẦN (chuỗi ANSI):
 *
 *   ▸▸ auto mode · 2 shells · ⧉ 2 · /tasks · esc để dừng · ↓ để quản lý
 *   ● main             Đang chạy lệnh…                    2m 05s
 *   ○ general-purpose  Đọc(src/app.ts)                    1m 12s · ~$0.004
 *   ○ code-reviewer    Tìm(useEffect)                        48s
 *
 * và màn CHI TIẾT một agent phụ (nhiệm vụ, dòng thời gian từng bước, tool,
 * chữ nó viết, kết quả cuối) hoặc một lệnh nền (đầu ra).
 */
import { L } from './i18n';
import { THUONG_HIEU, catVua, dam, dem, doRong, mau, mo } from './mau';
import { veMarkdown } from './markdown';
import { giay } from './trangThai';
import type { AgentPhu, LenhNen } from './viecPhu';

export interface DongBang { id: string; kieu: 'main' | 'phu' | 'shell'; nhan: string; viec: string; phai: string; trangThai: 'dang' | 'xong' | 'loi' | 'dung' }

const MAU_TT = { dang: THUONG_HIEU.timNhat, xong: '#4ade80', loi: '#f87171', dung: '#fbbf24' };

export function tienChu(usd: number): string {
  if (!usd) return '';
  return `~$${usd < 0.01 ? usd.toFixed(4) : usd.toFixed(3)}`;
}

/** Các dòng của bảng: main trước, rồi agent phụ (đang chạy trước), rồi lệnh nền. `tatCa` = cả việc đã xong (/tasks). */
export function dongBangPhu(
  ds: { agentPhu: readonly AgentPhu[]; lenhNen: readonly LenhNen[] },
  main: { viec: string; batDau: number; dangChay: boolean; tienUsd: number },
  o: { tatCa: boolean; bayGio?: number },
): DongBang[] {
  const bayGio = o.bayGio ?? Date.now();
  const ra: DongBang[] = [{
    id: 'main', kieu: 'main', nhan: 'main', viec: main.viec, trangThai: main.dangChay ? 'dang' : 'xong',
    phai: [main.dangChay && main.batDau ? giay(bayGio - main.batDau) : '', tienChu(main.tienUsd)].filter(Boolean).join(' · '),
  }];
  const agent = [...ds.agentPhu].filter((a) => o.tatCa || a.trangThai === 'dang')
    .sort((a, b) => Number(b.trangThai === 'dang') - Number(a.trangThai === 'dang') || b.batDau - a.batDau);
  for (const a of agent) {
    const lau = (a.ketThuc ?? bayGio) - a.batDau;
    ra.push({
      id: a.id, kieu: 'phu', nhan: a.kieu, trangThai: a.trangThai,
      viec: a.trangThai === 'dang' ? a.dangLam : (a.nhiemVu || a.dangLam),
      phai: [giay(lau), a.token ? `↓ ${(a.token / 1000).toFixed(1)}k tokens` : tienChu(a.tienUsd)].filter(Boolean).join(' · '),
    });
  }
  for (const x of ds.lenhNen.filter((l) => o.tatCa || l.dangChay)) {
    ra.push({
      id: `shell:${x.id}`, kieu: 'shell', nhan: `$ ${x.lenh || x.id}`, trangThai: x.dangChay ? 'dang' : 'xong',
      viec: x.trangThai, phai: giay((x.ketThuc ?? bayGio) - x.batDau),
    });
  }
  return ra;
}

/** Dòng tóm tắt trên đầu bảng (kiểu `▸▸ auto mode on · 8 shells · ⧉ 2 · …`). */
export function dongTomTat(o: { cheDo: string; mauCheDo: string; soShell: number; soPhu: number; dangChay: boolean; dangChon: boolean }): string {
  const phan = [mau(o.mauCheDo)(`▸▸ ${o.cheDo}`)];
  if (o.soShell) phan.push(L(`${o.soShell} lệnh nền`, `${o.soShell} shell${o.soShell > 1 ? 's' : ''}`));
  if (o.soPhu) phan.push(`⧉ ${o.soPhu}`);
  phan.push(L('/tasks xem agent phụ', '/tasks to see subagents'));
  if (o.dangChay) phan.push(L('esc để dừng', 'esc to interrupt'));
  phan.push(o.dangChon ? L('enter xem chi tiết · ← agent khác · esc thoát', 'enter for details · ← next agent · esc to exit') : L('↓ để quản lý', '↓ to manage'));
  return phan.map((p, i) => (i === 0 ? p : mo(p))).join(mo(' · '));
}

/** Vẽ các dòng của bảng (cột phải canh lề). `chon` = chỉ số dòng đang chọn hoặc -1. */
export function veDongBang(ds: readonly DongBang[], chon: number, rong: number, nhip = 0): string[] {
  const beNhan = Math.min(24, Math.max(6, ...ds.map((d) => doRong(d.nhan))));
  return ds.map((d, i) => {
    const dang = i === chon;
    const xoay = d.trangThai === 'dang' && d.kieu !== 'main' && !dang;
    const cham = dang ? mau(THUONG_HIEU.tim)('●')
      : d.kieu === 'main' && chon < 0 ? mau(THUONG_HIEU.timNhat)('●')
        : xoay ? mau(MAU_TT.dang)(nhip % 2 ? '◌' : '○') : mau(MAU_TT[d.trangThai])(d.trangThai === 'xong' ? '✓' : d.trangThai === 'loi' ? '✗' : d.trangThai === 'dung' ? '■' : '○');
    const nhan = dem(catVua(d.nhan, beNhan), beNhan);
    const phai = mo(d.phai);
    const conLai = Math.max(8, rong - beNhan - doRong(d.phai) - 7);
    const viec = catVua(d.viec, conLai);
    const trai = `${cham} ${dang ? dam(mau(THUONG_HIEU.timNhat)(nhan)) : d.kieu === 'main' ? dam(nhan) : nhan}  ${dang ? viec : mo(viec)}`;
    return `${dem(trai, rong - doRong(phai) - 1)}${phai}`;
  });
}

/** Màn chi tiết một agent phụ. */
export function chiTietAgent(a: AgentPhu, rong: number, bayGio = Date.now()): string[] {
  const ra: string[] = [];
  const tt = { dang: L('đang chạy', 'running'), xong: L('xong', 'done'), loi: L('lỗi', 'failed'), dung: L('đã dừng', 'interrupted') }[a.trangThai];
  ra.push(`${mau(MAU_TT[a.trangThai])('●')} ${dam(a.kieu)} ${mo('·')} ${mau(MAU_TT[a.trangThai])(tt)} ${mo(`${a.model ? `· ${a.model} ` : ''}· ${giay((a.ketThuc ?? bayGio) - a.batDau)}${a.soTool ? L(` · ${a.soTool} tool`, ` · ${a.soTool} tool calls`) : ''}${a.tienUsd ? ` · ${tienChu(a.tienUsd)}` : ''}${a.token ? ` · ${(a.token / 1000).toFixed(1)}k tokens` : ''}`)}`);
  ra.push('');
  ra.push(dam(mau(THUONG_HIEU.timNhat)(L('Nhiệm vụ', 'Task'))));
  ra.push(...veMarkdown(a.nhiemVu || L('_(lõi chưa gửi nhiệm vụ — chờ dòng tóm tắt của agent phụ)_', '_(the core has not sent the task yet)_'), { rong: rong - 2 }).split('\n').map((d) => `  ${d}`));
  ra.push('');
  ra.push(dam(mau(THUONG_HIEU.timNhat)(L('Dòng thời gian', 'Timeline'))));
  for (const b of a.buoc) {
    const luc = mo(`+${giay(b.luc - a.batDau).padStart(6)}`);
    const dau = b.kieu === 'tool' ? (b.hong ? mau('#f87171')('●') : mau('#4ade80')('●')) : b.kieu === 'loi' ? mau('#f87171')('✗') : b.kieu === 'xong' ? mau('#4ade80')('✓') : mau(THUONG_HIEU.xanhNhat)('◆');
    ra.push(`  ${luc}  ${dau} ${catVua(b.mo, rong - 16)}`);
    if (b.chiTiet && b.kieu !== 'nhiemVu') ra.push(`  ${' '.repeat(8)}  ${mo('⎿')}  ${mo(catVua(b.chiTiet.replace(/\s+/g, ' '), rong - 20))}`);
  }
  if (a.trangThai === 'dang') ra.push(`  ${' '.repeat(8)}  ${mau(THUONG_HIEU.timNhat)('…')} ${mo(a.dangLam)}`);
  if (!a.coBuocTrong) {
    ra.push('');
    ra.push(mo(L('  (Lõi hiện chưa báo từng bước bên trong agent phụ — chỉ có lúc bắt đầu và kết quả cuối.)', '  (The core does not report subagent steps yet — only start and final result.)')));
  }
  // Chữ agent phụ viết GỒM cả câu trả lời cuối ⇒ có kết quả thì chỉ giữ phần viết TRƯỚC nó (lời dẫn giữa các bước), khỏi in hai lần.
  const kqDau = a.ketQua?.trim().slice(0, 120) ?? '';
  const viTri = kqDau ? a.chu.indexOf(kqDau) : -1;
  const chu = (viTri >= 0 ? a.chu.slice(0, viTri) : a.chu).trim();
  if (chu) {
    ra.push('');
    ra.push(dam(mau(THUONG_HIEU.timNhat)(L('Agent phụ viết', 'Subagent output'))));
    ra.push(...veMarkdown(chu, { rong: rong - 2 }).split('\n').map((d) => `  ${d}`));
  }
  if (a.ketQua?.trim()) {
    ra.push('');
    ra.push(dam(mau(THUONG_HIEU.timNhat)(L('Kết quả cuối', 'Final result'))));
    ra.push(...veMarkdown(a.ketQua, { rong: rong - 2 }).split('\n').map((d) => `  ${d}`));
  }
  return ra;
}

/** Màn chi tiết một lệnh nền. */
export function chiTietShell(x: LenhNen, rong: number, bayGio = Date.now()): string[] {
  const ra = [`${mau(x.dangChay ? THUONG_HIEU.timNhat : '#4ade80')('●')} ${dam(`$ ${x.lenh || x.id}`)} ${mo(`· ${x.trangThai} · ${giay((x.ketThuc ?? bayGio) - x.batDau)} · id ${x.id}`)}`, ''];
  const ra2 = x.ra.replace(/\r\n?/g, '\n').replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '').split('\n');
  if (!x.ra.trim()) ra.push(mo(L('  (chưa có đầu ra — agent đọc bằng doc_dau_ra_nen thì mới hiện ở đây)', '  (no output yet — it shows up when the agent reads it with doc_dau_ra_nen)')));
  else ra.push(...ra2.map((d) => `  ${mo(catVua(d, rong - 4))}`));
  return ra;
}
