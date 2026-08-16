/**
 * ============================================================
 * Kế hoạch theo giờ — robot nhắc việc, hướng dẫn, chấm xong
 * ============================================================
 *
 * Một `MakerPlan` là ĐỊNH NGHĨA ("7 giờ sáng tập thể dục, mỗi ngày").
 * Một `MakerPlanRun` là MỘT LẦN nó xuất hiện, trong đúng một ngày.
 *
 * ⚠️⚠️ MÚI GIỜ LÀ CHỖ TÍNH NĂNG NÀY CHẾT, KHÔNG PHẢI CHỖ NÀO KHÁC.
 *
 * Container chạy UTC (`cron.service.ts` đặt `timezone: 'UTC'` cho mọi
 * việc), người dùng ở +07. Ba cách sai kinh điển, tránh cả ba:
 *
 *   1. Lưu "7 giờ sáng" thành một `DateTime`. Nó thành 00:00Z, rồi một
 *      hôm có người đọc ra theo giờ máy chủ và chuông kêu lúc 2 giờ
 *      chiều. → Ở đây lưu SỐ PHÚT trong ngày + tên múi giờ.
 *   2. Dùng `new Date().getHours()`. Đó là giờ của TIẾN TRÌNH, tức UTC
 *      trong container và +07 trên máy bạn — chạy máy mình thì đúng,
 *      lên prod thì sai, và không lộ ra lúc build. → Ở đây mọi phép
 *      lấy giờ đều đi qua `gioDiaPhuong()`.
 *   3. Cộng trừ 7 tiếng bằng tay. Đúng cho tới lúc đổi múi hay đổi
 *      nước. → `Intl.DateTimeFormat` với `timeZone` làm việc đó đúng.
 *
 * ⚠️ VÀ: "xong rồi" LÀ CÂU MƠ HỒ. Xong việc nào? Hiểu thành "chấm cái
 * đầu tiên khớp" là tích nhầm việc — đúng cái lỗi dự án này đã dính
 * một lần khi dọn dữ liệu thử. Nên có `vuaNhac`: chỉ chấm ĐÚNG việc
 * robot vừa đọc lên. Không rõ thì hỏi lại, không đoán.
 */

import { MakerPlanKind, MakerRunState, type MakerPlan, type MakerPlanRun } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

/**
 * Nhắc muộn tối đa bao nhiêu phút thì vẫn còn nhắc.
 *
 * Có ân xá vì máy chủ có thể vừa deploy xong, robot có thể vừa mất
 * mạng. Không có nó thì lỡ đúng một phút là mất luôn lời nhắc, âm
 * thầm. Có ân xá quá dài thì 7 giờ sáng lại kêu lúc 10 giờ, còn khó
 * chịu hơn — 45 phút là chỗ ở giữa.
 */
export const AN_XA_PHUT = 45;

// ════════════════════════════════════════════════════════════
// Giờ địa phương
// ════════════════════════════════════════════════════════════

export interface MocDiaPhuong {
  /** "2026-08-17" theo múi giờ đã cho. */
  ngay: string;
  /** Số phút kể từ 00:00 địa phương, 0..1439. */
  phut: number;
  /** 0 = Chủ nhật … 6 = Thứ bảy. */
  thu: number;
}

const THU_SO: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

/**
 * Đổi một mốc thời gian tuyệt đối sang ngày/phút/thứ ở múi giờ đã cho.
 *
 * `hourCycle: 'h23'` là bắt buộc: để mặc định thì nửa đêm ra "24" ở một
 * số bản ICU, và `24 * 60 = 1440` — vượt trần, so sánh nào cũng sai, mỗi
 * ngày một lần, đúng lúc không ai thức mà nhìn.
 */
