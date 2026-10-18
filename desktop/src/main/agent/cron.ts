/**
 * Biểu thức CRON 5 trường (đợt 4, 18/10/2026) — cho `hen_goi_lai {cron}`.
 *
 * `phút giờ ngày tháng thứ` theo GIỜ MÁY. Hỗ trợ `*`, `*\/n`, `a-b`, `a-b/n`,
 * danh sách `,`, tên tháng/thứ (`jan`…, `mon`…), thứ 0 và 7 đều là Chủ nhật.
 * Như cron chuẩn: ngày-trong-tháng và thứ đều bị giới hạn ⇒ khớp MỘT TRONG HAI.
 * Không hỗ trợ `@reboot`, `L`, `W`, `#` — báo lỗi rõ thay vì hiểu sai.
 */

export interface Cron { phut: Set<number>; gio: Set<number>; ngay: Set<number>; thang: Set<number>; thu: Set<number>; ngayTuDo: boolean; thuTuDo: boolean; nguon: string }

const THANG: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const THU: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const BIET_DANH: Record<string, string> = {
  '@hourly': '0 * * * *', '@daily': '0 0 * * *', '@midnight': '0 0 * * *', '@weekly': '0 0 * * 0', '@monthly': '0 0 1 * *', '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *',
};

function docTruong(tho: string, min: number, max: number, ten: Record<string, number> | null, tenTruong: string): Set<number> | string {
  const ra = new Set<number>();
  for (const phan of tho.toLowerCase().split(',')) {
    if (!phan) return `trường ${tenTruong} có phần rỗng`;
    const [vung, buocTho] = phan.split('/');
    const buoc = buocTho === undefined ? 1 : Number(buocTho);
    if (!Number.isInteger(buoc) || buoc < 1) return `bước "/${buocTho}" ở trường ${tenTruong} không hợp lệ`;
    const so = (x: string): number => (ten && x in ten ? ten[x]! : Number(x));
    let tu: number; let den: number;
    if (vung === '*') { tu = min; den = max; } else if (vung!.includes('-')) {
      const [a, b] = vung!.split('-');
      tu = so(a!); den = so(b!);
    } else { tu = so(vung!); den = buocTho === undefined ? tu : max; }
    if (!Number.isInteger(tu) || !Number.isInteger(den) || tu < min || den > max || tu > den) return `"${phan}" ngoài khoảng ${min}–${max} ở trường ${tenTruong}`;
    for (let v = tu; v <= den; v += buoc) ra.add(v);
  }
  return ra;
}

/** Đọc biểu thức. Sai ⇒ chuỗi lỗi tiếng Việt. */
export function docCron(bieuThuc: string): Cron | string {
  const goc = String(bieuThuc ?? '').trim();
  const s = BIET_DANH[goc.toLowerCase()] ?? goc;
  const p = s.split(/\s+/).filter(Boolean);
  if (p.length !== 5) return `cron cần đúng 5 trường "phút giờ ngày tháng thứ" (vd "*/30 9-17 * * 1-5"), nhận ${p.length}.`;
  if (/[LW#?]/i.test(s.replace(/[a-z]{3}/gi, ''))) return 'cron: không hỗ trợ L/W/#/?.';
  const phut = docTruong(p[0]!, 0, 59, null, 'phút');
  const gio = docTruong(p[1]!, 0, 23, null, 'giờ');
  const ngay = docTruong(p[2]!, 1, 31, null, 'ngày');
  const thang = docTruong(p[3]!, 1, 12, THANG, 'tháng');
  const thuTho = docTruong(p[4]!, 0, 7, THU, 'thứ');
  for (const x of [phut, gio, ngay, thang, thuTho]) if (typeof x === 'string') return `cron: ${x}.`;
  const thu = new Set([...(thuTho as Set<number>)].map((v) => (v === 7 ? 0 : v)));
  return {
    phut: phut as Set<number>, gio: gio as Set<number>, ngay: ngay as Set<number>, thang: thang as Set<number>, thu,
    ngayTuDo: p[2] === '*', thuTuDo: p[4] === '*', nguon: goc,
  };
}

function khopNgay(c: Cron, d: Date): boolean {
  const n = c.ngay.has(d.getDate());
  const t = c.thu.has(d.getDay());
  if (c.ngayTuDo && c.thuTuDo) return true;
  if (c.ngayTuDo) return t;
  if (c.thuTuDo) return n;
  return n || t;
}

/** Lần chạy kế tiếp SAU `tu` (ms epoch, giờ máy). Không có trong 5 năm ⇒ null. */
export function lanKe(c: Cron, tu: number): number | null {
  const d = new Date(tu);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  const het = tu + 5 * 366 * 86_400_000;
  while (d.getTime() <= het) {
    if (!c.thang.has(d.getMonth() + 1)) { d.setMonth(d.getMonth() + 1, 1); d.setHours(0, 0, 0, 0); continue; }
    if (!khopNgay(c, d)) { d.setDate(d.getDate() + 1); d.setHours(0, 0, 0, 0); continue; }
    if (!c.gio.has(d.getHours())) { d.setHours(d.getHours() + 1, 0, 0, 0); continue; }
    if (!c.phut.has(d.getMinutes())) { d.setMinutes(d.getMinutes() + 1, 0, 0); continue; }
    return d.getTime();
  }
  return null;
}

/** Mô tả ngắn cho người dùng (vd "cron 0 9 * * 1-5"). */
export function moTaCron(c: Cron): string { return `cron ${c.nguon}`; }
