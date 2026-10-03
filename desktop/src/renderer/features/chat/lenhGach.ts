/**
 * ============================================================
 * LỆNH `/` CỦA AI CODE — phần THUẦN (đọc lệnh, dựng câu trả lời)
 * ============================================================
 *
 * 03/10/2026: thêm ba nhóm lệnh như Claude Code (`/model`, `/usage`,
 * `/context`, `/compact`, `/status`, `/plan`, `/review`, `/init`, `/resume`,
 * `/rewind`, `/memory`, `/export`, `/doctor`, `/offline`, `/effort`, `/hooks`,
 * `/mcp`). `AgentMode.tsx` chỉ còn việc ĐIỀU PHỐI; mọi chỗ dễ sai — khớp bí
 * danh, chọn model theo chữ gõ, dựng bảng số — nằm ở đây để kiểm được bằng
 * vitest mà không phải dựng cả màn hình.
 *
 * ⛔ Câu trả lời của lệnh chạy CỤC BỘ đi vào `lenhTraLoi` (ngoài hội thoại),
 * KHÔNG vào bảng ghi gửi lên cổng — xem chú thích ở `AgentMode.lenhTraLoi`.
 */
import type {
  AgentMucChanDoan, AgentNguCanhChiTiet, AgentPhien, CheDoQuyen,
} from '../../../shared/ipc';
import type { MucHienThi } from './useAgent';

export type NhomLenh = 'co-ban' | 'phien' | 'lam-viec' | 'cong-cu';

export interface LenhGach {
  ten: string;
  mo: string;
  /** Tên khác cùng nghĩa — gõ cái nào cũng ra. */
  khac?: string[];
  /** Gợi ý tham số, hiện trong bảng gợi ý và `/help`. */
  thamSo?: string;
  nhom?: NhomLenh;
}

/**
 * Danh sách lệnh dựng sẵn. THỨ TỰ = thứ tự trong bảng gợi ý khi vừa gõ `/`:
 * lệnh hay dùng lên trước. `/help` in theo NHÓM.
 */