export function gioDiaPhuong(luc: Date, tz: string): MocDiaPhuong {
  let phan: Intl.DateTimeFormatPart[];
  try {
    phan = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      weekday: 'short',
    }).formatToParts(luc);
  } catch {
    // Tên múi giờ rác (người dùng gõ tay, hoặc dữ liệu cũ). Rơi về giờ
    // Việt Nam thay vì ném lỗi — một lời nhắc sai giờ còn hơn cả bộ
    // hẹn giờ đứng im vì một dòng dữ liệu hỏng.
    logger.warn('MakerLab múi giờ không hợp lệ, dùng Asia/Ho_Chi_Minh', { tz });
    return gioDiaPhuong(luc, 'Asia/Ho_Chi_Minh');
  }
  const p: Record<string, string> = {};
  for (const x of phan) p[x.type] = x.value;
  return {
    ngay: `${p.year}-${p.month}-${p.day}`,
    phut: Number(p.hour) * 60 + Number(p.minute),
    thu: THU_SO[p.weekday] ?? 0,
  };
}

/** 435 → "07:15". Dùng cả khi robot đọc lẫn khi web hiện. */
export function docGio(phut: number): string {
  const p = ((phut % 1440) + 1440) % 1440;
  return `${String(Math.floor(p / 60)).padStart(2, '0')}:${String(p % 60).padStart(2, '0')}`;
}

/** "07:15" / "7h15" / "7:5" → 435. `null` nếu không đọc được. */
export function docPhut(s: string): number | null {
  const m = /^\s*(\d{1,2})\s*[:hg.]\s*(\d{1,2})?\s*$/i.exec(s);
  if (!m) return null;
  const gio = Number(m[1]);
  const phut = Number(m[2] ?? 0);
  if (!Number.isInteger(gio) || !Number.isInteger(phut)) return null;
  if (gio > 23 || phut > 59) return null;
  return gio * 60 + phut;
}

// ════════════════════════════════════════════════════════════
// Hôm nay có việc này không
// ════════════════════════════════════════════════════════════

/**
 * Kế hoạch này có rơi vào ngày đó không.
 *
 * `moc` phải là mốc địa phương của CHÍNH kế hoạch đó (`plan.tz`) — mỗi
 * kế hoạch mang múi giờ riêng, nên không được tính một mốc chung rồi
 * dùng cho cả danh sách.
 */
export function ropVaoNgay(plan: Pick<MakerPlan, 'kind' | 'thu' | 'ngayMot'>, moc: MocDiaPhuong): boolean {
  switch (plan.kind) {
    case MakerPlanKind.DAILY:
      return true;
    case MakerPlanKind.WEEKDAYS:
      return moc.thu >= 1 && moc.thu <= 5;
    case MakerPlanKind.WEEKLY:
      return plan.thu.includes(moc.thu);
    case MakerPlanKind.ONCE:
      return plan.ngayMot === moc.ngay;
    default:
      return false;
  }
}

/** Phút đáng lẽ phải nhắc = giờ hẹn trừ đi phần nhắc sớm. */
export function phutNhac(plan: Pick<MakerPlan, 'gio' | 'nhacTruoc'>): number {
  return Math.max(0, plan.gio - plan.nhacTruoc);
}

// ════════════════════════════════════════════════════════════
// Quét: việc nào tới giờ ngay bây giờ
// ════════════════════════════════════════════════════════════

export interface ViecToiHan {
  plan: MakerPlan;
  run: MakerPlanRun;
  /** Nhắc lại do người dùng bấm hoãn, chứ không phải lần đầu. */
  laHoan: boolean;
}

/**
 * Tìm mọi việc tới giờ và CHỐT CHỖ cho chúng bằng một hàng `run`.
 *
 * Hàng `run` sinh ra ngay tại đây, không dựng sẵn cả tháng lúc nửa đêm:
 * dựng sẵn thì một đêm máy chủ chết là hôm sau mất trắng lịch, mà không
 * ai biết cho tới lúc chuông không kêu.
 *
 * `nhacLuc` để RỖNG lúc tạo. Nó chỉ được điền khi robot NÓI RA THẬT —
 * xem `danhDauDaNhac`. Nhờ vậy robot đang offline thì vòng quét sau vẫn
 * thử lại, thay vì coi như đã nhắc rồi và im luôn.
 */
export async function quetToiHan(luc: Date = new Date()): Promise<ViecToiHan[]> {
  const plans = await prisma.makerPlan.findMany({ where: { active: true } });
  if (!plans.length) return [];

  const ra: ViecToiHan[] = [];

  for (const plan of plans) {
    const moc = gioDiaPhuong(luc, plan.tz);
    if (!ropVaoNgay(plan, moc)) continue;

    const can = phutNhac(plan);
    const tre = moc.phut - can;

    const cu = await prisma.makerPlanRun.findUnique({
      // ⚠️ `planId_ngay`, KHÔNG phải `uk_maker_plan_run_day`. Trong
      // schema `@@unique` khai kèm `map:`, mà `map:` chỉ đổi tên
      // constraint DƯỚI DATABASE — khoá bên Prisma Client vẫn là tên
      // ghép mặc định. Dùng nhầm thì lỗi hiện lúc biên dịch, nhưng chỉ
      // vì có TypeScript; ở JS thuần nó lặng lẽ tra hụt.
      where: { planId_ngay: { planId: plan.id, ngay: moc.ngay } },
    });

    // ── Đã hoãn: chỉ tính giờ hoãn, bỏ qua giờ gốc ──
    if (cu?.hoanToi) {
      if (cu.state === MakerRunState.PENDING && luc >= cu.hoanToi) {
        ra.push({ plan, run: cu, laHoan: true });
      }
      continue;
    }

    if (cu && cu.state !== MakerRunState.PENDING) continue; // xong/bỏ qua rồi
    if (cu?.nhacLuc) continue; // đã nói ra rồi, đang đợi người xác nhận

    if (tre < 0) continue; // chưa tới giờ
    if (tre > AN_XA_PHUT) {
      // Quá hạn ân xá mà chưa từng nhắc được ⇒ ghi nhận là LỠ, để web
      // hiện ra. Im lặng bỏ qua thì người dùng không bao giờ biết hôm
      // đó robot đã câm.
      if (cu && !cu.nhacLuc && cu.state === MakerRunState.PENDING) {
        await prisma.makerPlanRun.update({
          where: { id: cu.id },
          data: { state: MakerRunState.MISSED },
        });
      }
      continue;
    }

    const run =
      cu ??
      (await prisma.makerPlanRun.create({
        data: { planId: plan.id, ngay: moc.ngay, state: MakerRunState.PENDING },
      }));
    ra.push({ plan, run, laHoan: false });
  }

  return ra;
}

/**
 * Dọn những lượt còn treo của các NGÀY TRƯỚC.
 *
 * Một lượt đã nhắc mà người dùng không nói gì thì cứ để PENDING suốt
 * ngày hôm đó — họ có thể báo xong lúc tối. Nhưng sang ngày mới thì nó
 * phải chốt lại là LỠ, nếu không danh sách "đang chờ" phình mãi và
 * chẳng còn nghĩa gì.
 */
export async function dongSoNgayCu(luc: Date = new Date()): Promise<number> {
  // Lấy mốc theo múi giờ mặc định: các kế hoạch lệch múi nhau vài giờ
  // thì cũng chỉ lệch một nhịp dọn, không đáng để quét từng cái một.
  const { ngay } = gioDiaPhuong(luc, 'Asia/Ho_Chi_Minh');
  const r = await prisma.makerPlanRun.updateMany({
    where: { state: MakerRunState.PENDING, ngay: { lt: ngay } },
    data: { state: MakerRunState.MISSED },
  });
  return r.count;
}

// ════════════════════════════════════════════════════════════
// Chuyển trạng thái
// ════════════════════════════════════════════════════════════

export async function danhDauDaNhac(runId: number, luc: Date = new Date()): Promise<void> {
  await prisma.makerPlanRun.update({ where: { id: runId }, data: { nhacLuc: luc } });
}

export async function chamXong(runId: number, ghiChu?: string | null): Promise<MakerPlanRun> {
  return prisma.makerPlanRun.update({
    where: { id: runId },
    data: {
      state: MakerRunState.DONE,
      xongLuc: new Date(),
      hoanToi: null,
      ...(ghiChu ? { ghiChu: ghiChu.slice(0, 2000) } : {}),
    },
  });
}