export const LENH_AGENT: LenhGach[] = [
  { ten: '/clear', mo: 'Xoá hội thoại, bắt đầu việc mới', khac: ['/new', '/moi'], nhom: 'co-ban' },
  { ten: '/model', mo: 'Chọn model ngay trong khung (cả cổng dự phòng, AI trên máy)', khac: ['/mohinh'], thamSo: '[tên]', nhom: 'phien' },
  { ten: '/effort', mo: 'Đổi mức nỗ lực (số bước, agent phụ)', khac: ['/noluc'], thamSo: '[thấp|vừa|cao|rất cao|tối đa|ultracode]', nhom: 'phien' },
  { ten: '/compact', mo: 'Tóm tắt phần cũ NGAY để nhẹ ngữ cảnh (vẫn giữ bản đầy đủ để đọc)', khac: ['/tomtat', '/nen'], thamSo: '[ghi chú cần giữ]', nhom: 'phien' },
  { ten: '/context', mo: 'Ngữ cảnh đã dùng: đề bài, lịch sử, kết quả tool, ảnh', khac: ['/ngucanh'], nhom: 'phien' },
  { ten: '/usage', mo: 'Hạn mức 5 giờ, lúc hồi, trần tiền ngày, key gia hạn', khac: ['/hanmuc'], nhom: 'phien' },
  { ten: '/cost', mo: 'Tiền đã tiêu trong việc này', khac: ['/tien', '/chiphi'], nhom: 'phien' },
  { ten: '/status', mo: 'Phiên bản app, cổng đang dùng, mạng, dự án, nhánh git', khac: ['/trangthai'], nhom: 'phien' },
  { ten: '/plan', mo: 'Chỉ lập kế hoạch (không sửa, không chạy lệnh) — duyệt xong mới làm', khac: ['/kehoach'], thamSo: '<việc cần làm>', nhom: 'lam-viec' },
  { ten: '/review', mo: 'Soát diff hiện tại, liệt kê lỗi kèm file:dòng — không sửa', khac: ['/soat'], thamSo: '[phạm vi]', nhom: 'lam-viec' },
  { ten: '/diff', mo: 'Xem git diff của dự án đang mở', khac: ['/thaydoi'], nhom: 'lam-viec' },
  { ten: '/init', mo: 'Quét dự án, tạo/cập nhật AGENTS.md mà agent tự đọc mỗi lượt', khac: ['/khoitao'], nhom: 'lam-viec' },
  { ten: '/undo', mo: 'Hoàn tác mọi file agent đã sửa trong việc này', khac: ['/hoantac'], nhom: 'lam-viec' },
  { ten: '/rewind', mo: 'Quay về một câu hỏi trước: cắt hội thoại + lùi file về mốc đó', khac: ['/quaylui'], thamSo: '[số câu]', nhom: 'lam-viec' },
  { ten: '/resume', mo: 'Mở lại một việc cũ', khac: ['/tieptuc'], thamSo: '[số|từ khoá]', nhom: 'lam-viec' },
  { ten: '/export', mo: 'Xuất hội thoại ra file Markdown', khac: ['/xuat'], nhom: 'lam-viec' },
  { ten: '/memory', mo: 'Xem/xoá bộ nhớ (bài học) của agent', khac: ['/bonho'], nhom: 'cong-cu' },
  { ten: '/hooks', mo: 'Mở quản lý hook', khac: ['/hook'], nhom: 'cong-cu' },
  { ten: '/mcp', mo: 'Mở quản lý máy chủ MCP', nhom: 'cong-cu' },
  { ten: '/kynang', mo: 'Tìm và cài kỹ năng từ kho AI Templates vào dự án', khac: ['/skill'], thamSo: '[từ khoá | cai <tên>]', nhom: 'cong-cu' },
  { ten: '/quyen', mo: 'Xem và thu hồi các lệnh đã "Luôn cho phép"', khac: ['/permissions'], thamSo: '[xoa]', nhom: 'cong-cu' },
  { ten: '/offline', mo: 'Bật/tắt chạy bằng AI trên máy (ngoại tuyến) cho tab này', khac: ['/ngoaituyen'], nhom: 'cong-cu' },
  { ten: '/doctor', mo: 'Chẩn đoán: mạng, máy chủ, cổng, AI ngoại tuyến, quyền thư mục', khac: ['/chandoan'], nhom: 'cong-cu' },
  { ten: '/help', mo: 'Danh sách lệnh gạch chéo', khac: ['/?', '/tro-giup'], nhom: 'co-ban' },
];

const TEN_NHOM: Record<NhomLenh, string> = {
  'co-ban': 'Cơ bản', phien: 'Phiên & model', 'lam-viec': 'Làm việc', 'cong-cu': 'Công cụ',
};

/** Tách `"/compact giữ tên file"` → tên CHÍNH (đã đổi bí danh) + phần tham số. */
export function tachLenh(text: string, ds: LenhGach[] = LENH_AGENT): { ten: string; thamSo: string } | null {
  const t = text.trim();
  if (!t.startsWith('/')) return null;
  const cach = t.search(/\s/);
  const goTen = (cach < 0 ? t : t.slice(0, cach)).toLowerCase();
  const thamSo = cach < 0 ? '' : t.slice(cach + 1).trim();
  const l = ds.find((x) => x.ten === goTen || (x.khac ?? []).includes(goTen));
  return l ? { ten: l.ten, thamSo } : null;
}