export async function boQua(runId: number, ghiChu?: string | null): Promise<MakerPlanRun> {
  return prisma.makerPlanRun.update({
    where: { id: runId },
    data: {
      state: MakerRunState.SKIPPED,
      hoanToi: null,
      ...(ghiChu ? { ghiChu: ghiChu.slice(0, 2000) } : {}),
    },
  });
}

/**
 * Hoãn N phút.
 *
 * Xoá `nhacLuc` cùng lúc đặt `hoanToi`: `quetToiHan` bỏ qua mọi lượt đã
 * có `nhacLuc`, nên quên xoá thì "hoãn 10 phút" biến thành "thôi khỏi
 * nhắc nữa" — im lặng, và người dùng chỉ phát hiện khi đã lỡ việc.
 */
export async function hoanLai(runId: number, phut: number): Promise<MakerPlanRun> {
  const n = Math.max(1, Math.min(24 * 60, Math.round(phut)));
  return prisma.makerPlanRun.update({
    where: { id: runId },
    data: {
      state: MakerRunState.PENDING,
      hoanToi: new Date(Date.now() + n * 60_000),
      nhacLuc: null,
    },
  });
}

// ════════════════════════════════════════════════════════════
// Đọc: hôm nay có gì
// ════════════════════════════════════════════════════════════

export interface MucHomNay {
  planId: number;
  runId: number | null;
  title: string;
  huongDan: string | null;
  noteId: number | null;
  gio: number;
  gioChu: string;
  state: MakerRunState | 'CHUA_TOI';
  xongLuc: Date | null;
  ghiChu: string | null;
}

/**
 * Toàn bộ kế hoạch của HÔM NAY, đã xếp theo giờ.
 *
 * Gộp hai nguồn: định nghĩa (rơi vào hôm nay không) và lượt thật đã
 * sinh. Việc chưa tới giờ thì chưa có hàng `run`, nên trạng thái của nó
 * là `CHUA_TOI` chứ không phải `PENDING` — hai thứ khác nhau, và người
 * dùng cần phân biệt "sắp tới" với "tới rồi mà chưa làm".
 */
export async function homNay(ownerId: number, luc: Date = new Date()): Promise<MucHomNay[]> {
  const plans = await prisma.makerPlan.findMany({
    where: { ownerId, active: true },
    orderBy: [{ gio: 'asc' }, { sortOrder: 'asc' }],
  });

  const ra: MucHomNay[] = [];
  for (const plan of plans) {
    const moc = gioDiaPhuong(luc, plan.tz);
    if (!ropVaoNgay(plan, moc)) continue;

    const run = await prisma.makerPlanRun.findUnique({
      // ⚠️ `planId_ngay`, KHÔNG phải `uk_maker_plan_run_day`. Trong
      // schema `@@unique` khai kèm `map:`, mà `map:` chỉ đổi tên
      // constraint DƯỚI DATABASE — khoá bên Prisma Client vẫn là tên
      // ghép mặc định. Dùng nhầm thì lỗi hiện lúc biên dịch, nhưng chỉ
      // vì có TypeScript; ở JS thuần nó lặng lẽ tra hụt.
      where: { planId_ngay: { planId: plan.id, ngay: moc.ngay } },
    });

    ra.push({
      planId: plan.id,
      runId: run?.id ?? null,
      title: plan.title,
      huongDan: plan.huongDan,
      noteId: plan.noteId,
      gio: plan.gio,
      gioChu: docGio(plan.gio),
      state: run ? run.state : 'CHUA_TOI',
      xongLuc: run?.xongLuc ?? null,
      ghiChu: run?.ghiChu ?? null,
    });
  }
  return ra.sort((a, b) => a.gio - b.gio);
}

/** Đếm nhanh cho câu "hôm nay xong mấy việc rồi". */
export function tomTat(muc: MucHomNay[]): { tong: number; xong: number; conLai: number; loQua: number } {
  const xong = muc.filter((m) => m.state === MakerRunState.DONE).length;
  const loQua = muc.filter((m) => m.state === MakerRunState.MISSED).length;
  return { tong: muc.length, xong, conLai: muc.length - xong - loQua, loQua };
}