/** `/help` — in theo nhóm, kèm bí danh và tham số. */
export function moTaTroGiup(ds: LenhGach[] = LENH_AGENT, lenhDuAn: Array<{ ten: string; mo: string }> = []): string {
  const nhom = (Object.keys(TEN_NHOM) as NhomLenh[]).map((n) => {
    const dong = ds.filter((l) => (l.nhom ?? 'co-ban') === n).map((l) => {
      const ts = l.thamSo ? ` ${l.thamSo}` : '';
      const khac = l.khac?.length ? ` _(${l.khac.join(', ')})_` : '';
      return `- \`${l.ten}${ts}\`${khac} — ${l.mo}`;
    });
    return dong.length ? `**${TEN_NHOM[n]}**\n${dong.join('\n')}` : '';
  }).filter(Boolean);
  const duAn = lenhDuAn.length
    ? `\n\n**Lệnh của dự án** (\`.claude/commands\`)\n${lenhDuAn.map((l) => `- \`${l.ten}\` — ${l.mo}`).join('\n')}`
    : '';
  return `${nhom.join('\n\n')}${duAn}\n\n_Gõ \`/\` để gợi ý · Tab để tự hoàn thành · lệnh chạy ngay trong app không tốn lượt nào trừ /plan, /review, /init, /diff._`;
}

// ─── khớp chữ gõ với model / mức ─────────────────────────────

/** Bỏ dấu + khoảng trắng + gạch: "Rất cao" → "ratcao", "GPT 6 Sol" → "gpt6sol". */
export function chuanHoa(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd')
    .toLowerCase().replace(/[\s_.-]+/g, '');
}

const BI_DANH_MUC: Record<string, string> = {
  low: 'thap', medium: 'vua', med: 'vua', high: 'cao', xhigh: 'ratCao', max: 'toiDa', ultra: 'ultracode',
};

/** Tìm phần tử khớp chữ gõ: trùng id → trùng tên → chứa. `null` khi không khớp hoặc mơ hồ. */
export function timTheoChu<T extends { id: string; ten: string }>(chu: string, ds: readonly T[], biDanh: Record<string, string> = {}): T | null {
  const q = chuanHoa(chu);
  if (!q) return null;
  const quaBiDanh = biDanh[q];
  if (quaBiDanh) return ds.find((x) => x.id === quaBiDanh) ?? null;
  const dung = ds.find((x) => chuanHoa(x.id) === q || chuanHoa(x.ten) === q);
  if (dung) return dung;
  const chua = ds.filter((x) => chuanHoa(x.id).includes(q) || chuanHoa(x.ten).includes(q));
  return chua.length === 1 ? chua[0]! : null;
}

export function timMuc<T extends { id: string; ten: string }>(chu: string, ds: readonly T[]): T | null {
  return timTheoChu(chu, ds, BI_DANH_MUC);
}

// ─── /usage ──────────────────────────────────────────────────

export interface DuLieuUsage {
  daDung: number; tran: number; tranGoc?: number; giaHan?: number; conLai: number; phanTram: number;
  soGio?: number; hoiLucNao: string | null; hoiHetLuc?: string | null; coKeyGiaHan?: boolean;
  tienNgay?: { phanTram: number; catViecNen: boolean; dungHet: boolean } | null;
}

/** Hỏi máy chủ — `request` tiêm vào để kiểm bằng hàm giả. */
export async function layUsage(request: (duong: string) => Promise<unknown>): Promise<DuLieuUsage> {
  const d = await request('/api/v1/agent/usage') as Partial<DuLieuUsage> | null;
  if (!d || typeof d.daDung !== 'number' || typeof d.tran !== 'number') {
    throw new Error('Máy chủ trả hạn mức sai hình dạng.');
  }
  return {
    daDung: d.daDung, tran: d.tran, conLai: d.conLai ?? Math.max(0, d.tran - d.daDung),
    phanTram: d.phanTram ?? Math.round((d.daDung / Math.max(1, d.tran)) * 100),
    hoiLucNao: d.hoiLucNao ?? null,
    ...(d.tranGoc !== undefined ? { tranGoc: d.tranGoc } : {}),
    ...(d.giaHan !== undefined ? { giaHan: d.giaHan } : {}),
    ...(d.soGio !== undefined ? { soGio: d.soGio } : {}),
    ...(d.hoiHetLuc !== undefined ? { hoiHetLuc: d.hoiHetLuc } : {}),
    ...(d.coKeyGiaHan !== undefined ? { coKeyGiaHan: d.coKeyGiaHan } : {}),
    ...(d.tienNgay !== undefined ? { tienNgay: d.tienNgay } : {}),
  };
}

const so = (n: number): string => n.toLocaleString('vi-VN');
const gio = (iso: string | null | undefined): string | null => (iso
  ? new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  : null);

/** Thanh chữ 20 ô — đọc được cả trong bản sao chép. */
export function thanh(phanTram: number, o = 20): string {
  const day = Math.max(0, Math.min(o, Math.round((phanTram / 100) * o)));
  return `\`${'█'.repeat(day)}${'░'.repeat(o - day)}\``;
}

export function moTaUsage(u: DuLieuUsage, tokenMoiViec = 141_000): string {
  const dong = [
    `**Hạn mức ${u.soGio ?? 5} giờ** ${thanh(u.phanTram)} ${u.phanTram}%`,
    '',
    `- Đã dùng: **${so(u.daDung)}** / ${so(u.tran)} token`,
    `- Còn: **${so(u.conLai)}** token ≈ ${Math.floor(u.conLai / tokenMoiViec)} việc`,
  ];
  if (u.giaHan && u.giaHan > 0) dong.push(`- Trong đó gia hạn bằng key: +${so(u.giaHan)} (trần gốc ${so(u.tranGoc ?? u.tran - u.giaHan)})`);
  const h = gio(u.hoiLucNao);
  const het = gio(u.hoiHetLuc);
  dong.push(h ? `- Bắt đầu hồi lại: khoảng **${h}**${het ? ` · hồi hết lúc ${het}` : ''}` : '- Chưa dùng gì trong cửa sổ này.');
  if (u.tienNgay) {
    dong.push(u.tienNgay.dungHet
      ? `- Trần tiền ngày của máy chủ: **đã chạm** (${u.tienNgay.phanTram}%) — AI tạm dừng tới 00:00.`
      : `- Trần tiền ngày của máy chủ: ${u.tienNgay.phanTram}%${u.tienNgay.catViecNen ? ' · đã cắt việc chạy nền' : ''}`);
  }
  dong.push(`- Key gia hạn: ${u.coKeyGiaHan ? '**có** — nhập ở nút bên dưới khi hết hạn mức' : 'chưa bật (quản trị viên chưa đặt key)'}`);
  return dong.join('\n');
}

// ─── /context ────────────────────────────────────────────────

const k = (n: number): string => `${Math.round(n / 1000)}k`;

export function moTaNguCanh(ct: AgentNguCanhChiTiet, tran: number, soLuotDaBo: number): string {
  const p = Math.min(100, Math.round((ct.tongGui / Math.max(1, tran)) * 100));
  const phan = (ten: string, n: number): string => `| ${ten} | ${k(n)} | ${ct.tong ? Math.round((n / ct.tong) * 100) : 0}% |`;
  const dong: Array<string | null> = [
    `**Ngữ cảnh** ${thanh(p)} ${k(ct.tongGui)} / ${k(tran)} ký tự (${p}%)`,
    '',
    '| Phần | Ký tự | Tỉ lệ |',
    '|---|---|---|',
    phan('Đề bài', ct.deBai),
    phan('Lịch sử hỏi–đáp', ct.lichSu),
    phan('Kết quả tool + tham số', ct.ketQuaTool),
    `| Ảnh | ${ct.soAnh} tấm · ${(ct.byteAnh / 1_048_576).toFixed(1)} MB | — |`,
    '',
    `- ${ct.soLuot} lượt hỏi · ${ct.soTin} tin nhắn giao thức`,
    ct.tomTat
      ? `- Đã /compact: ${ct.tomTat.soTinDaGop} tin đầu được thay bằng bản tóm tắt (lúc ${new Date(ct.tomTat.luc).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}). Gửi lên: ${k(ct.tongGui)} thay vì ${k(ct.tong)}.`
      : '- Chưa có bản tóm tắt — gõ `/compact` để thu gọn phần cũ.',
    soLuotDaBo > 0
      ? `- ⚠ Máy chủ đã tự cắt **${soLuotDaBo}** lượt cũ nhất ở lượt vừa rồi (có tóm tắt kèm).`
      : '- Máy chủ chưa phải cắt lượt nào.',
    ct.soAnh > 0 ? '- Ảnh cũ hơn 2 lượt được tự gỡ trước khi gửi (chống lỗi 413).' : null,
  ];
  return dong.filter((d): d is string => d !== null).join('\n');
}