// ════════════════════════════════════════════════════════════
// "Xong rồi" — việc nào?
// ════════════════════════════════════════════════════════════
//
// Nhớ trong bộ nhớ tiến trình trước, tra DB sau. Bộ nhớ mất khi restart
// nên KHÔNG được là nguồn duy nhất; DB thì luôn đúng nhưng không biết
// robot vừa đọc cái nào nếu trong ngày có nhiều việc cùng treo.

const _vuaNhac = new Map<number, { runId: number; luc: number }>();

/** Robot vừa đọc lượt này cho thiết bị đó nghe. */
export function ghiVuaNhac(deviceId: number, runId: number): void {
  _vuaNhac.set(deviceId, { runId, luc: Date.now() });
}

/** Quên đi — đã xử lý xong, hoặc đã quá cũ để mà "xong rồi" trỏ vào. */
export function quenVuaNhac(deviceId: number): void {
  _vuaNhac.delete(deviceId);
}

/** Câu "xong rồi" mà không nói tên việc thì trỏ vào lượt này bao lâu. */
const HAN_VUA_NHAC_MS = 30 * 60_000;

export interface DoanViec {
  run: MakerPlanRun & { plan: MakerPlan };
  /** `vua-nhac` chắc chắn nhất; `duy-nhat` là suy ra; `mo-ho` thì phải hỏi lại. */
  vi: 'vua-nhac' | 'duy-nhat' | 'khop-ten';
}

/**
 * "Xong rồi" thì là xong việc nào.
 *
 * Ba tầng, chặt trước lỏng sau. Không tầng nào khớp ⇒ trả `null`, và
 * bên gọi PHẢI hỏi lại chứ không được chấm bừa — chấm nhầm một việc là
 * làm hỏng đúng thứ mà người dùng nhờ mình giữ.
 */
export async function doanViec(
  ownerId: number,
  deviceId: number | null,
  cauNoi: string,
  luc: Date = new Date(),
): Promise<DoanViec | null> {
  // 1. Việc robot vừa đọc lên, còn trong hạn.
  if (deviceId != null) {
    const v = _vuaNhac.get(deviceId);
    if (v && Date.now() - v.luc <= HAN_VUA_NHAC_MS) {
      const run = await prisma.makerPlanRun.findUnique({
        where: { id: v.runId },
        include: { plan: true },
      });
      if (run && run.state === MakerRunState.PENDING && run.plan.ownerId === ownerId) {
        return { run, vi: 'vua-nhac' };
      }
    }
  }

  const treo = await danhSachTreo(ownerId, luc);
  if (!treo.length) return null;

  // 2. Người dùng gọi tên việc: "xong bài tập rồi". So bằng cách tìm
  //    chuỗi con đã bỏ dấu — gõ đúng chính tả có dấu là chuyện của bàn
  //    phím, còn đây là chữ do bộ nghe chép ra.
  const noi = boDau(cauNoi);
  const khop = treo.filter((r) => {
    const t = boDau(r.plan.title);
    return t.length >= 3 && noi.includes(t);
  });
  if (khop.length === 1) return { run: khop[0], vi: 'khop-ten' };

  // 3. Chỉ còn đúng một việc đang treo ⇒ không thể nhầm vào đâu được.
  if (treo.length === 1) return { run: treo[0], vi: 'duy-nhat' };

  return null;
}

/** Mọi lượt hôm nay còn đang chờ xác nhận, mới nhất trước. */
export async function danhSachTreo(
  ownerId: number,
  luc: Date = new Date(),
): Promise<Array<MakerPlanRun & { plan: MakerPlan }>> {
  const { ngay } = gioDiaPhuong(luc, 'Asia/Ho_Chi_Minh');
  return prisma.makerPlanRun.findMany({
    where: { ngay, state: MakerRunState.PENDING, plan: { ownerId } },
    include: { plan: true },
    orderBy: { id: 'desc' },
  });
}

function boDau(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