// ─── /status ─────────────────────────────────────────────────

export type CongDangDung = 'chinh' | 'duPhong' | 'ngoaiTuyen' | 'epNgoaiTuyen';

export function moTaTrangThai(t: {
  phienBan: string; cong: CongDangDung; online: boolean; tenCucBo?: string;
  duAn: string | null; duongDan: string | null; nhanh: string | null;
  model: string; muc: string; cheDo: string; tomTat: boolean;
}): string {
  const cong: Record<CongDangDung, string> = {
    chinh: 'cổng chính (CuongMini)',
    duPhong: 'cổng DỰ PHÒNG (modelapi, tính phí)',
    ngoaiTuyen: `AI trên máy — ngoại tuyến${t.tenCucBo ? ` (${t.tenCucBo})` : ''}`,
    epNgoaiTuyen: `AI trên máy — ép tay bằng /offline${t.tenCucBo ? ` (${t.tenCucBo})` : ''}`,
  };
  return [
    '**Trạng thái**',
    '',
    `- App: **${t.phienBan}**`,
    `- Cổng: ${cong[t.cong]}`,
    `- Mạng: ${t.online ? 'có' : '**mất mạng**'}`,
    `- Model: ${t.model} · mức ${t.muc} · chế độ ${t.cheDo}`,
    t.duAn ? `- Dự án: \`${t.duAn}\`${t.duongDan ? ` — ${t.duongDan}` : ''}` : '- Dự án: chưa mở thư mục',
    `- Nhánh git: ${t.nhanh ? `\`${t.nhanh}\`` : '—'}`,
    t.tomTat ? '- Hội thoại đang dùng bản /compact' : '',
  ].filter(Boolean).join('\n');
}

// ─── /doctor ─────────────────────────────────────────────────

export function moTaChanDoan(ds: AgentMucChanDoan[]): string {
  const dau: Record<AgentMucChanDoan['muc'], string> = { ok: '✓', canh: '⚠', loi: '✗' };
  const loi = ds.filter((m) => m.muc === 'loi').length;
  const canh = ds.filter((m) => m.muc === 'canh').length;
  return [
    `**Chẩn đoán** — ${loi ? `${loi} lỗi` : 'không lỗi'}${canh ? ` · ${canh} cảnh báo` : ''}`,
    '',
    ...ds.map((m) => `- ${dau[m.muc]} **${m.ten}**: ${m.chiTiet}`),
  ].join('\n');
}

// ─── /plan · /review · /init ─────────────────────────────────

export function promptPlan(yeuCau: string): string {
  return `[CHẾ ĐỘ LẬP KẾ HOẠCH — người dùng gõ /plan]\n`
    + 'Lượt này bạn CHỈ ĐỌC: không sửa file, không chạy lệnh. Đọc mã đủ để hiểu, '
    + 'rồi trả về một kế hoạch đánh số: mỗi bước nêu file sẽ đụng, thay đổi cụ thể, cách kiểm. '
    + 'Ghi rõ rủi ro và câu hỏi còn mở. Dùng công cụ kế hoạch nếu có. Chưa thực hiện gì cho tới khi người dùng duyệt.\n\n'
    + `Việc cần làm: ${yeuCau}`;
}

export const PROMPT_DUYET_KE_HOACH = 'Kế hoạch ở trên đã được duyệt. Làm theo đúng kế hoạch đó, từng bước, kiểm sau mỗi bước.';

export function promptReview(phamVi: string): string {
  return '[SOÁT MÃ — người dùng gõ /review. Lượt này CHỈ ĐỌC, KHÔNG sửa gì.]\n'
    + 'Chạy git_status và git_diff (cả staged lẫn chưa staged). Soát kỹ thay đổi: lỗi logic, '
    + 'trường hợp biên, rò rỉ bảo mật, kiểu dữ liệu, xử lý lỗi, hiệu năng, mã chết. '
    + 'Trả về danh sách xếp theo mức nghiêm trọng (Nghiêm trọng / Nên sửa / Nhỏ), MỖI mục có `đường/dẫn:dòng`, '
    + 'mô tả vấn đề và đề xuất sửa ngắn. Không có vấn đề thì nói rõ đã soát những gì.'
    + (phamVi ? `\n\nPhạm vi người dùng chỉ định: ${phamVi}` : '');
}

export const PROMPT_INIT = '[KHỞI TẠO QUY ƯỚC DỰ ÁN — người dùng gõ /init]\n'
  + 'Quét dự án (cấu trúc thư mục, package.json/pyproject/…, lệnh build/test/lint, công cụ, quy ước đặt tên, '
  + 'thư mục quan trọng, những chỗ dễ sai). Rồi TẠO hoặc CẬP NHẬT file `AGENTS.md` ở gốc dự án — '
  + 'file này được app nạp cho agent ở MỌI lượt. Nếu dự án đã có `CLAUDE.md`/`AGENTS.md` thì GIỮ nội dung người dùng viết, '
  + 'chỉ bổ sung phần thiếu. Ngắn gọn, gạch đầu dòng, có lệnh chạy được thật. Đọc lại file sau khi ghi.';

// ─── /rewind · /resume ───────────────────────────────────────

export function dsCauHoi(muc: readonly MucHienThi[]): Array<{ k: number; text: string }> {
  const ra: Array<{ k: number; text: string }> = [];
  for (const m of muc) if (m.kieu === 'nguoi') ra.push({ k: ra.length + 1, text: m.text });
  return ra;
}

export function moTaDsCauHoi(ds: Array<{ k: number; text: string }>): string {
  if (ds.length === 0) return 'Việc này chưa có câu hỏi nào để quay về.';
  return '**Quay về câu hỏi nào?** Gõ `/rewind <số>` — hội thoại cắt từ câu đó, file agent sửa từ đó trở đi được lùi về như trước câu đó.\n\n'
    + ds.slice(-15).map((c) => `${c.k}. ${c.text.replace(/\s+/g, ' ').slice(0, 90)}${c.text.length > 90 ? '…' : ''}`).join('\n');
}

export function locPhien(ds: readonly AgentPhien[], tuKhoa: string): AgentPhien[] {
  const q = chuanHoa(tuKhoa);
  return ds
    .filter((p) => p.luuTru !== true)
    .filter((p) => !q || chuanHoa(`${p.tieuDe} ${p.duAn ?? ''}`).includes(q))
    .sort((a, b) => (b.ghim === true ? 1 : 0) - (a.ghim === true ? 1 : 0) || b.luucLuc - a.luucLuc)
    .slice(0, 12);
}

/** `/resume 3` → phần tử thứ 3 của danh sách vừa in; `/resume abc` → khớp duy nhất. */
export function chonPhien(ds: readonly AgentPhien[], thamSo: string): AgentPhien | null {
  const t = thamSo.trim();
  if (/^\d+$/.test(t)) return locPhien(ds, '')[Number(t) - 1] ?? null;
  const loc = locPhien(ds, t);
  return loc.length === 1 ? loc[0]! : null;
}

export function moTaDsPhien(ds: readonly AgentPhien[]): string {
  if (ds.length === 0) return 'Không có việc nào khớp.';
  return '**Việc đã lưu** — gõ `/resume <số>` để mở vào tab này:\n\n'
    + ds.map((p, i) => `${i + 1}. ${p.ghim ? '📌 ' : ''}${p.tieuDe || 'Việc chưa đặt tên'}${p.duAn ? ` · \`${p.duAn}\`` : ''} · ${new Date(p.luucLuc).toLocaleDateString('vi-VN')}`).join('\n');
}

// ─── /export ─────────────────────────────────────────────────

/** Hội thoại → Markdown đọc được, kể cả khi mở bằng trình soạn thảo thường. */
export function xuatMarkdown(muc: readonly MucHienThi[], meta: { tieuDe: string; duAn: string | null; luc: Date }): string {
  const ra: string[] = [
    `# ${meta.tieuDe || 'Việc AI Code'}`,
    '',
    `> Xuất từ AI Code lúc ${meta.luc.toLocaleString('vi-VN')}${meta.duAn ? ` · dự án \`${meta.duAn}\`` : ''}`,
    '',
  ];
  let dangDsTool = false;
  const dongDs = (): void => { if (dangDsTool) { ra.push(''); dangDsTool = false; } };
  for (const m of muc) {
    switch (m.kieu) {
      case 'nguoi':
        dongDs();
        ra.push('## Bạn', '', m.text, m.anh?.length ? `\n_(kèm ${m.anh.length} ảnh)_` : '', '');
        break;
      case 'may':
        dongDs();
        ra.push(`## Agent${m.cucBo ? ` (AI trên máy · ${m.cucBo})` : ''}`, '', m.text, '');
        break;
      case 'tool':
        if (!dangDsTool) { ra.push('**Công cụ:**', ''); dangDsTool = true; }
        ra.push(`- \`${m.ten}\`${m.tomTat ? ` — ${m.tomTat.replace(/\n/g, ' ')}` : ''}`);
        break;
      case 'lenhRa':
        dongDs();
        ra.push('```text', m.text.replace(/```/g, 'ˋˋˋ'), '```', '');
        break;
      case 'loi':
        dongDs();
        ra.push(`> ⚠ ${m.text}`, '');
        break;
      default:
        dongDs();
        ra.push(`- _(thẻ duyệt: ${m.kieu}${'xong' in m && m.xong ? ` · ${m.xong === 'dongY' ? 'đã duyệt' : 'đã từ chối'}` : ''})_`, '');
    }
  }
  dongDs();
  return `${ra.filter((d, i, a) => !(d === '' && a[i - 1] === '')).join('\n').trim()}\n`;
}

/** Tên file gợi ý: bỏ dấu, bỏ ký tự cấm, không quá 60. */
export function tenFileXuat(tieuDe: string, luc: Date): string {
  const goc = chuanHoaTen(tieuDe) || 'viec-ai-code';
  const ngay = `${luc.getFullYear()}${String(luc.getMonth() + 1).padStart(2, '0')}${String(luc.getDate()).padStart(2, '0')}`;
  return `${goc.slice(0, 60)}-${ngay}.md`;
}

function chuanHoaTen(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ─── nhãn chế độ quyền (cho /status) ─────────────────────────

export const TEN_CHE_DO: Record<CheDoQuyen, string> = {
  keHoach: 'Kế hoạch (chỉ đọc)', hoi: 'Hỏi từng việc', tuSua: 'Tự sửa file',
  tuSuaVaLenh: 'Tự sửa + lệnh an toàn', boQuaHet: 'Bỏ qua tất cả',
};
